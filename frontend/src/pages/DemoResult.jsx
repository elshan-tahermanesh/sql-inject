import React from 'react';
import { BarChart3, ShieldCheck, Database } from 'lucide-react';

export default function DemoResult() {
  return (
    <div className="space-y-8 select-none page-enter">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold uppercase tracking-wider text-cyber-title flex items-center gap-3">
          <BarChart3 className="text-cyber-blue w-8 h-8" />
          Simulation <span className="text-cyber-blue">Results Explorer</span>
        </h1>
        <p className="text-cyber-dim text-sm text-justify leading-relaxed">
          Inspect outcomes of recent SQL injection simulations. Compare execution performance, mitigation logs, and data leakage reports.
        </p>
      </div>

      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 space-y-6 shadow-[0_8px_25px_var(--accent-glow)]">
        <h2 className="font-mono text-xs uppercase tracking-widest text-cyber-dim">SYSTEM SIMULATION RESULT LOG</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-cyber-border/40 rounded-lg p-4 bg-cyber-input/40 space-y-2">
            <div className="flex items-center gap-2 text-cyber-red font-mono text-xs">
              <Database className="w-4 h-4" />
              INJECTION VECTORS SUM
            </div>
            <div className="text-2xl font-mono text-cyber-title">0 / 0</div>
            <p className="text-cyber-dim text-xs">No simulation payloads executed yet.</p>
          </div>

          <div className="border border-cyber-border/40 rounded-lg p-4 bg-cyber-input/40 space-y-2">
            <div className="flex items-center gap-2 text-cyber-green font-mono text-xs">
              <ShieldCheck className="w-4 h-4" />
              MITIGATED THREATS
            </div>
            <div className="text-2xl font-mono text-cyber-title">0 / 0</div>
            <p className="text-cyber-dim text-xs">All defensive configurations active.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
