// @vitest-environment node
import { afterEach, expect, it, vi } from "vitest";
import { getSpotifyPlaylist } from "@/lib/spotify";
import { readFile, writeFile } from "node:fs/promises";

vi.mock("node:fs/promises", () => ({
  mkdir: vi.fn(), readFile: vi.fn(), writeFile: vi.fn(), rename: vi.fn(), unlink: vi.fn(),
  open: vi.fn(async () => ({ close: vi.fn() })),
}));
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.clearAllMocks(); });
function setup() {
  vi.stubEnv("NODE_ENV", "development");
  vi.stubEnv("SPOTIFY_REFRESH_TOKEN", "private");
  vi.stubEnv("SPOTIFY_SCOPES", "user-library-read playlist-modify-public");
}
function mockFetch(payloads: unknown[]) {
  const mock = vi.fn();
  for (const payload of payloads) mock.mockResolvedValueOnce(new Response(JSON.stringify(payload)));
  vi.stubGlobal("fetch", mock);
  return mock;
}

it("requires renewed authorization before creating or updating playlists", async () => {
  setup(); vi.stubEnv("SPOTIFY_SCOPES", "user-library-read");
  const mock = mockFetch([]);
  expect(await getSpotifyPlaylist(true)).toBeNull();
  expect(mock).not.toHaveBeenCalled();
});

it("creates a public managed playlist only during explicit setup, then fills it", async () => {
  setup();
  vi.mocked(readFile).mockRejectedValue(Object.assign(new Error("missing"), { code: "ENOENT" }));
  const mock = mockFetch([
    { access_token: "access" }, { id: "owner" }, { id: "playlist123" },
    { owner: { id: "owner" }, name: "vafedev · On repeat" },
    { items: [{ added_at: "2026-10-18", track: { id: "song1", name: "Song", artists: [], album: { images: [] }, external_urls: { spotify: "https://open.spotify.com/track/song1" } } }] },
    { snapshot_id: "new" },
  ]);
  expect(await getSpotifyPlaylist(true)).toBe("playlist123");
  expect(mock.mock.calls.some(([url]) => url === "https://api.spotify.com/v1/me/tracks?limit=25")).toBe(true);
  const creation = mock.mock.calls.find(([url]) => url.endsWith("/me/playlists"));
  expect(JSON.parse(creation![1].body)).toMatchObject({ name: "vafedev · On repeat", public: true });
  expect(mock.mock.calls.at(-1)![0]).toBe("https://api.spotify.com/v1/playlists/playlist123/items");
  expect(writeFile).toHaveBeenCalledWith(expect.stringContaining("playlist.json"), expect.stringContaining("playlist123"), { mode: 0o600 });
});

it("syncs the existing managed playlist with its lowercase name", async () => {
  setup();
  vi.mocked(readFile).mockResolvedValue(JSON.stringify({ id: "playlist123", ownerId: "owner", uris: [], syncedAt: 0 }));
  const mock = mockFetch([
    { access_token: "access" }, { id: "owner" },
    { owner: { id: "owner" }, name: "vafedev · on repeat" },
    { items: Array.from({ length: 25 }, (_, index) => ({ added_at: "2026-10-18", track: { id: `song${index}`, name: "Song", artists: [], album: { images: [] }, external_urls: { spotify: `https://open.spotify.com/track/song${index}` } } })) },
    { snapshot_id: "new" },
  ]);
  expect(await getSpotifyPlaylist()).toBe("playlist123");
  const update = mock.mock.calls.find(([, init]) => init.method === "PUT");
  expect(update![0]).toBe("https://api.spotify.com/v1/playlists/playlist123/items");
  expect(JSON.parse(update![1].body).uris).toHaveLength(25);
});

it("does not update a playlist belonging to a different account", async () => {
  setup();
  vi.mocked(readFile).mockResolvedValue(JSON.stringify({ id: "playlist123", ownerId: "other", uris: [], syncedAt: 0 }));
  const mock = mockFetch([{ access_token: "access" }, { id: "owner" }]);
  await expect(getSpotifyPlaylist()).rejects.toThrow("Playlist owner mismatch.");
  expect(mock.mock.calls.every(([, init]) => init?.method !== "PUT")).toBe(true);
});

it("serves the saved playlist without API calls inside the five-minute interval", async () => {
  setup();
  vi.mocked(readFile).mockResolvedValue(JSON.stringify({ id: "playlist123", ownerId: "owner", uris: [], syncedAt: Date.now() }));
  const mock = mockFetch([]);
  expect(await getSpotifyPlaylist()).toBe("playlist123");
  expect(mock).not.toHaveBeenCalled();
});
