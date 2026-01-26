"use client"

import { useState, useOptimistic, useEffect } from "react"
import Link from "next/link"
import { ThumbsUp, MessageSquare, MoreHorizontal, ChevronDown } from "lucide-react"
import { cn, formatRelativeTime, formatCount } from "@/lib/utils"
import type { Comment, PostId, UserId, ReactionType } from "@/lib/types"
import { usersById, commentsByPostId, currentUser } from "@/lib/mock-data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// =============================================================================
// Types
// =============================================================================

type SortOption = "relevant" | "recent"

interface CommentSectionProps {
  postId: PostId
  className?: string
  initialCommentCount?: number
}

// =============================================================================
// Sub-components
// =============================================================================

interface CommentInputProps {
  onSubmit: (content: string) => void
  placeholder?: string
  autoFocus?: boolean
  isReply?: boolean
}

function CommentInput({ onSubmit, placeholder = "Add a comment...", autoFocus = false, isReply = false }: CommentInputProps) {
  const [content, setContent] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content.trim())
      setContent("")
      setIsFocused(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className={cn("flex gap-2", isReply && "ml-12")}>
      <Avatar className={cn("flex-shrink-0", isReply ? "h-8 w-8" : "h-10 w-10")}>
        <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
        <AvatarFallback>{currentUser.name.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => !content && setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={cn(
            "min-h-[40px] resize-none transition-all",
            isFocused || content ? "min-h-[80px]" : "min-h-[40px]"
          )}
        />
        {(isFocused || content) && (
          <div className="flex justify-end mt-2">
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!content.trim()}
            >
              {isReply ? "Reply" : "Comment"}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

interface CommentItemProps {
  comment: Comment
  onReply: (parentId: Comment) => void
  onLike: (commentId: Comment) => void
  level?: number
}

function CommentItem({ comment, onReply, onLike, level = 0 }: CommentItemProps) {
  const author = usersById.get(comment.authorId)
  const [showReplies, setShowReplies] = useState(true)
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!author) return null

  const hasReplies = comment.replies && comment.replies.length > 0
  const maxNestingLevel = 2

  return (
    <div className={cn("group", level > 0 && "ml-12")}>
      <div className="flex gap-2">
        <Link href={`/in/${author.id}`}>
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={author.avatar} alt={author.name} />
            <AvatarFallback>{author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1 min-w-0">
          {/* Comment bubble */}
          <div className="bg-[var(--muted)] rounded-lg px-3 py-2">
            <div className="flex items-center justify-between">
              <div>
                <Link
                  href={`/in/${author.id}`}
                  className="font-semibold text-sm hover:text-[var(--primary)] hover:underline"
                >
                  {author.name}
                </Link>
                <p className="text-xs text-[var(--muted-foreground)] line-clamp-1">
                  {author.headline}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-sm mt-1 whitespace-pre-wrap">{comment.content}</p>
          </div>

          {/* Comment actions */}
          <div className="flex items-center gap-3 mt-1 px-1">
            <button
              onClick={() => onLike(comment)}
              className={cn(
                "text-xs font-medium hover:text-[var(--primary)]",
                comment.totalReactions > 0 ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"
              )}
            >
              Like
              {comment.totalReactions > 0 && mounted && ` (${formatCount(comment.totalReactions)})`}
            </button>
            <span className="text-[var(--muted-foreground)]">|</span>
            {level < maxNestingLevel && (
              <>
                <button
                  onClick={() => setShowReplyInput(!showReplyInput)}
                  className="text-xs font-medium text-[var(--muted-foreground)] hover:text-[var(--primary)]"
                >
                  Reply
                </button>
                <span className="text-[var(--muted-foreground)]">|</span>
              </>
            )}
            <span className="text-xs text-[var(--muted-foreground)]">
              {mounted ? formatRelativeTime(comment.createdAt) : "..."}
            </span>
          </div>

          {/* Reply input */}
          {showReplyInput && (
            <div className="mt-2">
              <CommentInput
                onSubmit={(content) => {
                  onReply({ ...comment, content })
                  setShowReplyInput(false)
                }}
                placeholder={`Reply to ${author.name}...`}
                autoFocus
                isReply
              />
            </div>
          )}
        </div>
      </div>

      {/* Nested replies */}
      {hasReplies && (
        <div className="mt-2">
          {comment.replies!.length > 2 && !showReplies && (
            <button
              onClick={() => setShowReplies(true)}
              className="ml-12 text-sm font-medium text-[var(--primary)] hover:underline flex items-center gap-1"
            >
              Show {comment.replies!.length} replies
              <ChevronDown className="h-4 w-4" />
            </button>
          )}
          {showReplies && (
            <div className="space-y-3">
              {comment.replies!.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onReply={onReply}
                  onLike={onLike}
                  level={level + 1}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function SortSelector({
  value,
  onChange,
}: {
  value: SortOption
  onChange: (value: SortOption) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1 text-[var(--muted-foreground)]">
          <span>{value === "relevant" ? "Most relevant" : "Most recent"}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem
          onClick={() => onChange("relevant")}
          className={cn(value === "relevant" && "bg-[var(--accent)]")}
        >
          Most relevant
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onChange("recent")}
          className={cn(value === "recent" && "bg-[var(--accent)]")}
        >
          Most recent
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function CommentSection({ postId, className, initialCommentCount = 3 }: CommentSectionProps) {
  const allComments = commentsByPostId.get(postId) || []
  const [sortBy, setSortBy] = useState<SortOption>("relevant")
  const [visibleCount, setVisibleCount] = useState(initialCommentCount)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Sort comments
  const sortedComments = [...allComments].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
    // "relevant" - sort by reactions + recency
    const scoreA = a.totalReactions * 2 + (a.replies?.length || 0)
    const scoreB = b.totalReactions * 2 + (b.replies?.length || 0)
    return scoreB - scoreA
  })

  const visibleComments = sortedComments.slice(0, visibleCount)
  const hasMore = visibleCount < sortedComments.length

  const handleNewComment = (content: string) => {
    // In a real app, this would make an API call
    console.log("New comment:", content)
  }

  const handleReply = (parentComment: Comment) => {
    // In a real app, this would make an API call
    console.log("Reply to:", parentComment.id)
  }

  const handleLike = (comment: Comment) => {
    // In a real app, this would make an API call
    console.log("Like comment:", comment.id)
  }

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 5)
  }

  if (allComments.length === 0 && !mounted) {
    return (
      <div className={cn("pt-4", className)}>
        <CommentInput onSubmit={handleNewComment} />
        <p className="text-sm text-[var(--muted-foreground)] text-center mt-4">
          Be the first to comment
        </p>
      </div>
    )
  }

  return (
    <div className={cn("pt-4", className)}>
      {/* Comment input */}
      <CommentInput onSubmit={handleNewComment} />

      {/* Sort and count */}
      {allComments.length > 0 && (
        <div className="flex items-center justify-between mt-4 mb-3">
          <SortSelector value={sortBy} onChange={setSortBy} />
        </div>
      )}

      {/* Comments list */}
      <div className="space-y-4">
        {visibleComments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReply={handleReply}
            onLike={handleLike}
          />
        ))}
      </div>

      {/* Load more */}
      {hasMore && (
        <button
          onClick={handleLoadMore}
          className="w-full mt-4 py-2 text-sm font-medium text-[var(--primary)] hover:bg-[var(--muted)] rounded-lg transition-colors"
        >
          Show more comments ({sortedComments.length - visibleCount} remaining)
        </button>
      )}
    </div>
  )
}
