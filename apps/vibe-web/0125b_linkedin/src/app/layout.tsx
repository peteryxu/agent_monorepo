import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/providers/app-providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "LinkedIn Clone",
  description: "A professional networking platform clone built with Next.js 15",
  keywords: ["linkedin", "professional", "networking", "jobs", "social"],
  authors: [{ name: "LinkedIn Clone" }],
  openGraph: {
    title: "LinkedIn Clone",
    description: "A professional networking platform clone built with Next.js 15",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
