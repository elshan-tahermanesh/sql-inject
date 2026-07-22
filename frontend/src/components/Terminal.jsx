import React from 'react';
import { Play, RotateCcw, Monitor } from 'lucide-react';

export default function Terminal({
  uInput = '',
  pInput = '',
  sInput = '',
  setUInput,
  setPInput,
  setSInput,
  onSimulate,
  onClear,
  outputContent = '',
  outputClass = 'text-cyber-blue-light'
}) {
  return (
    <div className="w-full bg-cyber-card border border-cyber-border rounded-xl overflow-hidden shadow-[0_10px_30px_var(--accent-glow)] relative cyber-glow">
      {/* Top Gradient Accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyber-blue to-transparent" />

      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-cyber-header border-b border-cyber-border/80">
        <div className="flex items-center gap-2">
          {/* Mac/Linux Style Window Dots */}
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <div className="flex items-center gap-1.5 ml-2.5 text-xs text-cyber-dim font-mono tracking-wider">
            <Monitor className="w-3.5 h-3.5" />
            sql_injection_tester.exe — interactive console
          </div>
        </div>
        <div className="text-[10px] font-mono text-cyber-dim uppercase tracking-widest bg-cyber-black px-2 py-0.5 rounded border border-cyber-border/40">
          simulation mode
        </div>
      </div>

      {/* Terminal Content Inputs */}
      <div className="p-6 flex flex-col gap-3.5 bg-cyber-black/40 font-mono">
        {/* Username Input Row */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
          <span className="text-cyber-blue text-sm font-semibold tracking-wider min-w-[130px] flex items-center gap-1">
            USERNAME &gt;
          </span>
          <input
            type="text"
            value={uInput}
            onChange={(e) => setUInput(e.target.value)}
            placeholder="e.g. admin' --  or  ' OR '1'='1' --"
            className="flex-1 bg-cyber-input border border-cyber-border rounded-lg px-4 py-2.5 text-cyber-text placeholder-cyber-dim/60 focus:outline-none focus:border-cyber-blue focus:ring-2 focus:ring-cyber-blue/20 transition-all text-sm tracking-wider"
          />
        </div>

        {/* Password Input Row */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
          <span className="text-cyber-blue text-sm font-semibold tracking-wider min-w-[130px] flex items-center gap-1">
            PASSWORD &gt;
          </span>
          <input
            type="text"
            value={pInput}
            onChange={(e) => setPInput(e.target.value)}
            placeholder="any password (may be ignored by comments)"
            className="flex-1 bg-cyber-input border border-cyber-border rounded-lg px-4 py-2.5 text-cyber-text placeholder-cyber-dim/60 focus:outline-none focus:border-cyber-blue focus:ring-2 focus:ring-cyber-blue/20 transition-all text-sm tracking-wider"
          />
        </div>

        {/* Search Input Row */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
          <span className="text-cyber-blue text-sm font-semibold tracking-wider min-w-[130px] flex items-center gap-1">
            SEARCH &gt;
          </span>
          <input
            type="text"
            value={sInput}
            onChange={(e) => setSInput(e.target.value)}
            placeholder="e.g. laptop' OR '1'='1"
            className="flex-1 bg-cyber-input border border-cyber-border rounded-lg px-4 py-2.5 text-cyber-text placeholder-cyber-dim/60 focus:outline-none focus:border-cyber-blue focus:ring-2 focus:ring-cyber-blue/20 transition-all text-sm tracking-wider"
          />
        </div>

        {/* Control Button Actions */}
        <div className="flex flex-wrap gap-3 mt-2 border-t border-cyber-border/40 pt-4">
          <button
            onClick={onSimulate}
            className="flex items-center gap-2 bg-cyber-blue hover:bg-cyber-blue-light text-white px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_var(--accent-glow)]"
          >
            <Play className="w-3.5 h-3.5" />
            Run Simulation
          </button>
          <button
            onClick={onClear}
            className="flex items-center gap-2 bg-transparent hover:bg-cyber-border/30 border border-cyber-border text-cyber-dim hover:text-cyber-title px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear Input
          </button>
        </div>

        {/* Dynamic Simulated Query Log Output */}
        {outputContent && (
          <div className="mt-4 border-t border-cyber-border pt-4 animate-fade-in">
            <div className="text-[10px] text-cyber-dim uppercase tracking-widest mb-2 select-none">
              Console Buffer Output
            </div>
            <pre className={`w-full overflow-x-auto bg-cyber-pre border border-cyber-border rounded-lg p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap ${outputClass}`}>
              {outputContent}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
