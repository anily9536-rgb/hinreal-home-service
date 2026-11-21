
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Property = {
  id: string;
  title: string;
  locality: string;
  price: number;
  status: string;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {
    const { data: auth } = await supabase.auth.getUser();

    if (!auth.user) {
      router.replace("/admin/login");
      return;
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", auth.user.id)
      .single();

    if (error || profile?.role !== "admin") {
      await supabase.auth.signOut();
      router.replace("/admin/login");
      return;
    }

    await loadProperties();
  }

  async function loadProperties() {
    const { data, error } = await supabase
      .from("properties")
      .select("id, title, locality, price, status")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
    } else {
      setProperties(data || []);
    }

    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    setMessage("");

    const { error } = await supabase
      .from("properties")
      .update({ status })
      .eq("id", id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage(`Property ${status} successfully.`);
    await loadProperties();
  }

  if (loading) {
    return <main className="container">Loading Admin Dashboard...</main>;
  }

  return (
    <>
      <Header />

      <main className="container">
        <h1>Admin Dashboard</h1>
        <p>Manage all property listings.</p>

        {message && <p>{message}</p>}

        <h2>Total Properties: {properties.length}</h2>

        <div className="property-grid">
          {properties.map((property) => (
            <div className="property-card" key={property.id}>
              <h3>{property.title}</h3>
              <p>Location: {property.locality}</p>
              <h4>₹ {Number(property.price).toLocaleString("en-IN")}</h4>
              <p>
                Status: <strong>{property.status}</strong>
              </p>

              {property.status !== "approved" && (
                <button
                  onClick={() => updateStatus(property.id, "approved")}
                >
                  Approve
                </button>
              )}

              {property.status !== "rejected" && (
                <button
                  onClick={() => updateStatus(property.id, "rejected")}
                  style={{ background: "#c0392b" }}
                >
                  Reject
                </button>
              )}
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}
