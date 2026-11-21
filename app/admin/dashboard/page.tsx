

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Property = {
  id: string;
  title: string;
  location: string;
  price: number;
  status: string;
};

export default function AdminDashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadProperties() {
    const { data, error } = await supabase
      .from("properties")
      .select("id, title, location, price, status")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
    } else {
      setProperties(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadProperties();
  }, []);

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
    loadProperties();
  }

  return (
    <>
      <Header />

      <main className="container">
        <h1>Admin Dashboard</h1>
        <p>Manage all property listings.</p>

        {message && <p>{message}</p>}

        {loading ? (
          <p>Loading properties...</p>
        ) : (
          <>
            <h2>Total Properties: {properties.length}</h2>

            <div className="property-grid">
              {properties.map((property) => (
                <div className="property-card" key={property.id}>
                  <h3>{property.title}</h3>

                  <p>Location: {property.location}</p>

                  <h4>₹ {property.price}</h4>

                  <p>
                    Status: <strong>{property.status}</strong>
                  </p>

                  {property.status !== "approved" && (
                    <button
                      onClick={() =>
                        updateStatus(property.id, "approved")
                      }
                      style={{ marginRight: "10px" }}
                    >
                      Approve
                    </button>
                  )}

                  {property.status !== "rejected" && (
                    <button
                      onClick={() =>
                        updateStatus(property.id, "rejected")
                      }
                      style={{ background: "#c0392b" }}
                    >
                      Reject
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </>
  );
}
