"use client"

import { cn } from "@/lib/utils"

type TabType = "all" | "posts" | "articles" | "jobs"

interface FeedTabsProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

const tabs: { id: TabType; label: string }[] = [
  { id: "all", label: "All" },
  { id: "posts", label: "Posts" },
  { id: "articles", label: "Articles" },
  { id: "jobs", label: "Jobs" },
]

export function FeedTabs({ activeTab, onTabChange }: FeedTabsProps) {
  return (
    <div className="flex gap-1 p-1 bg-card rounded-lg border">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors",
            activeTab === tab.id
              ? "bg-success/10 text-success"
              : "text-muted-foreground hover:bg-accent"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export type { TabType }
