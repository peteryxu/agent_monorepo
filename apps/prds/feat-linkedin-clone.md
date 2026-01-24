# LinkedIn Clone Prototype - Implementation Plan

## Overview

Build a LinkedIn clone prototype at `/apps/0120_linkedin_clone` following the patterns established in the X/Twitter clone (`/apps/0119_x_clone`).

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15+ | App Router, Server/Client Components |
| React | 19 | useOptimistic for instant feedback |
| TypeScript | 5.x | Branded types, discriminated unions |
| Tailwind CSS | v4 | OKLCH colors for LinkedIn blue theme |
| Shadcn/ui | latest | Component library (~15 components) |
| @tanstack/react-virtual | 3.x | Feed virtualization |
| @faker-js/faker | 9.x | Seeded mock data |
| next-themes | 0.4.x | Dark mode support |

---

## Project Structure

```
apps/0120_linkedin_clone/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Home feed
│   │   ├── globals.css             # OKLCH LinkedIn theme
│   │   ├── profile/[username]/page.tsx
│   │   ├── jobs/page.tsx
│   │   ├── notifications/page.tsx
│   │   ├── messaging/page.tsx
│   │   ├── connections/page.tsx
│   │   └── post/[id]/page.tsx
│   ├── components/
│   │   ├── ui/                     # Shadcn components
│   │   ├── layout/                 # sidebar, mobile-nav, right-sidebar
│   │   ├── post/                   # post-card, post-composer, comment-section
│   │   ├── feed/                   # feed, feed-tabs
│   │   ├── profile/                # profile-card, experience-card, skill-badge
│   │   ├── job/                    # job-card, job-filters
│   │   └── connection/             # connection-card
│   ├── lib/
│   │   ├── types.ts                # Branded types + discriminated unions
│   │   ├── mock-data.ts            # Seeded faker generation
│   │   └── utils.ts                # cn, formatCount, formatDuration
│   └── providers/
│       └── app-providers.tsx
```

---

## Key Types

### Branded Types
- `UserId`, `PostId`, `CommentId`, `JobId`, `CompanyId`, `ConnectionId`, `NotificationId`

### Discriminated Union: Post Types
- `text` - Standard post with optional images
- `article` - Shared article with title/image/link
- `job-share` - Shared job listing
- `celebration` - Work anniversary, new job, promotion
- `poll` - Poll with options and votes

### Discriminated Union: Notification Types
- `connection-request` - Someone wants to connect
- `connection-accepted` - Connection accepted
- `like` - Someone reacted to your post (with reaction type)
- `comment` - Someone commented on your post
- `mention` - Someone mentioned you
- `job-match` - Job matches your profile
- `profile-view` - Someone viewed your profile

### Reaction Types (6 LinkedIn reactions)
`like` | `celebrate` | `support` | `love` | `insightful` | `funny`

---

## Pages (7 total)

| Route | Description |
|-------|-------------|
| `/` | Home feed with composer + virtualized posts |
| `/profile/[username]` | Profile with tabs (Posts, About, Experience, Skills) |
| `/jobs` | Job listings with search and filters |
| `/notifications` | Activity feed with 7 notification types |
| `/messaging` | Direct messages |
| `/connections` | My network, pending requests, suggestions |
| `/post/[id]` | Single post detail with comments |

---

## Implementation Order

### Phase 1: Setup (~20 files)
1. `npm create next-app` with TypeScript
2. Configure Tailwind v4 + OKLCH colors in globals.css
3. Install Shadcn/ui components (avatar, button, card, dialog, dropdown-menu, input, scroll-area, separator, tabs, textarea, tooltip, skeleton, sonner, badge, progress)
4. Create `types.ts` with all branded types and discriminated unions
5. Create `mock-data.ts` with seeded faker generation
6. Create `app-providers.tsx` + root `layout.tsx`

### Phase 2: Layout Components
1. `sidebar.tsx` - LinkedIn navigation
2. `mobile-nav.tsx` - Bottom nav for mobile
3. `right-sidebar.tsx` - Suggestions + news
4. `profile-card.tsx` - Mini profile for sidebar

### Phase 3: Post System
1. `post-card.tsx` - With 6 reaction types + optimistic updates
2. `post-composer.tsx` - Media options + character counter
3. `feed.tsx` - Virtualized with @tanstack/react-virtual
4. `feed-tabs.tsx` - All, Posts, Articles, Jobs

### Phase 4: Home Page
- 3-column layout: [275px sidebar] [600px feed] [300px suggestions]

### Phase 5: Profile System
1. Full profile page with cover image, about, activity
2. `experience-card.tsx` - Work history
3. `skill-badge.tsx` - Skills with endorsements
4. Profile tabs navigation

### Phase 6: Jobs System
1. `job-card.tsx` - Job listing display
2. `job-filters.tsx` - Search and filter controls
3. Jobs page with listings

### Phase 7: Notifications
- Render all 7 notification types with discriminated union switch

### Phase 8: Connections & Messaging
1. `connection-card.tsx`
2. Connections page with tabs
3. Basic messaging layout

### Phase 9: Post Detail
- Single post with comments section

### Phase 10: Polish
- Dark mode, loading skeletons, toast notifications, accessibility

---

## LinkedIn-Specific Adaptations from X Clone

| X Clone | LinkedIn Clone |
|---------|---------------|
| Like button | 6 reaction types with picker |
| Tweet (text only) | 5 post types (text, article, job, celebration, poll) |
| Retweet | Repost |
| Follow | Connect (bidirectional) |
| 5 notification types | 7 notification types |
| Profile tabs (Posts, Media) | Profile tabs (Posts, About, Experience, Skills) |
| N/A | Jobs feature |
| N/A | Connection requests |

---

## Verification Plan

1. **Run dev server**: `cd apps/0120_linkedin_clone && npm run dev`
2. **Test all routes**: Navigate to each page
3. **Test reactions**: Click reactions, verify optimistic updates
4. **Test responsiveness**: Resize browser, check 3-col → 2-col → 1-col
5. **Test dark mode**: Toggle theme
6. **Test virtualization**: Scroll through 100+ posts, verify no jank
7. **Test type safety**: TypeScript should catch any ID mixups

---

## Critical Files to Modify/Create

- `apps/0120_linkedin_clone/src/lib/types.ts` - Core types
- `apps/0120_linkedin_clone/src/lib/mock-data.ts` - Data generation
- `apps/0120_linkedin_clone/src/app/globals.css` - LinkedIn OKLCH theme
- `apps/0120_linkedin_clone/src/components/post/post-card.tsx` - Main post component
- `apps/0120_linkedin_clone/src/components/layout/sidebar.tsx` - Navigation

## Reference Files
- `apps/0119_x_clone/src/components/tweet/tweet-card.tsx` - Pattern for optimistic updates
- `apps/0119_x_clone/src/lib/types.ts` - Branded types pattern
- `apps/0119_x_clone/src/lib/mock-data.ts` - Faker seeding pattern
