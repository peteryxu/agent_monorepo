import { faker } from "@faker-js/faker"
import {
  REACTION_TYPES,
  type User,
  type UserId,
  type Company,
  type CompanyId,
  type Post,
  type PostId,
  type Job,
  type JobId,
  type Comment,
  type CommentId,
  type Notification,
  type NotificationId,
  type Connection,
  type ConnectionId,
  type Conversation,
  type ConversationId,
  type Message,
  type MessageId,
  type Experience,
  type Skill,
  type NewsItem,
  type TrendingTopic,
  type ReactionType,
  type ReactionSummary,
} from "./types"

// Seed for reproducible data
faker.seed(42)

// ============================================================================
// Companies
// ============================================================================

const COMPANY_DATA = [
  { name: "Google", industry: "Technology", size: "10,001+ employees" },
  { name: "Microsoft", industry: "Technology", size: "10,001+ employees" },
  { name: "Apple", industry: "Technology", size: "10,001+ employees" },
  { name: "Amazon", industry: "E-commerce", size: "10,001+ employees" },
  { name: "Meta", industry: "Technology", size: "10,001+ employees" },
  { name: "Netflix", industry: "Entertainment", size: "5,001-10,000 employees" },
  { name: "Spotify", industry: "Music Streaming", size: "1,001-5,000 employees" },
  { name: "Stripe", industry: "Fintech", size: "1,001-5,000 employees" },
  { name: "Airbnb", industry: "Travel & Hospitality", size: "5,001-10,000 employees" },
  { name: "Slack", industry: "Technology", size: "1,001-5,000 employees" },
  { name: "Figma", industry: "Design Software", size: "501-1,000 employees" },
  { name: "Notion", industry: "Productivity", size: "201-500 employees" },
  { name: "Linear", industry: "Developer Tools", size: "51-200 employees" },
  { name: "Vercel", industry: "Developer Tools", size: "201-500 employees" },
  { name: "OpenAI", industry: "Artificial Intelligence", size: "501-1,000 employees" },
]

export const companies: Company[] = COMPANY_DATA.map((c, i) => ({
  id: `company-${i}` as CompanyId,
  name: c.name,
  logo: `https://logo.clearbit.com/${c.name.toLowerCase().replace(/\s+/g, "")}.com`,
  industry: c.industry,
  size: c.size,
  headquarters: faker.location.city() + ", " + faker.location.state({ abbreviated: true }),
  followers: faker.number.int({ min: 50000, max: 5000000 }),
}))

function randomCompany(): Company {
  return faker.helpers.arrayElement(companies)
}

// ============================================================================
// Users
// ============================================================================

const HEADLINES = [
  "Senior Software Engineer",
  "Product Manager",
  "UX Designer",
  "Data Scientist",
  "Engineering Manager",
  "Full Stack Developer",
  "DevOps Engineer",
  "Frontend Developer",
  "Backend Engineer",
  "Machine Learning Engineer",
  "Technical Lead",
  "Staff Engineer",
  "Principal Engineer",
  "VP of Engineering",
  "CTO",
]

function createUser(id: number): User {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  const company = randomCompany()
  const headline = faker.helpers.arrayElement(HEADLINES)

  return {
    id: `user-${id}` as UserId,
    firstName,
    lastName,
    headline: `${headline} at ${company.name}`,
    avatar: `https://i.pravatar.cc/150?u=${id}`,
    coverImage: faker.helpers.maybe(() => `https://picsum.photos/seed/${id}/800/200`, { probability: 0.6 }),
    location: faker.location.city() + ", " + faker.location.state({ abbreviated: true }),
    about: faker.helpers.maybe(() => faker.lorem.paragraphs(2), { probability: 0.7 }),
    connections: faker.number.int({ min: 50, max: 500 }),
    followers: faker.number.int({ min: 100, max: 10000 }),
    isOpenToWork: faker.datatype.boolean({ probability: 0.15 }),
    isPremium: faker.datatype.boolean({ probability: 0.2 }),
    currentCompany: company,
    currentPosition: headline,
    profileViews: faker.number.int({ min: 10, max: 500 }),
    postImpressions: faker.number.int({ min: 100, max: 50000 }),
    searchAppearances: faker.number.int({ min: 5, max: 200 }),
  }
}

