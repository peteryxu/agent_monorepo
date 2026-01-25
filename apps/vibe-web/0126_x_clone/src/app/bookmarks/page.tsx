"use client"

import Link from "next/link"
import { ArrowLeft, MoreHorizontal } from "lucide-react"
import { Sidebar } from "@/components/layout/sidebar"
import { MobileNav } from "@/components/layout/mobile-nav"
import { RightSidebar } from "@/components/layout/right-sidebar"
import { TweetCard } from "@/components/tweet/tweet-card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { bookmarkedTweets, currentUser } from "@/lib/mock-data"
import { toast } from "sonner"

export default function BookmarksPage() {
  const handleClearAll = () => {
    toast.success("All bookmarks cleared")
  }

  return (
    <div className="min-h-screen flex justify-center">
      <div className="w-full max-w-[1265px] flex">
        {/* Left sidebar */}
        <div className="hidden md:flex w-[68px] lg:w-[275px] shrink-0 border-r border-border">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0 max-w-[600px] border-r border-border">
          {/* Header */}
          <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b border-border flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors md:hidden"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold">Bookmarks</h1>
                <p className="text-sm text-muted-foreground">
                  @{currentUser.username}
                </p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={handleClearAll}
                >
                  Clear all bookmarks
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>

          {/* Bookmarked tweets */}
          {bookmarkedTweets.length > 0 ? (
            <div>
              {bookmarkedTweets.map((tweet) => (
                <TweetCard key={tweet.id} tweet={tweet} />
              ))}
            </div>
          ) : (
            <div className="py-20 px-8 text-center">
              <h2 className="text-3xl font-bold mb-2">Save posts for later</h2>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Bookmark posts to easily find them again in the future.
              </p>
            </div>
          )}
        </main>

        {/* Right sidebar */}
        <div className="hidden lg:block w-[350px] shrink-0">
          <RightSidebar />
        </div>
      </div>

      {/* Mobile navigation */}
      <MobileNav />
    </div>
  )
}
