'use client';

import { useTheme } from '@/app/providers';

interface HeaderProps {
  children?: React.ReactNode;
}

export function Header({ children }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className="border-b border-border bg-bg-secondary/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent-cyan rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">🦞</span>
            </div>
            <span className="font-mono font-bold text-xl text-text-primary">CLAWPIPE</span>
          </a>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/" className="text-text-secondary hover:text-text-primary transition-colors">
              Home
            </a>
            <a href="/run" className="text-text-secondary hover:text-text-primary transition-colors">
              Run Test
            </a>
            <a href="/runs" className="text-text-secondary hover:text-text-primary transition-colors">
              History
            </a>
          </nav>
          
          {/* Right side */}
          <div className="flex items-center space-x-4">
            {children}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-bg-tertiary transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
