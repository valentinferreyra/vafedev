import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getSpotifyPlaylist, isLocalSpotifySetup, requestSpotifyToken, saveLocalSpotifyToken, spotifyRedirect, spotifyScopes } from "@/lib/spotify";

export async function GET(request: NextRequest) {
  if (!isLocalSpotifySetup(`${request.nextUrl.protocol}//${request.headers.get("host")}`)) return new NextResponse(null, { status: 404 });
  const query = request.nextUrl.searchParams;
  const state = request.cookies.get("spotify-state")?.value;
  const verifier = request.cookies.get("spotify-verifier")?.value;
  const response = NextResponse.redirect(new URL("/music", spotifyRedirect), 303);
  response.cookies.set("spotify-state", "", { path: "/api/spotify", maxAge: 0 });
  response.cookies.set("spotify-verifier", "", { path: "/api/spotify", maxAge: 0 });
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  if (!state || !verifier || state !== query.get("state") || !query.get("code") || query.has("error")) {
    response.headers.set("Location", new URL("/music?connection=failed", spotifyRedirect).toString());
    return response;
  }
  try {
    const token = await requestSpotifyToken({ grant_type: "authorization_code", code: query.get("code")!, redirect_uri: spotifyRedirect, code_verifier: verifier });
    if (!token.refresh_token || !spotifyScopes.split(" ").every((scope) => token.scope?.split(" ").includes(scope))) throw new Error("Missing permission");
    await saveLocalSpotifyToken(token.refresh_token, token.scope);
    await getSpotifyPlaylist(true);
    revalidateTag("spotify-library", { expire: 0 });
  } catch {
    response.headers.set("Location", new URL("/music?connection=failed", spotifyRedirect).toString());
  }
  return response;
}
