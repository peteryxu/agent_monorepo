"use client"

import { useState } from "react"
import { Clock, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { User } from "@/lib/types"

interface PendingInvitationProps {
  user: User
  mutualConnections?: number
  receivedAt: Date
  message?: string
  onAccept?: () => void
  onIgnore?: () => void
}

export function PendingInvitation({
  user,
  mutualConnections = 0,
  receivedAt,
  message,
  onAccept,
  onIgnore,
}: PendingInvitationProps) {
  const [status, setStatus] = useState<"pending" | "accepted" | "ignored">("pending")

  if (status !== "pending") return null

  const handleAccept = () => {
    setStatus("accepted")
    onAccept?.()
  }

  const handleIgnore = () => {
    setStatus("ignored")
    onIgnore?.()
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  // Format relative time
  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor(diffMs / (1000 * 60))

    if (diffDays > 7) {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    } else if (diffDays >= 1) {
      return `${diffDays}d ago`
    } else if (diffHours >= 1) {
      return `${diffHours}h ago`
    } else if (diffMinutes >= 1) {
      return `${diffMinutes}m ago`
    }
    return "Just now"
  }

  return (
    <div className="flex gap-3 p-4 border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--muted)]/50 transition-colors">
      {/* Avatar */}
      <Avatar className="h-12 w-12 shrink-0">
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4 className="font-semibold text-sm truncate">{user.name}</h4>
            <p className="text-xs text-[var(--muted-foreground)] truncate">
              {user.headline}
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs text-[var(--muted-foreground)] shrink-0">
            <Clock className="h-3 w-3" />
            {formatRelativeTime(receivedAt)}
          </div>
        </div>

        {/* Mutual connections */}
        {mutualConnections > 0 && (
          <div className="flex items-center gap-1 mt-1 text-xs text-[var(--muted-foreground)]">
            <Users className="h-3 w-3" />
            {mutualConnections} mutual connection{mutualConnections > 1 ? "s" : ""}
          </div>
        )}

        {/* Message preview */}
        {message && (
          <div className="mt-2 p-2 bg-[var(--muted)] rounded text-xs text-[var(--muted-foreground)] line-clamp-2">
            &ldquo;{message}&rdquo;
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 mt-3">
          <Button
            variant="outline"
            size="sm"
            className="text-[var(--muted-foreground)]"
            onClick={handleIgnore}
          >
            Ignore
          </Button>
          <Button
            size="sm"
            onClick={handleAccept}
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  )
}
