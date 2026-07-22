import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Combine, Database, ShieldAlert, CheckCircle2, XCircle, AlertTriangle, Check, ShieldCheck, Eye, Files, Terminal } from 'lucide-react';

// Custom lightweight syntax highlighter for controlled educational snippets
function highlightCode(code, lang) {
  if (!code) return '';
  
  // Escape HTML tags to prevent XSS and rendering issues
  let escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  if (lang === 'Python') {
    const comments = [];
    const strings = [];

    // 1. Extract strings first (so we don't treat # inside strings as comments)
    escaped = escaped.replace(/(f?".*?"|f?'.*?'|f?"""[\s\S]*?"""|f?'''[\s\S]*?''')/g, (match) => {
      const placeholder = `___PYSTRING_${strings.length}___`;
      strings.push(match);
      return placeholder;
    });

    // 2. Extract comments starting with #
    escaped = escaped.replace(/(#[^\n]*)/g, (match) => {
      const placeholder = `___PYCOMMENT_${comments.length}___`;
      comments.push(match);
      return placeholder;
    });

    // 3. Highlight keywords
    const pyKeywords = ['if', 'not', 'in', 'return', 'def', 'import', 'from', 'for', 'class', 'else'];
    pyKeywords.forEach(kw => {
      const regex = new RegExp(`\\b(${kw})\\b`, 'g');
      escaped = escaped.replace(regex, '<span class="text-cyber-blue font-bold">$1</span>');
    });

    // 4. Highlight variables
    const vars = ['search', 'query', 'results', 'db', 'user', 'username', 'password'];
    vars.forEach(v => {
      const regex = new RegExp(`\\b(${v})\\b`, 'g');
      escaped = escaped.replace(regex, '<span class="text-code-variable font-semibold">$1</span>');
    });

    // 5. Highlight functions, methods, builtins
    escaped = escaped.replace(/\b(request\.args\.get|db\.execute|\.fetchone)\b/g, '<span class="text-code-function font-semibold">$1</span>');

    // 6. Restore comments with highlighting
    comments.forEach((commentText, index) => {
      const highlighted = `<span class="text-code-comment italic text-cyber-dim/80">${commentText}</span>`;
      escaped = escaped.replace(`___PYCOMMENT_${index}___`, highlighted);
    });

    // 7. Restore strings with highlighting
    strings.forEach((stringValue, index) => {
      let inner = stringValue;
      if (stringValue.startsWith('f')) {
        inner = stringValue.replace(/(\{.*?\})/g, '<span class="text-cyber-title font-mono font-normal">$1</span>');
      }
      const highlighted = `<span class="text-code-py-string text-[#e9c46a]">${inner}</span>`;
      escaped = escaped.replace(`___PYSTRING_${index}___`, highlighted);
    });
    
    return escaped;
  }

  if (lang === 'SQL') {
    // 1. Strings enclosed in single quotes
    escaped = escaped.replace(/('.*?')/g, '<span class="text-code-string font-semibold text-[#a7f3d0]">$1</span>');

    // 2. Keywords
    const sqlKeywords = [
      'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'UNION', 'LIKE', 'NULL', 'ROW_NUMBER', 'OVER', 'ORDER BY', 'TRUE', 'FALSE'
    ];
    sqlKeywords.forEach(kw => {
      const regex = new RegExp(`\\b(${kw})\\b`, 'g');
      escaped = escaped.replace(regex, '<span class="text-cyber-blue font-bold">$1</span>');
    });

    // 3. Comments starting with --
    escaped = escaped.replace(/(--[^\n]*)/g, '<span class="text-code-comment italic text-cyber-dim/80">$1</span>');

    return escaped;
  }

  return escaped;
}

// Reusable educational Code Box snippet component
function CodeBox({ lang, code }) {
  return (
    <div className="bg-cyber-pre border border-cyber-border/70 rounded-xl overflow-hidden font-mono text-xs select-text my-2 shadow-md relative">
      <div className="px-4 py-2 flex items-center justify-between text-cyber-dim select-none border-b border-cyber-border/30 bg-cyber-card/40">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-cyber-dim/60">&lt;/&gt;</span>
          <span className="text-[10px] font-bold text-cyber-dim tracking-wider uppercase">{lang}</span>
        </div>
      </div>
      <div 
        className="p-4 overflow-x-auto whitespace-pre leading-relaxed font-mono text-xs text-cyber-text"
        dangerouslySetInnerHTML={{ __html: highlightCode(code, lang) }}
      />
    </div>
  );
}

