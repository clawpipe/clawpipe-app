#!/usr/bin/env node

/**
 * Clawpipe CLI - Run crash tests from the command line
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Types
const SCENARIO_PACKS = {
  'basic-gauntlet': 'Basic Gauntlet',
  'tool-chaos': 'Tool Chaos',
  'prompt-hell': 'Prompt Hell',
  'memory-stress': 'Memory Stress',
  'basic-sanity': 'Basic Sanity'
};

// Colors for CLI output
const colors = {
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(color, msg) {
  console.log(`${color}${msg}${colors.reset}`);
}

function info(msg) { log(colors.cyan, msg); }
function success(msg) { log(colors.green, msg); }
function warn(msg) { log(colors.yellow, msg); }
function error(msg) { log(colors.red, msg); }

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];

if (command === 'run') {
  runCommand(args.slice(1));
} else if (command === 'list') {
  listCommand();
} else if (command === '--help' || command === '-h' || !command) {
  showHelp();
} else {
  error(`Unknown command: ${command}`);
  showHelp();
}

function showHelp() {
  console.log(`
${colors.bold}Clawpipe CLI - Arcade for Multi-Agent Swarms${colors.reset}

${colors.cyan}Usage:${colors.reset}
  clawpipe <command> [options]

${colors.cyan}Commands:${colors.reset}
  run --pack <name>     Run a scenario pack
  list                  List available scenario packs
  help                  Show this help message

${colors.cyan}Options:${colors.reset}
  --pack <name>         Scenario pack to run (required for run)
  --output <dir>       Output directory for reports (default: ./reports)
  --format <format>    Output format: json, markdown, both (default: both)
  --target <url>       Target URL to test (optional)

${colors.cyan}Examples:${colors.reset}
  clawpipe run --pack basic-sanity
  clawpipe run --pack basic-gauntlet --output ./reports
  clawpipe list

${colors.cyan}Packs:${colors.reset}
  basic-sanity     Quick sanity check (5 scenarios)
  basic-gauntlet  Quick sanity check (3 scenarios)
  tool-chaos      Tool robustness (4 scenarios)
  prompt-hell     Instruction handling (4 scenarios)
  memory-stress   Memory reliability (4 scenarios)
`);
}

function listCommand() {
  info('Available scenario packs:\n');
  Object.entries(SCENARIO_PACKS).forEach(([id, name]) => {
    console.log(`  ${colors.green}•${colors.reset} ${id.padEnd(16)} ${name}`);
  });
  console.log('');
}

async function runCommand(opts) {
  let packId = 'basic-sanity';
  let outputDir = './reports';
  let format = 'both';
  let targetUrl = null;

  // Parse options
  for (let i = 0; i < opts.length; i++) {
    if (opts[i] === '--pack' && opts[i + 1]) {
      packId = opts[i + 1];
      i++;
    } else if (opts[i] === '--output' && opts[i + 1]) {
      outputDir = opts[i + 1];
      i++;
    } else if (opts[i] === '--format' && opts[i + 1]) {
      format = opts[i + 1];
      i++;
    } else if (opts[i] === '--target' && opts[i + 1]) {
      targetUrl = opts[i + 1];
      i++;
    }
  }

  // Validate pack
  if (!SCENARIO_PACKS[packId]) {
    error(`Unknown pack: ${packId}`);
    info('Run "clawpipe list" to see available packs.');
    process.exit(1);
  }

  info(`🚀 Running ${SCENARIO_PACKS[packId]}...\n`);

  try {
    // Run the pack (simulated for now)
    const result = await runPack(packId, targetUrl);

    // Generate output
    if (format === 'json' || format === 'both') {
      saveJsonReport(result, outputDir);
    }
    if (format === 'markdown' || format === 'both') {
      saveMarkdownReport(result, outputDir);
    }

    // Print summary
    printSummary(result);

  } catch (err) {
    error(`Run failed: ${err.message}`);
    process.exit(1);
  }
}

async function runPack(packId, targetUrl) {
  // Simulate running scenarios
  const scenarios = getScenarios(packId);
  const results = [];
  
  for (const scenario of scenarios) {
    // Simulate scenario execution
    const passed = Math.random() > 0.3; // 70% pass rate
    results.push({
      id: scenario.id,
      name: scenario.name,
      status: passed ? 'pass' : 'fail',
      latency_ms: Math.floor(Math.random() * 2000) + 500,
      error: passed ? null : 'Simulated failure for demo'
    });
  }

  // Calculate score
  const passed = results.filter(r => r.status === 'pass').length;
  const score = Math.round((passed / results.length) * 100);

  return {
    id: `run_${Date.now()}`,
    pack_id: packId,
    pack_name: SCENARIO_PACKS[packId],
    target_url: targetUrl,
    score,
    status: 'completed',
    scenarios: results,
    failures: results.filter(r => r.status === 'fail').map(r => ({
      scenario_id: r.id,
      scenario_name: r.name,
      error: r.error
    })),
    started_at: new Date(Date.now() - 5000).toISOString(),
    completed_at: new Date().toISOString(),
    duration_ms: 5000
  };
}

function getScenarios(packId) {
  // Basic Sanity scenarios
  if (packId === 'basic-sanity') {
    return [
      { id: 'S-1', name: 'Hello World' },
      { id: 'S-2', name: 'Two-Agent Handoff' },
      { id: 'S-3', name: 'Tool Call Success' },
      { id: 'S-4', name: 'Parallel Execution' },
      { id: 'S-5', name: 'Graceful Degradation' }
    ];
  }
  // Other packs would load from engine/scenarios/
  return [
    { id: '1', name: 'Scenario 1' },
    { id: '2', name: 'Scenario 2' }
  ];
}

function saveJsonReport(result, outputDir) {
  const filename = `${outputDir}/clawpipe-${result.id}.json`;
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }
  writeFileSync(filename, JSON.stringify(result, null, 2));
  success(`📄 JSON report saved: ${filename}`);
}

function saveMarkdownReport(result, outputDir) {
  const level = getScoreLevel(result.score);
  let md = `# Clawpipe Report

## Summary

| Metric | Value |
|--------|-------|
| Pack | ${result.pack_name} |
| Score | **${result.score}** (${level}) |
| Status | ${result.status} |
| Duration | ${(result.duration_ms / 1000).toFixed(1)}s |

## Scenarios

`;

  result.scenarios.forEach(s => {
    const icon = s.status === 'pass' ? '✅' : '❌';
    md += `| ${icon} | ${s.name} | ${s.latency_ms}ms | ${s.error || '-'} |\n`;
  });

  if (result.failures.length > 0) {
    md += `\n## Failures\n\n`;
    result.failures.forEach(f => {
      md += `### ${f.scenario_name}\n${f.error}\n\n`;
    });
  }

  md += `\n---\n*Generated by Clawpipe CLI*\n`;

  const filename = `${outputDir}/clawpipe-${result.id}.md`;
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }
  writeFileSync(filename, md);
  success(`📄 Markdown report saved: ${filename}`);
}

function getScoreLevel(score) {
  if (score >= 86) return 'Diamond Cortex';
  if (score >= 71) return 'Titanium Hive';
  if (score >= 51) return 'Steel Swarm';
  if (score >= 31) return 'Bronze Claw';
  return 'Paper Armor';
}

function printSummary(result) {
  console.log('');
  info('═══════════════════════════════════════');
  
  const level = getScoreLevel(result.score);
  const color = result.score >= 71 ? colors.green : result.score >= 31 ? colors.yellow : colors.red;
  
  log(color, `  SCORE: ${result.score}/100 - ${level}`);
  log(colors.cyan, `  Pack: ${result.pack_name}`);
  log(colors.cyan, `  Status: ${result.status}`);
  log(colors.cyan, `  Duration: ${(result.duration_ms / 1000).toFixed(1)}s`);
  
  info('═══════════════════════════════════════');
  console.log('');
  
  if (result.failures.length > 0) {
    warn(`⚠️  ${result.failures.length} scenario(s) failed`);
  } else {
    success('✅ All scenarios passed!');
  }
}
