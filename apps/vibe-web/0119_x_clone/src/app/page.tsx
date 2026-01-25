"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { MobileNav } from "@/components/layout/mobile-nav"
import { RightSidebar } from "@/components/layout/right-sidebar"
import { TweetComposer } from "@/components/tweet/tweet-composer"
import { FeedTabs } from "@/components/feed/feed-tabs"
import { Feed } from "@/components/feed/feed"
import { tweets, currentUser } from "@/lib/mock-data"
import type { Tweet, TweetId } from "@/lib/types"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"for-you" | "following">("for-you")
  const [feedTweets, setFeedTweets] = useState<Tweet[]>(tweets)

  const handlePost = (content: string) => {
    const newTweet: Tweet = {
      id: `tweet-new-${Date.now()}` as TweetId,
      author: currentUser,
      content,
      createdAt: new Date(),
      likes: 0,
      retweets: 0,
      replies: 0,
      views: 0,
      isLiked: false,
      isRetweeted: false,
      isBookmarked: false,
    }
    setFeedTweets([newTweet, ...feedTweets])
  }

  // Filter tweets based on active tab
  const filteredTweets =
    activeTab === "following"
      ? feedTweets.filter((t) => t.author.isFollowing || t.author.id === currentUser.id)
      : feedTweets

  return (
    <div className="min-h-screen flex justify-center">
      <div className="flex w-full max-w-[1265px]">
        {/* Left sidebar */}
        <div className="hidden md:flex w-[68px] lg:w-[275px] flex-shrink-0">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0 max-w-[600px] border-x border-border">
          <FeedTabs activeTab={activeTab} onTabChange={setActiveTab} />
          <TweetComposer onPost={handlePost} />
          <Feed tweets={filteredTweets} />
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
