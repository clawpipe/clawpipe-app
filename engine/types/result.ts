// Result Types

import { ScenarioStatus } from './scenario';

export type RunStatus = 'queued' | 'running' | 'completed' | 'failed' | 'timeout';
export type FailureSeverity = 'low' | 'medium' | 'high' | 'critical';
export type FailureType = 'timeout' | 'tool_error' | 'memory_overflow' | 'prompt_confusion' | 'race_condition' | 'unknown';
export type SubScoreCategory = 'tool_robustness' | 'instruction_following' | 'recovery' | 'memory_integrity' | 'basic_functionality';

export interface SubScore {
  category: SubScoreCategory;
  score: number;
  weight: number;
}

export interface Failure {
  id: string;
  scenario_id: string;
  scenario_name: string;
  iteration: number;
  agents_involved: string[];
  failure_type: FailureType;
  narrative: string;
  suggested_fix: string;
  severity: FailureSeverity;
}

export interface ScenarioResult {
  scenario_id: string;
  scenario_name: string;
  status: ScenarioStatus;
  latency_ms: number;
  assertions: {
    type: string;
    pass: boolean;
    message?: string;
  }[];
  error_message?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface RunResult {
  id: string;
  target_id: string;
  target_name: string;
  pack_id: string;
  pack_name: string;
  status: RunStatus;
  score: number;
  sub_scores: SubScore[];
  failures: Failure[];
  scenario_results: ScenarioResult[];
  badges_earned: Badge[];
  started_at: string;
  completed_at?: string;
  duration_ms?: number;
  metadata?: Record<string, unknown>;
}

export interface RunSummary {
  id: string;
  target_name: string;
  pack_name: string;
  score: number;
  status: RunStatus;
  started_at: string;
  completed_at?: string;
}
