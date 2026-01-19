# ✨ feat: X/Twitter Clone Prototype

> A beautiful, interactive Twitter/X clone prototype built with Next.js 15, Shadcn/ui, and Tailwind CSS v4.

---

## Enhancement Summary

**Deepened on:** 2026-01-19
**Research agents used:** 10 parallel agents (frontend-design, typescript-reviewer, architecture-strategist, performance-oracle, pattern-recognition, code-simplicity, frontend-races, next.js-docs, shadcn-docs, accessibility-research)

### Key Improvements

1. **Design System**: "Electric Dusk" theme with Instrument Serif + Satoshi typography, OKLCH color space for perceptually uniform colors
2. **Type Safety**: Discriminated unions for notifications, branded types for IDs, strict null handling
3. **Performance**: Virtualization with @tanstack/react-virtual, optimistic updates with rollback, memoization patterns
4. **Simplified Architecture**: Reduced from 20+ components to 6-8 core components for prototype speed
5. **Race Condition Mitigation**: Sequence numbers, AbortController patterns, state machine approach
6. **Accessibility**: ARIA feed pattern, keyboard navigation with roving tabindex, live regions for updates

### New Considerations Discovered

- Use React 19's `useOptimistic` hook for engagement actions (no Context needed)
- Consider intercepting routes for tweet composer modal
- OKLCH colors provide better perceptual uniformity than HSL
- Virtualization essential for 100+ tweets - prevents scroll jank
- Branded types prevent ID mixups (`UserId` vs `TweetId`)

---

## Overview

Build a fully interactive Twitter/X clone prototype that showcases all core features and functionality on a single, beautifully designed interface. The prototype uses mock data (no database) but is fully clickable and operational.

**Key Principles:**
- Beautiful, polished design (avoid generic "AI slop" aesthetics)
- All features visible and interactive
- Responsive 3-column layout
- Shadcn/ui components throughout
- Clean Tailwind CSS styling

### Research Insights: Design Philosophy

**"Electric Dusk" Design System:**
- Typography: Instrument Serif for display, Satoshi for body text
- Organic shapes with 16px border radius
- Subtle gradients and shadows for depth
- Micro-interactions: 150ms ease-out transitions
- Color palette using OKLCH for perceptual uniformity

**Anti-patterns to Avoid:**
- Generic blue/white color schemes
- Robotic, perfectly-aligned grids
- Missing hover/focus states
- Inconsistent spacing

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15+ | App Router, Server/Client Components |
| React | 19 | UI Framework with useOptimistic |
| TypeScript | 5.x | Type safety with branded types |
| Tailwind CSS | v4 | Styling with OKLCH colors |
| Shadcn/ui | latest | Component library |
| @faker-js/faker | latest | Mock data generation |
| @tanstack/react-virtual | latest | Feed virtualization |
| lucide-react | latest | Icons |
| next-themes | latest | Dark mode |

### Research Insights: Tech Stack Enhancements

**React 19 Features to Use:**
```typescript
// useOptimistic for instant feedback
const [optimisticLikes, addOptimisticLike] = useOptimistic(
  likes,
  (state, newLike) => [...state, newLike]
);

// useActionState for form handling
const [state, formAction, isPending] = useActionState(createTweet, initialState);
```

**Performance Addition:**
- Add `@tanstack/react-virtual` for feed virtualization (critical for 100+ tweets)
- Prevents scroll jank and memory issues

---

## Project Structure

