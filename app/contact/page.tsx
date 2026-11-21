
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ContactPage() {
  return (
    <>
      <Header />

      <main className="container">
        <h1>Contact Us</h1>
        <p>We are here to help you with your property needs.</p>

        <section>
          <h2>Get In Touch</h2>

          <p>
            <strong>Company:</strong> Real Home Service
          </p>

          <p>
            <strong>Email:</strong> support@realhomeservice.com
          </p>

          <p>
            <strong>Phone:</strong> Contact our support team
          </p>

          <p>
            <strong>Services:</strong> Buy, Sell and Rent Properties
          </p>
        </section>

        <section>
          <h2>Send Us Your Enquiry</h2>

          <form action="mailto:support@realhomeservice.com" method="post" encType="text/plain">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              required
            />

            <input
              type="tel"
              name="phone"
              placeholder="Your Phone Number"
              required
            />

            <textarea
              name="message"
              placeholder="Your Message"
              rows={5}
              required
            />

            <button type="submit">Send Enquiry</button>
          </form>
        </section>
      </main>

      <Footer />
    </>
  );
}

