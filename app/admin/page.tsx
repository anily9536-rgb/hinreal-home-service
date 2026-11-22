
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AdminPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  const [title, setTitle] = useState("");
  const [locality, setLocality] = useState("");
  const [listingType, setListingType] = useState("Buy");
  const [propertyType, setPropertyType] = useState("Residential");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");

  function withTimeout<T>(
    request: PromiseLike<T>,
    milliseconds = 15000
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const timer = window.setTimeout(() => {
        reject(new Error("Request timeout. Supabase connection check karein."));
      }, milliseconds);

      Promise.resolve(request).then(
        (result) => {
          window.clearTimeout(timer);
          resolve(result);
        },
        (error) => {
          window.clearTimeout(timer);
          reject(error);
        }
      );
    });
  }

  async function loadData() {
    try {
      const p = await withTimeout(
        supabase
          .from("properties")
          .select("*")
          .order("created_at", { ascending: false })
      );

      const e = await withTimeout(
        supabase
          .from("enquiries")
          .select("*")
          .order("created_at", { ascending: false })
      );

      if (p.error) {
        setMessage("Properties error: " + p.error.message);
      } else {
        setProperties(p.data || []);
      }

      if (e.error) {
        setMessage("Enquiries error: " + e.error.message);
      } else {
        setEnquiries(e.data || []);
      }
    } catch (error) {
      setMessage(
        "Dashboard load error: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  }

  useEffect(() => {
    async function checkAdmin() {
      try {
        const { data: auth, error: authError } = await withTimeout(
          supabase.auth.getUser()
        );

        if (authError || !auth.user) {
          router.replace("/admin/login");
          return;
        }

        const { data: profile, error } = await withTimeout(
          supabase
            .from("profiles")
            .select("role")
            .eq("id", auth.user.id)
            .single()
        );

        if (error || profile?.role !== "admin") {
          await supabase.auth.signOut();
          router.replace("/admin/login");
          return;
        }

        await loadData();
      } catch (error) {
        setMessage(
          "Admin check error: " +
            (error instanceof Error ? error.message : "Unknown error")
        );
      } finally {
        setLoading(false);
      }
    }

    checkAdmin();
  }, [router]);

  async function handleAddProperty(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (saving) return;

    if (
      !title.trim() ||
      !locality.trim() ||
      !price ||
      Number(price) <= 0
    ) {
      setMessage("Title, location aur valid price zaroori hain.");
      return;
    }

    setSaving(true);
    setMessage("Step 1: Admin login check ho raha hai...");

    const controller = new AbortController();

    const abortTimer = window.setTimeout(() => {
      controller.abort();
    }, 15000);

    try {
      const { data: auth, error: authError } = await withTimeout(
        supabase.auth.getUser()
      );

      if (authError || !auth.user) {
        throw new Error("Admin login expired. Dobara login karein.");
      }

      setMessage("Step 2: Property database mein save ho rahi hai...");

      const insertRequest = supabase
        .from("properties")
        .insert({
          user_id: auth.user.id,
          title: title.trim(),
          locality: locality.trim(),
          listing_type: listingType,
          property_type: propertyType,
          price: Number(price),
          description: description.trim(),
          phone: phone.trim() || null,
          images: [],
          status: "approved",
        })
        .abortSignal(controller.signal);

      const result = await withTimeout(insertRequest, 16000);

      if (result.error) {
        throw new Error(result.error.message);
      }

      setMessage(
        "SUCCESS! Property database mein save ho gayi."
      );

      setTitle("");
      setLocality("");
      setListingType("Buy");
      setPropertyType("Residential");
      setPrice("");
      setDescription("");
      setPhone("");

      setSaving(false);

      loadData();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      if (
        errorMessage.includes("AbortError") ||
        errorMessage.toLowerCase().includes("aborted")
      ) {
        setMessage(
          "UPLOAD FAILED: Request 15 seconds mein complete nahi hui. Internet aur Supabase check karein."
        );
      } else {
        setMessage("UPLOAD FAILED: " + errorMessage);
      }
    } finally {
      window.clearTimeout(abortTimer);
      setSaving(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    setMessage("Updating property status...");

    try {
      const { error } = await withTimeout(
        supabase
          .from("properties")
          .update({ status })
          .eq("id", id)
      );

      if (error) {
        setMessage("Status error: " + error.message);
        return;
      }

      setMessage("Property status updated.");
      await loadData();
    } catch (error) {
      setMessage(
        "Status error: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  if (loading) {
    return <main style={{ padding: 30 }}>Loading Admin Dashboard...</main>;
  }

  return (
    <>
      <Header />

      <main style={{ maxWidth: 1100, margin: "30px auto", padding: 20 }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 15
        }}>
          <h1>Admin Dashboard</h1>
          <button type="button" onClick={logout}>Admin Logout</button>
        </div>

        {message && (
          <p style={{
            padding: 14,
            background: "#eef6ff",
            border: "1px solid #b8d8ff",
            borderRadius: 8,
            overflowWrap: "anywhere"
          }}>
            {message}
          </p>
        )}

        <h2>Dashboard Overview</h2>

        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <div style={{ padding: 20, background: "#eee", borderRadius: 10 }}>
            <h3>Total Properties</h3>
            <h2>{properties.length}</h2>
          </div>

          <div style={{ padding: 20, background: "#eee", borderRadius: 10 }}>
            <h3>Total Enquiries</h3>
            <h2>{enquiries.length}</h2>
          </div>
        </div>

        <div style={{
          display: "flex",
          gap: 12,
          margin: "25px 0",
          flexWrap: "wrap"
        }}>
          <button
            type="button"
            onClick={() => router.push("/admin/properties")}
          >
            Manage All Properties
          </button>

          <button
            type="button"
            onClick={() => router.push("/admin/enquiries")}
          >
            Manage Enquiries
          </button>
        </div>

        <hr />

        <h2 style={{ marginTop: 30 }}>Add New Property</h2>

        <form
          onSubmit={handleAddProperty}
          style={{
            display: "grid",
            gap: 15,
            maxWidth: 650,
            padding: 20,
            border: "1px solid #ddd",
            borderRadius: 12,
            marginBottom: 40
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

          <p>Property bina photo ke bhi upload ho sakti hai.</p>

          <button
            type="submit"
            disabled={saving}
            style={{
              padding: 14,
              background: "#111827",
              color: "white",
              border: 0,
              borderRadius: 8,
              cursor: saving ? "wait" : "pointer"
            }}
          >
            {saving ? "Adding Property..." : "Add Property"}
          </button>
        </form>

        <hr />

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

              {property.status !== "approved" && (
                <button
                  type="button"
                  onClick={() => updateStatus(property.id, "approved")}
                >
                  Approve
                </button>
              )}

              {property.status !== "rejected" && (
                <button
                  type="button"
                  onClick={() => updateStatus(property.id, "rejected")}
                >
                  Reject
                </button>
              )}
            </div>
          ))
        )}

        <hr />

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
