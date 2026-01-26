"use client"

import { useState, useEffect } from "react"
import { notFound, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  Globe,
  MoreHorizontal,
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
  Cake,
  Gift,
  Users,
} from "lucide-react"
import { cn, formatRelativeTime, formatCount } from "@/lib/utils"
import {
  type Post,
  type PostId,
  type TextPost,
  type ArticlePost,
  type JobSharePost,
  type CelebrationPost,
  type PollPost,
  type User,
  type ReactionType,
  type ReactionSummary,
  type CelebrationType,
  createPostId,
} from "@/lib/types"
import {
  posts,
  postsById,
  usersById,
  jobsById,
  companiesById,
  commentsByPostId,
} from "@/lib/mock-data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CommentSection, getReactionEmoji } from "@/components/post"

// =============================================================================
// Types
// =============================================================================

interface PostDetailPageProps {
  params: Promise<{
    id: string
  }>
}

// =============================================================================
// Celebration Icons & Colors
// =============================================================================

const CELEBRATION_CONFIG: Record<
  CelebrationType,
  { icon: React.ComponentType<{ className?: string }>; bg: string; title: string }
> = {
  "new-job": { icon: Briefcase, bg: "bg-blue-50 dark:bg-blue-950", title: "Started a new position" },
  promotion: { icon: Award, bg: "bg-purple-50 dark:bg-purple-950", title: "Got promoted" },
  anniversary: { icon: Sparkles, bg: "bg-amber-50 dark:bg-amber-950", title: "Celebrating an anniversary" },
  birthday: { icon: Cake, bg: "bg-pink-50 dark:bg-pink-950", title: "Birthday" },
  "work-anniversary": { icon: Gift, bg: "bg-green-50 dark:bg-green-950", title: "Work Anniversary" },
}

// =============================================================================
// Loading Skeleton
// =============================================================================

function PostDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Back button skeleton */}
        <Skeleton className="h-10 w-24 mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content skeleton */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-4">
                {/* Author header skeleton */}
                <div className="flex items-start gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>

                {/* Content skeleton */}
                <div className="mt-4 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>

                {/* Reactions skeleton */}
                <div className="mt-4 pt-4 border-t border-[var(--border)]">
                  <Skeleton className="h-6 w-48" />
                </div>

                {/* Actions skeleton */}
                <div className="mt-4 flex gap-2">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 flex-1" />
                </div>

                {/* Comments skeleton */}
                <div className="mt-6 space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar skeleton */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Reaction Summary Component (Expanded)
// =============================================================================

function ReactionSummaryExpanded({
  reactions,
  totalReactions,
}: {
  reactions: ReactionSummary[]
  totalReactions: number
}) {
  if (totalReactions === 0) return null

  // Sort by count descending
  const sortedReactions = [...reactions].sort((a, b) => b.count - a.count)

  return (
    <div className="space-y-3">
      {/* Reaction summary line */}
      <div className="flex items-center gap-2 flex-wrap">
        {sortedReactions.map((reaction) => (
          <span key={reaction.type} className="inline-flex items-center gap-1 text-sm">
            <span className="text-base">{getReactionEmoji(reaction.type)}</span>
            <span className="text-[var(--muted-foreground)]">{formatCount(reaction.count)}</span>
          </span>
        ))}
      </div>

      {/* See who reacted link */}
      <button className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1">
        <Users className="h-4 w-4" />
        See who reacted
      </button>
    </div>
  )
}

// =============================================================================
// Author Header (Expanded)
// =============================================================================

