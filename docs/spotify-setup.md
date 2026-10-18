# Spotify Music

Music displays up to 20 recently saved tracks. Only the owner connects Spotify; visitors do not authenticate. The only OAuth scope is `user-library-read`.

## Local connection

1. Register `http://127.0.0.1:3000/api/spotify/callback` in the Spotify application.
2. Run `pnpm dev --hostname 127.0.0.1 --port 3000`.
3. Visit `http://127.0.0.1:3000/music`, choose Connect Spotify, and authorize the library permission.

The Client ID can be overridden with `SPOTIFY_CLIENT_ID`. PKCE does not require a Client Secret. The callback verifies a short-lived state cookie and code verifier before exchanging the authorization code.

The refresh token is stored in `.spotify/session.json` with owner-only file permissions. This directory is ignored by Git. Do not copy its contents into chat, screenshots, logs, or commits. Access tokens are not sent to visitors. Reconnecting invalidates the music cache. Library results refresh on the next visit after five minutes, rather than through a background job.

For failed connections, check the exact redirect URI, Spotify Premium requirement, the development-mode user allowlist, and the granted permission. Authorization routes return 404 outside development mode and require the exact loopback host. The connection POST rejects other origins.

## Deployment limitation

The current connection flow is for local development. Production does not read the local token file or expose setup routes. Before enabling Music in production, configure a durable server-side secret store for the refresh token and any replacement token Spotify issues. `SPOTIFY_REFRESH_TOKEN` can supply an initial token, but environment variables alone cannot persist token rotation. The app reports unavailable music rather than discarding a rotated credential. Never prefix tokens with `NEXT_PUBLIC_`.

No playback, library modifications, or background scheduler is included.
