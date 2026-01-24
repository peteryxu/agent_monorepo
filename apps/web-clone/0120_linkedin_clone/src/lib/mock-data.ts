import { faker } from "@faker-js/faker"
import type {
  User,
  UserId,
  Post,
  PostId,
  Job,
  JobId,
  Company,
  CompanyId,
  Notification,
  NotificationId,
  Experience,
  Education,
  Skill,
  ReactionCounts,
  ReactionType,
  PollOption,
  TrendingTopic,
  Conversation,
  ConversationId,
  Message,
  MessageId,
  Comment,
  CommentId,
} from "./types"

// Seed for reproducible data across refreshes
faker.seed(54321)

// ============ Company Generation ============

const COMPANY_NAMES = [
  "Google", "Microsoft", "Apple", "Amazon", "Meta", "Netflix", "Spotify",
  "Stripe", "Shopify", "Airbnb", "Uber", "Salesforce", "Adobe", "Slack",
  "Notion", "Figma", "Vercel", "GitHub", "GitLab", "Atlassian"
]

const INDUSTRIES = [
  "Technology", "Finance", "Healthcare", "Education", "Retail",
  "Manufacturing", "Entertainment", "Consulting", "Marketing", "Software"
]

function createCompany(id: number): Company {
  const name = COMPANY_NAMES[id % COMPANY_NAMES.length] || faker.company.name()
  return {
    id: `company-${id}` as CompanyId,
    name,
    logo: `https://logo.clearbit.com/${name.toLowerCase().replace(/\s+/g, "")}.com`,
    industry: faker.helpers.arrayElement(INDUSTRIES),
    size: faker.helpers.arrayElement([
      "1-10", "11-50", "51-200", "201-500", "501-1000", "1001-5000", "5001-10000", "10000+"
    ] as const),
    about: faker.company.catchPhrase(),
    headquarters: faker.location.city(),
    website: `https://${name.toLowerCase().replace(/\s+/g, "")}.com`,
    followers: faker.number.int({ min: 1000, max: 5000000 }),
  }
}

export const companies: Company[] = Array.from({ length: 20 }, (_, i) => createCompany(i))

// ============ User Generation ============

function createExperience(userId: number, expId: number): Experience {
  const company = faker.helpers.arrayElement(companies)
  const startDate = faker.date.past({ years: 10 })
  const isCurrent = expId === 0 && faker.datatype.boolean({ probability: 0.7 })

  return {
    id: `exp-${userId}-${expId}`,
    title: faker.person.jobTitle(),
    company,
    location: faker.location.city(),
    startDate,
    endDate: isCurrent ? undefined : faker.date.between({ from: startDate, to: new Date() }),
    description: faker.lorem.paragraph(),
    employmentType: faker.helpers.arrayElement([
      "full-time", "part-time", "contract", "internship", "freelance"
    ] as const),
  }
}

function createEducation(userId: number, eduId: number): Education {
  const schools = [
    "Stanford University", "MIT", "Harvard University", "UC Berkeley",
    "Carnegie Mellon", "Georgia Tech", "University of Michigan",
    "University of Washington", "Cornell University", "UCLA"
  ]
  const degrees = ["Bachelor's", "Master's", "PhD", "MBA"]
  const fields = [
    "Computer Science", "Software Engineering", "Business Administration",
    "Data Science", "Electrical Engineering", "Economics", "Mathematics"
  ]

  const startDate = faker.date.past({ years: 15 })

  return {
    id: `edu-${userId}-${eduId}`,
    school: faker.helpers.arrayElement(schools),
    logo: `https://logo.clearbit.com/${faker.helpers.arrayElement(schools).toLowerCase().replace(/\s+/g, "")}.edu`,
    degree: faker.helpers.arrayElement(degrees),
    field: faker.helpers.arrayElement(fields),
    startDate,
    endDate: faker.date.between({ from: startDate, to: new Date() }),
    description: faker.helpers.maybe(() => faker.lorem.sentence()),
  }
}

