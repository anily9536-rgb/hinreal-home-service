import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function Home() {
  const { data } = await supabase
    .from("properties")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  return (
    <>
      <Header />
      <section className="hero">
        <div className="wrap">
          <div className="eyebrow">Ahmedabad Property Marketplace</div>
          <h1>Find a place to call home.</h1>
          <p>Buy or rent homes, flats, plots and commercial properties.</p>
          <form className="search" action="/">
            <select name="type">
              <option value="">Buy or Rent</option>
              <option value="Buy">Buy</option>
              <option value="Rent">Rent</option>
            </select>
            <input name="q" placeholder="Search locality" />
            <button className="btn">Search</button>
          </form>
        </div>
      </section>

      <main className="wrap section">
        <h2>Featured Properties</h2>
        <div className="grid">
          {(data || []).map((p) => (
            <Link className="card" href={`/property/${p.id}`} key={p.id}>
              <img
                className="photo"
                src={p.images?.[0] || ""}
                alt={p.title}
              />
              <div className="cardbody">
                <span className="tag">{p.listing_type} · {p.property_type}</span>
                <h3>{p.title}</h3>
                <div className="price">
                  ₹{Number(p.price).toLocaleString("en-IN")}
                </div>
                <p className="muted">{p.locality}, Ahmedabad</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
