# LinkedIn Clone - Execution Task Plan

## Overview
Build a new LinkedIn clone prototype at `/apps/linkedin-clone` based on the PRD at `/apps/prds/feat-linkedin-clone.md`.

---

## Task Execution Plan

### Phase 1: Project Setup [P1]
**Dependencies:** None (Start here)

| Task ID | Task | Depends On | Can Parallel With |
|---------|------|------------|-------------------|
| P1.1 | Create Next.js 15 app with TypeScript | - | - |
| P1.2 | Configure Tailwind v4 + OKLCH LinkedIn theme in globals.css | P1.1 | - |
| P1.3 | Install Shadcn/ui (15 components) | P1.1 | P1.2 |
| P1.4 | Create `lib/types.ts` - Branded types + discriminated unions | P1.1 | P1.2, P1.3 |
| P1.5 | Create `lib/mock-data.ts` - Seeded faker generation | P1.4 | - |
| P1.6 | Create `lib/utils.ts` - cn, formatCount, formatDuration | P1.1 | P1.2, P1.3, P1.4 |
| P1.7 | Create `providers/app-providers.tsx` + root `layout.tsx` | P1.2, P1.3 | - |

**Parallel Group A:** P1.2, P1.3, P1.4, P1.6 (after P1.1)
**Sequential:** P1.1 → P1.7, P1.4 → P1.5

---

### Phase 2: Layout Components [P2]
**Dependencies:** P1.7 complete

| Task ID | Task | Depends On | Can Parallel With |
|---------|------|------------|-------------------|
| P2.1 | Create `layout/sidebar.tsx` - LinkedIn navigation | P1.7 | P2.2, P2.3 |
| P2.2 | Create `layout/mobile-nav.tsx` - Bottom nav | P1.7 | P2.1, P2.3 |
| P2.3 | Create `layout/right-sidebar.tsx` - Suggestions + news | P1.7 | P2.1, P2.2 |
| P2.4 | Create `layout/theme-toggle.tsx` - Dark mode toggle | P1.7 | P2.1, P2.2, P2.3 |

**Parallel Group B:** P2.1, P2.2, P2.3, P2.4 (all can run in parallel)

---

### Phase 3: Post System [P3]
**Dependencies:** P1.5 (mock-data), P2.1 (layout exists)

| Task ID | Task | Depends On | Can Parallel With |
|---------|------|------------|-------------------|
| P3.1 | Create `post/post-card.tsx` - 6 reactions + optimistic updates | P1.5 | P3.2 |
| P3.2 | Create `post/post-composer.tsx` - Media options + counter | P1.5 | P3.1 |
| P3.3 | Create `feed/feed.tsx` - Virtualized with @tanstack/react-virtual | P3.1 | - |
| P3.4 | Create `feed/feed-tabs.tsx` - All, Posts, Articles, Jobs | P1.7 | P3.1, P3.2, P3.3 |

**Parallel Group C:** P3.1, P3.2, P3.4
**Sequential:** P3.1 → P3.3

---

### Phase 4: Home Page [P4]
**Dependencies:** P3.3, P3.4 complete

| Task ID | Task | Depends On | Can Parallel With |
|---------|------|------------|-------------------|
| P4.1 | Create `app/page.tsx` - 3-column layout home feed | P2.1, P2.3, P3.3, P3.4 | - |

---

### Phase 5: Profile System [P5]
**Dependencies:** P1.5 (mock-data)

| Task ID | Task | Depends On | Can Parallel With |
|---------|------|------------|-------------------|
| P5.1 | Create `profile/experience-card.tsx` - Work history | P1.5 | P5.2 |
| P5.2 | Create `profile/skill-badge.tsx` - Skills + endorsements | P1.5 | P5.1 |
| P5.3 | Create `app/profile/[username]/page.tsx` - Full profile | P5.1, P5.2, P3.1 | - |

**Parallel Group D:** P5.1, P5.2

---

### Phase 6: Jobs System [P6]
**Dependencies:** P1.5 (mock-data)

| Task ID | Task | Depends On | Can Parallel With |
|---------|------|------------|-------------------|
| P6.1 | Create `job/job-card.tsx` - Job listing display | P1.5 | P6.2 |
| P6.2 | Create `job/job-filters.tsx` - Search and filter | P1.5 | P6.1 |
| P6.3 | Create `app/jobs/page.tsx` - Jobs page | P6.1, P6.2 | - |

**Parallel Group E:** P6.1, P6.2

---

### Phase 7: Notifications [P7]
**Dependencies:** P1.5 (mock-data with 7 notification types)

| Task ID | Task | Depends On | Can Parallel With |
|---------|------|------------|-------------------|
| P7.1 | Create `app/notifications/page.tsx` - 7 notification types | P1.5 | - |

