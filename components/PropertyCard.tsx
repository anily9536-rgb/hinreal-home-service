
import Link from "next/link";

type PropertyCardProps = {
  property: {
    id: string;
    title: string;
    locality: string;
    price: number | string;
    images?: string[] | null;
    property_type?: string | null;
    listing_type?: string | null;
  };
};

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <article className="property-card">
      {property.images?.[0] ? (
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
      ) : (
        <div
          style={{
            height: 220,
            background: "#e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          No Property Image
        </div>
      )}

      <h3>{property.title}</h3>
      <p>{property.locality}</p>

      {property.listing_type && (
        <p>
          {property.listing_type === "Rent" ? "For Rent" : "For Sale"}
        </p>
      )}

      {property.property_type && <p>{property.property_type}</p>}

      <h3>₹{Number(property.price).toLocaleString("en-IN")}</h3>

      <Link href={`/property/${property.id}`}>
        View Details
      </Link>
    </article>
  );
}