function createSkill(id: number): Skill {
  const skills = [
    "JavaScript", "TypeScript", "React", "Node.js", "Python", "Java",
    "AWS", "Docker", "Kubernetes", "GraphQL", "PostgreSQL", "MongoDB",
    "Git", "CI/CD", "Agile", "Product Management", "Leadership",
    "Machine Learning", "Data Analysis", "System Design"
  ]

  return {
    id: `skill-${id}`,
    name: skills[id % skills.length],
    endorsements: faker.number.int({ min: 0, max: 99 }),
  }
}

function createUser(id: number): User {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  const currentExp = createExperience(id, 0)

  return {
    id: `user-${id}` as UserId,
    name: `${firstName} ${lastName}`,
    username: faker.internet.username({ firstName, lastName }).toLowerCase().replace(/[^a-z0-9-]/g, "-"),
    avatar: `https://i.pravatar.cc/150?u=${id}`,
    coverImage: `https://picsum.photos/seed/${id}/800/200`,
    headline: `${currentExp.title} at ${currentExp.company.name}`,
    about: faker.lorem.paragraphs(2),
    location: faker.location.city() + ", " + faker.location.country(),
    website: faker.helpers.maybe(() => `https://${faker.internet.domainName()}`),
    connections: faker.number.int({ min: 50, max: 500 }),
    followers: faker.number.int({ min: 100, max: 10000 }),
    experience: Array.from({ length: faker.number.int({ min: 1, max: 4 }) }, (_, i) =>
      createExperience(id, i)
    ),
    education: Array.from({ length: faker.number.int({ min: 1, max: 2 }) }, (_, i) =>
      createEducation(id, i)
    ),
    skills: Array.from({ length: faker.number.int({ min: 5, max: 15 }) }, (_, i) =>
      createSkill(i)
    ),
    isConnected: faker.datatype.boolean({ probability: 0.3 }),
    connectionStatus: faker.helpers.arrayElement([
      "none", "pending-sent", "pending-received", "connected"
    ] as const),
    isPremium: faker.datatype.boolean({ probability: 0.15 }),
  }
}

// Current user (logged-in user)
export const currentUser: User = {
  id: "user-0" as UserId,
  name: "Alex Morgan",
  username: "alexmorgan",
  avatar: "https://i.pravatar.cc/150?u=0",
  coverImage: "https://picsum.photos/seed/0/800/200",
  headline: "Senior Software Engineer at Vercel",
  about: "Passionate about building scalable web applications and developer tools. Love working with Next.js, React, and TypeScript. Always learning and sharing knowledge with the community.",
  location: "San Francisco, CA",
  website: "https://alexmorgan.dev",
  connections: 847,
  followers: 2341,
  experience: [
    {
      id: "exp-0-0",
      title: "Senior Software Engineer",
      company: companies.find(c => c.name === "Vercel") || companies[0],
      location: "San Francisco, CA",
      startDate: new Date("2022-03-01"),
      endDate: undefined,
      description: "Leading frontend architecture and developer experience initiatives.",
      employmentType: "full-time",
    },
    {
      id: "exp-0-1",
      title: "Software Engineer",
      company: companies.find(c => c.name === "Stripe") || companies[1],
      location: "San Francisco, CA",
      startDate: new Date("2019-06-01"),
      endDate: new Date("2022-02-28"),
      description: "Built payment processing interfaces and developer APIs.",
      employmentType: "full-time",
    },
  ],
  education: [
    {
      id: "edu-0-0",
      school: "Stanford University",
      logo: "https://logo.clearbit.com/stanford.edu",
      degree: "Master's",
      field: "Computer Science",
      startDate: new Date("2017-09-01"),
      endDate: new Date("2019-06-01"),
    },
  ],
  skills: [
    { id: "skill-0", name: "React", endorsements: 87 },
    { id: "skill-1", name: "TypeScript", endorsements: 72 },
    { id: "skill-2", name: "Next.js", endorsements: 65 },
    { id: "skill-3", name: "Node.js", endorsements: 54 },
    { id: "skill-4", name: "System Design", endorsements: 43 },
  ],
  isConnected: false,
  connectionStatus: "none",
  isPremium: true,
}

// Generate other users
export const users: User[] = Array.from({ length: 30 }, (_, i) => createUser(i + 1))

