'use client';

import { useState } from 'react';
import { Header } from '@/components/ui/Header';
import { ScoreGauge } from '@/components/ui/ScoreGauge';
import Link from 'next/link';

export default function HomePage() {
  const [demoRunning, setDemoRunning] = useState(false);
  const [demoScore, setDemoScore] = useState<number | null>(null);
  
  const runDemo = async () => {
    setDemoRunning(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pack_id: 'basic-gauntlet',
          target_name: 'Demo Swarm',
          target: { name: 'Demo Swarm', type: 'demo' }
        })
      });
      const data = await res.json();
      setDemoScore(data.run.score);
    } catch (e) {
      console.error('Demo failed:', e);
    }
    setDemoRunning(false);
  };
  
  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          {/* Background effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent-cyan/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-purple/10 rounded-full blur-3xl" />
          </div>
          
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                <span className="text-text-primary">Run the Gauntlet.</span>
                <br />
                <span className="text-accent-cyan">Ship with Confidence.</span>
              </h1>
              
              <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10">
                The arcade for multi-agent swarms. Crash test your AI agents, earn scores that mean something, and find out what breaks before your users do.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={runDemo}
                  disabled={demoRunning}
                  className="btn-primary text-lg px-8 py-4"
                >
                  {demoRunning ? 'Running Demo...' : '▶ Run Demo Crash Test'}
                </button>
                <Link href="/run" className="btn-secondary text-lg px-8 py-4">
                  Test My Swarm
                </Link>
              </div>
            </div>
            
            {/* Demo result */}
            {demoScore !== null && (
              <div className="mt-16 flex justify-center animate-fade-in">
                <div className="text-center">
                  <p className="text-text-secondary mb-4">Demo Result</p>
                  <ScoreGauge score={demoScore} size="lg" />
                  <p className="mt-4 text-text-secondary">
                    <Link href={`/runs`} className="text-accent-cyan hover:underline">
                      View details →
                    </Link>
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
        
        {/* How It Works */}
        <section className="py-20 bg-bg-secondary/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: '01',
                  title: 'Connect',
                  description: 'Point to your OpenClaw swarm, HTTP endpoint, or use our demo.',
                  icon: '🔗'
                },
                {
                  step: '02',
                  title: 'Run',
                  description: 'Select scenario packs and let chaos unfold. Watch in real-time.',
                  icon: '⚡'
                },
                {
                  step: '03',
                  title: 'Score',
                  description: 'Get a reliability score, see failures, and learn what to fix.',
                  icon: '🎯'
                }
              ].map((item) => (
                <div key={item.step} className="card text-center">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <div className="text-accent-cyan font-mono text-sm mb-2">{item.step}</div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-text-secondary">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Features */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: '4 Scenario Packs', desc: 'From basic sanity to memory stress', icon: '📦' },
                { title: 'Real-time Detection', desc: 'Watch failures as they happen', icon: '👁️' },
                { title: 'Shareable Scores', desc: 'Badges, scores, and reports', icon: '🏆' },
                { title: 'CI-Ready', desc: 'JSON output, exit codes, GitHub Action', icon: '🔧' }
              ].map((feature) => (
                <div key={feature.title} className="card">
                  <div className="text-2xl mb-2">{feature.icon}</div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-text-secondary">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="py-8 border-t border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-text-secondary text-sm">
            <p>🦞 Clawpipe — Built for OpenClaw</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
