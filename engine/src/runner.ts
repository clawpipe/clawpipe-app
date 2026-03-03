// Fake Engine - Returns deterministic dummy results for UI development
import { 
  ScenarioPack, 
  RunResult, 
  RunStatus, 
  Badge,
  SubScore,
  Failure,
  ScenarioResult,
  ScenarioStatus
} from '../types';

// In-memory storage for demo
const runs: Map<string, RunResult> = new Map();

// Badge definitions
const BADGES: Record<string, Badge> = {
  'basic-survivor': {
    id: 'basic-survivor',
    name: 'Basic Survivor',
    description: 'Completed Basic Gauntlet without critical failures',
    icon: '🏅',
    rarity: 'common'
  },
  'tool-chaos-v1': {
    id: 'tool-chaos-v1',
    name: 'Tool Chaos V1.0',
    description: 'Survived the Tool Chaos pack',
    icon: '🔧',
    rarity: 'uncommon'
  },
  'prompt-master': {
    id: 'prompt-master',
    name: 'Prompt Master',
    description: 'Mastered the Prompt Hell pack',
    icon: '🧠',
    rarity: 'rare'
  },
  'memory-champion': {
    id: 'memory-champion',
    name: 'Memory Champion',
    description: 'Conquered the Memory Stress pack',
    icon: '💎',
    rarity: 'epic'
  }
};

// Generate deterministic results based on pack ID
function generateFakeResults(packId: string, targetName: string): RunResult {
  const runId = `run_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const startedAt = new Date().toISOString();
  
  // Deterministic "randomness" based on pack
  const seed = packId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const random = (mod: number) => (seed * 9301 + 49297) % 233280 % mod;
  
  // Generate scenario results
  let scenarioResults: ScenarioResult[] = [];
  let passedCount = 0;
  let failedCount = 0;
  
  const packScenarios: Record<string, number> = {
    'basic-gauntlet': 3,
    'tool-chaos': 4,
    'prompt-hell': 4,
    'memory-stress': 4
  };
  
  const numScenarios = packScenarios[packId] || 3;
  
  for (let i = 0; i < numScenarios; i++) {
    const scenarioPass = random(100) > 35; // 65% pass rate
    const status: ScenarioStatus = scenarioPass ? 'pass' : (random(100) > 50 ? 'partial' : 'fail');
    
    if (status === 'pass') passedCount++;
    if (status === 'fail') failedCount++;
    
    scenarioResults.push({
      scenario_id: `${packId.charAt(0).toUpperCase()}-${i + 1}`,
      scenario_name: `Scenario ${i + 1}`,
      status,
      latency_ms: 500 + random(2000),
      assertions: [
        { type: 'status', pass: status !== 'fail' }
      ]
    });
  }
  
  // Calculate score
  const score = Math.round(((passedCount * 1) + (numScenarios - passedCount - failedCount) * 0.5) / numScenarios * 100);
  
  // Generate failures for failed scenarios
  const failures: Failure[] = [];
  if (failedCount > 0) {
    const failureTypes = ['timeout', 'tool_error', 'prompt_confusion', 'memory_overflow', 'race_condition'] as const;
    const severities = ['low', 'medium', 'high', 'critical'] as const;
    const narratives = [
      'Agent waited 30s for Tool X but it never responded. Consider adding timeout handling.',
      'Tool returned 500 error and agent continued as if nothing happened. Add error handling.',
      'Agent got confused by ambiguous instruction and froze. Add clarification prompts.',
      'Context exceeded limit during long task. Implement context chunking.',
      'Two agents tried to modify same resource simultaneously. Add locking.'
    ];
    const fixes = [
      'Add timeout handling with configurable limits',
      'Implement proper error catching and recovery',
      'Add max retry guards and clarification prompts',
      'Implement context window management',
      'Add mutex locks or message queues'
    ];
    
    for (let i = 0; i < Math.min(failedCount, 3); i++) {
      const idx = random(5);
      failures.push({
        id: `fail_${i + 1}`,
        scenario_id: `${packId.charAt(0).toUpperCase()}-${i + 1}`,
        scenario_name: `Scenario ${i + 1}`,
        iteration: 1,
        agents_involved: ['Agent A', 'Agent B'].slice(0, random(2) + 1),
        failure_type: failureTypes[idx],
        narrative: narratives[idx],
        suggested_fix: fixes[idx],
        severity: severities[random(4)]
      });
    }
  }
  
  // Calculate sub-scores
  const subScores: SubScore[] = [
    { category: 'tool_robustness', score: packId === 'tool-chaos' ? score : 70 + random(25), weight: 1.0 },
    { category: 'instruction_following', score: packId === 'prompt-hell' ? score : 65 + random(30), weight: 1.0 },
    { category: 'recovery', score: 60 + random(35), weight: 1.0 },
    { category: 'memory_integrity', score: packId === 'memory-stress' ? score : 55 + random(40), weight: 1.0 },
    { category: 'basic_functionality', score: packId === 'basic-gauntlet' ? score : 75 + random(20), weight: 1.0 }
  ];
  
  // Badges earned
  const badgesEarned: Badge[] = [];
  if (score >= 50) {
    if (packId === 'basic-gauntlet') badgesEarned.push(BADGES['basic-survivor']);
    if (packId === 'tool-chaos') badgesEarned.push(BADGES['tool-chaos-v1']);
    if (packId === 'prompt-hell') badgesEarned.push(BADGES['prompt-master']);
    if (packId === 'memory-stress') badgesEarned.push(BADGES['memory-champion']);
  }
  
  const completedAt = new Date().toISOString();
  
  const result: RunResult = {
    id: runId,
    target_id: 'demo-target',
    target_name: targetName,
    pack_id: packId,
    pack_name: packId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    status: 'completed',
    score,
    sub_scores: subScores,
    failures,
    scenario_results: scenarioResults,
    badges_earned: badgesEarned,
    started_at: startedAt,
    completed_at: completedAt,
    duration_ms: 2000 + random(5000)
  };
  
  runs.set(runId, result);
  return result;
}

// Simulate async execution
export async function runEngine(
  packId: string, 
  targetName: string,
  _targetEndpoint?: string
): Promise<RunResult> {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000));
  return generateFakeResults(packId, targetName);
}

export function getRun(runId: string): RunResult | undefined {
  return runs.get(runId);
}

export function getAllRuns(): RunResult[] {
  return Array.from(runs.values()).sort((a, b) => 
    new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
  );
}

export function getRunSummaries() {
  return getAllRuns().map(r => ({
    id: r.id,
    target_name: r.target_name,
    pack_name: r.pack_name,
    score: r.score,
    status: r.status,
    started_at: r.started_at,
    completed_at: r.completed_at
  }));
}

export { BADGES };
