import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Terminal as TerminalIcon, Database, Lock, EyeOff, Trash2, HelpCircle, Globe, Cpu } from 'lucide-react';

export default function Attacks() {
  const attackCards = [
    {
      id: 1,
      num: 'ATTACK_01',
      title: 'Classic SQL Injection',
      desc: 'Manipulating a query by injecting SQL code directly into input fields to bypass filter clauses.',
      input: "' OR '1'='1",
      result: 'Returns ALL rows from table',
      to: '/attacks/classic-injection',
      instructionTo: '/instructions/classic-sql-injection',
      icon: TerminalIcon,
      destructive: false,
      badge: 'Tautology Probe'
    },
    {
      id: 2,
      num: 'ATTACK_02',
      title: 'Login Bypass',
      desc: 'Bypassing authorization without knowing credentials using SQL quotes escape and comments.',
      input: "admin' --",
      result: 'Password check ignored!',
      to: '/attacks/login-bypass',
      instructionTo: '/instructions/login-bypass',
      icon: Lock,
      destructive: false,
      badge: 'Auth Bypass'
    },
    {
      id: 3,
      num: 'ATTACK_03',
      title: 'UNION Attack',
      desc: 'Using UNION SELECT operator to append secondary queries and dump tables.',
      input: "' UNION SELECT 1,username,password,4 FROM users --",
      result: 'Users table dumped!',
      to: '/attacks/union-attack',
      instructionTo: '/instructions/union-attack',
      icon: Database,
      destructive: false,
      badge: 'Data Leakage'
    },
    {
      id: 4,
      num: 'ATTACK_04',
      title: 'Blind SQL Injection',
      desc: 'Extracting schemas when no output is visible by measuring boolean responses or induced delays.',
      input: "True: ' AND 1=1 --\nFalse: ' AND 1=2 --\nTime: ' AND (SELECT SLEEP(5)) --",
      result: 'Inferred via state behaviors / latency',
      to: '/attacks/blind-injection',
      instructionTo: '/instructions/blind-injection',
      icon: EyeOff,
      destructive: false,
      badge: 'Side-Channel Inference'
    },
    {
      id: 5,
      num: 'ATTACK_05',
      title: 'Drop Table Attack',
      desc: 'Injecting administrative stacked queries separated by semicolons to delete database structures.',
      input: "'; DROP TABLE users; --",
      result: '⚠ Table permanently deleted!',
      to: '/attacks/drop-table',
      instructionTo: '/instructions/drop-table-attack',
      icon: Trash2,
      destructive: true,
      badge: 'Destructive Stack'
    },
    {
      id: 6,
      num: 'ATTACK_06',
      title: 'Comment Attack',
      desc: 'Using DBMS specific comment syntax to neutralize and strip away password checking blocks.',
      input: "admin' #",
      result: 'Everything after # ignored!',
      to: '/attacks/comment-attack',
      instructionTo: '/instructions/comment-attack',
      icon: HelpCircle,
      destructive: false,
      badge: 'Neutralizing Comment'
    }
  ];


  return (
    <div className="space-y-10 select-none w-full max-w-5xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col gap-2 pt-2 border-b border-cyber-border/40 pb-6">
        <span className="text-xs font-mono font-bold text-cyber-blue tracking-[4px] uppercase flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 animate-pulse" />
          Interactive Cyber Environment
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-cyber-title tracking-wide uppercase">
          Interactive <span className="text-cyber-blue">Attack Scenarios</span>
        </h1>
        <p className="text-cyber-dim text-sm text-justify leading-relaxed">
          Welcome to the main simulated target directory. Access all six newly created remote penetration testing scenarios to inspect database behaviors, formulate customized SQL payloads, and analyze server connection pipes.
        </p>
      </div>

      {/* Attack Cards Grid Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-cyber-dim">
          <span>6 Active Remote Modules — Click to launch scenario</span>
          <span className="flex-1 h-[1px] bg-cyber-border" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {attackCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.id}
                to={card.to}
                className={`group bg-cyber-card border rounded-xl p-5 relative overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  card.destructive
                    ? 'border-cyber-red/30 hover:border-cyber-red hover:shadow-[0_8px_30px_var(--accent-glow-red)]'
                    : 'border-cyber-border hover:border-cyber-blue hover:shadow-[0_8px_30px_var(--accent-glow)]'
                }`}
              >
                {/* Visual Top Line Indicator */}
                <span
                  className={`absolute top-0 left-0 right-0 h-[3px] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ${
                    card.destructive ? 'bg-cyber-red' : 'bg-cyber-blue'
                  }`}
                />

                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${
                      card.destructive
                        ? 'bg-cyber-red/15 border-cyber-red/40 text-cyber-red'
                        : 'bg-cyber-blue/10 border-cyber-blue/30 text-cyber-blue-light'
                    }`}>
                      {card.badge}
                    </span>
                  </div>

                  <h2 className="font-sans font-bold text-base text-cyber-title tracking-wide transition-colors flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${card.destructive ? 'text-cyber-red' : 'text-cyber-blue'}`} />
                    {card.title}
                  </h2>
                  
                  <p className="text-sm text-cyber-dim text-justify leading-relaxed min-h-[48px]">
                    {card.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
