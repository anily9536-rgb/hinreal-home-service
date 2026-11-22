
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Enquiry = {
  id: string;
  property_id: string;
  name: string;
  email: string | null;
  phone: string;
  message: string | null;
  created_at: string;
};

export default function AdminEnquiriesPage() {
  const router = useRouter();

  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEnquiries() {
      try {
        const { data: { user }, error: authError } =
          await supabase.auth.getUser();

        if (authError || !user) {
          router.replace("/admin/login");
          return;
        }

        const { data: profile, error: profileError } =
          await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        if (profileError || profile?.role !== "admin") {
          await supabase.auth.signOut();
          router.replace("/admin/login");
          return;
        }

        const { data, error: enquiryError } =
          await supabase
            .from("enquiries")
            .select("*")
            .order("created_at", { ascending: false });

        if (enquiryError) {
          setError(enquiryError.message);
        } else {
          setEnquiries(data || []);
        }
      } catch {
        setError("Unable to load enquiries. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadEnquiries();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  if (loading) {
    return (
      <main style={{ padding: 25 }}>
        Loading enquiries...
      </main>
    );
  }

  return (
    <main style={{
      maxWidth: 1000,
      margin: "30px auto",
      padding: 20
    }}>
      <h1>Customer Enquiries</h1>

      <p>
        <Link href="/admin">
          Back to Admin Dashboard
        </Link>
      </p>

      <button
        type="button"
        onClick={handleLogout}
        style={{
          padding: "10px 18px",
          border: 0,
          borderRadius: 7,
          background: "#111827",
          color: "white",
          cursor: "pointer"
        }}
      >
        Admin Logout
      </button>

      <h2>Total Enquiries: {enquiries.length}</h2>

      {error && (
        <p style={{ color: "red" }}>
          Enquiries Error: {error}
        </p>
      )}

      {!error && enquiries.length === 0 && (
        <p>No enquiries found.</p>
      )}

      {enquiries.map((enquiry) => {
        const phoneNumber = (enquiry.phone || "")
          .replace(/[^\d+]/g, "");

        return (
          <div
            key={enquiry.id}
            style={{
              border: "1px solid #ddd",
              padding: 18,
              marginBottom: 18,
              borderRadius: 12,
              background: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
            }}
          >
            <h3 style={{ marginTop: 0 }}>
              {enquiry.name}
            </h3>

            <p>
              <strong>Property ID:</strong>{" "}
              {enquiry.property_id}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {enquiry.email || "Not provided"}
            </p>

            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
              margin: "15px 0"
            }}>
              <strong>Phone:</strong>
              <span>{enquiry.phone}</span>

              {phoneNumber && (
                <a
                  href={`tel:${phoneNumber}`}
                  style={{
                    display: "inline-block",
                    background: "#16a34a",
                    color: "#fff",
                    padding: "10px 18px",
                    borderRadius: 8,
                    textDecoration: "none",
                    fontWeight: "bold"
                  }}
                >
                  📞 Call Customer
                </a>
              )}
            </div>

            <p>
              <strong>Message:</strong>{" "}
              {enquiry.message || "No message"}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {new Date(enquiry.created_at)
                .toLocaleString("en-IN")}
            </p>

            {enquiry.email && (
              <a href={`mailto:${enquiry.email}`}>
                ✉️ Send Email
              </a>
            )}
          </div>
        );
      })}
    </main>
  );
}
