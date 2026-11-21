
import Link from "next/link";

type PropertyCardProps = {
  property: {
    id: string;
    title: string;
    location: string;
    price: number | string;
    image_url?: string | null;
    property_type?: string | null;
  };
};

export default function PropertyCard({
  property,
}: PropertyCardProps) {
  return (
    <div className="property-card">
      {property.image_url ? (
        <img
          src={property.image_url}
          alt={property.title}
        />
      ) : (
        <div
          style={{
            height: "200px",
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

      <p>{property.location}</p>

      {property.property_type && (
        <p>Type: {property.property_type}</p>
      )}

      <h4>
        ₹ {Number(property.price).toLocaleString("en-IN")}
      </h4>

      <Link href={`/property/${property.id}`}>
        View Details
      </Link>
    </div>
  );
}

