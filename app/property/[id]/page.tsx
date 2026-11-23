
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

  const { data: property, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .eq("status", "approved")
    .single();

  if (error || !property) {
    notFound();
  }

  return (
    <>
      <Header />

      <main className="container">
        <h1>{property.title}</h1>
<p><strong>Property ID:</strong> {property.property_code}</p>
        {property.images?.length > 0 && (
          <div>
            {property.images.map((image: string, index: number) => (
              <img
                key={index}
                src={image}
                alt={`${property.title} - ${index + 1}`}
                style={{
                  width: "100%",
                  maxWidth: "800px",
                  height: "400px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  marginBottom: "15px",
                }}
              />
            ))}
          </div>
        )}

        <h2>₹ {property.price}</h2>

        <p>
          <strong>Listing:</strong>{" "}
          {property.listing_type === "Rent" ? "For Rent" : "For Sale"}
        </p>

        <p>
          <strong>Location:</strong> {property.locality}
        </p>

        <p>
          <strong>Property Type:</strong> {property.property_type}
        </p>

        {property.bhk && (
          <p>
            <strong>BHK:</strong> {property.bhk}
          </p>
        )}

        {property.area_sqft && (
          <p>
            <strong>Area:</strong> {property.area_sqft} sq. ft.
          </p>
        )}

        <p>
          <strong>Description:</strong> {property.description}
        </p>

        {property.phone && (
          <p>
            <strong>Contact:</strong> {property.phone}
          </p>
        )}

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
