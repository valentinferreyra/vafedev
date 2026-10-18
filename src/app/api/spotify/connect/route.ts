import { NextRequest, NextResponse } from "next/server";
import { createSpotifyAuthorization, isLocalSpotifySetup } from "@/lib/spotify";

export async function POST(request: NextRequest) {
  if (!isLocalSpotifySetup(`${request.nextUrl.protocol}//${request.headers.get("host")}`)) return new NextResponse(null, { status: 404 });
  if (request.headers.get("origin") !== "http://127.0.0.1:3000") return new NextResponse(null, { status: 403 });
  const auth = createSpotifyAuthorization();
  const response = NextResponse.redirect(auth.url, 303);
  for (const [name, value] of [["spotify-state", auth.state], ["spotify-verifier", auth.verifier]]) {
    response.cookies.set(name, value, { httpOnly: true, sameSite: "lax", path: "/api/spotify", maxAge: 600 });
  }
  response.headers.set("Cache-Control", "no-store");
  return response;
}
