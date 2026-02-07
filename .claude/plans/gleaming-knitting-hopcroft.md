# Plan: Generate Codebase Visualization

## Objective
Generate an interactive HTML visualization of the agent_monorepo codebase using the px-codebase-visualizer skill.

## Current State
- Working directory: `/Users/xup/CODE/REPOs/gh/_peteryxu/agent_monorepo`
- Visualization script confirmed at: `~/.claude/skills/px-codebase-visualizer/scripts/visualize.py`
- Codebase structure includes:
  - `apps/` - Web applications (vibe-web with Next.js projects)
  - `apps-desktop/` - Desktop applications (snake game)
  - `apps-iPhone/` - iPhone applications (snake game)
  - `docs/` - Documentation

## Implementation Plan

### Step 1: Execute Visualization Script
Run the Python visualization script from the monorepo root:
```bash
python ~/.claude/skills/px-codebase-visualizer/scripts/visualize.py .
```

**Expected behavior:**
- Script will traverse the directory tree
- Ignores: `.git`, `node_modules`, `__pycache__`, `.venv`, `venv`, `dist`, `build`
- Generates `codebase-map.html` in current directory
- Automatically opens the HTML file in default browser

### Step 2: Verify Output
The generated `codebase-map.html` should contain:
- **Interactive tree view**: Collapsible directories showing full structure
- **Left sidebar statistics**:
  - Total file count
  - Directory count
  - Total codebase size
  - File type distribution with percentages
- **Visual features**:
  - Color-coded file types (.js, .ts, .py, .html, .css, .json, .md, etc.)
  - File sizes displayed next to each file
  - Dark theme UI with responsive design

## Files Affected
- **Created**: `codebase-map.html` (new file in monorepo root)

## Verification
1. Check that `codebase-map.html` exists in `/Users/xup/CODE/REPOs/gh/_peteryxu/agent_monorepo/`
2. Verify the HTML file opens in browser automatically
3. Confirm the visualization shows:
   - All major directories: `apps/`, `apps-desktop/`, `apps-iPhone/`, `docs/`, `.claude/`
   - Expandable/collapsible folder structure
   - File count and size statistics in sidebar
   - Color-coded file type distribution
4. Test interactivity: Click folders to expand/collapse
5. Verify ignored directories (`.git`, `node_modules`) are not shown

## Notes
- Single command execution - no code changes required
- Output file is self-contained HTML with embedded CSS/JS
- Can be opened directly in any modern browser
- Safe to commit to repository if desired (useful for documentation)
