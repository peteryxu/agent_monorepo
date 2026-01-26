// =============================================================================
// Branded ID Types
// =============================================================================

export type UserId = string & { readonly __brand: 'UserId' }
export type PostId = string & { readonly __brand: 'PostId' }
export type CommentId = string & { readonly __brand: 'CommentId' }
export type JobId = string & { readonly __brand: 'JobId' }
export type CompanyId = string & { readonly __brand: 'CompanyId' }
export type ConnectionId = string & { readonly __brand: 'ConnectionId' }
export type NotificationId = string & { readonly __brand: 'NotificationId' }

// ID factory functions
export const createUserId = (id: string): UserId => id as UserId
export const createPostId = (id: string): PostId => id as PostId
export const createCommentId = (id: string): CommentId => id as CommentId
export const createJobId = (id: string): JobId => id as JobId
export const createCompanyId = (id: string): CompanyId => id as CompanyId
export const createConnectionId = (id: string): ConnectionId => id as ConnectionId
export const createNotificationId = (id: string): NotificationId => id as NotificationId

// =============================================================================
// Reaction Types
// =============================================================================

export type ReactionType = 'like' | 'celebrate' | 'support' | 'love' | 'insightful' | 'funny'

export interface Reaction {
  type: ReactionType
  userId: UserId
  createdAt: Date
}

export interface ReactionSummary {
  type: ReactionType
  count: number
}

// =============================================================================
// Post Types (Discriminated Union)
// =============================================================================

interface BasePost {
  id: PostId
  authorId: UserId
  createdAt: Date
  updatedAt?: Date
  reactions: ReactionSummary[]
  totalReactions: number
  comments: number
  reposts: number
  views: number
}

export interface TextPost extends BasePost {
  type: 'text'
  content: string
  images: string[]
}

export interface ArticlePost extends BasePost {
  type: 'article'
  title: string
  description: string
  url: string
  image: string
}

export interface JobSharePost extends BasePost {
  type: 'job-share'
  jobId: JobId
  caption?: string
}

export type CelebrationType = 'new-job' | 'promotion' | 'anniversary' | 'birthday' | 'work-anniversary'

export interface CelebrationPost extends BasePost {
  type: 'celebration'
  celebrationType: CelebrationType
  content: string
  companyId?: CompanyId
}

export interface PollOption {
  id: string
  text: string
  votes: number
}

export interface PollPost extends BasePost {
  type: 'poll'
  question: string
  options: PollOption[]
  totalVotes: number
  endDate: Date
  hasVoted?: boolean
  selectedOptionId?: string
}

export type Post = TextPost | ArticlePost | JobSharePost | CelebrationPost | PollPost

// =============================================================================
// Notification Types (Discriminated Union)
// =============================================================================

interface BaseNotification {
  id: NotificationId
  forUserId: UserId
  createdAt: Date
  read: boolean
}

export interface ConnectionRequestNotification extends BaseNotification {
  type: 'connection-request'
  fromUserId: UserId
}

export interface ConnectionAcceptedNotification extends BaseNotification {
  type: 'connection-accepted'
  userId: UserId
}

export interface LikeNotification extends BaseNotification {
  type: 'like'
  userId: UserId
  postId: PostId
  reactionType: ReactionType
}

export interface CommentNotification extends BaseNotification {
  type: 'comment'
  userId: UserId
  postId: PostId
  commentPreview: string
}

export interface MentionNotification extends BaseNotification {
  type: 'mention'
  userId: UserId
  postId: PostId
  commentId?: CommentId
}

export interface JobMatchNotification extends BaseNotification {
  type: 'job-match'
  jobId: JobId
  matchScore: number
}

export interface ProfileViewNotification extends BaseNotification {
  type: 'profile-view'
  viewerCount: number
  notableViewers: UserId[]
}

export type Notification =
  | ConnectionRequestNotification
  | ConnectionAcceptedNotification
  | LikeNotification
  | CommentNotification
  | MentionNotification
  | JobMatchNotification
  | ProfileViewNotification

// =============================================================================
// User Types
// =============================================================================

export interface Experience {
  id: string
  title: string
  companyId?: CompanyId
  companyName: string
  companyLogo?: string
  location?: string
  startDate: Date
  endDate?: Date
  isCurrent: boolean
  description?: string
  skills?: string[]
}

export interface Education {
  id: string
  school: string
  logo?: string
  degree?: string
  fieldOfStudy?: string
  startYear: number
  endYear?: number
  description?: string
  activities?: string
}

export interface Skill {
  name: string
  endorsements: number
  endorsedBy: UserId[]
}

export interface User {
  id: UserId
  name: string
  headline: string
  avatar: string
  coverImage?: string
  location: string
  connections: number
  followers: number
  about?: string
  experience: Experience[]
  education: Education[]
  skills: Skill[]
  isOpenToWork?: boolean
  isHiring?: boolean
  pronouns?: string
  website?: string
  email?: string
}

// =============================================================================
// Company Types
// =============================================================================

export type CompanySize =
  | '1-10'
  | '11-50'
  | '51-200'
  | '201-500'
  | '501-1000'
  | '1001-5000'
  | '5001-10000'
  | '10001+'

export interface Company {
  id: CompanyId
  name: string
  logo: string
  coverImage?: string
  industry: string
  size: CompanySize
  followers: number
  employees?: number
  headquarters?: string
  founded?: number
  website?: string
  about?: string
  specialties?: string[]
}

// =============================================================================
// Job Types
// =============================================================================

export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship' | 'temporary'
export type WorkplaceType = 'on-site' | 'hybrid' | 'remote'
export type ExperienceLevel = 'entry' | 'associate' | 'mid-senior' | 'director' | 'executive'

export interface SalaryRange {
  min: number
  max: number
  currency: string
  period: 'hourly' | 'monthly' | 'yearly'
}

export interface Job {
  id: JobId
  title: string
  companyId: CompanyId
  companyName: string
  companyLogo: string
  location: string
  workplaceType: WorkplaceType
  jobType: JobType
  experienceLevel: ExperienceLevel
  salary?: SalaryRange
  postedAt: Date
  applicants: number
  isEasyApply: boolean
  description: string
  requirements?: string[]
  benefits?: string[]
  skills?: string[]
  isSaved?: boolean
  hasApplied?: boolean
}

// =============================================================================
// Comment Types
// =============================================================================

export interface Comment {
  id: CommentId
  postId: PostId
  authorId: UserId
  content: string
  createdAt: Date
  updatedAt?: Date
  reactions: ReactionSummary[]
  totalReactions: number
  replies?: Comment[]
  parentCommentId?: CommentId
}

// =============================================================================
// Connection Types
// =============================================================================

export type ConnectionStatus = 'pending' | 'connected' | 'following'

export interface Connection {
  id: ConnectionId
  userId: UserId
  connectedUserId: UserId
  status: ConnectionStatus
  connectedAt?: Date
  mutualConnections: number
}

// =============================================================================
// Message Types
// =============================================================================

export type MessageId = string & { readonly __brand: 'MessageId' }
export type ConversationId = string & { readonly __brand: 'ConversationId' }

export const createMessageId = (id: string): MessageId => id as MessageId
export const createConversationId = (id: string): ConversationId => id as ConversationId

export interface Message {
  id: MessageId
  conversationId: ConversationId
  senderId: UserId
  content: string
  createdAt: Date
  read: boolean
  attachments?: string[]
}

export interface Conversation {
  id: ConversationId
  participants: UserId[]
  lastMessage?: Message
  unreadCount: number
  updatedAt: Date
}
