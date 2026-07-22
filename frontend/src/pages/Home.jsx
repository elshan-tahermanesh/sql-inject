import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Target, Layers, Terminal, Database, Trophy, ShieldAlert } from 'lucide-react';

const cards = [
  {
    to: '/instructions',
    icon: BookOpen,
    title: 'Learning Path',
    description: 'Follow a step-by-step guide from understanding vulnerable queries to completing security challenges.',
    btnText: 'Start Learning',
  },
  {
    to: '/attacks',
    icon: Target,
    title: 'Attack Scenarios',
    description: 'Explore pre-built attack scenarios — Login Bypass, UNION Injection, Blind SQLi, and more — with ready payloads.',
    btnText: 'View Scenarios',
  },
  {
    to: '/payload-library',
    icon: Layers,
    title: 'Payload Library',
    description: 'Browse and copy a curated collection of SQL injection payloads, filterable by attack category.',
    btnText: 'Browse Payloads',
  },
  {
    to: '/logs',
    icon: Terminal,
    title: 'Live Attack Logs',
    description: 'Monitor simulated attack events in real-time through a terminal-style log panel with status indicators.',
    btnText: 'View Logs',
  },
];

export default function Home() {
  return (
    <div className="space-y-12 select-none">
      {/* Hero */}
      <div className="text-center space-y-4 w-full pt-4 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyber-blue/5 blur-[80px] rounded-full pointer-events-none" />
        <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-[3px] text-cyber-title animate-fade-in">
          SQL Injection <span className="text-cyber-blue">Environment</span>
        </h1>
        <p className="text-cyber-dim text-sm md:text-base text-justify leading-relaxed">
          An interactive, client-side educational cyber laboratory designed to demonstrate security vulnerabilities and showcase standard mitigation practices.
        </p>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 max-w-7xl mx-auto w-full">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.to}
              className="group bg-cyber-card border border-cyber-border rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyber-blue hover:shadow-[0_8px_30px_var(--accent-glow)] relative overflow-hidden flex flex-col justify-between"
            >
              <span className="absolute top-0 left-0 right-0 h-[3px] bg-cyber-blue scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />

              <div>
                <div className="w-10 h-10 rounded-lg bg-cyber-blue/10 text-cyber-blue flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                  <Icon className="w-5 h-5" />
                </div>
                <h2 className="font-sans font-bold text-base text-cyber-title mb-1.5 tracking-wide uppercase group-hover:text-cyber-blue-light transition-colors">
                  {card.title}
                </h2>
                <p className="text-xs text-cyber-dim text-justify leading-relaxed mb-4">
                  {card.description}
                </p>
              </div>

              <div className="w-full text-xs font-mono font-bold text-cyber-blue uppercase tracking-widest flex items-center gap-1.5 group-hover:text-cyber-blue-light transition-colors">
                {card.btnText}
                <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
