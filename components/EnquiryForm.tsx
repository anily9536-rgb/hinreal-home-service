
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Property = {
  id: string;
  title: string;
  locality: string;
  price: number;
};

export default function EnquiryForm() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [propertyId, setPropertyId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [loadingProperties, setLoadingProperties] = useState(true);

  useEffect(() => {
    async function loadProperties() {
      const { data, error } = await supabase
        .from("properties")
        .select("id, title, locality, price")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (error) {
        setStatus("Unable to load properties. Please try again later.");
      } else {
        setProperties(data || []);
      }

      setLoadingProperties(false);
    }

    loadProperties();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!propertyId) {
      setStatus("Please select a property.");
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      const { error } = await supabase.from("enquiries").insert({
        property_id: propertyId,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim(),
      });

      if (error) {
        setStatus("Enquiry failed: " + error.message);
        return;
      }

      setStatus("Your enquiry has been submitted successfully!");

      setPropertyId("");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch {
      setStatus("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <select
        value={propertyId}
        onChange={(e) => setPropertyId(e.target.value)}
        required
        disabled={loadingProperties || properties.length === 0}
      >
        <option value="">
          {loadingProperties
            ? "Loading properties..."
            : properties.length === 0
              ? "No approved properties available"
              : "Select a Property"}
        </option>

        {properties.map((property) => (
          <option key={property.id} value={property.id}>
            {property.title} - {property.locality} - ₹{property.price}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Your Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Your Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="tel"
        placeholder="Your Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />

      <textarea
        placeholder="Write Your Enquiry"
        rows={5}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      />

      <button
        type="submit"
        disabled={loading || loadingProperties || properties.length === 0}
      >
        {loading ? "Submitting..." : "Submit Enquiry"}
      </button>

      {status && (
        <p role="status" style={{ marginTop: "15px" }}>
          {status}
        </p>
      )}
    </form>
  );
}
