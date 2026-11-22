
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EnquiryForm from "@/components/EnquiryForm";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { data: properties, error } = await supabase
    .from("properties")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  return (
    <>
      <Header />

      <main>
        <section className="hero">
          <h1>Find Your Dream Property</h1>
          <p>Explore verified properties for sale and rent.</p>
        </section>

        <section className="container">
          <h2>Latest Properties</h2>

          {error && (
            <div style={{
              padding: 15,
              margin: "15px 0",
              background: "#fee2e2",
              color: "#991b1b",
              borderRadius: 8,
              overflowWrap: "anywhere"
            }}>
              <h3>Supabase Database Error</h3>
              <p>{error.message}</p>
              <p>Code: {error.code || "Not available"}</p>
              <p>Details: {error.details || "Not available"}</p>
              <p>Hint: {error.hint || "Not available"}</p>
            </div>
          )}

          {!error && (!properties || properties.length === 0) && (
            <p>No approved properties available yet.</p>
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
                      borderRadius: 8
                    }}
                  />
                )}

                <h3>{property.title}</h3>
                <p>{property.locality}</p>
                <p>{property.address}</p>

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
        </section>

        <section className="container">
          <h2>Send an Enquiry</h2>
          <EnquiryForm />
        </section>
      </main>

      <Footer />
    </>
  );
}
