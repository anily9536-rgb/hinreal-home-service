"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EnquiryForm from "@/components/EnquiryForm";
import { supabase, supabaseConfigured } from "@/lib/supabase";

type Property = { id: string; title: string; locality: string; price: number; description: string; images?: string[] | null; listing_type: string; property_type: string; };

export default function PropertyPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function load() {
      if (!supabaseConfigured) { setLoading(false); return; }
      const { data } = await supabase.from("properties").select("*").eq("id", id).single();
      setProperty(data as Property | null);
      setLoading(false);
    }
    if (id) load();
  }, [id]);

  return <>
    <Header />
    <main className="container">
      {loading ? <p>Loading property...</p> : !property ? <p className="empty">Property not found. Please check that this property is approved and the database is configured.</p> : <div className="detail-layout">
        <section>
          <img className="detail-image" src={property.images?.[0] || "https://placehold.co/1000x600?text=Property"} alt={property.title} />
          <h1>{property.title}</h1>
          <p className="muted">{property.locality}, Ahmedabad · {property.listing_type} · {property.property_type}</p>
          <h2>₹{Number(property.price || 0).toLocaleString("en-IN")}</h2>
          <p>{property.description}</p>
        </section>
        <aside><EnquiryForm propertyId={id} title={property.title} /></aside>
      </div>}
    </main>
    <Footer />
  </>;
}
