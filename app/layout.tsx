import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Real Home Service | Ahmedabad Property Marketplace",
  description: "Find homes, flats, plots and commercial properties in Ahmedabad."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
