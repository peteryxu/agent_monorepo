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

const reactions: ReactionConfig[] = [
  { type: "like", emoji: "👍", label: "Like", color: "text-reaction-like" },
  { type: "celebrate", emoji: "👏", label: "Celebrate", color: "text-reaction-celebrate" },
  { type: "support", emoji: "💜", label: "Support", color: "text-reaction-support" },
  { type: "love", emoji: "❤️", label: "Love", color: "text-reaction-love" },
  { type: "insightful", emoji: "💡", label: "Insightful", color: "text-reaction-insightful" },
  { type: "funny", emoji: "😄", label: "Funny", color: "text-reaction-funny" },
]

interface ReactionPickerProps {
  onSelect: (type: ReactionType) => void
  currentReaction?: ReactionType
}

export function ReactionPicker({ onSelect, currentReaction }: ReactionPickerProps) {
  const [hoveredReaction, setHoveredReaction] = useState<ReactionType | null>(null)

  return (
    <div className="flex items-center gap-1 bg-card rounded-full border shadow-lg px-2 py-1.5 animate-in fade-in-0 zoom-in-95 duration-200">
      {reactions.map((reaction) => {
        const isSelected = currentReaction === reaction.type
        const isHovered = hoveredReaction === reaction.type

        return (
          <button
            key={reaction.type}
            onClick={() => onSelect(reaction.type)}
            onMouseEnter={() => setHoveredReaction(reaction.type)}
            onMouseLeave={() => setHoveredReaction(null)}
            className={cn(
              "relative flex flex-col items-center transition-transform duration-150",
              (isHovered || isSelected) && "scale-125 -translate-y-1"
            )}
          >
            <span className="text-2xl cursor-pointer select-none">
              {reaction.emoji}
            </span>
            {isHovered && (
              <span className="absolute -bottom-5 text-[10px] font-medium text-foreground whitespace-nowrap">
                {reaction.label}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export function getReactionEmoji(type: ReactionType): string {
  return reactions.find((r) => r.type === type)?.emoji || "👍"
}

export function getReactionColor(type: ReactionType): string {
  return reactions.find((r) => r.type === type)?.color || "text-reaction-like"
}
