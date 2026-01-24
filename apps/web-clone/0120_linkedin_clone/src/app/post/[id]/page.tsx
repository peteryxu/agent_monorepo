"use client"

import { use, useState } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Send } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Sidebar } from "@/components/layout/sidebar"
import { RightSidebar } from "@/components/layout/right-sidebar"
import { MobileNav } from "@/components/layout/mobile-nav"
import { PostCard } from "@/components/post/post-card"
import { getPostById, getCommentsForPost, currentUser } from "@/lib/mock-data"
import { getInitials, formatRelativeTime } from "@/lib/utils"
import { REACTION_ICONS } from "@/lib/types"
import type { PostId, Comment } from "@/lib/types"

function CommentItem({ comment }: { comment: Comment }) {
  const [showReplies, setShowReplies] = useState(false)

  return (
    <div className="py-3">
      <div className="flex gap-3">
        <Link href={`/profile/${comment.author.username}`}>
          <Avatar className="h-10 w-10">
            <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
            <AvatarFallback>{getInitials(comment.author.name)}</AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex-1">
          <div className="bg-secondary rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <Link
                  href={`/profile/${comment.author.username}`}
                  className="font-semibold text-sm hover:text-primary hover:underline"
                >
                  {comment.author.name}
                </Link>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {comment.author.headline}
                </p>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatRelativeTime(comment.createdAt)}
              </span>
            </div>
            <p className="mt-2 text-sm">{comment.content}</p>
          </div>

          {/* Comment actions */}
          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
            <button className="hover:text-foreground flex items-center gap-1">
              {comment.userReaction ? (
                <span>{REACTION_ICONS[comment.userReaction]}</span>
              ) : (
                "Like"
              )}
              {comment.reactions.total > 0 && (
                <span className="text-xs">• {comment.reactions.total}</span>
              )}
            </button>
            <span>|</span>
            {comment.replies.length > 0 ? (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="hover:text-foreground"
              >
                {showReplies ? "Hide" : "View"} {comment.replies.length} repl
                {comment.replies.length === 1 ? "y" : "ies"}
              </button>
            ) : (
              <button className="hover:text-foreground">Reply</button>
            )}
          </div>

          {/* Replies */}
          {showReplies && comment.replies.length > 0 && (
            <div className="ml-4 mt-3 space-y-3 border-l-2 pl-4">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="flex gap-3">
                  <Link href={`/profile/${reply.author.username}`}>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={reply.author.avatar} alt={reply.author.name} />
                      <AvatarFallback>{getInitials(reply.author.name)}</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="flex-1">
                    <div className="bg-secondary rounded-lg p-2">
                      <Link
                        href={`/profile/${reply.author.username}`}
                        className="font-semibold text-xs hover:text-primary hover:underline"
                      >
                        {reply.author.name}
                      </Link>
                      <p className="text-xs mt-1">{reply.content}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>{formatRelativeTime(reply.createdAt)}</span>
                      <button className="hover:text-foreground">Like</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const post = getPostById(id as PostId)
  const [commentInput, setCommentInput] = useState("")

  if (!post) {
    notFound()
  }

  const comments = getCommentsForPost(post.id)

  return (
    <div className="min-h-screen flex justify-center bg-background">
      <div className="flex w-full max-w-[1128px]">
        {/* Left sidebar */}
        <div className="hidden md:flex w-[68px] lg:w-[225px] flex-shrink-0">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0 max-w-[600px] px-4 py-4 space-y-4 pb-24 md:pb-4">
          {/* Back button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to feed
          </Link>

          {/* Post */}
          <PostCard post={post} />

          {/* Comments section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                Comments ({post.comments})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add comment */}
              <div className="flex gap-3 pb-4 border-b">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 flex gap-2">
                  <Input
                    placeholder="Add a comment..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button size="icon" disabled={!commentInput.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Comments list */}
              <div className="divide-y">
                {comments.map((comment) => (
                  <CommentItem key={comment.id} comment={comment} />
                ))}
                {comments.length === 0 && (
                  <div className="py-8 text-center text-muted-foreground">
                    No comments yet. Be the first to comment!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </main>

        {/* Right sidebar */}
        <div className="hidden lg:flex w-[300px] flex-shrink-0">
          <RightSidebar />
        </div>
      </div>

      {/* Mobile navigation */}
      <MobileNav />
    </div>
  )
}
