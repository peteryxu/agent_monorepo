"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import {
  Home,
  Search,
  Bell,
  Mail,
  Bookmark,
  User,
  MoreHorizontal,
  Feather,
  Moon,
  Sun,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { currentUser } from "@/lib/mock-data"

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/explore", label: "Explore", icon: Search },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/messages", label: "Messages", icon: Mail },
  { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
  { href: `/profile/${currentUser.username}`, label: "Profile", icon: User },
]

export function Sidebar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  return (
    <aside className="sticky top-0 h-screen flex flex-col py-2 px-2 lg:px-4">
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center justify-center lg:justify-start p-3 rounded-full hover:bg-muted transition-colors w-fit"
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-label="X">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 mt-2 space-y-1">
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
                "flex items-center gap-4 p-3 rounded-full hover:bg-muted transition-colors text-xl",
                "lg:pr-6",
                isActive && "font-bold"
              )}
            >
              <item.icon
                className="h-7 w-7"
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="hidden lg:inline">{item.label}</span>
            </Link>
          )
        })}

        {/* More dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-4 p-3 rounded-full hover:bg-muted transition-colors text-xl w-full lg:pr-6">
              <MoreHorizontal className="h-7 w-7" />
              <span className="hidden lg:inline">More</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <DropdownMenuItem
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="gap-3 py-3"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-3 py-3">
              Settings and privacy
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-3 py-3">
              Help Center
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-3 py-3">
              Display
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Post button */}
        <Button
          className="w-full mt-4 rounded-full py-6 text-lg font-bold hidden lg:flex"
          size="lg"
        >
          Post
        </Button>

        {/* Mobile post button */}
        <Button
          className="lg:hidden w-14 h-14 rounded-full p-0 flex items-center justify-center mt-4"
          size="icon"
        >
          <Feather className="h-6 w-6" />
        </Button>
      </nav>

      {/* User profile button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-3 p-3 rounded-full hover:bg-muted transition-colors mt-auto w-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
            </Avatar>
            <div className="hidden lg:flex flex-col items-start flex-1 min-w-0">
              <span className="font-bold text-sm truncate w-full">
                {currentUser.name}
              </span>
              <span className="text-muted-foreground text-sm truncate w-full">
                @{currentUser.username}
              </span>
            </div>
            <MoreHorizontal className="h-5 w-5 hidden lg:block" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuItem className="gap-3 py-3">
            Add an existing account
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-3 py-3">
            Log out @{currentUser.username}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </aside>
  )
}
