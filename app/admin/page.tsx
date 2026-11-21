"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AdminPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [adminReady, setAdminReady] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [locality, setLocality] = useState("");
  const [listingType, setListingType] = useState("Buy");
  const [propertyType, setPropertyType] = useState("Residential");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

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
      setMessage(
        propertyResult.error?.message ||
        enquiryResult.error?.message ||
        "Data load nahi ho saka."
      );
    }

    setProperties(propertyResult.data || []);
    setEnquiries(enquiryResult.data || []);
  }

  useEffect(() => {
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

      setAdminReady(true);
      await loadData();
      setLoading(false);
    }

    checkAdmin();
  }, [router]);

  async function handleAddProperty(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!adminReady) return;

    setSaving(true);
    setMessage("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/admin/login");
        return;
      }

      let images: string[] = [];

      if (imageFile) {
        const filePath =
          `${user.id}/${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, "-")}`;

        const { error: uploadError } = await supabase.storage
          .from("property-photos")
          .upload(filePath, imageFile);

        if (uploadError) {
          setMessage("Photo upload error: " + uploadError.message);
          return;
        }

        const { data: publicUrl } = supabase.storage
          .from("property-photos")
          .getPublicUrl(filePath);

        images = [publicUrl.publicUrl];
      }

      const { error } = await supabase
        .from("properties")
        .insert({
          user_id: user.id,
          title: title.trim(),
          locality: locality.trim(),
          listing_type: listingType,
          property_type: propertyType,
          price: Number(price),
          description: description.trim(),
          phone: phone.trim() || null,
          images,
          status: "approved",
        });

      if (error) {
        setMessage("Property add error: " + error.message);
        return;
      }

      setMessage("Property successfully added to website!");

      setTitle("");
      setLocality("");
      setListingType("Buy");
      setPropertyType("Residential");
      setPrice("");
      setDescription("");
      setPhone("");
      setImageFile(null);

      const fileInput = document.getElementById(
        "property-image"
      ) as HTMLInputElement | null;

      if (fileInput) fileInput.value = "";

      await loadData();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
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

      <main
        style={{
          maxWidth: 1100,
          margin: "30px auto",
          padding: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 15,
          }}
        >
          <h1>Admin Dashboard</h1>
          <button onClick={logout}>Admin Logout</button>
        </div>

        {message && (
          <p style={{ padding: 12, background: "#eef6ff" }}>
            {message}
          </p>
        )}

        <h2>Dashboard Overview</h2>

        <div
          style={{
            display: "flex",
            gap: 20,
            flexWrap: "wrap",
            marginBottom: 30,
          }}
        >
          <div style={{ padding: 20, background: "#eee", borderRadius: 10 }}>
            <h3>Total Properties</h3>
            <h2>{properties.length}</h2>
          </div>

          <div style={{ padding: 20, background: "#eee", borderRadius: 10 }}>
            <h3>Total Enquiries</h3>
            <h2>{enquiries.length}</h2>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 30 }}>
          <button onClick={() => router.push("/admin/properties")}>
            Manage All Properties
          </button>

          <button onClick={() => router.push("/admin/enquiries")}>
            Manage Enquiries
          </button>
        </div>

        <hr />

        <h2 style={{ marginTop: 30 }}>Add / Upload New Property</h2>

        <form
          onSubmit={handleAddProperty}
          style={{
            display: "grid",
            gap: 15,
            maxWidth: 650,
            padding: 20,
            border: "1px solid #ddd",
            borderRadius: 12,
            marginBottom: 40,
          }}
        >
          <input
            type="text"
            placeholder="Property Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Property Location / Locality"
            value={locality}
            onChange={(e) => setLocality(e.target.value)}
            required
          />

          <select
            value={listingType}
            onChange={(e) => setListingType(e.target.value)}
          >
            <option value="Buy">For Sale</option>
            <option value="Rent">For Rent</option>
          </select>

          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
          >
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Land">Land</option>
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
          </select>

          <input
            type="number"
            placeholder="Property Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="1"
            required
          />

          <input
            type="tel"
            placeholder="Contact Phone (Optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <textarea
            placeholder="Property Description"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label htmlFor="property-image">
            Upload Property Photo
          </label>

          <input
            id="property-image"
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImageFile(e.target.files?.[0] || null)
            }
          />

          <button type="submit" disabled={saving}>
            {saving ? "Uploading..." : "Add Property"}
          </button>
        </form>

        <hr />

        <h2 style={{ marginTop: 30 }}>Manage Properties</h2>

        {properties.length === 0 ? (
          <p>No properties found.</p>
        ) : (
          properties.map((property) => (
            <div
              key={property.id}
              style={{
                border: "1px solid #ddd",
                padding: 15,
                marginBottom: 15,
                borderRadius: 10,
              }}
            >
              <h3>{property.title}</h3>
              <p>Location: {property.locality}</p>
              <p>Price: ₹{property.price}</p>
              <p>Status: {property.status}</p>

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
                >
                  Reject
                </button>
              )}
            </div>
          ))
        )}

        <hr />

        <h2 style={{ marginTop: 30 }}>Customer Enquiries</h2>

        {enquiries.length === 0 ? (
          <p>No enquiries found.</p>
        ) : (
          enquiries.map((enquiry) => (
            <div
              key={enquiry.id}
              style={{
                border: "1px solid #ddd",
                padding: 15,
                marginBottom: 15,
                borderRadius: 10,
              }}
            >
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
