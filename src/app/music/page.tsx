import { getSpotifyPlaylist } from "@/lib/spotify";

export const dynamic = "force-dynamic";
export const metadata = { title: "Music", description: "My latest liked songs on Spotify." };

export default async function MusicPage({ searchParams }: { searchParams: Promise<{ connection?: string }> }) {
  const { connection } = await searchParams;
  let playlistId = null;
  let failed = false;
  try { playlistId = await getSpotifyPlaylist(); } catch { failed = true; }
  const local = process.env.NODE_ENV === "development";
  return (
    <section className="music-page">
      <p className="eyebrow">Library / Music</p><h1>Music</h1>
      {local && (!playlistId || failed || connection === "failed") ? <aside className="books-preview-note">
        <p>{connection === "failed" || failed ? "Playlist synchronization needs attention. Check the Spotify app settings or reconnect." : "Authorize Spotify to create the public playlist vafedev · On repeat and keep it synced with your 25 most recently liked songs. Only this managed playlist will be updated."}</p>
        <form action="http://127.0.0.1:3000/api/spotify/connect" method="post"><button type="submit" className="theme-toggle">Connect Spotify</button></form>
        <p>Open this page at <a href="http://127.0.0.1:3000/music">127.0.0.1:3000/music</a> before connecting.</p>
      </aside> : null}
      {playlistId ? <iframe className="spotify-playlist-widget" title="vafedev · On repeat on Spotify" src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator`} width="100%" height="600" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" allowFullScreen /> : <p className="empty-state">{failed ? "Music is temporarily unavailable. Please check back later." : "My music selection will be here soon."}</p>}
    </section>
  );
}
