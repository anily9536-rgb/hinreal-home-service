
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SellPage() {
  const [title, setTitle] = useState("");
  const [locality, setLocality] = useState("");
  const [listingType, setListingType] = useState("Buy");
  const [price, setPrice] = useState("");
  const [propertyType, setPropertyType] = useState("Residential");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setMessage("Please login before posting a property.");
        return;
      }

      const images = imageUrl.trim() ? [imageUrl.trim()] : [];

      const { error } = await supabase.from("properties").insert({
        user_id: user.id,
        title: title.trim(),
        listing_type: listingType,
        property_type: propertyType,
        price: Number(price),
        locality: locality.trim(),
        description: description.trim(),
        images,
        status: "pending",
      });

      if (error) {
        setMessage("Property submission failed: " + error.message);
        return;
      }

      setMessage(
        "Property submitted successfully! Waiting for admin approval."
      );

      setTitle("");
      setLocality("");
      setListingType("Buy");
      setPrice("");
      setPropertyType("Residential");
      setDescription("");
      setImageUrl("");
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />

      <main className="container">
        <h1>Post Your Property</h1>
        <p>Fill in the details to list your property.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Property Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <select
            value={listingType}
            onChange={(e) => setListingType(e.target.value)}
            required
          >
            <option value="Buy">For Sale</option>
            <option value="Rent">For Rent</option>
          </select>

          <input
            type="text"
            placeholder="Property Location / Locality"
            value={locality}
            onChange={(e) => setLocality(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Property Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="1"
            required
          />

          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            required
          >
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Land">Land</option>
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
          </select>

          <input
            type="url"
            placeholder="Property Image URL (Optional)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />

          <textarea
            placeholder="Property Description"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Post Property"}
          </button>
        </form>

        {message && (
          <p role="status" style={{ marginTop: "20px" }}>
            {message}
          </p>
        )}
      </main>

      <Footer />
    </>
  );
}