// Current logged-in user
export const currentUser: User = {
  id: "user-0" as UserId,
  firstName: "Alex",
  lastName: "Chen",
  headline: "Staff Software Engineer at Vercel | Building the future of the web",
  avatar: "https://i.pravatar.cc/150?u=0",
  coverImage: "https://picsum.photos/seed/cover/800/200",
  location: "San Francisco, CA",
  about: "Passionate about building great developer experiences. Previously at Google and Meta. Open source contributor and tech blogger.",
  connections: 487,
  followers: 2341,
  isOpenToWork: false,
  isPremium: true,
  currentCompany: companies.find((c) => c.name === "Vercel"),
  currentPosition: "Staff Software Engineer",
  profileViews: 234,
  postImpressions: 12500,
  searchAppearances: 89,
}

// Generate other users
export const users: User[] = Array.from({ length: 50 }, (_, i) => createUser(i + 1))

export function getUserById(id: UserId): User | undefined {
  if (id === currentUser.id) return currentUser
  return users.find((u) => u.id === id)
}

// ============================================================================
// Experiences & Skills
// ============================================================================

export function generateExperiences(user: User): Experience[] {
  const count = faker.number.int({ min: 2, max: 5 })
  const experiences: Experience[] = []
  let currentDate = new Date()

  for (let i = 0; i < count; i++) {
    const duration = faker.number.int({ min: 12, max: 48 })
    const startDate = new Date(currentDate)
    startDate.setMonth(startDate.getMonth() - duration)

    experiences.push({
      id: `exp-${user.id}-${i}`,
      title: faker.helpers.arrayElement(HEADLINES),
      company: randomCompany(),
      location: faker.location.city() + ", " + faker.location.state({ abbreviated: true }),
      startDate,
      endDate: i === 0 ? undefined : currentDate,
      description: faker.lorem.paragraph(),
      skills: faker.helpers.arrayElements(
        ["React", "TypeScript", "Node.js", "Python", "AWS", "Kubernetes", "GraphQL", "PostgreSQL"],
        { min: 2, max: 5 }
      ),
    })

    currentDate = new Date(startDate)
    currentDate.setMonth(currentDate.getMonth() - faker.number.int({ min: 1, max: 6 }))
  }

  return experiences
}

export function generateSkills(user: User): Skill[] {
  const skillNames = [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "Java",
    "AWS",
    "Docker",
    "Kubernetes",
    "GraphQL",
    "PostgreSQL",
    "MongoDB",
    "Git",
    "Agile",
    "Leadership",
  ]

  return faker.helpers.arrayElements(skillNames, { min: 5, max: 10 }).map((name) => ({
    name,
    endorsements: faker.number.int({ min: 0, max: 99 }),
    endorsedBy: faker.helpers.arrayElements(users, { min: 0, max: 5 }),
  }))
}

// ============================================================================
// Posts
// ============================================================================

function generateReactions(): ReactionSummary[] {
  const usedTypes = faker.helpers.arrayElements([...REACTION_TYPES], { min: 1, max: 4 })
  return usedTypes.map((type) => ({
    type,
    count: faker.number.int({ min: 1, max: 500 }),
  }))
}

function createTextPost(id: number, author: User): Post {
  const reactions = generateReactions()
  const hasMedia = faker.datatype.boolean({ probability: 0.4 })

  return {
    type: "text",
    id: `post-${id}` as PostId,
    author,
    content: faker.helpers.arrayElement([
      faker.lorem.paragraphs({ min: 1, max: 3 }),
      `Excited to share that ${faker.company.catchPhrase()}! 🚀\n\n${faker.lorem.paragraph()}`,
      `Hot take: ${faker.lorem.sentence()}\n\nThoughts? 👇`,
      `Just wrapped up an amazing project on ${faker.hacker.noun()}. Key learnings:\n\n• ${faker.lorem.sentence()}\n• ${faker.lorem.sentence()}\n• ${faker.lorem.sentence()}\n\n#${faker.hacker.noun()} #career`,
      `Grateful for my incredible team at ${author.currentCompany?.name}! 🙏\n\n${faker.lorem.paragraph()}`,
    ]),
    createdAt: faker.date.recent({ days: 14 }),
    reactions,
    totalReactions: reactions.reduce((sum, r) => sum + r.count, 0),
    comments: faker.number.int({ min: 0, max: 200 }),
    reposts: faker.number.int({ min: 0, max: 100 }),
    impressions: faker.number.int({ min: 100, max: 50000 }),
    userReaction: faker.helpers.maybe(() => faker.helpers.arrayElement([...REACTION_TYPES]), { probability: 0.2 }),
    isReposted: faker.datatype.boolean({ probability: 0.05 }),
    isSaved: faker.datatype.boolean({ probability: 0.1 }),
    images: hasMedia
      ? Array.from({ length: faker.number.int({ min: 1, max: 4 }) }, (_, i) =>
          `https://picsum.photos/seed/${id}-${i}/600/400`
        )
      : undefined,
  }
}

