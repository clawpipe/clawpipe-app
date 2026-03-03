'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Header } from '@/components/ui/Header';
import { ScoreGauge } from '@/components/ui/ScoreGauge';
import { FailureCard } from '@/components/ui/FailureCard';
import { api, RunResult, getScoreLevel, getDifficultyColor } from '@/lib/api';

// Skeleton for loading state
function DetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-6 w-32 bg-bg-tertiary rounded mb-6" />
      <div className="card mb-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-56 h-56 rounded-full bg-bg-tertiary" />
          <div className="flex-1 text-center md:text-left">
            <div className="h-8 w-64 bg-bg-tertiary rounded mb-4" />
            <div className="h-4 w-48 bg-bg-tertiary rounded mx-auto md:mx-0" />
            <div className="mt-6 flex gap-3 justify-center md:justify-start">
              <div className="h-10 w-20 bg-bg-tertiary rounded" />
              <div className="h-10 w-24 bg-bg-tertiary rounded" />
            </div>
          </div>
        </div>
      </div>
      <div className="h-8 w-32 bg-bg-tertiary rounded mb-4" />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="card py-4">
            <div className="h-8 w-12 bg-bg-tertiary rounded mx-auto mb-2" />
            <div className="h-3 w-16 bg-bg-tertiary rounded mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Error state
function ErrorState({ message }: { message: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12 card border-accent-red/30"
    >
      <div className="text-6xl mb-4">❌</div>
      <h2 className="text-xl font-semibold mb-2 text-accent-red">Run Not Found</h2>
      <p className="text-text-secondary mb-6">{message}</p>
      <Link href="/runs">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary"
        >
          View All Runs
        </motion.button>
      </Link>
    </motion.div>
  );
}

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
        setError(e.message || 'Failed to load run');
        setLoading(false);
      });
  }, [runId]);
  
  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-5xl mx-auto px-4 py-12">
          <DetailSkeleton />
        </main>
      </div>
    );
  }
  
  if (error || !run) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-5xl mx-auto px-4 py-12">
          <ErrorState message={error || 'The requested run could not be found.'} />
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
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link href="/runs" className="text-text-secondary hover:text-text-primary mb-6 inline-flex items-center gap-1">
            ← Back to History
          </Link>
        </motion.div>
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <ScoreGauge score={run.score} size="lg" />
            </motion.div>
            
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
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                  }}
                  className="btn-secondary text-sm py-2"
                >
                  🔗 Share
                </motion.button>
                <Link href="/run">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary text-sm py-2"
                  >
                    ↻ Run Again
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Sub-scores */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold mb-4">Sub-Scores</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {run.sub_scores.map((sub) => (
              <motion.div 
                key={sub.category}
                whileHover={{ scale: 1.02, y: -2 }}
                className="card text-center py-4"
              >
                <div 
                  className="text-2xl font-mono font-bold"
                  style={{ color: getScoreLevel(sub.score).color }}
                >
                  {sub.score}
                </div>
                <div className="text-xs text-text-secondary mt-1 capitalize">
                  {sub.category.replace('_', ' ')}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
        
        {/* Scenario Results */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold mb-4">Scenario Results</h2>
          <div className="card">
            <div className="space-y-2">
              {run.scenario_results.map((result) => (
                <motion.div 
                  key={result.scenario_id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-4 p-3 rounded-lg bg-bg-tertiary/50"
                >
                  <span className="text-lg">
                    {result.status === 'pass' ? '✅' : result.status === 'partial' ? '⚠️' : '❌'}
                  </span>
                  <span className="flex-1 font-medium">{result.scenario_name}</span>
                  <span className="text-sm text-text-secondary">{result.latency_ms}ms</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
        
        {/* Failures */}
        {run.failures.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold mb-4">
              Top Failures ({run.failures.length})
            </h2>
            <div className="space-y-4">
              {run.failures.map((failure, i) => (
                <FailureCard key={failure.id} failure={failure} index={i} />
              ))}
            </div>
          </motion.section>
        )}
        
        {/* Badges */}
        {run.badges_earned.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold mb-4">Badges Earned</h2>
            <div className="flex flex-wrap gap-4">
              {run.badges_earned.map((badge) => (
                <motion.div 
                  key={badge.id}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="card flex items-center gap-3 py-3"
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <div>
                    <div className="font-medium">{badge.name}</div>
                    <div className="text-xs text-text-secondary">{badge.description}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </main>
    </div>
  );
}
