"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, PlusSquare, Bell, Briefcase } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Users, label: "Network", href: "/connections" },
  { icon: PlusSquare, label: "Post", href: "#", isAction: true },
  { icon: Bell, label: "Notifications", href: "/notifications" },
  { icon: Briefcase, label: "Jobs", href: "/jobs" },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 p-2 rounded-lg transition-colors",
                item.isAction
                  ? "text-primary"
                  : isActive
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "h-6 w-6",
                  item.isAction && "h-7 w-7"
                )}
              />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