function AuthorHeaderExpanded({ author, timestamp }: { author: User; timestamp: Date }) {
  return (
    <div className="flex items-start gap-3">
      <Link href={`/in/${author.id}`}>
        <Avatar className="h-14 w-14">
          <AvatarImage src={author.avatar} alt={author.name} />
          <AvatarFallback>{author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      </Link>
      <div className="flex-1 min-w-0">
        <Link
          href={`/in/${author.id}`}
          className="font-semibold text-lg text-[var(--foreground)] hover:text-[var(--primary)] hover:underline"
        >
          {author.name}
        </Link>
        <p className="text-sm text-[var(--muted-foreground)]">{author.headline}</p>
        <div className="flex items-center gap-1 text-sm text-[var(--muted-foreground)] mt-1">
          <span>{formatRelativeTime(timestamp)}</span>
          <span>-</span>
          <Globe className="h-3.5 w-3.5" />
          <span>Public</span>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Post More Menu
// =============================================================================

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

// =============================================================================
// Content Renderers (Expanded - No truncation)
// =============================================================================

function ImageGallery({ images }: { images: string[] }) {
  if (images.length === 0) return null

  const gridClass = cn(
    "grid gap-2 mt-4",
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
            sizes="(max-width: 640px) 100vw, 800px"
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

function TextPostContentExpanded({ post }: { post: TextPost }) {
  return (
    <div className="mt-4">
      <p className="whitespace-pre-wrap text-[var(--foreground)]">{post.content}</p>
      <ImageGallery images={post.images} />
    </div>
  )
}

function ArticlePostContentExpanded({ post }: { post: ArticlePost }) {
  return (
    <div className="mt-4">
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
            sizes="(max-width: 640px) 100vw, 800px"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg">{post.title}</h3>
          <p className="text-sm text-[var(--muted-foreground)] mt-2">{post.description}</p>
          <p className="text-xs text-[var(--muted-foreground)] mt-3">{new URL(post.url).hostname}</p>
        </div>
      </Link>
    </div>
  )
}

function JobSharePostContentExpanded({ post }: { post: JobSharePost }) {
  const job = jobsById.get(post.jobId)

  if (!job) {
    return (
      <div className="mt-4 p-4 border border-[var(--border)] rounded-lg bg-[var(--muted)]/50">
        <p className="text-[var(--muted-foreground)]">Job no longer available</p>
      </div>
    )
  }

  return (
    <div className="mt-4">
      {post.caption && <p className="mb-4 text-[var(--foreground)]">{post.caption}</p>}
      <Link
        href={`/jobs/${job.id}`}
        className="block border border-[var(--border)] rounded-lg p-4 hover:bg-[var(--muted)]/50 transition-colors"
      >
        <div className="flex gap-4">
          <div className="relative h-14 w-14 rounded overflow-hidden bg-[var(--muted)] flex-shrink-0">
            <Image src={job.companyLogo} alt={job.companyName} fill className="object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-[var(--primary)]">{job.title}</h3>
            <p className="text-sm">{job.companyName}</p>
            <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] mt-1">
              <MapPin className="h-3.5 w-3.5" />
              <span>{job.location}</span>
              <span>-</span>
              <span className="capitalize">{job.workplaceType}</span>
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

function CelebrationPostContentExpanded({ post }: { post: CelebrationPost }) {
  const config = CELEBRATION_CONFIG[post.celebrationType]
  const IconComponent = config.icon
  const company = post.companyId ? companiesById.get(post.companyId) : null

  return (
    <div className="mt-4">
      <div className={cn("rounded-lg p-5", config.bg)}>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-12 w-12 rounded-full bg-[var(--primary)] flex items-center justify-center text-white">
            <IconComponent className="h-6 w-6" />
          </div>
          <div>
            <p className="font-semibold text-lg">{config.title}</p>
            {company && <p className="text-sm text-[var(--muted-foreground)]">at {company.name}</p>}
          </div>
        </div>
        <p className="whitespace-pre-wrap">{post.content}</p>
      </div>
    </div>
  )
}

function PollPostContentExpanded({ post }: { post: PollPost }) {
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

  const now = new Date()
  const endDate = new Date(post.endDate)
  const remainingMs = endDate.getTime() - now.getTime()
  const remainingDays = Math.max(0, Math.ceil(remainingMs / (1000 * 60 * 60 * 24)))
  const isPollEnded = remainingMs <= 0

  return (
    <div className="mt-4">
      <p className="font-semibold text-lg mb-4">{post.question}</p>
      <div className="space-y-3">
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
                isSelected && "border-[var(--primary)] ring-2 ring-[var(--primary)]"
              )}
            >
              {(hasVoted || isPollEnded) && mounted && (
                <div
                  className="absolute inset-y-0 left-0 bg-[var(--primary)]/10 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              )}
              <div className="relative px-4 py-3 flex items-center justify-between">
                <span className={cn("text-base", isSelected && "font-semibold")}>{option.text}</span>
                {(hasVoted || isPollEnded) && mounted && <span className="font-semibold">{percentage}%</span>}
              </div>
            </button>
          )
        })}
      </div>
      <div className="flex items-center gap-2 mt-4 text-sm text-[var(--muted-foreground)]">
        <span>{formatCount(totalVotes)} votes</span>
        <span>-</span>
        {isPollEnded ? (
          <span>Poll ended</span>
        ) : (
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {remainingDays === 0 ? "Ends today" : `${remainingDays}d left`}
          </span>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// Action Buttons
// =============================================================================

function ActionButtonsExpanded({
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
  return (
    <div className="flex items-center justify-between border-t border-[var(--border)] pt-3">
      <Button
        variant="ghost"
        className={cn("gap-2 flex-1", userReaction && "text-[var(--primary)]")}
        onClick={() => onReactionSelect("like")}
      >
        <ThumbsUp className={cn("h-5 w-5", userReaction && "fill-current")} />
        <span className="hidden sm:inline">{userReaction ? "Liked" : "Like"}</span>
      </Button>

      <Button variant="ghost" className="gap-2 flex-1">
        <MessageSquare className="h-5 w-5" />
        <span className="hidden sm:inline">Comment</span>
        {commentCount > 0 && <span className="text-[var(--muted-foreground)]">({formatCount(commentCount)})</span>}
      </Button>

      <Button variant="ghost" className="gap-2 flex-1">
        <Repeat2 className="h-5 w-5" />
        <span className="hidden sm:inline">Repost</span>
        {repostCount > 0 && <span className="text-[var(--muted-foreground)]">({formatCount(repostCount)})</span>}
      </Button>

      <Button variant="ghost" className="gap-2 flex-1">
        <Send className="h-5 w-5" />
        <span className="hidden sm:inline">Send</span>
      </Button>
    </div>
  )
}

// =============================================================================
// Related Posts Card
// =============================================================================

function RelatedPostCard({ post, author }: { post: Post; author: User }) {
  const getPreviewText = () => {
    switch (post.type) {
      case "text":
        return post.content.slice(0, 100) + (post.content.length > 100 ? "..." : "")
      case "article":
        return post.title
      case "job-share":
        return post.caption || "Shared a job"
      case "celebration":
        return post.content.slice(0, 100) + (post.content.length > 100 ? "..." : "")
      case "poll":
        return post.question
    }
  }

  return (
    <Link href={`/post/${post.id}`} className="block hover:bg-[var(--muted)]/50 rounded-lg p-3 -mx-3 transition-colors">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={author.avatar} alt={author.name} />
          <AvatarFallback>{author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm">{author.name}</p>
          <p className="text-sm text-[var(--muted-foreground)] line-clamp-2">{getPreviewText()}</p>
          <div className="flex items-center gap-2 mt-1 text-xs text-[var(--muted-foreground)]">
            <span>{formatRelativeTime(post.createdAt)}</span>
            {post.totalReactions > 0 && (
              <>
                <span>-</span>
                <span>{formatCount(post.totalReactions)} reactions</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export default function PostDetailPage({ params }: PostDetailPageProps) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [postId, setPostId] = useState<string | null>(null)
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null)

  useEffect(() => {
    setMounted(true)
    params.then((p) => setPostId(p.id))
  }, [params])

  // Show skeleton while loading
  if (!mounted || !postId) {
    return <PostDetailSkeleton />
  }

  // Find the post
  const post = postsById.get(createPostId(postId))

  if (!post) {
    notFound()
  }

  const author = usersById.get(post.authorId)

  if (!author) {
    notFound()
  }

  // Get comments for this post
  const postComments = commentsByPostId.get(post.id) || []

  // Get more posts from the same author (excluding current post)
  const authorPosts = posts
    .filter((p) => p.authorId === author.id && p.id !== post.id)
    .slice(0, 3)

  // Get similar posts (different author, similar type or high engagement)
  const similarPosts = posts
    .filter((p) => p.authorId !== author.id && p.id !== post.id)
    .sort((a, b) => b.totalReactions - a.totalReactions)
    .slice(0, 3)

  const handleReactionSelect = (reaction: ReactionType) => {
    setUserReaction((prev) => (prev === reaction ? null : reaction))
  }

  // Render post content based on type
  const renderPostContent = () => {
    switch (post.type) {
      case "text":
        return <TextPostContentExpanded post={post} />
      case "article":
        return <ArticlePostContentExpanded post={post} />
      case "job-share":
        return <JobSharePostContentExpanded post={post} />
      case "celebration":
        return <CelebrationPostContentExpanded post={post} />
      case "poll":
        return <PollPostContentExpanded post={post} />
      default: {
        const _exhaustive: never = post
        return null
      }
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Back button */}
        <Button variant="ghost" className="mb-6 gap-2" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <AuthorHeaderExpanded author={author} timestamp={post.createdAt} />
                  <PostMoreMenu />
                </div>

                {/* Content (expanded, no truncation) */}
                {renderPostContent()}

                {/* Expanded reaction details */}
                <div className="mt-6 pt-4 border-t border-[var(--border)]">
                  <ReactionSummaryExpanded reactions={post.reactions} totalReactions={post.totalReactions} />
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-3 mt-3 text-sm text-[var(--muted-foreground)]">
                  {post.comments > 0 && <span>{formatCount(post.comments)} comments</span>}
                  {post.reposts > 0 && (
                    <>
                      {post.comments > 0 && <span>-</span>}
                      <span>{formatCount(post.reposts)} reposts</span>
                    </>
                  )}
                  {post.views > 0 && (
                    <>
                      {(post.comments > 0 || post.reposts > 0) && <span>-</span>}
                      <span>{formatCount(post.views)} views</span>
                    </>
                  )}
                </div>

                {/* Action buttons */}
                <div className="mt-4">
                  <ActionButtonsExpanded
                    userReaction={userReaction}
                    onReactionSelect={handleReactionSelect}
                    commentCount={post.comments}
                    repostCount={post.reposts}
                  />
                </div>

                {/* Comments section */}
                <div className="mt-6">
                  <CommentSection postId={post.id} initialCommentCount={10} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* More from author */}
            {authorPosts.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">More from {author.name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-1">
                    {authorPosts.map((p) => {
                      const pAuthor = usersById.get(p.authorId)
                      if (!pAuthor) return null
                      return <RelatedPostCard key={p.id} post={p} author={pAuthor} />
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Similar posts */}
            {similarPosts.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Similar posts</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-1">
                    {similarPosts.map((p) => {
                      const pAuthor = usersById.get(p.authorId)
                      if (!pAuthor) return null
                      return <RelatedPostCard key={p.id} post={p} author={pAuthor} />
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
