"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Bell, Mail, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { currentUser } from "@/lib/mock-data"

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/explore", label: "Explore", icon: Search },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/messages", label: "Messages", icon: Mail },
  { href: `/profile/${currentUser.username}`, label: "Profile", icon: User },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-center p-3 rounded-full hover:bg-muted transition-colors",
                isActive && "text-primary"
              )}
              aria-label={item.label}
            >
              <item.icon
                className="h-6 w-6"
                strokeWidth={isActive ? 2.5 : 2}
              />
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
