# Spotify Music

Music displays a Spotify playlist widget. The managed public playlist, `vafedev · On repeat`, mirrors up to 25 recently saved tracks. Only the owner connects Spotify; visitors do not authenticate. OAuth scopes are `user-library-read` and `playlist-modify-public`.

## Local connection

1. Register `http://127.0.0.1:3000/api/spotify/callback` in the Spotify application.
2. Run `pnpm dev --hostname 127.0.0.1 --port 3000`.
3. Visit `http://127.0.0.1:3000/music`, choose Connect Spotify, and authorize the library permission.

The Client ID can be overridden with `SPOTIFY_CLIENT_ID`. PKCE does not require a Client Secret. The callback verifies a short-lived state cookie and code verifier before exchanging the authorization code.

The refresh token is stored in `.spotify/session.json` with owner-only file permissions. Playlist identity and sync state live in `.spotify/playlist.json`. This directory is ignored by Git. Do not copy token contents into chat, screenshots, logs, or commits. Access tokens are not sent to visitors. The playlist is created only during an authorized callback; the ID is persisted before adding songs. Sync checks run on visits after five minutes and replace items only if the saved selection changes. Concurrent syncs are blocked by a local lock. The stored owner and playlist name are checked before modifying items. Do not manually curate this managed playlist, because sync replaces its contents.

If creation has an unknown network outcome, inspect Spotify before reconnecting to avoid duplicate playlists. A lock left by an interrupted process requires local recovery before syncing again. Renaming or deleting the managed playlist stops synchronization rather than silently switching to another playlist.

For failed connections, check the exact redirect URI, Spotify Premium requirement, the development-mode user allowlist, and the granted permission. Authorization routes return 404 outside development mode and require the exact loopback host. The connection POST rejects other origins.

## Deployment limitation

The current connection and sync flow is for local development. Production does not read the local token file or expose setup routes. Before enabling Music in production, configure a durable server-side secret store for token rotation, durable playlist metadata, and a scheduled sync. `SPOTIFY_REFRESH_TOKEN` and `SPOTIFY_SCOPES` can supply initial credentials, but environment variables alone cannot persist rotation. Never prefix tokens with `NEXT_PUBLIC_`.

Playback is handled by the Spotify widget. No liked-song modifications or background scheduler is included.
