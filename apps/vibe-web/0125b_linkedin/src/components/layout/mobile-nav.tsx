"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, Plus, Bell, Briefcase } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface MobileNavItem {
  href: string
  label: string
  icon: React.ElementType
  isCenter?: boolean
}

const mobileNavItems: MobileNavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/network", label: "My Network", icon: Users },
  { href: "/post/new", label: "Post", icon: Plus, isCenter: true },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border)] bg-[var(--card)] md:hidden">
      <div className="flex h-16 items-center justify-around">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href
          const isCenter = item.isCenter

          if (isCenter) {
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  size="icon"
                  className="h-12 w-12 rounded-full bg-[var(--primary)] text-white shadow-lg hover:bg-[var(--primary-hover)]"
                >
                  <item.icon className="h-6 w-6" />
                  <span className="sr-only">{item.label}</span>
                </Button>
              </Link>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 px-3 py-1.5",
                isActive
                  ? "text-[var(--primary)]"
                  : "text-[var(--muted-foreground)]"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5",
                  isActive && "text-[var(--primary)]"
                )}
              />
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-0 h-0.5 w-8 rounded-t-full bg-[var(--primary)]" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
