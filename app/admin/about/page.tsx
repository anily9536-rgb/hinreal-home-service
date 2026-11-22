
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AdminHeader from "@/components/AdminHeader";

export default function AdminAboutPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function verifyAdmin() {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        router.replace("/admin/login");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profileError || profile?.role !== "admin") {
        await supabase.auth.signOut();
        router.replace("/admin/login");
        return;
      }

      setChecking(false);
    }

    verifyAdmin();
  }, [router]);

  if (checking) {
    return <main style={{ padding: 30 }}>Checking admin access...</main>;
  }

  return (
    <>
      <AdminHeader />

      <main className="container" style={{ padding: "30px 20px" }}>
        <h1>Admin About</h1>

        <h2>Real Home Service</h2>

        <p>
          Real Home Service is a platform for buying,
          selling and renting residential and commercial properties.
        </p>

        <h2>Our Mission</h2>

        <p>
          Our mission is to make property buying,
          selling and renting simple and convenient.
        </p>

        <h2>Why Choose Us?</h2>

        <ul>
          <li>Easy property search</li>
          <li>Simple property posting</li>
          <li>Customer enquiry support</li>
          <li>Reliable property information</li>
        </ul>
      </main>
    </>
  );
}
