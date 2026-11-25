
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AdminHeader from "@/components/AdminHeader";
import Footer from "@/components/Footer";

type Customer = {
  user_id: string;
  full_name: string | null;
  username: string | null;
  phone: string | null;
  created_at: string | null;
};

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadCustomers() {
      try {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();

        const session = sessionData.session;

        if (sessionError || !session) {
          router.replace("/admin/login");
          return;
        }

        const response = await fetch("/api/admin/customers", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          cache: "no-store",
        });

        const result = await response.json();

        if (response.status === 401 || response.status === 403) {
  setMessage(
    `Access Error (${response.status}): ${
      result.error || "Admin permission verify nahi hui."
    }`
  );
  return;
}

        if (!response.ok) {
          setMessage(
            result.error || "Customer records load nahi ho paaye."
          );
          return;
        }

        setCustomers(result.customers || []);
      } catch {
        setMessage("Server se data load nahi hua. Dobara try karein.");
      } finally {
        setLoading(false);
      }
    }

    loadCustomers();
  }, [router]);

  const filteredCustomers = customers.filter((customer) => {
    const query = search.toLowerCase().trim();

    return (
      String(customer.full_name || "").toLowerCase().includes(query) ||
      String(customer.username || "").toLowerCase().includes(query) ||
      String(customer.phone || "").includes(query)
    );
  });

  return (
    <>
      <AdminHeader />

      <main style={{
        minHeight: "70vh",
        padding: "22px 14px",
        background: "#f3f6fb",
        color: "#102b50"
      }}>
        <div style={{ maxWidth: 1100, margin: "auto" }}>
          <h1 style={{ color: "#102b55" }}>
            Customer Registration Records
          </h1>

          <div style={{
            background: "linear-gradient(120deg,#102b55,#1d5595)",
            color: "white",
            padding: 20,
            borderRadius: 14,
            marginBottom: 20
          }}>
            <h2 style={{ margin: 0 }}>Total Registered Customers</h2>
            <p style={{ fontSize: 30, fontWeight: 900, margin: "8px 0 0" }}>
              {customers.length}
            </p>
          </div>

          <input
            type="search"
            placeholder="Name, Username ya Mobile se search karein"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: 14,
              border: "1px solid #cbd5e1",
              borderRadius: 10,
              fontSize: 16,
              marginBottom: 20,
              background: "white",
              color: "#102b50"
            }}
          />

          {loading ? (
            <p>Customers load ho rahe hain...</p>
          ) : message ? (
            <p style={{ color: "#b91c1c" }}>{message}</p>
          ) : filteredCustomers.length === 0 ? (
            <p>Koi customer record nahi mila.</p>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
              gap: 15
            }}>
              {filteredCustomers.map((customer) => {
                const phone = String(customer.phone || "")
                  .replace(/[^\d+]/g, "");

                return (
                  <div key={customer.user_id} style={{
                    background: "white",
                    border: "1px solid #dbe3ee",
                    borderTop: "4px solid #d6a52c",
                    borderRadius: 13,
                    padding: 18,
                    boxShadow: "0 4px 14px rgba(15,23,42,0.07)"
                  }}>
                    <h3 style={{
                      marginTop: 0,
                      color: "#102b55",
                      overflowWrap: "anywhere"
                    }}>
                      {customer.full_name || "Name unavailable"}
                    </h3>

                    <p><b>Username:</b> {customer.username || "-"}</p>
                    <p><b>Mobile:</b> {customer.phone || "Not provided"}</p>
                    <p>
                      <b>Registration Date:</b>{" "}
                      {customer.created_at
                        ? new Date(customer.created_at).toLocaleString("en-IN")
                        : "Not available"}
                    </p>

                    {phone && (
                      <a
                        href={`tel:${phone}`}
                        style={{
                          display: "inline-block",
                          marginTop: 10,
                          padding: "11px 20px",
                          background: "#15803d",
                          color: "white",
                          borderRadius: 8,
                          textDecoration: "none",
                          fontWeight: 800
                        }}
                      >
                        📞 Call Customer
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
