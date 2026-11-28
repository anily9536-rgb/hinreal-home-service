
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: 13,
  border: "1px solid #C9A34A",
  borderRadius: 9,
  boxSizing: "border-box",
  background: "#fff",
  color: "#10264A",
  marginTop: 6,
};

export default function SellYourProperty() {
  const [open, setOpen] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Residential");
  const [listing, setListing] = useState("Buy");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const urls = photos.map(photo => URL.createObjectURL(photo));
    setPreviewUrls(urls);

    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [photos]);

  function addPhotos(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || []);
    e.target.value = "";

    if (photos.length + selected.length > 10) {
      setMessage("Maximum 10 photos allowed.");
      return;
    }

    const invalid = selected.some(file =>
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 5 * 1024 * 1024
    );

    if (invalid) {
      setMessage("JPG, PNG, WEBP only. Maximum 5 MB per photo.");
      return;
    }

    setPhotos(old => [...old, ...selected]);
    setMessage("");
  }

  function removePhoto(index: number) {
    setPhotos(old => old.filter((_, i) => i !== index));
    setMessage("");
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (photos.length < 5) {
      setMessage("Minimum 5 photos upload karein.");
      return;
    }

    if (photos.length > 10) {
      setMessage("Maximum 10 photos allowed.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setMessage("Valid 10 digit mobile number enter karein.");
      return;
    }

    if (Number(price) <= 0) {
      setMessage("Valid price enter karein.");
      return;
    }

    setSaving(true);
    setMessage("Photos upload ho rahi hain...");

    const folder = crypto.randomUUID();
    const uploaded: string[] = [];

    try {
      const imageUrls: string[] = [];

      for (let i = 0; i < photos.length; i++) {
        const file = photos[i];
        const safeName = file.name.replace(
          /[^a-zA-Z0-9._-]/g,
          "_"
        );

        const path =
          `customer-submissions/${folder}/${i}-${safeName}`;

        const { error } = await supabase.storage
          .from("property-images")
          .upload(path, file, {
            upsert: false,
            contentType: file.type,
          });

        if (error) throw error;

        uploaded.push(path);

        const { data } = supabase.storage
          .from("property-images")
          .getPublicUrl(path);

        imageUrls.push(data.publicUrl);
      }

      const { error } = await supabase
        .from("customer_property_submissions")
        .insert({
          title: title.trim(),
          property_type: type,
          listing_type: listing,
          address: address.trim(),
          price: Number(price),
          customer_name: name.trim(),
          mobile_number: mobile,
          images: imageUrls,
          status: "pending",
        });

      if (error) throw error;

      setMessage(
        "Property successfully submitted! Admin approval ke baad website par list hogi."
      );

      setPhotos([]);
      setTitle("");
      setAddress("");
      setPrice("");
      setName("");
      setMobile("");
      setType("Residential");
      setListing("Buy");
    } catch (error) {
      if (uploaded.length) {
        await supabase.storage
          .from("property-images")
          .remove(uploaded);
      }

      setMessage(
        error instanceof Error
          ? error.message
          : "Submission failed."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section
      style={{
        maxWidth: 1100,
        margin: "35px auto",
        padding: 18,
      }}
    >
      <div
        style={{
          background: "#10264A",
          border: "3px solid #C9A34A",
          borderRadius: 18,
          padding: 25,
          textAlign: "center",
        }}
      >
        <h2
          style={{
            color: "#F4D17A",
            fontSize: 29,
            fontWeight: 900,
          }}
        >
          HAVE A PROPERTY TO SELL OR RENT?
        </h2>

        <p style={{ color: "#fff" }}>
          List your property with Real Home Service
        </p>

        <button
          type="button"
          onClick={() => setOpen(true)}
          style={{
            width: "100%",
            maxWidth: 520,
            padding: 19,
            background: "#C9A34A",
            color: "#10264A",
            border: "2px solid #F4D17A",
            borderRadius: 12,
            fontSize: 24,
            fontWeight: 900,
            cursor: "pointer",
          }}
        >
          SELL YOUR PROPERTY
        </button>
      </div>

      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,.75)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 12,
          }}
        >
          <form
            onSubmit={submit}
            style={{
              width: "100%",
              maxWidth: 650,
              maxHeight: "94vh",
              overflowY: "auto",
              background: "#F8F3E9",
              border: "3px solid #C9A34A",
              borderRadius: 16,
              padding: 20,
              color: "#10264A",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2>Submit Your Property</h2>

              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={saving}
                style={{
                  fontSize: 25,
                  background: "#10264A",
                  color: "#fff",
                  border: 0,
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>

            <label>Property Title</label>
            <input
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={inputStyle}
            />

            <label>Property Type</label>
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              style={inputStyle}
            >
              <option>Residential</option>
              <option>Commercial</option>
              <option>Land</option>
              <option>Apartment</option>
              <option>Villa</option>
            </select>

            <label>Sale or Rent</label>
            <select
              value={listing}
              onChange={e => setListing(e.target.value)}
              style={inputStyle}
            >
              <option value="Buy">Sale / For Sale</option>
              <option value="Rent">Rent / For Rent</option>
            </select>

            <label>Full Address</label>
            <textarea
              required
              value={address}
              onChange={e => setAddress(e.target.value)}
              rows={3}
              style={inputStyle}
            />

            <label>Price (₹)</label>
            <input
              required
              type="number"
              min="1"
              value={price}
              onChange={e => setPrice(e.target.value)}
              style={inputStyle}
            />

            <label>Customer Name</label>
            <input
              required
              value={name}
              onChange={e => setName(e.target.value)}
              style={inputStyle}
            />

            <label>Mobile Number</label>
            <input
              required
              type="tel"
              maxLength={10}
              value={mobile}
              onChange={e =>
                setMobile(e.target.value.replace(/\D/g, ""))
              }
              style={inputStyle}
            />

            <label
              style={{
                display: "block",
                marginTop: 18,
                fontWeight: 800,
              }}
            >
              Property Photos (Minimum 5, Maximum 10)
            </label>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={addPhotos}
              style={inputStyle}
            />

            <p>
              {photos.length} photos selected (minimum 5, maximum 10)
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(3, minmax(0, 1fr))",
                gap: 10,
              }}
            >
              {photos.map((photo, i) => (
                <div
                  key={`${photo.name}-${i}`}
                  style={{
                    position: "relative",
                    border: "2px solid #C9A34A",
                    borderRadius: 9,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={previewUrls[i] || ""}
                    alt={`Property photo ${i + 1}`}
                    style={{
                      width: "100%",
                      height: 110,
                      objectFit: "cover",
                      display: "block",
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    disabled={saving}
                    aria-label="Remove photo"
                    style={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      background: "#B42318",
                      color: "#fff",
                      border: "2px solid white",
                      borderRadius: "50%",
                      width: 29,
                      height: 29,
                      fontSize: 19,
                      fontWeight: 900,
                      cursor: "pointer",
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {message && (
              <p
                style={{
                  padding: 10,
                  background: "#fff",
                  borderRadius: 8,
                  overflowWrap: "anywhere",
                }}
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={saving || photos.length < 5 || photos.length > 10}
              style={{
                width: "100%",
                padding: 16,
                marginTop: 15,
                background:
                  saving || photos.length < 5 || photos.length > 10
                    ? "#999"
                    : "#C9A34A",
                color: "#10264A",
                border: 0,
                borderRadius: 10,
                fontSize: 20,
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              {saving ? "SUBMITTING..." : "SUBMIT PROPERTY"}
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
