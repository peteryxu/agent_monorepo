// Branded types prevent ID mixups
type Brand<T, B> = T & { __brand: B }
export type UserId = Brand<string, "UserId">
export type TweetId = Brand<string, "TweetId">
export type NotificationId = Brand<string, "NotificationId">

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
  isFollowing?: boolean
}

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
  isLiked: boolean
  isRetweeted: boolean
  isBookmarked: boolean
}

// Discriminated union for notifications
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

// Type guard for exhaustive handling
export function assertNever(x: never): never {
  throw new Error(`Unexpected notification type: ${x}`)
}

export interface Trend {
  id: string
  category: string
  name: string
  posts: number
}

export interface Message {
  id: string
  participant: User
  lastMessage: string
  timestamp: Date
  unread: boolean
}
