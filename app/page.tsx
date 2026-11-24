import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

const categories = [
  {
    name: "Residential",
    slug: "residential",
    icon: "🏠",
    description: "Residential Properties",
  },
  {
    name: "Commercial",
    slug: "commercial",
    icon: "🏢",
    description: "Shops, Offices & Commercial Spaces",
  },
  {
    name: "Land",
    slug: "land",
    icon: "🌳",
    description: "Plots & Land Properties",
  },
  {
    name: "Apartment",
    slug: "apartment",
    icon: "🏬",
    description: "Flats & Apartments",
  },
  {
    name: "Villa",
    slug: "villa",
    icon: "🏡",
    description: "Independent Homes & Villas",
  },
];

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <section className="hero">
          <img
            src="/file_0000000045d0821180988036e39a5ebd.png"
            alt="Real Home Service Logo"
            style={{
              display: "block",
              width: "min(90%, 600px)",
              maxHeight: 200,
              objectFit: "contain",
              margin: "0 auto 20px",
            }}
          />

          <h1>Find Your Dream Property</h1>
          <p>Explore verified properties for sale and rent.</p>
        </section>

        <section className="container">
          <h2 style={{ textAlign: "center", marginBottom: 10 }}>
            Explore Property Categories
          </h2>

          <p style={{ textAlign: "center", marginBottom: 25 }}>
            Select a category to explore available properties.
          </p>

          <div
            className="property-grid"
            style={{
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
            }}
          >
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="property-card"
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: 30,
                  minHeight: 190,
                  border: "1px solid #dce5ee",
                  borderRadius: 12,
                  background: "#fff",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
                }}
              >
                <div style={{ fontSize: 48, marginBottom: 12 }}>
                  {category.icon}
                </div>

                <h2 style={{ marginBottom: 10 }}>
                  {category.name}
                </h2>

                <p>{category.description}</p>

                <span
                  style={{
                    display: "inline-block",
                    marginTop: 15,
                    color: "#2874a6",
                    fontWeight: "bold",
                  }}
                >
                  View Properties →
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
