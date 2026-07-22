import React, { useState } from 'react';
import { LogIn, Key } from 'lucide-react';

export default function DemoLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="space-y-8 select-none page-enter">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold uppercase tracking-wider text-cyber-title flex items-center gap-3">
          <LogIn className="text-cyber-blue w-8 h-8" />
          Demo <span className="text-cyber-blue">Authentication Portal</span>
        </h1>
        <p className="text-cyber-dim text-sm text-justify leading-relaxed">
          Explore vulnerability endpoints related to authentication. Concatenated login statements allow parameter bypasses, whereas secure logins isolate arguments as literals.
        </p>
      </div>

      <div className="max-w-md mx-auto bg-cyber-card border border-cyber-border rounded-xl p-6 space-y-6 shadow-[0_8px_25px_var(--accent-glow)]">
        <h2 className="font-mono text-xs uppercase tracking-widest text-cyber-dim text-center flex items-center justify-center gap-2">
          <Key className="w-4 h-4 text-cyber-blue" />
          SIMULATION LOGIN TERMINAL
        </h2>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-cyber-dim font-mono">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-cyber-input border border-cyber-border rounded-lg px-4 py-3 text-sm text-cyber-text focus:outline-none focus:border-cyber-blue font-mono"
              placeholder="admin"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-cyber-dim font-mono">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-cyber-input border border-cyber-border rounded-lg px-4 py-3 text-sm text-cyber-text focus:outline-none focus:border-cyber-blue font-mono"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button className="w-full bg-cyber-blue text-white hover:bg-cyber-blue-light rounded-lg py-3 font-mono text-sm tracking-wider uppercase transition-colors shadow-lg shadow-cyber-blue/15 cursor-pointer">
          Execute Login
        </button>
      </div>
    </div>
  );
}
