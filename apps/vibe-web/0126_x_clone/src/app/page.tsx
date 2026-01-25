"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { MobileNav } from "@/components/layout/mobile-nav"
import { RightSidebar } from "@/components/layout/right-sidebar"
import { TweetComposer } from "@/components/tweet/tweet-composer"
import { Feed } from "@/components/feed/feed"
import { FeedTabs } from "@/components/feed/feed-tabs"
import { tweets, users } from "@/lib/mock-data"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"for-you" | "following">("for-you")

  // Filter tweets based on active tab
  const filteredTweets =
    activeTab === "following"
      ? tweets.filter((t) =>
          users.find((u) => u.id === t.author.id && u.isFollowing)
        )
      : tweets

  return (
    <div className="min-h-screen flex justify-center">
      <div className="w-full max-w-[1265px] flex">
        {/* Left sidebar */}
        <div className="hidden md:flex w-[68px] lg:w-[275px] shrink-0 border-r border-border">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0 max-w-[600px] border-r border-border flex flex-col h-screen">
          {/* Header */}
          <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b border-border">
            <h1 className="px-4 py-3 text-xl font-bold">Home</h1>
            <FeedTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </header>

          {/* Tweet composer */}
          <TweetComposer />

          {/* Feed */}
          <div className="flex-1 overflow-hidden">
            <Feed tweets={filteredTweets} />
          </div>
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
