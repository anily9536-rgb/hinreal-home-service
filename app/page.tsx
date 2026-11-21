l
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import EnquiryForm from "@/components/EnquiryForm";

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
          <p>Buy, Sell and Rent Properties Easily</p>

          <Link href="/sell" className="btn">
            Post Your Property
          </Link>
        </section>

        <section className="container">
          <h2>Latest Properties</h2>

          {error && <p>Unable to load properties.</p>}

          {!error && properties?.length === 0 && (
            <p>No approved properties available yet.</p>
          )}

          <div className="property-grid">
            {properties?.map((property) => (
              <div className="property-card" key={property.id}>
                {property.images?.[0] && (
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    style={{
                      width: "100%",
                      height: "220px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                )}

                <h3>{property.title}</h3>

                <p>{property.locality}</p>

                <p>
                  {property.listing_type === "Rent"
                    ? "For Rent"
                    : "For Sale"}
                </p>

                <h4>₹ {property.price}</h4>

                <Link href={`/property/${property.id}`}>
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="container">
          <h2>Send Enquiry</h2>
          <EnquiryForm />
        </section>
      </main>

      <Footer />
    </>
  );
}
