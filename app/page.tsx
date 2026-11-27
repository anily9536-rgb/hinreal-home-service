
"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

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
  const [propertyType, setPropertyType] = useState("");
  const [listingType, setListingType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [area, setArea] = useState("");

  const [results, setResults] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function searchProperties(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const min = minPrice.trim() ? Number(minPrice) : null;
    const max = maxPrice.trim() ? Number(maxPrice) : null;

    if (min !== null && (!Number.isFinite(min) || min < 0)) {
      setMessage("Valid minimum price enter karein.");
      return;
    }

    if (max !== null && (!Number.isFinite(max) || max < 0)) {
      setMessage("Valid maximum price enter karein.");
      return;
    }

    if (min !== null && max !== null && min > max) {
      setMessage(
        "Minimum price, maximum price se kam honi chahiye."
      );
      return;
    }

    setLoading(true);
    setSearched(true);
    setMessage("");
    setResults([]);

    try {
      let query = supabase
        .from("properties")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });
if (listingType) {
  query = query.eq("listing_type", listingType);
}
      if (propertyType) {
        query = query.eq("property_type", propertyType);
      }

      if (min !== null) {
        query = query.gte("price", min);
      }

      if (max !== null) {
        query = query.lte("price", max);
      }

      if (area.trim()) {
  const searchText = area.trim();

  const filters = [
    `locality.ilike.%${searchText}%`,
`address.ilike.%${searchText}%`,
  ];
  if (/^\d+$/.test(searchText)) {
    filters.push(`property_code.eq.${searchText}`);
  }

  query = query.or(filters.join(","));
}
      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      setResults(data || []);

      if (!data || data.length === 0) {
        setMessage(
          "Aapki search ke according koi available property nahi mili."
        );
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Property search nahi ho payi."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />

      <main>
        {/* SAGE GREEN HERO BANNER */}
        <section
          className="hero"
          style={{
            background: "#DDE8DF",
            color: "#10264A",
            borderBottom: "4px solid #C9A34A",
          }}
        >
          
            <div
  style={{
    width: "min(90%, 420px)",
    height: 140,
    background: "#FFFFFF",
    borderRadius: 12,
    border: "1px solid #C9A34A",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 14px",
    boxSizing: "border-box",
  }}
>
  <img
    src="/logo.png"
    alt="Real Home Service Logo"
    style={{
      display: "block",
      width: 120,
      height: 120,
      objectFit: "contain",
    }}
  />
</div>

          <h1 style={{ color: "#10264A" }}>
            Find Your Dream Property
          </h1>

          <p style={{ color: "#10264A" }}>
            Explore verified properties for sale and rent.
          </p>
        </section>

        {/* PROPERTY SEARCH */}
        <section
          className="container"
          style={{
            maxWidth: 900,
            margin: "25px auto",
            padding: 20,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 22,
              borderRadius: 14,
              border: "1px solid #dce5ee",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            }}
          >
            <h2 style={{ textAlign: "center", marginTop: 0 }}>
              Search Properties
            </h2>

            <form onSubmit={searchProperties}>
              <label
  style={{
    display: "block",
    fontWeight: "bold",
    marginBottom: 7,
  }}
>
  Select Buy or Rent
</label>

<select
  value={listingType}
  onChange={(e) => setListingType(e.target.value)}
  style={{
    width: "100%",
    padding: 13,
    marginBottom: 16,
    border: "1px solid #ccc",
    borderRadius: 8,
    boxSizing: "border-box",
  }}
>
  <option value="">All Properties</option>
  <option value="Buy">Buy / For Sale</option>
  <option value="Rent">Rent / For Rent</option>
</select>
              <label
                style={{
                  display: "block",
                  fontWeight: "bold",
                  marginBottom: 7,
                }}
              >
                Property Type
              </label>

              <select
                value={propertyType}
                onChange={(e) =>
                  setPropertyType(e.target.value)
                }
                style={{
                  width: "100%",
                  padding: 13,
                  marginBottom: 16,
                  border: "1px solid #ccc",
                  borderRadius: 8,
                  boxSizing: "border-box",
                }}
              >
                <option value="">All Property Types</option>

                {categories.map((category) => (
                  <option
                    key={category.slug}
                    value={category.name}
                  >
                    {category.name}
                  </option>
                ))}
              </select>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",
                  gap: 12,
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontWeight: "bold",
                      marginBottom: 7,
                    }}
                  >
                    Minimum Price (₹)
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={minPrice}
                    onChange={(e) =>
                      setMinPrice(e.target.value)
                    }
                    placeholder="Minimum price"
                    style={{
                      width: "100%",
                      padding: 13,
                      border: "1px solid #ccc",
                      borderRadius: 8,
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontWeight: "bold",
                      marginBottom: 7,
                    }}
                  >
                    Maximum Price (₹)
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={maxPrice}
                    onChange={(e) =>
                      setMaxPrice(e.target.value)
                    }
                    placeholder="Maximum price"
                    style={{
                      width: "100%",
                      padding: 13,
                      border: "1px solid #ccc",
                      borderRadius: 8,
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <label
                style={{
                  display: "block",
                  fontWeight: "bold",
                  margin: "16px 0 7px",
                }}
              >
                Area / Location / Property ID
              </label>

              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Enter Area, Location or Property ID"
                style={{
                  width: "100%",
                  padding: 13,
                  border: "1px solid #ccc",
                  borderRadius: 8,
                  boxSizing: "border-box",
                }}
              />

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: 14,
                  marginTop: 20,
                  background: "#C9A34A",
                  color: "#091A33",
                  border: 0,
                  borderRadius: 8,
                  fontSize: 17,
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                {loading ? "Searching..." : "Search Property"}
              </button>
            </form>

            {message && (
              <p
                style={{
                  marginTop: 16,
                  textAlign: "center",
                }}
              >
                {message}
              </p>
            )}
          </div>

          {/* SEARCH RESULTS */}
          {searched && results.length > 0 && (
            <section style={{ marginTop: 30 }}>
              <h2>Search Results ({results.length})</h2>

              <div
                className="property-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",
                  gap: 20,
                }}
              >
                {results.map((property) => (
                  <article
                    className="property-card"
                    key={property.id}
                    style={{ minWidth: 0 }}
                  >
                    {property.images?.[0] && (
                      <img
                        src={property.images[0]}
                        alt={property.title || "Property"}
                        style={{
                          width: "100%",
                          height: 210,
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                    )}

                    <h3>{property.title}</h3>
<p><strong>Property ID:</strong> {property.property_code}</p>
<p>{property.property_type}</p>
                    <p>📍 {property.locality}</p>

                    <p>
                      {property.listing_type === "Rent"
                        ? "For Rent"
                        : "For Sale"}
                    </p>

                    <h3>
                      ₹
                      {Number(
                        property.price || 0
                      ).toLocaleString("en-IN")}
                    </h3>

                    <Link
                      href={`/property/${property.id}`}
                    >
                      View Full Details →
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          )}
        </section>

        {/* PROPERTY CATEGORIES */}
        <section className="container">
          <h2
            style={{
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            Explore Property Categories
          </h2>

          <p
            style={{
              textAlign: "center",
              marginBottom: 25,
            }}
          >
            Select a category to explore available properties.
          </p>

          <div
            className="property-grid"
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2, minmax(0, 1fr))",
              gap: 20,
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
                  minWidth: 0,
                  border: "1px solid #dce5ee",
                  borderRadius: 12,
                  background: "#fff",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
                }}
              >
                <div
                  style={{
                    fontSize: 48,
                    marginBottom: 12,
                  }}
                >
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
