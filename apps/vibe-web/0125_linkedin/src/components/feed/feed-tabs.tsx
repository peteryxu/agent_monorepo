"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface FeedTabsProps {
  value: string
  onValueChange: (value: string) => void
}

export function FeedTabs({ value, onValueChange }: FeedTabsProps) {
  return (
    <div className="bg-card rounded-lg border mb-2">
      <Tabs value={value} onValueChange={onValueChange}>
        <TabsList className="w-full justify-start bg-transparent h-auto p-0">
          <TabsTrigger
            value="all"
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="posts"
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Posts
          </TabsTrigger>
          <TabsTrigger
            value="articles"
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Articles
          </TabsTrigger>
          <TabsTrigger
            value="jobs"
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Jobs
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}
