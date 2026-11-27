
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
    logo: "/Residential Logo.png",
    description: "Residential Properties",
  },
  {
    name: "Commercial",
    slug: "commercial",
    logo: "/commercial Logo.png",
    description: "Shops, Offices & Commercial Spaces",
  },
  {
    name: "Land",
    slug: "land",
    logo: "/land logo.png",
    description: "Plots & Land Properties",
  },
  {
    name: "Apartment",
    slug: "apartment",
    logo: "/Apartment Logo.png",
    description: "Flats & Apartments",
  },
  {
    name: "Villa",
    slug: "villa",
    logo: "/Villa Logo.png",
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
          
            <img
  src="/logo.png"
  alt="Real Home Service Logo"
  style={{
    display: "block",
    width: 140,
    height: 140,
    objectFit: "contain",
    margin: "0 auto 14px",
  }}
/>

          <h1 style={{ color: "#10264A" }}>
            Find Your Dream Property
          </h1>

          <p style={{ color: "#10264A" }}>
            Explore verified properties for sale and rent.
          </p>
        </section>
        <div style={{ display: "flex", overflowX: "auto", scrollSnapType: "x mandatory", gap: 20, maxWidth: 1100, margin: "35px auto", padding: "10px 5px", WebkitOverflowScrolling: "touch" }}>
{/* PREMIUM PROPERTY SHOWCASE */}
<section
  style={{
    maxWidth: 1100,
    width: "100%",
flex: "0 0 100%",
scrollSnapAlign: "start",
    margin: "35px auto",
    padding: 20,
    background: "#F8F3E9",
    border: "2px solid #D4AF37",
    borderRadius: 18,
    boxShadow: "0 6px 20px rgba(0,0,0,0.10)",
  }}
>
  <img
        src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1400"
    alt="Luxury Dream Property"
    style={{
      width: "100%",
      height: 350,
      objectFit: "cover",
      borderRadius: 12,
      display: "block",
    }}
  />

  <div style={{ textAlign: "center", padding: "25px 12px" }}>
    <h2
      style={{
        color: "#10264A",
        fontSize: 30,
        fontWeight: 800,
        marginBottom: 8,
      }}
    >
      Your Dream Property, Our Priority
    </h2>

    <h3
      style={{
        color: "#B88625",
        fontSize: 21,
        fontStyle: "italic",
        marginBottom: 15,
      }}
    >
      Find Your Perfect Place to Call Home
    </h3>

    <p
      style={{
        color: "#26364B",
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.9,
        maxWidth: 850,
        margin: "0 auto",
      }}
    >
      Step into a world where elegance meets comfort. At Real
Home Service, we bring you carefully selected residential
homes, luxurious villas, modern apartments and premium
commercial spaces. Every property represents an opportunity
to build your future, create lasting memories and make a
smart investment. Discover exceptional spaces, explore
prime locations and let us help you find a place that truly
feels like your own. Your dream lifestyle begins here.
    </p>

    <Link
      href="/"
      style={{
        display: "inline-block",
        marginTop: 22,
        padding: "14px 30px",
        background: "#C9A34A",
        color: "#10264A",
        fontSize: 17,
        fontWeight: "bold",
        borderRadius: 8,
        textDecoration: "none",
      }}
    >
      Explore Properties →
    </Link>
  </div>
</section>
        
{/* PREMIUM PROPERTY SHOWCASE 1 */}
<section style={{ maxWidth: 1100, margin: "40px auto", padding: 18, background: "#EAF1EB", border: "1.5px solid #C9A34A", borderRadius: 20, boxShadow: "0 8px 25px rgba(16,38,74,0.10)" }}>
  <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1400" alt="Luxury Dream Property" style={{ width: "100%", height: 330, objectFit: "cover", borderRadius: 14, display: "block" }} />
  <div style={{ textAlign: "center", padding: "25px 15px" }}>
    <h2 style={{ color: "#10264A", fontSize: 29, fontWeight: 800, margin: "0 0 10px" }}>Your Dream Property, Our Priority</h2>
    <h3 style={{ color: "#A77B25", fontSize: 20, fontStyle: "italic", margin: "0 0 15px" }}>Find Your Perfect Place to Call Home</h3>
    <p style={{ color: "#344456", fontSize: 16, lineHeight: 1.9, maxWidth: 850, margin: "0 auto" }}>Discover beautiful homes, premium apartments, commercial spaces and valuable land opportunities. Whether you are searching for your dream home or planning your next property purchase, Real Home Service helps you explore possibilities and find a property that suits your needs.</p>
  </div>
</section>

{/* PREMIUM PROPERTY SHOWCASE 2 - VILLA */}
<section style={{ maxWidth: 1100, margin: "40px auto", padding: 18, background: "#EAF1EB", border: "1.5px solid #C9A34A", borderRadius: 20, boxShadow: "0 8px 25px rgba(16,38,74,0.10)" }}>
  <img src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1400" alt="Luxury Villa" style={{ width: "100%", height: 330, objectFit: "cover", borderRadius: 14, display: "block" }} />
  <div style={{ textAlign: "center", padding: "25px 15px" }}>
    <h2 style={{ color: "#10264A", fontSize: 29, fontWeight: 800, margin: "0 0 10px" }}>Experience the Art of Luxury Living</h2>
    <h3 style={{ color: "#A77B25", fontSize: 20, fontStyle: "italic", margin: "0 0 15px" }}>A Beautiful Villa for a Beautiful Life</h3>
    <p style={{ color: "#344456", fontSize: 16, lineHeight: 1.9, maxWidth: 850, margin: "0 auto" }}>Discover elegant villas that offer privacy, spacious living and timeless beauty. Explore impressive architecture, peaceful surroundings and thoughtfully designed spaces. Find a place where your family can create wonderful memories and enjoy a lifestyle you have always imagined.</p>
  </div>
</section>

{/* PREMIUM PROPERTY SHOWCASE 3 - APARTMENT */}
<section style={{ maxWidth: 1100, margin: "40px auto", padding: 18, background: "#EAF1EB", border: "1.5px solid #C9A34A", borderRadius: 20, boxShadow: "0 8px 25px rgba(16,38,74,0.10)" }}>
  <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1400" alt="Modern Apartment" style={{ width: "100%", height: 330, objectFit: "cover", borderRadius: 14, display: "block" }} />
  <div style={{ textAlign: "center", padding: "25px 15px" }}>
    <h2 style={{ color: "#10264A", fontSize: 29, fontWeight: 800, margin: "0 0 10px" }}>Modern Apartments, Better Living</h2>
    <h3 style={{ color: "#A77B25", fontSize: 20, fontStyle: "italic", margin: "0 0 15px" }}>Designed Around Your Lifestyle</h3>
    <p style={{ color: "#344456", fontSize: 16, lineHeight: 1.9, maxWidth: 850, margin: "0 auto" }}>Step into modern living with apartments designed for comfort, convenience and everyday elegance. Explore attractive homes, smart layouts and locations close to essential facilities. Find an apartment that makes daily life comfortable and gives you a place to truly belong.</p>
  </div>
</section>

{/* PREMIUM PROPERTY SHOWCASE 4 - COMMERCIAL */}
<section style={{ maxWidth: 1100, margin: "40px auto", padding: 18, background: "#EAF1EB", border: "1.5px solid #C9A34A", borderRadius: 20, boxShadow: "0 8px 25px rgba(16,38,74,0.10)" }}>
  <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400" alt="Commercial Property" style={{ width: "100%", height: 330, objectFit: "cover", borderRadius: 14, display: "block" }} />
  <div style={{ textAlign: "center", padding: "25px 15px" }}>
    <h2 style={{ color: "#10264A", fontSize: 29, fontWeight: 800, margin: "0 0 10px" }}>The Perfect Space for Your Business</h2>
    <h3 style={{ color: "#A77B25", fontSize: 20, fontStyle: "italic", margin: "0 0 15px" }}>Where Business Meets Opportunity</h3>
    <p style={{ color: "#344456", fontSize: 16, lineHeight: 1.9, maxWidth: 850, margin: "0 auto" }}>Give your business the right place to grow. Explore commercial properties, office spaces and retail locations that match your business vision. Discover spaces with potential, convenient surroundings and the flexibility to support your next business milestone.</p>
  </div>
</section>

{/* PREMIUM PROPERTY SHOWCASE 5 - LAND */}
<section style={{ maxWidth: 1100, margin: "40px auto", padding: 18, background: "#EAF1EB", border: "1.5px solid #C9A34A", borderRadius: 20, boxShadow: "0 8px 25px rgba(16,38,74,0.10)" }}>
  <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400" alt="Premium Land" style={{ width: "100%", height: 330, objectFit: "cover", borderRadius: 14, display: "block" }} />
  <div style={{ textAlign: "center", padding: "25px 15px" }}>
    <h2 style={{ color: "#10264A", fontSize: 29, fontWeight: 800, margin: "0 0 10px" }}>Build Your Future on the Right Land</h2>
    <h3 style={{ color: "#A77B25", fontSize: 20, fontStyle: "italic", margin: "0 0 15px" }}>Discover a Place Full of Possibilities</h3>
    <p style={{ color: "#344456", fontSize: 16, lineHeight: 1.9, maxWidth: 850, margin: "0 auto" }}>Every great project begins with the right piece of land. Explore land opportunities for your dream home, future development or business plans. Discover different locations and possibilities with Real Home Service and take a confident step towards your property goals.</p>
  </div>
  
</section>
          </div>
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
                  border: "2px solid #D4AF37",
                  borderRadius: 12,
                  background:
  category.slug === "residential" ? "#E8F0E8" :
  category.slug === "commercial" ? "#E8EFF8" :
  category.slug === "land" ? "#EAF3E5" :
  category.slug === "apartment" ? "#F8F0DF" :
  "#F0EAF8",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
                }}
              >
                <img
  src={category.logo}
  alt={category.name}
  style={{
    display: "block",
    width: "100%",
    maxWidth: 230,
    height: 150,
    objectFit: "contain",
    margin: "0 auto 12px",
  }}
/>

                <p
  style={{
    color: "#24344D",
    fontSize: 15,
    fontWeight: 600,
    lineHeight: 1.5,
    margin: "10px 0",
  }}
>
  {category.description}
</p>

                <span
                  style={{
                    display: "inline-block",
                    marginTop: 15,
                    color: "#8A641C",
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
