"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Users,
  Briefcase,
  MessageSquare,
  Bell,
  ChevronDown,
  Linkedin,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { currentUser } from "@/lib/mock-data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/network", label: "My Network", icon: Users },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
  { href: "/messaging", label: "Messaging", icon: MessageSquare },
  { href: "/notifications", label: "Notifications", icon: Bell },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[72px] flex-col border-r border-[var(--border)] bg-[var(--card)] md:flex lg:w-[220px]">
      {/* LinkedIn Logo */}
      <div className="flex h-14 items-center justify-center border-b border-[var(--border)] lg:justify-start lg:px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-[var(--primary)]">
            <Linkedin className="h-5 w-5 text-white" />
          </div>
          <span className="hidden text-xl font-semibold text-[var(--primary)] lg:inline">
            LinkedIn
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 p-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center justify-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors lg:justify-start",
                isActive
                  ? "bg-[var(--accent)] text-[var(--primary)]"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 shrink-0",
                  isActive
                    ? "text-[var(--primary)]"
                    : "text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]"
                )}
              />
              <span className="hidden lg:inline">{item.label}</span>
              {isActive && (
                <span className="ml-auto hidden h-1.5 w-1.5 rounded-full bg-[var(--primary)] lg:block" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Me Dropdown */}
      <div className="border-t border-[var(--border)] p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-auto w-full items-center justify-center gap-2 px-3 py-2.5 lg:justify-start"
            >
              <Avatar className="h-7 w-7">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback>
                  {currentUser.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden flex-1 text-left lg:block">
                <p className="text-xs font-medium leading-tight">Me</p>
                <ChevronDown className="mt-0.5 h-3 w-3 text-[var(--muted-foreground)]" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <div className="flex items-center gap-3 p-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback>
                  {currentUser.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-0.5">
                <p className="text-sm font-semibold">{currentUser.name}</p>
                <p className="line-clamp-2 text-xs text-[var(--muted-foreground)]">
                  {currentUser.headline}
                </p>
              </div>
            </div>
            <Link href="/profile">
              <Button
                variant="outline"
                size="sm"
                className="mx-3 mb-2 w-[calc(100%-24px)]"
              >
                View Profile
              </Button>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings">Settings & Privacy</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/help">Help</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/language">Language</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-[var(--destructive)]">
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Premium Upsell */}
        <div className="mt-2 hidden lg:block">
          <Button
            variant="outline"
            size="sm"
            className="w-full border-amber-500 text-amber-600 hover:bg-amber-50 hover:text-amber-700"
          >
            Try Premium Free
          </Button>
        </div>
      </div>
    </aside>
  )
}
