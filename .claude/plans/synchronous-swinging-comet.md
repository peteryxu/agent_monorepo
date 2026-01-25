# X/Twitter Clone - Creative Implementation Plan

## Overview
Build an X/Twitter clone prototype at `/apps/vibe-web/0126_x_clone` with the "Electric Dusk" design system.

**Design Philosophy**: Electric Dusk - warm twilight palette, organic shapes, perceptually uniform OKLCH colors, j/k/l/r keyboard navigation as first-class feature.

---

## Architecture Approach: Feature Slice Architecture

Instead of organizing by component type, we organize by **feature slice** - each slice contains its own types, components, and logic. This keeps related code together and makes the codebase easier to navigate.

```
src/
├── app/                    # Next.js App Router pages
├── features/               # Feature slices (the heart of the app)
│   ├── tweet/             # Tweet feature slice
│   ├── feed/              # Feed feature slice
│   ├── profile/           # Profile feature slice
│   ├── notifications/     # Notifications feature slice
│   └── navigation/        # Navigation feature slice
├── shared/                # Truly shared code
│   ├── ui/                # Shadcn components
│   ├── lib/               # utils, cn, formatters
│   └── providers/         # Theme, etc.
└── data/                  # Mock data generation
    ├── seed.ts            # Faker seed & generators
    └── store.ts           # In-memory data store
```

---

## Phase 1: Foundation [SEQUENTIAL]

**Goal**: Bootable Next.js app with Electric Dusk theme

| Step | Task | Output |
|------|------|--------|
| 1.1 | `create-next-app` with TypeScript, Tailwind v4 | Empty Next.js 15 app |
| 1.2 | Configure Shadcn/ui with OKLCH variables | `globals.css` + `components.json` |
| 1.3 | Install 13 Shadcn components | `/shared/ui/*` |
| 1.4 | Create utility functions | `cn()`, `formatCount()`, `formatRelativeTime()` |
| 1.5 | Setup theme provider | `ThemeProvider` with dark mode |
| 1.6 | Create branded types | `UserId`, `TweetId` with Brand utility |

**Electric Dusk CSS Variables**:
```css
:root {
  --background: oklch(99% 0.005 250);
  --foreground: oklch(15% 0.01 250);
  --primary: oklch(58% 0.21 255);         /* Electric blue-purple */
  --like: oklch(62% 0.28 15);              /* Warm coral-pink */
  --retweet: oklch(68% 0.22 150);          /* Fresh teal-green */
  --reply: oklch(58% 0.21 255);            /* Matches primary */
  --accent: oklch(72% 0.15 55);            /* Sunset gold */
}
```

---

## Phase 2: Data Layer [PARALLEL with P3]

**Goal**: Seeded mock data with realistic Twitter content

| Step | Task | Notes |
|------|------|-------|
| 2.1 | Create `data/seed.ts` | Faker with seed 42069 for reproducibility |
| 2.2 | Generate user pool (25 users) | Include verified badges, varied follower counts |
| 2.3 | Generate tweet corpus (150 tweets) | Mix of text, threads, images, quotes |
| 2.4 | Create follow graph | currentUser follows ~40% of users |
| 2.5 | Generate notifications (5 types) | Discriminated union: like, retweet, follow, reply, mention |
| 2.6 | Create message threads (8 conversations) | For DM page |

**Discriminated Union Pattern for Notifications**:
```typescript
export type Notification =
  | { type: 'like'; actor: User; tweet: Tweet; createdAt: Date }
  | { type: 'retweet'; actor: User; tweet: Tweet; createdAt: Date }
  | { type: 'follow'; actor: User; createdAt: Date }
  | { type: 'reply'; actor: User; tweet: Tweet; reply: Tweet; createdAt: Date }
  | { type: 'mention'; actor: User; tweet: Tweet; createdAt: Date }
```

---

## Phase 3: Navigation Shell [PARALLEL with P2]

**Goal**: Working 3-column layout with navigation

