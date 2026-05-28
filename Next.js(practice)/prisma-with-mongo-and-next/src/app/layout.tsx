import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Prisma Posts",
  description: "A simple posts workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <header className="topbar">
            <div className="topbar-inner">
              <Link href="/posts" className="brand">
                <span className="brand-mark">P</span>
                <span>Prisma Posts</span>
              </Link>
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
