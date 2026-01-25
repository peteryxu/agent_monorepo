import type { Metadata } from "next"
import "./globals.css"
import { AppProviders } from "@/providers/app-providers"
import { Header } from "@/components/layout/header"
import { MobileNav } from "@/components/layout/mobile-nav"

export const metadata: Metadata = {
  title: "LinkedIn Clone",
  description: "A LinkedIn clone built with Next.js 15, React 19, and Tailwind CSS",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen">
        <AppProviders>
          <Header />
          <main className="pb-16 lg:pb-0">{children}</main>
          <MobileNav />
        </AppProviders>
      </body>
    </html>
  )
}
