'use client';

import { Failure } from '@/lib/api';

interface FailureCardProps {
  failure: Failure;
  index: number;
}

export function FailureCard({ failure, index }: FailureCardProps) {
  const severityColors: Record<string, string> = {
    critical: 'severity-critical',
    high: 'severity-high',
    medium: 'severity-medium',
    low: 'severity-low',
  };
  
  const severityIcons: Record<string, string> = {
    critical: '🔴',
    high: '🟠',
    medium: '🟡',
    low: '⚪',
  };
  
  return (
    <div className="card hover:border-accent-red/50 transition-colors">
      <div className="flex items-start gap-3 mb-3">
        <span className="text-xl">{severityIcons[failure.severity]}</span>
        <div>
          <span className={`badge ${severityColors[failure.severity]} mr-2`}>
            {failure.severity.toUpperCase()}
          </span>
          <span className="text-text-secondary text-sm">
            {failure.scenario_name}
          </span>
        </div>
      </div>
      
      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-medium text-text-primary mb-1">What happened:</h4>
          <p className="text-text-secondary text-sm">{failure.narrative}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-text-primary mb-1">Why this matters:</h4>
          <p className="text-text-secondary text-sm">
            This failure indicates a weakness in your swarm's {failure.failure_type.replace('_', ' ')} handling.
            Without fixing it, similar failures will occur in production.
          </p>
        </div>
        
        <div className="pt-2 border-t border-border">
          <h4 className="text-sm font-medium text-accent-cyan mb-1">→ Suggested fix:</h4>
          <p className="text-text-secondary text-sm">{failure.suggested_fix}</p>
        </div>
        
        {failure.agents_involved.length > 0 && (
          <div className="text-xs text-text-secondary">
            Affected agents: {failure.agents_involved.join(', ')}
          </div>
        )}
      </div>
    </div>
  );
}
