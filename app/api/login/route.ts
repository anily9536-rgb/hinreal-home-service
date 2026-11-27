
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username?.trim() || !password) {
      return NextResponse.json(
        { error: "Username और Password भरें।" },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().toLowerCase();

    if (!/^[a-z0-9]{3,20}$/.test(cleanUsername)) {
      return NextResponse.json(
        { error: "Username सही नहीं है।" },
        { status: 400 }
      );
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("customer_profiles")
      .select("user_id")
      .eq("username", cleanUsername)
      .maybeSingle();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Username या Password गलत है।" },
        { status: 401 }
      );
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
      throw new Error("Supabase environment variables missing.");
    }

    const supabaseAuth = createClient(url, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const email = `${cleanUsername}@auth.realhomeservice.com`;

    const { data, error } = await supabaseAuth.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      return NextResponse.json(
        { error: "Username या Password गलत है।" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    });

    const secure = process.env.NODE_ENV === "production";

    response.cookies.set("rhs_access_token", data.session.access_token, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: data.session.expires_in || 3600,
    });

    response.cookies.set("rhs_refresh_token", data.session.refresh_token, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Login नहीं हो पाया। दोबारा कोशिश करें।" },
      { status: 500 }
    );
  }
}
