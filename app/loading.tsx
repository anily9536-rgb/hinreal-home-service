
export default function Loading() {
  return (
    <div className="loading-container">
      <div className="loader"></div>
      <h2>Real Home Service</h2>
      <p>Please wait, loading...</p>

      <style jsx>{`
        .loading-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: #f5f7fa;
          color: #102a43;
          gap: 15px;
        }

        .loader {
          width: 50px;
          height: 50px;
          border: 5px solid #ddd;
          border-top: 5px solid #2874a6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