// ============ Post Generation ============

function createReactionCounts(): ReactionCounts {
  const like = faker.number.int({ min: 0, max: 500 })
  const celebrate = faker.number.int({ min: 0, max: 100 })
  const support = faker.number.int({ min: 0, max: 50 })
  const love = faker.number.int({ min: 0, max: 80 })
  const insightful = faker.number.int({ min: 0, max: 60 })
  const funny = faker.number.int({ min: 0, max: 30 })

  return {
    like,
    celebrate,
    support,
    love,
    insightful,
    funny,
    total: like + celebrate + support + love + insightful + funny,
  }
}

function createPollOptions(): PollOption[] {
  const optionCount = faker.number.int({ min: 2, max: 4 })
  return Array.from({ length: optionCount }, (_, i) => ({
    id: `option-${i}`,
    text: faker.lorem.words({ min: 2, max: 5 }),
    votes: faker.number.int({ min: 10, max: 500 }),
  }))
}

function createPost(id: number, author: User): Post {
  const postType = faker.helpers.arrayElement([
    "text", "text", "text", // More weight to text posts
    "article",
    "job-share",
    "celebration",
    "poll",
  ] as const)

  const base = {
    id: `post-${id}` as PostId,
    author,
    content: faker.helpers.arrayElement([
      faker.lorem.paragraph(),
      `Excited to share that ${faker.lorem.sentence()}`,
      `Just finished ${faker.lorem.words(3)}. Here are my key takeaways:\n\n1. ${faker.lorem.sentence()}\n2. ${faker.lorem.sentence()}\n3. ${faker.lorem.sentence()}`,
      `Hot take: ${faker.lorem.sentence()} Agree or disagree? 👇`,
      `Looking back on my journey in ${faker.helpers.arrayElement(INDUSTRIES)}, I've learned that ${faker.lorem.sentence()}`,
      `Quick tip for ${faker.helpers.arrayElement(["engineers", "product managers", "designers", "founders"])}: ${faker.lorem.sentence()}`,
    ]),
    reactions: createReactionCounts(),
    comments: faker.number.int({ min: 0, max: 150 }),
    shares: faker.number.int({ min: 0, max: 50 }),
    createdAt: faker.date.recent({ days: 14 }),
    userReaction: faker.helpers.maybe(() =>
      faker.helpers.arrayElement(["like", "celebrate", "support", "love", "insightful", "funny"] as ReactionType[])
    ),
    isBookmarked: faker.datatype.boolean({ probability: 0.05 }),
  }

  switch (postType) {
    case "text":
      return {
        ...base,
        type: "text",
        images: faker.datatype.boolean({ probability: 0.3 })
          ? Array.from(
              { length: faker.number.int({ min: 1, max: 4 }) },
              (_, i) => `https://picsum.photos/seed/${id}-${i}/600/400`
            )
          : undefined,
      }
    case "article":
      return {
        ...base,
        type: "article",
        articleTitle: faker.lorem.sentence(),
        articleImage: `https://picsum.photos/seed/${id}-article/800/400`,
        articleUrl: `https://medium.com/@${author.username}/${faker.helpers.slugify(faker.lorem.words(5))}`,
      }
    case "job-share":
      return {
        ...base,
        type: "job-share",
        content: `We're hiring! ${base.content}`,
        job: jobs[id % jobs.length] || createJob(id),
      }
    case "celebration":
      const celebrationType = faker.helpers.arrayElement([
        "work-anniversary", "new-job", "promotion", "birthday", "education"
      ] as const)
      return {
        ...base,
        type: "celebration",
        celebrationType,
        yearsAt: celebrationType === "work-anniversary"
          ? faker.number.int({ min: 1, max: 10 })
          : undefined,
        content: celebrationType === "work-anniversary"
          ? `Celebrating my anniversary at ${author.experience[0]?.company.name}! 🎉`
          : celebrationType === "new-job"
          ? `Thrilled to announce that I'm starting a new position as ${faker.person.jobTitle()}!`
          : celebrationType === "promotion"
          ? `Excited to share that I've been promoted to ${faker.person.jobTitle()}! 🚀`
          : celebrationType === "education"
          ? `Just completed my ${faker.helpers.arrayElement(["certification", "course", "degree"])} in ${faker.helpers.arrayElement(["Data Science", "Cloud Computing", "Product Management"])}! 📚`
          : `Thanks for the birthday wishes everyone! 🎂`,
      }
    case "poll":
      const pollOptions = createPollOptions()
      return {
        ...base,
        type: "poll",
        content: faker.helpers.arrayElement([
          "What's your preferred tech stack for new projects?",
          "How do you prefer to work?",
          "What's the most important skill for career growth?",
          "Best way to learn a new technology?",
        ]),
        pollOptions,
        pollEndDate: faker.date.future({ years: 0.1 }),
        totalVotes: pollOptions.reduce((sum, opt) => sum + opt.votes, 0),
        userVote: faker.helpers.maybe(() =>
          faker.helpers.arrayElement(pollOptions).id
        ),
      }
  }
}

