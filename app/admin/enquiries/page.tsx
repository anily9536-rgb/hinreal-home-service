

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
};

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEnquiries() {
      const { data, error } = await supabase
        .from("enquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setEnquiries(data || []);
      }

      setLoading(false);
    }

    loadEnquiries();
  }, []);

  return (
    <>
      <Header />

      <main className="container">
        <h1>Customer Enquiries</h1>
        <p>Manage customer enquiries from your website.</p>

        <h2>Total Enquiries: {enquiries.length}</h2>

        {loading && <p>Loading enquiries...</p>}

        {error && <p>{error}</p>}

        {!loading && !error && enquiries.length === 0 && (
          <p>No enquiries found.</p>
        )}

        <div className="property-grid">
          {enquiries.map((enquiry) => (
            <div className="property-card" key={enquiry.id}>
              <h3>{enquiry.name}</h3>

              <p>
                <strong>Email:</strong> {enquiry.email}
              </p>

              <p>
                <strong>Phone:</strong> {enquiry.phone}
              </p>

              <p>
                <strong>Message:</strong> {enquiry.message}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {new Date(enquiry.created_at).toLocaleString("en-IN")}
              </p>

              <a href={`tel:${enquiry.phone}`}>
                Call Customer
              </a>

              {" | "}

              <a href={`mailto:${enquiry.email}`}>
                Send Email
              </a>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}
