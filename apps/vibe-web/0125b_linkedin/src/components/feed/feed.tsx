"use client"

import {
  useRef,
  useCallback,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import type { Post, PostId } from "@/lib/types"
import { cn } from "@/lib/utils"
import { PostSkeleton } from "./feed-skeleton"
import { PostCard } from "@/components/post/post-card"

export interface FeedHandle {
  scrollToPost: (postId: PostId) => void
  scrollToIndex: (index: number) => void
  getActiveIndex: () => number
  setActiveIndex: (index: number) => void
}

interface FeedProps {
  posts: Post[]
  isLoading?: boolean
  hasMore?: boolean
  onLoadMore?: () => void | Promise<void>
  estimatedRowHeight?: number
  overscan?: number
  className?: string
  onPostClick?: (post: Post, index: number) => void
  keyboardNavigation?: boolean
  renderPost?: (post: Post, isActive: boolean, onActivate: () => void) => React.ReactNode
}

export const Feed = forwardRef<FeedHandle, FeedProps>(function Feed(
  {
    posts,
    isLoading = false,
    hasMore = false,
    onLoadMore,
    estimatedRowHeight = 400,
    overscan = 5,
    className,
    onPostClick,
    keyboardNavigation = true,
    renderPost,
  },
  ref
) {
  const parentRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch by only rendering dynamic content after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  const virtualizer = useVirtualizer({
    count: posts.length + (isLoading ? 1 : 0),
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback(
      (index: number) => {
        // Last item is loading skeleton
        if (index === posts.length) return 200
        return estimatedRowHeight
      },
      [posts.length, estimatedRowHeight]
    ),
    overscan,
    measureElement: (element) => element.getBoundingClientRect().height,
  })

  // Expose methods via ref
  useImperativeHandle(
    ref,
    () => ({
      scrollToPost: (postId: PostId) => {
        const index = posts.findIndex((p) => p.id === postId)
        if (index !== -1) {
          virtualizer.scrollToIndex(index, { align: "start" })
          setActiveIndex(index)
        }
      },
      scrollToIndex: (index: number) => {
        if (index >= 0 && index < posts.length) {
          virtualizer.scrollToIndex(index, { align: "start" })
          setActiveIndex(index)
        }
      },
      getActiveIndex: () => activeIndex,
      setActiveIndex,
    }),
    [posts, virtualizer, activeIndex]
  )

  // Keyboard navigation (j/k keys)
  useEffect(() => {
    if (!keyboardNavigation || !mounted) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't interfere with input fields
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      if (e.key === "j" || e.key === "ArrowDown") {
        e.preventDefault()
        setActiveIndex((prev) => {
          const next = Math.min(prev + 1, posts.length - 1)
          virtualizer.scrollToIndex(next, { align: "center" })
          return next
        })
      } else if (e.key === "k" || e.key === "ArrowUp") {
        e.preventDefault()
        setActiveIndex((prev) => {
          const next = Math.max(prev - 1, 0)
          virtualizer.scrollToIndex(next, { align: "center" })
          return next
        })
      } else if (e.key === "Enter" && activeIndex >= 0) {
        e.preventDefault()
        const post = posts[activeIndex]
        if (post && onPostClick) {
          onPostClick(post, activeIndex)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [keyboardNavigation, mounted, posts, activeIndex, virtualizer, onPostClick])

  // Infinite scroll detection
  useEffect(() => {
    if (!mounted || !hasMore || isLoading || !onLoadMore) return

    const items = virtualizer.getVirtualItems()
    const lastItem = items[items.length - 1]

    if (lastItem && lastItem.index >= posts.length - 3) {
      onLoadMore()
    }
  }, [
    mounted,
    hasMore,
    isLoading,
    onLoadMore,
    posts.length,
    virtualizer.getVirtualItems(),
  ])

  const handleActivate = useCallback(
    (index: number) => {
      setActiveIndex(index)
      const post = posts[index]
      if (post && onPostClick) {
        onPostClick(post, index)
      }
    },
    [posts, onPostClick]
  )

  const virtualItems = virtualizer.getVirtualItems()

  return (
    <div
      ref={parentRef}
      className={cn(
        "h-full overflow-auto",
        className
      )}
      role="feed"
      aria-label="Feed"
      aria-busy={isLoading}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {mounted &&
          virtualItems.map((virtualRow) => {
            const isLoadingRow = virtualRow.index === posts.length
            const post = posts[virtualRow.index]
            const isActive = virtualRow.index === activeIndex

            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {isLoadingRow ? (
                  <PostSkeleton />
                ) : renderPost ? (
                  renderPost(post, isActive, () =>
                    handleActivate(virtualRow.index)
                  )
                ) : (
                  <div
                    onClick={() => handleActivate(virtualRow.index)}
                    className={cn(
                      "cursor-pointer transition-all duration-200",
                      isActive && "ring-2 ring-[var(--primary)] ring-offset-2 ring-offset-[var(--background)] rounded-lg"
                    )}
                  >
                    <PostCard post={post} />
                  </div>
                )}
              </div>
            )
          })}
      </div>

      {/* Screen reader announcements */}
      {mounted && activeIndex >= 0 && (
        <div className="sr-only" role="status" aria-live="polite">
          Post {activeIndex + 1} of {posts.length}
        </div>
      )}
    </div>
  )
})

// Non-virtualized version for smaller feeds
interface SimpleFeedProps {
  posts: Post[]
  isLoading?: boolean
  className?: string
  onPostClick?: (post: Post, index: number) => void
  renderPost?: (post: Post, index: number) => React.ReactNode
}

export function SimpleFeed({
  posts,
  isLoading = false,
  className,
  onPostClick,
  renderPost,
}: SimpleFeedProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className={cn("space-y-0", className)} role="feed" aria-label="Feed">
      {mounted &&
        posts.map((post, index) =>
          renderPost ? (
            <div key={post.id}>{renderPost(post, index)}</div>
          ) : (
            <div
              key={post.id}
              onClick={() => onPostClick?.(post, index)}
              className="cursor-pointer"
            >
              <PostCard post={post} />
            </div>
          )
        )}
      {isLoading && <PostSkeleton />}
    </div>
  )
}
