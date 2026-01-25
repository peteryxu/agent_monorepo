"use client"

import { ThemeProvider } from "next-themes"
import { Toaster } from "@/components/ui/sonner"

interface AppProvidersProps {
  children: React.ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      {children}
      <Toaster position="bottom-center" richColors />
    </ThemeProvider>
  )
}
