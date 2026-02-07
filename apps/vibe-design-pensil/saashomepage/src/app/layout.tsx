import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ACME — Build products that matter",
  description: "The modern platform for teams who ship fast.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#09090B] text-white antialiased">{children}</body>
    </html>
  );
}
