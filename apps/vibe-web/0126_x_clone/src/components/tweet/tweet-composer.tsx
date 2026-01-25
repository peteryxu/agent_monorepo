"use client"

import { useState, useRef } from "react"
import { ImageIcon, Smile, Calendar, MapPin, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { currentUser } from "@/lib/mock-data"
import { toast } from "sonner"

const MAX_CHARS = 280

interface TweetComposerProps {
  placeholder?: string
  onPost?: (content: string) => void
  showBorder?: boolean
  autoFocus?: boolean
  replyTo?: string
}

export function TweetComposer({
  placeholder = "What is happening?!",
  onPost,
  showBorder = true,
  autoFocus = false,
  replyTo,
}: TweetComposerProps) {
  const [content, setContent] = useState("")
  const [isFocused, setIsFocused] = useState(autoFocus)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const charCount = content.length
  const isOverLimit = charCount > MAX_CHARS
  const canPost = content.trim().length > 0 && !isOverLimit

  const handlePost = () => {
    if (!canPost) return

    onPost?.(content)
    toast.success("Your post was sent")
    setContent("")
    setIsFocused(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handlePost()
    }
  }

  // Auto-resize textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }

  return (
    <div
      className={cn(
        "px-4 py-3",
        showBorder && "border-b border-border"
      )}
    >
      <div className="flex gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
          <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          {/* Reply indicator */}
          {replyTo && (
            <p className="text-sm text-muted-foreground mb-2">
              Replying to <span className="text-primary">@{replyTo}</span>
            </p>
          )}

          {/* Textarea */}
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={handleInput}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={cn(
              "min-h-[56px] resize-none border-0 bg-transparent p-0 text-xl placeholder:text-muted-foreground focus-visible:ring-0",
              isFocused && "min-h-[100px]"
            )}
            autoFocus={autoFocus}
          />

          {/* Actions */}
          {(isFocused || content) && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <div className="flex items-center gap-1 -ml-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full text-primary hover:bg-primary/10"
                  type="button"
                >
                  <ImageIcon className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full text-primary hover:bg-primary/10"
                  type="button"
                >
                  <Smile className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full text-primary hover:bg-primary/10"
                  type="button"
                >
                  <Calendar className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full text-primary hover:bg-primary/10"
                  type="button"
                >
                  <MapPin className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex items-center gap-3">
                {/* Character count */}
                {charCount > 0 && (
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "relative h-5 w-5",
                        charCount > MAX_CHARS * 0.8 && "text-yellow-500",
                        isOverLimit && "text-destructive"
                      )}
                    >
                      <svg className="h-5 w-5 -rotate-90" viewBox="0 0 20 20">
                        <circle
                          cx="10"
                          cy="10"
                          r="8"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          opacity="0.2"
                        />
                        <circle
                          cx="10"
                          cy="10"
                          r="8"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeDasharray={50.3}
                          strokeDashoffset={50.3 * (1 - charCount / MAX_CHARS)}
                          className="transition-all"
                        />
                      </svg>
                    </div>
                    {charCount > MAX_CHARS * 0.9 && (
                      <span
                        className={cn(
                          "text-sm tabular-nums",
                          isOverLimit ? "text-destructive" : "text-muted-foreground"
                        )}
                      >
                        {MAX_CHARS - charCount}
                      </span>
                    )}
                  </div>
                )}

                <Button
                  onClick={handlePost}
                  disabled={!canPost}
                  className="rounded-full font-bold px-4"
                >
                  {replyTo ? "Reply" : "Post"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
