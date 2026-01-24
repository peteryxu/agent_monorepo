"use client"

import { cn } from "@/lib/utils"

interface FeedTabsProps {
  activeTab: "for-you" | "following"
  onTabChange: (tab: "for-you" | "following") => void
}

export function FeedTabs({ activeTab, onTabChange }: FeedTabsProps) {
  return (
    <div className="flex border-b border-border sticky top-0 bg-background/80 backdrop-blur-md z-10">
      <button
        onClick={() => onTabChange("for-you")}
        className={cn(
          "flex-1 py-4 text-center font-medium hover:bg-accent/50 transition-colors relative",
          activeTab === "for-you" ? "font-bold" : "text-muted-foreground"
        )}
      >
        For you
        {activeTab === "for-you" && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-primary rounded-full" />
        )}
      </button>
      <button
        onClick={() => onTabChange("following")}
        className={cn(
          "flex-1 py-4 text-center font-medium hover:bg-accent/50 transition-colors relative",
          activeTab === "following" ? "font-bold" : "text-muted-foreground"
        )}
      >
        Following
        {activeTab === "following" && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-primary rounded-full" />
        )}
      </button>
    </div>
  )
}
