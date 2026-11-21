
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
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.replace("/admin/login");
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profileError || profile?.role !== "admin") {
          await supabase.auth.signOut();
          router.replace("/admin/login");
          return;
        }

        const { data, error: enquiryError } = await supabase
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
    return <main className="container"><p>Loading enquiries...</p></main>;
  }

  return (
    <main className="container">
      <h1>Customer Enquiries</h1>

      <p>
        <Link href="/admin">Back to Admin Dashboard</Link>
      </p>

      <button onClick={handleLogout}>Logout</button>

      <h2>Total Enquiries: {enquiries.length}</h2>

      {error && <p role="alert">{error}</p>}

      {!error && enquiries.length === 0 && (
        <p>No enquiries found.</p>
      )}

      <div className="property-grid">
        {enquiries.map((enquiry) => (
          <div className="property-card" key={enquiry.id}>
            <h3>{enquiry.name}</h3>

            <p>
              <strong>Property ID:</strong> {enquiry.property_id}
            </p>

            <p>
              <strong>Email:</strong> {enquiry.email || "Not provided"}
            </p>

            <p>
              <strong>Phone:</strong> {enquiry.phone}
            </p>

            <p>
              <strong>Message:</strong> {enquiry.message || "No message"}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {new Date(enquiry.created_at).toLocaleString("en-IN")}
            </p>

            <a href={`tel:${enquiry.phone}`}>Call Customer</a>

            {enquiry.email && (
              <>
                {" | "}
                <a href={`mailto:${enquiry.email}`}>Send Email</a>
              </>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
