"use client"

import { useOptimistic, useTransition } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  MessageCircle,
  Repeat2,
  Heart,
  BarChart3,
  Bookmark,
  Share,
  MoreHorizontal,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn, formatCount, formatRelativeTime } from "@/lib/utils"
import type { Tweet } from "@/lib/types"
import { toast } from "sonner"

interface TweetCardProps {
  tweet: Tweet
  showBorder?: boolean
  isDetail?: boolean
  isFocused?: boolean
}

type TweetAction = "like" | "retweet" | "bookmark"

function tweetReducer(state: Tweet, action: TweetAction): Tweet {
  switch (action) {
    case "like":
      return {
        ...state,
        isLiked: !state.isLiked,
        likes: state.isLiked ? state.likes - 1 : state.likes + 1,
      }
    case "retweet":
      return {
        ...state,
        isRetweeted: !state.isRetweeted,
        retweets: state.isRetweeted ? state.retweets - 1 : state.retweets + 1,
      }
    case "bookmark":
      return {
        ...state,
        isBookmarked: !state.isBookmarked,
      }
    default:
      return state
  }
}

export function TweetCard({
  tweet,
  showBorder = true,
  isDetail = false,
  isFocused = false,
}: TweetCardProps) {
  const [isPending, startTransition] = useTransition()
  const [optimisticTweet, updateOptimistic] = useOptimistic(tweet, tweetReducer)

  const handleAction = (action: TweetAction) => {
    startTransition(() => {
      updateOptimistic(action)

      // Show toast for bookmark
      if (action === "bookmark") {
        toast.success(
          optimisticTweet.isBookmarked
            ? "Removed from Bookmarks"
            : "Added to Bookmarks"
        )
      }
    })
  }

  const handleShare = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/tweet/${tweet.id}`
    )
    toast.success("Copied to clipboard")
  }

  const imageCount = optimisticTweet.images?.length || 0

  return (
    <article
      className={cn(
        "px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer",
        showBorder && "border-b border-border",
        isFocused && "ring-2 ring-primary ring-inset"
      )}
      role="article"
      aria-labelledby={`tweet-${tweet.id}-content`}
      tabIndex={0}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <Link
          href={`/profile/${optimisticTweet.author.username}`}
          className="shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <Avatar className="h-10 w-10 hover:opacity-90 transition-opacity">
            <AvatarImage
              src={optimisticTweet.author.avatar}
              alt={optimisticTweet.author.name}
            />
            <AvatarFallback>{optimisticTweet.author.name[0]}</AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-1 text-sm">
            <Link
              href={`/profile/${optimisticTweet.author.username}`}
              className="font-bold hover:underline truncate"
              onClick={(e) => e.stopPropagation()}
            >
              {optimisticTweet.author.name}
            </Link>
            {optimisticTweet.author.verified && (
              <svg
                viewBox="0 0 22 22"
                className="h-4 w-4 fill-primary shrink-0"
                aria-label="Verified account"
              >
                <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
              </svg>
            )}
            <Link
              href={`/profile/${optimisticTweet.author.username}`}
              className="text-muted-foreground hover:underline truncate"
              onClick={(e) => e.stopPropagation()}
            >
              @{optimisticTweet.author.username}
            </Link>
            <span className="text-muted-foreground">·</span>
            <Link
              href={`/tweet/${tweet.id}`}
              className="text-muted-foreground hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {formatRelativeTime(optimisticTweet.createdAt)}
            </Link>

            {/* More menu */}
            <div className="ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Not interested in this post</DropdownMenuItem>
                  <DropdownMenuItem>
                    Follow @{optimisticTweet.author.username}
                  </DropdownMenuItem>
                  <DropdownMenuItem>Mute @{optimisticTweet.author.username}</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    Block @{optimisticTweet.author.username}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Content */}
          <Link href={`/tweet/${tweet.id}`}>
            <p
              id={`tweet-${tweet.id}-content`}
              className={cn("mt-1 whitespace-pre-wrap", isDetail && "text-xl")}
            >
              {optimisticTweet.content}
            </p>
          </Link>

          {/* Images */}
          {imageCount > 0 && (
            <div
              className={cn(
                "mt-3 rounded-2xl overflow-hidden border border-border",
                imageCount === 1 && "aspect-[16/9]",
                imageCount === 2 && "grid grid-cols-2 gap-0.5",
                imageCount >= 3 && "grid grid-cols-2 gap-0.5"
              )}
            >
              {optimisticTweet.images?.slice(0, 4).map((image, index) => (
                <div
                  key={index}
                  className={cn(
                    "relative overflow-hidden bg-muted",
                    imageCount === 1 && "aspect-[16/9]",
                    imageCount === 2 && "aspect-square",
                    imageCount === 3 && index === 0 && "row-span-2 aspect-auto",
                    imageCount === 3 && index > 0 && "aspect-square",
                    imageCount === 4 && "aspect-square"
                  )}
                >
                  <Image
                    src={image}
                    alt={`Image ${index + 1}`}
                    fill
                    className="object-cover hover:opacity-90 transition-opacity"
                    sizes="(max-width: 600px) 100vw, 600px"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-3 -ml-2 max-w-md">
            {/* Reply */}
            <Link
              href={`/tweet/${tweet.id}`}
              className="group flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full group-hover:bg-reply/10 group-hover:text-reply transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
              </Button>
              <span className="text-sm text-muted-foreground group-hover:text-reply transition-colors">
                {optimisticTweet.replies > 0 && formatCount(optimisticTweet.replies)}
              </span>
            </Link>

            {/* Retweet */}
            <div className="group flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-9 w-9 rounded-full transition-colors",
                  optimisticTweet.isRetweeted
                    ? "text-retweet"
                    : "group-hover:bg-retweet/10 group-hover:text-retweet"
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  handleAction("retweet")
                }}
                disabled={isPending}
              >
                <Repeat2 className="h-5 w-5" />
              </Button>
              <span
                className={cn(
                  "text-sm transition-colors",
                  optimisticTweet.isRetweeted
                    ? "text-retweet"
                    : "text-muted-foreground group-hover:text-retweet"
                )}
              >
                {optimisticTweet.retweets > 0 && formatCount(optimisticTweet.retweets)}
              </span>
            </div>

            {/* Like */}
            <div className="group flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-9 w-9 rounded-full transition-colors",
                  optimisticTweet.isLiked
                    ? "text-like"
                    : "group-hover:bg-like/10 group-hover:text-like"
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  handleAction("like")
                }}
                disabled={isPending}
              >
                <Heart
                  className={cn("h-5 w-5", optimisticTweet.isLiked && "fill-current")}
                />
              </Button>
              <span
                className={cn(
                  "text-sm transition-colors",
                  optimisticTweet.isLiked
                    ? "text-like"
                    : "text-muted-foreground group-hover:text-like"
                )}
              >
                {optimisticTweet.likes > 0 && formatCount(optimisticTweet.likes)}
              </span>
            </div>

            {/* Views */}
            <div className="group flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors"
              >
                <BarChart3 className="h-5 w-5" />
              </Button>
              <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                {formatCount(optimisticTweet.views)}
              </span>
            </div>

            {/* Bookmark & Share */}
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-9 w-9 rounded-full transition-colors hover:bg-primary/10 hover:text-primary",
                  optimisticTweet.isBookmarked && "text-primary"
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  handleAction("bookmark")
                }}
                disabled={isPending}
              >
                <Bookmark
                  className={cn(
                    "h-5 w-5",
                    optimisticTweet.isBookmarked && "fill-current"
                  )}
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  handleShare()
                }}
              >
                <Share className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
