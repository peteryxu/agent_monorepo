// ============================================================================
// Branded Types - Compile-time safety for ID confusion prevention
// ============================================================================

declare const __brand: unique symbol
type Brand<T, B extends string> = T & { [__brand]: B }

export type UserId = Brand<string, "UserId">
export type PostId = Brand<string, "PostId">
export type CommentId = Brand<string, "CommentId">
export type JobId = Brand<string, "JobId">
export type CompanyId = Brand<string, "CompanyId">
export type ConnectionId = Brand<string, "ConnectionId">
export type NotificationId = Brand<string, "NotificationId">
export type MessageId = Brand<string, "MessageId">
export type ConversationId = Brand<string, "ConversationId">

// ============================================================================
// Core Entities
// ============================================================================

export interface Company {
  id: CompanyId
  name: string
  logo: string
  industry: string
  size: string
  headquarters: string
  followers: number
}

export interface User {
  id: UserId
  firstName: string
  lastName: string
  headline: string
  avatar: string
  coverImage?: string
  location: string
  about?: string
  connections: number
  followers: number
  isOpenToWork: boolean
  isPremium: boolean
  currentCompany?: Company
  currentPosition?: string
  profileViews: number
  postImpressions: number
  searchAppearances: number
}

export interface Experience {
  id: string
  title: string
  company: Company
  location: string
  startDate: Date
  endDate?: Date
  description?: string
  skills: string[]
}

export interface Education {
  id: string
  school: string
  degree: string
  field: string
  startYear: number
  endYear?: number
  logo: string
}

export interface Skill {
  name: string
  endorsements: number
  endorsedBy: User[]
}

// ============================================================================
// Reactions - LinkedIn's 6 reaction types
// ============================================================================

export const REACTION_TYPES = ["like", "celebrate", "support", "love", "insightful", "funny"] as const
export type ReactionType = typeof REACTION_TYPES[number]

export interface Reaction {
  type: ReactionType
  user: User
  createdAt: Date
}

export interface ReactionSummary {
  type: ReactionType
  count: number
}

// ============================================================================
// Post Types - Discriminated union for 5 LinkedIn post variants
// ============================================================================

interface PostBase {
  id: PostId
  author: User
  content: string
  createdAt: Date
  reactions: ReactionSummary[]
  totalReactions: number
  comments: number
  reposts: number
  impressions: number
  userReaction?: ReactionType
  isReposted: boolean
  isSaved: boolean
}

export interface TextPost extends PostBase {
  type: "text"
  images?: string[]
  video?: string
  document?: { name: string; pages: number; thumbnail: string }
}

export interface ArticlePost extends PostBase {
  type: "article"
  article: {
    title: string
    description: string
    image: string
    url: string
    source: string
  }
}

export interface JobSharePost extends PostBase {
  type: "job-share"
  job: Job
}

export interface CelebrationPost extends PostBase {
  type: "celebration"
  celebrationType: "work-anniversary" | "new-position" | "birthday" | "promotion" | "new-job"
  years?: number
  company?: Company
  position?: string
}

export interface PollPost extends PostBase {
  type: "poll"
  poll: {
    question: string
    options: { id: string; text: string; votes: number; percentage: number }[]
    totalVotes: number
    endsAt: Date
    userVotedOptionId?: string
  }
}

export type Post = TextPost | ArticlePost | JobSharePost | CelebrationPost | PollPost

// ============================================================================
// Comments
// ============================================================================

export interface Comment {
  id: CommentId
  postId: PostId
  author: User
  content: string
  createdAt: Date
  likes: number
  isLiked: boolean
  replies: Comment[]
}

// ============================================================================
// Jobs
// ============================================================================

export type JobType = "full-time" | "part-time" | "contract" | "internship" | "volunteer"
export type ExperienceLevel = "entry" | "associate" | "mid-senior" | "director" | "executive"
export type WorkplaceType = "on-site" | "hybrid" | "remote"

export interface Job {
  id: JobId
  title: string
  company: Company
  location: string
  workplaceType: WorkplaceType
  jobType: JobType
  experienceLevel: ExperienceLevel
  salary?: { min: number; max: number; currency: string }
  description: string
  requirements: string[]
  benefits: string[]
  postedAt: Date
  applicants: number
  isEasyApply: boolean
  isSaved: boolean
  isApplied: boolean
  skills: string[]
}

// ============================================================================
// Connections
// ============================================================================

export type ConnectionStatus = "connected" | "pending-sent" | "pending-received" | "none"

export interface Connection {
  id: ConnectionId
  user: User
  status: ConnectionStatus
  connectedAt?: Date
  mutualConnections: number
  note?: string
}

// ============================================================================
// Notifications - Discriminated union for 7 types
// ============================================================================

interface NotificationBase {
  id: NotificationId
  createdAt: Date
  read: boolean
}

export interface ConnectionRequestNotification extends NotificationBase {
  type: "connection-request"
  from: User
  note?: string
}

export interface ConnectionAcceptedNotification extends NotificationBase {
  type: "connection-accepted"
  user: User
}

export interface ReactionNotification extends NotificationBase {
  type: "reaction"
  actor: User
  post: Post
  reactionType: ReactionType
}

export interface CommentNotification extends NotificationBase {
  type: "comment"
  actor: User
  post: Post
  comment: string
}

export interface MentionNotification extends NotificationBase {
  type: "mention"
  actor: User
  post: Post
}

export interface JobMatchNotification extends NotificationBase {
  type: "job-match"
  job: Job
  matchScore: number
}

export interface ProfileViewNotification extends NotificationBase {
  type: "profile-view"
  viewer?: User // undefined = anonymous viewer
  viewerTitle?: string
  viewerCompany?: string
}

export type Notification =
  | ConnectionRequestNotification
  | ConnectionAcceptedNotification
  | ReactionNotification
  | CommentNotification
  | MentionNotification
  | JobMatchNotification
  | ProfileViewNotification

// ============================================================================
// Messaging
// ============================================================================

export interface Message {
  id: MessageId
  conversationId: ConversationId
  sender: User
  content: string
  createdAt: Date
  isRead: boolean
  attachments?: { type: "image" | "file"; url: string; name?: string }[]
}

export interface Conversation {
  id: ConversationId
  participants: User[]
  lastMessage?: Message
  unreadCount: number
  updatedAt: Date
  isArchived: boolean
  isMuted: boolean
}

// ============================================================================
// News & Trending
// ============================================================================

export interface NewsItem {
  id: string
  title: string
  source: string
  timeAgo: string
  readers: number
  image?: string
}

export interface TrendingTopic {
  id: string
  topic: string
  category: string
  posts: number
}

// ============================================================================
// Type Guards & Utilities
// ============================================================================

export function assertNever(x: never): never {
  throw new Error(`Unexpected value: ${JSON.stringify(x)}`)
}

export function isTextPost(post: Post): post is TextPost {
  return post.type === "text"
}

export function isArticlePost(post: Post): post is ArticlePost {
  return post.type === "article"
}

export function isJobSharePost(post: Post): post is JobSharePost {
  return post.type === "job-share"
}

export function isCelebrationPost(post: Post): post is CelebrationPost {
  return post.type === "celebration"
}

export function isPollPost(post: Post): post is PollPost {
  return post.type === "poll"
}
