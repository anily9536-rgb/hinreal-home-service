
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyEnquiry from "@/components/PropertyEnquiry";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";

const categories: Record<string, string> = {
  residential: "Residential",
  commercial: "Commercial",
  land: "Land",
  apartment: "Apartment",
  villa: "Villa",
};

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const category = categories[type.toLowerCase()];

  if (!category) notFound();

  const { data: properties, error } = await supabase
    .from("properties")
    .select("*")
    .eq("status", "approved")
    .eq("property_type", category)
    .order("created_at", { ascending: false });

  return (
    <>
      <Header />

      <main className="container">
        <h1>{category} Properties</h1>
        <p>Explore available {category.toLowerCase()} properties.</p>

        {error && <p>Unable to load properties. Please try again.</p>}

        {!error && (!properties || properties.length === 0) && (
          <p>No {category.toLowerCase()} properties available right now.</p>
        )}

        <div className="property-grid">
          {properties?.map((property) => (
            <article className="property-card" key={property.id}>
              {property.images?.[0] && (
                <img
                  src={property.images[0]}
                  alt={property.title || "Property"}
                  style={{
                    width: "100%",
                    height: 220,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
              )}

              <h2>{property.title}</h2>
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

              <PropertyEnquiry propertyId={String(property.id)} />
            </article>
          ))}
        </div>

        <p style={{ marginTop: 25 }}>
          <Link href="/">← Back to Home</Link>
        </p>
      </main>

      <Footer />
    </>
  );
}
