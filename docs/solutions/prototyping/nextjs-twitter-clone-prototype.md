---
title: "X/Twitter Clone Prototype with Next.js 15, React 19, and Shadcn/ui"
category: prototyping
tags:
  - nextjs-15
  - react-19
  - typescript
  - shadcn-ui
  - tailwind-css-v4
  - oklch-colors
  - useOptimistic
  - branded-types
  - discriminated-unions
  - virtualization
  - dark-mode
  - tanstack-virtual
  - monorepo
module: apps/0119_x_clone
requirement: |
  Build a fully interactive Twitter/X clone prototype showcasing all core
  social media features with beautiful, polished design using modern React patterns
solution_approach: |
  3-column responsive layout with React 19 useOptimistic for instant feedback,
  branded TypeScript types for safety, and OKLCH colors for perceptual uniformity
created: 2026-01-19
---

# X/Twitter Clone Prototype

A fully interactive Twitter/X clone prototype built with Next.js 15, React 19, Shadcn/ui, and Tailwind CSS v4.

## Problem / Requirement

Build a production-quality Twitter/X clone prototype that:
- Showcases modern React 19 patterns
- Uses beautiful, polished design (avoid generic "AI slop" aesthetics)
- Is fully clickable and operational with mock data
- Demonstrates responsive 3-column layout

## Solution Overview

### Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15+ | App Router, Server/Client Components |
| React | 19 | useOptimistic for instant feedback |
| TypeScript | 5.x | Branded types, discriminated unions |
| Tailwind CSS | v4 | OKLCH colors for perceptual uniformity |
| Shadcn/ui | latest | Component library (14 components) |
| @tanstack/react-virtual | 3.x | Feed virtualization |
| @faker-js/faker | 9.x | Seeded mock data |
| next-themes | 0.4.x | Dark mode support |

### Key Patterns

#### 1. Branded Types for ID Safety

Prevents mixing up `UserId` and `TweetId`:

```typescript
type Brand<T, B> = T & { __brand: B }
export type UserId = Brand<string, "UserId">
export type TweetId = Brand<string, "TweetId">

// TypeScript will error if you pass a TweetId where UserId is expected
```

#### 2. Optimistic Updates with React 19

Instant feedback without waiting for server:

```typescript
const [optimisticTweet, updateOptimistic] = useOptimistic(
  tweet,
  (state: Tweet, update: Partial<Tweet>) => ({ ...state, ...update })
)

const handleLike = () => {
  startTransition(() => {
    updateOptimistic({
      isLiked: !optimisticTweet.isLiked,
      likes: optimisticTweet.isLiked
        ? optimisticTweet.likes - 1
        : optimisticTweet.likes + 1,
    })
  })
}
```

#### 3. Discriminated Unions for Notifications

Type-safe notification handling with exhaustive checks:

```typescript
export type Notification =
  | { type: "like"; id: NotificationId; actor: User; tweet: Tweet; ... }
  | { type: "retweet"; id: NotificationId; actor: User; tweet: Tweet; ... }
  | { type: "follow"; id: NotificationId; actor: User; ... }
  | { type: "reply"; id: NotificationId; actor: User; tweet: Tweet; replyTweet: Tweet; ... }
  | { type: "mention"; id: NotificationId; actor: User; tweet: Tweet; ... }

// TypeScript ensures all cases are handled
function NotificationItem({ notification }: { notification: Notification }) {
  switch (notification.type) {
    case "like": return <LikeNotification {...notification} />
    case "retweet": return <RetweetNotification {...notification} />
    case "follow": return <FollowNotification {...notification} />
    case "reply": return <ReplyNotification {...notification} />
    case "mention": return <MentionNotification {...notification} />
    default: assertNever(notification) // Compile error if case missed
  }
}
```

#### 4. OKLCH Color Space

Perceptually uniform colors in Tailwind CSS v4:

```css
:root {
  --primary: oklch(62% 0.19 250);
  --like: oklch(65% 0.25 15);      /* Warm pink */
  --retweet: oklch(72% 0.18 155);  /* Fresh green */
  --reply: oklch(62% 0.19 250);    /* Primary blue */
}
```

#### 5. Virtualized Feed

Handle 100+ tweets without scroll jank:

```typescript
const virtualizer = useVirtualizer({
  count: tweets.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 200,
  overscan: 5,
})
```

#### 6. Seeded Mock Data

Reproducible data across page refreshes:

```typescript
import { faker } from "@faker-js/faker"
faker.seed(12345) // Same data every time

export const currentUser = createUser(0)
export const users = Array.from({ length: 20 }, (_, i) => createUser(i + 1))
export const tweets = generateTweets(100)
```

## Project Structure

```
apps/0119_x_clone/
├── src/
│   ├── app/                    # 7 pages (home, explore, notifications, etc.)
│   ├── components/
│   │   ├── ui/                 # 14 Shadcn components
│   │   ├── layout/             # Sidebar, MobileNav, RightSidebar
│   │   ├── tweet/              # TweetCard, TweetComposer
│   │   └── feed/               # Feed, FeedTabs
│   ├── lib/
│   │   ├── types.ts            # Branded types, discriminated unions
│   │   ├── mock-data.ts        # Faker.js generation
│   │   └── utils.ts            # cn(), formatCount(), formatRelativeTime()
│   └── providers/
│       └── app-providers.tsx   # ThemeProvider
```

## Best Practices Learned

### Do

- **Virtualize long lists** - Essential for 100+ items
- **Use useOptimistic** - Simpler than Context for local optimistic state
- **Seed mock data** - Reproducible development experience
- **Use branded types** - Catch ID mixups at compile time
- **OKLCH colors** - Better perceptual uniformity than HSL

### Don't

- **Don't over-engineer state** - useOptimistic > Context > Zustand > Redux for simple cases
- **Don't skip dark mode** - next-themes makes it trivial
- **Don't create 20+ components** - 6-8 core components sufficient for prototype
- **Don't use HSL for action colors** - OKLCH maintains consistent perceived brightness

## Files Created

- 34 TypeScript/TSX files
- ~2,500 lines of code
- 7 pages (home, explore, notifications, messages, bookmarks, profile, tweet detail)
- 14 Shadcn/ui components

## Related Documentation

- [Plan file](../../apps/0119_x_clone/plans/feat-x-clone-prototype.md)
- [Next.js App Router](https://nextjs.org/docs/app)
- [React 19 useOptimistic](https://react.dev/reference/react/useOptimistic)
- [Shadcn/ui](https://ui.shadcn.com)
- [TanStack Virtual](https://tanstack.com/virtual/latest)

## Running the Project

```bash
cd apps/0119_x_clone
npm install
npm run dev
```

Open http://localhost:3000
