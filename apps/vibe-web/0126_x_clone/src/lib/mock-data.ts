import { faker } from "@faker-js/faker"
import type {
  UserId,
  TweetId,
  ConversationId,
  MessageId,
  NotificationId,
  User,
  Tweet,
  Notification,
  Conversation,
  Message,
  TrendingTopic,
} from "./types"

// Seed for reproducibility
faker.seed(42069)

// Tech/startup tweet templates for realistic content
const tweetTemplates = [
  "Just shipped a major update to our product. The team worked incredibly hard on this one. 🚀",
  "Hot take: {topic} is overrated. Here's why...",
  "Thread: Everything I learned about {topic} in the last year 🧵",
  "Unpopular opinion: {topic} will be irrelevant in 5 years",
  "Been thinking a lot about {topic} lately. Some thoughts below:",
  "Just had an amazing conversation about {topic}. Mind = blown",
  "The future of {topic} is here, and it's not what anyone expected",
  "Why does everyone keep sleeping on {topic}? It's literally the future",
  "Asked AI to explain {topic}. The results were... interesting 😅",
  "Day {n} of building in public: {topic} is harder than I thought",
  "Finally cracked the code on {topic}. Here's my approach:",
  "Controversial: {topic} isn't dead, you're just doing it wrong",
  "This is the year of {topic}. Mark my words.",
  "Just realized {topic} and {topic2} are basically the same thing",
  "PSA: Stop overthinking {topic}. Just ship it.",
  "The best {topic} advice I ever received: 'Start before you're ready'",
  "Feeling grateful for this community. You all are amazing! ❤️",
  "Weekend project update: built a {topic} thing. Pretty happy with it!",
  "Reading list for anyone interested in {topic}:",
  "Took a break from {topic} and my productivity actually improved",
]

const topics = [
  "AI", "React", "TypeScript", "startups", "web3", "design systems",
  "productivity", "remote work", "open source", "side projects",
  "Tailwind CSS", "Next.js", "building in public", "indie hacking",
  "developer experience", "serverless", "edge computing", "LLMs",
  "machine learning", "product design", "user research", "growth hacking",
]

// Generate a random user
function createUser(id: number, isCurrentUser = false): User {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  const username = isCurrentUser
    ? "johndoe"
    : faker.internet.username({ firstName, lastName }).toLowerCase().slice(0, 15)

  return {
    id: `user-${id}` as UserId,
    name: isCurrentUser ? "John Doe" : `${firstName} ${lastName}`,
    username,
    avatar: `https://i.pravatar.cc/150?u=${id}`,
    bio: faker.person.bio(),
    location: faker.helpers.maybe(() => faker.location.city()),
    website: faker.helpers.maybe(() => faker.internet.url()),
    joinedAt: faker.date.past({ years: 5 }),
    followers: faker.number.int({ min: 50, max: 500_000 }),
    following: faker.number.int({ min: 20, max: 2000 }),
    verified: faker.helpers.maybe(() => true, { probability: 0.2 }) ?? false,
    isFollowing: !isCurrentUser && faker.datatype.boolean(0.4),
  }
}

// Generate tweet content from templates
function generateTweetContent(): string {
  const template = faker.helpers.arrayElement(tweetTemplates)
  return template
    .replace("{topic}", faker.helpers.arrayElement(topics))
    .replace("{topic2}", faker.helpers.arrayElement(topics))
    .replace("{n}", faker.number.int({ min: 1, max: 100 }).toString())
}

// Generate a tweet
function createTweet(
  id: number,
  author: User,
  replyTo?: TweetId,
  hasImages = faker.datatype.boolean(0.3)
): Tweet {
  const imageCount = hasImages ? faker.number.int({ min: 1, max: 4 }) : 0
  const images = imageCount > 0
    ? Array.from({ length: imageCount }, (_, i) =>
        `https://picsum.photos/seed/${id}-${i}/600/400`
      )
    : undefined

  return {
    id: `tweet-${id}` as TweetId,
    author,
    content: generateTweetContent(),
    createdAt: faker.date.recent({ days: 14 }),
    likes: faker.number.int({ min: 0, max: 50_000 }),
    retweets: faker.number.int({ min: 0, max: 10_000 }),
    replies: faker.number.int({ min: 0, max: 2_000 }),
    views: faker.number.int({ min: 100, max: 1_000_000 }),
    images,
    replyTo,
    isLiked: faker.datatype.boolean(0.2),
    isRetweeted: faker.datatype.boolean(0.1),
    isBookmarked: faker.datatype.boolean(0.05),
  }
}

