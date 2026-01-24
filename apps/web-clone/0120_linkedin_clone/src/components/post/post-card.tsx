"use client"

import { useState, useOptimistic, useTransition } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  MessageSquare,
  Repeat2,
  Send,
  MoreHorizontal,
  Bookmark,
  Globe,
  Briefcase,
  Award,
  GraduationCap,
  Cake,
} from "lucide-react"
import { cn, formatCount, formatRelativeTime, getInitials, getTopReactions } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { Post, ReactionType, ReactionCounts } from "@/lib/types"
import { REACTION_ICONS, REACTION_LABELS } from "@/lib/types"

interface PostCardProps {
  post: Post
}

const REACTION_COLORS: Record<ReactionType, string> = {
  like: "bg-reaction-like",
  celebrate: "bg-reaction-celebrate",
  support: "bg-reaction-support",
  love: "bg-reaction-love",
  insightful: "bg-reaction-insightful",
  funny: "bg-reaction-funny",
}

function ReactionPicker({
  onSelect,
  currentReaction,
}: {
  onSelect: (type: ReactionType) => void
  currentReaction?: ReactionType
}) {
  const reactions: ReactionType[] = ["like", "celebrate", "support", "love", "insightful", "funny"]

  return (
    <div className="flex gap-1 p-1.5 bg-card rounded-full shadow-lg border animate-in fade-in zoom-in-95 duration-150">
      {reactions.map((type) => (
        <TooltipProvider key={type} delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => onSelect(type)}
                className={cn(
                  "p-2 rounded-full hover:bg-accent hover:scale-125 transition-all duration-150",
                  currentReaction === type && "bg-accent scale-110"
                )}
              >
                <span className="text-xl">{REACTION_ICONS[type]}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              {REACTION_LABELS[type]}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  )
}

function ReactionSummary({ reactions, total }: { reactions: ReactionCounts; total: number }) {
  if (total === 0) return null

  const topReactions = getTopReactions(reactions)

  return (
    <div className="flex items-center gap-1">
      <div className="flex -space-x-1">
        {topReactions.map((type) => (
          <span
            key={type}
            className={cn(
              "w-4 h-4 rounded-full flex items-center justify-center text-[10px]",
              REACTION_COLORS[type as ReactionType]
            )}
          >
            {REACTION_ICONS[type as ReactionType]}
          </span>
        ))}
      </div>
      <span className="text-xs text-muted-foreground">{formatCount(total)}</span>
    </div>
  )
}

function CelebrationBanner({ post }: { post: Post }) {
  if (post.type !== "celebration") return null

  const icons = {
    "work-anniversary": Award,
    "new-job": Briefcase,
    "promotion": Award,
    "birthday": Cake,
    "education": GraduationCap,
  }

  const Icon = icons[post.celebrationType]

  return (
    <div className="mb-3 p-3 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-lg border border-primary/20">
      <div className="flex items-center gap-2 text-primary">
        <Icon className="h-5 w-5" />
        <span className="font-semibold text-sm">
          {post.celebrationType === "work-anniversary" && `${post.yearsAt} Year Work Anniversary`}
          {post.celebrationType === "new-job" && "Started a New Position"}
          {post.celebrationType === "promotion" && "Promoted"}
          {post.celebrationType === "birthday" && "Birthday"}
          {post.celebrationType === "education" && "Education Update"}
        </span>
      </div>
    </div>
  )
}

function ArticlePreview({ post }: { post: Post }) {
  if (post.type !== "article") return null

  return (
    <Link
      href={post.articleUrl}
      onClick={(e) => e.stopPropagation()}
      className="mt-3 block border rounded-lg overflow-hidden hover:bg-accent/50 transition-colors"
    >
      <div className="relative aspect-[2/1]">
        <Image
          src={post.articleImage}
          alt={post.articleTitle}
          fill
          className="object-cover"
          sizes="(max-width: 600px) 100vw, 600px"
        />
      </div>
      <div className="p-3">
        <h3 className="font-semibold line-clamp-2">{post.articleTitle}</h3>
        <p className="text-xs text-muted-foreground mt-1">{new URL(post.articleUrl).hostname}</p>
      </div>
    </Link>
  )
}

function JobSharePreview({ post }: { post: Post }) {
  if (post.type !== "job-share") return null

  const { job } = post

  return (
    <div className="mt-3 border rounded-lg p-4 hover:bg-accent/50 transition-colors">
      <div className="flex gap-3">
        <Image
          src={job.company.logo}
          alt={job.company.name}
          width={48}
          height={48}
          className="rounded"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-primary hover:underline">{job.title}</h3>
          <p className="text-sm">{job.company.name}</p>
          <p className="text-xs text-muted-foreground">
            {job.location} ({job.workplaceType})
          </p>
          {job.isEasyApply && (
            <Badge variant="secondary" className="mt-2 text-xs">
              Easy Apply
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}

function PollContent({ post }: { post: Post }) {
  if (post.type !== "poll") return null

  const { pollOptions, totalVotes, userVote } = post
  const hasVoted = !!userVote

  return (
    <div className="mt-3 space-y-2">
      {pollOptions.map((option) => {
        const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0
        const isSelected = userVote === option.id

        return (
          <button
            key={option.id}
            disabled={hasVoted}
            className={cn(
              "w-full text-left p-3 rounded-lg border transition-colors relative overflow-hidden",
              !hasVoted && "hover:bg-accent",
              isSelected && "border-primary"
            )}
          >
            {hasVoted && (
              <div
                className="absolute inset-y-0 left-0 bg-primary/10"
                style={{ width: `${percentage}%` }}
              />
            )}
            <div className="relative flex justify-between items-center">
              <span className={cn(isSelected && "font-semibold")}>{option.text}</span>
              {hasVoted && <span className="text-sm font-medium">{percentage}%</span>}
            </div>
          </button>
        )
      })}
      <p className="text-xs text-muted-foreground">
        {formatCount(totalVotes)} votes • {formatRelativeTime(post.pollEndDate)} left
      </p>
    </div>
  )
}

export function PostCard({ post }: PostCardProps) {
  const [showReactionPicker, setShowReactionPicker] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [optimisticPost, updateOptimistic] = useOptimistic(
    post,
    (state: Post, update: Partial<Post>) => ({ ...state, ...update } as Post)
  )

  const handleReaction = (type: ReactionType) => {
    setShowReactionPicker(false)
    startTransition(() => {
      const currentReaction = optimisticPost.userReaction
      const reactions = { ...optimisticPost.reactions }

      // Remove previous reaction if any
      if (currentReaction) {
        reactions[currentReaction] = Math.max(0, reactions[currentReaction] - 1)
        reactions.total = Math.max(0, reactions.total - 1)
      }

      // Add new reaction or toggle off
      if (currentReaction === type) {
        updateOptimistic({
          userReaction: undefined,
          reactions,
        })
      } else {
        reactions[type] = reactions[type] + 1
        reactions.total = reactions.total + 1
        updateOptimistic({
          userReaction: type,
          reactions,
        })
      }
    })
  }

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    startTransition(() => {
      updateOptimistic({
        isBookmarked: !optimisticPost.isBookmarked,
      })
    })
  }

  return (
    <Card className="overflow-hidden">
      <article className="p-4">
        {/* Author header */}
        <div className="flex gap-3">
          <Link
            href={`/profile/${post.author.username}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Avatar className="h-12 w-12 hover:opacity-90 transition-opacity">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>{getInitials(post.author.name)}</AvatarFallback>
            </Avatar>
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <Link
                  href={`/profile/${post.author.username}`}
                  onClick={(e) => e.stopPropagation()}
                  className="font-semibold hover:underline hover:text-primary flex items-center gap-1"
                >
                  {post.author.name}
                  {post.author.isPremium && (
                    <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 bg-amber-100 text-amber-700 border-amber-300">
                      Premium
                    </Badge>
                  )}
                </Link>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {post.author.headline}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {formatRelativeTime(post.createdAt)} • <Globe className="h-3 w-3" />
                </p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 -m-2 rounded-full hover:bg-accent transition-colors"
                >
                  <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleBookmark}>
                    {optimisticPost.isBookmarked ? "Remove from saved" : "Save"}
                  </DropdownMenuItem>
                  <DropdownMenuItem>Copy link to post</DropdownMenuItem>
                  <DropdownMenuItem>Hide post</DropdownMenuItem>
                  <DropdownMenuItem>Report post</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Celebration banner */}
        {post.type === "celebration" && <CelebrationBanner post={post} />}

        {/* Content */}
        <div className="mt-3">
          <p className="whitespace-pre-wrap break-words">{post.content}</p>

          {/* Images (for text posts) */}
          {post.type === "text" && post.images && post.images.length > 0 && (
            <div
              className={cn(
                "mt-3 rounded-lg overflow-hidden",
                "grid gap-0.5",
                post.images.length === 1 && "grid-cols-1",
                post.images.length === 2 && "grid-cols-2",
                post.images.length >= 3 && "grid-cols-2"
              )}
            >
              {post.images.slice(0, 4).map((image, i) => (
                <div
                  key={i}
                  className={cn(
                    "relative aspect-[4/3]",
                    post.images!.length === 3 && i === 0 && "row-span-2 aspect-auto"
                  )}
                >
                  <Image
                    src={image}
                    alt={`Image ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 600px) 100vw, 600px"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Article preview */}
          <ArticlePreview post={post} />

          {/* Job share preview */}
          <JobSharePreview post={post} />

          {/* Poll */}
          <PollContent post={post} />
        </div>

        {/* Engagement stats */}
        <div className="mt-3 pt-2 border-t flex items-center justify-between text-xs text-muted-foreground">
          <ReactionSummary reactions={optimisticPost.reactions} total={optimisticPost.reactions.total} />
          <div className="flex gap-2">
            {optimisticPost.comments > 0 && (
              <span>{formatCount(optimisticPost.comments)} comments</span>
            )}
            {optimisticPost.shares > 0 && (
              <span>{formatCount(optimisticPost.shares)} reposts</span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-2 pt-2 border-t flex items-center justify-between">
          {/* Like button with reaction picker */}
          <div
            className="relative"
            onMouseEnter={() => setShowReactionPicker(true)}
            onMouseLeave={() => setShowReactionPicker(false)}
          >
            {showReactionPicker && (
              <div className="absolute bottom-full left-0 mb-2 z-10">
                <ReactionPicker
                  onSelect={handleReaction}
                  currentReaction={optimisticPost.userReaction}
                />
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "gap-1.5 text-muted-foreground hover:bg-accent",
                optimisticPost.userReaction && "text-primary"
              )}
              onClick={() => handleReaction(optimisticPost.userReaction || "like")}
            >
              <span className="text-lg">
                {optimisticPost.userReaction
                  ? REACTION_ICONS[optimisticPost.userReaction]
                  : "👍"}
              </span>
              <span className="text-xs font-medium">
                {optimisticPost.userReaction
                  ? REACTION_LABELS[optimisticPost.userReaction]
                  : "Like"}
              </span>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground hover:bg-accent"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="text-xs font-medium">Comment</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground hover:bg-accent"
          >
            <Repeat2 className="h-4 w-4" />
            <span className="text-xs font-medium">Repost</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground hover:bg-accent"
          >
            <Send className="h-4 w-4" />
            <span className="text-xs font-medium">Send</span>
          </Button>
        </div>
      </article>
    </Card>
  )
}
