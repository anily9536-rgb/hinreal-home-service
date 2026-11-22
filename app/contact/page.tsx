
"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import AdminHeader from "@/components/AdminHeader";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

const companyName = "Real Home Service";
const companyEmail = "anily9536@gmail.com";
const companyPhone = "9173086571";

export default function ContactPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;

    async function checkAdmin() {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        if (active) {
          setIsAdmin(false);
          setChecking(false);
        }
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userData.user.id)
        .single();

      if (active) {
        setIsAdmin(profile?.role === "admin");
        setChecking(false);
      }
    }

    checkAdmin();

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      {!checking && (
        isAdmin ? <AdminHeader /> : <Header />
      )}

      <main className="container" style={{ padding: "30px 20px" }}>
        <h1>Contact Us</h1>

        <p>
          Real Home Service में आपका स्वागत है।
          Property से जुड़ी जानकारी के लिए हमसे संपर्क करें।
        </p>

        <section style={{
          border: "1px solid #ddd",
          borderRadius: 12,
          padding: 20,
          margin: "25px 0",
          maxWidth: 600
        }}>
          <h2>Company Contact Details</h2>

          <p><strong>Company:</strong> {companyName}</p>

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
            gap: 12,
            marginTop: 20
          }}>
            <a href={`tel:${companyPhone}`} style={{
              background: "#16a34a",
              color: "white",
              padding: "12px 18px",
              borderRadius: 8,
              textDecoration: "none"
            }}>
              📞 Call Us
            </a>

            <a href={`mailto:${companyEmail}`} style={{
              background: "#2563eb",
              color: "white",
              padding: "12px 18px",
              borderRadius: 8,
              textDecoration: "none"
            }}>
              ✉️ Email Us
            </a>

            <a
              href={`https://wa.me/91${companyPhone}`}
              target="_blank"
              rel="noreferrer"
              style={{
                background: "#15803d",
                color: "white",
                padding: "12px 18px",
                borderRadius: 8,
                textDecoration: "none"
              }}
            >
              WhatsApp
            </a>
          </div>
        </section>

        <section style={{ maxWidth: 600 }}>
          <h2>Send Us Your Enquiry</h2>
          <p>
            Enquiry submit karne ke liye Home Page par available
            Enquiry Form ka use karein.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}
