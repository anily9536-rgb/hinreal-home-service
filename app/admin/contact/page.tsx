
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AdminHeader from "@/components/AdminHeader";

const companyEmail = "anily9536@gmail.com";
const companyPhone = "9173086572";

export default function AdminContactPage() {
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
        <h1>Admin Contact</h1>

        <p>Real Home Service - Company Contact Details</p>

        <section style={{
          border: "1px solid #ddd",
          borderRadius: 12,
          padding: 20,
          maxWidth: 600
        }}>
          <h2>Company Details</h2>

          <p><strong>Company:</strong> Real Home Service</p>

          <p>
            <strong>Email:</strong>{" "}
            <a href={`mailto:${companyEmail}`}>
              {companyEmail}
            </a>
          </p>

          <p>
            <strong>Mobile:</strong>{" "}
            <a href={`tel:${companyPhone}`}>
              {companyPhone}
            </a>
          </p>

          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 15,
            marginTop: 20
          }}>
            <a href={`tel:${companyPhone}`}>Call Us</a>

            <a href={`mailto:${companyEmail}`}>Email Us</a>

            <a
              href={`https://wa.me/91${companyPhone}`}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
