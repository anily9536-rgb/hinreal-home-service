
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PropertyEnquiry({
  propertyId,
}: {
  propertyId: string;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  async function submitEnquiry(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    const { error } = await supabase.from("enquiries").insert([
      {
        property_id: propertyId,
        name,
        email,
        phone,
        message,
      },
    ]);

    setLoading(false);

    if (error) {
      setStatus("Enquiry submit nahi hui: " + error.message);
      return;
    }

    setStatus("Your enquiry has been submitted successfully!");
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
  }

  return (
    <div style={{ marginTop: 15 }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          background: "#1769aa",
          color: "white",
          padding: "10px 22px",
          border: 0,
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        {open ? "Close Enquiry" : "Enquiry"}
      </button>

      {open && (
        <form
          onSubmit={submitEnquiry}
          style={{
            marginTop: 15,
            display: "grid",
            gap: 12,
          }}
        >
          <input
            required
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            required
            type="tel"
            placeholder="Mobile Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <textarea
            placeholder="Your Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Enquiry"}
          </button>

          {status && <p>{status}</p>}
        </form>
      )}
    </div>
  );
}
