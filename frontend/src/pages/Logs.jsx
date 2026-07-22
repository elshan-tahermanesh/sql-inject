import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { History, Search, Trash2, ChevronDown, ChevronUp, Database, ShieldCheck, AlertTriangle, ArrowRight, Terminal } from 'lucide-react';

const CATEGORIES = [
  'Classic SQLi',
  'Login Bypass',
  'UNION Attack',
  'Blind SQLi',
  'Drop Table',
  'Comment Attack'
];

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Load logs on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('sql_sandbox_test_logs');
      if (stored) {
        setLogs(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load logs from localStorage', e);
    }
  }, []);

  // Flush all logs
  const handleClearLogs = () => {
    if (window.confirm('Are you sure you want to flush all test execution logs?')) {
      try {
        localStorage.removeItem('sql_sandbox_test_logs');
        setLogs([]);
        setExpandedId(null);
      } catch (e) {
        console.error('Failed to clear logs', e);
      }
    }
  };

  // Toggle inline expansion for details
  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Filter logs based on search and category
  const filteredLogs = logs.filter(log => {
    const matchesCategory = categoryFilter === 'ALL' || log.category === categoryFilter;
    const matchesSearch = 
      log.payload.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.query && log.query.toLowerCase().includes(searchQuery.toLowerCase())) ||
      log.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Calculate statistics
  const totalCount = logs.length;
  const exploitedCount = logs.filter(l => l.status === 'EXPLOITED').length;
  const blockedCount = logs.filter(l => l.status === 'BLOCKED').length;

  const getStatusBadgeClass = (status) => {
    return status === 'EXPLOITED'
      ? 'bg-cyber-red/10 border border-cyber-red/40 text-cyber-red font-bold px-2 py-0.5 rounded text-[11px] tracking-wider'
      : 'bg-cyber-green/10 border border-cyber-green/40 text-cyber-green font-bold px-2 py-0.5 rounded text-[11px] tracking-wider';
  };

  const getModuleBadgeClass = (category) => {
    switch (category) {
      case 'Classic SQLi':
        return 'bg-cyber-blue/10 border border-cyber-blue/30 text-cyber-blue-light px-2.5 py-0.5 rounded-full text-[11px] font-semibold';
      case 'Login Bypass':
        return 'bg-purple-500/10 border border-purple-500/30 text-purple-500 px-2.5 py-0.5 rounded-full text-[11px] font-semibold';
      case 'UNION Attack':
        return 'bg-pink-500/10 border border-pink-500/30 text-pink-500 px-2.5 py-0.5 rounded-full text-[11px] font-semibold';
      case 'Blind SQLi':
        return 'bg-amber-500/10 border border-amber-500/30 text-amber-500 px-2.5 py-0.5 rounded-full text-[11px] font-semibold';
      case 'Drop Table':
        return 'bg-cyber-red/10 border border-cyber-red/30 text-cyber-red px-2.5 py-0.5 rounded-full text-[11px] font-semibold';
      case 'Comment Attack':
      default:
        return 'bg-teal-500/10 border border-teal-500/30 text-teal-500 px-2.5 py-0.5 rounded-full text-[11px] font-semibold';
    }
  };

  const getMitigationAdvice = (category) => {
    switch (category) {
      case 'Classic SQLi':
        return 'Parameterized queries (prepared statements) fully prevent tautology bypass by treating all input as literal values rather than executable code segments.';
      case 'Login Bypass':
        return 'Always bind authentication query variables and sanitize input. Never concatenate raw login credentials directly into query execution structures.';
      case 'UNION Attack':
        return 'Restrict query returns and parameterize input bounds. Ensure application servers do not blindly mirror combined query structure errors to the client UI.';
      case 'Blind SQLi':
        return 'Block system thread sleep commands, employ robust database error shields, and avoid structural side-channel data leaks via generic server responses.';
      case 'Drop Table':
        return 'Disable support for multiple stacked query statements inside your driver config. Restrict user accounts from possessing full DDL privileges like DROP.';
      case 'Comment Attack':
      default:
        return 'Utilize robust sanitization filters to strip escape sequences (--, #, /*) and bind dynamic values cleanly using standard ORM libraries.';
    }
  };

  return (
    <div className="space-y-8 select-none w-full max-w-5xl mx-auto page-enter">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-cyber-border/40 pb-6">
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-cyber-blue tracking-[4px] uppercase flex items-center gap-2">
            <History className="w-4 h-4" />
            Security Playground Logs
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-cyber-title tracking-wide uppercase">
            Test <span className="text-cyber-blue">Execution History</span>
          </h1>
          <p className="text-cyber-dim text-sm text-justify leading-relaxed">
            Review and analyze the SQL injection payloads you have executed across the remote playground environments. Inspect compiled query structures and vulnerability results.
          </p>
        </div>

        {totalCount > 0 && (
          <button
            onClick={handleClearLogs}
            className="self-start md:self-center flex items-center gap-2 text-xs font-mono font-bold tracking-wider px-4 py-2.5 border border-cyber-red/40 bg-cyber-red/10 text-cyber-red hover:bg-cyber-red/20 rounded-lg cursor-pointer transition-all uppercase"
          >
            <Trash2 className="w-4 h-4" />
            Clear Log History
          </button>
        )}
      </div>

      {totalCount === 0 ? (
        /* Empty State */
        <div className="bg-cyber-card border border-cyber-border rounded-xl p-12 text-center flex flex-col items-center justify-center space-y-6 shadow-md">
          <div className="p-4 bg-cyber-blue/10 border border-cyber-blue/30 rounded-full text-cyber-blue">
            <Database className="w-10 h-10 animate-pulse" />
          </div>
          <div className="space-y-2 max-w-md">
            <h3 className="text-lg font-bold text-cyber-title uppercase font-sans">No Test Attempts Logged Yet</h3>
            <p className="text-cyber-dim text-sm text-justify leading-relaxed">
              Your test record is currently empty. Go to the attacks dashboard, load up any remote scenario, and run a simulation to see it captured here.
            </p>
          </div>
          <Link
            to="/attacks"
            className="inline-flex items-center gap-2 bg-cyber-blue hover:bg-cyber-blue-light text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-lg transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            Go to Attacks Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        /* Full Logs View */
        <div className="space-y-6">
          {/* Summary stats row - highly simple and elegant */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 flex items-center justify-between shadow-sm">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-cyber-dim">Total Tests Conducted</span>
                <div className="text-2xl font-bold font-mono text-cyber-title mt-1">{totalCount}</div>
              </div>
              <Terminal className="w-7 h-7 text-cyber-blue/50" />
            </div>

            <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 flex items-center justify-between shadow-sm">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-cyber-dim">Exploits Successful</span>
                <div className="text-2xl font-bold font-mono text-cyber-red mt-1">{exploitedCount}</div>
              </div>
              <AlertTriangle className="w-7 h-7 text-cyber-red/50" />
            </div>

            <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 flex items-center justify-between shadow-sm">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-cyber-dim">Blocked / Handled</span>
                <div className="text-2xl font-bold font-mono text-cyber-green mt-1">{blockedCount}</div>
              </div>
              <ShieldCheck className="w-7 h-7 text-cyber-green/50" />
            </div>
          </div>

          {/* Simple Spacious Filters */}
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-cyber-dim absolute left-3 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter logs by payload string..."
                className="w-full text-xs bg-cyber-input border border-cyber-border hover:border-cyber-blue/40 focus:border-cyber-blue focus:outline-none rounded-lg py-2.5 pl-9 pr-4 text-cyber-text font-mono transition-colors"
              />
            </div>

            {/* Category selection */}
            <div className="flex items-center gap-2.5 text-xs font-mono w-full md:w-auto justify-end">
              <span className="text-cyber-dim uppercase text-[11px] shrink-0">Filter Module:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full md:w-auto bg-cyber-input border border-cyber-border hover:border-cyber-blue/40 focus:border-cyber-blue focus:outline-none rounded-lg px-3 py-2 text-cyber-text font-mono text-[11px] transition-colors"
              >
                <option value="ALL">ALL MODULES</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Spacious Log Table */}
          <div className="bg-cyber-card border border-cyber-border rounded-xl overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-cyber-border bg-cyber-header/20 text-cyber-dim select-none">
                    <th className="py-4 px-5 font-bold tracking-wider uppercase text-[10px] w-24">Time</th>
                    <th className="py-4 px-4 font-bold tracking-wider uppercase text-[10px] w-40">Scenario Module</th>
                    <th className="py-4 px-4 font-bold tracking-wider uppercase text-[10px]">Tested Payload</th>
                    <th className="py-4 px-4 font-bold tracking-wider uppercase text-[10px] w-32 text-center">Status</th>
                    <th className="py-4 px-5 font-bold tracking-wider uppercase text-[10px] w-20 text-center">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyber-border/30 text-cyber-text">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-12 text-center text-cyber-dim">
                        No recorded runs match your search filters.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => {
                      const isExpanded = expandedId === log.id;
                      return (
                        <React.Fragment key={log.id}>
                          {/* Main Row */}
                          <tr
                            onClick={() => toggleExpand(log.id)}
                            className="hover:bg-cyber-blue/[0.02] cursor-pointer transition-colors border-b border-cyber-border/20 group"
                          >
                            <td className="py-4 px-5 text-cyber-dim font-medium whitespace-nowrap">{log.timestamp}</td>
                            <td className="py-4 px-4 whitespace-nowrap">
                              <span className={getModuleBadgeClass(log.category)}>
                                {log.category}
                              </span>
                            </td>
                            <td className="py-4 px-4 font-semibold select-all break-all max-w-sm truncate text-cyber-title">
                              <code className="bg-cyber-input/60 px-2 py-1 rounded border border-cyber-border/40 text-cyber-red break-all font-mono">
                                {log.payload}
                              </code>
                            </td>
                            <td className="py-4 px-4 text-center whitespace-nowrap">
                              <span className={getStatusBadgeClass(log.status)}>
                                {log.status}
                              </span>
                            </td>
                            <td className="py-4 px-5 text-center">
                              <button 
                                className="p-1.5 border border-cyber-border group-hover:border-cyber-blue text-cyber-dim group-hover:text-cyber-blue rounded-lg transition-colors cursor-pointer"
                                aria-label="Toggle details inline"
                              >
                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </button>
                            </td>
                          </tr>

                          {/* Expanded Details Panel */}
                          {isExpanded && (
                            <tr className="bg-cyber-input/10">
                              <td colSpan="5" className="py-5 px-6 select-text font-sans border-b border-cyber-border/40 animate-fade-in">
                                <div className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                      <span className="text-[10px] font-mono uppercase text-cyber-dim font-bold tracking-wider">
                                        Exploit Context
                                      </span>
                                      <div className="text-xs text-cyber-text leading-relaxed">
                                        Module: <span className="font-semibold text-cyber-title">{log.category}</span><br />
                                        Date Tested: <span className="font-semibold text-cyber-title">{log.date || 'Active Session'}</span><br />
                                        Attack Vector: <span className="font-semibold text-cyber-title">{log.status === 'EXPLOITED' ? 'Successful Concatenation / Bypass' : 'Mitigated by Sanitization or Logic Mismatch'}</span>
                                      </div>
                                    </div>
                                    <div className="space-y-1">
                                      <span className="text-[10px] font-mono uppercase text-cyber-dim font-bold tracking-wider">
                                        Standard Remediation
                                      </span>
                                      <p className="text-xs text-cyber-dim leading-relaxed">
                                        {getMitigationAdvice(log.category)}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="space-y-1.5">
                                    <span className="text-[10px] font-mono uppercase text-cyber-dim font-bold tracking-wider block">
                                      Simulated SQL Execution Path
                                    </span>
                                    <pre className="p-4 bg-cyber-pre border border-cyber-border rounded-lg text-cyber-blue-light overflow-x-auto text-[13px] font-mono leading-relaxed select-all">
                                      {log.query || `SELECT * FROM products WHERE category = '${log.payload}'`}
                                    </pre>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
