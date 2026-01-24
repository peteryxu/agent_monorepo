"use client"

import { useState, useRef } from "react"
import { Image as ImageIcon, Smile, CalendarDays, MapPin, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { currentUser } from "@/lib/mock-data"

interface TweetComposerProps {
  onPost?: (content: string) => void
  placeholder?: string
  compact?: boolean
}

const MAX_CHARS = 280

export function TweetComposer({
  onPost,
  placeholder = "What is happening?!",
  compact = false,
}: TweetComposerProps) {
  const [content, setContent] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const charCount = content.length
  const isOverLimit = charCount > MAX_CHARS
  const charPercentage = Math.min((charCount / MAX_CHARS) * 100, 100)

  const handlePost = () => {
    if (content.trim() && !isOverLimit) {
      onPost?.(content)
      setContent("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handlePost()
    }
  }

  return (
    <div
      className={cn(
        "px-4 py-3",
        !compact && "border-b border-border"
      )}
    >
      <div className="flex gap-3">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
          <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={cn(
              "resize-none border-0 bg-transparent p-0 text-xl placeholder:text-muted-foreground focus-visible:ring-0 min-h-[56px]",
              compact && "text-base min-h-[40px]"
            )}
            rows={compact ? 1 : 2}
          />

          {/* Divider when focused */}
          {(isFocused || content) && (
            <div className="border-b border-border my-3" />
          )}

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 -ml-2">
              <button
                className="p-2 rounded-full hover:bg-primary/10 text-primary transition-colors"
                aria-label="Add image"
              >
                <ImageIcon className="h-5 w-5" />
              </button>
              <button
                className="p-2 rounded-full hover:bg-primary/10 text-primary transition-colors"
                aria-label="Add emoji"
              >
                <Smile className="h-5 w-5" />
              </button>
              <button
                className="p-2 rounded-full hover:bg-primary/10 text-primary transition-colors hidden sm:flex"
                aria-label="Schedule"
              >
                <CalendarDays className="h-5 w-5" />
              </button>
              <button
                className="p-2 rounded-full hover:bg-primary/10 text-primary transition-colors hidden sm:flex"
                aria-label="Add location"
              >
                <MapPin className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* Character counter */}
              {content.length > 0 && (
                <div className="flex items-center gap-2">
                  {/* Circular progress */}
                  <div className="relative h-5 w-5">
                    <svg className="h-5 w-5 -rotate-90" viewBox="0 0 20 20">
                      <circle
                        cx="10"
                        cy="10"
                        r="8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-border"
                      />
                      <circle
                        cx="10"
                        cy="10"
                        r="8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray={`${charPercentage * 0.502} 100`}
                        className={cn(
                          "transition-all duration-150",
                          isOverLimit
                            ? "text-destructive"
                            : charCount > MAX_CHARS * 0.9
                            ? "text-yellow-500"
                            : "text-primary"
                        )}
                      />
                    </svg>
                    {charCount > MAX_CHARS * 0.9 && (
                      <span
                        className={cn(
                          "absolute inset-0 flex items-center justify-center text-[10px] font-medium",
                          isOverLimit && "text-destructive"
                        )}
                      >
                        {MAX_CHARS - charCount}
                      </span>
                    )}
                  </div>

                  <div className="h-6 w-px bg-border" />
                </div>
              )}

              <Button
                onClick={handlePost}
                disabled={!content.trim() || isOverLimit}
                className="rounded-full font-bold"
                size={compact ? "sm" : "default"}
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
