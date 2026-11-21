import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function PropertyPage() {
  const { data: properties } = await supabase
    .from("properties")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  return (
    <>
      <Header />
      <main className="section">
        <h1>All Properties</h1>
        <div className="grid">
          {properties?.map((property) => (
            <Link
              href={`/property/${property.id}`}
              className="property-card"
              key={property.id}
            >
              <h2>{property.title}</h2>
              <p>{property.city}</p>
              <p>₹{property.price}</p>
            </Link>
          ))}
        </div>
        {!properties?.length && <p>No properties available.</p>}
      </main>
      <Footer />
    </>
  );
}
