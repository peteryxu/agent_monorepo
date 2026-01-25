// Branded types prevent ID mixups at compile time
type Brand<T, B> = T & { __brand: B }

export type UserId = Brand<string, "UserId">
export type TweetId = Brand<string, "TweetId">
export type ConversationId = Brand<string, "ConversationId">
export type MessageId = Brand<string, "MessageId">
export type NotificationId = Brand<string, "NotificationId">

// User types
export interface User {
  id: UserId
  name: string
  username: string
  avatar: string
  bio: string
  location?: string
  website?: string
  joinedAt: Date
  followers: number
  following: number
  verified: boolean
  isFollowing: boolean
}

// Tweet types
export interface Tweet {
  id: TweetId
  author: User
  content: string
  createdAt: Date
  likes: number
  retweets: number
  replies: number
  views: number
  images?: string[]
  quoteTweet?: Tweet
  replyTo?: TweetId
  isLiked: boolean
  isRetweeted: boolean
  isBookmarked: boolean
}

// Reply (a tweet that's a reply)
export interface Reply extends Tweet {
  replyTo: TweetId
}

// Discriminated union for notification types
export type Notification =
  | {
      type: "like"
      id: NotificationId
      actor: User
      tweet: Tweet
      createdAt: Date
      read: boolean
    }
  | {
      type: "retweet"
      id: NotificationId
      actor: User
      tweet: Tweet
      createdAt: Date
      read: boolean
    }
  | {
      type: "follow"
      id: NotificationId
      actor: User
      createdAt: Date
      read: boolean
    }
  | {
      type: "reply"
      id: NotificationId
      actor: User
      tweet: Tweet
      replyTweet: Tweet
      createdAt: Date
      read: boolean
    }
  | {
      type: "mention"
      id: NotificationId
      actor: User
      tweet: Tweet
      createdAt: Date
      read: boolean
    }

// Message types
export interface Message {
  id: MessageId
  sender: User
  content: string
  createdAt: Date
  read: boolean
}

export interface Conversation {
  id: ConversationId
  participants: User[]
  lastMessage?: Message
  updatedAt: Date
  unreadCount: number
}

// Trending topic
export interface TrendingTopic {
  id: string
  category: string
  topic: string
  tweetCount: number
}

// Type guard for exhaustive notification handling
export function assertNever(x: never): never {
  throw new Error(`Unexpected value: ${x}`)
}

// Helper to get notification type
export function getNotificationType(notification: Notification): string {
  return notification.type
}