function createArticlePost(id: number, author: User): Post {
  const reactions = generateReactions()

  return {
    type: "article",
    id: `post-${id}` as PostId,
    author,
    content: faker.lorem.sentences(2),
    createdAt: faker.date.recent({ days: 14 }),
    reactions,
    totalReactions: reactions.reduce((sum, r) => sum + r.count, 0),
    comments: faker.number.int({ min: 0, max: 100 }),
    reposts: faker.number.int({ min: 0, max: 50 }),
    impressions: faker.number.int({ min: 500, max: 100000 }),
    userReaction: faker.helpers.maybe(() => faker.helpers.arrayElement([...REACTION_TYPES]), { probability: 0.2 }),
    isReposted: false,
    isSaved: faker.datatype.boolean({ probability: 0.15 }),
    article: {
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      image: `https://picsum.photos/seed/article-${id}/800/400`,
      url: `https://medium.com/@${author.firstName.toLowerCase()}/${faker.lorem.slug()}`,
      source: "medium.com",
    },
  }
}

function createCelebrationPost(id: number, author: User): Post {
  const reactions = generateReactions()
  const celebrationType = faker.helpers.arrayElement([
    "work-anniversary",
    "new-position",
    "promotion",
    "new-job",
  ] as const)

  return {
    type: "celebration",
    id: `post-${id}` as PostId,
    author,
    content:
      celebrationType === "work-anniversary"
        ? `Celebrating ${faker.number.int({ min: 1, max: 10 })} years at ${author.currentCompany?.name}! 🎉`
        : celebrationType === "new-position"
          ? `Excited to share that I've started a new position as ${faker.helpers.arrayElement(HEADLINES)}!`
          : celebrationType === "promotion"
            ? `Thrilled to announce my promotion to ${faker.helpers.arrayElement(HEADLINES)}! 🎊`
            : `I'm happy to share that I'm starting a new position at ${randomCompany().name}!`,
    createdAt: faker.date.recent({ days: 7 }),
    reactions,
    totalReactions: reactions.reduce((sum, r) => sum + r.count, 0),
    comments: faker.number.int({ min: 10, max: 300 }),
    reposts: faker.number.int({ min: 5, max: 50 }),
    impressions: faker.number.int({ min: 1000, max: 100000 }),
    userReaction: faker.helpers.maybe(() => "celebrate" as ReactionType, { probability: 0.3 }),
    isReposted: false,
    isSaved: false,
    celebrationType,
    years: celebrationType === "work-anniversary" ? faker.number.int({ min: 1, max: 10 }) : undefined,
    company: author.currentCompany,
    position: author.currentPosition,
  }
}

