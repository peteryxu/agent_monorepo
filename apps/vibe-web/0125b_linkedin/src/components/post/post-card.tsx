"use client"

import { useState, useOptimistic, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  MoreHorizontal,
  Globe,
  MessageSquare,
  Repeat2,
  Send,
  ThumbsUp,
  Bookmark,
  Flag,
  UserMinus,
  EyeOff,
  Link2,
  Briefcase,
  MapPin,
  Clock,
  Award,
  Sparkles,
  PartyPopper,
  Cake,
  Gift,
} from "lucide-react"
import { cn, formatRelativeTime, formatCount } from "@/lib/utils"
import type {
  Post,
  TextPost,
  ArticlePost,
  JobSharePost,
  CelebrationPost,
  PollPost,
  User,
  Job,
  Company,
  ReactionType,
  ReactionSummary,
  CelebrationType,
} from "@/lib/types"
import { usersById, jobsById, companiesById } from "@/lib/mock-data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ReactionPicker, getReactionEmoji } from "./reaction-picker"

// =============================================================================
// Types
// =============================================================================

interface PostCardProps {
  post: Post
  className?: string
}

interface OptimisticState {
  reactions: ReactionSummary[]
  totalReactions: number
  userReaction: ReactionType | null
}

// =============================================================================
// Celebration Icons & Colors
// =============================================================================

const CELEBRATION_CONFIG: Record<CelebrationType, { icon: React.ComponentType<{ className?: string }>; bg: string; title: string }> = {
  "new-job": { icon: Briefcase, bg: "bg-blue-50 dark:bg-blue-950", title: "Started a new position" },
  "promotion": { icon: Award, bg: "bg-purple-50 dark:bg-purple-950", title: "Got promoted" },
  "anniversary": { icon: Sparkles, bg: "bg-amber-50 dark:bg-amber-950", title: "Celebrating an anniversary" },
  "birthday": { icon: Cake, bg: "bg-pink-50 dark:bg-pink-950", title: "Birthday" },
  "work-anniversary": { icon: Gift, bg: "bg-green-50 dark:bg-green-950", title: "Work Anniversary" },
}

// =============================================================================
// Sub-components
// =============================================================================

