

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Real Home Service",
  description: "Buy, Sell and Rent Properties Easily",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
