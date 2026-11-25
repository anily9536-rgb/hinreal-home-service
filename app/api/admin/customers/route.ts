

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: Request) {
  try {
    const authorization = request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authorization.substring(7);

    const { data: authData, error: authError } =
      await supabaseAdmin.auth.getUser(token);

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
      );
    }

    const { data: adminProfile, error: adminError } =
      await supabaseAdmin
        .from("profiles")
        .select("role")
        .eq("id", authData.user.id)
        .single();

    if (adminError) {
  console.error("Admin profile lookup failed:", adminError);

  return NextResponse.json(
    { error: "Admin profile verify nahi ho payi." },
    { status: 500 }
  );
}

if (!adminProfile || adminProfile.role !== "admin") {
  console.error("Admin role mismatch:", {
    profileFound: !!adminProfile,
    role: adminProfile?.role ?? null,
  });

  return NextResponse.json(
    { error: "Admin profile ya role match nahi hua." },
    { status: 403 }
  );
}

    const { data: customers, error: customerError } =
      await supabaseAdmin
        .from("customer_profiles")
        .select("user_id, full_name, username, phone, created_at")
        .order("created_at", { ascending: false });

    if (customerError) {
      console.error("Customer fetch error:", customerError);

      return NextResponse.json(
        { error: "Customer records load nahi ho paaye." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      customers: customers || [],
    });
  } catch (error) {
    console.error("Admin customers API error:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
