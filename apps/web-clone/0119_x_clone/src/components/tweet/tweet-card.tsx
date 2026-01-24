"use client"

import { useState, useOptimistic, useTransition } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  MessageCircle,
  Repeat2,
  Heart,
  BarChart3,
  Share,
  Bookmark,
  MoreHorizontal,
} from "lucide-react"
import { cn, formatCount, formatRelativeTime } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { VerifiedBadge } from "./verified-badge"
import type { Tweet } from "@/lib/types"

interface TweetCardProps {
  tweet: Tweet
  showBorder?: boolean
}

interface ActionButtonProps {
  icon: React.ReactNode
  activeIcon?: React.ReactNode
  count?: number
  color: "reply" | "retweet" | "like" | "default"
  active?: boolean
  onClick?: (e: React.MouseEvent) => void
  label: string
}

function ActionButton({
  icon,
  activeIcon,
  count,
  color,
  active,
  onClick,
  label,
}: ActionButtonProps) {
  const colorClasses = {
    reply: "hover:text-reply hover:bg-reply/10 group-hover:text-reply",
    retweet: active
      ? "text-retweet"
      : "hover:text-retweet hover:bg-retweet/10 group-hover:text-retweet",
    like: active
      ? "text-like"
      : "hover:text-like hover:bg-like/10 group-hover:text-like",
    default: "hover:text-primary hover:bg-primary/10",
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex items-center gap-1 -ml-2",
        "text-muted-foreground transition-colors duration-150"
      )}
      aria-label={label}
    >
      <span
        className={cn(
          "p-2 rounded-full transition-colors duration-150",
          colorClasses[color]
        )}
      >
        {active && activeIcon ? activeIcon : icon}
      </span>
      {count !== undefined && count > 0 && (
        <span
          className={cn(
            "text-sm transition-colors duration-150",
            active && color === "like" && "text-like",
            active && color === "retweet" && "text-retweet"
          )}
        >
          {formatCount(count)}
        </span>
      )}
    </button>
  )
}

export function TweetCard({ tweet, showBorder = true }: TweetCardProps) {
  const [isPending, startTransition] = useTransition()
  const [optimisticTweet, updateOptimistic] = useOptimistic(
    tweet,
    (state: Tweet, update: Partial<Tweet>) => ({ ...state, ...update })
  )

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    startTransition(() => {
      updateOptimistic({
        isLiked: !optimisticTweet.isLiked,
        likes: optimisticTweet.isLiked
          ? optimisticTweet.likes - 1
          : optimisticTweet.likes + 1,
      })
    })
  }

  const handleRetweet = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    startTransition(() => {
      updateOptimistic({
        isRetweeted: !optimisticTweet.isRetweeted,
        retweets: optimisticTweet.isRetweeted
          ? optimisticTweet.retweets - 1
          : optimisticTweet.retweets + 1,
      })
    })
  }

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    startTransition(() => {
      updateOptimistic({
        isBookmarked: !optimisticTweet.isBookmarked,
      })
    })
  }

  return (
    <article
      role="article"
      aria-labelledby={`tweet-${tweet.id}-author`}
      className={cn(
        "px-4 py-3 hover:bg-accent/50 transition-colors cursor-pointer",
        showBorder && "border-b border-border"
      )}
    >
      <Link href={`/tweet/${tweet.id}`} className="block">
        <div className="flex gap-3">
          {/* Avatar */}
          <Link
            href={`/profile/${tweet.author.username}`}
            onClick={(e) => e.stopPropagation()}
            className="flex-shrink-0"
          >
            <Avatar className="h-10 w-10 hover:opacity-90 transition-opacity">
              <AvatarImage src={tweet.author.avatar} alt={tweet.author.name} />
              <AvatarFallback>{tweet.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </Link>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-1 text-sm">
              <Link
                href={`/profile/${tweet.author.username}`}
                onClick={(e) => e.stopPropagation()}
                className="font-bold hover:underline truncate flex items-center gap-1"
                id={`tweet-${tweet.id}-author`}
              >
                {tweet.author.name}
                {tweet.author.verified && <VerifiedBadge />}
              </Link>
              <span className="text-muted-foreground truncate">
                @{tweet.author.username}
              </span>
              <span className="text-muted-foreground">·</span>
              <time
                className="text-muted-foreground hover:underline"
                dateTime={tweet.createdAt.toISOString()}
              >
                {formatRelativeTime(tweet.createdAt)}
              </time>
              <div className="ml-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 -m-1.5 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Not interested in this</DropdownMenuItem>
                    <DropdownMenuItem>
                      Follow @{tweet.author.username}
                    </DropdownMenuItem>
                    <DropdownMenuItem>Mute @{tweet.author.username}</DropdownMenuItem>
                    <DropdownMenuItem>Block @{tweet.author.username}</DropdownMenuItem>
                    <DropdownMenuItem>Report post</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Tweet content */}
            <p className="mt-1 whitespace-pre-wrap break-words">
              {tweet.content}
            </p>

            {/* Images */}
            {tweet.images && tweet.images.length > 0 && (
              <div
                className={cn(
                  "mt-3 rounded-2xl overflow-hidden border border-border",
                  "grid gap-0.5",
                  tweet.images.length === 1 && "grid-cols-1",
                  tweet.images.length === 2 && "grid-cols-2",
                  tweet.images.length >= 3 && "grid-cols-2"
                )}
              >
                {tweet.images.slice(0, 4).map((image, i) => (
                  <div
                    key={i}
                    className={cn(
                      "relative aspect-[4/3]",
                      tweet.images!.length === 3 && i === 0 && "row-span-2 aspect-auto"
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

            {/* Actions */}
            <div className="mt-3 flex items-center justify-between max-w-md">
              <ActionButton
                icon={<MessageCircle className="h-4 w-4" />}
                count={optimisticTweet.replies}
                color="reply"
                label="Reply"
              />
              <ActionButton
                icon={<Repeat2 className="h-4 w-4" />}
                count={optimisticTweet.retweets}
                color="retweet"
                active={optimisticTweet.isRetweeted}
                onClick={handleRetweet}
                label={optimisticTweet.isRetweeted ? "Undo retweet" : "Retweet"}
              />
              <ActionButton
                icon={<Heart className="h-4 w-4" />}
                activeIcon={<Heart className="h-4 w-4 fill-current" />}
                count={optimisticTweet.likes}
                color="like"
                active={optimisticTweet.isLiked}
                onClick={handleLike}
                label={optimisticTweet.isLiked ? "Unlike" : "Like"}
              />
              <ActionButton
                icon={<BarChart3 className="h-4 w-4" />}
                count={optimisticTweet.views}
                color="default"
                label="View count"
              />
              <div className="flex items-center gap-1">
                <ActionButton
                  icon={
                    <Bookmark
                      className={cn(
                        "h-4 w-4",
                        optimisticTweet.isBookmarked && "fill-current text-primary"
                      )}
                    />
                  }
                  color="default"
                  active={optimisticTweet.isBookmarked}
                  onClick={handleBookmark}
                  label={optimisticTweet.isBookmarked ? "Remove bookmark" : "Bookmark"}
                />
                <ActionButton
                  icon={<Share className="h-4 w-4" />}
                  color="default"
                  label="Share"
                />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}
