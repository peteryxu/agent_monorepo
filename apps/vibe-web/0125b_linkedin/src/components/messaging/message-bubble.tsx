"use client"

import { Check, CheckCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface MessageBubbleProps {
  content: string
  timestamp: Date
  isSent: boolean
  isRead?: boolean
}

export function MessageBubble({
  content,
  timestamp,
  isSent,
  isRead = false,
}: MessageBubbleProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <div
      className={cn(
        "flex flex-col max-w-[70%]",
        isSent ? "ml-auto items-end" : "mr-auto items-start"
      )}
    >
      <div
        className={cn(
          "px-4 py-2 rounded-2xl",
          isSent
            ? "bg-[var(--primary)] text-[var(--primary-foreground)] rounded-br-sm"
            : "bg-[var(--muted)] text-[var(--foreground)] rounded-bl-sm"
        )}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
      </div>
      <div className="flex items-center gap-1 mt-1 px-1">
        <span className="text-xs text-[var(--muted-foreground)]">
          {formatTime(timestamp)}
        </span>
        {isSent && (
          <span className="text-[var(--muted-foreground)]">
            {isRead ? (
              <CheckCheck className="h-3 w-3 text-[var(--primary)]" />
            ) : (
              <Check className="h-3 w-3" />
            )}
          </span>
        )}
      </div>
    </div>
  )
}
