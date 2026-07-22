import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';

export default function DemoRegister() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });

  return (
    <div className="space-y-8 select-none page-enter">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold uppercase tracking-wider text-cyber-title flex items-center gap-3">
          <UserPlus className="text-cyber-blue w-8 h-8" />
          Demo <span className="text-cyber-blue">User Registration</span>
        </h1>
        <p className="text-cyber-dim text-sm text-justify leading-relaxed">
          Create user accounts inside our sandboxed virtual database. This interface supports testing secure insertion patterns and observing potential secondary injection pathways.
        </p>
      </div>

      <div className="max-w-md mx-auto bg-cyber-card border border-cyber-border rounded-xl p-6 space-y-6 shadow-[0_8px_25px_var(--accent-glow)]">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-cyber-dim font-mono">Username</label>
            <input
              type="text"
              className="w-full bg-cyber-input border border-cyber-border rounded-lg px-4 py-3 text-sm text-cyber-text focus:outline-none focus:border-cyber-blue font-mono"
              placeholder="cyber_student"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-cyber-dim font-mono">Email Address</label>
            <input
              type="email"
              className="w-full bg-cyber-input border border-cyber-border rounded-lg px-4 py-3 text-sm text-cyber-text focus:outline-none focus:border-cyber-blue font-mono"
              placeholder="student@sqli-lab.edu"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-cyber-dim font-mono">Password</label>
            <input
              type="password"
              className="w-full bg-cyber-input border border-cyber-border rounded-lg px-4 py-3 text-sm text-cyber-text focus:outline-none focus:border-cyber-blue font-mono"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button className="w-full bg-cyber-blue/10 border border-cyber-blue text-cyber-blue hover:bg-cyber-blue/20 rounded-lg py-3 font-mono text-sm tracking-wider uppercase transition-colors cursor-pointer">
          Initialize Account
        </button>
      </div>
    </div>
  );
}