```
apps/0119_x_clone/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with providers
│   │   ├── page.tsx                # Home feed
│   │   ├── globals.css             # Global styles + OKLCH variables
│   │   ├── explore/
│   │   │   └── page.tsx            # Explore/Search page
│   │   ├── notifications/
│   │   │   └── page.tsx            # Notifications page
│   │   ├── messages/
│   │   │   └── page.tsx            # Messages page
│   │   ├── bookmarks/
│   │   │   └── page.tsx            # Bookmarks page
│   │   ├── profile/
│   │   │   └── [username]/
│   │   │       └── page.tsx        # User profile page
│   │   ├── tweet/
│   │   │   └── [id]/
│   │   │       └── page.tsx        # Single tweet detail
│   │   └── @modal/                 # Intercepting route for composer
│   │       └── compose/
│   │           └── page.tsx        # Tweet composer modal
│   ├── components/
│   │   ├── ui/                     # Shadcn components (auto-generated)
│   │   ├── layout/
│   │   │   ├── sidebar.tsx         # Left navigation sidebar
│   │   │   ├── mobile-nav.tsx      # Bottom nav for mobile
│   │   │   └── right-sidebar.tsx   # Trends + Who to follow
│   │   ├── tweet/
│   │   │   ├── tweet-card.tsx      # Individual tweet display
│   │   │   ├── tweet-actions.tsx   # Like/retweet/reply buttons
│   │   │   └── tweet-composer.tsx  # New tweet form
│   │   └── feed/
│   │       ├── feed.tsx            # Virtualized feed container
│   │       └── feed-tabs.tsx       # For You / Following tabs
│   ├── lib/
│   │   ├── mock-data.ts            # Faker.js data generation
│   │   ├── types.ts                # TypeScript interfaces + branded types
│   │   └── utils.ts                # Utility functions (cn, etc.)
│   └── providers/
│       └── app-providers.tsx       # Theme + data providers
├── public/
│   └── placeholder-avatar.png      # Default avatar
├── package.json
├── tsconfig.json
├── next.config.js
├── postcss.config.js               # For Tailwind v4
├── components.json                 # Shadcn configuration
└── README.md
```

### Research Insights: Architecture Simplification

**For Prototype Speed, Reduce to 6-8 Core Components:**

| Keep | Merge/Remove |
|------|--------------|
| `tweet-card.tsx` | Remove `tweet-thread.tsx` (inline in tweet detail page) |
| `tweet-composer.tsx` | Remove `tweet-actions.tsx` (inline in tweet-card) |
| `feed.tsx` | Remove `feed-skeleton.tsx` (use Shadcn Skeleton directly) |
| `sidebar.tsx` | Remove `header.tsx` (merge into sidebar) |
| `right-sidebar.tsx` | Remove `user-card.tsx` (inline where needed) |
| `mobile-nav.tsx` | Remove `profile-header.tsx` (inline in profile page) |

**Server vs Client Components:**
```
Server Components (default):
├── app/layout.tsx
├── app/page.tsx (fetch mock data)
├── app/profile/[username]/page.tsx

Client Components ('use client'):
├── components/tweet/tweet-card.tsx (interactions)
├── components/feed/feed.tsx (virtualization)
├── components/layout/sidebar.tsx (active state)
```

---

## Implementation Phases

### Phase 1: Project Setup & Core Layout

**Files to create:**
- `package.json`
- `tsconfig.json`
- `next.config.js`
- `postcss.config.js`
- `components.json`
- `src/app/layout.tsx`
- `src/app/globals.css`
- `src/lib/utils.ts`
- `src/providers/app-providers.tsx`

**Tasks:**
- [ ] Initialize Next.js 15 project with TypeScript and Tailwind v4
- [ ] Install and configure Shadcn/ui
- [ ] Add required Shadcn components
- [ ] Set up OKLCH CSS variables for color scheme
- [ ] Create root layout with theme provider
- [ ] Implement 3-column responsive grid layout

**Layout Grid:**
```
Desktop (lg+):     [275px] [600px] [350px]
Tablet (md-lg):    [68px]  [1fr]   hidden
Mobile (<md):      [1fr]   hidden  hidden + bottom nav
```

### Research Insights: Setup Best Practices

