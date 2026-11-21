
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function EnquiryForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    const { error } = await supabase.from("enquiries").insert({
      name,
      email,
      phone,
      message,
    });

    setLoading(false);

    if (error) {
      setStatus("Enquiry failed: " + error.message);
      return;
    }

    setStatus("Your enquiry has been submitted successfully!");

    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
  }

  return (
    <form onSubmit={handleSubmit}>
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

      <button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit Enquiry"}
      </button>

      {status && (
        <p style={{ marginTop: "15px" }}>
          {status}
        </p>
      )}
    </form>
  );
}

