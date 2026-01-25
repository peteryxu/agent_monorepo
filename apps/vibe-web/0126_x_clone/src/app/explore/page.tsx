"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Settings } from "lucide-react"
import { Sidebar } from "@/components/layout/sidebar"
import { MobileNav } from "@/components/layout/mobile-nav"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { TweetCard } from "@/components/tweet/tweet-card"
import { trendingTopics, tweets } from "@/lib/mock-data"
import { formatCount } from "@/lib/utils"

const categories = ["For you", "Trending", "News", "Sports", "Entertainment"]

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTweets = searchQuery
    ? tweets.filter((t) =>
        t.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : tweets.slice(0, 20)

  return (
    <div className="min-h-screen flex justify-center">
      <div className="w-full max-w-[1265px] flex">
        {/* Left sidebar */}
        <div className="hidden md:flex w-[68px] lg:w-[275px] shrink-0 border-r border-border">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0 max-w-[600px] border-r border-border">
          {/* Search header */}
          <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b border-border px-4 py-2">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 rounded-full bg-muted border-0 focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </header>

          {/* Categories tabs */}
          <Tabs defaultValue="For you" className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent h-auto p-0 overflow-x-auto">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="flex-shrink-0 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4 px-4"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category} value={category} className="mt-0">
                {category === "For you" && !searchQuery ? (
                  <>
                    {/* Trending section */}
                    <div className="divide-y divide-border">
                      {trendingTopics.slice(0, 10).map((trend, i) => (
                        <Link
                          key={trend.id}
                          href={`/explore?q=${encodeURIComponent(trend.topic)}`}
                          className="block px-4 py-3 hover:bg-muted/50 transition-colors"
                          onClick={() => setSearchQuery(trend.topic)}
                        >
                          <p className="text-sm text-muted-foreground">
                            {i + 1} · {trend.category}
                          </p>
                          <p className="font-bold">#{trend.topic}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatCount(trend.tweetCount)} posts
                          </p>
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Search results or category tweets */}
                    {filteredTweets.map((tweet) => (
                      <TweetCard key={tweet.id} tweet={tweet} />
                    ))}
                    {filteredTweets.length === 0 && (
                      <div className="py-12 text-center text-muted-foreground">
                        No results for "{searchQuery}"
                      </div>
                    )}
                  </>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </main>

        {/* Right sidebar - hidden on explore since we have full width */}
        <div className="hidden lg:block w-[350px] shrink-0 border-l border-border">
          <div className="sticky top-0 p-4 space-y-4">
            <div className="bg-muted/50 rounded-xl p-4">
              <h2 className="text-xl font-bold mb-4">What's happening</h2>
              <p className="text-muted-foreground text-sm">
                Explore trending topics, news, and more.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <MobileNav />
    </div>
  )
}