---

### Phase 8: Connections & Messaging [P8]
**Dependencies:** P1.5 (mock-data)

| Task ID | Task | Depends On | Can Parallel With |
|---------|------|------------|-------------------|
| P8.1 | Create `connection/connection-card.tsx` | P1.5 | P8.2, P8.3 |
| P8.2 | Create `app/connections/page.tsx` - Network page | P8.1 | P8.3 |
| P8.3 | Create `app/messaging/page.tsx` - Basic messaging | P1.5 | P8.1, P8.2 |

**Parallel Group F:** P8.1, P8.3
**Then:** P8.2

---

### Phase 9: Post Detail [P9]
**Dependencies:** P3.1 (post-card)

| Task ID | Task | Depends On | Can Parallel With |
|---------|------|------------|-------------------|
| P9.1 | Create `app/post/[id]/page.tsx` - Single post + comments | P3.1 | - |

---

### Phase 10: Polish [P10]
**Dependencies:** All previous phases

| Task ID | Task | Depends On | Can Parallel With |
|---------|------|------------|-------------------|
| P10.1 | Add loading skeletons to all pages | P4.1, P5.3, P6.3, P7.1, P8.2, P8.3, P9.1 | P10.2, P10.3 |
| P10.2 | Add toast notifications (sonner) | P10.1 | P10.3 |
| P10.3 | Accessibility audit + fixes | P10.1 | P10.2 |
| P10.4 | Final dark mode testing | P10.1, P10.2, P10.3 | - |

---

## Execution DAG (Dependency Graph)

```
P1.1 ─┬─> P1.2 ─────────────────────────┐
      ├─> P1.3 ─────────────────────────┼─> P1.7 ─┬─> P2.1 ─┐
      ├─> P1.4 ─> P1.5 ─┬─> P3.1 ─> P3.3 ─────────┤         ├─> P4.1
      └─> P1.6          │              ├─> P2.2 ─┤         │
                        │              ├─> P2.3 ─┘         │
                        │              └─> P2.4            │
                        │                                  │
                        ├─> P3.2 ──────────────────────────┤
                        ├─> P3.4 ──────────────────────────┘
                        │
                        ├─> P5.1 ─┬─> P5.3
                        ├─> P5.2 ─┘
                        │
                        ├─> P6.1 ─┬─> P6.3
                        ├─> P6.2 ─┘
                        │
                        ├─> P7.1
                        │
                        ├─> P8.1 ─> P8.2
                        └─> P8.3

P3.1 ────────────────────────────────────────> P9.1

All ──────────────────────────────────────────> P10.x
```

---

## Parallel Execution Groups

| Group | Tasks | Max Parallelism |
|-------|-------|-----------------|
| A | P1.2, P1.3, P1.4, P1.6 | 4 |
| B | P2.1, P2.2, P2.3, P2.4 | 4 |
| C | P3.1, P3.2, P3.4 | 3 |
| D | P5.1, P5.2 | 2 |
| E | P6.1, P6.2 | 2 |
| F | P8.1, P8.3 | 2 |
| G | P10.1, P10.2, P10.3 | 3 |

---

## Session Persistence & Resume Strategy

### Checkpoint Files
After each phase, persist state to enable resume:
- `.claude/checkpoints/linkedin-clone-progress.json`

### Resume Points
Each task marked with status: `pending` | `in_progress` | `completed`

### Resume Protocol
1. On session start, read checkpoint file
2. Skip all `completed` tasks
3. Resume any `in_progress` tasks from beginning
4. Continue with next `pending` task respecting dependencies

---

## Verification Plan

1. **After P1:** `npm run dev` should start without errors
2. **After P4:** Home page renders with 3-column layout
3. **After P5:** Profile pages load with mock data
4. **After P6:** Jobs page shows listings with filters
5. **After P7:** Notifications render all 7 types
6. **After P8:** Connections and messaging pages work
7. **After P9:** Post detail shows comments
8. **After P10:** Full app test - dark mode, responsiveness, virtualization

---

## File Count Summary

| Category | Count |
|----------|-------|
| App Pages | 7 |
| UI Components (Shadcn) | 15 |
| Layout Components | 4 |
| Post Components | 2 |
| Feed Components | 2 |
| Profile Components | 2 |
| Job Components | 2 |
| Connection Components | 1 |
| Lib Files | 3 |
| Provider Files | 1 |
| **Total** | ~39 files |

---

## Critical Path

The longest dependency chain determines minimum execution time:

```
P1.1 → P1.4 → P1.5 → P3.1 → P3.3 → P4.1 → P10.1 → P10.4
```

This is the critical path that cannot be parallelized further.
