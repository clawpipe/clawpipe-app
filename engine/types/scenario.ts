// Scenario Types

export type Difficulty = 'easy' | 'medium' | 'hard' | 'extreme';
export type ScenarioStatus = 'pending' | 'running' | 'pass' | 'partial' | 'fail';

export interface ScenarioAssertion {
  type: 'status' | 'json_path' | 'regex' | 'contains' | 'latency';
  expected: string | number;
  actual?: string | number;
  pass?: boolean;
  message?: string;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  input: {
    type: 'http' | 'openclaw' | 'script';
    payload: Record<string, unknown>;
  };
  expected_output?: Record<string, unknown>;
  assertions: ScenarioAssertion[];
  timeout_ms: number;
}

export interface ScenarioPack {
  id: string;
  name: string;
  description: string;
  difficulty: Difficulty;
  duration_minutes: number;
  scenarios: Scenario[];
  badges: string[]; // Badge IDs earnable from this pack
}

export interface PackInfo {
  id: string;
  name: string;
  description: string;
  difficulty: Difficulty;
  duration_minutes: number;
  scenario_count: number;
  badges: string[];
}
