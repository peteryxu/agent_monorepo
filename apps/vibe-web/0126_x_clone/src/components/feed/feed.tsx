"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { TweetCard } from "@/components/tweet/tweet-card"
import { Skeleton } from "@/components/ui/skeleton"
import type { Tweet } from "@/lib/types"

interface FeedProps {
  tweets: Tweet[]
  isLoading?: boolean
}

export function Feed({ tweets, isLoading = false }: FeedProps) {
  const parentRef = useRef<HTMLDivElement>(null)
  const [focusedIndex, setFocusedIndex] = useState(-1)

  const virtualizer = useVirtualizer({
    count: tweets.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 180,
    overscan: 5,
  })

  // Keyboard navigation (j/k for up/down, l for like, r for retweet)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't handle if focused on input/textarea
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return
      }

      switch (e.key) {
        case "j":
        case "ArrowDown":
          e.preventDefault()
          setFocusedIndex((i) => Math.min(i + 1, tweets.length - 1))
          break
        case "k":
        case "ArrowUp":
          e.preventDefault()
          setFocusedIndex((i) => Math.max(i - 1, 0))
          break
      }
    },
    [tweets.length]
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex >= 0) {
      virtualizer.scrollToIndex(focusedIndex, { align: "center" })
    }
  }, [focusedIndex, virtualizer])

  if (isLoading) {
    return (
      <div className="space-y-0">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="px-4 py-3 border-b border-border">
            <div className="flex gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex gap-12 mt-3">
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-4 w-8" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      ref={parentRef}
      className="h-full overflow-auto"
      role="feed"
      aria-busy={isLoading}
      aria-label="Tweet feed"
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const tweet = tweets[virtualItem.index]
          return (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <TweetCard
                tweet={tweet}
                isFocused={virtualItem.index === focusedIndex}
              />
            </div>
          )
        })}
      </div>

      {/* Screen reader announcement for keyboard navigation */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {focusedIndex >= 0 &&
          `Tweet ${focusedIndex + 1} of ${tweets.length} by ${tweets[focusedIndex]?.author.name}`}
      </div>
    </div>
  )
}