// ============ Job Generation ============

function createJob(id: number): Job {
  const company = faker.helpers.arrayElement(companies)
  const titles = [
    "Senior Software Engineer", "Product Manager", "Data Scientist",
    "DevOps Engineer", "Frontend Developer", "Backend Engineer",
    "Full Stack Developer", "Engineering Manager", "Staff Engineer",
    "Principal Engineer", "Solutions Architect", "Technical Lead"
  ]

  return {
    id: `job-${id}` as JobId,
    title: faker.helpers.arrayElement(titles),
    company,
    location: faker.location.city() + ", " + faker.location.state({ abbreviated: true }),
    workplaceType: faker.helpers.arrayElement(["remote", "hybrid", "on-site"] as const),
    employmentType: faker.helpers.arrayElement(["full-time", "part-time", "contract", "internship"] as const),
    salary: faker.datatype.boolean({ probability: 0.6 })
      ? {
          min: faker.number.int({ min: 80000, max: 150000 }),
          max: faker.number.int({ min: 150000, max: 300000 }),
          currency: "USD",
        }
      : undefined,
    description: faker.lorem.paragraphs(3),
    requirements: Array.from({ length: faker.number.int({ min: 3, max: 6 }) }, () =>
      faker.lorem.sentence()
    ),
    postedAt: faker.date.recent({ days: 30 }),
    applicants: faker.number.int({ min: 5, max: 500 }),
    isEasyApply: faker.datatype.boolean({ probability: 0.7 }),
    isSaved: faker.datatype.boolean({ probability: 0.1 }),
  }
}

// Generate jobs first (needed for job-share posts)
export const jobs: Job[] = Array.from({ length: 50 }, (_, i) => createJob(i))

// Generate posts
export const posts: Post[] = Array.from({ length: 100 }, (_, i) => {
  const randomUser = faker.helpers.arrayElement([currentUser, ...users])
  return createPost(i, randomUser)
}).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

// ============ Notification Generation ============

export const notifications: Notification[] = Array.from({ length: 25 }, (_, i) => {
  const type = faker.helpers.arrayElement([
    "connection-request",
    "connection-accepted",
    "reaction",
    "comment",
    "mention",
    "job-match",
    "profile-view",
  ] as const)

  const actor = faker.helpers.arrayElement(users)
  const userPosts = posts.filter(p => p.author.id === currentUser.id)
  const post = faker.helpers.arrayElement(userPosts.length > 0 ? userPosts : posts)

  const base = {
    id: `notification-${i}` as NotificationId,
    createdAt: faker.date.recent({ days: 7 }),
    read: faker.datatype.boolean({ probability: 0.5 }),
  }

  switch (type) {
    case "connection-request":
      return { ...base, type: "connection-request" as const, actor }
    case "connection-accepted":
      return { ...base, type: "connection-accepted" as const, actor }
    case "reaction":
      return {
        ...base,
        type: "reaction" as const,
        actor,
        post,
        reactionType: faker.helpers.arrayElement([
          "like", "celebrate", "support", "love", "insightful", "funny"
        ] as ReactionType[]),
      }
    case "comment":
      return {
        ...base,
        type: "comment" as const,
        actor,
        post,
        commentPreview: faker.lorem.sentence(),
      }
    case "mention":
      return { ...base, type: "mention" as const, actor, post }
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
        actor: faker.datatype.boolean({ probability: 0.7 }) ? actor : undefined,
        viewCount: faker.number.int({ min: 1, max: 50 }),
      }
  }
}).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

