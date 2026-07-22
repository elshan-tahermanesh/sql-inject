import React from 'react';
import { Info, Shield, Code } from 'lucide-react';

export default function About() {
  return (
    <div className="space-y-8 select-none page-enter">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold uppercase tracking-wider text-cyber-title flex items-center gap-3">
          <Info className="text-cyber-blue w-8 h-8" />
          About <span className="text-cyber-blue">SQLi Lab</span>
        </h1>
        <p className="text-cyber-dim text-sm text-justify leading-relaxed">
          SQLi Lab is an advanced interactive cyber laboratory designed for educating developers, security researchers, and students about SQL Injection (SQLi) vulnerabilities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 space-y-4 shadow-[0_8px_25px_var(--accent-glow)]">
          <h2 className="text-lg font-bold text-cyber-title flex items-center gap-2">
            <Shield className="text-cyber-blue w-5 h-5" />
            Core Mission
          </h2>
          <p className="text-cyber-dim text-sm leading-relaxed">
            By demonstrating both vulnerable implementations and secure mitigations (such as parameterized statements), the sandbox bridges the gap between offensive exploits and defensive engineering.
          </p>
        </div>

        <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 space-y-4 shadow-[0_8px_25px_var(--accent-glow)]">
          <h2 className="text-lg font-bold text-cyber-title flex items-center gap-2">
            <Code className="text-cyber-blue w-5 h-5" />
            Vulnerability Coverage
          </h2>
          <p className="text-cyber-dim text-sm leading-relaxed">
            The platform covers Classic SQL Injection, Login Bypass techniques, UNION-based data extraction, Blind Injection (boolean and time-based), comment manipulations, and destructive queries.
          </p>
        </div>
      </div>
    </div>
  );
}
