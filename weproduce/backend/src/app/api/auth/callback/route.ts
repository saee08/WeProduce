import { type NextRequest, NextResponse } from "next/server";

/**
 * Google redirects here after consent (since GOOGLE_REDIRECT_URI points at
 * this route). We don't exchange the code server-side here — instead we
 * hand the `code` off to the mobile app via its deep link scheme, and the
 * app completes the exchange by calling POST /api/auth/login with it.
 * This keeps the flow compatible with Expo's AuthSession proxy pattern.
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const error = request.nextUrl.searchParams.get("error");

  const deepLink = new URL("weproduce://auth-callback");
  if (code) deepLink.searchParams.set("code", code);
  if (error) deepLink.searchParams.set("error", error);

  return NextResponse.redirect(deepLink.toString());
}
