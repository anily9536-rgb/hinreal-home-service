
import { NextRequest, NextResponse } from "next/server";

const protectedPrefixes = ["/category", "/property"];

async function checkSession(request: NextRequest) {
  const accessToken = request.cookies.get("rhs_access_token")?.value;
  const refreshToken = request.cookies.get("rhs_refresh_token")?.value;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || (!accessToken && !refreshToken)) {
    return null;
  }

  if (accessToken) {
    try {
      const result = await fetch(`${url}/auth/v1/user`, {
        headers: {
          apikey: key,
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      });

      if (result.ok) return {};
    } catch {}
  }

  if (!refreshToken) return null;

  try {
    const result = await fetch(
      `${url}/auth/v1/token?grant_type=refresh_token`,
      {
        method: "POST",
        headers: {
          apikey: key,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
        cache: "no-store",
      }
    );

    if (!result.ok) return null;

    const session = await result.json();

    if (!session.access_token || !session.refresh_token) {
      return null;
    }

    return {
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      expiresIn: Number(session.expires_in) || 3600,
    };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const protectedPage =
    path === "/" ||
    protectedPrefixes.some((prefix) => path.startsWith(prefix));

  if (!protectedPage) {
    return NextResponse.next();
  }

  const session = await checkSession(request);

  if (!session) {
    const response = NextResponse.redirect(
      new URL("/login", request.url)
    );

    response.cookies.delete("rhs_access_token");
    response.cookies.delete("rhs_refresh_token");

    return response;
  }

  const response = NextResponse.next();

  if ("accessToken" in session) {
    const secure = process.env.NODE_ENV === "production";

    response.cookies.set("rhs_access_token", session.accessToken, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
    });

    response.cookies.set("rhs_refresh_token", session.refreshToken, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
    });
  }

  return response;
}

export const config = {
  matcher: ["/", "/category/:path*", "/property/:path*"],
};
