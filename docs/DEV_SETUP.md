# Clawpipe Development Setup

## Prerequisites

- Node.js 18+
- Docker & Docker Compose

## Quick Start (Docker Compose)

```bash
# Clone and navigate to clawpipe
cd clawpipe

# Start all services
docker compose up

# Access the app
# - Web UI: http://localhost:3000
# - API: http://localhost:3001
```

## Manual Setup (Without Docker)

### 1. Start the API

```bash
cd clawpipe/api
npm install
npm run dev
```

API runs on http://localhost:3001

### 2. Start the Web UI

```bash
cd clawpipe/web
npm install
npm run dev
```

Web runs on http://localhost:3000

## Environment Variables

### API (api/.env)
```env
PORT=3001
NODE_ENV=development
```

### Web (web/.env)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Available Scripts

### API
```bash
cd api
npm run dev      # Start in development mode
npm run build    # Build for production
npm start        # Start production server
```

### Web
```bash
cd web
npm run dev      # Start Next.js dev server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Project Structure

```
clawpipe/
├── engine/           # Core test runner + scenario definitions
│   ├── src/         # Engine implementation
│   ├── types/       # TypeScript definitions
│   └── scenarios/   # Scenario pack JSON files
├── api/             # Fastify HTTP server
│   └── src/
├── web/             # Next.js UI
│   ├── app/        # App router pages
│   ├── components/ # React components
│   └── lib/        # API client
├── docs/            # Documentation
└── docker-compose.yml
```

## Testing the Demo

1. Open http://localhost:3000
2. Click "Run Demo Crash Test"
3. Watch the demo run with fake results
4. View the detailed results page

## Adding New Scenario Packs

1. Create a JSON file in `engine/scenarios/`
2. Follow the schema in `engine/types/scenario.ts`
3. The pack will automatically be available via the API

## Troubleshooting

### Port Already in Use
```bash
# Find process using port
lsof -i :3000
lsof -i :3001

# Kill it
kill -9 <PID>
```

### Node Modules Issues
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Docker Issues
```bash
# Rebuild containers
docker compose build --no-cache
docker compose up
```
