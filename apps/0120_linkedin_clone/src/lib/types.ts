// Branded types for type safety - prevents mixing up IDs
type Brand<T, B> = T & { __brand: B }

export type UserId = Brand<string, "UserId">
export type PostId = Brand<string, "PostId">
export type CommentId = Brand<string, "CommentId">
export type JobId = Brand<string, "JobId">
export type CompanyId = Brand<string, "CompanyId">
export type ConnectionId = Brand<string, "ConnectionId">
export type NotificationId = Brand<string, "NotificationId">
export type MessageId = Brand<string, "MessageId">
export type ConversationId = Brand<string, "ConversationId">

// Helper to create branded IDs
export function createUserId(id: string): UserId {
  return id as UserId
}
export function createPostId(id: string): PostId {
  return id as PostId
}
export function createCommentId(id: string): CommentId {
  return id as CommentId
}
export function createJobId(id: string): JobId {
  return id as JobId
}
export function createCompanyId(id: string): CompanyId {
  return id as CompanyId
}
export function createConnectionId(id: string): ConnectionId {
  return id as ConnectionId
}
export function createNotificationId(id: string): NotificationId {
  return id as NotificationId
}
export function createMessageId(id: string): MessageId {
  return id as MessageId
}
export function createConversationId(id: string): ConversationId {
  return id as ConversationId
}

// ============ Core Interfaces ============

export interface Company {
  id: CompanyId
  name: string
  logo: string
  industry: string
  size: "1-10" | "11-50" | "51-200" | "201-500" | "501-1000" | "1001-5000" | "5001-10000" | "10000+"
  about?: string
  headquarters?: string
  website?: string
  followers: number
}

export interface Experience {
  id: string
  title: string
  company: Company
  location?: string
  startDate: Date
  endDate?: Date // undefined = present
  description?: string
  employmentType: "full-time" | "part-time" | "contract" | "internship" | "freelance"
}

export interface Education {
  id: string
  school: string
  logo?: string
  degree: string
  field: string
  startDate: Date
  endDate?: Date
  description?: string
}

export interface Skill {
  id: string
  name: string
  endorsements: number
}

export interface User {
  id: UserId
  name: string
  username: string // LinkedIn URL slug
  avatar: string
  coverImage: string
  headline: string // e.g., "Software Engineer at Google"
  about: string
  location?: string
  website?: string
  connections: number
  followers: number
  experience: Experience[]
  education: Education[]
  skills: Skill[]
  isConnected: boolean
  connectionStatus: "none" | "pending-sent" | "pending-received" | "connected"
  isPremium: boolean
}

// ============ Reactions ============

export type ReactionType = "like" | "celebrate" | "support" | "love" | "insightful" | "funny"

export interface ReactionCounts {
  like: number
  celebrate: number
  support: number
  love: number
  insightful: number
  funny: number
  total: number
  [key: string]: number // Index signature for iteration
}

export const REACTION_ICONS: Record<ReactionType, string> = {
  like: "👍",
  celebrate: "👏",
  support: "🫶",
  love: "❤️",
  insightful: "💡",
  funny: "😄",
}

export const REACTION_LABELS: Record<ReactionType, string> = {
  like: "Like",
  celebrate: "Celebrate",
  support: "Support",
  love: "Love",
  insightful: "Insightful",
  funny: "Funny",
}

// ============ Post Types (Discriminated Union) ============

export interface PollOption {
  id: string
  text: string
  votes: number
}

interface BasePost {
  id: PostId
  author: User
  content: string
  reactions: ReactionCounts
  comments: number
  shares: number
  createdAt: Date
  userReaction?: ReactionType
  isBookmarked: boolean
}

export interface TextPost extends BasePost {
  type: "text"
  images?: string[]
}

export interface ArticlePost extends BasePost {
  type: "article"
  articleTitle: string
  articleImage: string
  articleUrl: string
}

export interface JobSharePost extends BasePost {
  type: "job-share"
  job: Job
}

export interface CelebrationPost extends BasePost {
  type: "celebration"
  celebrationType: "work-anniversary" | "new-job" | "promotion" | "birthday" | "education"
  yearsAt?: number // for work anniversary
}

export interface PollPost extends BasePost {
  type: "poll"
  pollOptions: PollOption[]
  pollEndDate: Date
  totalVotes: number
  userVote?: string // option id
}

export type Post = TextPost | ArticlePost | JobSharePost | CelebrationPost | PollPost

// Type guards for posts
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

// ============ Job ============

export interface Job {
  id: JobId
  title: string
  company: Company
  location: string
  workplaceType: "remote" | "hybrid" | "on-site"
  employmentType: "full-time" | "part-time" | "contract" | "internship"
  salary?: { min: number; max: number; currency: string }
  description: string
  requirements: string[]
  postedAt: Date
  applicants: number
  isEasyApply: boolean
  isSaved: boolean
}

// ============ Notifications (Discriminated Union) ============

interface BaseNotification {
  id: NotificationId
  createdAt: Date
  read: boolean
}

export interface ConnectionRequestNotification extends BaseNotification {
  type: "connection-request"
  actor: User
}

export interface ConnectionAcceptedNotification extends BaseNotification {
  type: "connection-accepted"
  actor: User
}

export interface ReactionNotification extends BaseNotification {
  type: "reaction"
  actor: User
  post: Post
  reactionType: ReactionType
}

export interface CommentNotification extends BaseNotification {
  type: "comment"
  actor: User
  post: Post
  commentPreview: string
}

export interface MentionNotification extends BaseNotification {
  type: "mention"
  actor: User
  post: Post
}

export interface JobMatchNotification extends BaseNotification {
  type: "job-match"
  job: Job
  matchScore: number // percentage
}

export interface ProfileViewNotification extends BaseNotification {
  type: "profile-view"
  actor?: User // undefined = anonymous viewer
  viewCount: number
}

export type Notification =
  | ConnectionRequestNotification
  | ConnectionAcceptedNotification
  | ReactionNotification
  | CommentNotification
  | MentionNotification
  | JobMatchNotification
  | ProfileViewNotification

// Type guards for notifications
export function isConnectionRequestNotification(n: Notification): n is ConnectionRequestNotification {
  return n.type === "connection-request"
}
export function isConnectionAcceptedNotification(n: Notification): n is ConnectionAcceptedNotification {
  return n.type === "connection-accepted"
}
export function isReactionNotification(n: Notification): n is ReactionNotification {
  return n.type === "reaction"
}
export function isCommentNotification(n: Notification): n is CommentNotification {
  return n.type === "comment"
}
export function isMentionNotification(n: Notification): n is MentionNotification {
  return n.type === "mention"
}
export function isJobMatchNotification(n: Notification): n is JobMatchNotification {
  return n.type === "job-match"
}
export function isProfileViewNotification(n: Notification): n is ProfileViewNotification {
  return n.type === "profile-view"
}

// ============ Messaging ============

export interface Message {
  id: MessageId
  senderId: UserId
  content: string
  createdAt: Date
  read: boolean
}

export interface Conversation {
  id: ConversationId
  participant: User
  messages: Message[]
  lastMessage?: Message
  unreadCount: number
}

// ============ Comments ============

export interface Comment {
  id: CommentId
  author: User
  content: string
  createdAt: Date
  reactions: ReactionCounts
  userReaction?: ReactionType
  replies: Comment[]
}

// ============ Trends / News ============

export interface TrendingTopic {
  id: string
  title: string
  category: string
  readers: number
  timeAgo: string
}

// ============ Helper for exhaustive type checking ============

export function assertNever(x: never): never {
  throw new Error(`Unexpected type: ${x}`)
}
