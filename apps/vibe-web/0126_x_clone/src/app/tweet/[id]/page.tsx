"use client"

import { use, useState } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Sidebar } from "@/components/layout/sidebar"
import { MobileNav } from "@/components/layout/mobile-nav"
import { RightSidebar } from "@/components/layout/right-sidebar"
import { TweetCard } from "@/components/tweet/tweet-card"
import { TweetComposer } from "@/components/tweet/tweet-composer"
import { tweets, users, generateReplies } from "@/lib/mock-data"
import { formatFullDate, formatCount } from "@/lib/utils"
import type { TweetId } from "@/lib/types"

interface TweetDetailPageProps {
  params: Promise<{ id: string }>
}

export default function TweetDetailPage({ params }: TweetDetailPageProps) {
  const { id } = use(params)

  const tweet = tweets.find((t) => t.id === id)

  if (!tweet) {
    notFound()
  }

  const replies = generateReplies(tweet.id as TweetId, users, 15)

  return (
    <div className="min-h-screen flex justify-center">
      <div className="w-full max-w-[1265px] flex">
        {/* Left sidebar */}
        <div className="hidden md:flex w-[68px] lg:w-[275px] shrink-0 border-r border-border">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0 max-w-[600px] border-r border-border">
          {/* Header */}
          <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b border-border flex items-center gap-6 px-4 py-3">
            <Link
              href="/"
              className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold">Post</h1>
          </header>

          {/* Tweet detail */}
          <article className="px-4 py-3 border-b border-border">
            {/* Author */}
            <div className="flex items-center gap-3">
              <Link href={`/profile/${tweet.author.username}`}>
                <img
                  src={tweet.author.avatar}
                  alt={tweet.author.name}
                  className="h-12 w-12 rounded-full hover:opacity-90 transition-opacity"
                />
              </Link>
              <div>
                <Link
                  href={`/profile/${tweet.author.username}`}
                  className="font-bold hover:underline flex items-center gap-1"
                >
                  {tweet.author.name}
                  {tweet.author.verified && (
                    <svg
                      viewBox="0 0 22 22"
                      className="h-5 w-5 fill-primary"
                      aria-label="Verified account"
                    >
                      <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
                    </svg>
                  )}
                </Link>
                <Link
                  href={`/profile/${tweet.author.username}`}
                  className="text-muted-foreground hover:underline block"
                >
                  @{tweet.author.username}
                </Link>
              </div>
            </div>

            {/* Content */}
            <p className="mt-4 text-xl whitespace-pre-wrap">{tweet.content}</p>

            {/* Images */}
            {tweet.images && tweet.images.length > 0 && (
              <div className="mt-4 rounded-2xl overflow-hidden border border-border">
                <div
                  className={`grid gap-0.5 ${
                    tweet.images.length === 1
                      ? ""
                      : tweet.images.length === 2
                        ? "grid-cols-2"
                        : "grid-cols-2"
                  }`}
                >
                  {tweet.images.map((image, i) => (
                    <img
                      key={i}
                      src={image}
                      alt=""
                      className="w-full aspect-video object-cover"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Timestamp */}
            <p className="mt-4 text-muted-foreground">
              {formatFullDate(tweet.createdAt)}
            </p>

            {/* Stats */}
            <div className="flex gap-4 py-4 border-y border-border mt-4">
              <span>
                <span className="font-bold">{formatCount(tweet.retweets)}</span>{" "}
                <span className="text-muted-foreground">Reposts</span>
              </span>
              <span>
                <span className="font-bold">{formatCount(tweet.likes)}</span>{" "}
                <span className="text-muted-foreground">Likes</span>
              </span>
              <span>
                <span className="font-bold">{formatCount(tweet.views)}</span>{" "}
                <span className="text-muted-foreground">Views</span>
              </span>
            </div>
          </article>

          {/* Reply composer */}
          <TweetComposer
            placeholder="Post your reply"
            replyTo={tweet.author.username}
          />

          {/* Replies */}
          <div>
            {replies.map((reply) => (
              <TweetCard key={reply.id} tweet={reply} />
            ))}
          </div>
        </main>

        {/* Right sidebar */}
        <div className="hidden lg:block w-[350px] shrink-0">
          <RightSidebar />
        </div>
      </div>

      {/* Mobile navigation */}
      <MobileNav />
    </div>
  )
}
