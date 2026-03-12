import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FTH Mission Control",
  description: "Fast Track Homes LLC — Enzo Mission Control",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
