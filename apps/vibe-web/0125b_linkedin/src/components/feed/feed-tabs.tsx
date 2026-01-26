"use client"

import { useState, useCallback } from "react"
import { ChevronDown, Check } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type FeedTabValue = "all" | "posts" | "articles" | "jobs" | "documents"
export type FeedSortValue = "recent" | "top"

interface FeedTabsProps {
  defaultTab?: FeedTabValue
  defaultSort?: FeedSortValue
  onTabChange?: (tab: FeedTabValue) => void
  onSortChange?: (sort: FeedSortValue) => void
  className?: string
  sticky?: boolean
}

const tabs: { value: FeedTabValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "posts", label: "Posts" },
  { value: "articles", label: "Articles" },
  { value: "jobs", label: "Jobs" },
  { value: "documents", label: "Documents" },
]

const sortOptions: { value: FeedSortValue; label: string }[] = [
  { value: "recent", label: "Recent" },
  { value: "top", label: "Top" },
]

export function FeedTabs({
  defaultTab = "all",
  defaultSort = "recent",
  onTabChange,
  onSortChange,
  className,
  sticky = true,
}: FeedTabsProps) {
  const [activeTab, setActiveTab] = useState<FeedTabValue>(defaultTab)
  const [activeSort, setActiveSort] = useState<FeedSortValue>(defaultSort)

  const handleTabChange = useCallback(
    (value: string) => {
      const tab = value as FeedTabValue
      setActiveTab(tab)
      onTabChange?.(tab)
    },
    [onTabChange]
  )

  const handleSortChange = useCallback(
    (sort: FeedSortValue) => {
      setActiveSort(sort)
      onSortChange?.(sort)
    },
    [onSortChange]
  )

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 py-3 px-4 bg-[var(--card)] border border-[var(--border)] rounded-lg",
        sticky && "sticky top-16 z-10 shadow-sm",
        className
      )}
    >
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="h-8 bg-transparent p-0 gap-1">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={cn(
                "h-8 px-3 text-sm font-medium rounded-full",
                "data-[state=active]:bg-[var(--primary)] data-[state=active]:text-[var(--primary-foreground)]",
                "data-[state=inactive]:text-[var(--muted-foreground)] data-[state=inactive]:hover:bg-[var(--muted)]",
                "transition-colors"
              )}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            <span>Sort by:</span>
            <span className="font-medium text-[var(--foreground)]">
              {sortOptions.find((s) => s.value === activeSort)?.label}
            </span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              className="flex items-center justify-between"
            >
              {option.label}
              {activeSort === option.value && (
                <Check className="h-4 w-4 text-[var(--primary)]" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// Controlled version for external state management
interface ControlledFeedTabsProps {
  tab: FeedTabValue
  sort: FeedSortValue
  onTabChange: (tab: FeedTabValue) => void
  onSortChange: (sort: FeedSortValue) => void
  className?: string
  sticky?: boolean
}

export function ControlledFeedTabs({
  tab,
  sort,
  onTabChange,
  onSortChange,
  className,
  sticky = true,
}: ControlledFeedTabsProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 py-3 px-4 bg-[var(--card)] border border-[var(--border)] rounded-lg",
        sticky && "sticky top-16 z-10 shadow-sm",
        className
      )}
    >
      <Tabs value={tab} onValueChange={(v) => onTabChange(v as FeedTabValue)}>
        <TabsList className="h-8 bg-transparent p-0 gap-1">
          {tabs.map((t) => (
            <TabsTrigger
              key={t.value}
              value={t.value}
              className={cn(
                "h-8 px-3 text-sm font-medium rounded-full",
                "data-[state=active]:bg-[var(--primary)] data-[state=active]:text-[var(--primary-foreground)]",
                "data-[state=inactive]:text-[var(--muted-foreground)] data-[state=inactive]:hover:bg-[var(--muted)]",
                "transition-colors"
              )}
            >
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            <span>Sort by:</span>
            <span className="font-medium text-[var(--foreground)]">
              {sortOptions.find((s) => s.value === sort)?.label}
            </span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className="flex items-center justify-between"
            >
              {option.label}
              {sort === option.value && (
                <Check className="h-4 w-4 text-[var(--primary)]" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
