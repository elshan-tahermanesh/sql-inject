import React from 'react';
import { ShieldAlert, Zap, AlertTriangle, Eye } from 'lucide-react';

export default function DemoAttack() {
  return (
    <div className="space-y-8 select-none page-enter">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold uppercase tracking-wider text-cyber-title flex items-center gap-3">
          <ShieldAlert className="text-cyber-blue w-8 h-8" />
          Simulation <span className="text-cyber-blue">Attack Panel</span>
        </h1>
        <p className="text-cyber-dim text-sm text-justify leading-relaxed">
          Configure, compile, and execute SQL Injection payloads. Observe database behaviors and logs to analyze payload impact in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 space-y-4 shadow-[0_8px_25px_var(--accent-glow-red)]">
          <div className="flex items-center gap-2 text-cyber-red">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-bold text-cyber-title">Vulnerable Mode</h3>
          </div>
          <p className="text-cyber-dim text-sm leading-relaxed">
            Execute SQL concatenation injection vectors. The engine compiles inputs directly into the database engine command string.
          </p>
        </div>

        <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 space-y-4 shadow-[0_8px_25px_var(--accent-glow-green)]">
          <div className="flex items-center gap-2 text-cyber-green">
            <Zap className="w-5 h-5" />
            <h3 className="font-bold text-cyber-title">Secure Mode</h3>
          </div>
          <p className="text-cyber-dim text-sm leading-relaxed">
            Parameterization isolates input strings entirely, rendering any special character codes harmless.
          </p>
        </div>

        <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 space-y-4 shadow-[0_8px_25px_var(--accent-glow)]">
          <div className="flex items-center gap-2 text-cyber-blue">
            <Eye className="w-5 h-5" />
            <h3 className="font-bold text-cyber-title">Response View</h3>
          </div>
          <p className="text-cyber-dim text-sm leading-relaxed">
            Display detailed SQL compilations, execution errors, and response structures returned by the backend.
          </p>
        </div>
      </div>
    </div>
  );
}
