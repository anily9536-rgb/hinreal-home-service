
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const {
      fullName,
      username,
      phone,
      password,
      confirmPassword,
    } = await request.json();

    if (
      !fullName?.trim() ||
      !username?.trim() ||
      !phone?.trim() ||
      !password ||
      !confirmPassword
    ) {
      return NextResponse.json(
        { error: "सभी जानकारी भरना जरूरी है।" },
        { status: 400 }
      );
    }

    if (!/^[A-Za-z0-9]{3,20}$/.test(username)) {
      return NextResponse.json(
        { error: "Username 3 से 20 अक्षरों का होना चाहिए।" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password कम से कम 8 अक्षरों का होना चाहिए।" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "दोनों Password एक जैसे नहीं हैं।" },
        { status: 400 }
      );
    }

    const cleanUsername = username.toLowerCase();
    const email = `${cleanUsername}@auth.realhomeservice.com`;

    const { data: existing, error: lookupError } =
      await supabaseAdmin
        .from("customer_profiles")
        .select("user_id")
        .ilike("username", cleanUsername)
        .maybeSingle();

    if (lookupError) {
      console.error("Username lookup failed:", lookupError);
      return NextResponse.json(
        { error: "अभी Registration संभव नहीं है।" },
        { status: 500 }
      );
    }

    if (existing) {
      return NextResponse.json(
        { error: "यह Username पहले से इस्तेमाल हो रहा है।" },
        { status: 409 }
      );
    }

    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError || !authData.user) {
      console.error("Auth creation failed:", authError);
      return NextResponse.json(
        { error: "Account नहीं बन पाया। दोबारा कोशिश करें।" },
        { status: 400 }
      );
    }

    const { data: profileData, error: profileError } =
      await supabaseAdmin
        .from("customer_profiles")
        .insert({
          user_id: authData.user.id,
          username: cleanUsername,
          full_name: fullName.trim(),
          phone: phone.trim(),
        })
        .select("customer_id")
        .single();

    if (profileError || !profileData?.customer_id) {
      console.error("Profile insert failed:", profileError);

      await supabaseAdmin.auth.admin.deleteUser(
        authData.user.id
      );

      return NextResponse.json(
        { error: "Customer ID या Profile सेव नहीं हो पाई।" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Registration सफल हुआ।",
        customerId: profileData.customer_id,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Registration API error:", error);

    return NextResponse.json(
      { error: "कुछ गड़बड़ हुई। दोबारा कोशिश करें।" },
      { status: 500 }
    );
  }
}
