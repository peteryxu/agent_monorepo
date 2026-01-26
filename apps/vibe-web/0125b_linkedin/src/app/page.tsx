"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import Link from "next/link"
import { Bookmark, Hash, ChevronDown, ChevronUp } from "lucide-react"

import { ProfileCard, RightSidebar, MobileNav } from "@/components/layout"
import { PostComposer } from "@/components/post"
import { Feed, ControlledFeedTabs, FeedSkeleton, type FeedTabValue, type FeedSortValue } from "@/components/feed"
import { posts } from "@/lib/mock-data"
import type { Post } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// =============================================================================
// Left Sidebar Sections
// =============================================================================

const savedItems = [
  { label: "My items", count: 12 },
  { label: "Saved posts", count: 8 },
  { label: "Saved jobs", count: 24 },
]

const followedHashtags = [
  { tag: "javascript", followers: "2.1M" },
  { tag: "react", followers: "1.8M" },
  { tag: "typescript", followers: "1.2M" },
  { tag: "webdevelopment", followers: "980K" },
  { tag: "careergrowth", followers: "750K" },
]

function SavedItemsSection() {
  return (
    <Card>
      <CardHeader className="py-3 px-4">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Bookmark className="h-4 w-4" />
          Saved Items
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 py-0">
        {savedItems.map((item) => (
          <Link
            key={item.label}
            href={`/my-items/${item.label.toLowerCase().replace(" ", "-")}`}
            className="flex items-center justify-between px-4 py-2 text-sm hover:bg-[var(--accent)] transition-colors"
          >
            <span className="text-[var(--muted-foreground)]">{item.label}</span>
            <span className="text-xs font-medium text-[var(--primary)]">{item.count}</span>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}

function FollowedHashtagsSection() {
  const [showAll, setShowAll] = useState(false)
  const displayedHashtags = showAll ? followedHashtags : followedHashtags.slice(0, 3)

  return (
    <Card>
      <CardHeader className="py-3 px-4">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Hash className="h-4 w-4" />
          Followed Hashtags
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 py-0">
        {displayedHashtags.map((hashtag) => (
          <Link
            key={hashtag.tag}
            href={`/hashtag/${hashtag.tag}`}
            className="flex items-center justify-between px-4 py-2 text-sm hover:bg-[var(--accent)] transition-colors"
          >
            <span className="text-[var(--foreground)] font-medium">#{hashtag.tag}</span>
            <span className="text-xs text-[var(--muted-foreground)]">{hashtag.followers}</span>
          </Link>
        ))}
        {followedHashtags.length > 3 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="w-full justify-start text-[var(--muted-foreground)] px-4"
          >
            {showAll ? (
              <>
                Show less <ChevronUp className="ml-1 h-4 w-4" />
              </>
            ) : (
              <>
                Show more <ChevronDown className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// =============================================================================
// Main Home Page
// =============================================================================

const POSTS_PER_PAGE = 10

export default function Home() {
  // State
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<FeedTabValue>("all")
  const [sortBy, setSortBy] = useState<FeedSortValue>("recent")
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  // Client-side mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
    // Simulate initial load
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  // Filter posts based on active tab
  const filteredPosts = useMemo(() => {
    if (!mounted) return []

    let filtered: Post[] = [...posts]

    // Filter by tab
    switch (activeTab) {
      case "posts":
        filtered = filtered.filter((p) => p.type === "text" || p.type === "celebration")
        break
      case "articles":
        filtered = filtered.filter((p) => p.type === "article")
        break
      case "jobs":
        filtered = filtered.filter((p) => p.type === "job-share")
        break
      case "documents":
        // No document type in current data, show empty
        filtered = []
        break
      case "all":
      default:
        // Show all
        break
    }

    // Sort posts
    if (sortBy === "recent") {
      filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    } else if (sortBy === "top") {
      filtered.sort((a, b) => b.totalReactions - a.totalReactions)
    }

    return filtered
  }, [mounted, activeTab, sortBy])

  // Visible posts (for pagination)
  const visiblePosts = useMemo(() => {
    return filteredPosts.slice(0, visibleCount)
  }, [filteredPosts, visibleCount])

  // Check if there are more posts to load
  const hasMore = visibleCount < filteredPosts.length

  // Handle infinite scroll load more
  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return

    setIsLoadingMore(true)
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300))
    setVisibleCount((prev) => Math.min(prev + POSTS_PER_PAGE, filteredPosts.length))
    setIsLoadingMore(false)
  }, [isLoadingMore, hasMore, filteredPosts.length])

  // Reset visible count when filter changes
  useEffect(() => {
    setVisibleCount(POSTS_PER_PAGE)
  }, [activeTab, sortBy])

  // Handle post creation
  const handlePost = (content: string, audience: string) => {
    console.log("New post:", { content, audience })
    // In a real app, this would call an API
  }

  // Handle post click
  const handlePostClick = (post: Post, index: number) => {
    console.log("Post clicked:", post.id, "at index", index)
    // In a real app, this could open a modal or navigate
  }

  return (
    <>
      <main className="mx-auto max-w-[1128px] px-4 py-4 lg:py-6">
        <div className="flex gap-6">
          {/* Left Sidebar - 275px, hidden on mobile/tablet */}
          <aside className="hidden xl:block w-[275px] flex-shrink-0 space-y-4">
            <ProfileCard />
            <SavedItemsSection />
            <FollowedHashtagsSection />
          </aside>

          {/* Center Feed - 600px max */}
          <div className="flex-1 max-w-[600px] min-w-0 space-y-4">
            {/* Post Composer */}
            <PostComposer onPost={handlePost} />

            {/* Feed Tabs */}
            <ControlledFeedTabs
              tab={activeTab}
              sort={sortBy}
              onTabChange={setActiveTab}
              onSortChange={setSortBy}
              sticky
            />

            {/* Feed Content */}
            {!mounted || isLoading ? (
              <FeedSkeleton count={5} />
            ) : visiblePosts.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-[var(--muted-foreground)]">
                  No {activeTab === "all" ? "posts" : activeTab} to show.
                </p>
                <p className="text-sm text-[var(--muted-foreground)] mt-2">
                  Try a different filter or check back later.
                </p>
              </Card>
            ) : (
              <div className="h-[calc(100vh-320px)] min-h-[500px]">
                <Feed
                  posts={visiblePosts}
                  isLoading={isLoadingMore}
                  hasMore={hasMore}
                  onLoadMore={handleLoadMore}
                  onPostClick={handlePostClick}
                  keyboardNavigation
                  estimatedRowHeight={350}
                  overscan={3}
                />
              </div>
            )}
          </div>

          {/* Right Sidebar - 300px, hidden on mobile/small tablets */}
          <RightSidebar />
        </div>
      </main>

      {/* Mobile Navigation - visible on mobile only */}
      <MobileNav />

      {/* Add padding at bottom for mobile nav */}
      <div className="h-16 md:hidden" />
    </>
  )
}
