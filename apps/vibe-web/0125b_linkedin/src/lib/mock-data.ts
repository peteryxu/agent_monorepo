import { faker } from '@faker-js/faker'
import {
  type User,
  type Company,
  type Post,
  type PostId,
  type Job,
  type Notification,
  type Comment,
  type Experience,
  type Education,
  type Skill,
  type ReactionType,
  type ReactionSummary,
  type CelebrationType,
  type CompanySize,
  type JobType,
  type WorkplaceType,
  type ExperienceLevel,
  type PollOption,
  createUserId,
  createCompanyId,
  createPostId,
  createJobId,
  createNotificationId,
  createCommentId,
} from './types'

// Seed faker for reproducible data
faker.seed(12345)

// =============================================================================
// Helper Functions
// =============================================================================

const randomItem = <T>(items: readonly T[]): T => items[Math.floor(faker.number.float() * items.length)]

const randomItems = <T>(items: T[], min: number, max: number): T[] => {
  const count = faker.number.int({ min, max })
  const shuffled = [...items].sort(() => faker.number.float() - 0.5)
  return shuffled.slice(0, count)
}

const generateReactionSummary = (): ReactionSummary[] => {
  const reactionTypes: ReactionType[] = ['like', 'celebrate', 'support', 'love', 'insightful', 'funny']
  const numReactionTypes = faker.number.int({ min: 1, max: 4 })
  const selectedTypes = randomItems(reactionTypes, 1, numReactionTypes)

  return selectedTypes.map(type => ({
    type,
    count: faker.number.int({ min: 1, max: 500 }),
  }))
}

const pastDate = (days: number = 30): Date => {
  return faker.date.recent({ days })
}

// =============================================================================
// Tech Industry Data
// =============================================================================

const techCompanyNames = [
  'TechFlow', 'DataSync', 'CloudNine', 'NeuralPath', 'QuantumLeap',
  'ByteForge', 'CodeCraft', 'PixelPerfect', 'AIVentures', 'CyberCore',
  'InnovateTech', 'FutureStack', 'DevOps Pro', 'AgileWorks', 'SmartScale'
]

const techJobTitles = [
  'Software Engineer', 'Senior Software Engineer', 'Staff Engineer',
  'Engineering Manager', 'Product Manager', 'Data Scientist',
  'Machine Learning Engineer', 'DevOps Engineer', 'Frontend Developer',
  'Backend Developer', 'Full Stack Developer', 'Solutions Architect',
  'Technical Program Manager', 'UX Designer', 'UI Engineer'
]

const techSkills = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java',
  'Go', 'Rust', 'AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes',
  'Machine Learning', 'Data Analysis', 'SQL', 'PostgreSQL', 'MongoDB',
  'GraphQL', 'REST APIs', 'CI/CD', 'Agile', 'Scrum', 'Leadership'
]

const industries = [
  'Technology', 'Software Development', 'Information Technology',
  'Financial Services', 'Healthcare', 'E-commerce', 'Education',
  'Artificial Intelligence', 'Cybersecurity', 'Cloud Computing'
]

const universities = [
  'Stanford University', 'MIT', 'UC Berkeley', 'Carnegie Mellon University',
  'Georgia Tech', 'University of Washington', 'Cornell University',
  'University of Michigan', 'UCLA', 'UT Austin', 'Harvard University',
  'Princeton University', 'Columbia University', 'Yale University'
]

const degrees = [
  'Bachelor of Science', 'Master of Science', 'Bachelor of Arts',
  'Master of Business Administration', 'Doctor of Philosophy'
]

const fieldsOfStudy = [
  'Computer Science', 'Software Engineering', 'Electrical Engineering',
  'Data Science', 'Information Systems', 'Mathematics', 'Physics',
  'Business Administration', 'Economics'
]

// =============================================================================
// User Generator
// =============================================================================

