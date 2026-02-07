# TODO CLI Tool — Agent Team Findings

> Three-agent exploration of a CLI tool that tracks TODO comments across codebases.
> Generated 2026-02-07 via Claude Code Agent Teams (tmux split-pane).

---

## Agent 1: UX Analyst

### 1. User Personas & Workflows

| Persona | Primary Workflow | Key Need |
|---------|-----------------|----------|
| **Solo dev** | `todo scan` after coding session, glance at tmux statusline | Low friction, zero config, "what did I leave behind?" |
| **Team lead / reviewer** | `todo check --max N` in CI, review PR TODO delta | Prevent creep, enforce hygiene, baseline tracking |
| **CI pipeline** | `todo check --baseline .todo-baseline.json` as gate | Machine-readable output (JSON/SARIF), non-zero exit codes |

**Critical insight**: Todo Tree (2.2M VSCode installs) proves developers *want* TODO visibility. But it's editor-locked and solo-focused. The gap is **terminal-native, branch-aware, CI-ready**.

### 2. CLI UX Patterns

**Command structure: verb-first, following `gh` and clig.dev patterns**

```
todo scan [path]          # Find TODOs (default: .)
todo list [filters]       # Show cached results with filters
todo check [--max N]      # CI gate — exit 1 if over threshold
todo stats                # Summary counts by tag/file/age
```

**Flag conventions (from clig.dev)**:
- `--json` for machine output (not `-f json` — follow `gh` pattern)
- `--quiet` / `-q` suppress non-essential output
- `--no-color` / respect `NO_COLOR` env var
- `--config` for explicit config path
- `--max N` for CI threshold (not `--limit`, which implies pagination)

**Progressive disclosure** (from clig.dev + ripgrep patterns):
1. No args → show brief help + example
2. `todo scan` → colored table, grouped by file
3. `todo scan --json` → structured output for piping
4. `todo scan --help` → full flag reference

### 3. Output Design

**Default (human, TTY detected):**

```
src/auth.rs
  12:  TODO  Add rate limiting to login endpoint         @pete  3d ago
  45:  FIXME Token refresh race condition                 @pete  1d ago

src/api.rs
  89:  TODO  Add pagination to /users endpoint                  12d ago
  134: HACK  Temporary workaround for upstream bug #42          30d+ ⚠

── 4 items (2 TODO, 1 FIXME, 1 HACK) ──
```

Design choices:
- **Grouped by file** (like ripgrep `--heading`) — matches how developers think
- **Color-coded tags**: TODO=cyan, FIXME=yellow, HACK=red — severity gradient
- **Age display**: relative ("3d ago") not absolute dates — immediately scannable
- **Stale indicator**: ⚠ for >30 days — makes old debt visible without hiding it
- **Summary footer**: always show — gives instant "how bad is it" answer

**Machine output (`--json`):**
```json
{"file":"src/auth.rs","line":12,"tag":"TODO","text":"Add rate limiting","author":"pete","age_days":3}
```
One JSON object per line (JSONL) — composable with `jq`, streamable.

**CI output (SARIF):** Native GitHub Actions annotation support — TODOs appear inline on PRs.

### 4. Key Interaction Model Decisions

- **Zero-config defaults**: Respect `.gitignore`, auto-detect comment syntax, scan current dir
- **Strict syntax**: Require `TAG:` with colon to reduce false positives
- **The "branch-scoped" differentiator**: `todo scan --branch` — only show TODOs in files changed since branching from main

### 5. Integration Points

| Integration | How | Priority |
|-------------|-----|----------|
| **Git pre-commit hook** | `todo check --max N` — warn, don't block | Phase 1 |
| **GitHub Actions** | SARIF output → annotations on PRs | Phase 2 |
| **tmux statusline** | `todo scan --count --quiet` | Phase 2 |
| **Editor LSP** | Diagnostics for TODO comments | Phase 3 |

### 6. Competitive Gap Analysis

| Tool | Strength | Gap This Tool Fills |
|------|----------|-------------------|
| **leasot** | Multi-format reporters, CI-ready | No branch awareness, no age tracking, Node.js dependency |
| **Todo Tree** | Beautiful UI, instant navigation | Editor-locked, no CI, no terminal |
| **grep/rg TODO** | Universal, zero install | No structure, no filtering, no CI gate |
| **todocheck** | TODO→issue links | Narrow scope, Go dependency |
| **SonarQube** | Enterprise, comprehensive | Heavyweight, expensive |

**Positioning**: "ripgrep for TODOs" — fast, zero-config, terminal-native, branch-aware, CI-ready.

### 7. Anti-Patterns to Avoid

1. Don't build a task manager
2. Don't block commits by default — developers will stop writing TODOs
3. Don't show 847 TODOs on first run — use `--branch` or summary hint
4. Don't require config
5. Don't add features before daily use — ship in 2 weeks, use for 1 month, or kill it

