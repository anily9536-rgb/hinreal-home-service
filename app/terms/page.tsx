
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <>
      <Header />

      <main className="container">
        <h1>Terms & Conditions</h1>

        <p>
          Welcome to Real Home Service. By using our
          website, you agree to these terms and conditions.
        </p>

        <h2>1. Website Services</h2>
        <p>
          Our platform helps users discover, post,
          buy, sell and rent properties.
        </p>

        <h2>2. User Responsibilities</h2>
        <p>
          Users must provide accurate information when
          creating accounts or posting properties.
        </p>

        <h2>3. Property Listings</h2>
        <p>
          Property listings may be reviewed by our
          administration before publication.
        </p>

        <h2>4. Account Security</h2>
        <p>
          Users are responsible for keeping their
          login credentials secure.
        </p>

        <h2>5. Disclaimer</h2>
        <p>
          Users should independently verify property
          details, ownership and legal documents before
          completing any transaction.
        </p>

        <h2>6. Changes to Terms</h2>
        <p>
          We may update these terms when necessary.
        </p>

        <h2>7. Contact</h2>
        <p>
          For questions about these terms, please
          contact Real Home Service.
        </p>
      </main>

      <Footer />
    </>
  );
}

