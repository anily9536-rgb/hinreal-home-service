"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase, supabaseConfigured } from "@/lib/supabase";

type Property = {
  id: string; title: string; listing_type: string; property_type: string;
  price: number; locality: string; images?: string[] | null;
};

export default function Home() {
  const [type, setType] = useState("");
  const [query, setQuery] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setType(params.get("type") || "");
    setQuery(params.get("q") || "");
  }, []);

  useEffect(() => {
    async function load() {
      if (!supabaseConfigured) { setLoading(false); return; }
      let request = supabase.from("properties").select("*").eq("status", "approved").order("created_at", { ascending: false });
      if (type) request = request.eq("listing_type", type);
      const { data } = await request;
      const filtered = (data || []) as Property[];
      setProperties(query ? filtered.filter(p => `${p.locality} ${p.title}`.toLowerCase().includes(query.toLowerCase())) : filtered);
      setLoading(false);
    }
    load();
  }, [type, query]);

  return <>
    <Header />
    <section className="hero"><div className="container">
      <div className="eyebrow">Ahmedabad Property Marketplace</div>
      <h1>Find a place to call home.</h1>
      <p>Buy or rent homes, flats, plots and commercial properties.</p>
      <form className="search" action="/">
        <select name="type" defaultValue={type}><option value="">Buy or Rent</option><option value="Buy">Buy</option><option value="Rent">Rent</option></select>
        <input name="q" placeholder="Search locality" defaultValue={query} />
        <button className="button">Search</button>
      </form>
    </div></section>
    <main className="container section">
      <h2>Featured Properties</h2>
      {!supabaseConfigured && <p className="notice">Supabase setup pending. Add the two environment variables in Vercel to show properties.</p>}
      {loading ? <p>Loading properties...</p> : properties.length ? <div className="grid">
        {properties.map(p => <Link className="property-card" href={`/property/${p.id}`} key={p.id}>
          <img className="photo" src={p.images?.[0] || "https://placehold.co/800x500?text=Property"} alt={p.title} />
          <div className="cardbody"><span className="tag">{p.listing_type} · {p.property_type}</span><h3>{p.title}</h3><div className="price">₹{Number(p.price || 0).toLocaleString("en-IN")}</div><p className="muted">{p.locality}, Ahmedabad</p></div>
        </Link>)}
      </div> : <p className="empty">अभी कोई approved property उपलब्ध नहीं है।</p>}
    </main>
    <Footer />
  </>;
}
