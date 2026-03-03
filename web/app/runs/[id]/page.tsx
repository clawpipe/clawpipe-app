'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/ui/Header';
import { ScoreGauge } from '@/components/ui/ScoreGauge';
import { FailureCard } from '@/components/ui/FailureCard';
import { api, RunResult, getScoreLevel, getDifficultyColor } from '@/lib/api';

export default function RunDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [run, setRun] = useState<RunResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const runId = params.id as string;
  
  useEffect(() => {
    if (!runId) return;
    
    api.getRun(runId)
      .then(data => {
        setRun(data.run);
        setLoading(false);
      })
      .catch((e: Error) => {
        setError(e.message);
        setLoading(false);
      });
  }, [runId]);
  
  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-5xl mx-auto px-4 py-12 text-center">
          <p className="text-text-secondary">Loading...</p>
        </main>
      </div>
    );
  }
  
  if (error || !run) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-5xl mx-auto px-4 py-12">
          <div className="card text-center py-12">
            <div className="text-4xl mb-4">❌</div>
            <h2 className="text-xl font-semibold mb-2">Run Not Found</h2>
            <p className="text-text-secondary mb-4">{error || 'The requested run could not be found.'}</p>
            <Link href="/runs" className="btn-primary">
              View All Runs
            </Link>
          </div>
        </main>
      </div>
    );
  }
  
  const level = getScoreLevel(run.score);
  const passedScenarios = run.scenario_results.filter(s => s.status === 'pass').length;
  const totalScenarios = run.scenario_results.length;
  
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Back link */}
        <Link href="/runs" className="text-text-secondary hover:text-text-primary mb-6 inline-flex items-center gap-1">
          ← Back to History
        </Link>
        
        {/* Header */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <ScoreGauge score={run.score} size="lg" />
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold mb-2">{run.target_name}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-text-secondary">
                <span>{run.pack_name}</span>
                <span>•</span>
                <span>{passedScenarios}/{totalScenarios} scenarios passed</span>
                <span>•</span>
                <span>{run.duration_ms ? `${Math.round(run.duration_ms / 1000)}s` : 'N/A'}</span>
              </div>
              
              {/* Actions */}
              <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                  }}
                  className="btn-secondary text-sm py-2"
                >
                  🔗 Share
                </button>
                <Link href="/run" className="btn-primary text-sm py-2">
                  ↻ Run Again
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sub-scores */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Sub-Scores</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {run.sub_scores.map((sub) => (
              <div key={sub.category} className="card text-center py-4">
                <div 
                  className="text-2xl font-mono font-bold"
                  style={{ color: getScoreLevel(sub.score).color }}
                >
                  {sub.score}
                </div>
                <div className="text-xs text-text-secondary mt-1 capitalize">
                  {sub.category.replace('_', ' ')}
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Scenario Results */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Scenario Results</h2>
          <div className="card">
            <div className="space-y-2">
              {run.scenario_results.map((result, i) => (
                <div 
                  key={result.scenario_id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-bg-tertiary/50"
                >
                  <span className="text-lg">
                    {result.status === 'pass' ? '✅' : result.status === 'partial' ? '⚠️' : '❌'}
                  </span>
                  <span className="flex-1 font-medium">{result.scenario_name}</span>
                  <span className="text-sm text-text-secondary">{result.latency_ms}ms</span>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Failures */}
        {run.failures.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              Top Failures ({run.failures.length})
            </h2>
            <div className="space-y-4">
              {run.failures.map((failure, i) => (
                <FailureCard key={failure.id} failure={failure} index={i} />
              ))}
            </div>
          </section>
        )}
        
        {/* Badges */}
        {run.badges_earned.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Badges Earned</h2>
            <div className="flex flex-wrap gap-4">
              {run.badges_earned.map((badge) => (
                <div 
                  key={badge.id}
                  className="card flex items-center gap-3 py-3"
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <div>
                    <div className="font-medium">{badge.name}</div>
                    <div className="text-xs text-text-secondary">{badge.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
