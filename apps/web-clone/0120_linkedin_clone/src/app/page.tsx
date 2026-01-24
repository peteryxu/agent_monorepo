"use client"

import { useState, useMemo } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { RightSidebar } from "@/components/layout/right-sidebar"
import { MobileNav } from "@/components/layout/mobile-nav"
import { PostComposer } from "@/components/post/post-composer"
import { Feed } from "@/components/feed/feed"
import { FeedTabs, type TabType } from "@/components/feed/feed-tabs"
import { posts } from "@/lib/mock-data"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabType>("all")

  const filteredPosts = useMemo(() => {
    switch (activeTab) {
      case "posts":
        return posts.filter((p) => p.type === "text" || p.type === "celebration")
      case "articles":
        return posts.filter((p) => p.type === "article")
      case "jobs":
        return posts.filter((p) => p.type === "job-share")
      default:
        return posts
    }
  }, [activeTab])

  const handlePost = (content: string) => {
    // In a real app, this would make an API call
    console.log("New post:", content)
  }

  return (
    <div className="min-h-screen flex justify-center bg-background">
      <div className="flex w-full max-w-[1128px]">
        {/* Left sidebar */}
        <div className="hidden md:flex w-[68px] lg:w-[225px] flex-shrink-0">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0 max-w-[600px] px-4 py-4 space-y-4">
          <PostComposer onPost={handlePost} />
          <FeedTabs activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="h-[calc(100vh-280px)]">
            <Feed posts={filteredPosts} />
          </div>
        </main>

        {/* Right sidebar */}
        <div className="hidden lg:flex w-[300px] flex-shrink-0">
          <RightSidebar />
        </div>
      </div>

      {/* Mobile navigation */}
      <MobileNav />
    </div>
  )
}
