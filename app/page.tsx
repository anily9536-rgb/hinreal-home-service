
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Property = {
  id: string;
  title: string;
  locality: string;
  price: number;
  listing_type: string;
  property_type: string;
  status: string;
  created_at: string;
};

export default function AdminDashboard() {
  const router = useRouter();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      const { data: { user } } = await supabase.auth.getUser();

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

      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setMessage("Unable to load properties: " + error.message);
      } else {
        setProperties(data || []);
      }

      setLoading(false);
    }

    loadDashboard();
  }, [router]);

  async function updateStatus(id: string, status: string) {
    setUpdatingId(id);
    setMessage("");

    const { error } = await supabase
      .from("properties")
      .update({ status })
      .eq("id", id);

    if (error) {
      setMessage("Update failed: " + error.message);
    } else {
      setProperties((current) =>
        current.map((property) =>
          property.id === id ? { ...property, status } : property
        )
      );
      setMessage("Property status updated successfully.");
    }

    setUpdatingId("");
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  const pending = properties.filter((p) => p.status === "pending").length;
  const approved = properties.filter((p) => p.status === "approved").length;
  const rejected = properties.filter((p) => p.status === "rejected").length;

  if (loading) {
    return <main className="container"><p>Loading Admin Dashboard...</p></main>;
  }

  return (
    <main className="container">
      <h1>Admin Dashboard</h1>
      <p>Manage your website properties and enquiries.</p>

      <button onClick={handleLogout}>Logout</button>

      <p>
        <Link href="/admin/enquiries">View Customer Enquiries</Link>
      </p>

      <div className="property-grid">
        <div className="property-card">
          <h3>Total Properties</h3>
          <h2>{properties.length}</h2>
        </div>

        <div className="property-card">
          <h3>Pending</h3>
          <h2>{pending}</h2>
        </div>

        <div className="property-card">
          <h3>Approved</h3>
          <h2>{approved}</h2>
        </div>

        <div className="property-card">
          <h3>Rejected</h3>
          <h2>{rejected}</h2>
        </div>
      </div>

      <h2>Manage Properties</h2>

      {message && <p role="status">{message}</p>}

      {properties.length === 0 && <p>No properties found.</p>}

      <div className="property-grid">
        {properties.map((property) => (
          <div className="property-card" key={property.id}>
            <h3>{property.title}</h3>
            <p>Location: {property.locality}</p>
            <p>Price: ₹{property.price}</p>
            <p>Type: {property.property_type}</p>
            <p>Listing: {property.listing_type}</p>
            <p>Status: <strong>{property.status}</strong></p>

            {property.status !== "approved" && (
              <button
                disabled={updatingId === property.id}
                onClick={() => updateStatus(property.id, "approved")}
              >
                {updatingId === property.id ? "Updating..." : "Approve"}
              </button>
            )}

            {property.status !== "rejected" && (
              <button
                disabled={updatingId === property.id}
                onClick={() => updateStatus(property.id, "rejected")}
              >
                Reject
              </button>
            )}

            {property.status !== "pending" && (
              <button
                disabled={updatingId === property.id}
                onClick={() => updateStatus(property.id, "pending")}
              >
                Mark Pending
              </button>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
