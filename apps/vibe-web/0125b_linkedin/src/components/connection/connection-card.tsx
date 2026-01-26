"use client"

import { useState } from "react"
import { X, UserPlus, MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { User } from "@/lib/types"

interface ConnectionCardProps {
  user: User
  mutualConnections?: number
  isConnected?: boolean
  onConnect?: () => void
  onDismiss?: () => void
  onMessage?: () => void
}

export function ConnectionCard({
  user,
  mutualConnections = 0,
  isConnected = false,
  onConnect,
  onDismiss,
  onMessage,
}: ConnectionCardProps) {
  const [dismissed, setDismissed] = useState(false)
  const [connected, setConnected] = useState(isConnected)
  const [pending, setPending] = useState(false)

  if (dismissed) return null

  const handleConnect = () => {
    setPending(true)
    onConnect?.()
  }

  const handleDismiss = () => {
    setDismissed(true)
    onDismiss?.()
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  // Generate a deterministic gradient based on user id
  const gradientIndex = user.id.charCodeAt(0) % 5
  const gradients = [
    "from-[oklch(0.55_0.15_240)] to-[oklch(0.45_0.12_260)]",
    "from-[oklch(0.55_0.15_145)] to-[oklch(0.45_0.12_165)]",
    "from-[oklch(0.60_0.15_85)] to-[oklch(0.50_0.12_65)]",
    "from-[oklch(0.55_0.18_300)] to-[oklch(0.45_0.15_280)]",
    "from-[oklch(0.55_0.15_25)] to-[oklch(0.45_0.12_35)]",
  ]

  return (
    <Card className="relative overflow-hidden group">
      {/* Background gradient cover */}
      <div className={cn("h-16 bg-gradient-to-r", gradients[gradientIndex])} />

      {/* Dismiss button */}
      {!connected && !pending && (
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 rounded-full bg-black/20 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/40"
          aria-label="Dismiss suggestion"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {/* Content */}
      <div className="flex flex-col items-center px-4 pb-4 -mt-8">
        {/* Avatar */}
        <Avatar className="h-16 w-16 border-2 border-[var(--card)]">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        {/* Name and headline */}
        <h3 className="mt-2 font-semibold text-sm text-center line-clamp-1">
          {user.name}
        </h3>
        <p className="text-xs text-[var(--muted-foreground)] text-center line-clamp-2 mt-0.5 min-h-[2rem]">
          {user.headline}
        </p>

        {/* Mutual connections */}
        {mutualConnections > 0 && (
          <p className="text-xs text-[var(--muted-foreground)] mt-2">
            {mutualConnections} mutual connection{mutualConnections > 1 ? "s" : ""}
          </p>
        )}

        {/* Action button */}
        <div className="mt-3 w-full">
          {connected ? (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={onMessage}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Message
            </Button>
          ) : pending ? (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              disabled
            >
              Pending
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="w-full text-[var(--primary)] border-[var(--primary)] hover:bg-[var(--primary)] hover:text-white"
              onClick={handleConnect}
            >
              <UserPlus className="h-4 w-4 mr-1" />
              Connect
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
