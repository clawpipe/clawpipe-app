import Fastify from 'fastify';
import cors from '@fastify/cors';
import { runEngine, getRun, getRunSummaries } from '../../engine/src/runner.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fastify = Fastify({ logger: true });

// Register CORS
await fastify.register(cors, { 
  origin: true 
});

// Load scenario packs
function loadPacks() {
  const packs: Record<string, any> = {};
  const packIds = ['basic-gauntlet', 'tool-chaos', 'prompt-hell', 'memory-stress'];
  
  for (const packId of packIds) {
    try {
      const data = readFileSync(join(__dirname, '..', '..', 'engine', 'scenarios', `${packId}.json`), 'utf-8');
      packs[packId] = JSON.parse(data);
    } catch (e) {
      console.error(`Failed to load pack ${packId}:`, e);
    }
  }
  return packs;
}

const scenarioPacks = loadPacks();

// Health check
fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// List available scenario packs
fastify.get('/api/packs', async () => {
  const packs = Object.values(scenarioPacks).map(pack => ({
    id: pack.id,
    name: pack.name,
    description: pack.description,
    difficulty: pack.difficulty,
    duration_minutes: pack.duration_minutes,
    scenario_count: pack.scenarios.length,
    badges: pack.badges
  }));
  return { packs };
});

// Get pack details
fastify.get('/api/packs/:id', async (request, reply) => {
  const { id } = request.params as { id: string };
  const pack = scenarioPacks[id];
  
  if (!pack) {
    return reply.code(404).send({ error: 'Pack not found' });
  }
  
  return { pack };
});

// Run a scenario pack (fake engine)
fastify.post('/api/run', async (request, reply) => {
  const { target, pack_id, target_name } = request.body as any;
  
  if (!pack_id) {
    return reply.code(400).send({ error: 'pack_id is required' });
  }
  
  if (!scenarioPacks[pack_id]) {
    return reply.code(404).send({ error: 'Pack not found' });
  }
  
  const targetName = target_name || target?.name || 'Demo Target';
  
  // Run the fake engine
  const result = await runEngine(pack_id, targetName, target?.endpoint);
  
  return { run: result };
});

// Get all runs
fastify.get('/api/runs', async () => {
  const runs = getRunSummaries();
  return { runs };
});

// Get run by ID
fastify.get('/api/runs/:id', async (request, reply) => {
  const { id } = request.params as { id: string };
  const run = getRun(id);
  
  if (!run) {
    return reply.code(404).send({ error: 'Run not found' });
  }
  
  return { run };
});

// Start server
const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3001');
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`API server running on http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
