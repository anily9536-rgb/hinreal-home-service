"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
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

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", auth.user.id)
      .single();

    if (profile?.role !== "admin") {
      await supabase.auth.signOut();
      router.replace("/admin/login");
      return;
    }

    await loadData();
    setLoading(false);
  }

  async function loadData() {
    const propertyResult = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });

    const enquiryResult = await supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (propertyResult.error || enquiryResult.error) {
      setMessage("Data load nahi ho saka.");
    }

    setProperties(propertyResult.data || []);
    setEnquiries(enquiryResult.data || []);
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase
      .from("properties")
      .update({ status })
      .eq("id", id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Property status updated.");
    await loadData();
  }

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  if (loading) {
    return <main style={{ padding: 40 }}>Loading Admin Dashboard...</main>;
  }

  return (
    <>
      <Header />

      <main style={{ maxWidth: 1100, margin: "40px auto", padding: 20 }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 15
        }}>
          <h1>Admin Dashboard</h1>
          <button onClick={logout}>Logout</button>
        </div>

        {message && <p>{message}</p>}

        <h2>Dashboard Overview</h2>

        <div style={{
          display: "flex",
          gap: 20,
          flexWrap: "wrap",
          marginBottom: 35
        }}>
          <div style={{ padding: 20, background: "#eee", borderRadius: 10 }}>
            <h3>Total Properties</h3>
            <h2>{properties.length}</h2>
          </div>

          <div style={{ padding: 20, background: "#eee", borderRadius: 10 }}>
            <h3>Total Enquiries</h3>
            <h2>{enquiries.length}</h2>
          </div>
        </div>

        <h2>Manage Properties</h2>

        {properties.length === 0 ? (
          <p>No properties found.</p>
        ) : (
          properties.map((property) => (
            <div key={property.id} style={{
              border: "1px solid #ddd",
              padding: 15,
              marginBottom: 15,
              borderRadius: 10
            }}>
              <h3>{property.title}</h3>
              <p>Location: {property.locality}</p>
              <p>Price: ₹{property.price}</p>
              <p>Status: {property.status}</p>

              <button onClick={() => updateStatus(property.id, "approved")}>
                Approve
              </button>{" "}

              <button onClick={() => updateStatus(property.id, "rejected")}>
                Reject
              </button>
            </div>
          ))
        )}

        <h2>Customer Enquiries</h2>

        {enquiries.length === 0 ? (
          <p>No enquiries found.</p>
        ) : (
          enquiries.map((enquiry) => (
            <div key={enquiry.id} style={{
              border: "1px solid #ddd",
              padding: 15,
              marginBottom: 15,
              borderRadius: 10
            }}>
              <p><b>Name:</b> {enquiry.name}</p>
              <p><b>Phone:</b> {enquiry.phone}</p>
              <p><b>Email:</b> {enquiry.email || "Not provided"}</p>
              <p><b>Message:</b> {enquiry.message}</p>
            </div>
          ))
        )}
      </main>

      <Footer />
    </>
  );
}
