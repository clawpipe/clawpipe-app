#!/usr/bin/env node

/**
 * Clawpipe CLI - Run crash tests from the command line
 */

import { existsSync, mkdirSync } from 'fs';
import { writeFileSync } from 'fs';
import { runScenarioPack, getAvailablePacks } from './runner.js';

// Get available packs dynamically
const SCENARIO_PACKS = {};
getAvailablePacks().forEach(packId => {
  SCENARIO_PACKS[packId] = packId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
});

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
  getAvailablePacks().forEach(packId => {
    console.log(`  ${colors.green}•${colors.reset} ${packId.padEnd(16)} ${SCENARIO_PACKS[packId]}`);
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
  // Run the pack using the real scenario runner
  const result = await runScenarioPack(packId, targetUrl);
  return result;
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
| Description | ${result.pack_description || '-'} |
| Score | **${result.score}** (${level}) |
| Status | ${result.status} |
| Duration | ${(result.duration_ms / 1000).toFixed(1)}s |

## Scenarios

`;

  result.scenarios.forEach(s => {
    const icon = s.status === 'pass' ? '✅' : '❌';
    md += `| ${icon} | ${s.scenario_name} | ${s.latency_ms}ms | ${s.error || '-'} |\n`;
  });

  // Add sub-scores if available
  if (result.sub_scores && result.sub_scores.length > 0) {
    md += `\n## Sub-Scores\n\n`;
    md += `| Category | Score |\n|----------|-------|\n`;
    result.sub_scores.forEach(sub => {
      md += `| ${sub.category} | ${sub.score} |\n`;
    });
  }

  // Add badges if earned
  if (result.badges_earned && result.badges_earned.length > 0) {
    md += `\n## Badges Earned\n\n`;
    result.badges_earned.forEach(badge => {
      md += `- ${badge.icon} ${badge.name}\n`;
    });
    md += '\n';
  }

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
