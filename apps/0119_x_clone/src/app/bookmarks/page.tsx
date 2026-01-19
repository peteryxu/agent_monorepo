"use client"

import { MoreHorizontal, Bookmark } from "lucide-react"
import { Sidebar } from "@/components/layout/sidebar"
import { MobileNav } from "@/components/layout/mobile-nav"
import { RightSidebar } from "@/components/layout/right-sidebar"
import { TweetCard } from "@/components/tweet/tweet-card"
import { getBookmarkedTweets, currentUser } from "@/lib/mock-data"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function BookmarksPage() {
  const bookmarkedTweets = getBookmarkedTweets()

  return (
    <div className="min-h-screen flex justify-center">
      <div className="flex w-full max-w-[1265px]">
        {/* Left sidebar */}
        <div className="hidden md:flex w-[68px] lg:w-[275px] flex-shrink-0">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0 max-w-[600px] border-x border-border">
          {/* Header */}
          <div className="sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border">
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <h1 className="font-bold text-xl">Bookmarks</h1>
                <p className="text-sm text-muted-foreground">
                  @{currentUser.username}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger className="p-2 rounded-full hover:bg-accent transition-colors">
                  <MoreHorizontal className="h-5 w-5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="text-destructive">
                    Clear all Bookmarks
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Bookmarks list */}
          <div>
            {bookmarkedTweets.length > 0 ? (
              bookmarkedTweets.map((tweet) => (
                <TweetCard key={tweet.id} tweet={tweet} />
              ))
            ) : (
              <div className="px-8 py-16 text-center">
                <Bookmark className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h2 className="font-bold text-3xl mb-1">
                  Save posts for later
                </h2>
                <p className="text-muted-foreground max-w-xs mx-auto">
                  Bookmark posts to easily find them again in the future.
                </p>
              </div>
            )}
          </div>
        </main>

        {/* Right sidebar */}
        <div className="hidden lg:flex w-[350px] flex-shrink-0">
          <RightSidebar />
        </div>
      </div>

      {/* Mobile navigation */}
      <MobileNav />
    </div>
  )
}