// Generate notifications
function createNotifications(
  currentUser: User,
  users: User[],
  tweets: Tweet[]
): Notification[] {
  const notifications: Notification[] = []
  const notificationTypes: Notification["type"][] = [
    "like",
    "retweet",
    "follow",
    "reply",
    "mention",
  ]

  // Generate 30 notifications
  for (let i = 0; i < 30; i++) {
    const type = faker.helpers.arrayElement(notificationTypes)
    const actor = faker.helpers.arrayElement(users.filter((u) => u.id !== currentUser.id))
    const tweet = faker.helpers.arrayElement(tweets.filter((t) => t.author.id === currentUser.id))
    const createdAt = faker.date.recent({ days: 7 })
    const read = faker.datatype.boolean(0.6)

    const baseNotification = {
      id: `notif-${i}` as NotificationId,
      actor,
      createdAt,
      read,
    }

    switch (type) {
      case "like":
        if (tweet) {
          notifications.push({ ...baseNotification, type: "like", tweet })
        }
        break
      case "retweet":
        if (tweet) {
          notifications.push({ ...baseNotification, type: "retweet", tweet })
        }
        break
      case "follow":
        notifications.push({ ...baseNotification, type: "follow" })
        break
      case "reply":
        if (tweet) {
          const replyTweet = createTweet(1000 + i, actor, tweet.id, false)
          notifications.push({ ...baseNotification, type: "reply", tweet, replyTweet })
        }
        break
      case "mention":
        {
          const mentionTweet = createTweet(2000 + i, actor)
          mentionTweet.content = `@${currentUser.username} ${mentionTweet.content}`
          notifications.push({ ...baseNotification, type: "mention", tweet: mentionTweet })
        }
        break
    }
  }

  return notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

// Generate conversations
function createConversations(currentUser: User, users: User[]): Conversation[] {
  const conversations: Conversation[] = []
  const otherUsers = users.filter((u) => u.id !== currentUser.id).slice(0, 8)

  for (let i = 0; i < otherUsers.length; i++) {
    const otherUser = otherUsers[i]
    const messageCount = faker.number.int({ min: 3, max: 20 })
    const messages: Message[] = []

    for (let j = 0; j < messageCount; j++) {
      const sender = faker.datatype.boolean() ? currentUser : otherUser
      messages.push({
        id: `msg-${i}-${j}` as MessageId,
        sender,
        content: faker.lorem.sentence(),
        createdAt: faker.date.recent({ days: 7 }),
        read: sender.id === currentUser.id || faker.datatype.boolean(0.8),
      })
    }

    messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

    conversations.push({
      id: `conv-${i}` as ConversationId,
      participants: [currentUser, otherUser],
      lastMessage: messages[messages.length - 1],
      updatedAt: messages[messages.length - 1]?.createdAt || new Date(),
      unreadCount: messages.filter(
        (m) => m.sender.id !== currentUser.id && !m.read
      ).length,
    })
  }

  return conversations.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
}

// Generate trending topics
function createTrendingTopics(): TrendingTopic[] {
  const categories = ["Technology", "Sports", "Entertainment", "Politics", "Business"]

  return Array.from({ length: 10 }, (_, i) => ({
    id: `trend-${i}`,
    category: faker.helpers.arrayElement(categories),
    topic: faker.helpers.arrayElement(topics).replace(/\s+/g, ""),
    tweetCount: faker.number.int({ min: 1000, max: 500_000 }),
  }))
}

// Generate replies for a tweet
export function generateReplies(tweetId: TweetId, users: User[], count = 10): Tweet[] {
  return Array.from({ length: count }, (_, i) => {
    const author = faker.helpers.arrayElement(users)
    return createTweet(5000 + parseInt(tweetId.split("-")[1]) * 100 + i, author, tweetId, false)
  }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

// Generate messages for a conversation
export function generateMessages(conversationId: ConversationId): Message[] {
  const conversation = conversations.find((c) => c.id === conversationId)
  if (!conversation) return []

  const messages: Message[] = []
  const messageCount = faker.number.int({ min: 10, max: 30 })

  for (let i = 0; i < messageCount; i++) {
    const sender = faker.datatype.boolean()
      ? conversation.participants[0]
      : conversation.participants[1]

    messages.push({
      id: `msg-${conversationId}-${i}` as MessageId,
      sender,
      content: faker.lorem.sentences({ min: 1, max: 3 }),
      createdAt: faker.date.recent({ days: 7 }),
      read: true,
    })
  }

  return messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
}

// === Export generated data ===

// Current user
export const currentUser = createUser(0, true)

// Generate 25 users
export const users = Array.from({ length: 25 }, (_, i) => createUser(i + 1))

// Generate 150 tweets (15 from currentUser, rest from other users)
const currentUserTweets = Array.from({ length: 15 }, (_, i) =>
  createTweet(i, currentUser)
)

const otherUserTweets = Array.from({ length: 135 }, (_, i) => {
  const author = faker.helpers.arrayElement(users)
  return createTweet(i + 15, author)
})

export const tweets = [...currentUserTweets, ...otherUserTweets]
  .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

// Bookmarked tweets
export const bookmarkedTweets = tweets.filter((t) => t.isBookmarked)

// Notifications
export const notifications = createNotifications(currentUser, users, tweets)

// Conversations
export const conversations = createConversations(currentUser, users)

// Trending topics
export const trendingTopics = createTrendingTopics()

// "Who to follow" suggestions (deterministic - sort by follower count descending)
export const suggestedUsers = users
  .filter((u) => !u.isFollowing)
  .sort((a, b) => b.followers - a.followers)
  .slice(0, 5)
