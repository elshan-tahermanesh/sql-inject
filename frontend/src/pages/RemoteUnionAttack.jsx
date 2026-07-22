import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Globe, Terminal, Play, RotateCcw, ShieldAlert, Server, Wifi, Cpu, CheckCircle2, XCircle, Code, Database, Maximize2, Minimize2 } from 'lucide-react';
import { saveTestLog } from '../utils/logger';
import { executeAttack } from '../services/api';
import { delay, isErrorLine, getLineDelay, getPhaseAfterLine } from '../utils/terminalAnimation';

export default function RemoteUnionAttack() {
  const [targetUrl, setTargetUrl] = useState('http://127.0.0.1:2000/api/vulnerable/search');
  const [payload, setPayload] = useState("' UNION SELECT id,email,0,is_admin,'',password,'user-record' FROM users -- ");
  const [discoveredTables, setDiscoveredTables] = useState([]);
  const [mode, setMode] = useState('union');
  const [simulating, setSimulating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [terminalExpanded, setTerminalExpanded] = useState(false);
  const [simResult, setSimResult] = useState(null); // 'success' | 'failed' | null
  const [exposedData, setExposedData] = useState([]);
  const scrollContainerRef = useRef(null);
  const terminalRef = useRef(null);
  const [expandedHeight, setExpandedHeight] = useState(null);
  const currentPhaseRef = useRef(0);

  const presets = [
    { 
      name: "Golimar Store Vulnerable Search", 
      url: "http://127.0.0.1:2000/api/vulnerable/search", 
      payload: "' UNION SELECT id,email,0,is_admin,'',password,'user-record' FROM users -- ", 
      mode: "union",
      desc: "Local UNION-based user table extraction demonstration" 
    },
    {
      name: "Golimar Database Tables",
      url: "http://127.0.0.1:2000/api/vulnerable/search",
      payload: "' UNION SELECT ROW_NUMBER() OVER (),table_name,0,0,'Database table discovered through information_schema','', 'table-record' FROM information_schema.tables WHERE table_schema='public' -- ",
      mode: "table-enumeration",
      desc: "Enumerates PostgreSQL table names from the public schema through the vulnerable search endpoint."
    }
  ];

  const handlePresetSelect = (preset) => {
    if (simulating) return;
    setTargetUrl(preset.url);
    setPayload(preset.payload);
    setMode(preset.mode || 'union');
    setSimResult(null);
    setExposedData([]);
    setDiscoveredTables([]);
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
    setExposedData([]);
    setCurrentStep(0);
    currentPhaseRef.current = 0;
    setConsoleLogs([]);

    try {
      setCurrentStep(0);
      currentPhaseRef.current = 0;
      const res = await executeAttack(mode, targetUrl, payload);
      
      if (res && res.success) {
        const output = res.output || '';
        const lines = output.split('\n');
        const parsedLogs = lines.map(line => {
          let type = 'info';
          if (line.includes('[SYSTEM]')) type = 'system';
          else if (line.includes('[SUCCESS]') || line.includes('SUCCESS!') || line.includes('SUCCESS') || line.includes('[CONNECT] Connection successfully established.') || line.includes('[DNS] Resolved hostname to server IP:')) type = 'success';
          else if (line.includes('[WARNING]') || line.includes('[HTTP]') || line.includes('[PROBE]') || line.includes('[PAYLOAD]') || line.includes('[RESPONSE]') || line.includes('[INFO]') || line.includes('[DNS]') || line.includes('[DATABASE]')) type = 'warning';
          else if (line.includes('[ERROR]') || line.includes('[RESULT] FAILED') || line.includes('FAILED') || line.includes('EXPLOIT FAILED')) type = 'danger';
          return {
            text: line,
            type,
            timestamp: new Date().toLocaleTimeString()
          };
        });
        setConsoleLogs([]);
        setCurrentStep(0);
        currentPhaseRef.current = 0;
        
        const context = {
          sawTimeLine: false
        };

        for (const log of parsedLogs) {
          // 1. Print line first
          setConsoleLogs((prev) => [...prev, log]);

          if (log.text.includes("[TIME]")) {
            context.sawTimeLine = true;
          }

          // 2. Wait line-specific delay
          const lineDelay = getLineDelay(log.text);
          await delay(lineDelay);

          // 3. Error handling: if error line, break and stop animation
          if (isErrorLine(log.text)) {
            break;
          }

          // 4. Update status phase if needed
          const nextPhase = getPhaseAfterLine(log.text, currentPhaseRef.current, context);
          if (nextPhase > currentPhaseRef.current) {
            currentPhaseRef.current = nextPhase;
            setCurrentStep(nextPhase);
          }
        }

        const hasError = parsedLogs.some(l => isErrorLine(l.text));
        if (!hasError) {
          setCurrentStep(5);
          currentPhaseRef.current = 5;
        }

        const isSuccess = mode === 'table-enumeration'
          ? (res.hasOwnProperty('table_enumeration_detected') ? res.table_enumeration_detected : output.includes("SUCCESS!"))
          : (res.hasOwnProperty('union_leak_detected') ? res.union_leak_detected : output.includes("SUCCESS!"));

        if (isSuccess && !hasError) {
          setSimResult('success');
          const finalQuery = res.executed_query || `SELECT id, name, description FROM products WHERE name LIKE '%${payload}%'`;
          
          if (mode === 'table-enumeration') {
            if (res.tables) setDiscoveredTables(res.tables);
            saveTestLog('Database Table Enumeration', payload, 'EXPLOITED', finalQuery);
          } else {
            if (res.leaked_rows) setExposedData(res.leaked_rows);
            saveTestLog('UNION Attack', payload, 'EXPLOITED', finalQuery);
          }
        } else {
          setSimResult('failed');
          const finalQuery = res.executed_query || `SELECT id, name, description FROM products WHERE name LIKE '%${payload}%'`;
          
          if (mode === 'table-enumeration') {
            saveTestLog('Database Table Enumeration', payload, 'BLOCKED', finalQuery);
          } else {
            saveTestLog('UNION Attack', payload, 'BLOCKED', finalQuery);
          }
          setExposedData([]);
          setDiscoveredTables([]);
        }
      } else {
        setCurrentStep(0);
        currentPhaseRef.current = 0;
        const errorMsg = res.error || '';
        let displayError = '[ERROR] Attack execution failed';
        if (errorMsg.toLowerCase().includes('timeout')) {
          displayError = '[ERROR] Connection timeout';
        } else if (errorMsg.toLowerCase().includes('500') || errorMsg.toLowerCase().includes('internal server error')) {
          displayError = '[ERROR] Internal server error';
        }
        setConsoleLogs([{ text: displayError, type: 'danger', timestamp: new Date().toLocaleTimeString() }]);
        setSimResult('failed');
      }
    } catch (err) {
      setCurrentStep(0);
      currentPhaseRef.current = 0;
      let displayError = '[ERROR] Attack execution failed';
      if (err.message && err.message.toLowerCase().includes('timeout')) {
        displayError = '[ERROR] Connection timeout';
      } else if (err.message && (err.message.toLowerCase().includes('500') || err.message.toLowerCase().includes('server error'))) {
        displayError = '[ERROR] Internal server error';
      }
      setConsoleLogs([{ text: displayError, type: 'danger', timestamp: new Date().toLocaleTimeString() }]);
      setSimResult('failed');
    } finally {
      setSimulating(false);
    }
  };

  const handleClear = () => {
    if (simulating) return;
    const currentPreset = presets.find(p => p.mode === mode) || presets[0];
    setTargetUrl(currentPreset.url);
    setPayload(currentPreset.payload);
    setConsoleLogs([]);
    setExposedData([]);
    setDiscoveredTables([]);
    setSimResult(null);
    setCurrentStep(0);
    currentPhaseRef.current = 0;
  };

  return (
    <div className="space-y-8 select-none w-full">
      {/* Back Link */}
      <Link to="/instructions/union-attack" className="inline-flex items-center gap-2 text-xs font-mono text-cyber-dim hover:text-cyber-blue transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" />
        back to instructions page
      </Link>

      {/* Header Info */}
      <div className="flex flex-col gap-2 border-b border-cyber-border/40 pb-6 w-full">
        <h1 className="text-3xl font-extrabold text-cyber-title tracking-wide uppercase">
          UNION SQL <span className="text-cyber-blue">Injection</span>
        </h1>
        <p className="text-cyber-text text-sm text-justify w-full leading-relaxed font-medium">
          This educational local-lab demonstration sends a UNION-based query to the intentionally vulnerable Golimar product-search endpoint and displays user records returned through the merged result set.
        </p>
      </div>

      {/* Target Settings Card */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-5 shadow-lg w-full">
        <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-blue" />
        <h3 className="font-sans font-bold text-base text-cyber-title tracking-widest uppercase flex items-center gap-2">
          <Server className="w-4 h-4 text-cyber-blue" />
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
                placeholder="http://127.0.0.1:2000/api/vulnerable/search"
                className="w-full bg-cyber-input border border-cyber-border rounded-lg pl-10 pr-4 py-2.5 text-cyber-text placeholder-cyber-dim/40 focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue/20 transition-all font-bold tracking-wide"
              />
            </div>
          </div>

          {/* SQL Payload */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-cyber-blue uppercase tracking-wider">
              UNION SQL Payload
            </label>
            <div className="relative">
              <Code className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyber-dim/60" />
              <input
                type="text"
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
                disabled={simulating}
                placeholder="' UNION SELECT id,email,0,is_admin,'',password,'user-record' FROM users -- "
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
            className={`flex-1 flex items-center justify-center gap-2 bg-cyber-blue hover:bg-cyber-blue-light text-white py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_var(--accent-glow)] ${
              simulating ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${simulating ? 'animate-spin' : ''}`} />
            {simulating ? "Scanning..." : "Execute Injection"}
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
          Vulnerable UNION Presets
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handlePresetSelect(preset)}
              disabled={simulating}
              className="w-full text-left bg-cyber-black/40 hover:bg-cyber-blue/5 border border-cyber-border hover:border-cyber-blue/30 rounded-lg p-3.5 transition-all cursor-pointer group flex flex-col justify-between h-full"
            >
              <div className="w-full space-y-1.5">
                <div className="flex justify-between items-center gap-2">
                  <span className="text-xs font-bold text-cyber-title group-hover:text-cyber-blue transition-colors truncate">
                    {preset.name}
                  </span>
                  <span className="text-[8px] text-[#ff3a3a] border border-[#ff3a3a]/30 px-1.5 py-0.25 rounded bg-[#ff3a3a]/5 shrink-0 uppercase tracking-wider font-bold">
                    VULNERABLE
                  </span>
                </div>
                <div className="text-[10px] text-cyber-dim font-bold truncate">
                  URL: {preset.url}
                </div>
                <div className="text-[10px] text-cyber-dim font-medium leading-relaxed mt-1 text-justify">
                  {preset.desc}
                </div>
              </div>
              <div className="text-[10px] text-cyber-blue mt-3 font-mono w-full border-t border-cyber-border/30 pt-2 shrink-0 font-bold">
                Payload: <code className="bg-cyber-input px-1.5 py-0.5 rounded text-cyber-red break-all font-mono font-medium block mt-1">{preset.payload}</code>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Exploit Status & Console Monitor at Bottom */}
      <div className="w-full space-y-6 pt-4 flex flex-col items-center">
        {/* Simulation Progress Timeline */}
        <div className="bg-cyber-card border border-cyber-border rounded-xl p-5 font-mono text-xs space-y-4 shadow-lg w-full">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-cyber-blue tracking-wider uppercase flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyber-blue" />
              status
            </span>
            <span className="text-[10px] text-cyber-dim font-bold">
              {currentStep === 0 ? "STANDBY" : `STAGE ${currentStep} / 5`}
            </span>
          </div>

          {/* Micro Progress Bar */}
          <div className="w-full bg-cyber-black h-1.5 rounded-full overflow-hidden border border-cyber-border">
            <div 
              className="bg-cyber-blue h-full transition-all duration-500 shadow-[0_0_8px_var(--accent-glow)]"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>

          {/* Stages Icons Grid */}
          <div className="grid grid-cols-5 gap-2 text-center text-[9px] font-bold tracking-wider text-cyber-dim">
            <div className={currentStep >= 1 ? "text-cyber-blue" : ""}>1. DNS</div>
            <div className={currentStep >= 2 ? "text-cyber-blue" : ""}>2. TCP</div>
            <div className={currentStep >= 3 ? "text-cyber-blue" : ""}>3. PROBING</div>
            <div className={currentStep >= 4 ? "text-cyber-blue" : ""}>4. DISPATCH</div>
            <div className={currentStep >= 5 ? "text-cyber-blue" : ""}>5. VERIFY</div>
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
              <div className="text-cyber-dim/40 h-full flex flex-col items-center justify-center text-center p-8 select-none">
                <Terminal className="w-10 h-10 mb-2 opacity-20" />
                <span>UNION SQL Injection terminal is ready.</span>
                <span className="text-[10px] block mt-1">Provide target configurations or click the Vulnerable Preset to automatically fill parameters and execute.</span>
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

          {/* Exposed Data Grid */}
          {simResult === 'success' && exposedData.length > 0 && (
            <div className="border-t border-cyber-border/70 p-4 bg-cyber-card/95 backdrop-blur-sm shrink-0 animate-fade-in space-y-3 max-h-[220px] overflow-y-auto">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-cyber-green uppercase tracking-wider flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-cyber-green animate-pulse" />
                  Exposed Table Output Buffer (UNION Dump)
                </span>
                <span className="text-[9px] text-[#ff3a3a] border border-[#ff3a3a]/40 bg-[#ff3a3a]/10 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  CREDENTIALS LEAKED
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-[10px] font-mono">
                  <thead>
                    <tr className="border-b border-cyber-border text-cyber-dim">
                      <th className="pb-1 font-bold pl-2">ID</th>
                      <th className="pb-1 font-bold">Email</th>
                      <th className="pb-1 font-bold">Admin</th>
                      <th className="pb-1 font-bold pr-2">Password Hash</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exposedData.map((row, idx) => (
                      <tr key={idx} className="border-b border-cyber-border/20 hover:bg-cyber-blue/[0.04] transition-colors text-cyber-text">
                        <td className="py-1.5 pl-2">{row.id}</td>
                        <td className="py-1.5 text-cyber-title font-semibold select-all">{row.email}</td>
                        <td className="py-1.5 text-cyber-blue-light select-all">{row.is_admin ? "Yes" : "No"}</td>
                        <td className="py-1.5 text-cyber-green select-all">{row.password_hash}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {mode === 'table-enumeration' && simResult === 'success' && discoveredTables.length > 0 && (
        <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full font-mono animate-fade-in shadow-lg">
          <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-red" />
          <div className="flex items-center justify-between border-b border-cyber-border/40 pb-3">
            <h3 className="font-sans font-bold text-sm text-cyber-title tracking-wider uppercase flex items-center gap-2">
              <Database className="w-4 h-4 text-cyber-red" />
              DISCOVERED DATABASE TABLES
            </h3>
            <span className="text-[10px] text-cyber-blue border border-cyber-blue/30 bg-cyber-blue/5 px-2.5 py-1 rounded uppercase font-bold">
              Tables discovered: {discoveredTables.length}
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {discoveredTables.map((tbl, i) => (
              <div key={i} className="flex items-center justify-between bg-cyber-black/40 border border-cyber-border/70 rounded-lg p-3 hover:border-cyber-red/30 transition-all">
                <div className="flex items-center gap-2.5">
                  <Server className="w-3.5 h-3.5 text-cyber-dim" />
                  <div className="flex flex-col">
                    <span className="text-[8px] text-cyber-dim uppercase font-bold">Schema: {tbl.schema || 'public'}</span>
                    <span className="text-xs text-cyber-title font-bold font-mono">{tbl.table_name}</span>
                  </div>
                </div>
                <span className="text-[8px] text-cyber-red border border-cyber-red/30 bg-cyber-red/5 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                  EXPOSED
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Educational Caution Alert */}
      <div className="bg-cyber-blue/5 border border-cyber-blue/30 rounded-xl p-4 text-xs font-mono leading-relaxed text-cyber-blue-light flex gap-3 items-start w-full">
        <ShieldAlert className="w-5 h-5 shrink-0 text-cyber-blue animate-pulse" />
        <div>
          <span className="font-bold text-cyber-title uppercase block mb-1">🛡 LOCAL EDUCATIONAL LAB</span>
          This module sends real HTTP requests only to the configured local or private lab target. Use it exclusively in the intentionally vulnerable Golimar demonstration environment.
        </div>
      </div>
    </div>
  );
}