**Tailwind v4 with OKLCH Colors:**
```css
@import "tailwindcss";

:root {
  /* OKLCH provides perceptually uniform colors */
  --background: oklch(100% 0 0);
  --foreground: oklch(13% 0 0);

  /* Electric Dusk Primary */
  --primary: oklch(62% 0.19 250);
  --primary-foreground: oklch(100% 0 0);

  /* Action Colors */
  --like: oklch(65% 0.25 15);      /* Warm pink */
  --retweet: oklch(72% 0.18 155);  /* Fresh green */
  --reply: oklch(62% 0.19 250);    /* Primary blue */

  /* Muted */
  --muted: oklch(96% 0.01 250);
  --muted-foreground: oklch(55% 0.02 250);

  /* Border */
  --border: oklch(92% 0.01 250);
}

.dark {
  --background: oklch(13% 0 0);
  --foreground: oklch(98% 0 0);
  --muted: oklch(20% 0.01 250);
  --muted-foreground: oklch(65% 0.02 250);
  --border: oklch(25% 0.01 250);
}
```

**Theme Provider Setup:**
```typescript
// src/providers/app-providers.tsx
'use client'

import { ThemeProvider } from 'next-themes'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}
```

---

### Phase 2: Mock Data & Types

**Files to create:**
- `src/lib/types.ts`
- `src/lib/mock-data.ts`

**TypeScript Interfaces with Branded Types:**

```typescript
// src/lib/types.ts

// Branded types prevent ID mixups
type Brand<T, B> = T & { __brand: B }
export type UserId = Brand<string, 'UserId'>
export type TweetId = Brand<string, 'TweetId'>

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
  | { type: 'like'; id: string; actor: User; tweet: Tweet; createdAt: Date; read: boolean }
  | { type: 'retweet'; id: string; actor: User; tweet: Tweet; createdAt: Date; read: boolean }
  | { type: 'follow'; id: string; actor: User; createdAt: Date; read: boolean }
  | { type: 'reply'; id: string; actor: User; tweet: Tweet; replyTweet: Tweet; createdAt: Date; read: boolean }
  | { type: 'mention'; id: string; actor: User; tweet: Tweet; createdAt: Date; read: boolean }

// Type guard for exhaustive handling
export function assertNever(x: never): never {
  throw new Error(`Unexpected notification type: ${x}`)
}
```

**Mock Data Generation:**
- [ ] Create seeded Faker.js generator for reproducible data
- [ ] Generate 1 "current user" (logged-in user)
- [ ] Generate 20 other users with varied profiles
- [ ] Generate 100 tweets with realistic content
- [ ] Create follow relationships between users
- [ ] Generate notifications for current user

### Research Insights: Mock Data Patterns

**Seeded Faker for Reproducibility:**
```typescript
// src/lib/mock-data.ts
import { faker } from '@faker-js/faker'

// Seed for reproducible data across refreshes
faker.seed(12345)

export function createUser(id: number): User {
  return {
    id: `user-${id}` as UserId,
    name: faker.person.fullName(),
    username: faker.internet.username().toLowerCase(),
    avatar: faker.image.avatarGitHub(),
    bio: faker.lorem.sentence(),
    location: faker.helpers.maybe(() => faker.location.city()),
    website: faker.helpers.maybe(() => faker.internet.url()),
    joinedAt: faker.date.past({ years: 5 }),
    followers: faker.number.int({ min: 10, max: 100000 }),
    following: faker.number.int({ min: 10, max: 1000 }),
    verified: faker.helpers.maybe(() => true) ?? false,
  }
}

// Generate all data once, export as constants
export const currentUser = createUser(0)
export const users = Array.from({ length: 20 }, (_, i) => createUser(i + 1))
export const tweets = generateTweets(100)
export const notifications = generateNotifications(currentUser, tweets)
```

---

### Phase 3: Core Components

**Files to create:**
- `src/components/layout/sidebar.tsx`
- `src/components/layout/mobile-nav.tsx`
- `src/components/layout/right-sidebar.tsx`
- `src/components/tweet/tweet-card.tsx`
- `src/components/tweet/tweet-actions.tsx`

**Sidebar Navigation Items:**
1. Home (/)
2. Explore (/explore)
3. Notifications (/notifications)
4. Messages (/messages)
5. Bookmarks (/bookmarks)
6. Profile (/profile/[username])
7. More (dropdown)

