
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

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

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

  const [showSellModal, setShowSellModal] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [saleAmount, setSaleAmount] = useState("");
  const [saleDate, setSaleDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
  ];

  const currentYear = new Date().getFullYear();

  const earliestYear = properties.reduce((earliest, property) => {
    const dateValue = property.sold_at || property.created_at;
    if (!dateValue) return earliest;
    const year = new Date(dateValue).getFullYear();
    return Number.isNaN(year) ? earliest : Math.min(earliest, year);
  }, 2020);

  const firstYear = Math.min(2020, earliestYear);

  const years = Array.from(
    { length: currentYear - firstYear + 1 },
    (_, index) => currentYear - index
  );

  const monthlySales = useMemo(() => {
    return properties
      .filter((property) => {
        if (property.status !== "sold" || !property.sold_at) return false;
        const date = new Date(property.sold_at);
        return (
          date.getMonth() === selectedMonth &&
          date.getFullYear() === selectedYear
        );
      })
      .reduce(
        (total, property) => total + Number(property.sold_price || 0),
        0
      );
  }, [properties, selectedMonth, selectedYear]);

  const soldProperties = properties.filter(
    (property) => property.status === "sold"
  );

  const availableProperties = properties.filter(
    (property) => property.status !== "sold"
  );

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

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

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

    if (!title.trim() || !locality.trim() || !price || Number(price) <= 0) {
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
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path =
          auth.user.id + "/" + Date.now() + "-" + i + "-" + safeName;

        setMessage(
          "Photo upload ho rahi hai: " + (i + 1) + "/" + photos.length
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
        await supabase.storage.from("property-images").remove(uploadedPaths);
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
        supabase.from("properties").update({ status }).eq("id", id)
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

  function openSellModal(property?: any) {
    const available = properties.filter((item) => item.status !== "sold");

    setSelectedPropertyId(
      property?.id || available[0]?.id || ""
    );
    setSaleAmount("");
    setSaleDate(new Date().toISOString().slice(0, 10));
    setShowSellModal(true);
  }

  async function submitSale() {
    if (saving) return;

    if (!selectedPropertyId) {
      setMessage("Pehle property select karein.");
      return;
    }

    const amount = Number(saleAmount.replace(/,/g, "").trim());

    if (!Number.isFinite(amount) || amount <= 0) {
      setMessage("Valid final selling price enter karein.");
      return;
    }

    if (!saleDate) {
      setMessage("Selling date select karein.");
      return;
    }

    const selectedProperty = properties.find(
      (property) => String(property.id) === String(selectedPropertyId)
    );

    if (!selectedProperty || selectedProperty.status === "sold") {
      setMessage("Selected property available nahi hai. List refresh karein.");
      return;
    }

    const confirmed = window.confirm(
      selectedProperty.title +
      " ko Sold mark karna hai?\nSelling Price: ₹" +
      amount.toLocaleString("en-IN") +
      "\nSelling Date: " + saleDate
    );

    if (!confirmed) return;

    setSaving(true);
    setMessage("Property sold record save ho raha hai...");

    try {
      const soldAt = new Date(saleDate + "T12:00:00").toISOString();

      const { error } = await withTimeout(
        supabase.from("properties")
          .update({
            status: "sold",
            sold_price: amount,
            sold_at: soldAt,
          })
          .eq("id", selectedPropertyId)
      );

      if (error) throw new Error(error.message);

      setShowSellModal(false);
      setSelectedPropertyId("");
      setSaleAmount("");
      setMessage("Property Sold Properties mein add ho gayi.");

      await loadData();
    } catch (error) {
      setMessage(
        "Sale Error: " +
        (error instanceof Error ? error.message : String(error))
      );
    } finally {
      setSaving(false);
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
          <div style={{
            padding: 20,
            background: "#eee",
            borderRadius: 10,
            minWidth: 180
          }}>
            <h3>Total Properties</h3>
            <h2>{properties.length}</h2>
          </div>

          <div style={{
            padding: 20,
            background: "#eee",
            borderRadius: 10,
            minWidth: 180
          }}>
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

          <button
            type="button"
            onClick={() => router.push("/admin/sold")}
            style={{
              padding: 20,
              background: "#e0f2fe",
              border: "1px solid #7dd3fc",
              borderRadius: 10,
              minWidth: 220,
              cursor: "pointer",
              textAlign: "left",
              color: "#0c4a6e"
            }}
          >
            <h3 style={{ marginTop: 0 }}>Sold Properties</h3>
            <h2 style={{ color: "#0369a1" }}>
              {soldProperties.length}
            </h2>
            <p style={{ marginBottom: 0 }}>View All Sold Properties →</p>
          </button>
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

            <p>{photos.length}/10 photos selected. Maximum 5 MB per photo.</p>

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

        <button
          type="button"
          onClick={() => openSellModal()}
          style={{
            padding: "12px 20px",
            background: "#15803d",
            color: "#fff",
            border: 0,
            borderRadius: 8,
            fontWeight: "bold",
            cursor: "pointer",
            margin: "10px 0 20px"
          }}
        >
          + Sell Property
        </button>

        {showSellModal && (
          <div style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16
          }}>
            <div style={{
              background: "#fff",
              color: "#111",
              width: "100%",
              maxWidth: 520,
              maxHeight: "90vh",
              overflowY: "auto",
              padding: 22,
              borderRadius: 12
            }}>
              <h2 style={{ marginTop: 0 }}>Select Property to Sell</h2>
              <p>Yahan sabhi categories ki unsold properties dikhengi.</p>

              <label style={{
                display: "block",
                fontWeight: "bold",
                marginBottom: 8
              }}>
                Select Property
              </label>

              <select
                value={selectedPropertyId}
                onChange={(e) => setSelectedPropertyId(e.target.value)}
                style={{
                  width: "100%",
                  padding: 12,
                  marginBottom: 14
                }}
              >
                <option value="">-- Property Select Karein --</option>
                {availableProperties.map((item) => (
                  <option key={item.id} value={item.id}>
                    {(item.title || "Property") + " | " +
                    (item.property_type || "Other") + " | " +
                    (item.locality || "Location not set")}
                  </option>
                ))}
              </select>

              {selectedPropertyId && (() => {
                const selected = properties.find(
                  (item) => String(item.id) === String(selectedPropertyId)
                );

                return selected ? (
                  <div style={{
                    padding: 12,
                    background: "#f1f5f9",
                    borderRadius: 8,
                    marginBottom: 14
                  }}>
                    <b>{selected.title}</b>
                    <p style={{ margin: "5px 0" }}>
                      Category: {selected.property_type} | Location: {selected.locality}
                    </p>
                    <p style={{ margin: 0 }}>
                      Listed Price: ₹{Number(selected.price || 0).toLocaleString("en-IN")}
                    </p>

                    {(selected.images || []).length > 0 && (
                      <img
                        src={selected.images[0]}
                        alt={selected.title}
                        style={{
                          width: "100%",
                          maxHeight: 180,
                          objectFit: "cover",
                          borderRadius: 8,
                          marginTop: 10
                        }}
                      />
                    )}
                  </div>
                ) : null;
              })()}

              <label style={{
                display: "block",
                fontWeight: "bold",
                marginBottom: 8
              }}>
                Final Selling Price (₹)
              </label>

              <input
                type="number"
                min="1"
                value={saleAmount}
                onChange={(e) => setSaleAmount(e.target.value)}
                placeholder="Final selling amount"
                style={{
                  width: "100%",
                  padding: 12,
                  marginBottom: 14,
                  boxSizing: "border-box"
                }}
              />

              <label style={{
                display: "block",
                fontWeight: "bold",
                marginBottom: 8
              }}>
                Selling Date
              </label>

              <input
                type="date"
                value={saleDate}
                onChange={(e) => setSaleDate(e.target.value)}
                style={{
                  width: "100%",
                  padding: 12,
                  marginBottom: 18,
                  boxSizing: "border-box"
                }}
              />

              <div style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap"
              }}>
                <button
                  type="button"
                  onClick={submitSale}
                  disabled={saving || !selectedPropertyId || !saleAmount}
                  style={{
                    padding: "12px 20px",
                    background: "#15803d",
                    color: "#fff",
                    border: 0,
                    borderRadius: 7,
                    cursor: "pointer"
                  }}
                >
                  {saving ? "Submitting..." : "Submit Sold Property"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowSellModal(false)}
                  disabled={saving}
                  style={{ padding: "12px 20px", borderRadius: 7 }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

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
              <p>
                Listing: {property.listing_type === "Buy" ? "For Sale" : "For Rent"}
              </p>
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

              {property.status !== "sold" && (
                <button
                  type="button"
                  onClick={() => openSellModal(property)}
                  style={{
                    marginLeft: 8,
                    marginTop: 10,
                    padding: "9px 14px",
                    background: "#15803d",
                    color: "#fff",
                    border: 0,
                    borderRadius: 6,
                    cursor: "pointer"
                  }}
                >
                  Sell Property
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

                <p><b>Phone:</b> {enquiry.phone || "Not provided"}</p>

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

                <p><b>Email:</b> {enquiry.email || "Not provided"}</p>
                <p><b>Message:</b> {enquiry.message || "No message"}</p>

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
