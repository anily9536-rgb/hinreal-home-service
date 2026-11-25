
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

const categories = [
  {
    name: "Residential",
    slug: "residential",
    icon: "🏠",
    description: "Beautiful homes for comfortable living.",
  },
  {
    name: "Commercial",
    slug: "commercial",
    icon: "🏢",
    description: "Shops, offices and business spaces.",
  },
  {
    name: "Land & Plots",
    slug: "land",
    icon: "🌳",
    description: "Find the right land for your future.",
  },
  {
    name: "Apartments",
    slug: "apartment",
    icon: "🏬",
    description: "Modern flats in your preferred location.",
  },
  {
    name: "Luxury Villas",
    slug: "villa",
    icon: "🏡",
    description: "Premium independent homes and villas.",
  },
];

export default function Home() {
  return (
    <>
      <Header />

      <main className="luxury-home">
        <section className="luxury-hero">
          <div className="hero-overlay" />

          <div className="hero-content">
            <span className="hero-tag">
              YOUR PROPERTY. YOUR FUTURE.
            </span>

            <h1>
              Discover a Place
              <br />
              <span>You’ll Love</span>
            </h1>

            <p>
              Find your perfect property with Real Home Service.
              Explore homes, apartments, commercial spaces and land.
            </p>

            <div className="hero-actions">
              <Link href="/category/residential" className="gold-btn">
                Explore Properties
              </Link>

              <Link href="/register" className="outline-btn">
                Get Started
              </Link>
            </div>

            <div className="hero-trust">
              <span>✦ Trusted Property Platform</span>
              <span>✦ Your Property Partner</span>
            </div>
          </div>

          <div className="hero-bottom">
            <span>REAL HOME SERVICE</span>
            <span>FIND YOUR PLACE IN THE WORLD</span>
          </div>
        </section>

        <section className="luxury-categories">
          <div className="section-heading">
            <span className="section-label">EXPLORE WITH US</span>
            <h2>
              Find Your <span>Perfect Property</span>
            </h2>
            <p>
              Explore property options designed around your needs.
            </p>
          </div>

          <div className="luxury-category-grid">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="luxury-category-card"
              >
                <div className="category-icon">
                  {category.icon}
                </div>

                <h3>{category.name}</h3>
                <p>{category.description}</p>

                <span className="category-link">
                  Explore Category <span>→</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="luxury-about">
          <div className="about-image">
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85"
              alt="Luxury modern property"
            />
            <div className="image-caption">
              <span>REAL HOME SERVICE</span>
              <strong>Your Property Journey Starts Here</strong>
            </div>
          </div>

          <div className="about-content">
            <span className="section-label">WHY CHOOSE US</span>
            <h2>
              More Than Just
              <br />
              <span>A Property Platform</span>
            </h2>

            <p>
              Finding the right property is an important decision.
              Real Home Service helps you explore property options
              through a simple and convenient platform.
            </p>

            <div className="feature-list">
              <div className="feature-item">
                <span>01</span>
                <div>
                  <h3>Multiple Categories</h3>
                  <p>Explore residential, commercial, land and more.</p>
                </div>
              </div>

              <div className="feature-item">
                <span>02</span>
                <div>
                  <h3>Simple Experience</h3>
                  <p>Browse property categories with easy navigation.</p>
                </div>
              </div>

              <div className="feature-item">
                <span>03</span>
                <div>
                  <h3>Customer Support</h3>
                  <p>Connect with us whenever you need assistance.</p>
                </div>
              </div>
            </div>

            <Link href="/about" className="gold-btn">
              Know More About Us
            </Link>
          </div>
        </section>

        <section className="luxury-cta">
          <span className="section-label">LET’S FIND YOUR PLACE</span>
          <h2>
            Your Dream Property
            <br />
            <span>Could Be One Click Away.</span>
          </h2>
          <p>
            Join Real Home Service and start exploring property options.
          </p>

          <div className="cta-actions">
            <Link href="/register" className="gold-btn">
              Create Customer Account
            </Link>
            <Link href="/login" className="outline-btn">
              Customer Login
            </Link>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx global>{`
        .luxury-home {
          background: #0b0b0b;
          color: #f8f5ed;
          overflow: hidden;
          font-family: Arial, sans-serif;
        }

        .luxury-home * {
          box-sizing: border-box;
        }

        .luxury-home a {
          text-decoration: none;
        }

        .luxury-hero {
          min-height: 590px;
          position: relative;
          display: flex;
          align-items: center;
          padding: 90px 8%;
          background-image: url("https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=90");
          background-size: cover;
          background-position: center;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            rgba(0,0,0,.94) 0%,
            rgba(0,0,0,.76) 48%,
            rgba(0,0,0,.16) 100%
          );
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 700px;
        }

        .hero-tag,
        .section-label {
          color: #d6b56d;
          font-size: 12px;
          letter-spacing: 3px;
          font-weight: 700;
        }

        .hero-content h1 {
          font-family: Georgia, serif;
          font-size: clamp(43px, 7vw, 76px);
          line-height: 1.12;
          margin: 22px 0;
          color: #fff;
          font-weight: 500;
        }

        .hero-content h1 span,
        .section-heading h2 span,
        .about-content h2 span,
        .luxury-cta h2 span {
          color: #d6b56d;
        }

        .hero-content > p {
          color: #dedbd4;
          font-size: 17px;
          line-height: 1.8;
          max-width: 560px;
        }

        .hero-actions,
        .cta-actions {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          margin-top: 30px;
        }

        .gold-btn,
        .outline-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          padding: 13px 24px;
          font-size: 14px;
          font-weight: 700;
          transition: .25s ease;
        }

        .gold-btn {
          background: linear-gradient(135deg, #f0d58d, #b68a39);
          color: #17130a !important;
          border: 1px solid #d6b56d;
        }

        .gold-btn:hover {
          background: #fff0c4;
          transform: translateY(-3px);
        }

        .outline-btn {
          border: 1px solid #d6b56d;
          color: #f2dfb0 !important;
          background: rgba(0,0,0,.25);
        }

        .outline-btn:hover {
          background: #d6b56d;
          color: #111 !important;
        }

        .hero-trust {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
          margin-top: 42px;
          color: #d6c9aa;
          font-size: 12px;
        }

        .hero-bottom {
          position: absolute;


