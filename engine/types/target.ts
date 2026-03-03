// Target Configuration Types
export type TargetType = 'demo' | 'openclaw' | 'http' | 'script';

export interface TargetConfig {
  id: string;
  name: string;
  type: TargetType;
  endpoint: string;
  auth?: {
    type: 'bearer' | 'api_key' | 'none';
    token?: string;
  };
  config?: {
    timeout_ms?: number;
    max_retries?: number;
    concurrency?: number;
  };
  created_at: string;
}

export interface CreateTargetConfig {
  name: string;
  type: TargetType;
  endpoint: string;
  auth?: {
    type: 'bearer' | 'api_key' | 'none';
    token?: string;
  };
  config?: {
    timeout_ms?: number;
    max_retries?: number;
    concurrency?: number;
  };
}
