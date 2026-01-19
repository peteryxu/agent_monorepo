"use client"

import { useRef, useState, useCallback } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { TweetCard } from "@/components/tweet/tweet-card"
import type { Tweet } from "@/lib/types"

interface FeedProps {
  tweets: Tweet[]
}

export function Feed({ tweets }: FeedProps) {
  const parentRef = useRef<HTMLDivElement>(null)
  const [items, setItems] = useState(tweets)

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback(() => 200, []),
    overscan: 5,
  })

  return (
    <div
      ref={parentRef}
      className="h-full overflow-auto"
      role="feed"
      aria-busy={false}
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
          const tweet = items[virtualItem.index]
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
                showBorder={virtualItem.index < items.length - 1}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
