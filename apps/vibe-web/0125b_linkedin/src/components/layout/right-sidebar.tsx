"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Info, ChevronDown, ChevronUp } from "lucide-react"

import { users } from "@/lib/mock-data"
import type { User } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

// Static trending topics (no randomization needed)
const trendingTopics = [
  { title: "Tech layoffs slow as AI hiring surges", readers: "2,847" },
  { title: "Remote work policies evolving in 2025", readers: "1,923" },
  { title: "Startup funding rebounds after downturn", readers: "1,456" },
  { title: "New skills for AI-enhanced workplaces", readers: "1,234" },
  { title: "Healthcare tech innovations growing", readers: "987" },
]

// Static hashtag suggestions
const hashtagSuggestions = [
  { tag: "artificialintelligence", followers: "5.2M" },
  { tag: "technology", followers: "4.8M" },
  { tag: "careerdevelopment", followers: "3.1M" },
]

// Static footer links
const footerLinks = [
  { label: "About", href: "/about" },
  { label: "Accessibility", href: "/accessibility" },
  { label: "Help Center", href: "/help" },
  { label: "Privacy & Terms", href: "/privacy" },
  { label: "Ad Choices", href: "/ad-choices" },
  { label: "Advertising", href: "/advertising" },
  { label: "Business Services", href: "/business" },
]

export function RightSidebar() {
  const [showAllNews, setShowAllNews] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [suggestedConnections, setSuggestedConnections] = useState<User[]>([])

  // Client-only rendering for dynamic data
  useEffect(() => {
    setMounted(true)
    // Get 3 users deterministically (sorted by followers)
    const sorted = [...users].sort((a, b) => b.followers - a.followers)
    setSuggestedConnections(sorted.slice(1, 4)) // Skip first (currentUser)
  }, [])

  const displayedTopics = showAllNews ? trendingTopics : trendingTopics.slice(0, 5)

  return (
    <aside className="hidden w-[300px] flex-shrink-0 space-y-4 lg:block">
      {/* LinkedIn News */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-base">
            <span>LinkedIn News</span>
            <Info className="h-4 w-4 text-[var(--muted-foreground)]" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {displayedTopics.map((topic, index) => (
            <Link
              key={index}
              href="#"
              className="group block"
            >
              <div className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--foreground)]" />
                <div>
                  <p className="text-sm font-medium leading-tight group-hover:text-[var(--primary)] group-hover:underline">
                    {topic.title}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {topic.readers} readers
                  </p>
                </div>
              </div>
            </Link>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-[var(--muted-foreground)]"
            onClick={() => setShowAllNews(!showAllNews)}
          >
            {showAllNews ? (
              <>
                Show less <ChevronUp className="ml-1 h-4 w-4" />
              </>
            ) : (
              <>
                Show more <ChevronDown className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Add to your feed */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Add to your feed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {hashtagSuggestions.map((hashtag) => (
            <div key={hashtag.tag} className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[var(--secondary)] text-lg font-semibold text-[var(--muted-foreground)]">
                #
              </div>
              <div className="flex-1 space-y-1">
                <Link
                  href={`/hashtag/${hashtag.tag}`}
                  className="text-sm font-semibold hover:text-[var(--primary)] hover:underline"
                >
                  #{hashtag.tag}
                </Link>
                <p className="text-xs text-[var(--muted-foreground)]">
                  {hashtag.followers} followers
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-1 h-7 gap-1 rounded-full px-3"
                >
                  <Plus className="h-3 w-3" />
                  Follow
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* People you may know */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">People you may know</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mounted && suggestedConnections.map((user) => (
            <div key={user.id} className="flex items-start gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>
                  {user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <Link
                  href={`/profile/${user.id}`}
                  className="text-sm font-semibold hover:text-[var(--primary)] hover:underline"
                >
                  {user.name}
                </Link>
                <p className="line-clamp-2 text-xs text-[var(--muted-foreground)]">
                  {user.headline}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-1 h-7 gap-1 rounded-full px-3"
                >
                  <Plus className="h-3 w-3" />
                  Connect
                </Button>
              </div>
            </div>
          ))}
          {!mounted && (
            // Skeleton while loading
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-12 w-12 animate-pulse rounded-full bg-[var(--muted)]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-24 animate-pulse rounded bg-[var(--muted)]" />
                    <div className="h-3 w-full animate-pulse rounded bg-[var(--muted)]" />
                    <div className="h-7 w-20 animate-pulse rounded-full bg-[var(--muted)]" />
                  </div>
                </div>
              ))}
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-[var(--muted-foreground)]"
            asChild
          >
            <Link href="/network">View all recommendations</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="space-y-3 px-2">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          {footerLinks.map((link, index) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-xs text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:underline"
            >
              {link.label}
              {index < footerLinks.length - 1 && (
                <span className="ml-2">-</span>
              )}
            </Link>
          ))}
        </div>
        <Separator />
        <div className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
          <span className="font-semibold text-[var(--primary)]">LinkedIn</span>
          <span>Corporation 2025</span>
        </div>
      </div>
    </aside>
  )
}
