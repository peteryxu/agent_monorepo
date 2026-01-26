"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface FeedSkeletonProps {
  count?: number
}

function PostCardSkeleton() {
  return (
    <Card className="mb-2">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start gap-3">
          {/* Avatar skeleton */}
          <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />

          <div className="flex-1 min-w-0">
            {/* Name and headline */}
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-3 w-48 mb-1" />
            <Skeleton className="h-3 w-24" />
          </div>

          {/* Menu button skeleton */}
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-2">
        {/* Post content skeleton */}
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* Image placeholder (randomly show for some) */}
        <Skeleton className="h-64 w-full rounded-lg mb-4" />

        {/* Engagement stats */}
        <div className="flex items-center justify-between py-2 border-y border-[var(--border)]">
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>

        {/* Action buttons skeleton */}
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-14" />
        </div>
      </CardContent>
    </Card>
  )
}

function PostCardSkeletonCompact() {
  return (
    <Card className="mb-2">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start gap-3">
          <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        <div className="flex items-center justify-between pt-4">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-14" />
        </div>
      </CardContent>
    </Card>
  )
}

export function FeedSkeleton({ count = 5 }: FeedSkeletonProps) {
  return (
    <div className="space-y-0" role="status" aria-label="Loading feed">
      {/* First post with image */}
      <PostCardSkeleton />

      {/* Remaining posts without images for variety */}
      {Array.from({ length: count - 1 }).map((_, i) => (
        <PostCardSkeletonCompact key={i} />
      ))}

      <span className="sr-only">Loading posts...</span>
    </div>
  )
}

export function PostSkeleton() {
  return <PostCardSkeleton />
}

export function PostSkeletonCompact() {
  return <PostCardSkeletonCompact />
}