| Step | Task | Notes |
|------|------|-------|
| 3.1 | Create `Sidebar` component | Logo, 7 nav items, Tweet button, profile footer |
| 3.2 | Create `MobileNav` component | Bottom nav with 5 icons |
| 3.3 | Create `RightSidebar` component | Search, Trends, Who to Follow |
| 3.4 | Create root `layout.tsx` | 3-column grid with responsive breakpoints |
| 3.5 | Add theme toggle | Moon/Sun icon in sidebar |

**Responsive Grid**:
```
Desktop (lg+):    [275px] [600px] [350px]
Tablet (md-lg):   [68px]  [1fr]   hidden
Mobile (<md):     [1fr]   hidden  hidden + bottom nav
```

---

## Phase 4: Tweet Feature Slice [CORE]

**Goal**: Fully interactive tweet card with all engagement actions

| Step | Task | Notes |
|------|------|-------|
| 4.1 | Create `TweetCard` component | Avatar, content, metadata, actions |
| 4.2 | Implement `useOptimistic` for likes | Instant feedback with rollback |
| 4.3 | Implement retweet toggle | Same pattern as likes |
| 4.4 | Implement bookmark toggle | Save for later |
| 4.5 | Add image grid (1-4 images) | 2x2 grid layout for multiple images |
| 4.6 | Create `TweetComposer` component | Textarea, character counter (280), media buttons |
| 4.7 | Add share/copy link action | Toast confirmation |

**useOptimistic Pattern**:
```typescript
const [optimistic, update] = useOptimistic(tweet, (state, action) => {
  if (action === 'like') {
    return { ...state, isLiked: !state.isLiked, likes: state.likes + (state.isLiked ? -1 : 1) }
  }
  return state
})
```

---

## Phase 5: Feed Feature Slice [DEPENDS ON P4]

**Goal**: Virtualized, keyboard-navigable feed

| Step | Task | Notes |
|------|------|-------|
| 5.1 | Install @tanstack/react-virtual | Feed virtualization |
| 5.2 | Create `VirtualFeed` component | Handles 150+ tweets smoothly |
| 5.3 | Add `FeedTabs` (For You / Following) | Tab state with URL sync |
| 5.4 | Implement `useFeedNavigation` hook | j/k for up/down, l for like, r for retweet |
| 5.5 | Add "New tweets" banner | Polite live region announcement |
| 5.6 | Create feed loading skeleton | Shimmer placeholders |

**Keyboard Navigation Hook**:
```typescript
function useFeedNavigation() {
  const [focusIndex, setFocusIndex] = useState(0)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'j') setFocusIndex(i => i + 1)
      if (e.key === 'k') setFocusIndex(i => Math.max(0, i - 1))
      if (e.key === 'l') likeTweet(focusIndex)
      if (e.key === 'r') retweetTweet(focusIndex)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [focusIndex])

  return { focusIndex, setFocusIndex }
}
```

---

## Phase 6: Home Page [DEPENDS ON P3, P5]

**Goal**: Complete home feed experience

| Step | Task | Notes |
|------|------|-------|
| 6.1 | Create `/app/page.tsx` | Compose + Feed + Tabs |
| 6.2 | Wire up tweet composer | Adds to top of feed (optimistic) |
| 6.3 | Add trending sidebar content | Mock trends data |
| 6.4 | Add "Who to Follow" suggestions | 3 user cards with Follow buttons |

---

## Phase 7: Secondary Pages [PARALLEL]

**All these can be built in parallel after Phase 4 completes**:

### 7A: Profile Page
- `/app/profile/[username]/page.tsx`
- Banner image, avatar, bio, stats (following/followers)
- Tabs: Tweets, Replies, Media, Likes
- Edit profile button (shows toast)

### 7B: Tweet Detail Page
- `/app/tweet/[id]/page.tsx`
- Full tweet with timestamp
- Reply thread (nested comments)
- Reply composer

