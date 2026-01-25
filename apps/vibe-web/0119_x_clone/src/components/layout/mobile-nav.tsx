"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Bell, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Search, label: "Explore", href: "/explore" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
  { icon: Mail, label: "Messages", href: "/messages" },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-background md:hidden z-50">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 p-3 flex-1",
                "hover:bg-accent transition-colors"
              )}
              aria-label={item.label}
            >
              <item.icon
                className={cn(
                  "h-6 w-6",
                  isActive ? "stroke-[2.5px]" : "stroke-[1.5px]"
                )}
              />
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