export function generateUser(id?: string): User {
  const userId = createUserId(id || faker.string.uuid())
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()

  const numExperiences = faker.number.int({ min: 1, max: 5 })
  const experience: Experience[] = []
  let currentYear = new Date().getFullYear()

  for (let i = 0; i < numExperiences; i++) {
    const startYear = currentYear - faker.number.int({ min: 1, max: 3 })
    const isCurrent = i === 0
    const endYear = isCurrent ? undefined : currentYear

    experience.push({
      id: faker.string.uuid(),
      title: randomItem(techJobTitles),
      companyName: randomItem(techCompanyNames),
      companyLogo: `https://picsum.photos/seed/${faker.string.alphanumeric(8)}/100/100`,
      location: faker.location.city() + ', ' + faker.location.state({ abbreviated: true }),
      startDate: new Date(startYear, faker.number.int({ min: 0, max: 11 }), 1),
      endDate: endYear ? new Date(endYear, faker.number.int({ min: 0, max: 11 }), 1) : undefined,
      isCurrent,
      description: faker.lorem.paragraph(),
      skills: randomItems(techSkills, 2, 5),
    })

    currentYear = startYear
  }

  const numEducation = faker.number.int({ min: 1, max: 2 })
  const education: Education[] = []
  let eduEndYear = experience[experience.length - 1]?.startDate.getFullYear() || new Date().getFullYear() - 5

  for (let i = 0; i < numEducation; i++) {
    const endYear = eduEndYear - faker.number.int({ min: 0, max: 2 })
    const startYear = endYear - faker.number.int({ min: 2, max: 4 })

    education.push({
      id: faker.string.uuid(),
      school: randomItem(universities),
      logo: `https://picsum.photos/seed/${faker.string.alphanumeric(8)}/100/100`,
      degree: randomItem(degrees),
      fieldOfStudy: randomItem(fieldsOfStudy),
      startYear,
      endYear,
      description: faker.datatype.boolean() ? faker.lorem.sentence() : undefined,
      activities: faker.datatype.boolean() ? faker.lorem.words(5) : undefined,
    })

    eduEndYear = startYear
  }

  const selectedSkills = randomItems(techSkills, 5, 15)
  const skills: Skill[] = selectedSkills.map(name => ({
    name,
    endorsements: faker.number.int({ min: 0, max: 99 }),
    endorsedBy: [],
  }))

  return {
    id: userId,
    name: `${firstName} ${lastName}`,
    headline: `${experience[0]?.title || randomItem(techJobTitles)} at ${experience[0]?.companyName || randomItem(techCompanyNames)}`,
    avatar: `https://i.pravatar.cc/150?u=${userId}`,
    coverImage: faker.datatype.boolean({ probability: 0.7 })
      ? `https://picsum.photos/seed/${faker.string.alphanumeric(8)}/1200/300`
      : undefined,
    location: faker.location.city() + ', ' + faker.location.state({ abbreviated: true }),
    connections: faker.number.int({ min: 50, max: 500 }),
    followers: faker.number.int({ min: 100, max: 10000 }),
    about: faker.datatype.boolean({ probability: 0.8 }) ? faker.lorem.paragraphs(2) : undefined,
    experience,
    education,
    skills,
    isOpenToWork: faker.datatype.boolean({ probability: 0.2 }),
    isHiring: faker.datatype.boolean({ probability: 0.15 }),
    pronouns: faker.datatype.boolean({ probability: 0.3 })
      ? randomItem(['he/him', 'she/her', 'they/them'])
      : undefined,
    website: faker.datatype.boolean({ probability: 0.4 })
      ? faker.internet.url()
      : undefined,
    email: faker.internet.email({ firstName, lastName }),
  }
}

// =============================================================================
// Company Generator
// =============================================================================

export function generateCompany(id?: string): Company {
  const companyId = createCompanyId(id || faker.string.uuid())
  const name = randomItem(techCompanyNames) + ' ' + faker.company.buzzNoun()

  const sizes: CompanySize[] = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5001-10000', '10001+']

  return {
    id: companyId,
    name,
    logo: `https://picsum.photos/seed/${companyId}/100/100`,
    coverImage: `https://picsum.photos/seed/${companyId}-cover/1200/300`,
    industry: randomItem(industries),
    size: randomItem(sizes),
    followers: faker.number.int({ min: 1000, max: 1000000 }),
    employees: faker.number.int({ min: 50, max: 50000 }),
    headquarters: faker.location.city() + ', ' + faker.location.state({ abbreviated: true }),
    founded: faker.number.int({ min: 1990, max: 2023 }),
    website: faker.internet.url(),
    about: faker.lorem.paragraphs(2),
    specialties: randomItems(techSkills, 3, 8),
  }
}

// =============================================================================
// Post Generator
// =============================================================================