### 7C: Explore Page
- `/app/explore/page.tsx`
- Search input (filters tweets)
- Trending topics grid
- Tab categories: For You, Trending, News, Sports, Entertainment

### 7D: Notifications Page
- `/app/notifications/page.tsx`
- Tabs: All, Mentions
- Notification cards with discriminated union rendering
- Group consecutive likes/retweets

### 7E: Messages Page
- `/app/messages/page.tsx`
- Conversation list (left)
- Message thread (right)
- Compose message input

### 7F: Bookmarks Page
- `/app/bookmarks/page.tsx`
- Saved tweets grid
- Clear all bookmarks button

---

## Phase 8: Polish & Accessibility [FINAL]

| Step | Task | Notes |
|------|------|-------|
| 8.1 | Add `role="feed"` and `aria-posinset` | ARIA feed pattern |
| 8.2 | Implement roving tabindex | Focus ring visibility |
| 8.3 | Add sr-only live regions | "5 new tweets available" |
| 8.4 | Verify color contrast (4.5:1) | WCAG AA compliance |
| 8.5 | Add loading skeletons everywhere | No layout shifts |
| 8.6 | Add sonner toasts | "Tweet posted", "Copied link", etc. |
| 8.7 | Final dark mode QA | All pages in both themes |
| 8.8 | Mobile responsiveness audit | Test at 375px, 768px, 1024px |

---

## Execution DAG

```
P1 (Foundation)
    │
    ├──────────────────────┐
    ▼                      ▼
P2 (Data)              P3 (Navigation)
    │                      │
    └──────────┬───────────┘
               ▼
           P4 (Tweet)
               │
               ▼
           P5 (Feed)
               │
               ▼
           P6 (Home)
               │
    ┌──────────┼──────────┬──────────┬──────────┬──────────┐
    ▼          ▼          ▼          ▼          ▼          ▼
  P7A        P7B        P7C        P7D        P7E        P7F
(Profile) (Detail)  (Explore) (Notifs)  (Messages)(Bookmarks)
    │          │          │          │          │          │
    └──────────┴──────────┴──────────┴──────────┴──────────┘
                              │
                              ▼
                         P8 (Polish)
```

---

## Parallel Execution Windows

| Window | Phases | Max Parallelism |
|--------|--------|-----------------|
| 1 | P1 | 1 (sequential setup) |
| 2 | P2 + P3 | 2 |
| 3 | P4 + P5 | 1 (P5 depends on P4) |
| 4 | P6 | 1 |
| 5 | P7A-P7F | 6 (all parallel!) |
| 6 | P8 | 1 (final pass) |

---

## File Count Estimate

| Category | Count |
|----------|-------|
| App Pages | 8 (home, profile, tweet, explore, notifications, messages, bookmarks, compose modal) |
| Feature Components | ~12 |
| Shared UI (Shadcn) | 13 |
| Lib/Utils | 3 |
| Data Layer | 2 |
| Providers | 1 |
| **Total** | ~39 files |

---

## Unique Creative Choices

1. **Electric Dusk over generic blue**: OKLCH-based twilight palette with warm accents
2. **Feature slices over component folders**: Related code lives together
3. **Keyboard navigation as P5 requirement**: j/k/l/r not an afterthought
4. **Discriminated unions for notifications**: Exhaustive type checking
5. **useOptimistic as core pattern**: React 19's killer feature for engagement
6. **Virtualization from day 1**: No retrofit needed for 150+ tweets

---

## Verification Checkpoints

1. **After P1**: `npm run dev` starts, dark mode toggle works
2. **After P3**: 3-column layout visible, nav links work
3. **After P4**: Tweet card renders with working like/retweet
4. **After P5**: Feed scrolls smoothly, j/k navigation works
5. **After P6**: Home page complete with composer
6. **After P7**: All 6 secondary pages accessible
7. **After P8**: Accessibility audit passes, responsive on all breakpoints

---

## Ready to Execute

This plan is ready for implementation. Location: `/apps/vibe-web/0126_x_clone`
