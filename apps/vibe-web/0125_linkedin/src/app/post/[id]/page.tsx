"use client"

import { use, useState } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Send } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PostCard } from "@/components/post/post-card"
import { posts, generateComments, currentUser } from "@/lib/mock-data"
import { formatRelativeTime, getInitials, cn } from "@/lib/utils"
import type { PostId, Comment } from "@/lib/types"
import { toast } from "sonner"

interface PostDetailPageProps {
  params: Promise<{ id: string }>
}

function CommentComponent({ comment, depth = 0 }: { comment: Comment; depth?: number }) {
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const [isLiked, setIsLiked] = useState(comment.isLiked)
  const [likes, setLikes] = useState(comment.likes)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes(isLiked ? likes - 1 : likes + 1)
  }

  const handleReply = () => {
    if (!replyContent.trim()) return
    toast.success("Reply posted")
    setReplyContent("")
    setShowReplyInput(false)
  }

  return (
    <div className={cn("flex gap-3", depth > 0 && "ml-12")}>
      <Link href={`/profile/${comment.author.firstName.toLowerCase()}`}>
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage src={comment.author.avatar} />
          <AvatarFallback>
            {getInitials(comment.author.firstName, comment.author.lastName)}
          </AvatarFallback>
        </Avatar>
      </Link>

      <div className="flex-1 min-w-0">
        <div className="bg-muted rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Link
              href={`/profile/${comment.author.firstName.toLowerCase()}`}
              className="font-semibold text-sm hover:underline"
            >
              {comment.author.firstName} {comment.author.lastName}
            </Link>
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(comment.createdAt)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {comment.author.headline}
          </p>
          <p className="text-sm mt-2">{comment.content}</p>
        </div>

        <div className="flex items-center gap-4 mt-1 ml-2">
          <button
            onClick={handleLike}
            className={cn(
              "text-xs font-medium transition-colors",
              isLiked ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Like{likes > 0 && ` (${likes})`}
          </button>
          <button
            onClick={() => setShowReplyInput(!showReplyInput)}
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Reply
          </button>
        </div>

        {showReplyInput && (
          <div className="flex gap-2 mt-3">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src={currentUser.avatar} />
              <AvatarFallback>
                {getInitials(currentUser.firstName, currentUser.lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Add a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleReply()}
                className="h-9"
              />
              <Button size="sm" onClick={handleReply} disabled={!replyContent.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {comment.replies.length > 0 && (
          <div className="mt-4 space-y-4">
            {comment.replies.map((reply) => (
              <CommentComponent key={reply.id} comment={reply} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = use(params)
  const [commentContent, setCommentContent] = useState("")

  const post = posts.find((p) => p.id === id)

  if (!post) {
    notFound()
  }

  const comments = generateComments(post.id as PostId, 10)

  const handleComment = () => {
    if (!commentContent.trim()) return
    toast.success("Comment posted")
    setCommentContent("")
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-4">
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to feed
          </Link>
        </Button>
      </div>

      <PostCard post={post} />

      {/* Comments section */}
      <Card className="mt-2">
        <CardContent className="p-4">
          {/* Comment input */}
          <div className="flex gap-3 mb-6">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarImage src={currentUser.avatar} />
              <AvatarFallback>
                {getInitials(currentUser.firstName, currentUser.lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Add a comment..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleComment()}
              />
              <Button onClick={handleComment} disabled={!commentContent.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Comments list */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <CommentComponent key={comment.id} comment={comment} />
            ))}
          </div>

          {comments.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No comments yet. Be the first to comment!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
