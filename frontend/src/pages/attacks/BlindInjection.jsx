import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, EyeOff, Database, Search, ShieldAlert, CheckCircle2, XCircle, AlertTriangle, Check, ShieldCheck, Clock, Terminal } from 'lucide-react';

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
    const pyKeywords = ['if', 'not', 'in', 'return', 'def', 'import', 'from', 'for', 'class', 'else', 'try', 'except'];
    pyKeywords.forEach(kw => {
      const regex = new RegExp(`\\b(${kw})\\b`, 'g');
      escaped = escaped.replace(regex, '<span class="text-cyber-blue font-bold">$1</span>');
    });

    // 4. Highlight variables
    const vars = ['product_id', 'query', 'product', 'db', 'user', 'username', 'password'];
    vars.forEach(v => {
      const regex = new RegExp(`\\b(${v})\\b`, 'g');
      escaped = escaped.replace(regex, '<span class="text-code-variable font-semibold">$1</span>');
    });

    // 5. Highlight functions, methods, builtins
    escaped = escaped.replace(/\b(request\.args\.get|db\.execute|\.fetchone|int)\b/g, '<span class="text-code-function font-semibold">$1</span>');

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
      'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'UNION', 'LIMIT', 'SUBSTRING', 'LENGTH', 'ASCII', 'TRUE', 'FALSE', 'IF', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END'
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

