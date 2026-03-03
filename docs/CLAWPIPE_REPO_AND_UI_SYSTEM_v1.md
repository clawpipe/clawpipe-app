# CLAWPIPE REPO AND UI SYSTEM v1.0

**Version:** 1.0  
**Date:** 2026-03-03  
**Author:** FORGE  
**Status:** OPERATIONAL

---

## 1. REPO LAYOUT

```
clawpipe/
├── engine/                 # Core test runner + scenario definitions
│   ├── src/               # Engine implementation
│   │   ├── index.ts       # Main engine entry
│   │   ├── runner.ts      # Scenario execution
│   │   └── scorer.ts      # Score calculation
│   ├── types/             # TypeScript definitions
│   │   ├── scenario.ts    # Scenario, Pack, Run types
│   │   ├── target.ts      # Target config types
│   │   └── result.ts      # RunResult, Failure, Badge types
│   ├── scenarios/         # Scenario pack definitions
│   │   ├── basic-gauntlet.json
│   │   ├── tool-chaos.json
│   │   ├── prompt-hell.json
│   │   └── memory-stress.json
│   └── package.json
├── api/                   # HTTP interface
│   ├── src/
│   │   ├── index.ts       # Fastify server
│   │   ├── routes/
│   │   │   ├── runs.ts    # Run CRUD endpoints
│   │   │   └── packs.ts   # Pack listing
│   │   └── services/
│   │       └── engine.ts  # Engine integration
│   └── package.json
├── web/                   # Next.js UI
│   ├── app/               # App router pages
│   │   ├── page.tsx       # Landing page
│   │   ├── run/
│   │   │   └── page.tsx   # Run wizard
│   │   ├── runs/
│   │   │   ├── page.tsx   # History list
│   │   │   └── [id]/
│   │   │       └── page.tsx # Run detail
│   │   └── layout.tsx
│   ├── components/        # UI components
│   │   ├── ui/            # Primitives
│   │   ├── landing/       # Landing page components
│   │   ├── wizard/        # Run wizard components
│   │   └── results/       # Results display
│   ├── lib/
│   │   └── api.ts         # API client
│   ├── tailwind.config.ts
│   └── package.json
├── cli/                   # Local CLI (future)
│   └── src/
├── docs/
│   ├── DEV_SETUP.md
│   └── ARCHITECTURE_OVERVIEW.md
├── docker-compose.yml
└── README.md
```

---

## 2. UI DESIGN SYSTEM

### 2.1 Color Palette

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--bg-primary` | `#FFFFFF` | `#0D1117` | Page backgrounds |
| `--bg-secondary` | `#F6F8FA` | `#161B22` | Cards, panels |
| `--bg-tertiary` | `#EAEEF2` | `#21262D` | Hover states |
| `--text-primary` | `#1F2328` | `#E6EDF3` | Headings, body |
| `--text-secondary` | `#656D76` | `#8B949E` | Muted text |
| `--accent-cyan` | `#00D9FF` | `#00D9FF` | Primary actions, success |
| `--accent-orange` | `#FF9500` | `#FF9500` | Warnings, medium severity |
| `--accent-red` | `#FF3B30` | `#FF3B30` | Errors, critical |
| `--accent-purple` | `#A855F7` | `#A855F7` | Badges, special |
| `--border` | `#D0D7DE` | `#30363D` | Dividers, outlines |

### 2.2 Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Display (Score) | JetBrains Mono | 72px | 800 |
| H1 | Inter | 32px | 700 |
| H2 | Inter | 24px | 600 |
| H3 | Inter | 18px | 600 |
| Body | Inter | 16px | 400 |
| Code/Logs | JetBrains Mono | 14px | 400 |
| Small | Inter | 14px | 400 |
| Caption | Inter | 12px | 500 |

### 2.3 Spacing System

- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px
- `3xl`: 64px

### 2.4 Border Radius

- `sm`: 4px (buttons, inputs)
- `md`: 8px (cards)
- `lg`: 12px (panels)
- `full`: 9999px (pills, badges)

---

## 3. COMPONENT PRIMITIVES

### 3.1 Core Components

#### Card
- Background: `bg-secondary`
- Border: 1px solid `border`
- Radius: `md` (8px)
- Padding: `lg` (24px)
- Shadow: subtle drop shadow in light mode

#### Badge (Score Level)
| Level | Score Range | Color | Glow |
|-------|-------------|-------|------|
| Paper Armor | 0-30 | Red | None |
| Bronze Claw | 31-50 | Orange | None |
| Steel Swarm | 51-70 | Yellow | None |
| Titanium Hive | 71-85 | Green | Subtle |
| Diamond Cortex | 86-100 | Cyan | Strong |

#### TagPill
- Small rounded pill for labels
- Variants: `default`, `success`, `warning`, `error`, `info`

#### ScoreGauge
- Circular progress indicator
- Large centered score number
- Animated fill on load
- Glow effect based on level

#### Button
- Variants: `primary` (cyan), `secondary` (outline), `danger` (red)
- Sizes: `sm`, `md`, `lg`
- States: default, hover, active, disabled

#### Input
- Text input with label
- Select dropdown
- Checkbox / Radio

#### ProgressBar
- Horizontal bar for scenario progress
- Segments for individual scenarios
- Color per status (pending/running/pass/fail)

---

## 4. SCORE VISUALIZATION

### 4.1 Score Levels

```typescript
const SCORE_LEVELS = {
  PAPER_ARMOR: { min: 0, max: 30, label: 'Paper Armor', color: '#FF3B30' },
  BRONZE_CLAW: { min: 31, max: 50, label: 'Bronze Claw', color: '#FF9500' },
  STEEL_SWARM: { min: 51, max: 70, label: 'Steel Swarm', color: '#FFD60A' },
  TITANIUM_HIVE: { min: 71, max: 85, label: 'Titanium Hive', color: '#30D158' },
  DIAMOND_CORTEX: { min: 86, max: 100, label: 'Diamond Cortex', color: '#00D9FF' },
};
```

### 4.2 Sub-Score Categories

| Category | Pack | Weight |
|----------|------|--------|
| Tool Robustness | Tool Chaos | 100% |
| Coordination | Prompt Hell | 50% |
| Instruction Handling | Prompt Hell | 100% |
| Memory Reliability | Memory Stress | 100% |
| Basic Functionality | Basic Gauntlet | 100% |

### 4.3 Animation

- Score counter: Count up from 0 to final score (1.5s, ease-out)
- Badge unlock: Scale up + pulse effect
- Progress bar: Fill animation (300ms per segment)

---

## 5. FAILURE CARDS

### 5.1 Structure

```
┌─────────────────────────────────────────┐
│ 🔴 [SEVERITY] [Scenario Name]          │
│                                          │
│ What happened:                          │
│ [Plain English narrative]                │
│                                          │
│ Why this matters:                        │
│ [Impact explanation]                    │
│                                          │
│ → Suggested fix:                         │
│ [Actionable recommendation]             │
└─────────────────────────────────────────┘
```

### 5.2 Severity Colors

- `critical`: Red (#FF3B30)
- `high`: Orange (#FF9500)
- `medium`: Yellow (#FFD60A)
- `low`: Gray (#8B949E)

---

## 6. DARK/LIGHT TOGGLE

- **Default:** Dark mode (arcade aesthetic)
- **Toggle:** Header button, top-right
- **Transition:** 200ms ease-in-out on all colors
- **Storage:** LocalStorage preference

---

*This document defines the operational UI system for Clawpipe v1.0*
