# Clawpipe Architecture Overview

## System Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLAWPIPE STACK                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐           │
│   │    Web UI   │────▶│     API     │────▶│   Engine    │           │
│   │  (Next.js)  │     │  (Fastify)  │     │  (Shared)   │           │
│   └─────────────┘     └─────────────┘     └─────────────┘           │
│         │                   │                   │                      │
│         │                   │                   │                      │
│         ▼                   ▼                   ▼                      │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐           │
│   │   Browser   │     │ In-Memory   │     │  Scenarios  │           │
│   │   Client    │     │   Storage   │     │    (JSON)   │           │
│   └─────────────┘     └─────────────┘     └─────────────┘           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## Components

### 1. Web UI (Next.js)

**Purpose:** User-facing interface for running tests and viewing results.

**Key Pages:**
- `/` - Landing page with demo run
- `/run` - Run wizard (target → pack → confirm)
- `/runs` - Run history list
- `/runs/[id]` - Detailed run results

**Tech Stack:**
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Framer Motion (animations)

### 2. API (Fastify)

**Purpose:** HTTP interface for run submission and results.

**Endpoints:**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/packs` | List scenario packs |
| GET | `/api/packs/:id` | Get pack details |
| POST | `/api/run` | Execute a run |
| GET | `/api/runs` | List all runs |
| GET | `/api/runs/:id` | Get run details |

**Tech Stack:**
- Node.js
- Fastify
- TypeScript

### 3. Engine

**Purpose:** Core test runner logic (currently mocked for demo).

**Types:**
- `TargetConfig` - Target system configuration
- `ScenarioPack` - Collection of scenarios
- `Scenario` - Individual test case
- `RunResult` - Aggregated run results
- `Failure` - Individual failure record

**Scenarios:**
- `basic-gauntlet` - 3 scenarios, ~5 min
- `tool-chaos` - 4 scenarios, ~15 min
- `prompt-hell` - 4 scenarios, ~20 min
- `memory-stress` - 4 scenarios, ~30 min

## Data Flow

### Run Execution Flow

```
1. User selects target + pack on /run
2. POST /api/run with { pack_id, target }
3. API loads scenario pack from engine/scenarios/
4. Engine executes scenarios (currently: fake deterministic results)
5. Engine calculates score based on pass/fail
6. Result stored in memory
7. User redirected to /runs/[id]
8. Results page fetches via GET /api/runs/:id
```

### Score Calculation

```
Global Score = (Basic × 1.0 + Tool × 1.5 + Prompt × 1.5 + Memory × 1.5) / 5.5 × 100

Per-Scenario:
- PASS = 100% of points
- PARTIAL = 50% of points  
- FAIL = 0% of points
```

## Design System

### Color Palette (Dark Mode Default)

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-primary` | `#0D1117` | Page background |
| `--bg-secondary` | `#161B22` | Cards, panels |
| `--accent-cyan` | `#00D9FF` | Primary actions |
| `--accent-red` | `#FF3B30` | Errors, failures |
| `--accent-orange` | `#FF9500` | Warnings |

### Score Levels

| Score | Level | Color |
|-------|-------|-------|
| 86-100 | Diamond Cortex | Cyan |
| 71-85 | Titanium Hive | Green |
| 51-70 | Steel Swarm | Yellow |
| 31-50 | Bronze Claw | Orange |
| 0-30 | Paper Armor | Red |

## Deployment

### Development
```bash
docker compose up
```

### Production
```bash
# Build containers
docker build -t clawpipe-api ./api
docker build -t clawpipe-web ./web

# Run
docker run -p 3001:3001 clawpipe-api
docker run -p 3000:3000 clawpipe-web
```

## Future Phases

- **v1.1**: Real engine execution, PostgreSQL storage
- **v1.2**: Custom scenario builder, analytics dashboard
- **v2.0**: Team management, global leaderboards, marketplace
