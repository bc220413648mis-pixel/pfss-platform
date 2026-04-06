import "./globals.css"; // Ensure this is at the VERY TOP
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pathfinder",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}