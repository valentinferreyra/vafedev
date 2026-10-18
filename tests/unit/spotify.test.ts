// @vitest-environment node
import { afterEach, expect, it, vi } from "vitest";
import { createHash } from "node:crypto";
import { NextRequest } from "next/server";
import { createSpotifyAuthorization, isLocalSpotifySetup, parseSavedTracks, requestSpotifyToken } from "@/lib/spotify";
import { POST } from "@/app/api/spotify/connect/route";
import { GET } from "@/app/api/spotify/callback/route";

afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

it("uses unpredictable state and a matching PKCE challenge with only library read access", () => {
  const auth = createSpotifyAuthorization();
  const query = new URL(auth.url).searchParams;
  expect(query.get("code_challenge")).toBe(createHash("sha256").update(auth.verifier).digest("base64url"));
  expect(query.get("scope")).toBe("user-library-read");
  expect(query.get("state")).toBe(auth.state);
  expect(createSpotifyAuthorization().state).not.toBe(auth.state);
});

it("disables setup in production and outside the exact local origin", () => {
  vi.stubEnv("NODE_ENV", "production");
  expect(isLocalSpotifySetup("http://127.0.0.1:3000/music")).toBe(false);
  vi.stubEnv("NODE_ENV", "development");
  expect(isLocalSpotifySetup("https://vafedev.me/music")).toBe(false);
  expect(isLocalSpotifySetup("http://127.0.0.1:3000/music")).toBe(true);
});

it("rejects cross-origin connection attempts", async () => {
  vi.stubEnv("NODE_ENV", "development");
  const response = await POST(new NextRequest("http://127.0.0.1:3000/api/spotify/connect", { method: "POST", headers: { host: "127.0.0.1:3000", origin: "https://example.com" } }));
  expect(response.status).toBe(403);
});

it("sets HTTP-only expiring PKCE cookies for a local connection", async () => {
  vi.stubEnv("NODE_ENV", "development");
  const response = await POST(new NextRequest("http://127.0.0.1:3000/api/spotify/connect", { method: "POST", headers: { host: "127.0.0.1:3000", origin: "http://127.0.0.1:3000" } }));
  expect(response.status).toBe(303);
  expect(response.cookies.get("spotify-verifier")?.httpOnly).toBe(true);
  expect(response.cookies.get("spotify-state")?.maxAge).toBe(600);
});

it("does not leak Spotify error payloads", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("sensitive payload", { status: 400 })));
  await expect(requestSpotifyToken({ grant_type: "refresh_token", refresh_token: "private" })).rejects.toThrow("Spotify authorization failed. Please reconnect.");
});

it("rejects a callback with mismatched state without contacting Spotify", async () => {
  vi.stubEnv("NODE_ENV", "development");
  const fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
  const response = await GET(new NextRequest("http://127.0.0.1:3000/api/spotify/callback?code=example&state=wrong", { headers: { host: "127.0.0.1:3000", cookie: "spotify-state=expected; spotify-verifier=private" } }));
  expect(response.headers.get("location")).toBe("http://127.0.0.1:3000/music?connection=failed");
  expect(fetchMock).not.toHaveBeenCalled();
  expect(response.cookies.get("spotify-verifier")?.maxAge).toBe(0);
});

it("filters unavailable tracks and returns at most 20 public song records", () => {
  const item = { added_at: "2026-10-18", track: { id: "one", name: "Song", artists: [{ name: "Artist" }], album: { images: [] }, external_urls: { spotify: "https://open.spotify.com/track/one" } } };
  const songs = parseSavedTracks({ items: [{ added_at: "2026-10-18", track: null }, ...Array.from({ length: 25 }, () => item)] });
  expect(songs).toHaveLength(20);
  expect(songs[0]).toEqual({ id: "one", name: "Song", artist: "Artist", url: "https://open.spotify.com/track/one", image: undefined });
  expect(() => parseSavedTracks({ items: [{}] })).toThrow();
});
