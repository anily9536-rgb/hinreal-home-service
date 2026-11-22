
"use client";

import { useEffect, useMemo, useState } from "react";
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

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().getMonth()
  );
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear()
  );

  const [title, setTitle] = useState("");
  const [locality, setLocality] = useState("");
  const [address, setAddress] = useState("");
  const [listingType, setListingType] = useState("Buy");
  const [propertyType, setPropertyType] = useState("Residential");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");

  const [photos, setPhotos] = useState<File[]>([]);
  const [photoInputKey, setPhotoInputKey] = useState(0);

  const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
  ];

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const soldYears = properties
      .filter((p) => p.status === "sold" && p.sold_at)
      .map((p) => new Date(p.sold_at).getFullYear());

    return Array.from(
      new Set([currentYear, ...soldYears, selectedYear])
    ).sort((a, b) => b - a);
  }, [properties, selectedYear]);

  const monthlySales = useMemo(() => {
    return properties
      .filter((p) => {
        if (p.status !== "sold" || !p.sold_at) return false;

        const date = new Date(p.sold_at);

        return (
          date.getMonth() === selectedMonth &&
          date.getFullYear() === selectedYear
        );
      })
      .reduce((total, p) => total + Number(p.sold_price || 0), 0);
  }, [properties, selectedMonth, selectedYear]);

  async function withTimeout<T>(
    request: PromiseLike<T>,
    seconds = 30
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
      if (timer !== undefined) window.clearTimeout(timer);
    }
  }

  async function loadData() {
    try {
      const p: any = await withTimeout(
        supabase.from("properties")
          .select("*")
          .order("created_at", { ascending: false })
      );

      if (p.error) {
        setMessage("Properties Error: " + p.error.message);
      } else {
        setProperties(p.data || []);
      }

      const e: any = await withTimeout(
        supabase.from("enquiries")
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
            supabase.from("profiles")
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

  function handlePhotoChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const selected = Array.from(event.target.files || []);

    if (selected.length > 10) {
      setMessage("Maximum 10 photos select kar sakte hain.");
      setPhotos([]);
      setPhotoInputKey((key) => key + 1);
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    for (const file of selected) {
      if (!allowedTypes.includes(file.type)) {
        setMessage("Sirf JPG, PNG aur WEBP photos allowed hain.");
        setPhotos([]);
        setPhotoInputKey((key) => key + 1);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setMessage("Har photo maximum 5 MB ki honi chahiye.");
        setPhotos([]);
        setPhotoInputKey((key) => key + 1);
        return;
      }
    }

    setPhotos(selected);
    setMessage(selected.length + " photos selected.");
  }

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
    setMessage("Property aur photos upload ho rahe hain...");

    const uploadedPaths: string[] = [];

    try {
      const { data: auth, error: authError } =
        await withTimeout(supabase.auth.getUser());

      if (authError || !auth.user) {
        throw new Error("Admin login expired. Dobara login karein.");
      }

      const imageUrls: string[] = [];

      for (let i = 0; i < photos.length; i++) {
        const file = photos[i];

        const safeName = file.name.replace(
          /[^a-zA-Z0-9._-]/g,
          "_"
        );

        const path =
          auth.user.id + "/" + Date.now() + "-" + i + "-" + safeName;

        setMessage(
          "Photo upload ho rahi hai: " +
          (i + 1) + "/" + photos.length
        );

        const { error: uploadError } = await withTimeout(
          supabase.storage.from("property-images")
            .upload(path, file, {
              cacheControl: "3600",
              upsert: false,
              contentType: file.type,
            })
        );

        if (uploadError) {
          throw new Error("Photo upload failed: " + uploadError.message);
        }

        uploadedPaths.push(path);

        const { data: publicUrl } = supabase.storage
          .from("property-images")
          .getPublicUrl(path);

        imageUrls.push(publicUrl.publicUrl);
      }

      const { error } = await withTimeout(
        supabase.from("properties").insert({
          user_id: auth.user.id,
          title: title.trim(),
          locality: locality.trim(),
          address: address.trim() || locality.trim(),
          listing_type: listingType,
          property_type: propertyType,
          price: Number(price),
          description: description.trim(),
          phone: phone.trim() || "Not Provided",
          images: imageUrls,
          status: "approved",
        })
      );

      if (error) throw new Error(error.message);

      setMessage(
        "SUCCESS! Property " + imageUrls.length +
        " photos ke saath upload ho gayi."
      );

      setTitle("");
      setLocality("");
      setAddress("");
      setListingType("Buy");
      setPropertyType("Residential");
      setPrice("");
      setDescription("");
      setPhone("");
      setPhotos([]);
      setPhotoInputKey((key) => key + 1);

      await loadData();
    } catch (error) {
      if (uploadedPaths.length > 0) {
        await supabase.storage
          .from("property-images")
          .remove(uploadedPaths);
      }

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
        supabase.from("properties")
          .update({ status })
          .eq("id", id)
      );

      if (error) throw new Error(error.message);

      setMessage("Property status updated.");
      await loadData();
    } catch (error) {
      setMessage(
        "Status Error: " +
        (error instanceof Error ? error.message : String(error))
      );
    }
  }

  async function markAsSold(property: any) {
    if (property.listing_type !== "Buy") {
      setMessage("Sirf For Sale property ko Sold mark kar sakte hain.");
      return;
    }

    const enteredPrice = window.prompt(
      "Is property ki final selling amount (₹) enter karein:"
    );

    if (enteredPrice === null) return;

    const amount = Number(enteredPrice.replace(/,/g, "").trim());

    if (!Number.isFinite(amount) || amount <= 0) {
      setMessage("Valid selling amount enter karein.");
      return;
    }

    if (!window.confirm(
      "Kya aap is property ko Sold mark karna chahte hain?\nSelling Amount: ₹" +
      amount.toLocaleString("en-IN")
    )) {
      return;
    }

    setMessage("Sale record save ho raha hai...");

    try {
      const { error } = await withTimeout(
        supabase.from("properties")
          .update({
            status: "sold",
            sold_price: amount,
            sold_at: new Date().toISOString(),
          })
          .eq("id", property.id)
      );

      if (error) throw new Error(error.message);

      setMessage("Property Sold! Selling amount monthly report mein add ho gayi.");
      await loadData();
    } catch (error) {
      setMessage(
        "Sale Error: " +
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
        supabase.from("properties").delete().eq("id", id)
      );

      if (error) throw new Error(error.message);

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
          <div>
            <img
              src="/file_0000000045d0821180988036e39a5ebd.png"
              alt="Real Home Service Logo"
              style={{
                display: "block",
                width: "min(90%, 350px)",
                maxHeight: 130,
                objectFit: "contain",
                marginBottom: 15
              }}
            />
            <h1>Admin Dashboard</h1>
          </div>

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
          <div style={{ padding: 20, background: "#eee", borderRadius: 10 }}>
            <h3>Total Properties</h3>
            <h2>{properties.length}</h2>
          </div>

          <div style={{ padding: 20, background: "#eee", borderRadius: 10 }}>
            <h3>Total Enquiries</h3>
            <h2>{enquiries.length}</h2>
          </div>

          <div style={{
            padding: 20,
            background: "#e8f5e9",
            borderRadius: 10,
            minWidth: 220
          }}>
            <h3>Total Selling Amount</h3>
            <h2 style={{ color: "#15803d" }}>
              ₹{monthlySales.toLocaleString("en-IN")}
            </h2>
            <p style={{ marginBottom: 0 }}>
              {months[selectedMonth]} {selectedYear}
            </p>
          </div>
        </div>

        <div style={{
          marginTop: 20,
          padding: 18,
          border: "1px solid #ddd",
          borderRadius: 10
        }}>
          <h3>Month-wise Sales History</h3>
          <p>Purane mahine ki total selling amount dekhne ke liye select karein.</p>

          <div style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap"
          }}>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              style={{ padding: 12, minWidth: 150 }}
            >
              {months.map((month, index) => (
                <option key={month} value={index}>{month}</option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              style={{ padding: 12, minWidth: 120 }}
            >
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <h2 style={{ color: "#15803d" }}>
            {months[selectedMonth]} {selectedYear}: ₹{monthlySales.toLocaleString("en-IN")}
          </h2>
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

          <div>
            <label style={{
              display: "block",
              fontWeight: "bold",
              marginBottom: 8
            }}>
              Property Photos (Maximum 10)
            </label>

            <input
              key={photoInputKey}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handlePhotoChange}
            />

            <p>
              {photos.length}/10 photos selected. Maximum 5 MB per photo.
            </p>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
              gap: 10
            }}>
              {photos.map((photo, index) => (
                <div key={index}>
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={photo.name}
                    style={{
                      width: "100%",
                      height: 90,
                      objectFit: "cover",
                      borderRadius: 8
                    }}
                  />
                  <small>{photo.name}</small>
                </div>
              ))}
            </div>
          </div>

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
            {saving ? "Uploading Property..." : "Add Property"}
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
              <p>Listing: {property.listing_type === "Buy" ? "For Sale" : "For Rent"}</p>
              <p>Price: ₹{property.price}</p>
              <p>Phone: {property.phone}</p>
              <p>Status: {property.status}</p>

              {property.status === "sold" && (
                <>
                  <p style={{ color: "#15803d", fontWeight: "bold" }}>
                    Sold Amount: ₹{Number(property.sold_price || 0).toLocaleString("en-IN")}
                  </p>
                  <p>
                    Sold Date: {property.sold_at
                      ? new Date(property.sold_at).toLocaleDateString("en-IN")
                      : "Not available"}
                  </p>
                </>
              )}

              <p>Photos: {property.images?.length || 0}</p>

              <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8
              }}>
                {(property.images || []).map((url: string, index: number) => (
                  <img
                    key={index}
                    src={url}
                    alt="Property"
                    style={{
                      width: 100,
                      height: 80,
                      objectFit: "cover",
                      borderRadius: 6
                    }}
                  />
                ))}
              </div>

              {property.status !== "sold" && property.status !== "approved" && (
                <button
                  type="button"
                  onClick={() => updateStatus(property.id, "approved")}
                >
                  Approve
                </button>
              )}

              {property.status !== "sold" && property.status !== "rejected" && (
                <button
                  type="button"
                  onClick={() => updateStatus(property.id, "rejected")}
                >
                  Reject
                </button>
              )}

              {property.listing_type === "Buy" && property.status === "approved" && (
                <button
                  type="button"
                  onClick={() => markAsSold(property)}
                  style={{
                    marginLeft: 8,
                    padding: "9px 14px",
                    background: "#15803d",
                    color: "#fff",
                    border: 0,
                    borderRadius: 6
                  }}
                >
                  Mark as Sold
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
          enquiries.map((enquiry) => {
            const customerPhone = String(enquiry.phone || "")
              .replace(/[^\d+]/g, "");

            const relatedProperty = properties.find(
              (property) =>
                String(property.id) === String(enquiry.property_id)
            );

            return (
              <div key={enquiry.id} style={{
                border: "1px solid #ddd",
                padding: 18,
                marginBottom: 15,
                borderRadius: 10,
                background: "#fff"
              }}>
                <h3>Customer: {enquiry.name}</h3>

                <div style={{
                  background: "#f0f7ff",
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 15
                }}>
                  <h3>Enquired Property</h3>

                  {relatedProperty ? (
                    <>
                      <p><b>Property:</b> {relatedProperty.title}</p>
                      <p><b>Location:</b> {relatedProperty.locality}</p>
                      <p><b>Address:</b> {relatedProperty.address}</p>
                      <p><b>Price:</b> ₹{relatedProperty.price}</p>
                    </>
                  ) : (
                    <p>
                      Property ID: {enquiry.property_id || "Not available"}
                      <br />
                      Property details not found.
                    </p>
                  )}
                </div>

                <p>
                  <b>Phone:</b> {enquiry.phone || "Not provided"}
                </p>

                {customerPhone && (
                  <a
                    href={`tel:${customerPhone}`}
                    style={{
                      display: "inline-block",
                      background: "#16a34a",
                      color: "#fff",
                      padding: "11px 20px",
                      borderRadius: 8,
                      textDecoration: "none",
                      fontWeight: "bold",
                      marginBottom: 10
                    }}
                  >
                    📞 Call Customer
                  </a>
                )}

                <p>
                  <b>Email:</b> {enquiry.email || "Not provided"}
                </p>

                <p>
                  <b>Message:</b> {enquiry.message || "No message"}
                </p>

                <p>
                  <b>Date:</b>{" "}
                  {enquiry.created_at
                    ? new Date(enquiry.created_at).toLocaleString("en-IN")
                    : "Not available"}
                </p>
              </div>
            );
          })
        )}

      </main>

      <Footer />
    </>
  );
}
