import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Globe, Terminal, Play, RotateCcw, ShieldAlert, Server, Wifi, Cpu, CheckCircle2, XCircle, Code, Trash2, AlertTriangle, Maximize2, Minimize2 } from 'lucide-react';
import { saveTestLog } from '../utils/logger';
import { delay } from '../utils/terminalAnimation';


export default function RemoteDropTable() {
  const [targetUrl, setTargetUrl] = useState('http://127.0.0.1:2000/api/vulnerable/drop-products');
  const [payload, setPayload] = useState("1'; DROP TABLE products; --");
  const [simulating, setSimulating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [terminalExpanded, setTerminalExpanded] = useState(false);
  const [simResult, setSimResult] = useState(null); // 'success' | 'failed' | null
  const scrollContainerRef = useRef(null);
  const terminalRef = useRef(null);
  const [expandedHeight, setExpandedHeight] = useState(null);
  const currentPhaseRef = useRef(0);

  const presets = [
    { name: "Golimar Products Table", url: "http://127.0.0.1:2000/api/vulnerable/drop-products", payload: "1'; DROP TABLE products; --", desc: "Educational DROP TABLE demonstration." }
  ];

  const handlePresetSelect = (preset) => {
    if (simulating) return;
    setTargetUrl(preset.url);
    setPayload(preset.payload);
    setSimResult(null);
    setCurrentStep(0);
    currentPhaseRef.current = 0;
    setConsoleLogs([]);
  };

  useEffect(() => {
    if (consoleLogs.length === 0) return;
    const container = scrollContainerRef.current;
    if (container) {
      const threshold = 100;
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight <= threshold;
      if (isNearBottom) {
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
      }
    }
  }, [consoleLogs]);

  useEffect(() => {
    if (!terminalExpanded || !terminalRef.current) {
      setExpandedHeight(null);
      return;
    }
    const updateHeight = () => {
      const rect = terminalRef.current.getBoundingClientRect();
      const bottomGap = 16;
      setExpandedHeight(Math.max(window.innerHeight - rect.top - bottomGap, 300));
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [terminalExpanded]);

  const addLog = (text, type = 'info', delay = 0) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setConsoleLogs((prev) => [...prev, { text, type, timestamp: new Date().toLocaleTimeString() }]);
        resolve();
      }, delay);
    });
  };

  const handleSimulate = async () => {
    if (simulating) return;
    if (!targetUrl) {
      alert("Please enter a target URL!");
      return;
    }
    if (!payload) {
      alert("Please enter a SQL injection payload!");
      return;
    }

    setSimulating(true);
    setSimResult(null);
    setCurrentStep(0);
    currentPhaseRef.current = 0;
    setConsoleLogs([]);

    const ts = new Date().toLocaleTimeString();
    const sep = "------------------------------------------------------------------------------------------";

    // Phase 0 → 1: header
    await addLog(`[SYSTEM] Starting non-destructive DROP TABLE vulnerability check`, 'system');
    await delay(200);
    await addLog(`[TARGET] ${targetUrl}`, 'warning');
    await delay(150);
    await addLog(`[TIME] ${ts}`, 'info');
    await delay(400);
    await addLog(sep, 'info');
    await delay(250);

    setCurrentStep(1);
    currentPhaseRef.current = 1;

    // Phase 1: connection
    const host = '127.0.0.1';
    const port = '2000';
    const path = '/api/vulnerable/drop-products';
    await addLog(`Host: ${host}`, 'info');
    await delay(100);
    await addLog(`Port: ${port}`, 'info');
    await delay(100);
    await addLog(`Path: ${path}`, 'info');
    await delay(350);
    await addLog(`[DNS] Resolving hostname '${host}'...`, 'warning');
    await delay(600);
    await addLog(`[DNS] Resolved hostname to server IP: ${host}`, 'success');
    await delay(300);
    await addLog(`[CONNECT] Initializing TCP connection with ${host}:${port}...`, 'warning');
    await delay(700);
    await addLog(`[CONNECT] Connection successfully established.`, 'success');
    await delay(400);
    await addLog(sep, 'info');
    await delay(300);

    setCurrentStep(2);
    currentPhaseRef.current = 2;

    // Phase 2: payload display
    await addLog(`[PAYLOAD SAMPLE]`, 'warning');
    await delay(200);
    await addLog(`${payload}`, 'danger');
    await delay(500);
    await addLog(``, 'info');
    await addLog(`[SAFETY]`, 'warning');
    await delay(150);
    await addLog(`Destructive execution disabled.`, 'info');
    await delay(150);
    await addLog(`The payload is displayed for educational purposes only and will NOT be transmitted.`, 'info');
    await delay(500);

    setCurrentStep(3);
    currentPhaseRef.current = 3;

    // Phase 3: analysis
    await addLog(``, 'info');
    await addLog(`[ANALYSIS]`, 'warning');
    await delay(150);
    await addLog(`The payload contains a SQL DROP TABLE statement.`, 'info');
    await delay(200);
    await addLog(`If this input were concatenated into an SQL query without proper validation or parameterized statements, the application could be vulnerable to SQL Injection.`, 'info');
    await delay(500);

    await addLog(``, 'info');
    await addLog(`[RISK]`, 'danger');
    await delay(150);
    await addLog(`Successful exploitation could permanently delete the "products" table, resulting in application failure and irreversible data loss.`, 'danger');
    await delay(600);

    setCurrentStep(4);
    currentPhaseRef.current = 4;

    // Phase 4: result
    await addLog(``, 'info');
    await addLog(`[RESULT]`, 'warning');
    await delay(150);
    await addLog(`Potential DROP TABLE SQL Injection vulnerability detected.`, 'danger');
    await delay(200);
    await addLog(`No SQL statement was executed during this demonstration.`, 'info');
    await delay(400);

    await addLog(``, 'info');
    await addLog(`[STATUS]`, 'system');
    await delay(150);
    await addLog(`✓ Educational simulation completed safely.`, 'success');

    setCurrentStep(5);
    currentPhaseRef.current = 5;
    setSimResult('success');
    saveTestLog('Drop Table', payload, 'SIMULATED (non-destructive)', `Educational simulation — no SQL executed.`);
    setSimulating(false);
  };


  const handleClear = () => {
    if (simulating) return;
    setTargetUrl('http://127.0.0.1:2000/api/vulnerable/drop-products');
    setPayload("1'; DROP TABLE products; --");
    setConsoleLogs([]);
    setSimResult(null);
    setCurrentStep(0);
    currentPhaseRef.current = 0;
  };

  return (
    <div className="space-y-8 select-none w-full">
      {/* Back Link */}
      <Link to="/instructions/drop-table-attack" className="inline-flex items-center gap-2 text-xs font-mono text-cyber-dim hover:text-cyber-blue transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" />
        back to instructions page
      </Link>

      {/* Header Info */}
      <div className="flex flex-col gap-2 border-b border-cyber-border/40 pb-6 w-full">
        <h1 className="text-3xl font-extrabold text-cyber-title tracking-wide uppercase">
          DROP TABLE <span className="text-cyber-red">Vulnerability Check</span>
        </h1>
        <p className="text-cyber-text text-sm text-justify w-full leading-relaxed font-medium">
          This demonstration targets the intentionally vulnerable Golimar Store application. The payload attempts to terminate the original SQL statement and execute: DROP TABLE products; If successful, the Products table is removed from the SQLite database.
        </p>
      </div>

      {/* Target Settings Card */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-5 shadow-lg w-full">
        <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-red" />
        <h3 className="font-sans font-bold text-base text-cyber-title tracking-widest uppercase flex items-center gap-2">
          <Server className="w-4 h-4 text-cyber-red" />
          Target Settings
        </h3>

        <div className="space-y-4 font-mono text-xs">
          {/* Target URL */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-cyber-blue uppercase tracking-wider">
              Target Parameter URL
            </label>
            <div className="relative">
              <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyber-dim/60" />
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                disabled={simulating}
                placeholder="http://127.0.0.1:2000/api/vulnerable/drop-products"
                className="w-full bg-cyber-input border border-cyber-border rounded-lg pl-10 pr-4 py-2.5 text-cyber-text placeholder-cyber-dim/40 focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue/20 transition-all font-bold tracking-wide"
              />
            </div>
          </div>

          {/* SQL Payload */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-cyber-blue uppercase tracking-wider">
              Stacked SQL Payload
            </label>
            <div className="relative">
              <Code className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyber-dim/60" />
              <input
                type="text"
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
                disabled={simulating}
                placeholder="1'; DROP TABLE products; --"
                className="w-full bg-cyber-input border border-cyber-border rounded-lg pl-10 pr-4 py-2.5 text-cyber-text placeholder-cyber-dim/40 focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue/20 transition-all text-cyber-red font-bold font-mono tracking-wider"
              />
            </div>
          </div>
        </div>

        {/* Execute & Reset Controls */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSimulate}
            disabled={simulating}
            className={`flex-1 flex items-center justify-center gap-2 bg-cyber-red hover:bg-[#ff3a3a] text-white py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_var(--accent-glow-red)] ${
              simulating ? 'opacity-50 cursor-not-allowed animate-pulse' : ''
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${simulating ? 'animate-spin' : ''}`} />
            {simulating ? "Executing Drop..." : "Execute Injection"}
          </button>
          <button
            onClick={handleClear}
            disabled={simulating}
            className={`p-3 bg-transparent hover:bg-cyber-border/30 border border-cyber-border text-cyber-dim hover:text-cyber-text rounded-lg transition-all cursor-pointer ${
              simulating ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="Reset Forms"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <h3 className="font-sans font-bold text-xs text-cyber-dim tracking-widest uppercase">
          Simulated Drop Presets
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handlePresetSelect(preset)}
              disabled={simulating}
              className="w-full text-left bg-cyber-black/40 hover:bg-cyber-red/5 border border-cyber-border hover:border-cyber-red/35 rounded-lg p-3.5 transition-all cursor-pointer group flex flex-col justify-between h-full"
            >
              <div className="w-full space-y-1.5">
                <div className="flex justify-between items-center gap-2">
                  <span className="text-xs font-bold text-cyber-title group-hover:text-cyber-red transition-colors truncate">
                    {preset.name}
                  </span>
                  <span className="text-[8px] text-cyber-red border border-cyber-red/30 px-1.5 py-0.25 rounded bg-cyber-red/10 shrink-0 font-bold uppercase tracking-wider">
                    destructive
                  </span>
                </div>
                <div className="text-[10px] text-cyber-dim font-bold truncate">
                  URL: {preset.url}
                </div>
              </div>
              <div className="text-[10px] text-cyber-blue-light mt-3 font-mono w-full border-t border-cyber-border/30 pt-2 shrink-0">
                Payload: <code className="bg-cyber-input px-1 py-0.5 rounded text-cyber-red break-all">{preset.payload}</code>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Console & Results (Bottom) */}
      <div className="w-full space-y-6 pt-4 flex flex-col items-center">
        {/* Simulation Progress Timeline */}
        <div className="bg-cyber-card border border-cyber-border rounded-xl p-5 font-mono text-xs space-y-4 shadow-lg w-full">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-cyber-red tracking-wider uppercase flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyber-red" />
              status
            </span>
            <span className="text-[10px] text-cyber-dim font-bold">
              {currentStep === 0 ? "STANDBY" : `PHASE ${currentStep} / 5`}
            </span>
          </div>

          {/* Micro Progress Bar */}
          <div className="w-full bg-cyber-black h-1.5 rounded-full overflow-hidden border border-cyber-border">
            <div 
              className="bg-cyber-red h-full transition-all duration-500 shadow-[0_0_8px_var(--accent-glow-red)]"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>

          {/* Stages Icons Grid */}
          <div className="grid grid-cols-5 gap-2 text-center text-[9px] font-bold tracking-wider text-cyber-dim">
            <div className={currentStep >= 1 ? "text-cyber-red" : ""}>1. DNS</div>
            <div className={currentStep >= 2 ? "text-cyber-red" : ""}>2. TCP</div>
            <div className={currentStep >= 3 ? "text-cyber-red" : ""}>3. STACKS</div>
            <div className={currentStep >= 4 ? "text-cyber-red" : ""}>4. EXECUTE</div>
            <div className={currentStep >= 5 ? "text-cyber-red" : ""}>5. VERIFY</div>
          </div>
        </div>

        {/* Console Monitor Panel */}
        <div
          ref={terminalRef}
          className={`bg-cyber-pre border border-cyber-border rounded-xl w-full flex flex-col overflow-hidden shadow-2xl relative transition-all duration-300 ease-in-out ${
            terminalExpanded ? '' : 'h-[400px]'
          }`}
          style={terminalExpanded && expandedHeight ? { height: `${expandedHeight}px` } : undefined}
        >
          {/* Header bar */}
          <div className="bg-cyber-card border-b border-cyber-border/70 px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-cyber-dim tracking-wider uppercase flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
              </span>
            </div>
            <button
              onClick={() => setTerminalExpanded(prev => !prev)}
              className="flex items-center gap-1 text-[9px] font-mono text-cyber-dim hover:text-cyber-blue transition-colors cursor-pointer select-none"
            >
              {terminalExpanded ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  COLLAPSE
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  EXPAND
                </>
              )}
            </button>
          </div>

          {/* Terminal Body */}
          <div ref={scrollContainerRef} className="flex-1 min-h-0 p-4 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-2 custom-scrollbar">
            {consoleLogs.length === 0 ? (
              <div className="text-cyber-dim/40 h-full flex flex-col items-center justify-center text-center p-8 select-none font-mono">
                <Terminal className="w-10 h-10 mb-2 opacity-20" />
                <span>DROP TABLE Attack terminal is ready.</span>
                <span className="text-[10px] block mt-1">Configure Target URL and execute stacked DROP TABLE statements to test target database structure resilience.</span>
              </div>
            ) : (
              consoleLogs.map((log, index) => {
                let colorClass = "text-cyber-text";
                if (log.type === 'system') colorClass = "text-cyber-blue font-bold";
                if (log.type === 'success') colorClass = "text-cyber-green font-bold";
                if (log.type === 'warning') colorClass = "text-[#ffbd2e] font-bold";
                if (log.type === 'danger') colorClass = "text-[#ff3a3a] font-bold";
                
                return (
                  <div key={index} className={`flex items-start gap-2 ${colorClass}`}>
                    <span className="text-cyber-dim/50 shrink-0 font-normal">[{log.timestamp}]</span>
                    <span className="whitespace-pre-wrap select-text">{log.text}</span>
                  </div>
                );
              })
            )}
          </div>

          {/* Threat Level Overlay */}
          {simResult && (
            <div className="border-t border-cyber-border/70 p-4 bg-cyber-card/90 backdrop-blur-sm shrink-0 animate-fade-in font-mono">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {simResult === 'success' ? (
                    <div className="w-10 h-10 rounded-lg bg-cyber-red/10 border border-cyber-red/30 flex items-center justify-center text-cyber-red">
                      <AlertTriangle className="w-5 h-5 animate-pulse" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-cyber-green/10 border border-cyber-green/30 flex items-center justify-center text-cyber-green">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <span className={`text-xs font-bold uppercase tracking-wider block ${
                      simResult === 'success' ? 'text-cyber-red' : 'text-cyber-green'
                    }`}>
                      {simResult === 'success' ? "VULNERABILITY CONFIRMED" : "VULNERABILITY NOT CONFIRMED"}
                    </span>
                    <span className="text-[10px] text-cyber-dim font-bold font-mono">
                      Target endpoint: {targetUrl}
                    </span>
                  </div>
                </div>

                <div className="text-[10px] font-mono font-bold">
                  {simResult === 'success' ? (
                    <span className="text-cyber-red border border-cyber-red/30 bg-cyber-red/5 px-2.5 py-1.5 rounded uppercase font-bold">
                      VULNERABLE
                    </span>
                  ) : (
                    <span className="text-cyber-dim border border-cyber-border px-2.5 py-1.5 rounded uppercase font-bold">
                      Not Detected
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-3 bg-cyber-red/5 border border-cyber-red/20 rounded-lg p-3 text-[11px] leading-normal text-cyber-dim">
                <span className="font-bold uppercase block mb-1 text-cyber-red">Vulnerability Verification:</span>
                The displayed payload demonstrates how a stacked-query SQL Injection could terminate the original statement and append: <code className="bg-cyber-black text-[#ffbd2e] px-1 py-0.25 rounded font-mono font-bold">DROP TABLE products;</code> For safety, this module does not execute the destructive statement. Instead, it performs a non-destructive capability check and verifies that the products table remains present.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Educational Caution Alert */}
      <div className="bg-cyber-blue/5 border border-cyber-blue/30 rounded-xl p-4 text-xs font-mono leading-relaxed text-cyber-blue-light flex gap-3 items-start w-full font-mono">
        <ShieldAlert className="w-5 h-5 shrink-0 text-cyber-blue animate-pulse" />
        <div>
          <span className="font-bold text-cyber-title uppercase block mb-1">🛡 LOCAL EDUCATIONAL LAB</span>
          This module sends real HTTP requests only to the configured local or private lab target. Use it exclusively in the intentionally vulnerable Golimar demonstration environment.
        </div>
      </div>
    </div>
  );
}
