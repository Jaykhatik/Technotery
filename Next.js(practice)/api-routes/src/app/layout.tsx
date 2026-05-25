import "./globals.css";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#141821",
              color: "#f3f4f6",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              fontFamily: "Outfit, sans-serif",
            },
          }}
        />
      </body>
    </html>
  );
}