function createPollPost(id: number, author: User): Post {
  const reactions = generateReactions()
  const options = faker.helpers
    .arrayElements(
      [
        "Strongly agree",
        "Agree",
        "Neutral",
        "Disagree",
        "Remote",
        "Hybrid",
        "In-office",
        "JavaScript",
        "TypeScript",
        "Python",
        "Rust",
        "Yes",
        "No",
        "Maybe",
      ],
      { min: 2, max: 4 }
    )
    .map((text, i) => ({
      id: `option-${i}`,
      text,
      votes: faker.number.int({ min: 10, max: 500 }),
      percentage: 0,
    }))

  const totalVotes = options.reduce((sum, o) => sum + o.votes, 0)
  options.forEach((o) => {
    o.percentage = Math.round((o.votes / totalVotes) * 100)
  })

  return {
    type: "poll",
    id: `post-${id}` as PostId,
    author,
    content: faker.helpers.arrayElement([
      "What's your preferred work style?",
      "Which programming language do you use most?",
      "Do you think AI will replace developers?",
      "Best framework for web development in 2025?",
    ]),
    createdAt: faker.date.recent({ days: 5 }),
    reactions,
    totalReactions: reactions.reduce((sum, r) => sum + r.count, 0),
    comments: faker.number.int({ min: 20, max: 200 }),
    reposts: faker.number.int({ min: 5, max: 30 }),
    impressions: faker.number.int({ min: 2000, max: 50000 }),
    userReaction: undefined,
    isReposted: false,
    isSaved: false,
    poll: {
      question: faker.lorem.sentence().replace(".", "?"),
      options,
      totalVotes,
      endsAt: faker.date.soon({ days: 7 }),
      userVotedOptionId: faker.helpers.maybe(() => faker.helpers.arrayElement(options).id, { probability: 0.3 }),
    },
  }
}

// Generate posts - ensure some posts are from the current user
const currentUserPosts = Array.from({ length: 10 }, (_, i) => {
  const postType = faker.helpers.weightedArrayElement([
    { value: "text", weight: 60 },
    { value: "article", weight: 15 },
    { value: "celebration", weight: 15 },
    { value: "poll", weight: 10 },
  ])

  switch (postType) {
    case "article":
      return createArticlePost(i, currentUser)
    case "celebration":
      return createCelebrationPost(i, currentUser)
    case "poll":
      return createPollPost(i, currentUser)
    default:
      return createTextPost(i, currentUser)
  }
})

const otherPosts = Array.from({ length: 90 }, (_, i) => {
  const author = faker.helpers.arrayElement(users)
  const postType = faker.helpers.weightedArrayElement([
    { value: "text", weight: 60 },
    { value: "article", weight: 15 },
    { value: "celebration", weight: 15 },
    { value: "poll", weight: 10 },
  ])

  switch (postType) {
    case "article":
      return createArticlePost(i + 10, author)
    case "celebration":
      return createCelebrationPost(i + 10, author)
    case "poll":
      return createPollPost(i + 10, author)
    default:
      return createTextPost(i + 10, author)
  }
})

export const posts: Post[] = [...currentUserPosts, ...otherPosts].sort(
  (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
)

export function getPostById(id: PostId): Post | undefined {
  return posts.find((p) => p.id === id)
}

// ============================================================================
// Comments
// ============================================================================

export function generateComments(postId: PostId, count: number = 5): Comment[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `comment-${postId}-${i}` as CommentId,
    postId,
    author: faker.helpers.arrayElement(users),
    content: faker.lorem.sentences({ min: 1, max: 3 }),
    createdAt: faker.date.recent({ days: 7 }),
    likes: faker.number.int({ min: 0, max: 50 }),
    isLiked: faker.datatype.boolean({ probability: 0.1 }),
    replies: faker.helpers.maybe(
      () =>
        Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, (_, j) => ({
          id: `comment-${postId}-${i}-reply-${j}` as CommentId,
          postId,
          author: faker.helpers.arrayElement(users),
          content: faker.lorem.sentence(),
          createdAt: faker.date.recent({ days: 5 }),
          likes: faker.number.int({ min: 0, max: 20 }),
          isLiked: false,
          replies: [],
        })),
      { probability: 0.3 }
    ) || [],
  }))
}

// ============================================================================
// Jobs
// ============================================================================

const JOB_TITLES = [
  "Senior Software Engineer",
  "Staff Engineer",
  "Principal Engineer",
  "Engineering Manager",
  "Product Manager",
  "Senior Product Designer",
  "Data Scientist",
  "Machine Learning Engineer",
  "DevOps Engineer",
  "Frontend Developer",
  "Backend Engineer",
  "Full Stack Developer",
]

