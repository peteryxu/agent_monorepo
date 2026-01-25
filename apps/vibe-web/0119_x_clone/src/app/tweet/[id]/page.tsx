"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, MoreHorizontal, MessageCircle, Repeat2, Heart, BarChart3, Share, Bookmark } from "lucide-react"
import { Sidebar } from "@/components/layout/sidebar"
import { MobileNav } from "@/components/layout/mobile-nav"
import { RightSidebar } from "@/components/layout/right-sidebar"
import { TweetComposer } from "@/components/tweet/tweet-composer"
import { TweetCard } from "@/components/tweet/tweet-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getTweetById, tweets } from "@/lib/mock-data"
import { formatCount, cn } from "@/lib/utils"
import { VerifiedBadge } from "@/components/tweet/verified-badge"
import type { TweetId } from "@/lib/types"

export default function TweetDetailPage() {
  const params = useParams()
  const tweetId = params.id as TweetId
  const tweet = getTweetById(tweetId)

  const [isLiked, setIsLiked] = useState(tweet?.isLiked ?? false)
  const [isRetweeted, setIsRetweeted] = useState(tweet?.isRetweeted ?? false)
  const [isBookmarked, setIsBookmarked] = useState(tweet?.isBookmarked ?? false)
  const [likeCount, setLikeCount] = useState(tweet?.likes ?? 0)
  const [retweetCount, setRetweetCount] = useState(tweet?.retweets ?? 0)

  // Get some "replies" (just use random tweets as mock replies)
  const replies = tweets.slice(0, 5)

  if (!tweet) {
    return (
      <div className="min-h-screen flex justify-center">
        <div className="flex w-full max-w-[1265px]">
          <div className="hidden md:flex w-[68px] lg:w-[275px] flex-shrink-0">
            <Sidebar />
          </div>
          <main className="flex-1 min-w-0 max-w-[600px] border-x border-border">
            <div className="px-4 py-16 text-center">
              <h1 className="font-bold text-3xl">
                Hmm...this page doesn't exist.
              </h1>
              <p className="text-muted-foreground mt-2">Try searching for something else.</p>
            </div>
          </main>
        </div>
        <MobileNav />
      </div>
    )
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
  }

  const handleRetweet = () => {
    setIsRetweeted(!isRetweeted)
    setRetweetCount(isRetweeted ? retweetCount - 1 : retweetCount + 1)
  }

  return (
    <div className="min-h-screen flex justify-center">
      <div className="flex w-full max-w-[1265px]">
        {/* Left sidebar */}
        <div className="hidden md:flex w-[68px] lg:w-[275px] flex-shrink-0">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0 max-w-[600px] border-x border-border">
          {/* Header */}
          <div className="sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border">
            <div className="flex items-center gap-6 px-4 py-3">
              <Link
                href="/"
                className="p-2 -ml-2 rounded-full hover:bg-accent transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="font-bold text-xl">Post</h1>
            </div>
          </div>

          {/* Tweet detail */}
          <article className="px-4 py-3">
            {/* Author header */}
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <Link href={`/profile/${tweet.author.username}`}>
                  <Avatar className="h-10 w-10 hover:opacity-90 transition-opacity">
                    <AvatarImage
                      src={tweet.author.avatar}
                      alt={tweet.author.name}
                    />
                    <AvatarFallback>
                      {tweet.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link
                    href={`/profile/${tweet.author.username}`}
                    className="font-bold hover:underline flex items-center gap-1"
                  >
                    {tweet.author.name}
                    {tweet.author.verified && <VerifiedBadge />}
                  </Link>
                  <p className="text-muted-foreground">
                    @{tweet.author.username}
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger className="p-2 -m-2 rounded-full hover:bg-accent transition-colors">
                  <MoreHorizontal className="h-5 w-5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Not interested in this</DropdownMenuItem>
                  <DropdownMenuItem>
                    Follow @{tweet.author.username}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Mute @{tweet.author.username}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Block @{tweet.author.username}
                  </DropdownMenuItem>
                  <DropdownMenuItem>Report post</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Content */}
            <p className="mt-3 text-xl whitespace-pre-wrap">{tweet.content}</p>

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
                      tweet.images!.length === 3 &&
                        i === 0 &&
                        "row-span-2 aspect-auto"
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

            {/* Timestamp */}
            <p className="mt-3 text-muted-foreground text-sm">
              {tweet.createdAt.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}{" "}
              ·{" "}
              {tweet.createdAt.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}{" "}
              · <span className="font-bold text-foreground">{formatCount(tweet.views)}</span> Views
            </p>

            <Separator className="my-3" />

            {/* Engagement stats */}
            <div className="flex gap-4 text-sm">
              <button className="hover:underline">
                <span className="font-bold">{formatCount(retweetCount)}</span>{" "}
                <span className="text-muted-foreground">Reposts</span>
              </button>
              <button className="hover:underline">
                <span className="font-bold">{formatCount(tweet.replies)}</span>{" "}
                <span className="text-muted-foreground">Quotes</span>
              </button>
              <button className="hover:underline">
                <span className="font-bold">{formatCount(likeCount)}</span>{" "}
                <span className="text-muted-foreground">Likes</span>
              </button>
              <button className="hover:underline">
                <span className="font-bold">{formatCount(tweet.replies)}</span>{" "}
                <span className="text-muted-foreground">Bookmarks</span>
              </button>
            </div>

            <Separator className="my-3" />

            {/* Action buttons */}
            <div className="flex items-center justify-around">
              <button
                className="p-2 rounded-full hover:bg-reply/10 hover:text-reply transition-colors text-muted-foreground"
                aria-label="Reply"
              >
                <MessageCircle className="h-5 w-5" />
              </button>
              <button
                onClick={handleRetweet}
                className={cn(
                  "p-2 rounded-full hover:bg-retweet/10 transition-colors",
                  isRetweeted ? "text-retweet" : "text-muted-foreground hover:text-retweet"
                )}
                aria-label={isRetweeted ? "Undo repost" : "Repost"}
              >
                <Repeat2 className="h-5 w-5" />
              </button>
              <button
                onClick={handleLike}
                className={cn(
                  "p-2 rounded-full hover:bg-like/10 transition-colors",
                  isLiked ? "text-like" : "text-muted-foreground hover:text-like"
                )}
                aria-label={isLiked ? "Unlike" : "Like"}
              >
                <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
              </button>
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={cn(
                  "p-2 rounded-full hover:bg-primary/10 transition-colors",
                  isBookmarked ? "text-primary" : "text-muted-foreground hover:text-primary"
                )}
                aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
              >
                <Bookmark className={cn("h-5 w-5", isBookmarked && "fill-current")} />
              </button>
              <button
                className="p-2 rounded-full hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground"
                aria-label="Share"
              >
                <Share className="h-5 w-5" />
              </button>
            </div>

            <Separator className="my-3" />
          </article>

          {/* Reply composer */}
          <TweetComposer placeholder="Post your reply" compact />

          {/* Replies */}
          <div className="border-t border-border">
            {replies.map((reply) => (
              <TweetCard key={reply.id} tweet={reply} />
            ))}
          </div>
        </main>

        {/* Right sidebar */}
        <div className="hidden lg:flex w-[350px] flex-shrink-0">
          <RightSidebar />
        </div>
      </div>

      {/* Mobile navigation */}
      <MobileNav />
    </div>
  )
}
