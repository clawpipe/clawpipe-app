'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/ui/Header';
import { api, RunSummary, getScoreLevel } from '@/lib/api';

export default function RunsPage() {
  const [runs, setRuns] = useState<RunSummary[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    api.getRuns()
      .then(data => {
        setRuns(data.runs);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Run History</h1>
          <Link href="/run" className="btn-primary">
            + New Run
          </Link>
        </div>
        
        {loading ? (
          <div className="text-center py-12 text-text-secondary">
            Loading...
          </div>
        ) : runs.length === 0 ? (
          <div className="text-center py-12 card">
            <div className="text-4xl mb-4">📭</div>
            <h3 className="text-xl font-semibold mb-2">No runs yet</h3>
            <p className="text-text-secondary mb-4">
              Run your first crash test to see results here.
            </p>
            <Link href="/run" className="btn-primary">
              Run Your First Test
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {runs.map((run) => {
              const level = getScoreLevel(run.score);
              
              return (
                <Link
                  key={run.id}
                  href={`/runs/${run.id}`}
                  className="card flex items-center gap-6 hover:border-accent-cyan/50 transition-colors"
                >
                  {/* Score */}
                  <div 
                    className="w-14 h-14 rounded-lg flex items-center justify-center font-mono font-bold text-lg"
                    style={{ 
                      backgroundColor: `${level.color}20`,
                      color: level.color,
                      border: `1px solid ${level.color}40`
                    }}
                  >
                    {run.score}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold truncate">{run.target_name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        run.status === 'completed' 
                          ? 'badge-success' 
                          : run.status === 'failed'
                            ? 'badge-error'
                            : 'badge-warning'
                      }`}>
                        {run.status}
                      </span>
                    </div>
                    <div className="text-sm text-text-secondary">
                      {run.pack_name} • {formatDate(run.started_at)}
                    </div>
                  </div>
                  
                  {/* Arrow */}
                  <div className="text-text-secondary">
                    →
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
