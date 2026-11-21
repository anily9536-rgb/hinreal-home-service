
import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div
        style={{
          maxWidth: "1200px",
          margin: "auto",
          padding: "20px",
        }}
      >
        <h2>Real Home Service</h2>

        <p>
          Your trusted platform for buying, selling
          and renting properties.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "20px",
            margin: "20px 0",
          }}
        >
          <Link href="/">Home</Link>
          <Link href="/about">About Us</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms & Conditions</Link>
        </div>

        <p>
          © {new Date().getFullYear()} Real Home Service.
          All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