---

## Agent 2: Technical Architect

### 1. Language & Runtime Choice — Rust

| Criteria | Rust | Go | Node.js | Python |
|----------|------|----|---------|--------|
| Startup time | ~2-5ms | ~5-10ms | ~30-80ms | ~50-200ms |
| Parsing perf (100k files) | Fastest | Fast (GC pauses) | Moderate | Slowest |
| Binary distribution | Single static, ~3-5MB | Single static, ~8-15MB | Requires runtime | Requires runtime |

**Why Rust wins**: The `ignore` crate (from ripgrep) provides battle-tested parallel directory traversal with `.gitignore` support. Combined with `clap` v4, `rayon`, and native `tree-sitter` bindings, the ecosystem is purpose-built for this tool.

### 2. Parsing Strategy — Hybrid Regex + Tree-sitter

**Phase 1 (MVP) — Regex-only:**

Pattern: `(TODO|FIXME|HACK|XXX|BUG|NOTE)(\([\w.-]+\))?:?\s*(\[P[0-3]\])?\s*(.+)`

Comment style detection by file extension covers 95% of cases:

| Style | Languages |
|-------|-----------|
| `//` | Rust, Go, JS/TS, C/C++, Java, Swift, Kotlin |
| `#` | Python, Ruby, Shell, YAML, TOML |
| `--` | SQL, Lua, Haskell |
| `/* */` | CSS, C/C++ block |
| `<!-- -->` | HTML, XML |

**Phase 2 — Tree-sitter validation:** Eliminates false positives by confirming matches are inside comment AST nodes. Regex runs first as fast pre-filter; tree-sitter only validates.

### 3. Performance Architecture

- **File traversal**: `ignore` crate (`WalkParallel`) — lock-free parallel with `.gitignore` support
- **Parallelism**: `rayon` thread pool, each file is independent work unit, no shared mutable state
- **Incremental scanning (Phase 2)**: `(file_path, mtime, size, content_hash)` cache, `xxh3` hash

**Performance targets:**
- Cold scan 10k files: < 200ms
- Cold scan 100k files: < 2s
- Incremental re-scan (10 changed): < 50ms

### 4. Data Model

```
TodoItem {
  id: String,                // deterministic hash of (file, line, content)
  file: PathBuf,             // relative to repo root
  line: u32,                 // 1-indexed
  column: u32,
  tag: Tag,                  // enum: Todo, Fixme, Hack, Xxx, Bug, Note
  assignee: Option<String>,  // from TODO(name)
  priority: Option<Priority>,// P0-P3
  message: String,
  context: Vec<String>,
  // Phase 2
  author: Option<String>,
  date: Option<DateTime>,
  commit: Option<String>,
}
```

**Storage: In-memory + JSON cache file** (not SQLite). No JOINs needed, zero deps, human-readable, simple file write. SQLite only warranted if querying becomes important in Phase 3.

### 5. Configuration

Hierarchy: CLI flags > `.todo.toml` (project) > `~/.config/todo/config.toml` (global) > defaults.

**TOML over YAML**: Rust ecosystem convention, simpler spec, no YAML footguns.

### 6. Extension Points

- **Phase 1**: No plugin system. Built-in formatters: table, JSON, markdown, SARIF
- **Phase 2**: Internal `Reporter` trait for new output formats
- **Phase 3**: WASM plugins via `wasmtime` (only if adoption warrants it)

### 7. Distribution

| Channel | Priority | Command |
|---------|----------|---------|
| GitHub Releases | P0 | Download binary |
| `cargo install` | P0 | Automatic from crates.io |
| Homebrew tap | P1 | `brew install todocli` |
| npm wrapper | P2 | `npx todo-cli` |

Cross-compilation: x86_64 + aarch64 for macOS, Linux, Windows. Binary size < 5MB stripped.

### Architecture Diagram

```
┌─────────────────────────────────────────────┐
│                  CLI Layer                   │
│   clap v4 (derive) → Commands & Args        │
├─────────────────────────────────────────────┤
│                Scanner Layer                 │
│  ignore crate → Regex pre-filter → tree-    │
│  (walk)          sitter validate             │
│              → Vec<TodoItem>                 │
├─────────────────────────────────────────────┤
│              Reporter Layer                  │
│  Table │ JSON │ Markdown │ SARIF             │
├─────────────────────────────────────────────┤
│              Cache Layer                     │
│  File hash cache (JSON) for incremental scan │
└─────────────────────────────────────────────┘
```

### Key Crate Dependencies

| Crate | Purpose |
|-------|---------|
| `clap` v4 | CLI argument parsing |
| `ignore` | Parallel dir walk + gitignore |
| `regex` | TODO pattern matching |
| `rayon` | Data parallelism |
| `serde` + `serde_json` | Serialization |
| `comfy-table` | Terminal table output |
| `tree-sitter` | AST validation (Phase 2) |
| `git2` | Git blame (Phase 2) |

