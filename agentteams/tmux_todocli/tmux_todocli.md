# CLI TODO Tracker — Agent Team Design Exploration

Three-agent team explored a CLI TODO tracker tool from UX, architecture, and critical perspectives.

## Synthesis: Three Perspectives

### Where all three agree

- **Zero-config defaults are non-negotiable** — must respect `.gitignore`, detect languages automatically, and "just work" on `todo scan`
- **The market is crowded** — leasot, todo-tree, todocheck, grep all exist. Differentiation is essential.
- **False positives kill adoption** — naive regex isn't enough; tree-sitter validation or strict syntax (`TODO:`) is required

### The tension worth resolving

The **UX analyst** designed a full-featured tool (scan, list, stats, watch, check, reporters, config files, LSP server). The **critic** says most of that will go unused and recommends a hyper-focused MVP scoped to your current git branch. The **architect** designed for both with a phased approach.

The critic's framing is the most important: **"Will you use this daily for 6 months, or are you building it for hypothetical others?"**

### What would actually differentiate this tool

All three converged on one unique angle nobody else owns:

1. **Session/branch-scoped** — only show TODOs in files you've touched, not the entire codebase
2. **Passive terminal integration** — live TODO count in tmux statusline, zero workflow change
3. **Age-aware defaults** — hide stale TODOs (>30 days), surface fresh ones
4. **CI gate with baseline** — `todo check --max N --baseline` to prevent creep without blocking existing debt

### Recommended build order

| Phase | What | Why |
|-------|------|-----|
| **1 (2 weeks)** | Rust CLI, regex scan, table+JSON output, `.gitignore` respect, `todo scan` and `todo check --max N` | Validates core value prop |
| **2 (if you use it daily)** | Tree-sitter validation, git blame, branch-scoped mode, SARIF for GitHub Actions | Differentiation features |
| **3 (if others adopt)** | Config files, plugin system, LSP, tmux integration | Scale features |

### The one question to answer first

The critic nailed it: if you're building this because `grep -rn TODO` isn't quite enough for *your* workflow, start with the exact friction point you feel. If you're building it because "developers should track TODOs better" — the research says that's a cultural problem, not a tooling one.

---

## Debugging Note: Agent Team Spawn Issue

The original team spawn failed due to a **race condition** — agents launched in tmux panes before their inbox messages were committed to disk, found no work, and exited cleanly (code 0). Manual re-runs with the messages already on disk worked fine.

**Key observations:**
- All three panes showed the Claude launch command followed immediately by a shell prompt — zero output from Claude itself
- Exit code 0 in all panes — no crash, no error
- Inbox messages remained `"read": false` — agents never polled their mailbox
- The `joinedAt` timestamps and inbox file creation timestamps were within the same second

---

## Individual Agent Reports

### 1. UX Analyst

- **Command structure**: `todo scan`, `todo list`, `todo check`, `todo stats` — verb-noun pattern following [clig.dev](https://clig.dev/) conventions
- **Progressive disclosure**: zero-config defaults for beginners → config file → CI/CD integration for power users
- **Smart output**: color-coded table by default, with JSON/markdown/GitLab reporters for tooling
- **CI/CD killer feature**: `todo check --max 50 --baseline .todo-baseline.json` to prevent TODO creep
- **Phased MVP**: scan+table+colors first, reporters second, git integration third
- **Config**: YAML recommended (`.todorc.yml`), cascading resolution (CLI flags > project > global)
- **Workflow integration**: git pre-commit hooks (warn, don't block), GitHub Actions, LSP for editors

### 2. Technical Architect

- **Language**: Rust — 20ms startup, static binaries, excellent CLI ecosystem (`clap`, `ignore`, `tree-sitter`)
- **Parsing**: Hybrid approach — regex pre-filter for speed, tree-sitter validation for accuracy
- **Performance**: Parallel file processing via `rayon`, incremental scanning with hash-based cache, ripgrep's `ignore` crate for `.gitignore` respect
- **Data model**: Rich TODO entity (file, line, tag, assignee, priority, author via git blame, references, context)
- **Storage**: SQLite + JSON — query performance plus human readability
- **Output formats**: Table, JSON, Markdown, SARIF (native GitHub Actions support)
- **Extension**: WASM plugin system for custom parsers/reporters, LSP server for editor integration
- **Distribution**: Standalone binaries (primary) → Homebrew → cargo → npm wrapper

### 3. Devil's Advocate (Critic)

- **Market saturation**: leasot (1.3k stars), todocheck (429 stars), Todo Tree (2.2M installs), IDE built-ins, SonarQube
- **Behavioral evidence**: 48% of agile teams pay down tech debt; 44% of SATD comments are false positives; most TD items in trackers are never discussed
- **Core problem**: Cultural, not tooling — developers don't lack TODO tools, they lack motivation to act on TODOs
- **Failure modes**: noise overload (847 TODOs on first scan), false sense of progress (fewer TODOs written ≠ fewer issues), report fatigue (thresholds get bumped), context rot (6-month-old TODOs nobody understands)
- **Alternative approaches**: linter rules for TODO age, automated TODO→GitHub issue conversion, "no TODOs in main" policy, AI-assisted TODO resolution
- **Differentiation path**: session-scoped awareness, passive tmux integration, smart age-based defaults
- **Kill criterion**: "Ship in 2 weeks. If you don't use it daily after 1 month, kill it."
