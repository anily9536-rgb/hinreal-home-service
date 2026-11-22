
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
  const [address, setAddress] = useState("");
  const [listingType, setListingType] = useState("Buy");
  const [propertyType, setPropertyType] = useState("Residential");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");

  async function withTimeout<T>(
    request: PromiseLike<T>,
    seconds = 15
  ): Promise<T> {
    let timer: number | undefined;

    try {
      return await Promise.race([
        Promise.resolve(request),
        new Promise<never>((_, reject) => {
          timer = window.setTimeout(
            () => reject(new Error("Request timeout. Please try again.")),
            seconds * 1000
          );
        }),
      ]);
    } finally {
      if (timer !== undefined) {
        window.clearTimeout(timer);
      }
    }
  }

  async function loadData() {
    try {
      const p: any = await withTimeout(
        supabase
          .from("properties")
          .select("*")
          .order("created_at", { ascending: false })
      );

      if (p.error) {
        setMessage("Properties Error: " + p.error.message);
      } else {
        setProperties(p.data || []);
      }

      const e: any = await withTimeout(
        supabase
          .from("enquiries")
          .select("*")
          .order("created_at", { ascending: false })
      );

      if (e.error) {
        setMessage("Enquiries Error: " + e.error.message);
      } else {
        setEnquiries(e.data || []);
      }
    } catch (error) {
      setMessage(
        "Dashboard Error: " +
          (error instanceof Error ? error.message : String(error))
      );
    }
  }

  useEffect(() => {
    async function checkAdmin() {
      try {
        const { data, error } = await withTimeout(
          supabase.auth.getUser()
        );

        if (error || !data.user) {
          router.replace("/admin/login");
          return;
        }

        const { data: profile, error: profileError } =
          await withTimeout(
            supabase
              .from("profiles")
              .select("role")
              .eq("id", data.user.id)
              .single()
          );

        if (profileError || profile?.role !== "admin") {
          await supabase.auth.signOut();
          router.replace("/admin/login");
          return;
        }

        await loadData();
      } catch (error) {
        setMessage(
          "Admin Check Error: " +
            (error instanceof Error ? error.message : String(error))
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
      setMessage("Title, Location aur valid Price zaroori hain.");
      return;
    }

    setSaving(true);
    setMessage("Property upload ho rahi hai...");

    try {
      const { data: auth, error: authError } =
        await withTimeout(supabase.auth.getUser());

      if (authError || !auth.user) {
        throw new Error("Admin login expired. Dobara login karein.");
      }

      const finalAddress = address.trim() || locality.trim();
      const finalPhone = phone.trim() || "Not Provided";

      const { error } = await withTimeout(
        supabase.from("properties").insert({
          user_id: auth.user.id,
          title: title.trim(),
          locality: locality.trim(),
          address: finalAddress,
          listing_type: listingType,
          property_type: propertyType,
          price: Number(price),
          description: description.trim(),
          phone: finalPhone,
          images: [],
          status: "approved",
        })
      );

      if (error) {
        throw new Error(error.message);
      }

      setMessage("SUCCESS! Property upload ho gayi.");

      setTitle("");
      setLocality("");
      setAddress("");
      setListingType("Buy");
      setPropertyType("Residential");
      setPrice("");
      setDescription("");
      setPhone("");

      await loadData();
    } catch (error) {
      setMessage(
        "UPLOAD FAILED: " +
          (error instanceof Error ? error.message : String(error))
      );
    } finally {
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
        throw new Error(error.message);
      }

      setMessage("Property status updated.");
      await loadData();
    } catch (error) {
      setMessage(
        "Status Error: " +
          (error instanceof Error ? error.message : String(error))
      );
    }
  }

  async function deleteProperty(id: string) {
    if (!window.confirm("Kya aap is property ko delete karna chahte hain?")) {
      return;
    }

    try {
      const { error } = await withTimeout(
        supabase
          .from("properties")
          .delete()
          .eq("id", id)
      );

      if (error) {
        throw new Error(error.message);
      }

      setMessage("Property deleted successfully.");
      await loadData();
    } catch (error) {
      setMessage(
        "Delete Error: " +
          (error instanceof Error ? error.message : String(error))
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

      <main style={{
        maxWidth: 1100,
        margin: "30px auto",
        padding: 20
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 15
        }}>
          <h1>Admin Dashboard</h1>

          <button type="button" onClick={logout}>
            Admin Logout
          </button>
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

        <div style={{
          display: "flex",
          gap: 20,
          flexWrap: "wrap"
        }}>
          <div style={{
            padding: 20,
            background: "#eee",
            borderRadius: 10
          }}>
            <h3>Total Properties</h3>
            <h2>{properties.length}</h2>
          </div>

          <div style={{
            padding: 20,
            background: "#eee",
            borderRadius: 10
          }}>
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

          <input
            type="text"
            placeholder="Full Property Address (Optional)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
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

          <p>Photo ke bina bhi Property Upload ho sakti hai.</p>

          <button
            type="submit"
            disabled={saving}
            style={{
              padding: 14,
              background: "#111827",
              color: "#fff",
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
              <p>Address: {property.address}</p>
              <p>Price: ₹{property.price}</p>
              <p>Phone: {property.phone}</p>
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

              <button
                type="button"
                onClick={() => deleteProperty(property.id)}
                style={{ marginLeft: 10 }}
              >
                Delete
              </button>
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