// ============ Conversations / Messages ============

function createMessage(conversationId: number, messageId: number, senderId: UserId): Message {
  return {
    id: `message-${conversationId}-${messageId}` as MessageId,
    senderId,
    content: faker.lorem.sentence(),
    createdAt: faker.date.recent({ days: 7 }),
    read: faker.datatype.boolean({ probability: 0.8 }),
  }
}

export const conversations: Conversation[] = users.slice(0, 8).map((user, i) => {
  const messageCount = faker.number.int({ min: 1, max: 10 })
  const messages = Array.from({ length: messageCount }, (_, j) => {
    const senderId = faker.datatype.boolean() ? currentUser.id : user.id
    return createMessage(i, j, senderId)
  }).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

  return {
    id: `conversation-${i}` as ConversationId,
    participant: user,
    messages,
    lastMessage: messages[messages.length - 1],
    unreadCount: faker.number.int({ min: 0, max: 3 }),
  }
})

// ============ Trending Topics ============

export const trendingTopics: TrendingTopic[] = [
  { id: "1", title: "AI in Enterprise: What's Working", category: "Technology", readers: 45000, timeAgo: "2h" },
  { id: "2", title: "Remote Work Policies Shift Again", category: "Workplace", readers: 32000, timeAgo: "4h" },
  { id: "3", title: "Tech Layoffs: Q1 2024 Analysis", category: "Industry", readers: 78000, timeAgo: "1h" },
  { id: "4", title: "The Rise of TypeScript in 2024", category: "Programming", readers: 23000, timeAgo: "3h" },
  { id: "5", title: "Leadership Lessons from Startup Failures", category: "Business", readers: 19000, timeAgo: "5h" },
]

// ============ Comments ============

export function createComment(postId: PostId, id: number): Comment {
  const author = faker.helpers.arrayElement(users)
  return {
    id: `comment-${postId}-${id}` as CommentId,
    author,
    content: faker.lorem.sentence(),
    createdAt: faker.date.recent({ days: 7 }),
    reactions: createReactionCounts(),
    userReaction: faker.helpers.maybe(() =>
      faker.helpers.arrayElement(["like", "celebrate", "support", "love", "insightful", "funny"] as ReactionType[])
    ),
    replies: faker.datatype.boolean({ probability: 0.3 })
      ? Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, (_, i) => ({
          id: `reply-${postId}-${id}-${i}` as CommentId,
          author: faker.helpers.arrayElement(users),
          content: faker.lorem.sentence(),
          createdAt: faker.date.recent({ days: 3 }),
          reactions: createReactionCounts(),
          userReaction: undefined,
          replies: [],
        }))
      : [],
  }
}

// ============ Helper Functions ============

export function getPostById(id: PostId): Post | undefined {
  return posts.find(p => p.id === id)
}

export function getPostsByUser(userId: UserId): Post[] {
  return posts.filter(p => p.author.id === userId)
}

export function getUserByUsername(username: string): User | undefined {
  if (username === currentUser.username) return currentUser
  return users.find(u => u.username === username)
}

export function getJobById(id: JobId): Job | undefined {
  return jobs.find(j => j.id === id)
}

export function getConnectionSuggestions(): User[] {
  return users
    .filter(u => u.connectionStatus === "none")
    .slice(0, 5)
}

export function getPendingConnections(): User[] {
  return users.filter(u => u.connectionStatus === "pending-received")
}

export function getBookmarkedPosts(): Post[] {
  return posts.filter(p => p.isBookmarked)
}

export function getCommentsForPost(postId: PostId): Comment[] {
  const post = getPostById(postId)
  if (!post) return []
  return Array.from({ length: Math.min(post.comments, 10) }, (_, i) => createComment(postId, i))
}
