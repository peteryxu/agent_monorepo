"use client"

import Link from "next/link"
import { Eye, BarChart3, Bookmark } from "lucide-react"

import { currentUser } from "@/lib/mock-data"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

export function ProfileCard() {
  return (
    <Card className="overflow-hidden">
      {/* Cover gradient */}
      <div
        className="h-14 bg-gradient-to-r from-[var(--primary)] to-[var(--chart-5)]"
        style={{
          backgroundImage: currentUser.coverImage
            ? `url(${currentUser.coverImage})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Avatar (overlapping cover) */}
      <div className="-mt-8 flex justify-center">
        <Link href={`/profile/${currentUser.id}`} className="group">
          <Avatar className="h-16 w-16 border-4 border-[var(--card)] transition-transform group-hover:scale-105">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback className="text-lg">
              {currentUser.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>

      {/* User info */}
      <CardContent className="pt-2 text-center">
        <Link
          href={`/profile/${currentUser.id}`}
          className="block text-base font-semibold hover:text-[var(--primary)] hover:underline"
        >
          {currentUser.name}
        </Link>
        <p className="mt-0.5 line-clamp-2 text-xs text-[var(--muted-foreground)]">
          {currentUser.headline}
        </p>
      </CardContent>

      <Separator />

      {/* Stats */}
      <div className="space-y-1 p-3">
        <Link
          href="/profile/views"
          className="group flex items-center justify-between rounded px-1 py-1 hover:bg-[var(--accent)]"
        >
          <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
            <Eye className="h-4 w-4" />
            <span>Profile viewers</span>
          </div>
          <span className="text-xs font-semibold text-[var(--primary)] group-hover:underline">
            45
          </span>
        </Link>

        <Link
          href="/profile/impressions"
          className="group flex items-center justify-between rounded px-1 py-1 hover:bg-[var(--accent)]"
        >
          <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
            <BarChart3 className="h-4 w-4" />
            <span>Post impressions</span>
          </div>
          <span className="text-xs font-semibold text-[var(--primary)] group-hover:underline">
            892
          </span>
        </Link>
      </div>

      <Separator />

      {/* Saved items */}
      <Link
        href="/my-items/saved-posts"
        className="flex items-center gap-2 p-3 text-xs text-[var(--muted-foreground)] hover:bg-[var(--accent)]"
      >
        <Bookmark className="h-4 w-4" />
        <span>My items</span>
      </Link>
    </Card>
  )
}