---

## Agent 3: Devil's Advocate

### 1. Does This Need to Exist? — Almost certainly not.

**The incumbent landscape is brutal:**
- `rg TODO` — 0.2s, zero setup, already muscle memory
- VS Code Todo Tree — 6.8M+ installs, real-time, click-to-navigate
- JetBrains IDEs — built-in TODO panels
- GitHub Code Search — `TODO in:file repo:myorg`
- leasot — 15-20k weekly npm downloads, 49+ languages
- Google's `todo-tracks` — web dashboard, 186 stars, effectively abandoned
- Khan Academy's `todo-tools` — another attempt, another quiet repo

**The graveyard evidence:** Google built `todo-tracks` with infinite resources and it sits at 186 stars. If Google couldn't make this category work, that's a strong signal.

### 2. The TODO Anti-Pattern — 47% of TODOs are noise

**Academic evidence (ACM TOSEM 2024):**
- 46.7% of TODO comments are low-quality — ambiguous, lack information, or useless
- Low-quality TODOs persist for extended periods with compounding negative effects

**Real-world evidence:**
- Linux kernel: 3,000+ TODOs, many over a decade old, 2,380 in driver code alone
- In well-maintained OSS projects, 74% of SATD entries are removed within 180 days
- Design debt TODOs (the important ones) persist the longest

**The uncomfortable truth:** Building a tool that surfaces noise more efficiently doesn't create value.

### 3. Technical Risks

- **Comment parsing false positives**: `const TODO_LIST = items`, Spanish "todo" = "all", string literals, generated code
- **Git blame unreliability**: Squash merges attribute to merger, rebases distort age, shallow clones have zero history
- **Performance**: Can't beat ripgrep; adding blame/metadata only makes it slower
- **The CI trap**: Too fast = basically `rg TODO` with colors; too thorough = too slow for CI

### 4. Adoption Barriers

- **Muscle memory**: Developers type `rg TODO` reflexively — switching requires conscious effort for months
- **Team buy-in paradox**: Structured metadata requires everyone to write TODOs in a specific format, but adoption requires the tool to already be valuable
- **CI hostage risk**: Slow scan → delayed deploys; false positive → broken build; upgrade breaks → blocked releases

### 5. Failure Modes

1. First-run wall of text (500+ TODOs) → instant close terminal
2. False positives in first 10 results → trust destroyed permanently
3. Slower than `rg` → users go back
4. Blame data wrong → credibility gone
5. Requires config → dead on arrival
6. Report fatigue → tool becomes invisible noise

### 6. The ONE Thing That Would Make This Worth Building

**Branch-scoped TODO awareness for your current work session.**

> "Show me the TODOs I introduced or touched in my current branch, with enough context to decide if they should be tickets before I open a PR."

Why this works:
1. **Single-user value** — no team buy-in needed
2. **No muscle memory conflict** — run before PR, not instead of `rg TODO`
3. **Small surface area** — only YOUR changes, not 3,000 legacy TODOs
4. **Actionable** — 3-5 TODOs you just wrote → convert to tickets or resolve
5. **CI-native** — `todo check --delta main` only fails on NEW TODOs
6. **Actually differentiated** — `rg TODO` doesn't do this

**Kill criterion:** Ship as a single command. If you don't use it before every PR for 30 days, kill the project.

---

## Synthesis: Three-Agent Consensus

### Where All Three Agree

1. **Zero-config is non-negotiable** — if it needs a config file, it's dead
2. **Speed must match ripgrep** — even 2x slower and users go back
3. **Branch-scoped scanning is the killer differentiator**
4. **Don't build a task manager** — scope creep toward half-baked Jira
5. **Ship in ~2 weeks, validate with daily use, kill if unused after 30 days**

### Key Tensions

| Question | UX | Architecture | Devil's Advocate |
|----------|-----|-------------|-----------------|
| Default output? | Grouped by file, all TODOs | Scan everything, cache for speed | Only branch-scoped or dead on arrival |
| Language? | Doesn't care | Rust | Prototype is Node.js — contradiction |
| Git blame? | Nice for verbose mode | Phase 2 via `git2` | Unreliable — don't rely on it |
| Should this exist? | Yes — "ripgrep for TODOs" | Yes — clean architecture | Probably not — but branch-diff is defensible |

### Recommended MVP

```bash
todo scan                    # All TODOs, grouped by file
todo scan --branch           # Only TODOs in your branch (THE feature)
todo check --delta main      # CI gate: fail only on NEW TODOs
todo scan --json             # Machine output for piping
```

Four commands. Nothing else. Strict `TAG:` colon syntax. Rust + `ignore` crate. Ship it.

**The acid test:** "Does this help me decide which TODOs to convert to tickets before I open a PR?"
