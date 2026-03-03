'use client';

import { useEffect, useState } from 'react';
import { getScoreLevel } from '@/lib/api';

interface ScoreGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  animated?: boolean;
}

export function ScoreGauge({ 
  score, 
  size = 'md', 
  showLabel = true,
  animated = true 
}: ScoreGaugeProps) {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);
  const level = getScoreLevel(score);
  
  useEffect(() => {
    if (!animated) return;
    
    const duration = 1500;
    const steps = 60;
    const increment = score / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.round(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [score, animated]);
  
  const sizes = {
    sm: { container: 'w-24 h-24', text: 'text-2xl', label: 'text-xs' },
    md: { container: 'w-40 h-40', text: 'text-5xl', label: 'text-sm' },
    lg: { container: 'w-56 h-56', text: '7xl', label: 'text-base' },
    xl: { container: 'w-72 h-72', text: '8xl', label: 'text-lg' },
  };
  
  const s = sizes[size];
  const circumference = 2 * Math.PI * 45;
  const progress = (displayScore / 100) * circumference;
  
  return (
    <div className={`relative inline-flex items-center justify-center ${s.container}`}>
      {/* Glow effect */}
      <div 
        className={`absolute inset-0 rounded-full opacity-20 ${level.glowClass}`}
        style={{ animation: animated ? 'pulseGlow 2s ease-in-out infinite' : 'none' }}
      />
      
      {/* SVG Gauge */}
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="var(--bg-tertiary)"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={level.color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          className="transition-all duration-1000 ease-out"
          style={{ filter: `drop-shadow(0 0 8px ${level.color})` }}
        />
      </svg>
      
      {/* Score text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span 
          className={`font-mono font-extrabold ${s.text}`}
          style={{ color: level.color }}
        >
          {displayScore}
        </span>
        {showLabel && (
          <span 
            className={`font-medium ${s.label} mt-1`}
            style={{ color: level.color }}
          >
            {level.label}
          </span>
        )}
      </div>
    </div>
  );
}