export function generatePost(author: User, companies: Company[], jobs: Job[]): Post {
  const postId = createPostId(faker.string.uuid())
  const postTypes = ['text', 'article', 'job-share', 'celebration', 'poll'] as const
  const type = randomItem(postTypes)

  const basePost = {
    id: postId,
    authorId: author.id,
    createdAt: pastDate(14),
    reactions: generateReactionSummary(),
    totalReactions: faker.number.int({ min: 0, max: 2000 }),
    comments: faker.number.int({ min: 0, max: 150 }),
    reposts: faker.number.int({ min: 0, max: 50 }),
    views: faker.number.int({ min: 100, max: 50000 }),
  }

  switch (type) {
    case 'text': {
      const hasImages = faker.datatype.boolean({ probability: 0.4 })
      const numImages = hasImages ? faker.number.int({ min: 1, max: 4 }) : 0
      return {
        ...basePost,
        type: 'text',
        content: faker.lorem.paragraphs(faker.number.int({ min: 1, max: 3 })),
        images: Array.from({ length: numImages }, () =>
          `https://picsum.photos/seed/${faker.string.alphanumeric(8)}/800/600`
        ),
      }
    }

    case 'article':
      return {
        ...basePost,
        type: 'article',
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        url: faker.internet.url(),
        image: `https://picsum.photos/seed/${faker.string.alphanumeric(8)}/1200/630`,
      }

    case 'job-share': {
      const job = jobs.length > 0 ? randomItem(jobs) : null
      return {
        ...basePost,
        type: 'job-share',
        jobId: job?.id || createJobId(faker.string.uuid()),
        caption: faker.datatype.boolean({ probability: 0.7 })
          ? faker.lorem.sentence()
          : undefined,
      }
    }

    case 'celebration': {
      const celebrationTypes: CelebrationType[] = ['new-job', 'promotion', 'anniversary', 'birthday', 'work-anniversary']
      const celebrationType = randomItem(celebrationTypes)
      const company = companies.length > 0 ? randomItem(companies) : null
      return {
        ...basePost,
        type: 'celebration',
        celebrationType,
        content: faker.lorem.paragraph(),
        companyId: company?.id,
      }
    }

    case 'poll': {
      const numOptions = faker.number.int({ min: 2, max: 4 })
      const options: PollOption[] = Array.from({ length: numOptions }, () => ({
        id: faker.string.uuid(),
        text: faker.lorem.words(faker.number.int({ min: 2, max: 5 })),
        votes: faker.number.int({ min: 0, max: 500 }),
      }))
      const totalVotes = options.reduce((sum, opt) => sum + opt.votes, 0)
      return {
        ...basePost,
        type: 'poll',
        question: faker.lorem.sentence().replace('.', '?'),
        options,
        totalVotes,
        endDate: faker.date.soon({ days: 7 }),
      }
    }

    default: {
      // Exhaustive check - this should never happen
      const _exhaustive: never = type
      throw new Error(`Unknown post type: ${_exhaustive}`)
    }
  }
}

// =============================================================================
// Job Generator
// =============================================================================

export function generateJob(company: Company): Job {
  const jobId = createJobId(faker.string.uuid())

  const jobTypes: JobType[] = ['full-time', 'part-time', 'contract', 'internship', 'temporary']
  const workplaceTypes: WorkplaceType[] = ['on-site', 'hybrid', 'remote']
  const experienceLevels: ExperienceLevel[] = ['entry', 'associate', 'mid-senior', 'director', 'executive']

  const hasSalary = faker.datatype.boolean({ probability: 0.6 })
  const minSalary = faker.number.int({ min: 60000, max: 150000 })

  return {
    id: jobId,
    title: randomItem(techJobTitles),
    companyId: company.id,
    companyName: company.name,
    companyLogo: company.logo,
    location: faker.location.city() + ', ' + faker.location.state({ abbreviated: true }),
    workplaceType: randomItem(workplaceTypes),
    jobType: randomItem(jobTypes),
    experienceLevel: randomItem(experienceLevels),
    salary: hasSalary
      ? {
          min: minSalary,
          max: minSalary + faker.number.int({ min: 20000, max: 80000 }),
          currency: 'USD',
          period: 'yearly',
        }
      : undefined,
    postedAt: pastDate(30),
    applicants: faker.number.int({ min: 0, max: 500 }),
    isEasyApply: faker.datatype.boolean({ probability: 0.7 }),
    description: faker.lorem.paragraphs(3),
    requirements: Array.from(
      { length: faker.number.int({ min: 3, max: 7 }) },
      () => faker.lorem.sentence()
    ),
    benefits: Array.from(
      { length: faker.number.int({ min: 3, max: 6 }) },
      () => faker.lorem.words(faker.number.int({ min: 2, max: 4 }))
    ),
    skills: randomItems(techSkills, 3, 8),
    isSaved: faker.datatype.boolean({ probability: 0.1 }),
    hasApplied: faker.datatype.boolean({ probability: 0.05 }),
  }
}

// =============================================================================
// Notification Generator
// =============================================================================

