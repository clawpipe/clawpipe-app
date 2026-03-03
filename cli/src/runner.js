/**
 * Scenario Runner - Loads and executes scenario packs from JSON
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to scenario files
const SCENARIOS_DIR = join(__dirname, '..', '..', 'engine', 'scenarios');

// Map of pack IDs to filenames
const SCENARIO_FILES = {
  'basic-sanity': 'basic-sanity.json',
  'basic-gauntlet': 'basic-gauntlet.json',
  'tool-chaos': 'tool-chaos.json',
  'prompt-hell': 'prompt-hell.json',
  'memory-stress': 'memory-stress.json'
};

/**
 * Load a scenario pack from JSON file
 */
export function loadScenarioPack(packId) {
  const filename = SCENARIO_FILES[packId];
  if (!filename) {
    throw new Error(`Unknown scenario pack: ${packId}`);
  }
  
  const filepath = join(SCENARIOS_DIR, filename);
  if (!existsSync(filepath)) {
    throw new Error(`Scenario file not found: ${filepath}`);
  }
  
  const content = readFileSync(filepath, 'utf-8');
  return JSON.parse(content);
}

/**
 * Get list of available scenario packs
 */
export function getAvailablePacks() {
  return Object.keys(SCENARIO_FILES);
}

/**
 * Run a scenario pack (simulated execution)
 * Returns real scenario definitions with simulated pass/fail
 */
export async function runScenarioPack(packId, targetUrl = null) {
  const pack = loadScenarioPack(packId);
  const startTime = Date.now();
  
  const results = [];
  let passedCount = 0;
  let failedCount = 0;
  
  // Execute each scenario (simulated for now, but using real scenario definitions)
  for (const scenario of pack.scenarios) {
    // Simulate scenario execution with ~70% pass rate (deterministic based on scenario id)
    // Use only the numeric part for better distribution
    const scenarioId = scenario.scenario_id || scenario.id || 'unknown';
    const numPart = scenarioId.replace(/[^0-9]/g, '');
    const num = parseInt(numPart) || 1;
    const passed = (num * 7) % 10 > 2; // ~70% pass rate (7/10 = 70%)
    
    if (passed) {
      passedCount++;
    } else {
      failedCount++;
    }
    
    results.push({
      scenario_id: scenarioId,
      scenario_name: scenario.name,
      description: scenario.description,
      status: passed ? 'pass' : 'fail',
      latency_ms: 500 + (num * 137 % 2000),
      assertions: passed ? [
        { type: 'status', pass: true }
      ] : [
        { type: 'status', pass: false }
      ],
      error: passed ? null : getSimulatedError(scenarioId)
    });
  }
  
  // Calculate overall score
  const totalScenarios = pack.scenarios.length;
  const score = Math.round((passedCount / totalScenarios) * 100);
  
  // Calculate sub-scores based on categories (if defined)
  const subScores = calculateSubScores(pack, results);
  
  // Build failures list
  const failures = results
    .filter(r => r.status === 'fail')
    .map(r => ({
      scenario_id: r.scenario_id,
      scenario_name: r.scenario_name,
      error: r.error
    }));
  
  const endTime = Date.now();
  
  return {
    id: `${packId}_${Date.now()}`,
    pack_id: packId,
    pack_name: pack.name || packId,
    pack_description: pack.description,
    target_url: targetUrl,
    score,
    sub_scores: subScores,
    status: 'completed',
    scenarios: results,
    failures,
    badges_earned: getBadges(score, pack),
    started_at: new Date(startTime).toISOString(),
    completed_at: new Date(endTime).toISOString(),
    duration_ms: endTime - startTime
  };
}

/**
 * Calculate sub-scores for different categories
 */
function calculateSubScores(pack, results) {
  const subScores = [];
  
  // Determine categories based on pack type
  const packCategories = {
    'tool-chaos': ['tool_robustness'],
    'prompt-hell': ['instruction_following'],
    'memory-stress': ['memory_integrity'],
    'basic-gauntlet': ['basic_functionality'],
    'basic-sanity': ['basic_functionality', 'recovery']
  };
  
  const categories = packCategories[pack.id] || ['general'];
  
  for (const category of categories) {
    // For now, calculate sub-score as a variation of overall score
    const seed = category.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const variation = (seed * 7) % 20 - 10; // -10 to +10 variation
    const categoryResults = results.filter(r => r.status === 'pass').length;
    const total = results.length;
    const categoryScore = Math.max(0, Math.min(100, Math.round((categoryResults / total) * 100) + variation));
    
    subScores.push({
      category,
      score: categoryScore,
      weight: 1.0
    });
  }
  
  return subScores;
}

/**
 * Get simulated error message based on scenario
 */
function getSimulatedError(scenarioId) {
  const errors = [
    'Agent waited for response but timed out after 30s',
    'Tool returned 500 error and agent did not handle it',
    'Agent got confused by ambiguous instruction',
    'Context exceeded limit during task execution',
    'Two agents attempted simultaneous modification'
  ];
  
  const seed = scenarioId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return errors[seed % errors.length];
}

/**
 * Get badges earned based on score and pack
 */
function getBadges(score, pack) {
  const badges = [];
  
  if (score < 50) return badges;
  
  const badgeMap = {
    'basic-sanity': { id: 'basic-survivor', name: 'Basic Survivor', icon: '🏅' },
    'basic-gauntlet': { id: 'basic-survivor', name: 'Basic Survivor', icon: '🏅' },
    'tool-chaos': { id: 'tool-chaos-v1', name: 'Tool Chaos V1', icon: '🔧' },
    'prompt-hell': { id: 'prompt-master', name: 'Prompt Master', icon: '🧠' },
    'memory-stress': { id: 'memory-champion', name: 'Memory Champion', icon: '💎' }
  };
  
  const badge = badgeMap[pack.id];
  if (badge) {
    badges.push(badge);
  }
  
  return badges;
}

export default {
  loadScenarioPack,
  getAvailablePacks,
  runScenarioPack
};
