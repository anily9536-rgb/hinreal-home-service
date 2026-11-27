import type { Metadata } from "next";
import "./globals.css";
import SessionExitHandler from "@/components/SessionExitHandler";

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
      <body>
        <SessionExitHandler />
        {children}
      </body>
    </html>
  );
}
