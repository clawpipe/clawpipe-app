# CLAWPIPE REPO AND UI SYSTEM v1.0

**Version:** 1.0  
**Date:** 2026-03-03  
**Author:** FORGE  
**Status:** OPERATIONAL

---

## 1. TECH STACK DECISIONS

### 1.1 Frontend: Next.js 14 + TypeScript + TailwindCSS

**Decision:** Next.js 14 (App Router) with TypeScript and TailwindCSS

**Rationale:**
- **Next.js**: Industry-standard React framework with excellent SSR/SSG support. App Router provides clean routing and server components.
- **TypeScript**: Required for type safety across the monorepo. Enables shared types between frontend and engine.
- **TailwindCSS**: Utility-first CSS framework enables rapid UI development. Dark mode support is first-class.

**Alternatives Considered:**
- React + Vite: Less suited for full-stack React apps; no built-in routing
- Vue/Nuxt: Team expertise in React; faster iteration

### 1.2 Backend: Fastify (Node/TypeScript)

**Decision:** Fastify with TypeScript

**Rationale:**
- **Fastify**: 2-3x faster than Express for JSON APIs. Excellent TypeScript support. Schema-based validation.
- **Node/TypeScript**: Shared language with frontend enables code sharing. Same runtime for full-stack development.

**Alternatives Considered:**
- Express: Slower, less type-safe out of the box
- NestJS: Overkill for v1; steeper learning curve
- Python/FastAPI: Would require separate language expertise

### 1.3 Engine: TypeScript Module

**Decision:** TypeScript module within monorepo

**Rationale:**
- **TypeScript**: Direct type sharing with API and frontend. No serialization boundary.
- **Extensible**: Easy to swap fake runner with real execution engine later.

**Future Considerations:**
- Could separate into microservice if engine becomes computationally expensive
- Could add WebAssembly modules for performance-critical scenarios

### 1.4 Reports: JSON + Markdown

**Decision:** JSON API responses + Markdown documentation

**Rationale:**
- **JSON**: Machine-readable, easy to parse in CI/CD pipelines
- **Markdown**: Human-readable reports, easy to convert to PDF/HTML

---

## 2. REPO LAYOUT

```
clawpipe/
├── engine/                 # Core test runner + scenario definitions
│   ├── src/               # Engine implementation
│   ├── types/             # TypeScript definitions
│   └── scenarios/         # Scenario pack definitions
├── api/                   # HTTP interface
│   └── src/
├── web/                   # Next.js UI
│   ├── app/               # App router pages
│   ├── components/        # UI components
│   └── lib/               # API client
├── cli/                   # Local CLI (future)
├── docs/                  # Documentation
├── docker-compose.yml
└── README.md
```

---

## 3. UI DESIGN SYSTEM

### 3.1 Color Palette

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--bg-primary` | `#FFFFFF` | `#0D1117` | Page backgrounds |
| `--bg-secondary` | `#F6F8FA` | `#161B22` | Cards, panels |
| `--accent-cyan` | `#00D9FF` | `#00D9FF` | Primary actions |
| `--accent-orange` | `#FF9500` | `#FF9500` | Warnings |
| `--accent-red` | `#FF3B30` | `#FF3B30` | Errors |

### 3.2 Score Levels

| Score | Level | Color |
|-------|-------|-------|
| 86-100 | Diamond Cortex | Cyan |
| 71-85 | Titanium Hive | Green |
| 51-70 | Steel Swarm | Yellow |
| 31-50 | Bronze Claw | Orange |
| 0-30 | Paper Armor | Red |

---

## 4. MONOREPO NOTES

### Why Monorepo?

- **Shared Types**: Single source of truth for `RunResult`, `Scenario`, etc.
- **Easy Development**: Single `npm install` for full stack
- **CI/CD**: Single pipeline builds all components

### Future: TurboRepo / Nx?

Not needed yet. Current structure is simple enough. Consider adding when:
- More than 3 independent packages
- Need for distributed caching
- Team grows beyond 2-3 developers

---

## 5. CI/CD

**Current:** GitHub Actions (manual setup required)

**Pipeline:**
1. Install dependencies
2. TypeScript type check
3. Build web and API
4. (Future: Run tests)

---

*This document defines the tech stack and architectural decisions for Clawpipe v1.0*
