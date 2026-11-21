

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: property } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .eq("status", "approved")
    .single();

  if (!property) {
    notFound();
  }

  return (
    <>
      <Header />

      <main className="container">
        <h1>{property.title}</h1>

        {property.image_url && (
          <img
            src={property.image_url}
            alt={property.title}
            style={{
              width: "100%",
              maxWidth: "800px",
              height: "400px",
              objectFit: "cover",
              borderRadius: "10px",
            }}
          />
        )}

        <h2>₹ {property.price}</h2>

        <p><strong>Location:</strong> {property.location}</p>

        <p>
          <strong>Description:</strong>{" "}
          {property.description}
        </p>

        <p>
          <strong>Property Type:</strong>{" "}
          {property.property_type}
        </p>

        <p>
          <strong>Status:</strong> {property.status}
        </p>

        <a
          href="/contact"
          className="btn"
          style={{ marginTop: "20px" }}
        >
          Contact Us
        </a>
      </main>

      <Footer />
    </>
  );
}
