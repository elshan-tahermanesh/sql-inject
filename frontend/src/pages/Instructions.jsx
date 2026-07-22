import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Lock, Database, Eye, Trash2, HelpCircle } from 'lucide-react';

const injections = [
  {
    badge:       'Tautology Probe',
    badgeColor:  'text-cyber-blue border-cyber-blue/40 bg-cyber-blue/10',
    icon:        Terminal,
    iconColor:   'text-cyber-blue',
    title:       'Classic SQL Injection',
    description: 'Manipulating a query by injecting SQL code directly into input fields to bypass filter clauses and retrieve unauthorized records.',
    instructionsLink: '/instructions/classic-sql-injection',
    sandboxLink:      '/attacks/classic-injection',
    accent:      'cyber-blue',
  },
  {
    badge:       'Auth Bypass',
    badgeColor:  'text-cyber-blue border-cyber-blue/40 bg-cyber-blue/10',
    icon:        Lock,
    iconColor:   'text-cyber-blue',
    title:       'Login Bypass',
    description: 'Bypassing authorization without knowing credentials using SQL quotes escape and comment sequences to neutralize password checks.',
    instructionsLink: '/instructions/login-bypass',
    sandboxLink:      '/attacks/login-bypass',
    accent:      'cyber-blue',
  },
  {
    badge:       'Data Leakage',
    badgeColor:  'text-cyber-blue border-cyber-blue/40 bg-cyber-blue/10',
    icon:        Database,
    iconColor:   'text-cyber-blue',
    title:       'UNION Attack',
    description: 'Using UNION SELECT operator to append secondary queries and dump data from unrelated tables into the application response.',
    instructionsLink: '/instructions/union-attack',
    sandboxLink:      '/attacks/union-attack',
    accent:      'cyber-blue',
  },
  {
    badge:       'Side-Channel Inference',
    badgeColor:  'text-cyber-blue border-cyber-blue/40 bg-cyber-blue/10',
    icon:        Eye,
    iconColor:   'text-cyber-blue',
    title:       'Blind SQL Injection',
    description: 'Extracting schemas when no output is visible by measuring boolean responses or induced time delays in server replies.',
    instructionsLink: '/instructions/blind-injection',
    sandboxLink:      '/attacks/blind-injection',
    accent:      'cyber-blue',
  },
  {
    badge:       'Destructive Stack',
    badgeColor:  'text-cyber-red border-cyber-red/40 bg-cyber-red/10',
    icon:        Trash2,
    iconColor:   'text-cyber-red',
    title:       'Drop Table Attack',
    description: 'Injecting administrative stacked queries separated by semicolons to delete entire database structures and tables.',
    instructionsLink: '/instructions/drop-table-attack',
    sandboxLink:      '/attacks/drop-table',
    accent:      'cyber-red',
    destructive: true,
  },
  {
    badge:       'Neutralizing Comment',
    badgeColor:  'text-cyber-blue border-cyber-blue/40 bg-cyber-blue/10',
    icon:        HelpCircle,
    iconColor:   'text-cyber-blue',
    title:       'Comment Attack',
    description: 'Using DBMS-specific comment syntax to neutralize and strip away password checking blocks from the executed SQL query.',
    instructionsLink: '/instructions/comment-attack',
    sandboxLink:      '/attacks/comment-attack',
    accent:      'cyber-blue',
  },
];

export default function Instructions() {
  return (
    <div className="space-y-10 select-none w-full">

      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-cyber-border/40 pb-6">
        <h1 className="text-3xl font-extrabold text-cyber-title tracking-wide uppercase">
          Injection <span className="text-cyber-blue">Instructions</span>
        </h1>
        <p className="text-cyber-dim text-sm text-justify leading-relaxed">
          A brief overview of each SQL injection technique covered in this environment. Select any card to read detailed instructions or jump straight into the live simulator.
        </p>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {injections.map((item, idx) => {
          const Icon = item.icon;
          const borderHover = item.destructive
            ? 'hover:border-cyber-red/60 hover:shadow-[0_8px_30px_var(--accent-glow-red)]'
            : 'hover:border-cyber-blue/50 hover:shadow-[0_8px_30px_var(--accent-glow)]';
          const topBar = item.destructive ? 'bg-cyber-red' : 'bg-cyber-blue';

          return (
            <Link
              key={idx}
              to={item.instructionsLink}
              className={`group bg-cyber-card border border-cyber-border rounded-xl p-6 flex flex-col justify-between gap-5 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden ${borderHover}`}
            >
              {/* Sliding top accent bar */}
              <span className={`absolute top-0 left-0 right-0 h-[2px] ${topBar} scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300`} />

              {/* Top content */}
              <div className="space-y-3">
                {/* Badge */}
                <span className={`inline-block text-[9px] font-bold uppercase tracking-[2px] border px-2 py-0.5 rounded ${item.badgeColor}`}>
                  {item.badge}
                </span>

                {/* Icon + Title */}
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-5 h-5 shrink-0 ${item.iconColor}`} />
                  <h2 className="font-sans font-bold text-base text-cyber-title tracking-wide group-hover:text-cyber-blue-light transition-colors">
                    {item.title}
                  </h2>
                </div>

                {/* Description */}
                <p className="text-sm text-cyber-dim text-justify leading-relaxed">
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
