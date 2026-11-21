"use client";

import { FormEvent, useState } from "react";
import { supabase, supabaseConfigured } from "@/lib/supabase";

export default function EnquiryForm({ propertyId, title }: { propertyId: string; title: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState("");

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");
    if (!supabaseConfigured) {
      setNotice("Website setup pending: Supabase environment variables are missing.");
      return;
    }
    const { error } = await supabase.from("enquiries").insert({
      property_id: propertyId, name, phone, email: email || null, message
    });
    if (error) setNotice(error.message);
    else {
      setNotice("Thank you! Your enquiry has been sent.");
      setName(""); setPhone(""); setEmail(""); setMessage("");
    }
  }

  return (
    <form className="panel form" onSubmit={send}>
      <h2>Send an Enquiry</h2>
      <p className="muted">Interested in {title}? Share your details.</p>
      <label>Your name<input required value={name} onChange={e => setName(e.target.value)} /></label>
      <label>Mobile number<input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} /></label>
      <label>Email (optional)<input type="email" value={email} onChange={e => setEmail(e.target.value)} /></label>
      <label>Message<textarea value={message} onChange={e => setMessage(e.target.value)} rows={4} /></label>
      <button className="button" type="submit">Send Enquiry</button>
      {notice && <p role="status" className="notice">{notice}</p>}
    </form>
  );
}
