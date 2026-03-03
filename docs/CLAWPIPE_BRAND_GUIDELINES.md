# CLAWPIPE BRAND GUIDELINES v1.0

**Version:** 1.0  
**Date:** 2026-03-03  
**Status:** OPERATIONAL

---

## 1. BRAND OVERVIEW

**Name:** Clawpipe  
**Tagline:** Arcade for Multi-Agent Swarms  
**Mission:** Crash test your AI agents. Earn scores. Ship with confidence.

**Brand Personality:**
- Playful arcade aesthetic
- High-signal, low-noise
- Honest (we tell you what's broken)
- Game-like progression (badges, scores, levels)

---

## 2. COLOR PALETTE

### Primary Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--accent-cyan` | `#00D9FF` | Primary actions, success, score highlights |
| `--accent-orange` | `#FF9500` | Warnings, medium severity, Bronze Claw |
| `--accent-red` | `#FF3B30` | Errors, critical failures, Paper Armor |

### Background Colors (Dark Theme Default)

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-primary` | `#0D1117` | Page backgrounds |
| `--bg-secondary` | `#161B22` | Cards, panels |
| `--bg-tertiary` | `#21262D` | Hover states, inputs |

### Text Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--text-primary` | `#E6EDF3` | Headings, body |
| `--text-secondary` | `#8B949E` | Muted text, captions |

### Border

| Token | Hex | Usage |
|-------|-----|-------|
| `--border` | `#30363D` | Dividers, outlines |

---

## 3. SCORE LEVEL COLORS

| Level | Score | Color | Hex |
|-------|-------|-------|-----|
| Diamond Cortex | 86-100 | Cyan | `#00D9FF` |
| Titanium Hive | 71-85 | Green | `#30D158` |
| Steel Swarm | 51-70 | Yellow | `#FFD60A` |
| Bronze Claw | 31-50 | Orange | `#FF9500` |
| Paper Armor | 0-30 | Red | `#FF3B30` |

---

## 4. TYPOGRAPHY

### Font Stack

| Element | Font | Weight | Size |
|---------|------|--------|------|
| Display (Score) | JetBrains Mono | 800 | 72px |
| H1 | Inter | 700 | 32px |
| H2 | Inter | 600 | 24px |
| H3 | Inter | 600 | 18px |
| Body | Inter | 400 | 16px |
| Code/Logs | JetBrains Mono | 400 | 14px |
| Caption | Inter | 500 | 12px |

### Usage Rules

- **JetBrains Mono**: Scores, code, logs, numbers, badges
- **Inter**: All other text
- **No more than 2 fonts on a page**

---

## 5. TONE & VOICE

### Tone Principles

1. **Playful Arcade** — We're a game. Use action words,点数 excitement.
2. **High-Signal** — Every word earns its place. No fluff.
3. **Honest** — Tell users exactly what's broken. Don't soft-pedal failures.

### Voice Guidelines

| Do | Don't |
|----|-------|
| "Your swarm failed 3 tests" | "There were some issues detected" |
| "Run the gauntlet" | "Execute a test suite" |
| "You earned Bronze Claw" | "Your score is 42" |
| "This matters because..." | "Please note that..." |

### Writing Examples

- **Button text:** "Run Demo" not "Click here to run a demo"
- **Failure messages:** Start with what happened, then why it matters
- **Success messages:** Celebrate with emoji + score + badge

---

## 6. LOGO CONCEPTS

### Concept A: Crash Test Dummy 🤖

```
    ╔═══════════════╗
    ║   🤖🦞       ║
    ║  /    \      ║
    ║  ⎽    ⎽     ║
    ║  |____|      ║
    ╚═══════════════╝
       CLAWPIPE
```

- Represents resilience testing
- Friendly robot aesthetic
- Works at small sizes (favicon)

### Concept B: Gladiator Arena ⚔️

```
    ╔═══════════════╗
    ║   🦞⚔️       ║
    ║  ╔═══╗       ║
    ║  ║ A ║       ║
    ║  ╚═══╝       ║
    ╚═══════════════╝
       CLAWPIPE
```

- Competition/games theme
- Multi-agent = multiple gladiators
- Action-oriented

### Recommended: Hybrid (Concept A + B)

Use Crash Test Dummy as primary, Gladiator for competitive features.

---

## 7. UI COMPONENT STYLES

### Buttons

- **Primary**: Cyan background, black text, rounded-lg
- **Secondary**: Transparent, border, white text
- **Danger**: Red background, white text

### Cards

- Background: `--bg-secondary`
- Border: 1px solid `--border`
- Radius: 8px (rounded-md)
- Padding: 24px (p-6)

### Badges/Pills

- Full rounded (rounded-full)
- Small text (text-xs or text-sm)
- Color matches severity/level

### Score Display

- Large JetBrains Mono
- Animated count-up on load
- Glow effect matching level color

---

## 8. ANIMATIONS

### Score Animation
- Duration: 1.5s
- Easing: ease-out
- Effect: Count up from 0

### Glow Effects
- Subtle pulse for high scores (Titanium+)
- Strong pulse for Diamond Cortex

### Transitions
- Default: 200ms ease-in-out
- Hover states: 150ms

---

## 9. ICONS & EMOJI

### Recommended Icons

| Concept | Emoji/Icon |
|---------|------------|
| Score/Level | 🏆 |
| Failure/Error | ❌ |
| Warning | ⚠️ |
| Success | ✅ |
| Tool | 🔧 |
| Brain/Prompt | 🧠 |
| Memory | 💎 |
| Run/Test | ▶️ |
| Badge | 🏅 |

---

*This document defines the Clawpipe brand. Apply consistently across all surfaces.*
