import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Premium Products | Cloud Catalog",
  description: "Browse our elite, next-generation product collection connected directly to a secure MongoDB database.",
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
