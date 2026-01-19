# X/Twitter Clone Prototype

A beautiful, interactive Twitter/X clone prototype built with Next.js 15, Shadcn/ui, and Tailwind CSS v4.

## Prompt Used:

design a Twitter clone with the following requirements:

1. Beautiful design
2. Use Shadcn components
3. All different features and functionality visible on screen
4. No database connection yet - use dummy data
5. Operational in Next.js - can click around and interact
6. Focus on usability, clean design, Tailwind
7. Get a prototype up and running


## Features

- **3-Column Responsive Layout**: Desktop (full), tablet (collapsed sidebar), mobile (bottom nav)
- **Interactive Feed**: Virtualized feed with 100+ tweets, optimistic like/retweet/bookmark
- **Tweet Composer**: 280 character limit with circular progress indicator
- **Dark Mode**: System-aware theme toggle with light/dark modes
- **Multiple Pages**: Home, Explore, Notifications, Messages, Bookmarks, Profile, Tweet Detail
- **Mock Data**: Reproducible fake data with Faker.js

## Tech Stack

- **Next.js 15** - App Router, Server/Client Components
- **React 19** - with useOptimistic for instant feedback
- **TypeScript 5** - Type safety with branded types
- **Tailwind CSS v4** - Styling with OKLCH colors
- **Shadcn/ui** - Component library
- **@tanstack/react-virtual** - Feed virtualization
- **@faker-js/faker** - Mock data generation
- **next-themes** - Dark mode support

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home feed
│   ├── explore/           # Search & trends
│   ├── notifications/     # Notifications
│   ├── messages/          # Direct messages
│   ├── bookmarks/         # Saved tweets
│   ├── profile/[username] # User profiles
│   └── tweet/[id]         # Tweet detail
├── components/
│   ├── ui/                # Shadcn components
│   ├── layout/            # Sidebar, MobileNav, RightSidebar
│   ├── tweet/             # TweetCard, TweetComposer
│   └── feed/              # Feed, FeedTabs
├── lib/
│   ├── types.ts           # TypeScript interfaces
│   ├── mock-data.ts       # Faker.js data generation
│   └── utils.ts           # Utility functions
└── providers/
    └── app-providers.tsx  # Theme provider
```

## Design System

- **Colors**: OKLCH color space for perceptual uniformity
- **Typography**: System fonts with clear hierarchy
- **Spacing**: Consistent 4px grid
- **Borders**: 16px radius for organic feel
- **Transitions**: 150ms ease-out for micro-interactions

## Keyboard Shortcuts

- `j` / `ArrowDown` - Next tweet
- `k` / `ArrowUp` - Previous tweet
- `l` - Like current tweet
- `r` - Retweet current tweet
- `Cmd/Ctrl + Enter` - Post tweet (in composer)
