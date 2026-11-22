"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SoldPropertiesPage() {
  const router = useRouter();

  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadSoldProperties() {
      try {
        const { data: auth, error: authError } =
          await supabase.auth.getUser();

        if (authError || !auth.user) {
          router.replace("/admin/login");
          return;
        }

        const { data: profile, error: profileError } =
          await supabase
            .from("profiles")
            .select("role")
            .eq("id", auth.user.id)
            .single();

        if (profileError || profile?.role !== "admin") {
          await supabase.auth.signOut();
          router.replace("/admin/login");
          return;
        }

        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .eq("status", "sold")
          .order("sold_at", {
            ascending: false,
            nullsFirst: false,
          });

        if (error) {
          setMessage("Sold Properties load nahi hui: " + error.message);
        } else {
          setProperties(data || []);
        }
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : String(error)
        );
      } finally {
        setLoading(false);
      }
    }

    loadSoldProperties();
  }, [router]);

  function formatDate(dateValue: string | null) {
    if (!dateValue) return "Date available nahi hai";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Date available nahi hai";
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (loading) {
    return <main style={{ padding: 30 }}>Loading Sold Properties...</main>;
  }

  return (
    <>
      <Header />

      <main style={{
        maxWidth: 1100,
        margin: "30px auto",
        padding: 20
      }}>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          style={{
            padding: "10px 18px",
            background: "#111827",
            color: "#fff",
            border: 0,
            borderRadius: 7,
            cursor: "pointer",
            marginBottom: 20
          }}
        >
          ← Back to Dashboard
        </button>

        <h1>Sold Properties</h1>

        <div style={{
          background: "#e8f5e9",
          padding: 18,
          borderRadius: 10,
          margin: "20px 0"
        }}>
          <h3 style={{ margin: 0 }}>Total Sold Properties</h3>
          <h1 style={{
            color: "#15803d",
            margin: "8px 0 0"
          }}>
            {properties.length}
          </h1>
        </div>

        {message && (
          <p style={{
            padding: 12,
            background: "#fff1f2",
            borderRadius: 8
          }}>
            {message}
          </p>
        )}

        {properties.length === 0 ? (
          <p>Abhi tak koi property Sold mark nahi hui hai.</p>
        ) : (
          properties.map((property) => (
            <div
              key={property.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 12,
                padding: 18,
                marginBottom: 20,
                background: "#fff"
              }}
            >
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 10
              }}>
                <h2 style={{ margin: 0 }}>
                  {property.title || "Property"}
                </h2>

                <span style={{
                  background: "#dcfce7",
                  color: "#15803d",
                  padding: "6px 12px",
                  borderRadius: 20,
                  fontWeight: "bold"
                }}>
                  SOLD
                </span>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                gap: 10,
                marginTop: 15
              }}>
                {(property.images || []).map(
                  (url: string, index: number) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Property photo ${index + 1}`}
                      style={{
                        width: "100%",
                        height: 120,
                        objectFit: "cover",
                        borderRadius: 8
                      }}
                    />
                  )
                )}
              </div>

              <div style={{
                background: "#f8fafc",
                padding: 15,
                borderRadius: 8,
                marginTop: 15,
                lineHeight: 1.8
              }}>
                <p><b>Property Name:</b> {property.title || "Not available"}</p>
                <p><b>Category:</b> {property.property_type || "Not available"}</p>
                <p><b>Listing:</b> {property.listing_type === "Buy" ? "For Sale" : property.listing_type || "Not available"}</p>
                <p><b>Location:</b> {property.locality || "Not available"}</p>
                <p><b>Full Address:</b> {property.address || "Not available"}</p>
                <p><b>Original Listed Price:</b> ₹{Number(property.price || 0).toLocaleString("en-IN")}</p>

                <p style={{
                  color: "#15803d",
                  fontSize: 19,
                  fontWeight: "bold"
                }}>
                  Final Selling Price: ₹{Number(property.sold_price || 0).toLocaleString("en-IN")}
                </p>

                <p><b>Selling Date:</b> {formatDate(property.sold_at)}</p>
                <p><b>Contact:</b> {property.phone || "Not available"}</p>

                <p>
                  <b>Description:</b>{" "}
                  {property.description || "Not available"}
                </p>
              </div>
            </div>
          ))
        )}
      </main>

      <Footer />
    </>
  );
}
