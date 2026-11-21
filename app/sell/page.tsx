
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SellPage() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
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

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Please login before posting a property.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("properties").insert({
      title,
      location,
      price: Number(price),
      property_type: propertyType,
      description,
      image_url: imageUrl,
      user_id: user.id,
      status: "pending",
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Property submitted successfully! Waiting for admin approval.");

    setTitle("");
    setLocation("");
    setPrice("");
    setDescription("");
    setImageUrl("");
  }

  return (
    <>
      <Header />

      <main className="container">
        <h1>Sell Your Property</h1>
        <p>Fill in the details to post your property.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Property Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Property Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
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
          >
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Land">Land</option>
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
          </select>

          <input
            type="url"
            placeholder="Property Image URL"
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

        {message && <p style={{ marginTop: "20px" }}>{message}</p>}
      </main>

      <Footer />
    </>
  );
}

