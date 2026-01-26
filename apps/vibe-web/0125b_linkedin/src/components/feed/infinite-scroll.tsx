"use client"

import { useEffect, useRef, useCallback } from "react"
import { Loader2 } from "lucide-react"

interface InfiniteScrollProps {
  onLoadMore: () => void | Promise<void>
  hasMore: boolean
  isLoading?: boolean
  threshold?: number
  rootMargin?: string
  endMessage?: string
  loadingMessage?: string
}

export function InfiniteScroll({
  onLoadMore,
  hasMore,
  isLoading = false,
  threshold = 0.1,
  rootMargin = "100px",
  endMessage = "You've reached the end of your feed",
  loadingMessage = "Loading more posts...",
}: InfiniteScrollProps) {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const loadingRef = useRef(false)

  const handleIntersect = useCallback(
    async (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries

      if (entry.isIntersecting && hasMore && !isLoading && !loadingRef.current) {
        loadingRef.current = true
        try {
          await onLoadMore()
        } finally {
          loadingRef.current = false
        }
      }
    },
    [hasMore, isLoading, onLoadMore]
  )

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(handleIntersect, {
      threshold,
      rootMargin,
    })

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [handleIntersect, threshold, rootMargin])

  return (
    <div className="py-4">
      {/* Sentinel element for intersection observer */}
      <div ref={sentinelRef} className="h-1" aria-hidden="true" />

      {/* Loading indicator */}
      {isLoading && (
        <div
          className="flex items-center justify-center gap-2 py-8 text-[var(--muted-foreground)]"
          role="status"
          aria-label={loadingMessage}
        >
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">{loadingMessage}</span>
        </div>
      )}

      {/* End of feed message */}
      {!hasMore && !isLoading && (
        <div className="text-center py-8">
          <p className="text-sm text-[var(--muted-foreground)]">
            {endMessage}
          </p>
        </div>
      )}
    </div>
  )
}

// Hook version for more flexibility
export function useInfiniteScroll({
  onLoadMore,
  hasMore,
  isLoading = false,
  threshold = 0.1,
  rootMargin = "100px",
}: Omit<InfiniteScrollProps, "endMessage" | "loadingMessage">) {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const loadingRef = useRef(false)

  const handleIntersect = useCallback(
    async (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries

      if (entry.isIntersecting && hasMore && !isLoading && !loadingRef.current) {
        loadingRef.current = true
        try {
          await onLoadMore()
        } finally {
          loadingRef.current = false
        }
      }
    },
    [hasMore, isLoading, onLoadMore]
  )

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(handleIntersect, {
      threshold,
      rootMargin,
    })

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [handleIntersect, threshold, rootMargin])

  return { sentinelRef }
}