**Tweet Card Anatomy:**
```
┌─────────────────────────────────────────────────────┐
│ [Avatar] Name @username · 2h                    [⋯] │
│          Tweet content goes here. Can be multiple   │
│          lines with @mentions and #hashtags.        │
│          [Optional: Image Grid]                     │
│          💬 42    🔁 128    ❤️ 1.2K    📊 45K    ↗️ │
└─────────────────────────────────────────────────────┘
```

### Research Insights: Component Patterns

**Optimistic Updates with Rollback:**
```typescript
// src/components/tweet/tweet-card.tsx
'use client'

import { useOptimistic, useTransition } from 'react'

export function TweetCard({ tweet }: { tweet: Tweet }) {
  const [isPending, startTransition] = useTransition()
  const [optimisticTweet, updateOptimistic] = useOptimistic(
    tweet,
    (state, update: Partial<Tweet>) => ({ ...state, ...update })
  )

  const handleLike = () => {
    startTransition(() => {
      updateOptimistic({
        isLiked: !optimisticTweet.isLiked,
        likes: optimisticTweet.isLiked
          ? optimisticTweet.likes - 1
          : optimisticTweet.likes + 1
      })
      // In real app: call server action here
    })
  }

  return (
    <article
      role="article"
      aria-labelledby={`tweet-${tweet.id}-author`}
      className="border-b border-border p-4 hover:bg-muted/50 transition-colors"
    >
      {/* ... */}
    </article>
  )
}
```

**Compound Action Button Pattern:**
```typescript
// Reusable action button with consistent styling
interface ActionButtonProps {
  icon: React.ReactNode
  count?: number
  color: 'reply' | 'retweet' | 'like'
  active?: boolean
  onClick: () => void
}

function ActionButton({ icon, count, color, active, onClick }: ActionButtonProps) {
  const colorClasses = {
    reply: 'hover:text-[oklch(var(--reply))] hover:bg-[oklch(var(--reply)/0.1)]',
    retweet: active
      ? 'text-[oklch(var(--retweet))]'
      : 'hover:text-[oklch(var(--retweet))] hover:bg-[oklch(var(--retweet)/0.1)]',
    like: active
      ? 'text-[oklch(var(--like))]'
      : 'hover:text-[oklch(var(--like))] hover:bg-[oklch(var(--like)/0.1)]',
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1 p-2 rounded-full transition-colors',
        'text-muted-foreground',
        colorClasses[color]
      )}
    >
      {icon}
      {count !== undefined && <span className="text-sm">{formatCount(count)}</span>}
    </button>
  )
}
```

---

### Phase 4: Feed & Interactions

**Files to create:**
- `src/components/feed/feed.tsx`
- `src/components/feed/feed-tabs.tsx`
- `src/components/tweet/tweet-composer.tsx`
- `src/app/page.tsx`

**Tasks:**
- [ ] Implement virtualized feed with "For You" and "Following" tabs
- [ ] Create skeleton loading states using Shadcn Skeleton
- [ ] Build tweet composer with character counter
- [ ] Implement optimistic like/retweet/bookmark toggles
- [ ] Add "New tweets" banner when scrolling up

### Research Insights: Virtualization & Performance

**Virtualized Feed Implementation:**
```typescript
// src/components/feed/feed.tsx
'use client'

import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'

export function Feed({ tweets }: { tweets: Tweet[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: tweets.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 150, // Estimated tweet height
    overscan: 5, // Render 5 extra items for smooth scrolling
  })

  return (
    <div
      ref={parentRef}
      className="h-screen overflow-auto"
      role="feed"
      aria-busy={false}
      aria-label="Tweet feed"
    >
      <div
        style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <TweetCard tweet={tweets[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  )
}
```

