"use client"

import { useState, useOptimistic } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ThumbsUp,
  MessageSquare,
  Repeat2,
  Send,
  MoreHorizontal,
  Globe,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ReactionPicker, getReactionEmoji, getReactionColor } from "./reaction-picker"
import { cn, formatRelativeTime, formatCount, getInitials } from "@/lib/utils"
import type { Post, ReactionType, ReactionSummary } from "@/lib/types"
import { toast } from "sonner"

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const [showReactionPicker, setShowReactionPicker] = useState(false)
  const [isSaved, setIsSaved] = useState(post.isSaved)

  const [optimisticReaction, setOptimisticReaction] = useOptimistic<{
    userReaction?: ReactionType
    totalReactions: number
    reactions: ReactionSummary[]
  }>({
    userReaction: post.userReaction,
    totalReactions: post.totalReactions,
    reactions: post.reactions,
  })

  const handleReaction = (type: ReactionType) => {
    const hadReaction = !!optimisticReaction.userReaction
    const isSameReaction = optimisticReaction.userReaction === type

    setOptimisticReaction((current) => {
      if (isSameReaction) {
        // Remove reaction
        return {
          userReaction: undefined,
          totalReactions: current.totalReactions - 1,
          reactions: current.reactions.map((r) =>
            r.type === type ? { ...r, count: r.count - 1 } : r
          ).filter((r) => r.count > 0),
        }
      } else {
        // Add or change reaction
        const newReactions = current.reactions.map((r) => {
          if (r.type === current.userReaction) return { ...r, count: r.count - 1 }
          if (r.type === type) return { ...r, count: r.count + 1 }
          return r
        }).filter((r) => r.count > 0)

        // Add new reaction type if it doesn't exist
        if (!newReactions.find((r) => r.type === type)) {
          newReactions.push({ type, count: 1 })
        }

        return {
          userReaction: type,
          totalReactions: hadReaction ? current.totalReactions : current.totalReactions + 1,
          reactions: newReactions,
        }
      }
    })

    setShowReactionPicker(false)
    toast.success(isSameReaction ? "Reaction removed" : `Reacted with ${getReactionEmoji(type)}`)
  }

  const toggleSave = () => {
    setIsSaved(!isSaved)
    toast.success(isSaved ? "Removed from saved items" : "Saved to your items")
  }

  const topReactions = optimisticReaction.reactions
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <Link href={`/profile/${post.author.firstName.toLowerCase()}`}>
            <Avatar className="h-12 w-12">
              <AvatarImage src={post.author.avatar} />
              <AvatarFallback>
                {getInitials(post.author.firstName, post.author.lastName)}
              </AvatarFallback>
            </Avatar>
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <Link
                href={`/profile/${post.author.firstName.toLowerCase()}`}
                className="font-semibold text-sm hover:underline truncate"
              >
                {post.author.firstName} {post.author.lastName}
              </Link>
              {post.author.isPremium && (
                <span className="text-amber-500 text-xs">•</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {post.author.headline}
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {formatRelativeTime(post.createdAt)} • <Globe className="h-3 w-3" />
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={toggleSave}>
                {isSaved ? (
                  <>
                    <BookmarkCheck className="mr-2 h-4 w-4" />
                    Unsave
                  </>
                ) : (
                  <>
                    <Bookmark className="mr-2 h-4 w-4" />
                    Save
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem>Copy link to post</DropdownMenuItem>
              <DropdownMenuItem>Report post</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Content */}
        <div className="mt-3">
          <p className="text-sm whitespace-pre-wrap">{post.content}</p>

          {/* Post type specific content */}
          {post.type === "text" && post.images && post.images.length > 0 && (
            <div
              className={cn(
                "mt-3 grid gap-1 rounded-lg overflow-hidden",
                post.images.length === 1 && "grid-cols-1",
                post.images.length === 2 && "grid-cols-2",
                post.images.length >= 3 && "grid-cols-2"
              )}
            >
              {post.images.slice(0, 4).map((image, i) => (
                <div
                  key={i}
                  className={cn(
                    "relative aspect-video bg-muted",
                    post.images!.length === 3 && i === 0 && "col-span-2"
                  )}
                >
                  <Image
                    src={image}
                    alt=""
                    fill
                    className="object-cover"
                  />
                  {post.images!.length > 4 && i === 3 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        +{post.images!.length - 4}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {post.type === "article" && (
            <Link
              href={post.article.url}
              className="mt-3 block border rounded-lg overflow-hidden hover:bg-muted/50 transition-colors"
            >
              <div className="relative aspect-[2/1] bg-muted">
                <Image
                  src={post.article.image}
                  alt={post.article.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm line-clamp-2">{post.article.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {post.article.description}
                </p>
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <ExternalLink className="h-3 w-3" />
                  {post.article.source}
                </p>
              </div>
            </Link>
          )}

          {post.type === "celebration" && (
            <div className="mt-3 p-4 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200/50 dark:border-amber-800/50">
              <div className="flex items-center gap-3">
                <span className="text-4xl">
                  {post.celebrationType === "work-anniversary" && "🎉"}
                  {post.celebrationType === "new-position" && "🎊"}
                  {post.celebrationType === "promotion" && "🚀"}
                  {post.celebrationType === "new-job" && "✨"}
                </span>
                <div>
                  <p className="font-semibold text-sm">
                    {post.celebrationType === "work-anniversary" &&
                      `${post.years} Year Work Anniversary`}
                    {post.celebrationType === "new-position" && "Started a New Position"}
                    {post.celebrationType === "promotion" && "Got Promoted"}
                    {post.celebrationType === "new-job" && "Started a New Job"}
                  </p>
                  {post.company && (
                    <p className="text-xs text-muted-foreground">{post.company.name}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {post.type === "poll" && (
            <div className="mt-3 space-y-2">
              {post.poll.options.map((option) => {
                const isVoted = post.poll.userVotedOptionId === option.id
                return (
                  <button
                    key={option.id}
                    className={cn(
                      "w-full p-3 rounded-lg border text-left transition-colors relative overflow-hidden",
                      isVoted
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/50"
                    )}
                  >
                    <div
                      className="absolute inset-y-0 left-0 bg-primary/10"
                      style={{ width: `${option.percentage}%` }}
                    />
                    <div className="relative flex justify-between items-center">
                      <span className={cn("text-sm", isVoted && "font-medium")}>
                        {option.text}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {option.percentage}%
                      </span>
                    </div>
                  </button>
                )
              })}
              <p className="text-xs text-muted-foreground">
                {formatCount(post.poll.totalVotes)} votes
              </p>
            </div>
          )}
        </div>

        {/* Reactions summary */}
        {optimisticReaction.totalReactions > 0 && (
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="flex -space-x-1">
                {topReactions.map((reaction) => (
                  <span
                    key={reaction.type}
                    className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-card border text-xs"
                  >
                    {getReactionEmoji(reaction.type)}
                  </span>
                ))}
              </div>
              <span>{formatCount(optimisticReaction.totalReactions)}</span>
            </div>
            <div className="flex gap-2">
              {post.comments > 0 && (
                <span>{formatCount(post.comments)} comments</span>
              )}
              {post.reposts > 0 && (
                <span>{formatCount(post.reposts)} reposts</span>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-3 pt-2 border-t flex items-center justify-between relative">
          <div
            className="relative"
            onMouseEnter={() => setShowReactionPicker(true)}
            onMouseLeave={() => setShowReactionPicker(false)}
          >
            {showReactionPicker && (
              <div className="absolute bottom-full left-0 mb-2 z-10">
                <ReactionPicker
                  onSelect={handleReaction}
                  currentReaction={optimisticReaction.userReaction}
                />
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "gap-1.5",
                optimisticReaction.userReaction && getReactionColor(optimisticReaction.userReaction)
              )}
              onClick={() => handleReaction(optimisticReaction.userReaction || "like")}
            >
              {optimisticReaction.userReaction ? (
                <span className="text-lg">{getReactionEmoji(optimisticReaction.userReaction)}</span>
              ) : (
                <ThumbsUp className="h-5 w-5" />
              )}
              <span className="hidden sm:inline">
                {optimisticReaction.userReaction
                  ? optimisticReaction.userReaction.charAt(0).toUpperCase() +
                    optimisticReaction.userReaction.slice(1)
                  : "Like"}
              </span>
            </Button>
          </div>

          <Button variant="ghost" size="sm" className="gap-1.5" asChild>
            <Link href={`/post/${post.id}`}>
              <MessageSquare className="h-5 w-5" />
              <span className="hidden sm:inline">Comment</span>
            </Link>
          </Button>

          <Button variant="ghost" size="sm" className="gap-1.5">
            <Repeat2 className="h-5 w-5" />
            <span className="hidden sm:inline">Repost</span>
          </Button>

          <Button variant="ghost" size="sm" className="gap-1.5">
            <Send className="h-5 w-5" />
            <span className="hidden sm:inline">Send</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
