"use client"

import { useState } from "react"
import { Search, Settings } from "lucide-react"
import { Sidebar } from "@/components/layout/sidebar"
import { MobileNav } from "@/components/layout/mobile-nav"
import { RightSidebar } from "@/components/layout/right-sidebar"
import { TweetCard } from "@/components/tweet/tweet-card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { trends, tweets } from "@/lib/mock-data"
import { formatCount } from "@/lib/utils"

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTweets = searchQuery
    ? tweets.filter(
        (t) =>
          t.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.author.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : tweets.slice(0, 20)

  return (
    <div className="min-h-screen flex justify-center">
      <div className="flex w-full max-w-[1265px]">
        {/* Left sidebar */}
        <div className="hidden md:flex w-[68px] lg:w-[275px] flex-shrink-0">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0 max-w-[600px] border-x border-border">
          {/* Header with search */}
          <div className="sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border">
            <div className="flex items-center gap-3 px-4 py-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-full bg-muted border-0 focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>
              <button className="p-2 rounded-full border border-border hover:bg-accent transition-colors">
                <Settings className="h-5 w-5" />
              </button>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="for-you" className="w-full">
              <TabsList className="w-full h-auto p-0 bg-transparent border-b border-border rounded-none">
                <TabsTrigger
                  value="for-you"
                  className="flex-1 py-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none relative"
                >
                  For you
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-primary rounded-full data-[state=inactive]:hidden" />
                </TabsTrigger>
                <TabsTrigger
                  value="trending"
                  className="flex-1 py-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  Trending
                </TabsTrigger>
                <TabsTrigger
                  value="news"
                  className="flex-1 py-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  News
                </TabsTrigger>
                <TabsTrigger
                  value="sports"
                  className="flex-1 py-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  Sports
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Content */}
          {searchQuery ? (
            <div>
              <h2 className="px-4 py-3 font-bold text-xl">
                Search results for "{searchQuery}"
              </h2>
              {filteredTweets.length > 0 ? (
                filteredTweets.map((tweet) => (
                  <TweetCard key={tweet.id} tweet={tweet} />
                ))
              ) : (
                <div className="px-4 py-8 text-center text-muted-foreground">
                  No results found for "{searchQuery}"
                </div>
              )}
            </div>
          ) : (
            <div>
              {/* Trends section */}
              <h2 className="px-4 py-3 font-bold text-xl">Trends for you</h2>
              {trends.map((trend) => (
                <button
                  key={trend.id}
                  onClick={() => setSearchQuery(trend.name)}
                  className="w-full px-4 py-3 hover:bg-accent/50 transition-colors text-left border-b border-border"
                >
                  <p className="text-xs text-muted-foreground">
                    {trend.category}
                  </p>
                  <p className="font-bold">{trend.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatCount(trend.posts)} posts
                  </p>
                </button>
              ))}
            </div>
          )}
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