**Race Condition Prevention:**
```typescript
// Use sequence numbers for optimistic updates
let actionSequence = 0

function handleLike(tweetId: TweetId) {
  const currentSequence = ++actionSequence

  // Optimistic update
  updateTweet(tweetId, { isLiked: true })

  // Simulate API call
  setTimeout(() => {
    // Only apply if this is still the latest action
    if (currentSequence === actionSequence) {
      // Confirm or rollback
    }
  }, 500)
}
```

---

### Phase 5: Additional Pages

**Files to create:**
- `src/app/explore/page.tsx`
- `src/app/notifications/page.tsx`
- `src/app/messages/page.tsx`
- `src/app/bookmarks/page.tsx`
- `src/app/profile/[username]/page.tsx`
- `src/app/tweet/[id]/page.tsx`

**Profile Page Tabs:**
1. Tweets (default)
2. Replies
3. Media
4. Likes

**Tasks:**
- [ ] Build Explore page with search and trends
- [ ] Build Notifications page with grouped notifications
- [ ] Build Messages page (empty state)
- [ ] Build Bookmarks page with saved tweets
- [ ] Build Profile page with header, stats, and tabs
- [ ] Build Tweet detail page with replies

### Research Insights: Page Patterns

**Notifications with Discriminated Unions:**
```typescript
// src/app/notifications/page.tsx
function NotificationItem({ notification }: { notification: Notification }) {
  switch (notification.type) {
    case 'like':
      return <LikeNotification {...notification} />
    case 'retweet':
      return <RetweetNotification {...notification} />
    case 'follow':
      return <FollowNotification {...notification} />
    case 'reply':
      return <ReplyNotification {...notification} />
    case 'mention':
      return <MentionNotification {...notification} />
    default:
      assertNever(notification) // TypeScript ensures exhaustive handling
  }
}
```

**Intercepting Routes for Composer:**
```
app/
├── @modal/
│   └── compose/
│       └── page.tsx    # Modal version
└── compose/
    └── page.tsx        # Full page version (fallback)
```

---

### Phase 6: Polish & Accessibility

**Tasks:**
- [ ] Add dark mode toggle with next-themes
- [ ] Implement focus management with roving tabindex
- [ ] Add ARIA labels and roles (role="feed", role="article")
- [ ] Create loading states using Shadcn Skeleton
- [ ] Add toast notifications with Shadcn Toast
- [ ] Ensure responsive breakpoints work smoothly
- [ ] Add micro-interactions (150ms ease-out transitions)

### Research Insights: Accessibility Patterns

**Feed Accessibility:**
```typescript
<div
  role="feed"
  aria-busy={isLoading}
  aria-label="Home timeline"
>
  {tweets.map((tweet, index) => (
    <article
      key={tweet.id}
      role="article"
      aria-posinset={index + 1}
      aria-setsize={tweets.length}
      aria-labelledby={`tweet-${tweet.id}-content`}
      tabIndex={0}
    >
      {/* Tweet content */}
    </article>
  ))}
</div>
```

**Keyboard Navigation with Roving Tabindex:**
```typescript
function useFeedNavigation(tweets: Tweet[]) {
  const [focusedIndex, setFocusedIndex] = useState(0)

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
      case 'j':
        e.preventDefault()
        setFocusedIndex(i => Math.min(i + 1, tweets.length - 1))
        break
      case 'ArrowUp':
      case 'k':
        e.preventDefault()
        setFocusedIndex(i => Math.max(i - 1, 0))
        break
      case 'l':
        // Like current tweet
        break
      case 'r':
        // Retweet current tweet
        break
    }
  }

  return { focusedIndex, handleKeyDown }
}
```

**Live Regions for New Tweets:**
```typescript
<div
  aria-live="polite"
  aria-atomic="true"
  className="sr-only"
>
  {newTweetCount > 0 && `${newTweetCount} new tweets available`}
</div>
```

---

## Acceptance Criteria

