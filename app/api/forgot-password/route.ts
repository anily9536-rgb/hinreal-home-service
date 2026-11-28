
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const { customerId, password, confirmPassword } =
      await request.json();

    if (!/^\d{6}$/.test(customerId || "")) {
      return NextResponse.json(
        { error: "6 अंकों की सही Customer ID डालें।" },
        { status: 400 }
      );
    }

    if (!password || password.length < 8) {
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

    const { data: profile, error: profileError } =
      await supabaseAdmin
        .from("customer_profiles")
        .select("user_id")
        .eq("customer_id", customerId)
        .maybeSingle();

    if (profileError) {
      console.error("Customer lookup failed:", profileError);
      return NextResponse.json(
        { error: "अभी Password reset नहीं हो पाया।" },
        { status: 500 }
      );
    }

    if (!profile?.user_id) {
      return NextResponse.json(
        { error: "Customer ID सही नहीं है।" },
        { status: 404 }
      );
    }

    const { error: updateError } =
      await supabaseAdmin.auth.admin.updateUserById(
        profile.user_id,
        { password }
      );

    if (updateError) {
      console.error("Password update failed:", updateError);
      return NextResponse.json(
        { error: "Password बदल नहीं पाया। दोबारा कोशिश करें।" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Password सफलतापूर्वक बदल गया।" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Forgot password API error:", error);

    return NextResponse.json(
      { error: "कुछ गड़बड़ हुई। दोबारा कोशिश करें।" },
      { status: 500 }
    );
  }
}
