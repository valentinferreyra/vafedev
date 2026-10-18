import { createHash, randomBytes } from "node:crypto";
import { mkdir, readFile, writeFile, rename, open, unlink } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

export const spotifyClientId = process.env.SPOTIFY_CLIENT_ID ?? "f6ffa64d499b4afca49d846535755103";
export const spotifyRedirect = "http://127.0.0.1:3000/api/spotify/callback";
const tokenPath = path.join(process.cwd(), ".spotify", "session.json");
const sessionSchema = z.object({ refresh_token: z.string().min(1), scope: z.string().optional() });
const playlistPath = path.join(process.cwd(), ".spotify", "playlist.json");
const playlistSchema = z.object({ id: z.string().regex(/^[A-Za-z0-9]+$/), ownerId: z.string(), uris: z.array(z.string()), syncedAt: z.number() });
export const spotifyScopes = "user-library-read playlist-modify-public";
const tokenSchema = z.object({ access_token: z.string().min(1), refresh_token: z.string().min(1).optional(), scope: z.string().optional() });
const trackSchema = z.object({
  items: z.array(z.object({
    added_at: z.string(),
    track: z.object({
      id: z.string(), name: z.string(),
      artists: z.array(z.object({ name: z.string() })),
      album: z.object({ images: z.array(z.object({ url: z.string().url() })) }),
      external_urls: z.object({ spotify: z.string().url() }),
    }).nullable(),
  })),
});

export function isLocalSpotifySetup(url: string) {
  return process.env.NODE_ENV === "development" && new URL(url).origin === "http://127.0.0.1:3000";
}

export function createSpotifyAuthorization() {
  const verifier = randomBytes(48).toString("base64url");
  const state = randomBytes(32).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  const url = new URL("https://accounts.spotify.com/authorize");
  url.search = new URLSearchParams({ client_id: spotifyClientId, response_type: "code", redirect_uri: spotifyRedirect, scope: spotifyScopes, state, code_challenge_method: "S256", code_challenge: challenge }).toString();
  return { verifier, state, url: url.toString() };
}

export async function requestSpotifyToken(params: Record<string, string>) {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ ...params, client_id: spotifyClientId }),
    cache: "no-store", signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error("Spotify authorization failed. Please reconnect.");
  return tokenSchema.parse(await response.json());
}

export async function saveLocalSpotifyToken(refreshToken: string, scope?: string) {
  if (process.env.NODE_ENV !== "development") throw new Error("Local setup is disabled.");
  await mkdir(path.dirname(tokenPath), { recursive: true, mode: 0o700 });
  const temporary = `${tokenPath}.${randomBytes(8).toString("hex")}.tmp`;
  const previous = await readSession();
  await writeFile(temporary, JSON.stringify({ refresh_token: refreshToken, scope: scope ?? previous?.scope }), { mode: 0o600 });
  await rename(temporary, tokenPath);
}

async function readSession() {
  if (process.env.SPOTIFY_REFRESH_TOKEN) return { refresh_token: process.env.SPOTIFY_REFRESH_TOKEN, scope: process.env.SPOTIFY_SCOPES };
  if (process.env.NODE_ENV !== "development") return null;
  try {
    return sessionSchema.parse(JSON.parse(await readFile(tokenPath, "utf8")));
  } catch { return null; }
}

export function parseSavedTracks(data: unknown) {
  return trackSchema.parse(data).items.filter((item) => item.track !== null)
    .sort((a, b) => b.added_at.localeCompare(a.added_at)).slice(0, 25)
    .map(({ track }) => ({ id: track!.id, name: track!.name, artist: track!.artists.map(({ name }) => name).join(", "), image: track!.album.images[0]?.url, url: track!.external_urls.spotify }));
}

async function playlistRequest(accessToken: string, endpoint: string, method = "GET", body?: unknown) {
  const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    method, headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body), cache: "no-store", signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error("Spotify playlist synchronization failed.");
  return response.json();
}

export async function replacePlaylistSongs(accessToken: string, playlistId: string, ids: string[]) {
  const id = z.string().regex(/^[A-Za-z0-9]+$/).parse(playlistId);
  const tracks = z.array(z.string().regex(/^[A-Za-z0-9]+$/)).max(25).parse(ids);
  await playlistRequest(accessToken, `/playlists/${id}/items`, "PUT", { uris: tracks.map((track) => `spotify:track:${track}`) });
}

export async function getSpotifyPlaylist(allowCreate = false) {
  // shortcut: local sync runs on visits; production needs a durable store and scheduled job.
  if (process.env.NODE_ENV !== "development") return null;
  const session = await readSession();
  if (!session?.scope?.split(" ").includes("playlist-modify-public")) return null;
  await mkdir(path.dirname(playlistPath), { recursive: true, mode: 0o700 });
  const lockPath = path.join(path.dirname(playlistPath), "playlist.lock");
  const lock = await open(lockPath, "wx", 0o600).catch(() => null);
  if (!lock) throw new Error("Playlist sync already in progress.");
  try {
    let playlist: z.infer<typeof playlistSchema> | null = null;
    try { playlist = playlistSchema.parse(JSON.parse(await readFile(playlistPath, "utf8"))); }
    catch (error) { if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw new Error("Playlist configuration needs attention."); }
    if (!playlist && !allowCreate) return null;
    if (playlist && Date.now() - playlist.syncedAt < 300000) return playlist.id;
    const token = await requestSpotifyToken({ grant_type: "refresh_token", refresh_token: session.refresh_token });
    if (token.refresh_token) await saveLocalSpotifyToken(token.refresh_token, token.scope);
    const owner = z.object({ id: z.string() }).parse(await playlistRequest(token.access_token, "/me"));
    if (playlist && playlist.ownerId !== owner.id) throw new Error("Playlist owner mismatch.");
    if (!playlist) {
      const created = z.object({ id: z.string().regex(/^[A-Za-z0-9]+$/) }).parse(await playlistRequest(token.access_token, "/me/playlists", "POST", {
        name: "vafedev · On repeat", public: true, description: "My 25 most recently liked songs. Managed by vafedev.me; contents are replaced during synchronization.",
      }));
      playlist = { id: created.id, ownerId: owner.id, uris: [], syncedAt: 0 };
      await writeFile(playlistPath, JSON.stringify(playlist), { mode: 0o600 });
    }
    const actual = z.object({ owner: z.object({ id: z.string() }), name: z.string() }).parse(await playlistRequest(token.access_token, `/playlists/${playlist.id}?fields=owner(id),name`));
    if (actual.owner.id !== owner.id || !["vafedev · On repeat", "vafedev · on repeat"].includes(actual.name)) throw new Error("Managed playlist changed. Sync stopped.");
    const songs = parseSavedTracks(await playlistRequest(token.access_token, "/me/tracks?limit=25"));
    const uris = songs.map((song) => `spotify:track:${song.id}`);
    if (JSON.stringify(uris) !== JSON.stringify(playlist.uris)) await replacePlaylistSongs(token.access_token, playlist.id, songs.map((song) => song.id));
    const temporary = `${playlistPath}.tmp`;
    await writeFile(temporary, JSON.stringify({ ...playlist, uris, syncedAt: Date.now() }), { mode: 0o600 });
    await rename(temporary, playlistPath);
    return playlist.id;
  } finally { await lock.close(); await unlink(lockPath); }
}