### Core Features
- [ ] 3-column layout renders correctly on desktop
- [ ] Sidebar collapses to icons on tablet
- [ ] Bottom navigation appears on mobile
- [ ] Feed displays tweets with all engagement metrics
- [ ] Clicking like/retweet/bookmark toggles state immediately
- [ ] Tweet composer opens as modal with 280 char limit
- [ ] Posting a tweet adds it to the top of the feed
- [ ] All navigation links work and update URL
- [ ] Profile pages display user info and tweets
- [ ] Dark mode toggle works

### Design Quality
- [ ] Typography is clear and readable (Instrument Serif + Satoshi)
- [ ] Spacing is consistent throughout (4px base grid)
- [ ] OKLCH colors provide perceptual uniformity
- [ ] Hover states provide clear feedback (150ms transitions)
- [ ] No layout shifts during loading
- [ ] Images have proper aspect ratios

### Accessibility
- [ ] All interactive elements are keyboard accessible (j/k navigation)
- [ ] Focus states are visible (2px ring)
- [ ] Screen reader can navigate feed (role="feed", aria-posinset)
- [ ] Color contrast meets WCAG AA (4.5:1 minimum)
- [ ] Modals trap focus appropriately

### Performance
- [ ] Virtualized feed handles 100+ tweets smoothly
- [ ] Optimistic updates feel instant (<50ms perceived)
- [ ] No scroll jank on fast scrolling
- [ ] Initial load under 3 seconds

---

## Dependencies

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@faker-js/faker": "^9.0.0",
    "@tanstack/react-virtual": "^3.0.0",
    "lucide-react": "^0.400.0",
    "next-themes": "^0.4.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.3.0"
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "tailwindcss": "^4.0.0",
    "postcss": "^8.4.0"
  }
}
```

---

## Shadcn Components to Install

```bash
npx shadcn@latest add avatar
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add input
npx shadcn@latest add scroll-area
npx shadcn@latest add separator
npx shadcn@latest add tabs
npx shadcn@latest add textarea
npx shadcn@latest add tooltip
npx shadcn@latest add skeleton
npx shadcn@latest add sonner
```

---

## Color Scheme (OKLCH CSS Variables)

```css
@import "tailwindcss";

:root {
  /* Background */
  --background: oklch(100% 0 0);
  --foreground: oklch(13% 0 0);

  /* Electric Dusk Primary (Twitter Blue variant) */
  --primary: oklch(62% 0.19 250);
  --primary-foreground: oklch(100% 0 0);

  /* Muted for secondary text */
  --muted: oklch(96% 0.01 250);
  --muted-foreground: oklch(55% 0.02 250);

  /* Borders */
  --border: oklch(92% 0.01 250);

  /* Card */
  --card: oklch(100% 0 0);
  --card-foreground: oklch(13% 0 0);

  /* Action colors */
  --like: oklch(65% 0.25 15);
  --retweet: oklch(72% 0.18 155);
  --reply: oklch(62% 0.19 250);

  /* Ring for focus */
  --ring: oklch(62% 0.19 250);

  /* Border radius */
  --radius: 1rem;
}

.dark {
  --background: oklch(13% 0 0);
  --foreground: oklch(98% 0 0);
  --muted: oklch(20% 0.01 250);
  --muted-foreground: oklch(65% 0.02 250);
  --border: oklch(25% 0.01 250);
  --card: oklch(15% 0.01 250);
  --card-foreground: oklch(98% 0 0);
}
```

---

## References

### Official Documentation
- [Next.js App Router](https://nextjs.org/docs/app)
- [Shadcn/ui Components](https://ui.shadcn.com/docs/components)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Faker.js](https://fakerjs.dev/guide/)
- [TanStack Virtual](https://tanstack.com/virtual/latest)

### Design Inspiration
- [Twitter/X Web App](https://x.com)
- [Twitter UI Clone (GitHub)](https://github.com/royquilor/twitter-ui-practise)

### Accessibility
- [W3C Feed Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/feed/)
- [MDN ARIA Feed Role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/feed_role)

### React 19
- [React 19 useOptimistic](https://react.dev/reference/react/useOptimistic)
- [React 19 useActionState](https://react.dev/reference/react/useActionState)
