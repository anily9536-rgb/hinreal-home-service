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

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Supabase environment variables are missing.");
    }

    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
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

    return NextResponse.json({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    });
  } catch {
    return NextResponse.json(
      { error: "Login नहीं हो पाया। कृपया दोबारा कोशिश करें।" },
      { status: 500 }
    );
  }
}