export const jobs: Job[] = Array.from({ length: 50 }, (_, i) => {
  const company = randomCompany()
  const hasRemote = faker.datatype.boolean({ probability: 0.4 })

  return {
    id: `job-${i}` as JobId,
    title: faker.helpers.arrayElement(JOB_TITLES),
    company,
    location: hasRemote ? "Remote" : faker.location.city() + ", " + faker.location.state({ abbreviated: true }),
    workplaceType: hasRemote ? "remote" as const : faker.helpers.arrayElement(["on-site", "hybrid"] as const),
    jobType: faker.helpers.weightedArrayElement([
      { value: "full-time", weight: 80 },
      { value: "contract", weight: 10 },
      { value: "part-time", weight: 5 },
      { value: "internship", weight: 5 },
    ]),
    experienceLevel: faker.helpers.arrayElement(["entry", "associate", "mid-senior", "director"]),
    salary: faker.helpers.maybe(
      () => ({
        min: faker.number.int({ min: 80000, max: 150000 }),
        max: faker.number.int({ min: 150000, max: 350000 }),
        currency: "USD",
      }),
      { probability: 0.6 }
    ),
    description: faker.lorem.paragraphs(3),
    requirements: Array.from({ length: 5 }, () => faker.lorem.sentence()),
    benefits: ["Health insurance", "401(k)", "Remote work", "Unlimited PTO", "Stock options"].slice(
      0,
      faker.number.int({ min: 3, max: 5 })
    ),
    postedAt: faker.date.recent({ days: 30 }),
    applicants: faker.number.int({ min: 5, max: 500 }),
    isEasyApply: faker.datatype.boolean({ probability: 0.7 }),
    isSaved: faker.datatype.boolean({ probability: 0.1 }),
    isApplied: faker.datatype.boolean({ probability: 0.05 }),
    skills: faker.helpers.arrayElements(
      ["React", "TypeScript", "Node.js", "Python", "AWS", "Kubernetes", "GraphQL", "PostgreSQL", "Docker", "Git"],
      { min: 3, max: 6 }
    ),
  }
}).sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime())

export function getJobById(id: JobId): Job | undefined {
  return jobs.find((j) => j.id === id)
}

// ============================================================================
// Connections
// ============================================================================

export const connections: Connection[] = users.slice(0, 30).map((user, i) => ({
  id: `connection-${i}` as ConnectionId,
  user,
  status: faker.helpers.weightedArrayElement([
    { value: "connected", weight: 70 },
    { value: "pending-received", weight: 15 },
    { value: "pending-sent", weight: 10 },
    { value: "none", weight: 5 },
  ]),
  connectedAt: faker.helpers.maybe(() => faker.date.past({ years: 2 }), { probability: 0.7 }),
  mutualConnections: faker.number.int({ min: 0, max: 50 }),
  note: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.2 }),
}))

export const pendingRequests = connections.filter((c) => c.status === "pending-received")
export const suggestedConnections = users.slice(30, 40).map((user, i) => ({
  id: `suggestion-${i}` as ConnectionId,
  user,
  status: "none" as const,
  mutualConnections: faker.number.int({ min: 1, max: 20 }),
}))

// ============================================================================
// Notifications
// ============================================================================

