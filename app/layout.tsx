import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Real Home Service | Ahmedabad",
  description: "Buy, sell and rent properties in Ahmedabad."
};
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>;
}
