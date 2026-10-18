"use client";

import Image from "next/image";
import { useState } from "react";

type Song = { id: string; name: string; artist: string; image?: string; url: string };

export function MusicPlayer({ songs }: { songs: Song[] }) {
  const [selectedId, setSelectedId] = useState(songs[0]?.id);
  const selected = songs.find((song) => song.id === selectedId) ?? songs[0];
  if (!selected) return null;

  return (
    <>
      <div className="music-player">
        <p className="music-credit" aria-live="polite">Selected: {selected.name} · {selected.artist}</p>
        <iframe
          key={selected.id}
          title={`Spotify player: ${selected.name} by ${selected.artist}`}
          src={`https://open.spotify.com/embed/track/${encodeURIComponent(selected.id)}?utm_source=generator`}
          width="100%" height="152" frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
        />
        <p className="music-credit">Choose a song below, then press play in Spotify’s player. Playback availability depends on Spotify.</p>
      </div>
      <ul className="music-tracks">
        {songs.map((song) => (
          <li key={song.id}>
            <button type="button" className="music-select" aria-pressed={song.id === selected.id} onClick={() => setSelectedId(song.id)} aria-label={`Select ${song.name} by ${song.artist}`}>
              {song.image ? <Image src={song.image} alt="" width={64} height={64} unoptimized /> : <span className="music-art-placeholder" aria-hidden="true" />}
              <span><strong>{song.name}</strong><span>{song.artist}</span></span>
              <span className="music-selection-label" aria-hidden="true">{song.id === selected.id ? "Selected" : "Listen"}</span>
            </button>
            <a className="music-external" href={song.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${song.name} on Spotify`}>↗</a>
          </li>
        ))}
      </ul>
    </>
  );
}
