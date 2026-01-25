import { faker } from "@faker-js/faker"
import type {
  User,
  UserId,
  Tweet,
  TweetId,
  Notification,
  NotificationId,
  Trend,
  Message,
} from "./types"

// Seed for reproducible data across refreshes
faker.seed(12345)

function createUser(id: number): User {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  return {
    id: `user-${id}` as UserId,
    name: `${firstName} ${lastName}`,
    username: faker.internet.username({ firstName, lastName }).toLowerCase().replace(/[^a-z0-9_]/g, ""),
    avatar: `https://avatars.githubusercontent.com/u/${1000 + id}`,
    bio: faker.lorem.sentence(),
    location: faker.helpers.maybe(() => faker.location.city()) ?? undefined,
    website: faker.helpers.maybe(() => `https://${faker.internet.domainName()}`) ?? undefined,
    joinedAt: faker.date.past({ years: 5 }),
    followers: faker.number.int({ min: 10, max: 100000 }),
    following: faker.number.int({ min: 10, max: 1000 }),
    verified: faker.datatype.boolean({ probability: 0.2 }),
    isFollowing: faker.datatype.boolean({ probability: 0.3 }),
  }
}

function createTweet(id: number, author: User): Tweet {
  const hasImages = faker.datatype.boolean({ probability: 0.3 })
  return {
    id: `tweet-${id}` as TweetId,
    author,
    content: faker.helpers.arrayElement([
      faker.lorem.sentence(),
      faker.lorem.sentences(2),
      faker.lorem.paragraph(),
      `Just shipped a new feature! ${faker.company.buzzPhrase()} 🚀`,
      `Hot take: ${faker.lorem.sentence()}`,
      `Thread: ${faker.lorem.sentence()} 🧵`,
      faker.hacker.phrase(),
      `${faker.lorem.sentence()} @${faker.internet.username().toLowerCase()}`,
      `#${faker.word.noun()} ${faker.lorem.sentence()}`,
    ]),
    createdAt: faker.date.recent({ days: 7 }),
    likes: faker.number.int({ min: 0, max: 50000 }),
    retweets: faker.number.int({ min: 0, max: 10000 }),
    replies: faker.number.int({ min: 0, max: 5000 }),
    views: faker.number.int({ min: 100, max: 1000000 }),
    images: hasImages
      ? Array.from(
          { length: faker.number.int({ min: 1, max: 4 }) },
          (_, i) => `https://picsum.photos/seed/${id}-${i}/600/400`
        )
      : undefined,
    isLiked: faker.datatype.boolean({ probability: 0.2 }),
    isRetweeted: faker.datatype.boolean({ probability: 0.1 }),
    isBookmarked: faker.datatype.boolean({ probability: 0.05 }),
  }
}

// Generate current user (logged-in user)
export const currentUser: User = {
  id: "user-0" as UserId,
  name: "Demo User",
  username: "demouser",
  avatar: "https://avatars.githubusercontent.com/u/1000",
  bio: "Building cool stuff with Next.js and React. ✨",
  location: "San Francisco, CA",
  website: "https://example.com",
  joinedAt: new Date("2020-01-15"),
  followers: 1234,
  following: 567,
  verified: true,
  isFollowing: false,
}

// Generate other users
export const users: User[] = Array.from({ length: 20 }, (_, i) => createUser(i + 1))

// Generate tweets
export const tweets: Tweet[] = Array.from({ length: 100 }, (_, i) => {
  const randomUser = faker.helpers.arrayElement([currentUser, ...users])
  return createTweet(i, randomUser)
}).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

// Generate notifications
export const notifications: Notification[] = Array.from({ length: 20 }, (_, i) => {
  const type = faker.helpers.arrayElement([
    "like",
    "retweet",
    "follow",
    "reply",
    "mention",
  ] as const)
  const actor = faker.helpers.arrayElement(users)
  const tweet = faker.helpers.arrayElement(tweets.filter((t) => t.author.id === currentUser.id))

  const base = {
    id: `notification-${i}` as NotificationId,
    actor,
    createdAt: faker.date.recent({ days: 7 }),
    read: faker.datatype.boolean({ probability: 0.5 }),
  }

  switch (type) {
    case "like":
      return { ...base, type: "like" as const, tweet }
    case "retweet":
      return { ...base, type: "retweet" as const, tweet }
    case "follow":
      return { ...base, type: "follow" as const }
    case "reply":
      return {
        ...base,
        type: "reply" as const,
        tweet,
        replyTweet: createTweet(100 + i, actor),
      }
    case "mention":
      return {
        ...base,
        type: "mention" as const,
        tweet: createTweet(200 + i, actor),
      }
  }
}).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

// Generate trends
export const trends: Trend[] = [
  { id: "1", category: "Technology", name: "#NextJS", posts: 125000 },
  { id: "2", category: "Sports", name: "#SuperBowl", posts: 890000 },
  { id: "3", category: "Entertainment", name: "Taylor Swift", posts: 450000 },
  { id: "4", category: "Business", name: "#AI", posts: 234000 },
  { id: "5", category: "Trending in US", name: "#React", posts: 89000 },
  { id: "6", category: "Technology", name: "TypeScript", posts: 67000 },
  { id: "7", category: "Gaming", name: "#GTA6", posts: 156000 },
  { id: "8", category: "Politics", name: "#Election2024", posts: 567000 },
  { id: "9", category: "Music", name: "#Grammys", posts: 234000 },
  { id: "10", category: "Technology", name: "#OpenAI", posts: 189000 },
]

// Generate suggested users to follow
export const suggestedUsers: User[] = users
  .filter((u) => !u.isFollowing)
  .slice(0, 5)

// Generate messages (for messages page)
export const messages: Message[] = users.slice(0, 5).map((user, i) => ({
  id: `message-${i}`,
  participant: user,
  lastMessage: faker.lorem.sentence(),
  timestamp: faker.date.recent({ days: 3 }),
  unread: faker.datatype.boolean({ probability: 0.3 }),
}))

// Helper to get tweets by user
export function getTweetsByUser(userId: UserId): Tweet[] {
  return tweets.filter((t) => t.author.id === userId)
}

// Helper to get user by username
export function getUserByUsername(username: string): User | undefined {
  if (username === currentUser.username) return currentUser
  return users.find((u) => u.username === username)
}

// Helper to get tweet by id
export function getTweetById(id: TweetId): Tweet | undefined {
  return tweets.find((t) => t.id === id)
}

// Helper to get bookmarked tweets
export function getBookmarkedTweets(): Tweet[] {
  return tweets.filter((t) => t.isBookmarked)
}
