"use client"

import { useRef, useCallback } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { PostCard } from "@/components/post/post-card"
import type { Post } from "@/lib/types"

interface FeedProps {
  posts: Post[]
}

export function Feed({ posts }: FeedProps) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: posts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback(() => 400, []), // Estimate post height
    overscan: 5, // Render 5 extra items for smooth scrolling
  })

  const items = virtualizer.getVirtualItems()

  return (
    <div
      ref={parentRef}
      className="h-full overflow-auto"
      style={{ contain: "strict" }}
    >
      <div
        className="relative w-full"
        style={{
          height: `${virtualizer.getTotalSize()}px`,
        }}
      >
        <div
          className="absolute top-0 left-0 w-full"
          style={{
            transform: `translateY(${items[0]?.start ?? 0}px)`,
          }}
        >
          {items.map((virtualItem) => {
            const post = posts[virtualItem.index]
            return (
              <div
                key={virtualItem.key}
                data-index={virtualItem.index}
                ref={virtualizer.measureElement}
                className="pb-2"
              >
                <PostCard post={post} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
