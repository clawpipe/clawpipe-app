import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from './providers';

export const metadata: Metadata = {
  title: 'Clawpipe - Arcade for Multi-Agent Swarms',
  description: 'Crash test your AI agents. Earn scores. Ship with confidence.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-bg-primary text-text-primary">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
