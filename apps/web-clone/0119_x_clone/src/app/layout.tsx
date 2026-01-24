import type { Metadata } from "next"
import "./globals.css"
import { AppProviders } from "@/providers/app-providers"

export const metadata: Metadata = {
  title: "X Clone",
  description: "A beautiful Twitter/X clone prototype",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
