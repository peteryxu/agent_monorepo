# Fix: Infinite HMR Refresh Loop in LinkedIn Clone

## Problem
The app experiences continuous screen flashing caused by an infinite HMR (Hot Module Replacement) loop. The console shows repeated messages:
- `[HMR] connected`
- `[Fast Refresh] rebuilding`

This happens when a browser connects to the dev server but stops when the browser is closed.

## Root Cause
Next.js 16.1.4 uses **Turbopack** by default. There appears to be an issue with Turbopack's HMR where the browser connection triggers continuous rebuild cycles.

## Solution
Modify `package.json` to use Webpack instead of Turbopack by adding the `--turbo=false` flag.

### File to Modify
- `/Users/xup/CODE/REPOs/gh/_peteryxu/agent_monorepo/apps/vibe-web/0120_linkedin_clone/package.json`

### Change
```json
// Before
"dev": "next dev"

// After
"dev": "next dev --turbo=false"
```

### Additional Step
Clear the `.next` cache before restarting:
```bash
rm -rf .next
npm run dev
```

## Verification
1. Stop the current dev server
2. Clear `.next` directory: `rm -rf .next`
3. Start the server: `npm run dev`
4. Open http://localhost:3000 in browser
5. Confirm no flashing and console shows single `[HMR] connected` message (not repeating)
