'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/ui/Header';
import { api, Pack, getDifficultyColor } from '@/lib/api';

export default function RunPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [selectedPack, setSelectedPack] = useState<string>('');
  const [targetType, setTargetType] = useState<string>('demo');
  const [targetName, setTargetName] = useState('My Swarm');
  const [targetUrl, setTargetUrl] = useState('');
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    api.getPacks().then(data => {
      setPacks(data.packs);
      if (data.packs.length > 0) {
        setSelectedPack(data.packs[0].id);
      }
    }).catch(console.error);
  }, []);
  
  const handleRun = async () => {
    setRunning(true);
    setError(null);
    
    try {
      const { run } = await api.runPack(selectedPack, targetName);
      router.push(`/runs/${run.id}`);
    } catch (e: any) {
      setError(e.message || 'Run failed');
      setRunning(false);
    }
  };
  
  const selectedPackData = packs.find(p => p.id === selectedPack);
  
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">New Crash Test</h1>
        
        {/* Step indicator */}
        <div className="flex items-center mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                  step >= s 
                    ? 'bg-accent-cyan text-black' 
                    : 'bg-bg-tertiary text-text-secondary'
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div className={`w-16 h-0.5 mx-2 ${step > s ? 'bg-accent-cyan' : 'bg-bg-tertiary'}`} />
              )}
            </div>
          ))}
        </div>
        
        {/* Step 1: Choose Target */}
        {step === 1 && (
          <div className="card animate-fade-in">
            <h2 className="text-xl font-semibold mb-6">Step 1: Choose Target</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Target Type</label>
                <select
                  value={targetType}
                  onChange={(e) => setTargetType(e.target.value)}
                  className="select"
                >
                  <option value="demo">Demo (built-in)</option>
                  <option value="openclaw">OpenClaw Swarm</option>
                  <option value="http">HTTP Endpoint</option>
                </select>
              </div>
              
              {targetType !== 'demo' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Swarm Name</label>
                    <input
                      type="text"
                      value={targetName}
                      onChange={(e) => setTargetName(e.target.value)}
                      className="input"
                      placeholder="My Awesome Swarm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {targetType === 'openclaw' ? 'OpenClaw Endpoint URL' : 'HTTP Endpoint URL'}
                    </label>
                    <input
                      type="url"
                      value={targetUrl}
                      onChange={(e) => setTargetUrl(e.target.value)}
                      className="input"
                      placeholder={targetType === 'openclaw' 
                        ? 'https://my-swarm.example.com/api' 
                        : 'https://api.example.com/agent'
                      }
                    />
                  </div>
                </>
              )}
              
              {targetType === 'demo' && (
                <div className="p-4 bg-accent-cyan/10 border border-accent-cyan/30 rounded-lg">
                  <p className="text-sm text-accent-cyan">
                    🎮 Demo mode uses a simulated swarm to show you how Clawpipe works.
                    Perfect for trying it out without configuring anything!
                  </p>
                </div>
              )}
            </div>
            
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="btn-primary"
              >
                Next: Select Pack →
              </button>
            </div>
          </div>
        )}
        
        {/* Step 2: Choose Scenario Pack */}
        {step === 2 && (
          <div className="card animate-fade-in">
            <h2 className="text-xl font-semibold mb-6">Step 2: Choose Scenario Pack</h2>
            
            <div className="space-y-3">
              {packs.map((pack) => (
                <label
                  key={pack.id}
                  className={`block p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    selectedPack === pack.id
                      ? 'border-accent-cyan bg-accent-cyan/10'
                      : 'border-border hover:border-text-secondary'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="pack"
                      value={pack.id}
                      checked={selectedPack === pack.id}
                      onChange={(e) => setSelectedPack(e.target.value)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{pack.name}</span>
                        <span className={`text-xs ${getDifficultyColor(pack.difficulty)}`}>
                          {pack.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary mt-1">{pack.description}</p>
                      <div className="flex gap-4 mt-2 text-xs text-text-secondary">
                        <span>⏱ ~{pack.duration_minutes} min</span>
                        <span>📦 {pack.scenario_count} scenarios</span>
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
            
            <div className="mt-8 flex justify-between">
              <button onClick={() => setStep(1)} className="btn-secondary">
                ← Back
              </button>
              <button onClick={() => setStep(3)} className="btn-primary">
                Next: Confirm →
              </button>
            </div>
          </div>
        )}
        
        {/* Step 3: Confirm & Run */}
        {step === 3 && (
          <div className="card animate-fade-in">
            <h2 className="text-xl font-semibold mb-6">Step 3: Confirm & Run</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-text-secondary">Target</span>
                <span className="font-medium">
                  {targetType === 'demo' ? 'Demo Swarm' : targetName}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-text-secondary">Pack</span>
                <span className="font-medium">{selectedPackData?.name}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-text-secondary">Difficulty</span>
                <span className={`font-medium ${getDifficultyColor(selectedPackData?.difficulty || '')}`}>
                  {selectedPackData?.difficulty}
                </span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-text-secondary">Est. Duration</span>
                <span className="font-medium">~{selectedPackData?.duration_minutes} min</span>
              </div>
            </div>
            
            {error && (
              <div className="mb-4 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-400">
                {error}
              </div>
            )}
            
            <div className="flex justify-between">
              <button onClick={() => setStep(2)} className="btn-secondary">
                ← Back
              </button>
              <button
                onClick={handleRun}
                disabled={running}
                className="btn-primary"
              >
                {running ? 'Running...' : '▶ RUN THE GAUNTLET'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
