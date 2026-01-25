"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Search,
  Bell,
  Mail,
  Bookmark,
  User,
  MoreHorizontal,
  Feather,
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

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Search, label: "Explore", href: "/explore" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
  { icon: Mail, label: "Messages", href: "/messages" },
  { icon: Bookmark, label: "Bookmarks", href: "/bookmarks" },
  { icon: User, label: "Profile", href: `/profile/${currentUser.username}` },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="sticky top-0 h-screen flex flex-col justify-between py-2 px-2">
      {/* Logo */}
      <div className="flex flex-col gap-1">
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start p-3 rounded-full hover:bg-accent transition-colors w-fit"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7 fill-foreground"
            aria-hidden="true"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </Link>

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 p-3 rounded-full hover:bg-accent transition-colors w-fit",
                  isActive && "font-bold"
                )}
              >
                <item.icon
                  className={cn("h-6 w-6", isActive && "stroke-[2.5px]")}
                />
                <span className="hidden lg:inline text-xl">{item.label}</span>
              </Link>
            )
          })}

          {/* More dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-4 p-3 rounded-full hover:bg-accent transition-colors w-fit">
                <MoreHorizontal className="h-6 w-6" />
                <span className="hidden lg:inline text-xl">More</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem>Settings and privacy</DropdownMenuItem>
              <DropdownMenuItem>Help Center</DropdownMenuItem>
              <DropdownMenuItem>Display</DropdownMenuItem>
              <DropdownMenuItem>Keyboard shortcuts</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme toggle */}
          <div className="flex items-center gap-4 p-1">
            <ThemeToggle />
            <span className="hidden lg:inline text-sm text-muted-foreground">Theme</span>
          </div>
        </nav>

        {/* Post button */}
        <Button
          className="mt-4 rounded-full h-12 text-lg font-bold hidden lg:flex"
          size="lg"
        >
          Post
        </Button>
        <Button
          className="mt-4 rounded-full h-12 w-12 lg:hidden flex items-center justify-center"
          size="icon"
        >
          <Feather className="h-5 w-5" />
        </Button>
      </div>

      {/* User profile */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-3 p-3 rounded-full hover:bg-accent transition-colors w-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="hidden lg:flex flex-col items-start flex-1 min-w-0">
              <span className="font-bold text-sm truncate">
                {currentUser.name}
              </span>
              <span className="text-muted-foreground text-sm truncate">
                @{currentUser.username}
              </span>
            </div>
            <MoreHorizontal className="h-5 w-5 hidden lg:block" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem>
            Add an existing account
          </DropdownMenuItem>
          <DropdownMenuItem>
            Log out @{currentUser.username}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </aside>
  )
}
