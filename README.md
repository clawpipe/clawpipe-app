# 🦞 Clawpipe

> Arcade for multi-agent swarms. Crash test your AI agents. Earn scores. Ship with confidence.

## Overview

Clawpipe is a testing platform for multi-agent systems like OpenClaw. It runs scenario packs against your swarm and produces reliability scores, failure reports, and actionable fixes.

## Features

- **4 Scenario Packs**: Basic Gauntlet, Tool Chaos, Prompt Hell, Memory Stress
- **Real-time Detection**: Watch failures as they happen
- **Shareable Scores**: Badges, scores, and detailed reports
- **CI-Ready**: JSON output, exit codes, GitHub Actions support

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js 14 + TypeScript + TailwindCSS |
| Backend | Fastify (Node/TypeScript) |
| Engine | TypeScript (extensible) |
| Reports | JSON + Markdown |

## Quick Start

```bash
# Clone the repo
git clone https://github.com/clawpipe/clawpipe.git
cd clawpipe

# Start with Docker Compose
docker compose up

# Or run manually
cd api && npm install && npm run dev
cd ../web && npm install && npm run dev
```

- **Web UI**: http://localhost:3000
- **API**: http://localhost:3001

## Project Structure

```
clawpipe/
├── engine/           # Core test runner + scenario definitions
│   ├── src/         # Engine implementation
│   ├── types/       # TypeScript definitions
│   └── scenarios/   # Scenario pack JSON files
├── api/             # Fastify HTTP server
├── web/             # Next.js UI
├── docs/            # Documentation
└── docker-compose.yml
```

## Scenario Packs

| Pack | Difficulty | Duration | Description |
|------|-------------|----------|-------------|
| Basic Gauntlet | Easy | ~5 min | Quick sanity check |
| Tool Chaos | Medium | ~15 min | Robustness under adversarial tools |
| Prompt Hell | Hard | ~20 min | Instruction handling stress test |
| Memory Stress | Hard | ~30 min | Long trajectory recall |

## Score Levels

| Score | Level | Color |
|-------|-------|-------|
| 86-100 | Diamond Cortex | Cyan |
| 71-85 | Titanium Hive | Green |
| 51-70 | Steel Swarm | Yellow |
| 31-50 | Bronze Claw | Orange |
| 0-30 | Paper Armor | Red |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/packs` | List scenario packs |
| POST | `/api/run` | Execute a run |
| GET | `/api/runs` | List all runs |
| GET | `/api/runs/:id` | Get run details |

## Contributing

Contributions welcome! Please open an issue or PR.

## License

MIT
