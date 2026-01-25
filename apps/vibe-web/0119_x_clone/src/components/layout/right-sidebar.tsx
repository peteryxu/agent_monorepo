"use client"

import Link from "next/link"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { trends, suggestedUsers } from "@/lib/mock-data"
import { formatCount } from "@/lib/utils"
import { VerifiedBadge } from "@/components/tweet/verified-badge"

export function RightSidebar() {
  return (
    <aside className="sticky top-0 h-screen overflow-y-auto py-2 px-4 hidden lg:flex flex-col gap-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search"
          className="pl-10 rounded-full bg-muted border-0 focus-visible:ring-1 focus-visible:ring-primary"
        />
      </div>

      {/* Trends */}
      <div className="bg-muted rounded-2xl overflow-hidden">
        <h2 className="font-bold text-xl px-4 py-3">Trends for you</h2>
        <div className="divide-y divide-border">
          {trends.slice(0, 5).map((trend) => (
            <Link
              key={trend.id}
              href={`/explore?q=${encodeURIComponent(trend.name)}`}
              className="block px-4 py-3 hover:bg-accent/50 transition-colors"
            >
              <p className="text-xs text-muted-foreground">{trend.category}</p>
              <p className="font-bold">{trend.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatCount(trend.posts)} posts
              </p>
            </Link>
          ))}
        </div>
        <Link
          href="/explore"
          className="block px-4 py-3 text-primary hover:bg-accent/50 transition-colors"
        >
          Show more
        </Link>
      </div>

      {/* Who to follow */}
      <div className="bg-muted rounded-2xl overflow-hidden">
        <h2 className="font-bold text-xl px-4 py-3">Who to follow</h2>
        <div className="divide-y divide-border">
          {suggestedUsers.slice(0, 3).map((user) => (
            <div
              key={user.id}
              className="px-4 py-3 hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Link href={`/profile/${user.username}`}>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/profile/${user.username}`}
                    className="hover:underline"
                  >
                    <p className="font-bold truncate flex items-center gap-1">
                      {user.name}
                      {user.verified && <VerifiedBadge />}
                    </p>
                    <p className="text-muted-foreground text-sm truncate">
                      @{user.username}
                    </p>
                  </Link>
                </div>
                <Button variant="secondary" className="rounded-full font-bold">
                  Follow
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Link
          href="/explore"
          className="block px-4 py-3 text-primary hover:bg-accent/50 transition-colors"
        >
          Show more
        </Link>
      </div>

      {/* Footer */}
      <nav className="text-xs text-muted-foreground px-4 flex flex-wrap gap-x-3 gap-y-1">
        <Link href="#" className="hover:underline">Terms of Service</Link>
        <Link href="#" className="hover:underline">Privacy Policy</Link>
        <Link href="#" className="hover:underline">Cookie Policy</Link>
        <Link href="#" className="hover:underline">Accessibility</Link>
        <Link href="#" className="hover:underline">Ads info</Link>
        <span>© 2024 X Corp.</span>
      </nav>
    </aside>
  )
}
