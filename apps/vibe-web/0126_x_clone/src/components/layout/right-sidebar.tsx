"use client"

import { useState } from "react"
import Link from "next/link"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { trendingTopics, suggestedUsers } from "@/lib/mock-data"
import { formatCount } from "@/lib/utils"
import { toast } from "sonner"

export function RightSidebar() {
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set())

  const handleFollow = (userId: string, name: string) => {
    setFollowedUsers((prev) => {
      const next = new Set(prev)
      if (next.has(userId)) {
        next.delete(userId)
        toast.success(`Unfollowed ${name}`)
      } else {
        next.add(userId)
        toast.success(`Following ${name}`)
      }
      return next
    })
  }

  return (
    <aside className="sticky top-0 h-screen py-2 px-4 space-y-4 overflow-y-auto">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search"
          className="pl-12 rounded-full bg-muted border-0 focus-visible:ring-1 focus-visible:ring-primary"
        />
      </div>

      {/* Trending */}
      <Card className="bg-muted/50 border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">What's happening</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {trendingTopics.slice(0, 5).map((trend) => (
            <Link
              key={trend.id}
              href={`/explore?q=${encodeURIComponent(trend.topic)}`}
              className="block px-4 py-3 hover:bg-muted transition-colors"
            >
              <p className="text-xs text-muted-foreground">{trend.category}</p>
              <p className="font-bold">#{trend.topic}</p>
              <p className="text-xs text-muted-foreground">
                {formatCount(trend.tweetCount)} posts
              </p>
            </Link>
          ))}
          <Link
            href="/explore"
            className="block px-4 py-3 text-primary hover:bg-muted transition-colors"
          >
            Show more
          </Link>
        </CardContent>
      </Card>

      {/* Who to follow */}
      <Card className="bg-muted/50 border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Who to follow</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {suggestedUsers.slice(0, 3).map((user) => {
            const isFollowing = followedUsers.has(user.id)

            return (
              <div
                key={user.id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors"
              >
                <Link href={`/profile/${user.username}`}>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/profile/${user.username}`}
                    className="font-bold text-sm hover:underline truncate block"
                  >
                    {user.name}
                    {user.verified && (
                      <svg
                        viewBox="0 0 22 22"
                        className="inline-block h-4 w-4 ml-1 fill-primary"
                        aria-label="Verified account"
                      >
                        <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
                      </svg>
                    )}
                  </Link>
                  <Link
                    href={`/profile/${user.username}`}
                    className="text-sm text-muted-foreground truncate block"
                  >
                    @{user.username}
                  </Link>
                </div>
                <Button
                  variant={isFollowing ? "outline" : "default"}
                  size="sm"
                  className="rounded-full font-bold"
                  onClick={() => handleFollow(user.id, user.name)}
                >
                  {isFollowing ? "Following" : "Follow"}
                </Button>
              </div>
            )
          })}
          <Link
            href="/explore"
            className="block px-4 py-3 text-primary hover:bg-muted transition-colors"
          >
            Show more
          </Link>
        </CardContent>
      </Card>

      {/* Footer links */}
      <div className="px-4 text-xs text-muted-foreground space-x-2">
        <Link href="#" className="hover:underline">Terms of Service</Link>
        <Link href="#" className="hover:underline">Privacy Policy</Link>
        <Link href="#" className="hover:underline">Cookie Policy</Link>
        <Link href="#" className="hover:underline">Accessibility</Link>
        <span className="block mt-1">© 2026 X Clone</span>
      </div>
    </aside>
  )
}
