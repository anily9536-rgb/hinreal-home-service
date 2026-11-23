
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function PropertyPage() {
  const { data: properties, error } = await supabase
    .from("properties")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  return (
    <>
      <Header />

      <main className="container">
        <h1>All Properties</h1>

        {error && <p>Unable to load properties.</p>}

        {!error && (!properties || properties.length === 0) && (
          <p>No approved properties available.</p>
        )}

        <div className="property-grid">
          {properties?.map((property) => (
            <article className="property-card" key={property.id}>
              {property.images?.[0] && (
                <img
                  src={property.images[0]}
                  alt={property.title}
                  style={{
                    width: "100%",
                    height: 220,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
              )}

              <h2>{property.title}</h2>
<p><strong>Property ID:</strong> {property.property_code}</p>
<p>{property.locality}</p>
              <p>
                {property.listing_type === "Rent"
                  ? "For Rent"
                  : "For Sale"}
              </p>
              <h3>
                ₹{Number(property.price).toLocaleString("en-IN")}
              </h3>

              <Link href={`/property/${property.id}`}>
                View Details
              </Link>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}
