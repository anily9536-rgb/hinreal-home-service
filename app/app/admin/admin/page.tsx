"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase, supabaseConfigured } from "@/lib/supabase";

type Property = { id: string; title: string; locality: string; status: string };
type Enquiry = { id: string; name: string; phone: string; email: string | null; message: string | null; property_id: string };

export default function AdminPage() {
  const [status, setStatus] = useState("Checking admin access...");
  const [properties, setProperties] = useState<Property[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  async function load() {
    if (!supabaseConfigured) { setStatus("Supabase environment variables are missing."); return; }
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) { setStatus("Please login with an admin account."); return; }
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", auth.user.id).single();
    if (profile?.role !== "admin") { setStatus("Access denied. This account is not an admin."); return; }
    setIsAdmin(true);
    const [p, e] = await Promise.all([
      supabase.from("properties").select("id,title,locality,status").order("created_at", { ascending: false }),
      supabase.from("enquiries").select("*").order("created_at", { ascending: false })
    ]);
    if (p.error || e.error) setStatus(p.error?.message || e.error?.message || "Could not load dashboard.");
    setProperties((p.data || []) as Property[]);
    setEnquiries((e.data || []) as Enquiry[]);
    setStatus("");
  }

  useEffect(() => { load(); }, []);

  async function approve(id: string, nextStatus: string) {
    const { error } = await supabase.from("properties").update({ status: nextStatus }).eq("id", id);
    if (error) setStatus(error.message); else load();
  }

  return <><Header /><main className="container section"><h1>Admin Dashboard</h1>
    {status && <p className="notice">{status}</p>}
    {isAdmin && <>
      <h2>Properties</h2><div className="grid">{properties.map(p => <div className="panel" key={p.id}><b>{p.title}</b><p>{p.locality} · {p.status}</p><button className="button" onClick={() => approve(p.id, "approved")}>Approve</button> <button className="button" onClick={() => approve(p.id, "rejected")}>Reject</button></div>)}</div>
      <h2 style={{marginTop:32}}>Enquiries</h2><div className="grid">{enquiries.map(e => <div className="panel" key={e.id}><b>{e.name}</b><p>{e.phone} · {e.email || "No email"}</p><p>{e.message}</p><small>Property: {e.property_id}</small></div>)}</div>
    </>}
  </main><Footer /></>;
}
