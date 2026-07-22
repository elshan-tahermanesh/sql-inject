import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, Terminal, Lock, Database, EyeOff, Trash2, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';

const categories = [
  {
    id: 'classic-sql-injection',
    title: 'Classic SQL Injection',
    description: 'The foundation of SQLi. Uses logical tautologies and string breakouts to manipulate query outcomes and access unauthorized records.',
    badge: 'Tautologies & Escapes',
    payloadCount: 14,
    icon: Terminal,
    iconColor: 'text-cyber-blue',
    accentColor: 'cyber-blue',
    link: '/payload-library/classic-sql-injection',
    tags: ['Tautology', 'String Breakout', 'AND/OR Logic', 'MySQL', 'PostgreSQL', 'SQLite'],
    popular: true,
  },
  {
    id: 'login-bypass',
    title: 'Login Bypass Payloads',
    description: 'Specialized authentication breakouts designed to strip username/password verification and authenticate as admin without credentials.',
    badge: 'Auth Exploits',
    payloadCount: 14,
    icon: Lock,
    iconColor: 'text-cyber-blue',
    accentColor: 'cyber-blue',
    link: '/payload-library/login-bypass',
    tags: ['Admin Bypass', 'Comment Stripping', 'Tautologies'],
    popular: false,
  },
  {
    id: 'union-attack',
    title: 'UNION Select Attacks',
    description: 'Appends secondary results from adjacent database tables into the main response buffer using the UNION keyword.',
    badge: 'Data Extraction',
    payloadCount: 13,
    icon: Database,
    iconColor: 'text-cyber-blue',
    accentColor: 'cyber-blue',
    link: '/payload-library/union-attack',
    tags: ['UNION SELECT', 'Column Matching', 'Data Dump', 'SQL Server'],
    popular: false,
  },
  {
    id: 'blind-injection',
    title: 'Blind & Time-Based Injection',
    description: 'Side-channel attacks used when no error messages or output columns are visible. Leverages boolean true/false states and time delays.',
    badge: 'Inference Probe',
    payloadCount: 26,
    icon: EyeOff,
    iconColor: 'text-cyber-blue',
    accentColor: 'cyber-blue',
    link: '/payload-library/blind-injection',
    tags: ['Time Delay', 'Boolean Logic', 'SLEEP()', 'BENCHMARK()'],
    popular: false,
  },
  {
    id: 'stacked-queries',
    title: 'Stacked Queries (Drop Table)',
    description: 'Executing multiple, independent SQL queries in a single database round-trip by utilizing semicolon (;) statement separators.',
    badge: 'Destructive Stack',
    payloadCount: 13,
    icon: Trash2,
    iconColor: 'text-cyber-red',
    accentColor: 'cyber-red',
    link: '/payload-library/drop-table-attack',
    tags: ['Stacked Statements', 'Semicolon Breakout', 'DROP TABLE', 'ALTER'],
    popular: false,
  },
  {
    id: 'comment-attack',
    title: 'Comment-Based Variations',
    description: 'Neutralizing remaining logic checks inside queries using database-specific syntax comment flags (#, --, /* */).',
    badge: 'Neutralizing Comments',
    payloadCount: 30,
    icon: HelpCircle,
    iconColor: 'text-cyber-blue',
    accentColor: 'cyber-blue',
    link: '/payload-library/comment-attack',
    tags: ['Inline Comments', 'Hash Character', 'Double Dash', 'DBMS-Specific'],
    popular: false,
  },
];

export default function PayloadLibrary() {
  return (
    <div className="space-y-10 select-none w-full max-w-5xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col gap-2 pt-2 border-b border-cyber-border/40 pb-6 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-blue/5 blur-[50px] rounded-full pointer-events-none" />
        <span className="text-xs font-mono font-bold text-cyber-blue tracking-[4px] uppercase flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyber-blue" />
          SECURE PAYLOAD DICTIONARY
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-cyber-title tracking-wide uppercase">
          SQLi <span className="text-cyber-blue">Payload Library</span>
        </h1>
        <p className="text-cyber-dim text-sm text-justify leading-relaxed">
          Explore our structured security payload database. Study how specialized character sequences alter database execution pathways. Select a category below to browse payloads, copy active syntax, and understand mitigation concepts.
        </p>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category) => {
          const Icon = category.icon;
          const isDestructive = category.accentColor === 'cyber-red';
          const borderHover = isDestructive
            ? 'hover:border-cyber-red/50 hover:shadow-[0_8px_30px_var(--accent-glow-red)]'
            : 'hover:border-cyber-blue/50 hover:shadow-[0_8px_30px_var(--accent-glow)]';
          
          return (
            <Link
              key={category.id}
              to={category.link}
              className={`group bg-cyber-card border border-cyber-border rounded-xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 relative overflow-hidden cursor-pointer ${borderHover}`}
            >
              {/* Visual Accent Top Bar */}
              <span className={`absolute top-0 left-0 right-0 h-[3px] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ${isDestructive ? 'bg-cyber-red' : 'bg-cyber-blue'}`} />
              
              {/* Popular Glow Effect */}
              {category.popular && (
                <div className="absolute top-2 right-2 flex items-center gap-1 text-[9px] font-bold text-[#ffbc2e] bg-[#ffbc2e]/10 border border-[#ffbc2e]/30 px-2 py-0.5 rounded tracking-widest font-mono uppercase">
                  <Sparkles className="w-2.5 h-2.5" /> Core
                </div>
              )}

              <div className="space-y-4">
                {/* Category Header */}
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg ${isDestructive ? 'bg-cyber-red/10 text-cyber-red' : 'bg-cyber-blue/10 text-cyber-blue'} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded border ${isDestructive ? 'bg-cyber-red/15 border-cyber-red/35 text-cyber-red' : 'bg-cyber-blue/10 border-cyber-blue/30 text-cyber-blue-light'} font-mono`}>
                      {category.badge}
                    </span>
                    <h2 className="font-sans font-bold text-lg text-cyber-title group-hover:text-cyber-blue-light transition-colors mt-0.5">
                      {category.title}
                    </h2>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-cyber-dim text-justify leading-relaxed">
                  {category.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {category.tags.map((tag, index) => (
                    <span key={index} className="text-[10px] font-mono bg-cyber-pre border border-cyber-border/40 text-cyber-text/80 px-2 py-0.5 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer Action */}
              <div className="pt-6 mt-4 border-t border-cyber-border/30 flex items-center justify-between">
                <span className="text-xs font-mono text-cyber-dim">
                  Payloads: <strong className="text-cyber-title">{category.payloadCount}</strong>
                </span>
                
                <div
                  className={`inline-flex items-center gap-1.5 text-xs font-bold font-mono tracking-widest uppercase transition-colors ${isDestructive ? 'text-cyber-red group-hover:text-[#ff6060]' : 'text-cyber-blue group-hover:text-cyber-blue-light'}`}
                >
                  Launch Module
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
