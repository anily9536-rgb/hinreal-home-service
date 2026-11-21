
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <>
      <Header />

      <main className="container">
        <h1>About Real Home Service</h1>

        <p>
          Welcome to Real Home Service, your trusted
          platform for buying, selling and renting
          properties.
        </p>

        <h2>Who We Are</h2>
        <p>
          We help customers find their dream homes,
          residential properties and commercial spaces
          with an easy and reliable property platform.
        </p>

        <h2>Our Mission</h2>
        <p>
          Our mission is to make property buying,
          selling and renting simple, transparent
          and convenient for everyone.
        </p>

        <h2>Why Choose Us?</h2>
        <ul>
          <li>Easy property search</li>
          <li>Simple property posting</li>
          <li>Customer enquiry support</li>
          <li>Reliable property information</li>
        </ul>
      </main>

      <Footer />
    </>
  );
}

