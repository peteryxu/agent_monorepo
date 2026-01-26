"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { ReactionType } from "@/lib/types"

interface ReactionConfig {
  type: ReactionType
  emoji: string
  label: string
  color: string
}

const REACTIONS: ReactionConfig[] = [
  { type: "like", emoji: "👍", label: "Like", color: "text-blue-600" },
  { type: "celebrate", emoji: "👏", label: "Celebrate", color: "text-green-600" },
  { type: "support", emoji: "💚", label: "Support", color: "text-green-500" },
  { type: "love", emoji: "❤️", label: "Love", color: "text-red-500" },
  { type: "insightful", emoji: "💡", label: "Insightful", color: "text-yellow-500" },
  { type: "funny", emoji: "😄", label: "Funny", color: "text-cyan-500" },
]

interface ReactionPickerProps {
  onSelect: (reaction: ReactionType) => void
  selectedReaction?: ReactionType
  className?: string
}

export function ReactionPicker({ onSelect, selectedReaction, className }: ReactionPickerProps) {
  const [hoveredReaction, setHoveredReaction] = useState<ReactionType | null>(null)

  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-full bg-[var(--card)] border border-[var(--border)] shadow-lg px-2 py-1",
        className
      )}
    >
      {REACTIONS.map((reaction) => {
        const isSelected = selectedReaction === reaction.type
        const isHovered = hoveredReaction === reaction.type

        return (
          <button
            key={reaction.type}
            onClick={() => onSelect(reaction.type)}
            onMouseEnter={() => setHoveredReaction(reaction.type)}
            onMouseLeave={() => setHoveredReaction(null)}
            className={cn(
              "relative flex flex-col items-center transition-all duration-200",
              "hover:scale-125",
              isHovered && "-translate-y-2"
            )}
            aria-label={reaction.label}
          >
            <span
              className={cn(
                "text-2xl transition-transform",
                isSelected && "ring-2 ring-[var(--primary)] rounded-full"
              )}
            >
              {reaction.emoji}
            </span>
            {isHovered && (
              <span className="absolute -top-8 whitespace-nowrap text-xs bg-[var(--popover)] text-[var(--popover-foreground)] px-2 py-1 rounded shadow-md border border-[var(--border)]">
                {reaction.label}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

// Helper function to get reaction emoji by type
export function getReactionEmoji(type: ReactionType): string {
  const reaction = REACTIONS.find((r) => r.type === type)
  return reaction?.emoji || "👍"
}

// Helper function to get reaction label by type
export function getReactionLabel(type: ReactionType): string {
  const reaction = REACTIONS.find((r) => r.type === type)
  return reaction?.label || "Like"
}

// Helper function to get reaction color by type
export function getReactionColor(type: ReactionType): string {
  const reaction = REACTIONS.find((r) => r.type === type)
  return reaction?.color || "text-blue-600"
}

export { REACTIONS }
export type { ReactionConfig }
