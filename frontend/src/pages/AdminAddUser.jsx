import React from 'react';
import { UserPlus, Terminal } from 'lucide-react';

export default function AdminAddUser() {
  return (
    <div className="space-y-8 select-none page-enter">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold uppercase tracking-wider text-cyber-title flex items-center gap-3">
          <UserPlus className="text-cyber-blue w-8 h-8" />
          Admin <span className="text-cyber-blue">Privileged User Provisioning</span>
        </h1>
        <p className="text-cyber-dim text-sm text-justify leading-relaxed">
          Create new administrative personnel records. (This panel is designed to test SQL injection vectors in privileged INSERT queries).
        </p>
      </div>

      <div className="max-w-md mx-auto bg-cyber-card border border-cyber-border rounded-xl p-6 space-y-6 shadow-[0_8px_25px_var(--accent-glow)]">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-cyber-dim font-mono">Privileged Account Name</label>
            <input
              type="text"
              className="w-full bg-cyber-input border border-cyber-border rounded-lg px-4 py-3 text-sm text-cyber-text focus:outline-none focus:border-cyber-blue font-mono"
              placeholder="sys_admin_alpha"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-cyber-dim font-mono">Email Address</label>
            <input
              type="email"
              className="w-full bg-cyber-input border border-cyber-border rounded-lg px-4 py-3 text-sm text-cyber-text focus:outline-none focus:border-cyber-blue font-mono"
              placeholder="alpha@cyberdefense.net"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-cyber-dim font-mono">Default Authorization Password</label>
            <input
              type="password"
              className="w-full bg-cyber-input border border-cyber-border rounded-lg px-4 py-3 text-sm text-cyber-text focus:outline-none focus:border-cyber-blue font-mono"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button className="w-full bg-cyber-blue text-white hover:bg-cyber-blue-light rounded-lg py-3 font-mono text-sm tracking-wider uppercase transition-colors shadow-lg shadow-cyber-blue/15 flex items-center justify-center gap-2 cursor-pointer">
          <Terminal className="w-4 h-4" />
          Provision Account
        </button>
      </div>
    </div>
  );
}