export const notifications: Notification[] = Array.from({ length: 30 }, (_, i) => {
  const type = faker.helpers.weightedArrayElement([
    { value: "reaction", weight: 25 },
    { value: "comment", weight: 20 },
    { value: "connection-request", weight: 15 },
    { value: "connection-accepted", weight: 10 },
    { value: "mention", weight: 10 },
    { value: "job-match", weight: 10 },
    { value: "profile-view", weight: 10 },
  ])

  const base = {
    id: `notification-${i}` as NotificationId,
    createdAt: faker.date.recent({ days: 14 }),
    read: faker.datatype.boolean({ probability: 0.4 }),
  }

  switch (type) {
    case "connection-request":
      return {
        ...base,
        type: "connection-request" as const,
        from: faker.helpers.arrayElement(users),
        note: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 }),
      }
    case "connection-accepted":
      return {
        ...base,
        type: "connection-accepted" as const,
        user: faker.helpers.arrayElement(users),
      }
    case "reaction": {
      const userPosts = posts.filter((p) => p.author.id === currentUser.id)
      return {
        ...base,
        type: "reaction" as const,
        actor: faker.helpers.arrayElement(users),
        post: userPosts.length > 0 ? faker.helpers.arrayElement(userPosts) : posts[0],
        reactionType: faker.helpers.arrayElement([...REACTION_TYPES]),
      }
    }
    case "comment": {
      const userPosts = posts.filter((p) => p.author.id === currentUser.id)
      return {
        ...base,
        type: "comment" as const,
        actor: faker.helpers.arrayElement(users),
        post: userPosts.length > 0 ? faker.helpers.arrayElement(userPosts) : posts[0],
        comment: faker.lorem.sentence(),
      }
    }
    case "mention":
      return {
        ...base,
        type: "mention" as const,
        actor: faker.helpers.arrayElement(users),
        post: faker.helpers.arrayElement(posts),
      }
    case "job-match":
      return {
        ...base,
        type: "job-match" as const,
        job: faker.helpers.arrayElement(jobs),
        matchScore: faker.number.int({ min: 70, max: 99 }),
      }
    case "profile-view":
      return {
        ...base,
        type: "profile-view" as const,
        viewer: faker.helpers.maybe(() => faker.helpers.arrayElement(users), { probability: 0.6 }),
        viewerTitle: faker.helpers.arrayElement(HEADLINES),
        viewerCompany: randomCompany().name,
      }
    default:
      return {
        ...base,
        type: "reaction" as const,
        actor: faker.helpers.arrayElement(users),
        post: faker.helpers.arrayElement(posts),
        reactionType: "like" as ReactionType,
      }
  }
}).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

// ============================================================================
// Messaging
// ============================================================================

export const conversations: Conversation[] = users.slice(0, 10).map((user, i) => ({
  id: `conversation-${i}` as ConversationId,
  participants: [currentUser, user],
  lastMessage: {
    id: `message-${i}-last` as MessageId,
    conversationId: `conversation-${i}` as ConversationId,
    sender: faker.helpers.arrayElement([currentUser, user]),
    content: faker.lorem.sentence(),
    createdAt: faker.date.recent({ days: 7 }),
    isRead: faker.datatype.boolean({ probability: 0.6 }),
  },
  unreadCount: faker.number.int({ min: 0, max: 5 }),
  updatedAt: faker.date.recent({ days: 7 }),
  isArchived: false,
  isMuted: faker.datatype.boolean({ probability: 0.1 }),
})).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())

export function generateMessages(conversationId: ConversationId): Message[] {
  const conversation = conversations.find((c) => c.id === conversationId)
  if (!conversation) return []

  const otherUser = conversation.participants.find((p) => p.id !== currentUser.id)!

  return Array.from({ length: 20 }, (_, i) => ({
    id: `message-${conversationId}-${i}` as MessageId,
    conversationId,
    sender: faker.helpers.arrayElement([currentUser, otherUser]),
    content: faker.lorem.sentences({ min: 1, max: 3 }),
    createdAt: faker.date.recent({ days: 7 }),
    isRead: true,
  })).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
}

// ============================================================================
// News & Trending
// ============================================================================

export const news: NewsItem[] = [
  {
    id: "1",
    title: "Tech layoffs slow as AI hiring surges",
    source: "Reuters",
    timeAgo: "2h",
    readers: 12453,
  },
  {
    id: "2",
    title: "Remote work policies evolving in 2025",
    source: "Bloomberg",
    timeAgo: "4h",
    readers: 8234,
  },
  {
    id: "3",
    title: "New JavaScript framework gains traction",
    source: "TechCrunch",
    timeAgo: "6h",
    readers: 5621,
  },
  {
    id: "4",
    title: "Startup funding rebounds in Q1",
    source: "Forbes",
    timeAgo: "8h",
    readers: 4532,
  },
  {
    id: "5",
    title: "The future of AI in enterprise software",
    source: "Wired",
    timeAgo: "12h",
    readers: 7845,
  },
]

export const trendingTopics: TrendingTopic[] = [
  { id: "1", topic: "#OpenToWork", category: "Careers", posts: 45000 },
  { id: "2", topic: "Artificial Intelligence", category: "Technology", posts: 128000 },
  { id: "3", topic: "Remote Work", category: "Workplace", posts: 34000 },
  { id: "4", topic: "#TechLayoffs", category: "Industry", posts: 67000 },
  { id: "5", topic: "Leadership", category: "Professional Development", posts: 23000 },
]
