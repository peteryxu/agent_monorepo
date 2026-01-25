# Agent Monorepo - Claude Code Guidelines

## Browser Testing & Automation

**Primary:** Use `agent-browser` skill for web/browser testing and automation.

```bash
agent-browser open http://localhost:3000    # Navigate to page
agent-browser snapshot -i                   # Get interactive elements with refs
agent-browser click @e1                     # Click element by ref
agent-browser console                       # Check console for errors
agent-browser errors                        # Check page errors
```

**Fallback:** If agent-browser is unavailable or has issues, use Claude for Chrome MCP tools (`mcp__claude-in-chrome__*`).

**Workflow:**
1. Start with `agent-browser snapshot -i` to get element refs
2. Use `agent-browser console` and `agent-browser errors` to debug issues
3. After making code changes, reload with `agent-browser reload`
4. For fresh state, close and reopen: `agent-browser close` then `agent-browser open <url>`

## Common Issues & Solutions

### React/Next.js Hydration Mismatch Errors

**Symptom:** Console error "Hydration failed because the server rendered text didn't match the client"

**Common Causes:**
1. `Math.random()` in component render or module-level code
2. `new Date()` / `Date.now()` for display values
3. Randomized data ordering (e.g., `.sort(() => Math.random() - 0.5)`)
4. Faker.js or other seeded random libraries where seed state differs between server/client
5. Browser extensions modifying DOM before React hydrates

**Fix Pattern - Client-Only Rendering:**

```tsx
"use client"

import { useState, useEffect } from "react"

export function ComponentWithDynamicData() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div>
      {/* Static content renders on server */}
      <h1>Title</h1>

      {/* Dynamic content only renders after hydration */}
      {mounted && (
        <DynamicSection data={randomizedData} />
      )}
    </div>
  )
}
```

**Fix Pattern - Deterministic Data:**

```tsx
// BAD: Non-deterministic ordering
export const suggestedUsers = users
  .sort(() => Math.random() - 0.5)  // Different on server vs client!
  .slice(0, 5)

// GOOD: Deterministic ordering
export const suggestedUsers = users
  .sort((a, b) => b.followers - a.followers)  // Same on both
  .slice(0, 5)
```

**When to use each fix:**
- Use `mounted` state when the data source is inherently random and you can't control it
- Use deterministic sorting when you control the data generation
- For timestamps, consider formatting on the server or using `suppressHydrationWarning`

## Project Structure

```
apps/
├── vibe-web/           # Web app prototypes
│   ├── 0120_linkedin_clone/
│   ├── 0125_linkedin/
│   └── 0126_x_clone/   # X/Twitter clone (Next.js 15, React 19)
└── prds/               # Product requirement documents
```

## Tech Stack Notes

### X Clone (`apps/vibe-web/0126_x_clone`)
- Next.js 15 with App Router
- React 19 with `useOptimistic` for instant feedback
- Tailwind CSS v4 with OKLCH colors ("Electric Dusk" theme)
- @tanstack/react-virtual for feed virtualization
- @faker-js/faker with seed for reproducible mock data
- Keyboard navigation: j/k for up/down in feed