export function generateNotification(forUser: User, allUsers: User[], posts: Post[], jobs: Job[]): Notification {
  const notificationId = createNotificationId(faker.string.uuid())
  const notificationTypes = [
    'connection-request',
    'connection-accepted',
    'like',
    'comment',
    'mention',
    'job-match',
    'profile-view',
  ] as const
  const type = randomItem(notificationTypes)

  const baseNotification = {
    id: notificationId,
    forUserId: forUser.id,
    createdAt: pastDate(7),
    read: faker.datatype.boolean({ probability: 0.3 }),
  }

  const otherUsers = allUsers.filter(u => u.id !== forUser.id)
  const randomUser = otherUsers.length > 0 ? randomItem(otherUsers) : forUser

  switch (type) {
    case 'connection-request':
      return {
        ...baseNotification,
        type: 'connection-request',
        fromUserId: randomUser.id,
      }

    case 'connection-accepted':
      return {
        ...baseNotification,
        type: 'connection-accepted',
        userId: randomUser.id,
      }

    case 'like': {
      const post = posts.length > 0 ? randomItem(posts) : null
      const reactionTypes: ReactionType[] = ['like', 'celebrate', 'support', 'love', 'insightful', 'funny']
      return {
        ...baseNotification,
        type: 'like',
        userId: randomUser.id,
        postId: post?.id || createPostId(faker.string.uuid()),
        reactionType: randomItem(reactionTypes),
      }
    }

    case 'comment': {
      const post = posts.length > 0 ? randomItem(posts) : null
      return {
        ...baseNotification,
        type: 'comment',
        userId: randomUser.id,
        postId: post?.id || createPostId(faker.string.uuid()),
        commentPreview: faker.lorem.sentence().slice(0, 100),
      }
    }

    case 'mention': {
      const post = posts.length > 0 ? randomItem(posts) : null
      return {
        ...baseNotification,
        type: 'mention',
        userId: randomUser.id,
        postId: post?.id || createPostId(faker.string.uuid()),
        commentId: faker.datatype.boolean({ probability: 0.5 })
          ? createCommentId(faker.string.uuid())
          : undefined,
      }
    }

    case 'job-match': {
      const job = jobs.length > 0 ? randomItem(jobs) : null
      return {
        ...baseNotification,
        type: 'job-match',
        jobId: job?.id || createJobId(faker.string.uuid()),
        matchScore: faker.number.int({ min: 70, max: 99 }),
      }
    }

    case 'profile-view': {
      const numNotable = faker.number.int({ min: 0, max: 3 })
      const notableViewers = randomItems(otherUsers, 0, numNotable).map(u => u.id)
      return {
        ...baseNotification,
        type: 'profile-view',
        viewerCount: faker.number.int({ min: 1, max: 50 }),
        notableViewers,
      }
    }
  }
}

// =============================================================================
// Comment Generator
// =============================================================================

export function generateComment(author: User, postId: PostId): Comment {
  const commentId = createCommentId(faker.string.uuid())

  return {
    id: commentId,
    postId,
    authorId: author.id,
    content: faker.lorem.sentences(faker.number.int({ min: 1, max: 3 })),
    createdAt: pastDate(7),
    reactions: generateReactionSummary(),
    totalReactions: faker.number.int({ min: 0, max: 50 }),
  }
}

// =============================================================================
// Pre-generated Data
// =============================================================================

// Generate users first
export const users: User[] = Array.from({ length: 20 }, () => generateUser())

// Generate companies
export const companies: Company[] = Array.from({ length: 10 }, () => generateCompany())

// Generate jobs (needs companies)
export const jobs: Job[] = companies.flatMap(company =>
  Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => generateJob(company))
).slice(0, 15)

// Generate posts (needs users, companies, and jobs)
export const posts: Post[] = Array.from({ length: 50 }, () => {
  const author = randomItem(users)
  return generatePost(author, companies, jobs)
})

// Generate notifications (needs users, posts, and jobs)
export const notifications: Notification[] = Array.from({ length: 30 }, () => {
  const forUser = randomItem(users)
  return generateNotification(forUser, users, posts, jobs)
})

// Generate comments for posts
export const comments: Comment[] = posts.flatMap(post => {
  const numComments = faker.number.int({ min: 0, max: 5 })
  return Array.from({ length: numComments }, () => {
    const author = randomItem(users)
    return generateComment(author, post.id)
  })
})

// =============================================================================
// Lookup Maps (for efficient data access)
// =============================================================================

export const usersById = new Map(users.map(u => [u.id, u]))
export const companiesById = new Map(companies.map(c => [c.id, c]))
export const postsById = new Map(posts.map(p => [p.id, p]))
export const jobsById = new Map(jobs.map(j => [j.id, j]))
export const commentsByPostId = new Map<PostId, Comment[]>()

comments.forEach(comment => {
  const existing = commentsByPostId.get(comment.postId) || []
  existing.push(comment)
  commentsByPostId.set(comment.postId, existing)
})

// =============================================================================
// Current User (for authenticated views)
// =============================================================================

export const currentUser = users[0]
