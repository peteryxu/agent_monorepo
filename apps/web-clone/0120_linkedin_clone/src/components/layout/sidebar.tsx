"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Users,
  Briefcase,
  MessageSquare,
  Bell,
  MoreHorizontal,
  PenSquare,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "./theme-toggle"
import { currentUser } from "@/lib/mock-data"
import { getInitials } from "@/lib/utils"

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Users, label: "My Network", href: "/connections" },
  { icon: Briefcase, label: "Jobs", href: "/jobs" },
  { icon: MessageSquare, label: "Messaging", href: "/messaging" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="sticky top-0 h-screen flex flex-col justify-between py-3 px-2">
      {/* Logo */}
      <div className="flex flex-col gap-1">
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start p-2 rounded-lg hover:bg-accent transition-colors w-fit"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-8 w-8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
              fill="var(--primary)"
            />
          </svg>
          <span className="hidden lg:inline ml-1 text-xl font-bold text-primary">
            LinkedIn
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex flex-col gap-0.5 mt-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors w-full",
                  isActive && "bg-accent"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 flex-shrink-0",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}
                />
                <span
                  className={cn(
                    "hidden lg:inline text-sm",
                    isActive ? "font-semibold text-foreground" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            )
          })}

          {/* Profile link */}
          <Link
            href={`/profile/${currentUser.username}`}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors w-full",
              pathname.includes("/profile") && "bg-accent"
            )}
          >
            <Avatar className="h-5 w-5">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback className="text-[10px]">
                {getInitials(currentUser.name)}
              </AvatarFallback>
            </Avatar>
            <span
              className={cn(
                "hidden lg:inline text-sm",
                pathname.includes("/profile")
                  ? "font-semibold text-foreground"
                  : "text-muted-foreground"
              )}
            >
              Me
            </span>
          </Link>

          {/* More dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors w-full text-muted-foreground">
                <MoreHorizontal className="h-5 w-5" />
                <span className="hidden lg:inline text-sm">More</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem>Settings & Privacy</DropdownMenuItem>
              <DropdownMenuItem>Help Center</DropdownMenuItem>
              <DropdownMenuItem>Language</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme toggle */}
          <div className="flex items-center gap-3 p-1 mt-1">
            <ThemeToggle />
            <span className="hidden lg:inline text-xs text-muted-foreground">
              Theme
            </span>
          </div>
        </nav>

        {/* Post button */}
        <Button
          className="mt-4 rounded-full h-10 font-semibold hidden lg:flex gap-2"
        >
          <PenSquare className="h-4 w-4" />
          Post
        </Button>
        <Button
          className="mt-4 rounded-full h-10 w-10 lg:hidden flex items-center justify-center"
          size="icon"
        >
          <PenSquare className="h-5 w-5" />
        </Button>
      </div>

      {/* User profile card (mini) */}
      <div className="hidden lg:block">
        <div className="p-3 rounded-lg bg-card border">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {currentUser.headline}
              </p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t flex justify-between text-xs">
            <div>
              <p className="text-muted-foreground">Connections</p>
              <p className="font-semibold text-primary">{currentUser.connections}</p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground">Profile views</p>
              <p className="font-semibold text-primary">347</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
