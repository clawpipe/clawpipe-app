'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Header } from '@/components/ui/Header';
import { api, RunSummary, getScoreLevel } from '@/lib/api';

const STORAGE_KEY = 'clawpipe_runs';

// Skeleton component for loading state
function RunsSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="card flex items-center gap-6 animate-pulse">
          <div className="w-14 h-14 rounded-lg bg-bg-tertiary" />
          <div className="flex-1">
            <div className="h-5 w-32 bg-bg-tertiary rounded mb-2" />
            <div className="h-4 w-48 bg-bg-tertiary rounded" />
          </div>
          <div className="w-6 h-6 bg-bg-tertiary rounded" />
        </div>
      ))}
    </div>
  );
}

// Empty state component
function EmptyState() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12 card"
    >
      <div className="text-6xl mb-4">📭</div>
      <h3 className="text-xl font-semibold mb-2">No runs yet</h3>
      <p className="text-text-secondary mb-6">
        Run your first crash test to see results here.
      </p>
      <Link href="/run">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary"
        >
          Run Your First Test
        </motion.button>
      </Link>
    </motion.div>
  );
}

// Error state component
function ErrorState({ message }: { message: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12 card border-accent-red/30"
    >
      <div className="text-6xl mb-4">⚠️</div>
      <h3 className="text-xl font-semibold mb-2 text-accent-red">Failed to Load Runs</h3>
      <p className="text-text-secondary mb-6">{message}</p>
      <button 
        onClick={() => window.location.reload()}
        className="btn-primary"
      >
        Try Again
      </button>
    </motion.div>
  );
}

export default function RunsPage() {
  const [runs, setRuns] = useState<RunSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load runs from API or localStorage fallback
  useEffect(() => {
    async function loadRuns() {
      try {
        const data = await api.getRuns();
        setRuns(data.runs);
        // Also save to localStorage for offline access
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.runs));
      } catch (e) {
        // Fallback to localStorage if API unavailable
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            setRuns(JSON.parse(stored));
          } catch {
            setRuns([]);
          }
        } else {
          setError('Unable to fetch runs. Please check your connection.');
        }
      } finally {
        setLoading(false);
      }
    }
    
    loadRuns();
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
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <h1 className="text-3xl font-bold">Run History</h1>
          <Link href="/run">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary"
            >
              + New Run
            </motion.button>
          </Link>
        </motion.div>
        
        {loading ? (
          <RunsSkeleton />
        ) : error ? (
          <ErrorState message={error} />
        ) : runs.length === 0 ? (
          <EmptyState />
        ) : (
          <motion.div 
            className="space-y-3"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.05 } }
            }}
          >
            {runs.map((run) => {
              const level = getScoreLevel(run.score);
              
              return (
                <motion.div
                  key={run.id}
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    visible: { opacity: 1, x: 0 }
                  }}
                >
                  <Link
                    href={`/runs/${run.id}`}
                    className="card flex items-center gap-6 hover:border-accent-cyan/50 transition-colors"
                  >
                    {/* Score */}
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className="w-14 h-14 rounded-lg flex items-center justify-center font-mono font-bold text-lg"
                      style={{ 
                        backgroundColor: `${level.color}20`,
                        color: level.color,
                        border: `1px solid ${level.color}40`
                      }}
                    >
                      {run.score}
                    </motion.div>
                    
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
                    <motion.div 
                      className="text-text-secondary"
                      whileHover={{ x: 4 }}
                    >
                      →
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </main>
    </div>
  );
}
