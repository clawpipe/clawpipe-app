// API Client for Clawpipe

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Pack {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  duration_minutes: number;
  scenario_count: number;
  badges: string[];
}

export interface RunSummary {
  id: string;
  target_name: string;
  pack_name: string;
  score: number;
  status: string;
  started_at: string;
  completed_at?: string;
}

export interface Failure {
  id: string;
  scenario_id: string;
  scenario_name: string;
  iteration: number;
  agents_involved: string[];
  failure_type: string;
  narrative: string;
  suggested_fix: string;
  severity: string;
}

export interface SubScore {
  category: string;
  score: number;
  weight: number;
}

export interface ScenarioResult {
  scenario_id: string;
  scenario_name: string;
  status: string;
  latency_ms: number;
  assertions: { type: string; pass: boolean }[];
  error_message?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: string;
}

export interface RunResult {
  id: string;
  target_id: string;
  target_name: string;
  pack_id: string;
  pack_name: string;
  status: string;
  score: number;
  sub_scores: SubScore[];
  failures: Failure[];
  scenario_results: ScenarioResult[];
  badges_earned: Badge[];
  started_at: string;
  completed_at?: string;
  duration_ms?: number;
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }
  
  return res.json();
}

export const api = {
  // Packs
  async getPacks(): Promise<{ packs: Pack[] }> {
    return fetchJson(`${API_BASE}/api/packs`);
  },
  
  async getPack(id: string): Promise<{ pack: Pack }> {
    return fetchJson(`${API_BASE}/api/packs/${id}`);
  },
  
  // Runs
  async runPack(packId: string, targetName?: string): Promise<{ run: RunResult }> {
    return fetchJson(`${API_BASE}/api/run`, {
      method: 'POST',
      body: JSON.stringify({
        pack_id: packId,
        target_name: targetName || 'Demo Target',
        target: { name: targetName || 'Demo Target', type: 'demo' }
      }),
    });
  },
  
  async getRuns(): Promise<{ runs: RunSummary[] }> {
    return fetchJson(`${API_BASE}/api/runs`);
  },
  
  async getRun(id: string): Promise<{ run: RunResult }> {
    return fetchJson(`${API_BASE}/api/runs/${id}`);
  },
};

// Score level helpers
export function getScoreLevel(score: number): {
  label: string;
  color: string;
  glowClass: string;
} {
  if (score >= 86) return { label: 'Diamond Cortex', color: '#00D9FF', glowClass: 'glow-diamond' };
  if (score >= 71) return { label: 'Titanium Hive', color: '#30D158', glowClass: 'glow-titanium' };
  if (score >= 51) return { label: 'Steel Swarm', color: '#FFD60A', glowClass: 'glow-steel' };
  if (score >= 31) return { label: 'Bronze Claw', color: '#FF9500', glowClass: 'glow-bronze' };
  return { label: 'Paper Armor', color: '#FF3B30', glowClass: 'glow-paper' };
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'easy': return 'text-green-400';
    case 'medium': return 'text-yellow-400';
    case 'hard': return 'text-orange-400';
    case 'extreme': return 'text-red-400';
    default: return 'text-gray-400';
  }
}
