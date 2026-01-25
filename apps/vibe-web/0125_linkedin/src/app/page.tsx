"use client"

import { useState, useMemo } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { RightSidebar } from "@/components/layout/right-sidebar"
import { PostComposer } from "@/components/post/post-composer"
import { PostCard } from "@/components/post/post-card"
import { FeedTabs } from "@/components/feed/feed-tabs"
import { posts } from "@/lib/mock-data"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("all")

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

  return (
    <div className="mx-auto max-w-7xl px-4 py-4">
      <div className="flex gap-6">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Main Feed */}
        <div className="flex-1 min-w-0 max-w-[600px]">
          <PostComposer />

          <div className="mt-2">
            <FeedTabs value={activeTab} onValueChange={setActiveTab} />
          </div>

          <div className="space-y-2">
            {filteredPosts.slice(0, 20).map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <RightSidebar />
      </div>
    </div>
  )
}