export default function UnionAttack() {
  return (
    <div className="space-y-8 select-none w-full max-w-5xl mx-auto">
      {/* Back Link */}
      <Link to="/instructions" className="inline-flex items-center gap-2 text-xs font-mono text-cyber-dim hover:text-cyber-blue transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" />
        back to instructions dashboard
      </Link>

      {/* Header Info */}
      <div className="flex flex-col gap-2 border-b border-cyber-border/40 pb-6 w-full relative">
        <div className="absolute -top-4 right-0 w-24 h-24 bg-cyber-blue/10 blur-[40px] rounded-full pointer-events-none" />
        <h1 className="text-3xl font-extrabold text-cyber-title tracking-wide uppercase">
          UNION-Based <span className="text-cyber-blue">SQL Injection</span>
        </h1>
        <p className="text-cyber-text text-sm text-justify w-full leading-relaxed font-medium">
          Learn how an attacker can append a second SELECT statement to a vulnerable query and combine unauthorized data with the original database results.
        </p>
        <div className="pt-1">
          <span className="inline-flex items-center text-[9px] font-mono font-bold tracking-wider text-cyber-blue border border-cyber-blue/30 bg-cyber-blue/5 px-2.5 py-0.5 rounded uppercase">
            DATA EXTRACTION TECHNIQUE
          </span>
        </div>
      </div>

      {/* 2. Section: What is UNION-Based SQL Injection? */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2.5 border-b border-cyber-border/40 pb-3">
          <Combine className="w-4.5 h-4.5 text-cyber-blue" />
          <h3 className="font-sans font-bold text-sm text-cyber-title tracking-wider uppercase">
            What is UNION-Based SQL Injection?
          </h3>
        </div>
        <div className="space-y-3 text-sm text-cyber-text leading-relaxed text-justify">
          <p>
            UNION-Based SQL Injection is a technique in which an attacker injects a second SELECT statement into a vulnerable SQL query.
          </p>
          <p>
            The SQL UNION operator combines the result of the original query with the result of the injected query. If both SELECT statements return a compatible number of columns and compatible data types, the database may display information from tables that the application never intended to expose.
          </p>
          <p className="text-xs text-cyber-dim font-sans italic border-l-2 border-cyber-blue/50 pl-3 mt-2">
            <strong>Note:</strong> UNION does not modify the original table by itself. It combines rows from multiple SELECT queries into one result set.
          </p>
        </div>

        {/* Info Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-cyber-border/30 text-xs font-mono">
          <div className="bg-cyber-black/30 border border-cyber-border/50 rounded-lg p-2.5">
            <span className="text-cyber-dim font-bold block uppercase text-[9px] tracking-wider mb-0.5">Cause</span>
            <span className="text-cyber-title font-bold">User input is inserted directly into an SQL query</span>
          </div>
          <div className="bg-cyber-black/30 border border-cyber-border/50 rounded-lg p-2.5">
            <span className="text-cyber-dim font-bold block uppercase text-[9px] tracking-wider mb-0.5">Attacker Goal</span>
            <span className="text-cyber-red font-bold">Append another SELECT statement</span>
          </div>
          <div className="bg-cyber-black/30 border border-cyber-border/50 rounded-lg p-2.5">
            <span className="text-cyber-dim font-bold block uppercase text-[9px] tracking-wider mb-0.5">Possible Impact</span>
            <span className="text-cyber-red font-bold">Extraction of users, credentials, metadata, or database schemas</span>
          </div>
        </div>
      </div>

      {/* 3. Section: Understand the SQL UNION operator */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2.5 border-b border-cyber-border/40 pb-3">
          <Database className="w-4.5 h-4.5 text-cyber-blue" />
          <h3 className="font-sans font-bold text-sm text-cyber-title tracking-wider uppercase">
            How does the UNION operator work?
          </h3>
        </div>

        <p className="text-sm text-cyber-text leading-relaxed text-justify">
          To combine result sets, the UNION operator requires the statements to have matching column counts and compatible data types. Let's look at two separate queries:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold font-mono text-cyber-dim uppercase tracking-wider block">Query 1 (Original Products)</span>
            <CodeBox lang="SQL" code={`SELECT name, category FROM products;`} />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold font-mono text-cyber-dim uppercase tracking-wider block">Query 2 (Injected Users)</span>
            <CodeBox lang="SQL" code={`SELECT username, role FROM users;`} />
          </div>
        </div>

        <div className="space-y-1.5 pt-2">
          <span className="text-xs font-bold font-mono text-cyber-dim block uppercase tracking-wider">Combined UNION Query</span>
          <CodeBox 
            lang="SQL" 
            code={`SELECT name, category FROM products
UNION
SELECT username, role FROM users;`} 
          />
        </div>

        <p className="text-sm text-cyber-text leading-relaxed text-justify">
          The database combines both result sets into a single output because both SELECT statements return two columns.
        </p>

        {/* Visual UNION Result Table */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold font-mono text-cyber-dim block uppercase tracking-wider">Combined Result Output</span>
            <span className="text-[9px] font-mono font-bold text-cyber-blue border border-cyber-blue/30 bg-cyber-blue/5 px-2 py-0.5 rounded uppercase">
              COLUMN COUNTS MUST MATCH
            </span>
          </div>
          <div className="overflow-x-auto border border-cyber-border rounded-lg bg-cyber-input">
            <table className="w-full border-collapse text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-cyber-border bg-cyber-card text-cyber-dim">
                  <th className="p-3 font-bold pl-4">column_1</th>
                  <th className="p-3 font-bold pr-4">column_2</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                  <td className="p-3 pl-4 text-cyber-title font-semibold">Gaming Laptop</td>
                  <td className="p-3 pr-4 text-cyber-text">electronics</td>
                </tr>
                <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                  <td className="p-3 pl-4 text-cyber-title font-semibold">Office Chair</td>
                  <td className="p-3 pr-4 text-cyber-text">furniture</td>
                </tr>
                <tr className="border-b border-cyber-border/30 bg-cyber-blue/5 hover:bg-cyber-blue/10">
                  <td className="p-3 pl-4 text-cyber-blue-light font-bold">admin</td>
                  <td className="p-3 pr-4 text-cyber-blue-light">administrator</td>
                </tr>
                <tr className="bg-cyber-blue/5 hover:bg-cyber-blue/10">
                  <td className="p-3 pl-4 text-cyber-blue-light font-bold">alice</td>
                  <td className="p-3 pr-4 text-cyber-blue-light">customer</td>
                </tr>
              </tbody>
            </table>
          </div>
          <span className="text-[10px] text-cyber-dim block font-sans italic mt-1 pl-1">
            * The corresponding columns must contain compatible data types. For example, a text column should usually be aligned with another text-compatible column.
          </span>
        </div>
      </div>

      {/* 4. Section: Vulnerable product search scenario */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2.5 border-b border-cyber-border/40 pb-3">
          <ShieldAlert className="w-4.5 h-4.5 text-cyber-red animate-pulse" />
          <h3 className="font-sans font-bold text-sm text-cyber-title tracking-wider uppercase">
            Vulnerable Golimar Store Product Search
          </h3>
        </div>

        <p className="text-sm text-cyber-text leading-relaxed text-justify">
          Imagine that the Golimar Store application receives a search term and directly inserts it into a query that searches the products table.
        </p>

        {/* Database Tables Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold font-mono text-cyber-dim block uppercase tracking-wider">
              Table 1: <code className="text-cyber-title bg-cyber-input px-1.5 py-0.5 rounded font-mono">products</code>
            </span>
            <div className="overflow-x-auto border border-cyber-border rounded-lg bg-cyber-input">
              <table className="w-full border-collapse text-left text-[10px] font-mono">
                <thead>
                  <tr className="border-b border-cyber-border bg-cyber-card text-cyber-dim">
                    <th className="p-2 pl-3">id</th>
                    <th className="p-2">name</th>
                    <th className="p-2">price</th>
                    <th className="p-2 pr-3">stock</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                    <td className="p-2 pl-3 text-cyber-dim">1</td>
                    <td className="p-2 text-cyber-title font-semibold">Gaming Laptop</td>
                    <td className="p-2">1299.00</td>
                    <td className="p-2 pr-3">8</td>
                  </tr>
                  <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                    <td className="p-2 pl-3 text-cyber-dim">2</td>
                    <td className="p-2 text-cyber-title font-semibold">Wireless Headphones</td>
                    <td className="p-2">299.00</td>
                    <td className="p-2 pr-3">24</td>
                  </tr>
                  <tr className="hover:bg-cyber-blue/5">
                    <td className="p-2 pl-3 text-cyber-dim">3</td>
                    <td className="p-2 text-cyber-title font-semibold">Office Chair</td>
                    <td className="p-2">249.00</td>
                    <td className="p-2 pr-3">12</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-bold font-mono text-cyber-dim block uppercase tracking-wider flex items-center justify-between">
              <span>Table 2: <code className="text-cyber-title bg-cyber-input px-1.5 py-0.5 rounded font-mono">users</code></span>
              <span className="text-[8px] border border-cyber-red/40 bg-cyber-red/10 px-1 rounded text-cyber-red font-bold">NOT INTENDED FOR SEARCH</span>
            </span>
            <div className="overflow-x-auto border border-cyber-border rounded-lg bg-cyber-input">
              <table className="w-full border-collapse text-left text-[10px] font-mono">
                <thead>
                  <tr className="border-b border-cyber-border bg-cyber-card text-cyber-dim">
                    <th className="p-2 pl-3">id</th>
                    <th className="p-2">username</th>
                    <th className="p-2 pr-3">role</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-cyber-border/30 hover:bg-cyber-red/5 bg-cyber-red/5">
                    <td className="p-2 pl-3 text-cyber-red">1</td>
                    <td className="p-2 text-cyber-red font-extrabold">admin</td>
                    <td className="p-2 pr-3 text-cyber-red">administrator</td>
                  </tr>
                  <tr className="hover:bg-cyber-red/5 bg-cyber-red/5">
                    <td className="p-2 pl-3 text-cyber-red">2</td>
                    <td className="p-2 text-cyber-red font-semibold">alice</td>
                    <td className="p-2 pr-3 text-cyber-red">customer</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 5. Show the vulnerable backend code */}
        <div className="space-y-2 pt-4 border-t border-cyber-border/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono text-cyber-dim uppercase tracking-wider">
              Vulnerable Python search code
            </span>
            <span className="text-[9px] font-mono font-bold text-cyber-red border border-cyber-red/30 bg-cyber-red/5 px-2 py-0.5 rounded uppercase">
              UNSAFE SEARCH QUERY
            </span>
          </div>

          <CodeBox 
            lang="Python" 
            code={`search = request.args.get("q")

query = (
    "SELECT id, name, price, stock, description "
    "FROM products "
    "WHERE name LIKE '%" + search + "%'"
)

results = db.execute(query)`} 
          />

          <p className="text-xs text-cyber-text leading-relaxed text-justify mt-2 pl-1">
            The search value is concatenated directly into the SQL statement. This allows a crafted value to close the original string and append a second SELECT query.
          </p>

          <div className="bg-cyber-red/5 border border-cyber-red/20 rounded-lg p-3 font-mono text-xs text-cyber-red/90 mt-2 space-y-1.5 text-center">
            <span className="font-extrabold uppercase text-[10px] tracking-wider block">Concatenation Point:</span>
            <code className="bg-cyber-black/40 px-3 py-1.5 rounded inline-block font-mono font-bold select-all">
              "WHERE name LIKE '%" + search + "%'"
            </code>
          </div>
        </div>
      </div>

      {/* 6. Show normal search behavior (Step 1) */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2 border-b border-cyber-border/40 pb-3">
          <div className="w-5 h-5 rounded-full bg-cyber-green/10 border border-cyber-green/30 flex items-center justify-center text-cyber-green text-[10px] font-bold font-mono">1</div>
          <h3 className="font-sans font-bold text-sm text-cyber-green tracking-wider uppercase">
            Step 1 — Normal product search
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div className="space-y-1.5">
            <span className="text-cyber-dim font-bold uppercase tracking-wider block">Target URL</span>
            <div className="bg-cyber-input border border-cyber-border rounded-lg p-2.5 text-cyber-text truncate select-all">
              http://127.0.0.1:2000/api/vulnerable/search?q=laptop
            </div>
          </div>
          <div className="space-y-1.5">
            <span className="text-cyber-dim font-bold uppercase tracking-wider block">User Search Input</span>
            <div className="bg-cyber-input border border-cyber-border rounded-lg p-2.5 text-cyber-title font-bold">
              laptop
            </div>
          </div>
        </div>

        <div className="space-y-1.5 font-mono text-xs">
          <span className="text-cyber-dim font-bold uppercase tracking-wider block">Generated SQL Query</span>
          <CodeBox 
            lang="SQL" 
            code={`SELECT id, name, price, stock, description
FROM products
WHERE name LIKE '%laptop%';`} 
          />
        </div>

        <div className="bg-cyber-green/5 border border-cyber-green/20 rounded-lg p-4 text-xs font-mono leading-relaxed space-y-3">
          <p className="text-cyber-green font-medium">
            <strong>Result:</strong> The database returns only product records whose name contains the word "laptop".
          </p>

          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-cyber-dim uppercase tracking-wider block">Returned Output Row:</span>
            <div className="overflow-x-auto border border-cyber-green/25 rounded-lg bg-cyber-black/30">
              <table className="w-full border-collapse text-left text-[11px] font-mono">
                <thead>
                  <tr className="border-b border-cyber-green/20 bg-cyber-green/5 text-cyber-green">
                    <th className="p-2 pl-3">id</th>
                    <th className="p-2">name</th>
                    <th className="p-2">price</th>
                    <th className="p-2">stock</th>
                    <th className="p-2 pr-3">description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 pl-3 text-cyber-title">1</td>
                    <td className="p-2 text-cyber-title font-bold">Gaming Laptop</td>
                    <td className="p-2 text-cyber-title">1299.00</td>
                    <td className="p-2 text-cyber-title">8</td>
                    <td className="p-2 pr-3 text-cyber-title">High-performance laptop</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Explain UNION compatibility requirements */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2.5 border-b border-cyber-border/40 pb-3">
          <Eye className="w-4.5 h-4.5 text-cyber-blue" />
          <h3 className="font-sans font-bold text-sm text-cyber-title tracking-wider uppercase">
            What must the attacker discover first?
          </h3>
        </div>

        <p className="text-sm text-cyber-text leading-relaxed text-justify">
          A UNION injection succeeds only when the injected SELECT matches the original query structure.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="bg-cyber-black/30 border border-cyber-border rounded-xl p-4 space-y-2 flex flex-col justify-between">
            <div>
              <span className="text-cyber-blue font-bold text-[9px] uppercase tracking-wider block mb-1">1. Number of Columns</span>
              <p className="text-cyber-dim text-[11px] leading-relaxed">
                The injected SELECT must return the same number of columns as the original SELECT.
              </p>
            </div>
            <code className="bg-cyber-input border border-cyber-border p-2 rounded text-[10px] text-center select-all block mt-2 text-cyber-title">
              SELECT id, name, price, stock, description<br />
              <span className="text-cyber-blue font-bold">Original Columns: 5</span>
            </code>
          </div>

          <div className="bg-cyber-black/30 border border-cyber-border rounded-xl p-4 space-y-2 flex flex-col justify-between">
            <div>
              <span className="text-cyber-blue font-bold text-[9px] uppercase tracking-wider block mb-1">2. Compatible Data Types</span>
              <p className="text-cyber-dim text-[11px] leading-relaxed">
                Each injected value must be compatible with the corresponding original column types.
              </p>
            </div>
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-[9px] border border-cyber-border/40 rounded bg-cyber-input">
                <thead>
                  <tr className="border-b border-cyber-border bg-cyber-card text-cyber-dim">
                    <th className="p-1 pl-2">Col</th>
                    <th className="p-1">Original Type</th>
                    <th className="p-1 pr-2 text-cyber-blue">Injected Val</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-cyber-border/20">
                    <td className="p-1 pl-2">1</td>
                    <td className="p-1">integer</td>
                    <td className="p-1 pr-2 text-cyber-blue-light font-bold">user id</td>
                  </tr>
                  <tr className="border-b border-cyber-border/20">
                    <td className="p-1 pl-2">2</td>
                    <td className="p-1">text</td>
                    <td className="p-1 pr-2 text-cyber-blue-light font-bold">username</td>
                  </tr>
                  <tr className="border-b border-cyber-border/20">
                    <td className="p-1 pl-2">3</td>
                    <td className="p-1">numeric</td>
                    <td className="p-1 pr-2 text-cyber-blue-light font-bold">0</td>
                  </tr>
                  <tr className="border-b border-cyber-border/20">
                    <td className="p-1 pl-2">4</td>
                    <td className="p-1">integer</td>
                    <td className="p-1 pr-2 text-cyber-blue-light font-bold">0</td>
                  </tr>
                  <tr>
                    <td className="p-1 pl-2">5</td>
                    <td className="p-1">text</td>
                    <td className="p-1 pr-2 text-cyber-blue-light font-bold">role</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-cyber-black/30 border border-cyber-border rounded-xl p-4 space-y-2 flex flex-col justify-between">
            <div>
              <span className="text-cyber-blue font-bold text-[9px] uppercase tracking-wider block mb-1">3. Visible Output Positions</span>
              <p className="text-cyber-dim text-[11px] leading-relaxed">
                Only columns rendered by the application frontend are useful for displaying the extracted data.
              </p>
            </div>
            <div className="bg-cyber-blue/5 border border-cyber-blue/20 rounded p-2 text-[10px] text-cyber-blue-light leading-relaxed">
              💡 Attackers often use NULL values while testing because NULL is compatible with many database data types.
            </div>
          </div>
        </div>
      </div>

      {/* 8. Column-count discovery (Step 2) */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2 border-b border-cyber-border/40 pb-3">
          <div className="w-5 h-5 rounded-full bg-cyber-dim/20 border border-cyber-border flex items-center justify-center text-cyber-dim text-[10px] font-bold font-mono">2</div>
          <h3 className="font-sans font-bold text-sm text-cyber-dim tracking-wider uppercase">
            Step 2 — Discover the number of columns
          </h3>
        </div>

        <p className="text-sm text-cyber-text leading-relaxed text-justify">
          The attacker may increase the number of NULL values in a series of test payloads until the injected query matches the original SELECT column count and does not trigger database syntax errors:
        </p>

        <div className="space-y-2 font-mono text-xs">
          <div className="bg-cyber-black/30 border border-cyber-border rounded-lg p-2.5 flex items-center justify-between">
            <code>' UNION SELECT NULL --</code>
            <span className="text-cyber-red font-bold text-[10px]">❌ ERROR: Column count mismatch</span>
          </div>
          <div className="bg-cyber-black/30 border border-cyber-border rounded-lg p-2.5 flex items-center justify-between">
            <code>' UNION SELECT NULL, NULL --</code>
            <span className="text-cyber-red font-bold text-[10px]">❌ ERROR: Column count mismatch</span>
          </div>
          <div className="bg-cyber-black/30 border border-cyber-border rounded-lg p-2.5 flex items-center justify-between border-cyber-green/50">
            <code>' UNION SELECT NULL, NULL, NULL, NULL, NULL --</code>
            <span className="text-cyber-green font-bold text-[10px] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> 5 COLUMNS DISCOVERED
            </span>
          </div>
        </div>
      </div>

      {/* 9. Show malicious UNION payload (Step 3) */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2 border-b border-cyber-border/40 pb-3">
          <div className="w-5 h-5 rounded-full bg-cyber-red/10 border border-cyber-red/30 flex items-center justify-center text-cyber-red text-[10px] font-bold font-mono">3</div>
          <h3 className="font-sans font-bold text-sm text-cyber-red tracking-wider uppercase">
            Step 3 — Injected UNION request
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div className="space-y-1.5">
            <span className="text-cyber-dim font-bold uppercase tracking-wider block">Target URL</span>
            <div className="bg-cyber-input border border-cyber-border rounded-lg p-2.5 text-cyber-red truncate select-all font-bold">
              http://127.0.0.1:2000/api/vulnerable/search
            </div>
          </div>
          <div className="space-y-1.5">
            <span className="text-cyber-dim font-bold uppercase tracking-wider block">Injected Search Parameter</span>
            <div className="bg-cyber-input border border-cyber-border rounded-lg p-2.5 text-cyber-red font-bold select-all">
              ' UNION SELECT id, username, 0, 0, role FROM users --
            </div>
          </div>
        </div>

        <div className="space-y-1.5 font-mono text-xs">
          <span className="text-cyber-dim font-bold uppercase tracking-wider block">Combined SQL Query</span>
          <CodeBox 
            lang="SQL" 
            code={`SELECT id, name, price, stock, description
FROM products
WHERE name LIKE '%'

UNION

SELECT id, username, 0, 0, role
FROM users

-- %';`} 
          />
          <span className="text-[10px] text-cyber-dim block font-sans italic pl-1 mt-1">
            * The exact quote and comment placement depends on the vulnerable application’s original SQL syntax. The goal is to terminate the original string, append a compatible SELECT, and comment out the remaining characters.
          </span>
        </div>

        {/* 10. Break down the payload */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-bold font-mono text-cyber-dim block uppercase tracking-wider">
            Payload Breakdown Structure
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 font-mono text-xs">
            <div className="bg-cyber-black/40 border border-cyber-border rounded-lg p-3 relative overflow-hidden space-y-1">
              <span className="absolute top-0 left-0 bottom-0 w-[3px] bg-cyber-blue" />
              <span className="text-cyber-blue font-bold text-[9px] uppercase block">Part 1</span>
              <code className="text-cyber-title font-bold bg-cyber-input px-1.5 py-0.5 rounded font-mono">'</code>
              <p className="text-[10px] text-cyber-dim leading-relaxed">
                Closes original search string literal.
              </p>
            </div>
            <div className="bg-cyber-black/40 border border-cyber-border rounded-lg p-3 relative overflow-hidden space-y-1">
              <span className="absolute top-0 left-0 bottom-0 w-[3px] bg-cyber-blue" />
              <span className="text-cyber-blue font-bold text-[9px] uppercase block">Part 2</span>
              <code className="text-cyber-title font-bold bg-cyber-input px-1.5 py-0.5 rounded font-mono">UNION SELECT</code>
              <p className="text-[10px] text-cyber-dim leading-relaxed">
                Appends the second statement query.
              </p>
            </div>
            <div className="bg-cyber-black/40 border border-cyber-border rounded-lg p-3 relative overflow-hidden space-y-1">
              <span className="absolute top-0 left-0 bottom-0 w-[3px] bg-cyber-red" />
              <span className="text-cyber-red font-bold text-[9px] uppercase block">Part 3</span>
              <code className="text-cyber-red font-bold bg-cyber-input px-1.5 py-0.5 rounded font-mono">id, username, 0, 0, role</code>
              <p className="text-[10px] text-cyber-dim leading-relaxed">
                Matches original query's 5 columns.
              </p>
            </div>
            <div className="bg-cyber-black/40 border border-cyber-border rounded-lg p-3 relative overflow-hidden space-y-1">
              <span className="absolute top-0 left-0 bottom-0 w-[3px] bg-cyber-red" />
              <span className="text-cyber-red font-bold text-[9px] uppercase block">Part 4</span>
              <code className="text-cyber-red font-bold bg-cyber-input px-1.5 py-0.5 rounded font-mono">FROM users</code>
              <p className="text-[10px] text-cyber-dim leading-relaxed">
                Queries unauthorized credentials table.
              </p>
            </div>
            <div className="bg-cyber-black/40 border border-cyber-border rounded-lg p-3 relative overflow-hidden space-y-1">
              <span className="absolute top-0 left-0 bottom-0 w-[3px] bg-[#ffbd2e]" />
              <span className="text-[#ffbd2e] font-bold text-[9px] uppercase block">Part 5</span>
              <code className="text-[#ffbd2e] font-bold bg-cyber-input px-1.5 py-0.5 rounded font-mono">--</code>
              <p className="text-[10px] text-cyber-dim leading-relaxed">
                Comments out trailing wildcard quotes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 11. Explain column mapping */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2.5 border-b border-cyber-border/40 pb-3">
          <Files className="w-4.5 h-4.5 text-cyber-blue" />
          <h3 className="font-sans font-bold text-sm text-cyber-title tracking-wider uppercase">
            How are the injected columns mapped?
          </h3>
        </div>

        <p className="text-sm text-cyber-text leading-relaxed text-justify">
          The database combines rows based on column position, not on the semantic meaning of the column names. Here is how columns align:
        </p>

        <div className="overflow-x-auto border border-cyber-border rounded-lg bg-cyber-input">
          <table className="w-full border-collapse text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-cyber-border bg-cyber-card text-cyber-dim">
                <th className="p-3 font-bold pl-4">Original product field</th>
                <th className="p-3 font-bold text-cyber-red">Injected users value</th>
                <th className="p-3 font-bold pr-4">Reason / Layout Placement</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                <td className="p-3 pl-4 font-bold text-cyber-title">id</td>
                <td className="p-3 text-cyber-red font-bold">id</td>
                <td className="p-3 pr-4 text-cyber-dim">Integer-compatible index</td>
              </tr>
              <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                <td className="p-3 pl-4 font-bold text-cyber-title">name</td>
                <td className="p-3 text-cyber-red font-bold">username</td>
                <td className="p-3 pr-4 text-cyber-dim">Displayed as product title field</td>
              </tr>
              <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                <td className="p-3 pl-4 font-bold text-cyber-title">price</td>
                <td className="p-3 text-cyber-red font-bold">0</td>
                <td className="p-3 pr-4 text-cyber-dim">Numeric price placeholder</td>
              </tr>
              <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                <td className="p-3 pl-4 font-bold text-cyber-title">stock</td>
                <td className="p-3 text-cyber-red font-bold">0</td>
                <td className="p-3 pr-4 text-cyber-dim">Integer inventory placeholder</td>
              </tr>
              <tr className="hover:bg-cyber-blue/5">
                <td className="p-3 pl-4 font-bold text-cyber-title">description</td>
                <td className="p-3 text-cyber-red font-bold">role</td>
                <td className="p-3 pr-4 text-cyber-dim">Displayed in product description container</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-cyber-dim italic pl-1">
          * The application still believes it is displaying product rows. However, some returned rows now contain data from the users table.
        </p>
      </div>

      {/* 12. Show the unauthorized result */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2.5 border-b border-cyber-border/40 pb-3">
          <Terminal className="w-4.5 h-4.5 text-cyber-red" />
          <h3 className="font-sans font-bold text-sm text-cyber-title tracking-wider uppercase">
            Combined application output
          </h3>
        </div>

        <p className="text-sm text-cyber-text leading-relaxed text-justify">
          The frontend renders the injected user records as if they were product records because the application trusts the database result set structure without verifying its origin:
        </p>

        {/* Combined Table */}
        <div className="overflow-x-auto border border-cyber-red/35 rounded-lg bg-cyber-input p-1">
          <table className="w-full border-collapse text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-cyber-border bg-cyber-card text-cyber-dim">
                <th className="p-3 font-bold pl-4">id</th>
                <th className="p-3 font-bold">name</th>
                <th className="p-3 font-bold">price</th>
                <th className="p-3 font-bold">stock</th>
                <th className="p-3 font-bold pr-4">description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                <td className="p-3 pl-4 text-cyber-dim">1</td>
                <td className="p-3 text-cyber-title font-semibold">Gaming Laptop</td>
                <td className="p-3">1299.00</td>
                <td className="p-3">8</td>
                <td className="p-3 pr-4 text-cyber-text">High-performance laptop</td>
              </tr>
              <tr className="border-b border-cyber-red/20 bg-cyber-red/5 hover:bg-cyber-red/10 text-cyber-red">
                <td className="p-3 pl-4 font-bold">1</td>
                <td className="p-3 font-extrabold flex items-center gap-1.5">
                  <span>admin</span>
                  <span className="text-[7px] border border-cyber-red/30 bg-cyber-red/10 px-1.5 py-0.25 rounded font-bold uppercase tracking-wider">INJECTED DATABASE RECORD</span>
                </td>
                <td className="p-3">0</td>
                <td className="p-3">0</td>
                <td className="p-3 pr-4 font-semibold">administrator</td>
              </tr>
              <tr className="bg-cyber-red/5 hover:bg-cyber-red/10 text-cyber-red">
                <td className="p-3 pl-4 font-bold">2</td>
                <td className="p-3 font-extrabold flex items-center gap-1.5">
                  <span>alice</span>
                  <span className="text-[7px] border border-cyber-red/30 bg-cyber-red/10 px-1.5 py-0.25 rounded font-bold uppercase tracking-wider">INJECTED DATABASE RECORD</span>
                </td>
                <td className="p-3">0</td>
                <td className="p-3">0</td>
                <td className="p-3 pr-4 font-semibold">customer</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 13. Explain why the attack works */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2.5 border-b border-cyber-border/40 pb-3">
          <Combine className="w-4.5 h-4.5 text-cyber-blue" />
          <h3 className="font-sans font-bold text-sm text-cyber-title tracking-wider uppercase">
            Why does the UNION attack work?
          </h3>
        </div>

        <p className="text-sm text-cyber-text leading-relaxed text-justify">
          The vulnerable application allows user input to change the structure of the SQL statement. After the original string is closed, UNION adds a second SELECT statement. Because the injected query returns the same number of compatible columns, the database combines both result sets and sends them back to the application.
        </p>

        {/* Simplified Flow representation */}
        <div className="max-w-md mx-auto py-3 font-mono text-xs text-center space-y-2">
          <div className="bg-cyber-card/80 border border-cyber-border p-2.5 rounded-lg">
            Original product query
          </div>
          <div className="text-cyber-dim font-bold">+</div>
          <div className="bg-cyber-red/5 border border-cyber-red/25 p-2.5 rounded-lg text-cyber-red font-bold">
            Injected users query
          </div>
          <div className="text-cyber-dim font-bold">↓</div>
          <div className="bg-cyber-black/40 border border-cyber-border p-2.5 rounded-lg">
            Combined database result
          </div>
          <div className="text-cyber-dim font-bold">↓</div>
          <div className="bg-cyber-red/5 border border-cyber-red/30 text-cyber-red p-2.5 rounded-lg font-bold">
            Application displays unauthorized rows
          </div>
        </div>
      </div>

      {/* 14. Section: Database table-name enumeration */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2.5 border-b border-cyber-border/40 pb-3">
          <Database className="w-4.5 h-4.5 text-[#ffbd2e]" />
          <h3 className="font-sans font-bold text-sm text-cyber-title tracking-wider uppercase">
            Using UNION to Discover Database Table Names
          </h3>
        </div>

        <p className="text-sm text-cyber-text leading-relaxed text-justify">
          Before extracting records from an unknown database, an attacker may attempt to identify available table names through database metadata schemas such as <code className="bg-cyber-input px-1.5 py-0.5 rounded font-mono text-cyber-title">information_schema.tables</code>.
        </p>

        <p className="text-sm text-cyber-text leading-relaxed text-justify">
          Many database systems expose schema metadata through system views. These views contain information about databases, tables, and columns.
        </p>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono text-cyber-dim uppercase tracking-wider block">PostgreSQL Metadata Discovery Payload</span>
            <span className="text-[9px] font-mono font-bold text-cyber-red border border-cyber-red/30 bg-cyber-red/5 px-2 py-0.5 rounded uppercase">
              DATABASE STRUCTURE EXPOSED
            </span>
          </div>
          <CodeBox 
            lang="SQL" 
            code={`' UNION SELECT
ROW_NUMBER() OVER (),
table_name,
0,
0,
'Database table discovered through information_schema'
FROM information_schema.tables
WHERE table_schema = current_schema()
--`} 
          />
        </div>

        {/* Breakdown metadata elements */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono pt-2">
          <div className="bg-cyber-black/30 border border-cyber-border rounded-lg p-2.5">
            <span className="text-cyber-blue font-bold block mb-1">table_name</span>
            <span className="text-cyber-dim">Returns the name of each database table catalog row.</span>
          </div>
          <div className="bg-cyber-black/30 border border-cyber-border rounded-lg p-2.5">
            <span className="text-cyber-blue font-bold block mb-1">information_schema.tables</span>
            <span className="text-cyber-dim">Provides metadata about tables visible to the current database user.</span>
          </div>
          <div className="bg-cyber-black/30 border border-cyber-border rounded-lg p-2.5">
            <span className="text-cyber-blue font-bold block mb-1">ROW_NUMBER() OVER ()</span>
            <span className="text-cyber-dim">Generates a numeric sequence value for the product search ID index.</span>
          </div>
          <div className="bg-cyber-black/30 border border-cyber-border rounded-lg p-2.5">
            <span className="text-cyber-blue font-bold block mb-1">Numeric Placeholders (0, 0)</span>
            <span className="text-cyber-dim">Keep numeric output columns compatible with original price and stock fields.</span>
          </div>
          <div className="bg-cyber-black/30 border border-cyber-border rounded-lg p-2.5 md:col-span-2">
            <span className="text-cyber-blue font-bold block mb-1">Descriptive Text</span>
            <span className="text-cyber-dim">Places an informative text summary block directly inside the visible description column.</span>
          </div>
        </div>

        {/* 15. Show example table-name enumeration output */}
        <div className="space-y-2 pt-3 border-t border-cyber-border/30">
          <span className="text-[10px] font-bold font-mono text-cyber-dim block uppercase tracking-wider">
            Discovered Tables Metadata Result Set (Illustrative Example)
          </span>
          <div className="overflow-x-auto border border-cyber-border rounded-lg bg-cyber-input">
            <table className="w-full border-collapse text-left text-[11px] font-mono">
              <thead>
                <tr className="border-b border-cyber-border bg-cyber-card text-cyber-dim">
                  <th className="p-2.5 pl-3">id</th>
                  <th className="p-2.5 text-cyber-blue">discovered table</th>
                  <th className="p-2.5">field 3</th>
                  <th className="p-2.5">field 4</th>
                  <th className="p-2.5 pr-3">description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                  <td className="p-2.5 pl-3">1</td>
                  <td className="p-2.5 text-cyber-title font-bold">products</td>
                  <td className="p-2.5">0</td>
                  <td className="p-2.5">0</td>
                  <td className="p-2.5 pr-3 text-cyber-dim">Database table discovered through information_schema</td>
                </tr>
                <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                  <td className="p-2.5 pl-3">2</td>
                  <td className="p-2.5 text-cyber-title font-bold">users</td>
                  <td className="p-2.5">0</td>
                  <td className="p-2.5">0</td>
                  <td className="p-2.5 pr-3 text-cyber-dim">Database table discovered through information_schema</td>
                </tr>
                <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                  <td className="p-2.5 pl-3">3</td>
                  <td className="p-2.5 text-cyber-title font-bold">orders</td>
                  <td className="p-2.5">0</td>
                  <td className="p-2.5">0</td>
                  <td className="p-2.5 pr-3 text-cyber-dim">Database table discovered through information_schema</td>
                </tr>
                <tr className="hover:bg-cyber-blue/5">
                  <td className="p-2.5 pl-3">4</td>
                  <td className="p-2.5 text-cyber-title font-bold">order_items</td>
                  <td className="p-2.5">0</td>
                  <td className="p-2.5">0</td>
                  <td className="p-2.5 pr-3 text-cyber-dim">Database table discovered through information_schema</td>
                </tr>
              </tbody>
            </table>
          </div>
          <span className="text-[10px] text-cyber-dim block font-sans italic mt-1 pl-1">
            * Once table names are known, an attacker may try to discover column names and then extract records from those tables.
          </span>
        </div>
      </div>

      {/* 16. Security impact section */}
      <div className="bg-cyber-card border border-cyber-red/40 rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2.5 border-b border-cyber-border/40 pb-3">
          <ShieldAlert className="w-4.5 h-4.5 text-cyber-red animate-pulse" />
          <h3 className="font-sans font-bold text-sm text-cyber-red tracking-wider uppercase">
            Security Impact
          </h3>
        </div>
        
        <p className="text-sm text-cyber-text leading-relaxed text-justify">
          A successful UNION-based SQL Injection can expose data from tables that are unrelated to the original application feature.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs pt-1">
          <div className="flex items-start gap-2.5 bg-cyber-red/5 border border-cyber-red/20 rounded-lg p-3">
            <Database className="w-4 h-4 text-cyber-red shrink-0" />
            <div>
              <span className="text-cyber-title font-bold uppercase block mb-0.5">Database schema leaks</span>
              <span className="text-cyber-dim">Database table-name and column-name disclosure mapping query scopes.</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5 bg-cyber-red/5 border border-cyber-red/20 rounded-lg p-3">
            <Eye className="w-4 h-4 text-cyber-red shrink-0" />
            <div>
              <span className="text-cyber-title font-bold uppercase block mb-0.5">Credential disclosure</span>
              <span className="text-cyber-dim">Extraction of account usernames, emails, and hashed password credentials.</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5 bg-cyber-red/5 border border-cyber-red/20 rounded-lg p-3">
            <Files className="w-4 h-4 text-cyber-red shrink-0" />
            <div>
              <span className="text-cyber-title font-bold uppercase block mb-0.5">Sensitive registers dump</span>
              <span className="text-cyber-dim">Exposure of order transactions, client records, and admin logs.</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5 bg-cyber-red/5 border border-cyber-red/20 rounded-lg p-3">
            <AlertTriangle className="w-4 h-4 text-cyber-red shrink-0" />
            <div>
              <span className="text-cyber-title font-bold uppercase block mb-0.5">Later exploit mapping</span>
              <span className="text-cyber-dim">Detailed blueprints of the database engine catalog used to trigger deeper attacks.</span>
            </div>
          </div>
        </div>
      </div>

      {/* 17. Section: How to secure the application */}
      <div className="bg-cyber-card border border-cyber-green/40 rounded-xl p-6 relative overflow-hidden space-y-4 w-full shadow-lg">
        <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-green animate-pulse" />
        <div className="flex items-center gap-2.5 border-b border-cyber-border/40 pb-3">
          <ShieldCheck className="w-4.5 h-4.5 text-cyber-green" />
          <h3 className="font-sans font-bold text-sm text-cyber-green tracking-wider uppercase">
            How to Prevent UNION-Based SQL Injection
          </h3>
        </div>

        <p className="text-sm text-cyber-text leading-relaxed text-justify">
          The primary defense against UNION SQL Injection is using <strong>parameterized queries</strong> (prepared statements).
        </p>

        {/* Secure code snippet */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono text-cyber-dim block uppercase tracking-wider">
              Secure Python Product Search
            </span>
            <span className="text-[9px] font-mono font-bold text-cyber-green border border-cyber-green/30 bg-cyber-green/5 px-2 py-0.5 rounded uppercase">
              PARAMETERIZED SEARCH QUERY
            </span>
          </div>

          <CodeBox 
            lang="Python" 
            code={`search = request.args.get("q")

query = """
    SELECT id, name, price, stock, description
    FROM products
    WHERE name LIKE ?
"""

results = db.execute(query, (f"%{search}%",))`} 
          />

          <p className="text-xs text-cyber-text leading-relaxed text-justify mt-2 pl-1">
            The SQL query structure is fixed before the user-supplied search value is processed. The search value is passed separately and treated only as data. Even if the input contains UNION, SELECT, quotes, or SQL comments, those characters cannot become executable SQL syntax.
          </p>
        </div>

        {/* 18. Show why parameterization blocks UNION injection */}
        <div className="space-y-2 pt-4 border-t border-cyber-border/30">
          <span className="text-xs font-bold font-mono text-cyber-dim block uppercase tracking-wider">
            Why Parameterization Prevents Structural Appends
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-cyber-red/5 border border-cyber-red/20 rounded-lg p-3">
              <span className="text-cyber-red font-bold text-[9px] uppercase tracking-wider block mb-1">Vulnerable concatenation flow</span>
              <p className="text-cyber-dim leading-relaxed">
                SQL command + raw search input<br />
                → Attacker input changes query structure<br />
                → Second SELECT is executed directly by the DB
              </p>
            </div>
            <div className="bg-cyber-green/5 border border-cyber-green/20 rounded-lg p-3">
              <span className="text-cyber-green font-bold text-[9px] uppercase tracking-wider block mb-1">Secure parameterized flow</span>
              <p className="text-cyber-title font-semibold leading-relaxed">
                Fixed SQL statement + bound search value<br />
                → Input remains a literal string value<br />
                → UNION SELECT is searched as text, not executed
              </p>
            </div>
          </div>

          <div className="bg-cyber-black/40 border border-cyber-border rounded-lg p-3 text-center space-y-1 mt-2">
            <span className="text-[10px] text-cyber-dim font-mono block uppercase">Submitted Payload:</span>
            <code className="text-cyber-red font-mono text-[11px] block select-all bg-cyber-black/60 p-1.5 rounded">' UNION SELECT id, username, 0, 0, role FROM users --</code>
            <span className="text-[10px] text-cyber-green font-mono block font-bold mt-2">
              🛡️ Database interpretation: Searches for products whose name contains the literal submitted text. The SQL parser never treats the payload as part of the command structure.
            </span>
          </div>
        </div>

        {/* 19. Vulnerable vs secure comparison table */}
        <div className="space-y-2 pt-4 border-t border-cyber-border/30">
          <span className="text-xs font-bold font-mono text-cyber-dim block uppercase tracking-wider">
            Approach Comparison Table
          </span>
          <div className="overflow-x-auto border border-cyber-border rounded-lg bg-cyber-input">
            <table className="w-full border-collapse text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-cyber-border bg-cyber-card text-cyber-dim">
                  <th className="p-3 font-bold pl-4 text-cyber-red">Vulnerable approach</th>
                  <th className="p-3 font-bold pr-4 text-cyber-green">Secure approach</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                  <td className="p-3 pl-4 text-cyber-text">Dynamic SQL string concatenation</td>
                  <td className="p-3 pr-4 text-cyber-text">Parameterized bound query variables</td>
                </tr>
                <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                  <td className="p-3 pl-4 text-cyber-text">Input can append nested SELECT statements</td>
                  <td className="p-3 pr-4 text-cyber-text">Input remains a literal data value</td>
                </tr>
                <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                  <td className="p-3 pl-4 text-cyber-text">Column count may be probed and abused</td>
                  <td className="p-3 pr-4 text-cyber-text">Query structure cannot be altered or extended</td>
                </tr>
                <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                  <td className="p-3 pl-4 text-cyber-text">Internal schemas and tables may be exposed</td>
                  <td className="p-3 pr-4 text-cyber-text">Only the developer-intended table is queried</td>
                </tr>
                <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                  <td className="p-3 pl-4 text-cyber-text">Detailed database error trace aids discovery</td>
                  <td className="p-3 pr-4 text-cyber-text">Database errors are handled and hidden securely</td>
                </tr>
                <tr className="hover:bg-cyber-blue/5">
                  <td className="p-3 pl-4 text-cyber-text">Broad database execution user scope</td>
                  <td className="p-3 pr-4 text-cyber-text">Least-privilege database user permissions</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 20. Additional defensive measures */}
      <div className="space-y-4">
        <span className="text-xs font-bold font-mono text-cyber-dim block uppercase tracking-wider">
          Additional Defense-In-Depth Measures
        </span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 space-y-2 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-blue" />
              <span className="font-bold text-cyber-title uppercase block mb-1">1. Apply least privilege</span>
              <p className="text-cyber-dim leading-relaxed">
                The database account should only have access to the tables and CRUD operations required for normal operation.
              </p>
            </div>
          </div>

          <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 space-y-2 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-blue" />
              <span className="font-bold text-cyber-title uppercase block mb-1">2. Avoid SELECT *</span>
              <p className="text-cyber-dim leading-relaxed">
                Select only the specific columns needed. This reduces accidental data exposure and keeps results explicitly structured.
              </p>
            </div>
          </div>

          <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 space-y-2 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-blue" />
              <span className="font-bold text-cyber-title uppercase block mb-1">3. Hide detailed errors</span>
              <p className="text-cyber-dim leading-relaxed">
                Do not expose raw SQL syntax errors, schema views, table records, or database types to production users.
              </p>
            </div>
          </div>

          <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 space-y-2 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-blue" />
              <span className="font-bold text-cyber-title uppercase block mb-1">4. Validate expected input</span>
              <p className="text-cyber-dim leading-relaxed">
                Apply length limits and allow-list input validation where the business logic supports a restricted format.
              </p>
            </div>
          </div>

          <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 space-y-2 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-blue" />
              <span className="font-bold text-cyber-title uppercase block mb-1">5. Monitor suspicious input</span>
              <p className="text-cyber-dim leading-relaxed">
                Log query attempts featuring SQL keywords (UNION, SELECT), comment flags, quote breakouts, and abnormal failures.
              </p>
            </div>
          </div>

          <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 space-y-2 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-blue" />
              <span className="font-bold text-cyber-title uppercase block mb-1">6. Perform security testing</span>
              <p className="text-cyber-dim leading-relaxed">
                Use code review, static analysis (SAST), and authorized penetration testing to find concatenated queries.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-cyber-blue/5 border border-cyber-blue/20 rounded-lg p-3 font-mono text-[11px] text-cyber-blue-light text-center">
          💡 <strong>Note:</strong> Input validation and keyword filtering are additional controls, but they do not replace parameterized queries.
        </div>
      </div>

      {/* 21. Explain why blocking the word UNION is insufficient */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-3 w-full font-mono">
        <div className="flex items-center gap-2 border-b border-cyber-border/40 pb-3">
          <ShieldAlert className="w-4.5 h-4.5 text-[#ffbd2e]" />
          <h3 className="font-sans font-bold text-sm text-cyber-title tracking-wider uppercase">
            Why not simply block UNION or SELECT?
          </h3>
        </div>
        <p className="text-xs text-cyber-dim leading-relaxed text-justify">
          Keyword blacklists are unreliable because attackers may use alternative capitalization, whitespace, comments, encoding, database-specific syntax, or different query structures. The correct defense is to make it impossible for user input to become executable SQL code.
        </p>
        <div className="bg-cyber-black/40 border border-cyber-border rounded p-3 text-[11px] text-cyber-title text-center font-bold">
          Do not attempt to recognize every malicious query. Separate SQL instructions from user-controlled values.
        </div>
      </div>

      {/* 22. Final learning summary */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full font-mono">
        <div className="flex items-center gap-2 border-b border-cyber-border/40 pb-3">
          <ShieldCheck className="w-4.5 h-4.5 text-cyber-blue" />
          <h3 className="font-sans font-bold text-sm text-cyber-title tracking-wider uppercase">
            Key Takeaways
          </h3>
        </div>

        <ul className="list-disc list-inside space-y-2 text-xs text-cyber-dim leading-relaxed">
          <li>
            <strong className="text-cyber-title">Structural appends:</strong> UNION-Based SQL Injection appends a second SELECT statement to a vulnerable query.
          </li>
          <li>
            <strong className="text-cyber-title">Compatibility rules:</strong> Both SELECT statements must return the same number of compatible columns.
          </li>
          <li>
            <strong className="text-cyber-title">Position-based mapping:</strong> Injected values are mapped by column position, not by column name.
          </li>
          <li>
            <strong className="text-cyber-title">Trust errors:</strong> The application may display unauthorized database rows as normal results.
          </li>
          <li>
            <strong className="text-cyber-title">Schema exploration:</strong> Database metadata can reveal table names and help map the database structure.
          </li>
          <li>
            <strong className="text-cyber-title">Parser protection:</strong> Parameterized queries prevent user input from changing the SQL command.
          </li>
          <li>
            <strong className="text-cyber-title">Layered security:</strong> Least privilege, secure error handling, validation, monitoring, and security testing provide additional protection.
          </li>
        </ul>
      </div>

      {/* 23. Simulator call-to-action */}
      <div className="bg-cyber-card border border-cyber-border/70 rounded-2xl p-8 text-center space-y-5 shadow-2xl relative overflow-hidden w-full">
        <span className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyber-blue to-transparent" />
        <h3 className="font-sans font-extrabold text-lg text-cyber-title tracking-wider uppercase">
          Test UNION Injection in the Local Lab
        </h3>
        <p className="text-sm text-cyber-text text-justify leading-relaxed max-w-2xl mx-auto font-sans">
          Use the UNION Attack simulator to observe how a second SELECT statement can be combined with the original product search query and how database table names can be exposed through information_schema.
        </p>
        <div className="pt-2">
          <Link
            to="/attacks/union-attack"
            className="inline-flex items-center gap-2 bg-cyber-blue hover:bg-cyber-blue-light text-white px-8 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_20px_rgba(26,106,255,0.3)] hover:shadow-[0_0_30px_rgba(26,106,255,0.5)] transform hover:-translate-y-0.5"
          >
            <Terminal className="w-4 h-4" />
            Launch UNION Attack Simulator
          </Link>
        </div>
      </div>

    </div>
  );
}
