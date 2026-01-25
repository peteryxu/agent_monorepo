"use client"

import { ThemeProvider } from "next-themes"
import { Toaster } from "sonner"

interface AppProvidersProps {
  children: React.ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Toaster
        position="bottom-left"
        toastOptions={{
          className: "bg-card text-card-foreground border-border",
        }}
      />
    </ThemeProvider>
  )
}
