"use client"

import Link from "next/link"
import { Search, Info } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { trendingTopics, getConnectionSuggestions } from "@/lib/mock-data"
import { getInitials, formatCount } from "@/lib/utils"

export function RightSidebar() {
  const suggestions = getConnectionSuggestions()

  return (
    <aside className="sticky top-0 h-screen overflow-y-auto py-3 px-4 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search"
          className="pl-10 bg-secondary border-0 rounded-md h-9"
        />
      </div>

      {/* LinkedIn News */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            LinkedIn News
            <Info className="h-4 w-4 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {trendingTopics.slice(0, 5).map((topic) => (
            <Link
              key={topic.id}
              href="#"
              className="block group"
            >
              <div className="flex items-start gap-2">
                <span className="text-muted-foreground mt-1">•</span>
                <div>
                  <p className="text-sm font-medium group-hover:text-primary group-hover:underline line-clamp-2">
                    {topic.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {topic.timeAgo} ago • {formatCount(topic.readers)} readers
                  </p>
                </div>
              </div>
            </Link>
          ))}
          <Button variant="ghost" className="w-full text-muted-foreground text-sm h-8">
            Show more
          </Button>
        </CardContent>
      </Card>

      {/* Add to your feed */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Add to your feed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {suggestions.slice(0, 3).map((user) => (
            <div key={user.id} className="flex gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/profile/${user.username}`}
                  className="font-semibold text-sm hover:underline hover:text-primary line-clamp-1"
                >
                  {user.name}
                </Link>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {user.headline}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 rounded-full h-7 text-xs font-semibold"
                >
                  + Follow
                </Button>
              </div>
            </div>
          ))}
          <Button variant="ghost" className="w-full text-muted-foreground text-sm h-8">
            View all recommendations
          </Button>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-xs text-muted-foreground space-y-2 px-2">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <Link href="#" className="hover:underline hover:text-primary">About</Link>
          <Link href="#" className="hover:underline hover:text-primary">Accessibility</Link>
          <Link href="#" className="hover:underline hover:text-primary">Help Center</Link>
        </div>
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <Link href="#" className="hover:underline hover:text-primary">Privacy & Terms</Link>
          <Link href="#" className="hover:underline hover:text-primary">Ad Choices</Link>
        </div>
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <Link href="#" className="hover:underline hover:text-primary">Advertising</Link>
          <Link href="#" className="hover:underline hover:text-primary">Business Services</Link>
        </div>
        <p className="pt-2">
          <span className="font-semibold text-primary">LinkedIn</span> Clone 2024
        </p>
      </div>
    </aside>
  )
}
