import React, { useState } from 'react';
import { Search as SearchIcon, Cpu } from 'lucide-react';

export default function Search() {
  const [query, setQuery] = useState('');
  
  return (
    <div className="space-y-8 select-none page-enter">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold uppercase tracking-wider text-cyber-title flex items-center gap-3">
          <SearchIcon className="text-cyber-blue w-8 h-8" />
          Dynamic <span className="text-cyber-blue">Catalog Search</span>
        </h1>
        <p className="text-cyber-dim text-sm text-justify leading-relaxed">
          Test search query injection vectors in this dynamic environment. Enter criteria to query the backend and observe the constructed execution path.
        </p>
      </div>

      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 space-y-6 shadow-[0_8px_25px_var(--accent-glow)]">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search products (e.g., Laptop, Keyboard)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-cyber-input border border-cyber-border rounded-lg px-4 py-3 text-sm text-cyber-text focus:outline-none focus:border-cyber-blue font-mono"
          />
          <button className="bg-cyber-blue/10 border border-cyber-blue text-cyber-blue hover:bg-cyber-blue/20 rounded-lg px-6 py-3 font-mono text-sm tracking-widest uppercase transition-colors cursor-pointer">
            Query
          </button>
        </div>

        <div className="border border-cyber-border/40 rounded-lg p-4 bg-cyber-pre/50 font-mono text-xs text-cyber-dim space-y-2">
          <div className="flex items-center gap-2 text-cyber-blue">
            <Cpu className="w-4 h-4 animate-pulse" />
            <span>CONSOLE ENVIRONMENT LOG</span>
          </div>
          <div>Query: "{query}"</div>
          <div>Active Mode: Simulated Placeholder</div>
        </div>
      </div>
    </div>
  );
}