function AuthorHeader({ author, timestamp }: { author: User; timestamp: Date }) {
  return (
    <div className="flex items-start gap-3">
      <Link href={`/profile/${author.id}`}>
        <Avatar className="h-12 w-12">
          <AvatarImage src={author.avatar} alt={author.name} />
          <AvatarFallback>{author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      </Link>
      <div className="flex-1 min-w-0">
        <Link
          href={`/profile/${author.id}`}
          className="font-semibold text-[var(--foreground)] hover:text-[var(--primary)] hover:underline"
        >
          {author.name}
        </Link>
        <p className="text-sm text-[var(--muted-foreground)] line-clamp-1">{author.headline}</p>
        <div className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
          <span>{formatRelativeTime(timestamp)}</span>
          <span>·</span>
          <Globe className="h-3 w-3" />
        </div>
      </div>
    </div>
  )
}

function PostMoreMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-5 w-5" />
          <span className="sr-only">More options</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuItem>
          <Bookmark className="h-4 w-4 mr-2" />
          Save
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link2 className="h-4 w-4 mr-2" />
          Copy link to post
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <EyeOff className="h-4 w-4 mr-2" />
          I don&apos;t want to see this
        </DropdownMenuItem>
        <DropdownMenuItem>
          <UserMinus className="h-4 w-4 mr-2" />
          Unfollow
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600">
          <Flag className="h-4 w-4 mr-2" />
          Report post
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function ImageGallery({ images }: { images: string[] }) {
  if (images.length === 0) return null

  const gridClass = cn(
    "grid gap-1 mt-3",
    images.length === 1 && "grid-cols-1",
    images.length === 2 && "grid-cols-2",
    images.length === 3 && "grid-cols-2",
    images.length >= 4 && "grid-cols-2"
  )

  const visibleImages = images.slice(0, 4)
  const remainingCount = images.length - 4

  return (
    <div className={gridClass}>
      {visibleImages.map((src, index) => (
        <div
          key={index}
          className={cn(
            "relative overflow-hidden rounded-lg bg-[var(--muted)]",
            images.length === 3 && index === 0 && "row-span-2",
            images.length === 1 ? "aspect-video" : "aspect-square"
          )}
        >
          <Image
            src={src}
            alt={`Post image ${index + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 600px"
          />
          {index === 3 && remainingCount > 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white text-2xl font-semibold">+{remainingCount}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function TextPostContent({ post }: { post: TextPost }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const shouldTruncate = post.content.length > 300

  return (
    <div className="mt-3">
      <p className={cn("whitespace-pre-wrap", !isExpanded && shouldTruncate && "line-clamp-4")}>
        {post.content}
      </p>
      {shouldTruncate && !isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:underline text-sm mt-1"
        >
          ...see more
        </button>
      )}
      <ImageGallery images={post.images} />
    </div>
  )
}

function ArticlePostContent({ post }: { post: ArticlePost }) {
  return (
    <div className="mt-3">
      <Link
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block border border-[var(--border)] rounded-lg overflow-hidden hover:bg-[var(--muted)]/50 transition-colors"
      >
        <div className="relative aspect-[1.91/1] bg-[var(--muted)]">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 600px"
          />
        </div>
        <div className="p-3">
          <h3 className="font-semibold line-clamp-2">{post.title}</h3>
          <p className="text-sm text-[var(--muted-foreground)] line-clamp-2 mt-1">{post.description}</p>
          <p className="text-xs text-[var(--muted-foreground)] mt-2">{new URL(post.url).hostname}</p>
        </div>
      </Link>
    </div>
  )
}

function JobSharePostContent({ post }: { post: JobSharePost }) {
  const job = jobsById.get(post.jobId)

  if (!job) {
    return (
      <div className="mt-3 p-4 border border-[var(--border)] rounded-lg bg-[var(--muted)]/50">
        <p className="text-[var(--muted-foreground)]">Job no longer available</p>
      </div>
    )
  }

  return (
    <div className="mt-3">
      {post.caption && <p className="mb-3">{post.caption}</p>}
      <Link
        href={`/jobs/${job.id}`}
        className="block border border-[var(--border)] rounded-lg p-4 hover:bg-[var(--muted)]/50 transition-colors"
      >
        <div className="flex gap-3">
          <div className="relative h-12 w-12 rounded overflow-hidden bg-[var(--muted)] flex-shrink-0">
            <Image src={job.companyLogo} alt={job.companyName} fill className="object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[var(--primary)]">{job.title}</h3>
            <p className="text-sm">{job.companyName}</p>
            <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] mt-1">
              <MapPin className="h-3 w-3" />
              <span>{job.location}</span>
              <span>·</span>
              <span>{job.workplaceType}</span>
            </div>
          </div>
        </div>
        {job.isEasyApply && (
          <div className="mt-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
              <Briefcase className="h-3 w-3" />
              Easy Apply
            </span>
          </div>
        )}
      </Link>
    </div>
  )
}

function CelebrationPostContent({ post }: { post: CelebrationPost }) {
  const config = CELEBRATION_CONFIG[post.celebrationType]
  const IconComponent = config.icon
  const company = post.companyId ? companiesById.get(post.companyId) : null

  return (
    <div className="mt-3">
      <div className={cn("rounded-lg p-4", config.bg)}>
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-white">
            <IconComponent className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold">{config.title}</p>
            {company && <p className="text-sm text-[var(--muted-foreground)]">at {company.name}</p>}
          </div>
        </div>
        <p className="whitespace-pre-wrap">{post.content}</p>
      </div>
    </div>
  )
}

function PollPostContent({ post }: { post: PollPost }) {
  const [selectedOption, setSelectedOption] = useState<string | null>(post.selectedOptionId || null)
  const [hasVoted, setHasVoted] = useState(post.hasVoted || false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleVote = (optionId: string) => {
    if (hasVoted) return
    setSelectedOption(optionId)
    setHasVoted(true)
  }

  const totalVotes = post.totalVotes + (hasVoted && !post.hasVoted ? 1 : 0)

  // Calculate remaining time
  const now = new Date()
  const endDate = new Date(post.endDate)
  const remainingMs = endDate.getTime() - now.getTime()
  const remainingDays = Math.max(0, Math.ceil(remainingMs / (1000 * 60 * 60 * 24)))
  const isPollEnded = remainingMs <= 0

  return (
    <div className="mt-3">
      <p className="font-semibold mb-3">{post.question}</p>
      <div className="space-y-2">
        {post.options.map((option) => {
          const votes = option.votes + (hasVoted && selectedOption === option.id ? 1 : 0)
          const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0
          const isSelected = selectedOption === option.id

          return (
            <button
              key={option.id}
              onClick={() => handleVote(option.id)}
              disabled={hasVoted || isPollEnded}
              className={cn(
                "w-full relative overflow-hidden rounded-lg border transition-colors text-left",
                hasVoted || isPollEnded
                  ? "border-[var(--border)] cursor-default"
                  : "border-[var(--primary)] hover:bg-[var(--primary)]/5 cursor-pointer",
                isSelected && "border-[var(--primary)] ring-1 ring-[var(--primary)]"
              )}
            >
              {/* Progress bar background */}
              {(hasVoted || isPollEnded) && mounted && (
                <div
                  className="absolute inset-y-0 left-0 bg-[var(--primary)]/10 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              )}
              <div className="relative px-4 py-3 flex items-center justify-between">
                <span className={cn(isSelected && "font-semibold")}>{option.text}</span>
                {(hasVoted || isPollEnded) && mounted && (
                  <span className="font-semibold">{percentage}%</span>
                )}
              </div>
            </button>
          )
        })}
      </div>
      <div className="flex items-center gap-2 mt-3 text-sm text-[var(--muted-foreground)]">
        <span>{formatCount(totalVotes)} votes</span>
        <span>·</span>
        {isPollEnded ? (
          <span>Poll ended</span>
        ) : (
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {remainingDays === 0 ? "Ends today" : `${remainingDays}d left`}
          </span>
        )}
      </div>
    </div>
  )
}

function ReactionBar({ reactions, totalReactions }: { reactions: ReactionSummary[]; totalReactions: number }) {
  if (totalReactions === 0) return null

  // Get top 3 reactions by count
  const topReactions = [...reactions].sort((a, b) => b.count - a.count).slice(0, 3)

  return (
    <div className="flex items-center gap-1 text-sm text-[var(--muted-foreground)]">
      <div className="flex -space-x-1">
        {topReactions.map((reaction, index) => (
          <span
            key={reaction.type}
            className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-[var(--card)] border border-[var(--background)] text-xs"
            style={{ zIndex: 3 - index }}
          >
            {getReactionEmoji(reaction.type)}
          </span>
        ))}
      </div>
      <span className="hover:text-[var(--primary)] hover:underline cursor-pointer">
        {formatCount(totalReactions)}
      </span>
    </div>
  )
}

function ActionButtons({
  userReaction,
  onReactionSelect,
  commentCount,
  repostCount,
}: {
  userReaction: ReactionType | null
  onReactionSelect: (reaction: ReactionType) => void
  commentCount: number
  repostCount: number
}) {
  const [showReactionPicker, setShowReactionPicker] = useState(false)

  const handleLikeClick = () => {
    if (userReaction) {
      // Toggle off - for simplicity we just set to 'like' and toggle
      onReactionSelect("like")
    } else {
      onReactionSelect("like")
    }
  }

  return (
    <div className="flex items-center justify-between pt-1">
      <div className="relative">
        <Button
          variant="ghost"
          className={cn(
            "gap-2",
            userReaction && "text-[var(--primary)]"
          )}
          onClick={handleLikeClick}
          onMouseEnter={() => setShowReactionPicker(true)}
          onMouseLeave={() => setTimeout(() => setShowReactionPicker(false), 300)}
        >
          <ThumbsUp className={cn("h-5 w-5", userReaction && "fill-current")} />
          <span>{userReaction ? getReactionEmoji(userReaction) + " " + capitalize(userReaction) : "Like"}</span>
        </Button>
        {showReactionPicker && (
          <div
            className="absolute bottom-full left-0 mb-2 z-50"
            onMouseEnter={() => setShowReactionPicker(true)}
            onMouseLeave={() => setShowReactionPicker(false)}
          >
            <ReactionPicker
              onSelect={(reaction) => {
                onReactionSelect(reaction)
                setShowReactionPicker(false)
              }}
              selectedReaction={userReaction || undefined}
            />
          </div>
        )}
      </div>

      <Button variant="ghost" className="gap-2">
        <MessageSquare className="h-5 w-5" />
        <span>Comment</span>
        {commentCount > 0 && <span className="text-[var(--muted-foreground)]">({formatCount(commentCount)})</span>}
      </Button>

      <Button variant="ghost" className="gap-2">
        <Repeat2 className="h-5 w-5" />
        <span>Repost</span>
        {repostCount > 0 && <span className="text-[var(--muted-foreground)]">({formatCount(repostCount)})</span>}
      </Button>

      <Button variant="ghost" className="gap-2">
        <Send className="h-5 w-5" />
        <span>Send</span>
      </Button>
    </div>
  )
}

// =============================================================================
// Helper
// =============================================================================

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// =============================================================================
// Main Component
// =============================================================================

export function PostCard({ post, className }: PostCardProps) {
  const author = usersById.get(post.authorId)

  // Optimistic state for reactions
  const [optimisticState, addOptimisticReaction] = useOptimistic<OptimisticState, ReactionType>(
    {
      reactions: post.reactions,
      totalReactions: post.totalReactions,
      userReaction: null,
    },
    (state, newReaction) => {
      // If already reacted with same type, remove reaction
      if (state.userReaction === newReaction) {
        const updatedReactions = state.reactions.map((r) =>
          r.type === newReaction ? { ...r, count: Math.max(0, r.count - 1) } : r
        )
        return {
          reactions: updatedReactions,
          totalReactions: Math.max(0, state.totalReactions - 1),
          userReaction: null,
        }
      }

      // If changing reaction type
      if (state.userReaction) {
        const updatedReactions = state.reactions.map((r) => {
          if (r.type === state.userReaction) {
            return { ...r, count: Math.max(0, r.count - 1) }
          }
          if (r.type === newReaction) {
            return { ...r, count: r.count + 1 }
          }
          return r
        })
        // Add new reaction if it doesn't exist
        const hasNewReaction = updatedReactions.some((r) => r.type === newReaction)
        if (!hasNewReaction) {
          updatedReactions.push({ type: newReaction, count: 1 })
        }
        return {
          reactions: updatedReactions,
          totalReactions: state.totalReactions,
          userReaction: newReaction,
        }
      }

      // Adding new reaction
      const existingReaction = state.reactions.find((r) => r.type === newReaction)
      const updatedReactions = existingReaction
        ? state.reactions.map((r) =>
            r.type === newReaction ? { ...r, count: r.count + 1 } : r
          )
        : [...state.reactions, { type: newReaction, count: 1 }]

      return {
        reactions: updatedReactions,
        totalReactions: state.totalReactions + 1,
        userReaction: newReaction,
      }
    }
  )

  const handleReactionSelect = (reaction: ReactionType) => {
    addOptimisticReaction(reaction)
    // In a real app, you would make an API call here
    // await api.reactToPost(post.id, reaction)
  }

  if (!author) return null

  // Render post content based on type
  const renderPostContent = () => {
    switch (post.type) {
      case "text":
        return <TextPostContent post={post} />
      case "article":
        return <ArticlePostContent post={post} />
      case "job-share":
        return <JobSharePostContent post={post} />
      case "celebration":
        return <CelebrationPostContent post={post} />
      case "poll":
        return <PollPostContent post={post} />
      default: {
        const _exhaustive: never = post
        return null
      }
    }
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <AuthorHeader author={author} timestamp={post.createdAt} />
          <PostMoreMenu />
        </div>

        {/* Content */}
        {renderPostContent()}

        {/* Stats row */}
        <div className="flex items-center justify-between mt-4 pb-2 border-b border-[var(--border)]">
          <ReactionBar
            reactions={optimisticState.reactions}
            totalReactions={optimisticState.totalReactions}
          />
          <div className="flex items-center gap-3 text-sm text-[var(--muted-foreground)]">
            {post.comments > 0 && (
              <span className="hover:text-[var(--primary)] hover:underline cursor-pointer">
                {formatCount(post.comments)} comments
              </span>
            )}
            {post.reposts > 0 && (
              <span className="hover:text-[var(--primary)] hover:underline cursor-pointer">
                {formatCount(post.reposts)} reposts
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <ActionButtons
          userReaction={optimisticState.userReaction}
          onReactionSelect={handleReactionSelect}
          commentCount={post.comments}
          repostCount={post.reposts}
        />
      </CardContent>
    </Card>
  )
}
