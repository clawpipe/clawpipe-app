# CLAWPIPE - Getting Started

> Arcade for multi-agent swarms. Crash test your AI agents. Earn scores. Ship with confidence.

## Quick Start

```bash
# Install CLI
npm install -g clawpipe

# Run a test
clawpipe run --pack basic-sanity

# View results
clawpipe run --pack basic-sanity --format markdown
```

## Scenario Packs

| Pack | Difficulty | Description |
|------|------------|-------------|
| `basic-sanity` | 1/5 | Quick sanity check - can your swarm do basic things? |
| `basic-gauntlet` | 2/5 | Walking while juggling - core functionality under pressure |
| `tool-chaos` | 3/5 | Everything breaks eventually - tool robustness testing |
| `prompt-hell` | 4/5 | Ambiguity is the enemy - instruction handling stress test |
| `memory-stress` | 4/5 | Do you remember? - Long trajectory recall |

## Score Levels

| Score | Level | Color |
|-------|-------|-------|
| 86-100 | Diamond Cortex | Cyan |
| 71-85 | Titanium Hive | Green |
| 51-70 | Steel Swarm | Yellow |
| 31-50 | Bronze Claw | Orange |
| 0-30 | Paper Armor | Red |

## CLI Commands

```bash
# List available packs
clawpipe list

# Run a specific pack
clawpipe run --pack tool-chaos

# Specify output directory
clawpipe run --pack basic-sanity --output ./results

# Output format
clawpipe run --pack basic-sanity --format json    # JSON only
clawpipe run --pack basic-sanity --format markdown # Markdown only
clawpipe run --pack basic-sanity --format both    # Both (default)
```

## Web UI

Start the web interface:

```bash
# Start API server
cd api && npm run dev

# Start web UI (in another terminal)
cd web && npm run dev
```

- Web UI: http://localhost:3000
- API: http://localhost:3001

## Configuration

Environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `API_URL` | API endpoint | http://localhost:3001 |
| `OUTPUT_DIR` | Report output directory | ./reports |

## Badges

Earn badges by completing scenario packs:

- 🏅 **Basic Survivor** - Complete basic-sanity
- 🔧 **Tool Chaos V1** - Complete tool-chaos  
- 🧠 **Prompt Master** - Complete prompt-hell
- 💎 **Memory Champion** - Complete memory-stress

## CI Integration

Add to your GitHub Actions:

```yaml
- name: Run Clawpipe Tests
  run: |
    npx clawpipe run --pack basic-sanity --format json > results.json
```

## Support

- Discord: https://discord.gg/clawpipe
- GitHub: https://github.com/clawpipe/clawpipe-app

---

*Generated for Clawpipe v1.0*
