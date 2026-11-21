"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EnquiryForm from "@/components/EnquiryForm";
import { supabase } from "@/lib/supabase";

export default function PropertyPage() {
  const params = useParams();
  const id = params.id as string;
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProperty() {
      const { data } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .single();

      setProperty(data);
      setLoading(false);
    }

    if (id) getProperty();
  }, [id]);

  if (loading) return <p>Loading property...</p>;
  if (!property) return <p>Property not found.</p>;

  return (
    <>
      <Header />
      <main className="wrap">
        <h1>{property.title}</h1>
        <p>{property.locality}</p>
        <h2>₹{property.price}</h2>
        <p>{property.description}</p>
        <EnquiryForm propertyId={id} />
      </main>
      <Footer />
    </>
  );
}
