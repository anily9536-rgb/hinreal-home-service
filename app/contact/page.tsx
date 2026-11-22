"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

const companyName = "Real Home Service";
const companyEmail = "anily9536@gmail.com";
const companyPhone = "9173086571";

export default function ContactPage() {
  return (
    <>
      <Header />

      <main className="container" style={{ padding: "30px 20px" }}>
        <h1>Contact Us</h1>

        <p>
          Real Home Service में आपका स्वागत है।
          Property से जुड़ी जानकारी के लिए हमसे संपर्क करें।
        </p>

        <section style={{
          border: "1px solid #ddd",
          borderRadius: 12,
          padding: 20,
          margin: "25px 0",
          maxWidth: 600
        }}>
          <h2>Company Contact Details</h2>

          <p><strong>Company:</strong> {companyName}</p>

          <p>
            <strong>Email:</strong>{" "}
            <a href={`mailto:${companyEmail}`}>
              {companyEmail}
            </a>
          </p>

          <p>
            <strong>Mobile:</strong>{" "}
            <a href={`tel:${companyPhone}`}>
              {companyPhone}
            </a>
          </p>

          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            marginTop: 20
          }}>
            <a href={`tel:${companyPhone}`}>
              📞 Call Us
            </a>

            <a href={`mailto:${companyEmail}`}>
              ✉️ Email Us
            </a>

            <a
              href={`https://wa.me/91${companyPhone}`}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
          </div>
        </section>

        <h2>Send Us Your Enquiry</h2>
        <p>
          Enquiry submit karne ke liye Home Page par
          available Enquiry Form ka use karein.
        </p>
      </main>

      <Footer />
    </>
  );
}
