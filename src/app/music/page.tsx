import Image from "next/image";
import { unstable_cache } from "next/cache";
import { fetchLikedSongs } from "@/lib/spotify";

export const dynamic = "force-dynamic";
export const metadata = { title: "Music", description: "My latest liked songs on Spotify." };
const likedSongs = unstable_cache(fetchLikedSongs, ["spotify-liked-songs"], { revalidate: 300, tags: ["spotify-library"] });

export default async function MusicPage({ searchParams }: { searchParams: Promise<{ connection?: string }> }) {
  const { connection } = await searchParams;
  let songs = null;
  let failed = false;
  try { songs = await likedSongs(); } catch { failed = true; }
  const local = process.env.NODE_ENV === "development";
  return (
    <section className="music-page">
      <p className="eyebrow">Library / Music</p><h1>Music</h1>
      <p className="books-intro">The latest additions to my Liked Songs on Spotify.</p>
      {local && (!songs || failed || connection === "failed") ? <aside className="books-preview-note">
        <p>{connection === "failed" || failed ? "Connection failed or expired. Check the Spotify app settings and try again." : "Connect Spotify to display your 20 most recently liked songs. These songs will be visible to visitors."}</p>
        <form action="http://127.0.0.1:3000/api/spotify/connect" method="post"><button type="submit" className="theme-toggle">Connect Spotify</button></form>
        <p>Open this page at <a href="http://127.0.0.1:3000/music">127.0.0.1:3000/music</a> before connecting.</p>
      </aside> : null}
      {songs?.length ? <ul className="music-tracks">{songs.map((song) => <li key={song.id}>
        <a href={song.url} target="_blank" rel="noopener noreferrer">
          {song.image ? <Image src={song.image} alt="" width={64} height={64} unoptimized /> : <span className="music-art-placeholder" aria-hidden="true" />}
          <span><strong>{song.name}</strong><span>{song.artist}</span></span><span aria-hidden="true">↗</span>
        </a>
      </li>)}</ul> : <p className="empty-state">{failed ? "Music is temporarily unavailable. Please check back later." : songs ? "No liked songs to share yet." : "My music selection will be here soon."}</p>}
      <p className="music-credit">Music and artwork provided by Spotify. Open a song to listen on Spotify.</p>
    </section>
  );
}
