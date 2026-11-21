
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <h2>Page Not Found!</h2>
      <p>
        Sorry, the page you are looking for
        does not exist or has been moved.
      </p>

      <Link href="/" className="home-btn">
        Back to Home
      </Link>

      <style jsx>{`
        .not-found {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 20px;
          background: #f5f7fa;
          color: #102a43;
        }

        h1 {
          font-size: 100px;
          color: #2874a6;
        }

        h2 {
          margin-bottom: 15px;
        }

        p {
          margin-bottom: 25px;
        }

        .home-btn {
          background: #2874a6;
          color: white;
          padding: 12px 25px;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
}

