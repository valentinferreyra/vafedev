import { createHash, randomBytes } from "node:crypto";
import { mkdir, readFile, writeFile, rename } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

export const spotifyClientId = process.env.SPOTIFY_CLIENT_ID ?? "f6ffa64d499b4afca49d846535755103";
export const spotifyRedirect = "http://127.0.0.1:3000/api/spotify/callback";
const tokenPath = path.join(process.cwd(), ".spotify", "session.json");
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
  url.search = new URLSearchParams({ client_id: spotifyClientId, response_type: "code", redirect_uri: spotifyRedirect, scope: "user-library-read", state, code_challenge_method: "S256", code_challenge: challenge }).toString();
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

export async function saveLocalSpotifyToken(refreshToken: string) {
  if (process.env.NODE_ENV !== "development") throw new Error("Local setup is disabled.");
  await mkdir(path.dirname(tokenPath), { recursive: true, mode: 0o700 });
  const temporary = `${tokenPath}.${randomBytes(8).toString("hex")}.tmp`;
  await writeFile(temporary, JSON.stringify({ refresh_token: refreshToken }), { mode: 0o600 });
  await rename(temporary, tokenPath);
}

async function readRefreshToken() {
  if (process.env.SPOTIFY_REFRESH_TOKEN) return process.env.SPOTIFY_REFRESH_TOKEN;
  if (process.env.NODE_ENV !== "development") return null;
  try {
    const data = z.object({ refresh_token: z.string().min(1) }).parse(JSON.parse(await readFile(tokenPath, "utf8")));
    return data.refresh_token;
  } catch { return null; }
}

export function parseSavedTracks(data: unknown) {
  return trackSchema.parse(data).items.filter((item) => item.track !== null)
    .sort((a, b) => b.added_at.localeCompare(a.added_at)).slice(0, 20)
    .map(({ track }) => ({ id: track!.id, name: track!.name, artist: track!.artists.map(({ name }) => name).join(", "), image: track!.album.images[0]?.url, url: track!.external_urls.spotify }));
}

export async function fetchLikedSongs() {
  const refresh = await readRefreshToken();
  if (!refresh) return null;
  const token = await requestSpotifyToken({ grant_type: "refresh_token", refresh_token: refresh });
  if (token.refresh_token && token.refresh_token !== refresh) {
    // shortcut: production refresh-token rotation needs a durable secret store before deployment.
    if (process.env.NODE_ENV === "development") await saveLocalSpotifyToken(token.refresh_token);
    else throw new Error("Spotify needs reconnection.");
  }
  const response = await fetch("https://api.spotify.com/v1/me/tracks?limit=20", {
    headers: { Authorization: `Bearer ${token.access_token}` }, cache: "no-store", signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error("Spotify library is temporarily unavailable.");
  return parseSavedTracks(await response.json());
}
