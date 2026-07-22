import React from 'react';
import { Users, ShieldCheck } from 'lucide-react';

export default function AdminUsers() {
  const placeholderUsers = [
    { id: 1, username: 'admin', email: 'admin@cyberdefense.net', role: 'Administrator', status: 'Active' },
    { id: 2, username: 'analyst_corp', email: 'sec_analyst@threat.io', role: 'Security Analyst', status: 'Active' }
  ];

  return (
    <div className="space-y-8 select-none page-enter">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold uppercase tracking-wider text-cyber-title flex items-center gap-3">
          <Users className="text-cyber-blue w-8 h-8" />
          Admin <span className="text-cyber-blue">User Database</span>
        </h1>
        <p className="text-cyber-dim text-sm text-justify leading-relaxed">
          Manage administrative accounts and test authorization vectors. (Database tables and modification operations are fully simulated).
        </p>
      </div>

      <div className="bg-cyber-card border border-cyber-border rounded-xl overflow-hidden shadow-[0_8px_25px_var(--accent-glow)] select-text">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-cyber-header border-b border-cyber-border/85">
              <tr className="font-mono text-[10px] text-cyber-dim tracking-wider uppercase">
                <th className="py-4 px-6">ID</th>
                <th className="py-4 px-6">Username</th>
                <th className="py-4 px-6">Email</th>
                <th className="py-4 px-6">Security Role</th>
                <th className="py-4 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-border/30">
              {placeholderUsers.map((user) => (
                <tr key={user.id} className="hover:bg-cyber-blue/5 transition-colors">
                  <td className="py-4 px-6 font-mono text-xs text-cyber-blue">#{user.id}</td>
                  <td className="py-4 px-6 font-semibold text-cyber-title">{user.username}</td>
                  <td className="py-4 px-6 font-mono text-xs text-cyber-dim">{user.email}</td>
                  <td className="py-4 px-6 font-mono text-xs text-cyber-title flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyber-blue" />
                    {user.role}
                  </td>
                  <td className="py-4 px-6">
                    <span className="bg-cyber-green/10 border border-cyber-green/40 text-cyber-green text-[10px] uppercase font-mono px-2 py-0.5 rounded-full">
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
