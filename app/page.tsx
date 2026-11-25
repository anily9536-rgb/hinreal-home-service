
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
          bottom: 20px;
          left: 8%;
          right: 8%;
          display: flex;
          justify-content: space-between;
          gap: 15px;
          color: #d6b56d;
          font-size: 10px;
          letter-spacing: 2px;
          z-index: 2;
        }

        .luxury-categories {
          padding: 85px 7%;
          background: #111;
        }

        .section-heading {
          text-align: center;
          margin-bottom: 45px;
        }

        .section-heading h2,
        .about-content h2,
        .luxury-cta h2 {
          font-family: Georgia, serif;
          font-size: clamp(32px, 4vw, 48px);
          font-weight: 500;
          line-height: 1.2;
          margin: 15px 0;
          color: #fff;
        }

        .section-heading p,
        .luxury-cta > p {
          color: #aaa49a;
          line-height: 1.7;
        }

        .luxury-category-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 18px;
          max-width: 1250px;
          margin: auto;
        }

        .luxury-category-card {
          min-height: 245px;
          padding: 28px 20px;
          background: linear-gradient(145deg, #1b1b1b, #111);
          border: 1px solid #393126;
          color: #fff;
          transition: .3s ease;
        }

        .luxury-category-card:hover {
          transform: translateY(-7px);
          border-color: #d6b56d;
          box-shadow: 0 15px 35px rgba(0,0,0,.3);
        }

        .category-icon {
          font-size: 37px;
          margin-bottom: 20px;
        }

        .luxury-category-card h3 {
          color: #e6cb91;
          font-size: 18px;
          margin: 0 0 12px;
        }

        .luxury-category-card p {
          color: #aaa49a;
          font-size: 13px;
          line-height: 1.7;
          min-height: 55px;
        }

        .category-link {
          display: flex;
          justify-content: space-between;
          margin-top: 22px;
          color: #d6b56d;
          font-size: 12px;
          font-weight: 700;
        }

        .luxury-about {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 65px;
          align-items: center;
          padding: 90px 8%;
          background: #0b0b0b;
        }

        .about-image {
          position: relative;
          min-height: 420px;
        }

        .about-image img {
          width: 100%;
          height: 420px;
          object-fit: cover;
          display: block;
          border: 1px solid #66532f;
        }

        .image-caption {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 22px;
          background: linear-gradient(transparent, rgba(0,0,0,.9));
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .image-caption span {
          color: #d6b56d;
          font-size: 10px;
          letter-spacing: 2px;
        }

        .image-caption strong {
          color: white;
          font-family: Georgia, serif;
          font-size: 21px;
        }

        .about-content > p {
          color: #aaa49a;
          line-height: 1.9;
          margin: 20px 0 28px;
        }

        .feature-list {
          margin-bottom: 30px;
        }

        .feature-item {
          display: flex;
          gap: 18px;
          padding: 17px 0;
          border-bottom: 1px solid #302b22;
        }

        .feature-item > span {
          color: #d6b56d;
          font-family: Georgia, serif;
          font-size: 22px;
        }

        .feature-item h3 {
          color: #f1e5cb;
          margin: 0 0 7px;
          font-size: 16px;
        }

        .feature-item p {
          color: #999;
          margin: 0;
          font-size: 13px;
          line-height: 1.6;
        }

        .luxury-cta {
          text-align: center;
          padding: 85px 20px;
          background:
            linear-gradient(rgba(0,0,0,.88), rgba(0,0,0,.92)),
            url("https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=85")
            center/cover;
          border-top: 1px solid #493b25;
          border-bottom: 1px solid #493b25;
        }

        .luxury-cta h2 {
          margin: 18px 0;
        }

        .luxury-cta .cta-actions {
          justify-content: center;
        }

        @media (max-width: 1000px) {
          .luxury-category-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .luxury-about {
            gap: 35px;
            padding: 70px 5%;
          }
        }

        @media (max-width: 700px) {
          .luxury-hero {
            min-height: 570px;
            padding: 75px 7%;
            background-position: 62% center;
          }

          .hero-content > p {
            font-size: 15px;
          }

          .hero-bottom {
            font-size: 8px;
            letter-spacing: 1px;
          }

          .luxury-categories {
            padding: 65px 5%;
          }

          .luxury-category-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;

    </>
  );
}
