import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rocket Launch Terminal",
  description: "NASA Mission Control style rocket launch terminal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&family=IBM+Plex+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full">{children}</body>
    </html>
  );
}