export default function BlindInjection() {
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
          Blind <span className="text-cyber-blue">SQL Injection</span>
        </h1>
        <p className="text-cyber-text text-sm text-justify w-full leading-relaxed font-medium">
          Learn how attackers can infer hidden database information by observing differences in application responses instead of seeing query results directly.
        </p>
        <div className="pt-1">
          <span className="inline-flex items-center text-[9px] font-mono font-bold tracking-wider text-cyber-blue border border-cyber-blue/30 bg-cyber-blue/5 px-2.5 py-0.5 rounded uppercase">
            INFERENCE-BASED SQL INJECTION
          </span>
        </div>
      </div>

      {/* 2. Section: What is Blind SQL Injection? */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2.5 border-b border-cyber-border/40 pb-3">
          <EyeOff className="w-4.5 h-4.5 text-cyber-blue" />
          <h3 className="font-sans font-bold text-sm text-cyber-title tracking-wider uppercase">
            What is Blind SQL Injection?
          </h3>
        </div>
        <div className="space-y-3 text-sm text-cyber-text leading-relaxed text-justify">
          <p>
            Blind SQL Injection occurs when an application is vulnerable to SQL Injection but does not display database records or detailed SQL errors directly to the user.
          </p>
          <p>
            Instead of reading extracted data in the response, an attacker sends carefully designed true-or-false conditions and observes how the application behaves. Differences in page content, status codes, response length, or response time may reveal whether each condition was true.
          </p>
          <p className="text-xs text-cyber-dim font-sans italic border-l-2 border-cyber-blue/50 pl-3 mt-2">
            <strong>Note:</strong> The attack is called blind because the database answer is not displayed directly. The attacker must infer the answer from indirect application behavior.
          </p>
        </div>

        {/* Info Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-cyber-border/30 text-xs font-mono">
          <div className="bg-cyber-black/30 border border-cyber-border/50 rounded-lg p-2.5">
            <span className="text-cyber-dim font-bold block uppercase text-[9px] tracking-wider mb-0.5">Cause</span>
            <span className="text-cyber-title font-bold">User input changes the SQL query structure</span>
          </div>
          <div className="bg-cyber-black/30 border border-cyber-border/50 rounded-lg p-2.5">
            <span className="text-cyber-dim font-bold block uppercase text-[9px] tracking-wider mb-0.5">Attacker Goal</span>
            <span className="text-cyber-red font-bold">Infer hidden data one condition at a time</span>
          </div>
          <div className="bg-cyber-black/30 border border-cyber-border/50 rounded-lg p-2.5">
            <span className="text-cyber-dim font-bold block uppercase text-[9px] tracking-wider mb-0.5">Possible Impact</span>
            <span className="text-cyber-red font-bold">Database structure enumeration and sensitive data leakage</span>
          </div>
        </div>
      </div>

      {/* 3. Section: Blind versus visible SQL Injection */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2.5 border-b border-cyber-border/40 pb-3">
          <Search className="w-4.5 h-4.5 text-cyber-blue" />
          <h3 className="font-sans font-bold text-sm text-cyber-title tracking-wider uppercase">
            How is Blind SQL Injection different?
          </h3>
        </div>

        <div className="overflow-x-auto border border-cyber-border rounded-lg bg-cyber-input">
          <table className="w-full border-collapse text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-cyber-border bg-cyber-card text-cyber-dim">
                <th className="p-3 font-bold pl-4">Visible SQL Injection</th>
                <th className="p-3 font-bold pr-4">Blind SQL Injection</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                <td className="p-3 pl-4 text-cyber-text">Database data may appear directly in the response</td>
                <td className="p-3 pr-4 text-cyber-text">Database data is not shown directly</td>
              </tr>
              <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                <td className="p-3 pl-4 text-cyber-text">SQL errors may reveal technical details</td>
                <td className="p-3 pr-4 text-cyber-text">Errors may be hidden or generic</td>
              </tr>
              <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                <td className="p-3 pl-4 text-cyber-text">Results can sometimes be extracted in one request</td>
                <td className="p-3 pr-4 text-cyber-text">Information is inferred through repeated questions</td>
              </tr>
              <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                <td className="p-3 pl-4 text-cyber-text">UNION output columns may be directly visible</td>
                <td className="p-3 pr-4 text-cyber-text">Boolean or timing differences are observed</td>
              </tr>
              <tr className="hover:bg-cyber-blue/5">
                <td className="p-3 pl-4 text-cyber-text">Easier to confirm visually</td>
                <td className="p-3 pr-4 text-cyber-text">Often slower and more difficult to detect</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-cyber-dim font-sans italic pl-1">
          * <strong>Key Concept:</strong> The vulnerability is still SQL Injection. Only the method used to retrieve information is different.
        </p>
      </div>

      {/* 4. Section: Vulnerable product lookup scenario */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2.5 border-b border-cyber-border/40 pb-3">
          <ShieldAlert className="w-4.5 h-4.5 text-cyber-red animate-pulse" />
          <h3 className="font-sans font-bold text-sm text-cyber-title tracking-wider uppercase">
            Vulnerable Golimar Store Product Lookup
          </h3>
        </div>

        <p className="text-sm text-cyber-text leading-relaxed text-justify">
          Imagine that the Golimar Store application receives a product ID and directly places it inside an SQL query.
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
                    <th className="p-2">category</th>
                    <th className="p-2 pr-3">price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                    <td className="p-2 pl-3 text-cyber-dim">1</td>
                    <td className="p-2 text-cyber-title font-semibold">Gaming Laptop</td>
                    <td className="p-2 text-cyber-dim">electronics</td>
                    <td className="p-2 pr-3">1299.00</td>
                  </tr>
                  <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                    <td className="p-2 pl-3 text-cyber-dim">2</td>
                    <td className="p-2 text-cyber-title font-semibold">Wireless Headphones</td>
                    <td className="p-2 text-cyber-dim">electronics</td>
                    <td className="p-2 pr-3">299.00</td>
                  </tr>
                  <tr className="hover:bg-cyber-blue/5">
                    <td className="p-2 pl-3 text-cyber-dim">3</td>
                    <td className="p-2 text-cyber-title font-semibold">Office Chair</td>
                    <td className="p-2 text-cyber-dim">furniture</td>
                    <td className="p-2 pr-3">249.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-bold font-mono text-cyber-dim block uppercase tracking-wider flex items-center justify-between">
              <span>Table 2: <code className="text-cyber-title bg-cyber-input px-1.5 py-0.5 rounded font-mono">users</code></span>
              <span className="text-[8px] border border-cyber-red/40 bg-cyber-red/10 px-1.5 rounded text-cyber-red font-bold">NOT DISPLAYED BY THE PRODUCT PAGE</span>
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

        <p className="text-xs text-cyber-dim leading-relaxed text-justify mt-2">
          The product endpoint should only return product information. However, unsafe SQL construction may allow questions to be asked about unrelated database tables.
        </p>

        {/* 5. Show the vulnerable backend code */}
        <div className="space-y-2 pt-4 border-t border-cyber-border/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono text-cyber-dim uppercase tracking-wider">
              Vulnerable Python product lookup
            </span>
            <span className="text-[9px] font-mono font-bold text-cyber-red border border-cyber-red/30 bg-cyber-red/5 px-2 py-0.5 rounded uppercase">
              UNSAFE NUMERIC INPUT
            </span>
          </div>

          <CodeBox 
            lang="Python" 
            code={`product_id = request.args.get("id")

query = (
    "SELECT id, name, category, price "
    "FROM products "
    "WHERE id = " + product_id
)

product = db.execute(query).fetchone()`} 
          />

          <p className="text-xs text-cyber-text leading-relaxed text-justify mt-2 pl-1">
            The product ID is concatenated directly into the SQL query. An attacker can add another SQL condition and change the result of the WHERE clause.
          </p>

          <div className="bg-cyber-red/5 border border-cyber-red/20 rounded-lg p-2.5 font-mono text-xs text-cyber-red/90 mt-2 text-center">
            <span className="font-extrabold uppercase text-[10px] tracking-wider block mb-1">Unsafe Parameter Injection Point:</span>
            <code className="bg-cyber-black/40 px-2 py-1 rounded inline-block select-all font-mono font-bold">
              "WHERE id = " + product_id
            </code>
            <span className="text-[10px] text-cyber-red block mt-2 font-bold">
              ⚠️ Numeric parameters are also vulnerable when concatenated. SQL Injection is not limited to quoted text fields.
            </span>
          </div>
        </div>
      </div>

      {/* 6. Show normal application behavior (Step 1) */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2 border-b border-cyber-border/40 pb-3">
          <div className="w-5 h-5 rounded-full bg-cyber-green/10 border border-cyber-green/30 flex items-center justify-center text-cyber-green text-[10px] font-bold font-mono">1</div>
          <h3 className="font-sans font-bold text-sm text-cyber-green tracking-wider uppercase">
            Step 1 — Normal product request
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="space-y-1.5">
            <span className="text-cyber-dim font-bold uppercase tracking-wider block">Target URL</span>
            <div className="bg-cyber-input border border-cyber-border rounded-lg p-2.5 text-cyber-text truncate select-all">
              http://127.0.0.1:2000/api/vulnerable/product?id=1
            </div>
          </div>
          <div className="space-y-1.5">
            <span className="text-cyber-dim font-bold uppercase tracking-wider block">Product ID Input</span>
            <div className="bg-cyber-input border border-cyber-border rounded-lg p-2.5 text-cyber-title font-bold">
              1
            </div>
          </div>
          <div className="space-y-1.5">
            <span className="text-cyber-dim font-bold uppercase tracking-wider block">Application Response</span>
            <div className="bg-cyber-input border border-cyber-border rounded-lg p-2.5 text-cyber-green font-bold truncate">
              Product found: Gaming Laptop
            </div>
          </div>
        </div>

        <div className="space-y-1.5 font-mono text-xs">
          <span className="text-cyber-dim font-bold uppercase tracking-wider block">Generated SQL Query</span>
          <CodeBox 
            lang="SQL" 
            code={`SELECT id, name, category, price
FROM products
WHERE id = 1;`} 
          />
        </div>

        <div className="bg-cyber-green/5 border border-cyber-green/20 rounded-lg p-3 text-xs font-mono leading-relaxed">
          <p className="text-cyber-green font-medium">
            <strong>Result:</strong> The database returns the product whose ID is 1. This is the intended behavior.
          </p>
        </div>
      </div>

      {/* 7. Introduce Boolean-Based Blind SQL Injection */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2.5 border-b border-cyber-border/40 pb-3">
          <Database className="w-4.5 h-4.5 text-cyber-blue" />
          <h3 className="font-sans font-bold text-sm text-cyber-title tracking-wider uppercase">
            Boolean-Based Blind SQL Injection
          </h3>
        </div>
        <div className="space-y-3 text-sm text-cyber-text leading-relaxed text-justify">
          <p>
            In Boolean-based Blind SQL Injection, the attacker injects a condition that evaluates to either true or false.
          </p>
          <p>
            The application does not show the result of the injected SELECT statement. Instead, the attacker compares the application response produced by a true condition with the response produced by a false condition.
          </p>
        </div>

        {/* Process Flow */}
        <div className="max-w-md mx-auto py-2 font-mono text-xs text-center space-y-2">
          <div className="bg-cyber-card/85 border border-cyber-border p-2 rounded-lg">
            Injected condition
          </div>
          <div className="text-cyber-dim font-bold">↓</div>
          <div className="bg-cyber-blue/10 border border-cyber-blue/20 p-2 rounded-lg">
            Database evaluates <span className="text-cyber-green font-bold">TRUE</span> or <span className="text-cyber-red font-bold">FALSE</span>
          </div>
          <div className="text-cyber-dim font-bold">↓</div>
          <div className="bg-cyber-card/85 border border-cyber-border p-2 rounded-lg">
            Application response changes
          </div>
          <div className="text-cyber-dim font-bold">↓</div>
          <div className="bg-cyber-green/10 border border-cyber-green/20 p-2 rounded-lg text-cyber-green font-bold">
            Attacker infers one answer
          </div>
        </div>
      </div>

      {/* 8. Show a true condition (Step 2) */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2 border-b border-cyber-border/40 pb-3">
          <div className="w-5 h-5 rounded-full bg-cyber-green/10 border border-cyber-green/30 flex items-center justify-center text-cyber-green text-[10px] font-bold font-mono">2</div>
          <h3 className="font-sans font-bold text-sm text-cyber-green tracking-wider uppercase">
            Step 2 — Test a condition that is true
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div className="space-y-1.5">
            <span className="text-cyber-dim font-bold uppercase tracking-wider block">Injected Payload</span>
            <div className="bg-cyber-input border border-cyber-border rounded-lg p-2.5 text-cyber-green font-bold select-all">
              1 AND 1=1
            </div>
          </div>
          <div className="space-y-1.5">
            <span className="text-cyber-dim font-bold uppercase tracking-wider block">Observed Response</span>
            <div className="bg-cyber-input border border-cyber-border rounded-lg p-2.5 text-cyber-green font-bold truncate">
              Product found: Gaming Laptop
            </div>
          </div>
        </div>

        <div className="space-y-1.5 font-mono text-xs">
          <span className="text-cyber-dim font-bold uppercase tracking-wider block">Generated SQL Query</span>
          <CodeBox 
            lang="SQL" 
            code={`SELECT id, name, category, price
FROM products
WHERE id = 1 AND 1=1;`} 
          />
        </div>

        <div className="bg-cyber-green/5 border border-cyber-green/20 rounded-lg p-4 text-xs font-mono leading-relaxed space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-cyber-green font-medium">
              <strong>Result:</strong> The condition 1=1 is always true. Therefore, the original product record is still returned.
            </p>
            <span className="text-[9px] font-mono font-bold text-cyber-green border border-cyber-green/30 bg-cyber-green/5 px-2 py-0.5 rounded uppercase shrink-0">
              TRUE RESPONSE
            </span>
          </div>

          <div className="bg-cyber-black/30 border border-cyber-green/30 rounded-lg p-2.5 max-w-xs text-center space-y-0.5">
            <div>id = 1 AND <span className="text-cyber-green font-bold">TRUE</span></div>
            <div>TRUE AND <span className="text-cyber-green font-bold">TRUE</span> = <span className="text-cyber-green font-bold">TRUE</span></div>
          </div>
        </div>
      </div>

      {/* 9. Show a false condition (Step 3) */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2 border-b border-cyber-border/40 pb-3">
          <div className="w-5 h-5 rounded-full bg-cyber-red/10 border border-cyber-red/30 flex items-center justify-center text-cyber-red text-[10px] font-bold font-mono">3</div>
          <h3 className="font-sans font-bold text-sm text-cyber-red tracking-wider uppercase">
            Step 3 — Test a condition that is false
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div className="space-y-1.5">
            <span className="text-cyber-dim font-bold uppercase tracking-wider block">Injected Payload</span>
            <div className="bg-cyber-input border border-cyber-border rounded-lg p-2.5 text-cyber-red font-bold select-all">
              1 AND 1=2
            </div>
          </div>
          <div className="space-y-1.5">
            <span className="text-cyber-dim font-bold uppercase tracking-wider block">Observed Response</span>
            <div className="bg-cyber-input border border-cyber-border rounded-lg p-2.5 text-cyber-red font-bold truncate">
              Product not found
            </div>
          </div>
        </div>

        <div className="space-y-1.5 font-mono text-xs">
          <span className="text-cyber-dim font-bold uppercase tracking-wider block">Generated SQL Query</span>
          <CodeBox 
            lang="SQL" 
            code={`SELECT id, name, category, price
FROM products
WHERE id = 1 AND 1=2;`} 
          />
        </div>

        <div className="bg-cyber-red/5 border border-cyber-red/20 rounded-lg p-4 text-xs font-mono leading-relaxed space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-cyber-red font-medium">
              <strong>Result:</strong> The condition 1=2 is false. The complete WHERE clause becomes false, so no product record is returned.
            </p>
            <span className="text-[9px] font-mono font-bold text-cyber-red border border-cyber-red/30 bg-cyber-red/5 px-2 py-0.5 rounded uppercase shrink-0">
              FALSE RESPONSE
            </span>
          </div>

          <div className="bg-cyber-black/30 border border-cyber-red/30 rounded-lg p-2.5 max-w-xs text-center space-y-0.5">
            <div>id = 1 AND <span className="text-cyber-red font-bold">FALSE</span></div>
            <div>TRUE AND <span className="text-cyber-red font-bold">FALSE</span> = <span className="text-cyber-red font-bold">FALSE</span></div>
          </div>
        </div>
      </div>

      {/* 10. Compare the true and false responses */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2.5 border-b border-cyber-border/40 pb-3">
          <Terminal className="w-4.5 h-4.5 text-cyber-blue" />
          <h3 className="font-sans font-bold text-sm text-cyber-title tracking-wider uppercase">
            The application becomes a one-bit information channel
          </h3>
        </div>

        <div className="overflow-x-auto border border-cyber-border rounded-lg bg-cyber-input">
          <table className="w-full border-collapse text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-cyber-border bg-cyber-card text-cyber-dim">
                <th className="p-3 font-bold pl-4">Injected condition</th>
                <th className="p-3 font-bold">Database result</th>
                <th className="p-3 font-bold">Application behavior</th>
                <th className="p-3 font-bold pr-4 text-cyber-blue-light">Inferred answer</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                <td className="p-3 pl-4 text-cyber-text">`1 AND 1=1`</td>
                <td className="p-3 text-cyber-green font-bold">Row returned</td>
                <td className="p-3 text-cyber-green">Product found</td>
                <td className="p-3 pr-4 text-cyber-green font-extrabold">TRUE</td>
              </tr>
              <tr className="hover:bg-cyber-blue/5">
                <td className="p-3 pl-4 text-cyber-text">`1 AND 1=2`</td>
                <td className="p-3 text-cyber-red font-bold">No row returned</td>
                <td className="p-3 text-cyber-red">Product not found</td>
                <td className="p-3 pr-4 text-cyber-red font-extrabold">FALSE</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-cyber-text leading-relaxed text-justify font-bold mt-2">
          Each request reveals only a true-or-false answer. However, many true-or-false answers can gradually reveal database information. One request may reveal one bit of information. Repeated requests can reconstruct longer values such as usernames, table names, or password hashes.
        </p>
      </div>

      {/* 11. Show a realistic data-inference question */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2.5 border-b border-cyber-border/40 pb-3">
          <Search className="w-4.5 h-4.5 text-[#ffbd2e]" />
          <h3 className="font-sans font-bold text-sm text-cyber-title tracking-wider uppercase">
            Asking the database a hidden question
          </h3>
        </div>

        <p className="text-sm text-cyber-text leading-relaxed text-justify">
          The injected condition does not display the administrator username. It asks whether the first character of that username is the letter a.
        </p>

        <div className="space-y-1.5 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-cyber-dim font-bold uppercase tracking-wider block">Inference Test Query</span>
            <span className="text-[9px] font-mono font-bold text-cyber-red border border-cyber-red/30 bg-cyber-red/5 px-2 py-0.5 rounded uppercase">
              HIDDEN DATA INFERRED INDIRECTLY
            </span>
          </div>
          <CodeBox 
            lang="SQL" 
            code={`SELECT id, name, category, price
FROM products
WHERE id = 1
AND SUBSTRING(
    (SELECT username
     FROM users
     WHERE role = 'administrator'
     LIMIT 1),
    1,
    1
) = 'a';`} 
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div className="bg-cyber-green/5 border border-cyber-green/20 rounded-lg p-3 text-center">
            <span className="text-cyber-green font-bold block uppercase mb-1">Product found</span>
            <span className="text-cyber-dim">→ the condition was true</span>
          </div>
          <div className="bg-cyber-red/5 border border-cyber-red/20 rounded-lg p-3 text-center">
            <span className="text-cyber-red font-bold block uppercase mb-1">Product not found</span>
            <span className="text-cyber-dim">→ the condition was false</span>
          </div>
        </div>

        {/* 12. Break down the inference payload */}
        <div className="space-y-2 pt-2 border-t border-cyber-border/30">
          <span className="text-xs font-bold font-mono text-cyber-dim block uppercase tracking-wider">
            Inference Payload Breakdown
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 font-mono text-xs">
            <div className="bg-cyber-black/40 border border-cyber-border rounded-lg p-3 relative overflow-hidden space-y-1">
              <span className="absolute top-0 left-0 bottom-0 w-[3px] bg-cyber-blue" />
              <span className="text-cyber-blue font-bold text-[9px] uppercase block">Part 1</span>
              <code className="text-cyber-title font-bold bg-cyber-input px-1.5 py-0.5 rounded font-mono">1 AND</code>
              <p className="text-[10px] text-cyber-dim leading-relaxed">
                Keeps original lookup and appends next test.
              </p>
            </div>
            <div className="bg-cyber-black/40 border border-cyber-border rounded-lg p-3 relative overflow-hidden space-y-1">
              <span className="absolute top-0 left-0 bottom-0 w-[3px] bg-cyber-blue" />
              <span className="text-cyber-blue font-bold text-[9px] uppercase block">Part 2</span>
              <code className="text-cyber-title font-bold bg-cyber-input px-1.5 py-0.5 rounded font-mono">SELECT username...</code>
              <p className="text-[10px] text-cyber-dim leading-relaxed">
                Reads database table target field value.
              </p>
            </div>
            <div className="bg-cyber-black/40 border border-cyber-border rounded-lg p-3 relative overflow-hidden space-y-1">
              <span className="absolute top-0 left-0 bottom-0 w-[3px] bg-cyber-red" />
              <span className="text-cyber-red font-bold text-[9px] uppercase block">Part 3</span>
              <code className="text-cyber-red font-bold bg-cyber-input px-1.5 py-0.5 rounded font-mono">role = 'administrator'</code>
              <p className="text-[10px] text-cyber-dim leading-relaxed">
                Filters target privileged user rows.
              </p>
            </div>
            <div className="bg-cyber-black/40 border border-cyber-border rounded-lg p-3 relative overflow-hidden space-y-1">
              <span className="absolute top-0 left-0 bottom-0 w-[3px] bg-cyber-red" />
              <span className="text-cyber-red font-bold text-[9px] uppercase block">Part 4</span>
              <code className="text-cyber-red font-bold bg-cyber-input px-1.5 py-0.5 rounded font-mono">SUBSTRING(..., 1, 1)</code>
              <p className="text-[10px] text-cyber-dim leading-relaxed">
                Extracts character 1 (length 1) of the string.
              </p>
            </div>
            <div className="bg-cyber-black/40 border border-cyber-border rounded-lg p-3 relative overflow-hidden space-y-1">
              <span className="absolute top-0 left-0 bottom-0 w-[3px] bg-[#ffbd2e]" />
              <span className="text-[#ffbd2e] font-bold text-[9px] uppercase block">Part 5</span>
              <code className="text-[#ffbd2e] font-bold bg-cyber-input px-1.5 py-0.5 rounded font-mono">= 'a'</code>
              <p className="text-[10px] text-cyber-dim leading-relaxed">
                Converts test byte to boolean condition.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 13. Show how characters may be discovered */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2.5 border-b border-cyber-border/40 pb-3">
          <EyeOff className="w-4.5 h-4.5 text-cyber-blue" />
          <h3 className="font-sans font-bold text-sm text-cyber-title tracking-wider uppercase">
            Inferring a value one character at a time
          </h3>
        </div>

        <p className="text-sm text-cyber-text leading-relaxed text-justify">
          The application never displays the value "admin" directly. The value is reconstructed from multiple Boolean responses.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Character discovery steps */}
          <div className="bg-cyber-black/30 border border-cyber-border rounded-xl p-4 font-mono text-xs leading-relaxed space-y-1">
            <span className="text-[10px] font-bold text-cyber-dim uppercase block mb-1">Boolean Sequence:</span>
            <div>Is character 1 equal to "a"? <span className="text-cyber-green font-bold">→ TRUE</span></div>
            <div>Is character 2 equal to "d"? <span className="text-cyber-green font-bold">→ TRUE</span></div>
            <div>Is character 3 equal to "m"? <span className="text-cyber-green font-bold">→ TRUE</span></div>
            <div>Is character 4 equal to "i"? <span className="text-cyber-green font-bold">→ TRUE</span></div>
            <div>Is character 5 equal to "n"? <span className="text-cyber-green font-bold">→ TRUE</span></div>
          </div>

          <div className="bg-cyber-black/30 border border-cyber-border rounded-xl p-4 font-mono text-xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-cyber-dim uppercase block mb-1">Reconstructed Value:</span>
              <span className="text-cyber-title font-extrabold text-2xl select-all">admin</span>
            </div>
            <span className="text-[10px] text-cyber-dim italic block mt-2 font-sans border-t border-cyber-border/30 pt-2">
              * Real extraction can require many requests, especially when characters are tested individually.
            </span>
          </div>
        </div>

        {/* 14. Explain length discovery */}
        <div className="space-y-2 pt-4 border-t border-cyber-border/30">
          <span className="text-xs font-bold font-mono text-cyber-dim block uppercase tracking-wider">
            Discovering the Length First
          </span>
          <p className="text-sm text-cyber-text leading-relaxed text-justify">
            Before extracting characters, an attacker may first ask questions about the length of a hidden value:
          </p>
          <CodeBox 
            lang="SQL" 
            code={`LENGTH(
    (SELECT username FROM users
     WHERE role = 'administrator'
     LIMIT 1)
) = 5`} 
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono pt-1">
            <div className="bg-cyber-green/5 border border-cyber-green/20 rounded p-2.5">
              <span className="text-cyber-green font-bold block mb-0.5">TRUE response</span>
              <span className="text-cyber-dim">→ username length is 5</span>
            </div>
            <div className="bg-cyber-red/5 border border-cyber-red/20 rounded p-2.5">
              <span className="text-cyber-red font-bold block mb-0.5">FALSE response</span>
              <span className="text-cyber-dim">→ try another length value</span>
            </div>
          </div>
        </div>

        {/* 15. Introduce binary-search inference */}
        <div className="space-y-2 pt-4 border-t border-cyber-border/30">
          <span className="text-xs font-bold font-mono text-cyber-dim block uppercase tracking-wider">
            Reducing Requests with Comparison Questions (Binary Search)
          </span>
          <p className="text-sm text-cyber-text leading-relaxed text-justify">
            Instead of testing every possible character one by one, an attacker may compare a character’s numeric value with a threshold:
          </p>
          <CodeBox 
            lang="SQL" 
            code={`ASCII(SUBSTRING(hidden_value, 1, 1)) > 77`} 
          />
          <p className="text-xs text-cyber-dim leading-relaxed text-justify">
            A true-or-false comparison can divide the possible character range into smaller groups. Repeating this process works like binary search and can reduce the number of requests.
          </p>
        </div>
      </div>

      {/* 16. Section: Time-Based Blind SQL Injection */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2.5 border-b border-cyber-border/40 pb-3">
          <Clock className="w-4.5 h-4.5 text-[#ffbd2e]" />
          <h3 className="font-sans font-bold text-sm text-cyber-title tracking-wider uppercase">
            Time-Based Blind SQL Injection
          </h3>
        </div>

        <div className="space-y-3 text-sm text-cyber-text leading-relaxed text-justify">
          <p>
            Sometimes the application returns exactly the same visible content for both true and false conditions. In that case, an attacker may attempt to make the database delay its response only when a condition is true.
          </p>
        </div>

        <div className="space-y-1.5 font-mono text-xs">
          <span className="text-cyber-dim font-bold uppercase tracking-wider block">Conceptual Delayed Payload</span>
          <CodeBox 
            lang="SQL" 
            code={`IF(condition_is_true, delay_response, continue_normally)`} 
          />
          <span className="text-[10px] text-cyber-dim block font-sans italic mt-1">
            * The exact delay function depends on the database engine. Different systems use different functions and syntax.
          </span>
        </div>

        {/* 17. Show time-based response comparison */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-bold font-mono text-cyber-dim block uppercase tracking-wider">
            Time-based Response Comparison
          </span>
          
          <div className="overflow-x-auto border border-cyber-border rounded-lg bg-cyber-input">
            <table className="w-full border-collapse text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-cyber-border bg-cyber-card text-cyber-dim">
                  <th className="p-3 font-bold pl-4">Condition</th>
                  <th className="p-3 font-bold">Database behavior</th>
                  <th className="p-3 font-bold pr-4">Observed response</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                  <td className="p-3 pl-4 text-cyber-green font-bold">True condition</td>
                  <td className="p-3 text-cyber-green">Adds an intentional delay</td>
                  <td className="p-3 pr-4 text-cyber-green font-semibold">Response takes ~5 seconds</td>
                </tr>
                <tr className="hover:bg-cyber-blue/5">
                  <td className="p-3 pl-4 text-cyber-dim">False condition</td>
                  <td className="p-3 text-cyber-dim">No intentional delay</td>
                  <td className="p-3 pr-4 text-cyber-dim">Response returns immediately</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="max-w-xs mx-auto py-2 font-mono text-xs text-center space-y-1 bg-cyber-black/30 border border-cyber-border rounded-lg p-2.5">
            <div>Condition is <span className="text-cyber-green font-bold">TRUE</span></div>
            <div>↓</div>
            <div>Database delays response</div>
            <div>↓</div>
            <div>Long response time observed (~5s)</div>
            <div>↓</div>
            <div className="text-cyber-green font-bold">Attacker infers TRUE</div>
          </div>

          <span className="text-[10px] text-cyber-dim block font-sans italic pl-1">
            ⚠️ Network latency and server load can also affect response time. Multiple measurements may be needed before drawing a conclusion.
          </span>
        </div>
      </div>

      {/* 18. Boolean-based versus time-based comparison */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2.5 border-b border-cyber-border/40 pb-3">
          <Terminal className="w-4.5 h-4.5 text-cyber-blue" />
          <h3 className="font-sans font-bold text-sm text-cyber-title tracking-wider uppercase">
            Inference Method Comparison
          </h3>
        </div>

        <div className="overflow-x-auto border border-cyber-border rounded-lg bg-cyber-input">
          <table className="w-full border-collapse text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-cyber-border bg-cyber-card text-cyber-dim">
                <th className="p-3 font-bold pl-4 text-cyber-title">Boolean-Based Blind Injection</th>
                <th className="p-3 font-bold pr-4 text-[#ffbd2e]">Time-Based Blind Injection</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                <td className="p-3 pl-4 text-cyber-text">Observes visible response differences</td>
                <td className="p-3 pr-4 text-cyber-text">Observes response-time differences</td>
              </tr>
              <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                <td className="p-3 pl-4 text-cyber-text">May compare page text or status codes</td>
                <td className="p-3 pr-4 text-cyber-text">May compare delayed and normal responses</td>
              </tr>
              <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                <td className="p-3 pl-4 text-cyber-text">Usually faster and more reliable</td>
                <td className="p-3 pr-4 text-cyber-text">Often slower and affected by network noise</td>
              </tr>
              <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                <td className="p-3 pl-4 text-cyber-text">Requires different true and false output</td>
                <td className="p-3 pr-4 text-cyber-text">Can work when visible output is identical</td>
              </tr>
              <tr className="hover:bg-cyber-blue/5">
                <td className="p-3 pl-4 text-cyber-text">Easier to demonstrate visually</td>
                <td className="p-3 pr-4 text-cyber-text">Useful when no visible response difference exists</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 19. Explain potential targets */}
      <div className="space-y-4">
        <span className="text-xs font-bold font-mono text-cyber-dim block uppercase tracking-wider">
          What information could be inferred?
        </span>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-blue" />
              <span className="font-bold text-cyber-title uppercase block mb-1">Database metadata</span>
              <p className="text-cyber-dim leading-relaxed text-[11px]">
                Database names, schema names, table names, and column names.
              </p>
            </div>
          </div>
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-blue" />
              <span className="font-bold text-cyber-title uppercase block mb-1">User accounts</span>
              <p className="text-cyber-dim leading-relaxed text-[11px]">
                Usernames, roles, account status flags, and identifiers.
              </p>
            </div>
          </div>
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-blue" />
              <span className="font-bold text-cyber-title uppercase block mb-1">Authentication data</span>
              <p className="text-cyber-dim leading-relaxed text-[11px]">
                Password hashes or password-reset tokens when the DB account has access.
              </p>
            </div>
          </div>
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-blue" />
              <span className="font-bold text-cyber-title uppercase block mb-1">Business data</span>
              <p className="text-cyber-dim leading-relaxed text-[11px]">
                Products, orders, customer profiles, or configuration variables.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-cyber-blue/5 border border-cyber-blue/20 rounded-lg p-3 font-mono text-[11px] text-cyber-blue-light text-center">
          💡 The amount of accessible information depends on the permissions of the application’s database account.
        </div>
      </div>

      {/* 20. Security impact section */}
      <div className="bg-cyber-card border border-cyber-red/40 rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2.5 border-b border-cyber-border/40 pb-3">
          <ShieldAlert className="w-4.5 h-4.5 text-cyber-red animate-pulse" />
          <h3 className="font-sans font-bold text-sm text-cyber-red tracking-wider uppercase">
            Security Impact
          </h3>
        </div>
        
        <p className="text-sm text-cyber-text leading-relaxed text-justify">
          Blind SQL Injection may appear less serious because data is not immediately displayed. However, a patient attacker can use repeated true-or-false questions to map the database and reconstruct sensitive information.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs pt-1">
          <div className="flex items-start gap-2.5 bg-cyber-red/5 border border-cyber-red/20 rounded-lg p-3">
            <EyeOff className="w-4 h-4 text-cyber-red shrink-0" />
            <div>
              <span className="text-cyber-title font-bold uppercase block mb-0.5">Slow data extraction</span>
              <span className="text-cyber-dim">Silent and structured extraction of databases one bit at a time.</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5 bg-cyber-red/5 border border-cyber-red/20 rounded-lg p-3">
            <Database className="w-4 h-4 text-cyber-red shrink-0" />
            <div>
              <span className="text-cyber-title font-bold uppercase block mb-0.5">Account leaks</span>
              <span className="text-cyber-dim">Reconstruction of credentials and administrative records.</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5 bg-cyber-red/5 border border-cyber-red/20 rounded-lg p-3">
            <Clock className="w-4 h-4 text-cyber-red shrink-0" />
            <div>
              <span className="text-cyber-title font-bold uppercase block mb-0.5">High server load</span>
              <span className="text-cyber-dim">Repeated query requests can saturate database computing assets.</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5 bg-cyber-red/5 border border-cyber-red/20 rounded-lg p-3">
            <AlertTriangle className="w-4 h-4 text-cyber-red shrink-0" />
            <div>
              <span className="text-cyber-title font-bold uppercase block mb-0.5">Metadata leaks</span>
              <span className="text-cyber-dim">Detailed schema maps revealing stored structures for later exploits.</span>
            </div>
          </div>
        </div>
      </div>

      {/* 21. Section: How to secure the application */}
      <div className="bg-cyber-card border border-cyber-green/40 rounded-xl p-6 relative overflow-hidden space-y-4 w-full shadow-lg">
        <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-green animate-pulse" />
        <div className="flex items-center gap-2.5 border-b border-cyber-border/40 pb-3">
          <ShieldCheck className="w-4.5 h-4.5 text-cyber-green" />
          <h3 className="font-sans font-bold text-sm text-cyber-green tracking-wider uppercase">
            How to Prevent Blind SQL Injection
          </h3>
        </div>

        <p className="text-sm text-cyber-text leading-relaxed text-justify">
          The primary defense against Blind SQL Injection is using <strong>parameterized queries</strong>.
        </p>

        {/* Secure Code Snippet */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono text-cyber-dim block uppercase tracking-wider">
              1. Parameterized Product Lookup Query
            </span>
            <span className="text-[9px] font-mono font-bold text-cyber-green border border-cyber-green/30 bg-cyber-green/5 px-2 py-0.5 rounded uppercase">
              PARAMETERIZED PRODUCT LOOKUP
            </span>
          </div>

          <CodeBox 
            lang="Python" 
            code={`product_id = request.args.get("id")

query = """
    SELECT id, name, category, price
    FROM products
    WHERE id = ?
"""

product = db.execute(query, (product_id,)).fetchone()`} 
          />

          <p className="text-xs text-cyber-text leading-relaxed text-justify mt-2 pl-1">
            The SQL statement and the submitted product ID are sent separately. The database treats the submitted value strictly as data instead of executable SQL syntax. An input such as `1 AND 1=1` is interpreted as a value rather than an additional SQL condition.
          </p>
        </div>

        {/* 22. Validate numeric identifiers */}
        <div className="space-y-2 pt-4 border-t border-cyber-border/30">
          <span className="text-xs font-bold font-mono text-cyber-dim block uppercase tracking-wider">
            2. Strict Type Validation and Casting
          </span>

          <CodeBox 
            lang="Python" 
            code={`try:
    product_id = int(request.args.get("id"))
except (TypeError, ValueError):
    return {"error": "Invalid product ID"}, 400`} 
          />

          <p className="text-xs text-cyber-text leading-relaxed text-justify mt-2 pl-1">
            When an input is expected to be an integer, the application should convert and validate it before using it. Type validation is an additional security control. Parameterized queries are still required.
          </p>
        </div>

        {/* 23. Show vulnerable versus secure behavior */}
        <div className="space-y-2 pt-4 border-t border-cyber-border/30">
          <span className="text-xs font-bold font-mono text-cyber-dim block uppercase tracking-wider">
            Vulnerable vs Secure Query Flow Comparisons
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-cyber-red/5 border border-cyber-red/20 rounded-lg p-3">
              <span className="text-cyber-red font-bold text-[9px] uppercase tracking-wider block mb-1">Vulnerable concatenation flow</span>
              <p className="text-cyber-dim leading-relaxed">
                SQL command + raw product ID<br />
                → input changes the WHERE clause<br />
                → true-or-false database subqueries are executed
              </p>
            </div>
            <div className="bg-cyber-green/5 border border-cyber-green/20 rounded-lg p-3">
              <span className="text-cyber-green font-bold text-[9px] uppercase tracking-wider block mb-1">Secure parameterized flow</span>
              <p className="text-cyber-title font-semibold leading-relaxed">
                Fixed SQL command + bound product ID<br />
                → input remains a literal value<br />
                → injected SQL operators are not executed
              </p>
            </div>
          </div>
        </div>

        {/* 24. Vulnerable versus secure comparison table */}
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
                  <td className="p-3 pl-4 text-cyber-text">Raw input concatenated into SQL query string</td>
                  <td className="p-3 pr-4 text-cyber-text">Bound query parameter variables</td>
                </tr>
                <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                  <td className="p-3 pl-4 text-cyber-text">Numeric parameters assumed to be safe from injection</td>
                  <td className="p-3 pr-4 text-cyber-text">Numeric inputs parsed, casted, and validated</td>
                </tr>
                <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                  <td className="p-3 pl-4 text-cyber-text">Input can add Boolean subquery clauses</td>
                  <td className="p-3 pr-4 text-cyber-text">Input cannot modify query syntax structures</td>
                </tr>
                <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                  <td className="p-3 pl-4 text-cyber-text">Response differences reveal hidden query answers</td>
                  <td className="p-3 pr-4 text-cyber-text">Only the developer-intended lookup is executed</td>
                </tr>
                <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                  <td className="p-3 pl-4 text-cyber-text">Detailed error traces reveal internal namespaces</td>
                  <td className="p-3 pr-4 text-cyber-text">Generic messages and error boundaries are returned</td>
                </tr>
                <tr className="hover:bg-cyber-blue/5">
                  <td className="p-3 pl-4 text-cyber-text">Broad database user profile scope access</td>
                  <td className="p-3 pr-4 text-cyber-text">Least-privilege execution permissions</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 25. Additional defensive measures */}
      <div className="space-y-4">
        <span className="text-xs font-bold font-mono text-cyber-dim block uppercase tracking-wider">
          Additional Defense-In-Depth Measures
        </span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 space-y-2 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-blue" />
              <span className="font-bold text-cyber-title uppercase block mb-1">1. Parameterize queries everywhere</span>
              <p className="text-cyber-dim leading-relaxed">
                Apply parameters to string, numeric, date, search, filter, sort, and authentication inputs.
              </p>
            </div>
          </div>

          <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 space-y-2 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-blue" />
              <span className="font-bold text-cyber-title uppercase block mb-1">2. Strict type validation</span>
              <p className="text-cyber-dim leading-relaxed">
                Convert expected numeric values to integers and reject malformed inputs immediately.
              </p>
            </div>
          </div>

          <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 space-y-2 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-blue" />
              <span className="font-bold text-cyber-title uppercase block mb-1">3. Least-privilege access</span>
              <p className="text-cyber-dim leading-relaxed">
                Limit the application account to the minimum database tables and operations required.
              </p>
            </div>
          </div>

          <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 space-y-2 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-blue" />
              <span className="font-bold text-cyber-title uppercase block mb-1">4. Return consistent errors</span>
              <p className="text-cyber-dim leading-relaxed">
                Do not expose SQL errors, table names, query fragments, or database engine details.
              </p>
            </div>
          </div>

          <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 space-y-2 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-blue" />
              <span className="font-bold text-cyber-title uppercase block mb-1">5. Monitor query patterns</span>
              <p className="text-cyber-dim leading-relaxed">
                Detect repeated similar requests, high-frequency parameter checks, and abnormal expressions.
              </p>
            </div>
          </div>

          <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 space-y-2 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-blue" />
              <span className="font-bold text-cyber-title uppercase block mb-1">6. Add rate limiting</span>
              <p className="text-cyber-dim leading-relaxed">
                Limit repeated requests to sensitive DB-driven endpoints to reduce automated inference.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-cyber-blue/5 border border-cyber-blue/20 rounded-lg p-3 font-mono text-[11px] text-cyber-blue-light text-center">
          💡 Rate limiting and monitoring make inference attacks harder to automate, but they do not repair the SQL Injection vulnerability.
        </div>
      </div>

      {/* 26. Explain why hiding errors is insufficient */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-2 w-full font-mono">
          <div className="flex items-center gap-2 border-b border-cyber-border/40 pb-3">
            <ShieldAlert className="w-4.5 h-4.5 text-[#ffbd2e]" />
            <h3 className="font-sans font-bold text-sm text-cyber-title tracking-wider uppercase">
              Does hiding SQL errors prevent Blind SQL Injection?
            </h3>
          </div>
          <p className="text-xs text-cyber-dim leading-relaxed text-justify">
            No. Hiding database errors is good security practice, but it does not prevent user input from changing the SQL query. Blind SQL Injection specifically demonstrates that an attacker may extract information even when no SQL error or database result is displayed.
          </p>
          <div className="bg-cyber-black/40 border border-cyber-border rounded p-2 text-[10px] text-cyber-title text-center font-bold">
            The application must fix the unsafe query construction, not only hide the error message.
          </div>
        </div>

        {/* 27. Explain why identical responses help */}
        <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-2 w-full font-mono">
          <div className="flex items-center gap-2 border-b border-cyber-border/40 pb-3">
            <ShieldCheck className="w-4.5 h-4.5 text-cyber-green" />
            <h3 className="font-sans font-bold text-sm text-cyber-title tracking-wider uppercase">
              Use consistent application responses
            </h3>
          </div>
          <p className="text-xs text-cyber-dim leading-relaxed text-justify">
            Authentication, lookup, and error responses should avoid unnecessary differences that reveal internal database state. Consistent messages can reduce information leakage, but they are a secondary defense. Parameterized queries remain the primary solution.
          </p>
        </div>
      </div>

      {/* 28. Final learning summary */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full font-mono">
        <div className="flex items-center gap-2 border-b border-cyber-border/40 pb-3">
          <ShieldCheck className="w-4.5 h-4.5 text-cyber-blue" />
          <h3 className="font-sans font-bold text-sm text-cyber-title tracking-wider uppercase">
            Key Takeaways
          </h3>
        </div>

        <ul className="list-disc list-inside space-y-2 text-xs text-cyber-dim leading-relaxed">
          <li>
            <strong className="text-cyber-title">Hidden outputs:</strong> Blind SQL Injection occurs when injected database results are not displayed directly.
          </li>
          <li>
            <strong className="text-cyber-title">Inference logic:</strong> Attackers infer answers by comparing true and false application behavior.
          </li>
          <li>
            <strong className="text-cyber-title">Boolean checks:</strong> Boolean-based attacks observe content, status, or response differences.
          </li>
          <li>
            <strong className="text-cyber-title">Delay checks:</strong> Time-based attacks infer answers from intentional response delays.
          </li>
          <li>
            <strong className="text-cyber-title">Character reconstruction:</strong> Repeated true-or-false questions can reconstruct hidden database values.
          </li>
          <li>
            <strong className="text-cyber-title">Numeric boundaries:</strong> Numeric parameters can be vulnerable when concatenated into SQL.
          </li>
          <li>
            <strong className="text-cyber-title">Command template:</strong> Parameterized queries prevent user input from changing SQL logic.
          </li>
          <li>
            <strong className="text-cyber-title">Layered controls:</strong> Type validation, least privilege, consistent errors, monitoring, and rate limiting provide additional protection.
          </li>
        </ul>
      </div>

      {/* 29. Simulator call-to-action */}
      <div className="bg-cyber-card border border-cyber-border/70 rounded-2xl p-8 text-center space-y-5 shadow-2xl relative overflow-hidden w-full">
        <span className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyber-blue to-transparent" />
        <h3 className="font-sans font-extrabold text-lg text-cyber-title tracking-wider uppercase">
          Test Blind SQL Injection in the Local Lab
        </h3>
        <p className="text-sm text-cyber-text text-justify leading-relaxed max-w-2xl mx-auto font-sans">
          Use the Blind Injection simulator to compare true and false database conditions and observe how application behavior can reveal information without displaying the hidden data directly.
        </p>
        <div className="pt-2">
          <Link
            to="/attacks/blind-injection"
            className="inline-flex items-center gap-2 bg-cyber-blue hover:bg-cyber-blue-light text-white px-8 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_20px_rgba(26,106,255,0.3)] hover:shadow-[0_0_30px_rgba(26,106,255,0.5)] transform hover:-translate-y-0.5"
          >
            <Terminal className="w-4 h-4" />
            Launch Blind Injection Simulator
          </Link>
        </div>
      </div>

    </div>
  );
}
