import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Database, Terminal, ShieldAlert, CheckCircle2, XCircle, AlertTriangle, Cpu, Check, Settings, ShieldCheck, Eye, EyeOff } from 'lucide-react';

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
    const pyKeywords = ['if', 'not', 'in', 'return', 'def', 'import', 'from', 'for', 'class'];
    pyKeywords.forEach(kw => {
      const regex = new RegExp(`\\b(${kw})\\b`, 'g');
      escaped = escaped.replace(regex, '<span class="text-cyber-blue font-bold">$1</span>');
    });

    // 4. Highlight variables
    const vars = ['username', 'password', 'query', 'category', 'allowed_categories', 'results', 'db'];
    vars.forEach(v => {
      const regex = new RegExp(`\\b(${v})\\b`, 'g');
      escaped = escaped.replace(regex, '<span class="text-code-variable font-semibold">$1</span>');
    });

    // 5. Highlight functions, methods, builtins
    escaped = escaped.replace(/\b(request\.args\.get|request\.form|db\.execute)\b/g, '<span class="text-code-function font-semibold">$1</span>');

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
    const sqlKeywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'UNION', 'TRUE', 'FALSE'];
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

export default function ClassicInjection() {
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
          Classic SQL <span className="text-cyber-blue">Injection</span>
        </h1>
        <p className="text-cyber-text text-sm text-justify w-full leading-relaxed font-medium">
          Learn how unsafe SQL query construction allows user input to alter database logic and expose unauthorized records.
        </p>
        <div className="pt-1">
          <span className="inline-flex items-center text-[9px] font-mono font-bold tracking-wider text-cyber-blue border border-cyber-blue/30 bg-cyber-blue/5 px-2.5 py-0.5 rounded uppercase">
            FOUNDATIONAL SQL INJECTION TECHNIQUE
          </span>
        </div>
      </div>

      {/* 2. Section: What is Classic SQL Injection? */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2.5 border-b border-cyber-border/40 pb-3">
          <Database className="w-4.5 h-4.5 text-cyber-blue" />
          <h3 className="font-sans font-bold text-sm text-cyber-title tracking-wider uppercase">
            What is Classic SQL Injection?
          </h3>
        </div>
        <div className="space-y-3 text-sm text-cyber-text leading-relaxed text-justify">
          <p>
            Classic SQL Injection occurs when an application places untrusted user input directly inside an SQL query. Instead of being interpreted only as data, the input becomes part of the SQL command executed by the database.
          </p>
          <p>
            An attacker can insert SQL operators such as OR, quotes, and comments to change the original query logic. A common example is a tautology such as 1=1, which is always true and may cause the database to return records that should normally remain inaccessible.
          </p>
          <p className="text-xs text-cyber-dim font-sans italic border-l-2 border-cyber-blue/50 pl-3 mt-2">
            <strong>Note:</strong> Classic SQL Injection is not only limited to login bypass vulnerabilities. It commonly affects product search bars, category filters, account lookups, and any input field that queries database tables dynamically.
          </p>
        </div>

        {/* Small Info Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-cyber-border/30 text-xs font-mono">
          <div className="bg-cyber-black/30 border border-cyber-border/50 rounded-lg p-2.5">
            <span className="text-cyber-dim font-bold block uppercase text-[9px] tracking-wider mb-0.5">Cause</span>
            <span className="text-cyber-title font-bold">Dynamic SQL string concatenation</span>
          </div>
          <div className="bg-cyber-black/30 border border-cyber-border/50 rounded-lg p-2.5">
            <span className="text-cyber-dim font-bold block uppercase text-[9px] tracking-wider mb-0.5">Attacker Goal</span>
            <span className="text-cyber-red font-bold">Modify the intended query logic</span>
          </div>
          <div className="bg-cyber-black/30 border border-cyber-border/50 rounded-lg p-2.5">
            <span className="text-cyber-dim font-bold block uppercase text-[9px] tracking-wider mb-0.5">Possible Impact</span>
            <span className="text-cyber-red font-bold">Authentication bypass & data leak</span>
          </div>
        </div>
      </div>

      {/* 3. Section: Vulnerable database scenario */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2.5 border-b border-cyber-border/40 pb-3">
          <Terminal className="w-4.5 h-4.5 text-cyber-red animate-pulse" />
          <h3 className="font-sans font-bold text-sm text-cyber-title tracking-wider uppercase">
            Vulnerable Product Category Search
          </h3>
        </div>

        <p className="text-sm text-cyber-text leading-relaxed text-justify">
          Imagine an online store that receives a category value from the user and uses it to retrieve matching products from the database.
        </p>

        {/* Database Table Preview */}
        <div className="space-y-2">
          <span className="text-xs font-bold font-mono text-cyber-dim block uppercase tracking-wider">
            Database Table: <code className="text-cyber-title bg-cyber-input px-1.5 py-0.5 rounded font-mono font-medium">products</code>
          </span>
          <div className="overflow-x-auto border border-cyber-border rounded-lg bg-cyber-input">
            <table className="w-full border-collapse text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-cyber-border bg-cyber-card text-cyber-dim">
                  <th className="p-3 font-bold pl-4">id</th>
                  <th className="p-3 font-bold">name</th>
                  <th className="p-3 font-bold">category</th>
                  <th className="p-3 font-bold pr-4">price</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                  <td className="p-3 pl-4 text-cyber-dim">1</td>
                  <td className="p-3 text-cyber-title font-semibold">Gaming Laptop</td>
                  <td className="p-3 text-cyber-blue-light">electronics</td>
                  <td className="p-3 pr-4 text-cyber-text">1299.00</td>
                </tr>
                <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                  <td className="p-3 pl-4 text-cyber-dim">2</td>
                  <td className="p-3 text-cyber-title font-semibold">Wireless Headphones</td>
                  <td className="p-3 text-cyber-blue-light">electronics</td>
                  <td className="p-3 pr-4 text-cyber-text">299.00</td>
                </tr>
                <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                  <td className="p-3 pl-4 text-cyber-dim">3</td>
                  <td className="p-3 text-cyber-title font-semibold">Office Chair</td>
                  <td className="p-3 text-cyber-blue-light">furniture</td>
                  <td className="p-3 pr-4 text-cyber-text">249.00</td>
                </tr>
                <tr className="bg-cyber-red/5 hover:bg-cyber-red/10 border-b border-cyber-border/10">
                  <td className="p-3 pl-4 text-cyber-red/80 font-bold">4</td>
                  <td className="p-3 text-cyber-title font-bold text-cyber-red flex items-center gap-1.5">
                    <span>Administrator Dev Kit</span>
                    <span className="text-[8px] border border-cyber-red/40 bg-cyber-red/10 px-1.5 py-0.25 rounded text-cyber-red uppercase tracking-wider font-bold">INTERNAL</span>
                  </td>
                  <td className="p-3 text-cyber-red font-bold">internal</td>
                  <td className="p-3 pr-4 text-cyber-red font-semibold">0.00</td>
                </tr>
              </tbody>
            </table>
          </div>
          <span className="text-[10px] text-cyber-dim block font-sans italic mt-1 pl-1">
            * The record (ID 4) belongs to the internal category and should not normally be shown to public store visitors.
          </span>
        </div>

        {/* 4. Show the vulnerable backend code */}
        <div className="space-y-2 pt-4 border-t border-cyber-border/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono text-cyber-dim uppercase tracking-wider">
              Vulnerable Python code
            </span>
            <span className="text-[9px] font-mono font-bold text-cyber-red border border-cyber-red/30 bg-cyber-red/5 px-2 py-0.5 rounded uppercase">
              UNSAFE STRING CONCATENATION
            </span>
          </div>

          <CodeBox 
            lang="Python" 
            code={`category = request.args.get("category")

query = (
    "SELECT id, name, category, price "
    "FROM products "
    "WHERE category = '" + category + "'"
)

results = db.execute(query)`} 
          />

          <p className="text-xs text-cyber-text leading-relaxed text-justify mt-2 pl-1">
            The <code className="text-cyber-red font-mono bg-cyber-red/5 px-1 py-0.5 rounded font-bold">category</code> value is concatenated directly into the SQL statement. Because the application does not separate SQL code from user data, specially crafted input can modify the <code className="text-cyber-title font-mono font-bold">WHERE</code> clause.
          </p>

          <div className="bg-cyber-red/5 border border-cyber-red/20 rounded-lg p-3 font-mono text-xs text-cyber-red/90 mt-2 space-y-1.5">
            <span className="font-extrabold uppercase text-[10px] tracking-wider block">Unsafe Interpolation Scope:</span>
            <code className="bg-cyber-black/40 px-2 py-1 rounded block font-mono font-bold mt-1 text-center select-all">
              "WHERE category = '" + category + "'"
            </code>
          </div>
        </div>
      </div>

      {/* 5. Show normal application behavior (Step 1) */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2 border-b border-cyber-border/40 pb-3">
          <div className="w-5 h-5 rounded-full bg-cyber-green/10 border border-cyber-green/30 flex items-center justify-center text-cyber-green text-[10px] font-bold font-mono">1</div>
          <h3 className="font-sans font-bold text-sm text-cyber-green tracking-wider uppercase">
            Step 1 — Normal request
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div className="space-y-1.5">
            <span className="text-cyber-dim font-bold uppercase tracking-wider block">Target URL</span>
            <div className="bg-cyber-input border border-cyber-border rounded-lg p-2.5 text-cyber-text truncate select-all">
              http://127.0.0.1:2000/products?category=electronics
            </div>
          </div>
          <div className="space-y-1.5">
            <span className="text-cyber-dim font-bold uppercase tracking-wider block">User Input</span>
            <div className="bg-cyber-input border border-cyber-border rounded-lg p-2.5 text-cyber-title font-bold">
              electronics
            </div>
          </div>
        </div>

        <div className="space-y-1.5 font-mono text-xs">
          <span className="text-cyber-dim font-bold uppercase tracking-wider block">Generated SQL Query</span>
          <CodeBox 
            lang="SQL" 
            code={`SELECT id, name, category, price
FROM products
WHERE category = 'electronics';`} 
          />
        </div>

        <div className="bg-cyber-green/5 border border-cyber-green/20 rounded-lg p-4 text-xs font-mono leading-relaxed space-y-3">
          <p className="text-cyber-green font-medium">
            <strong>Result:</strong> The database returns only products whose category is electronics. This is the intended application behavior.
          </p>
          
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-cyber-dim uppercase tracking-wider block">Returned Rows:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-2 bg-cyber-black/30 border border-cyber-green/30 rounded-lg px-3 py-2 text-cyber-title font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyber-green" />
                Gaming Laptop
              </div>
              <div className="flex items-center gap-2 bg-cyber-black/30 border border-cyber-green/30 rounded-lg px-3 py-2 text-cyber-title font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyber-green" />
                Wireless Headphones
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Show malicious input and query transformation (Step 2) */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2 border-b border-cyber-border/40 pb-3">
          <div className="w-5 h-5 rounded-full bg-cyber-red/10 border border-cyber-red/30 flex items-center justify-center text-cyber-red text-[10px] font-bold font-mono">2</div>
          <h3 className="font-sans font-bold text-sm text-cyber-red tracking-wider uppercase">
            Step 2 — Injected request
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div className="space-y-1.5">
            <span className="text-cyber-dim font-bold uppercase tracking-wider block">Target URL</span>
            <div className="bg-cyber-input border border-cyber-border rounded-lg p-2.5 text-cyber-red truncate select-all font-bold">
              http://127.0.0.1:2000/products?category=electronics' OR '1'='1' -- 
            </div>
          </div>
          <div className="space-y-1.5">
            <span className="text-cyber-dim font-bold uppercase tracking-wider block">User Input Payload</span>
            <div className="bg-cyber-input border border-cyber-border rounded-lg p-2.5 text-cyber-red font-bold select-all">
              electronics' OR '1'='1' -- 
            </div>
          </div>
        </div>

        <div className="space-y-1.5 font-mono text-xs">
          <span className="text-cyber-dim font-bold uppercase tracking-wider block">Transformed SQL Query</span>
          <CodeBox 
            lang="SQL" 
            code={`SELECT id, name, category, price
FROM products
WHERE category = 'electronics' OR '1'='1' -- ';`} 
          />
        </div>

        {/* Payload Visual Breakdown */}
        <div className="space-y-2">
          <span className="text-xs font-bold font-mono text-cyber-dim block uppercase tracking-wider">
            Payload Breakdown Structure
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
            <div className="bg-cyber-black/40 border border-cyber-border rounded-lg p-3 relative overflow-hidden space-y-1.5">
              <span className="absolute top-0 left-0 bottom-0 w-[3px] bg-cyber-blue" />
              <span className="text-cyber-blue font-bold text-[10px] uppercase block">Part 1</span>
              <code className="text-cyber-title font-bold bg-cyber-input px-1.5 py-0.5 rounded font-mono">electronics'</code>
              <p className="text-[11px] text-cyber-dim leading-relaxed">
                Closes the original category string literal boundaries.
              </p>
            </div>
            <div className="bg-cyber-black/40 border border-cyber-border rounded-lg p-3 relative overflow-hidden space-y-1.5">
              <span className="absolute top-0 left-0 bottom-0 w-[3px] bg-cyber-red" />
              <span className="text-cyber-red font-bold text-[10px] uppercase block">Part 2</span>
              <code className="text-cyber-red font-bold bg-cyber-input px-1.5 py-0.5 rounded font-mono">OR '1'='1'</code>
              <p className="text-[11px] text-cyber-dim leading-relaxed">
                Adds an alternative boolean condition that is always true.
              </p>
            </div>
            <div className="bg-cyber-black/40 border border-cyber-border rounded-lg p-3 relative overflow-hidden space-y-1.5">
              <span className="absolute top-0 left-0 bottom-0 w-[3px] bg-[#ffbd2e]" />
              <span className="text-[#ffbd2e] font-bold text-[10px] uppercase block">Part 3</span>
              <code className="text-[#ffbd2e] font-bold bg-cyber-input px-1.5 py-0.5 rounded font-mono">-- </code>
              <p className="text-[11px] text-cyber-dim leading-relaxed">
                Comments out the remaining SQL characters, neutralizing the trailing quote.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Explain why the query becomes vulnerable */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2.5 border-b border-cyber-border/40 pb-3">
          <AlertTriangle className="w-4.5 h-4.5 text-cyber-red animate-bounce" />
          <h3 className="font-sans font-bold text-sm text-cyber-title tracking-wider uppercase">
            Why does the attack work?
          </h3>
        </div>

        <div className="space-y-3 text-sm text-cyber-text leading-relaxed text-justify">
          <p>
            The database logic parses the modified query segments. Rather than checking a specific category value, the database evaluates the condition:
          </p>
          <code className="bg-cyber-black/40 border border-cyber-border rounded px-3 py-1.5 block font-mono text-center text-xs text-cyber-red font-bold mt-2">
            category = 'electronics' OR '1'='1'
          </code>
          <p className="pt-2">
            The first condition matches electronics products. However, the second condition is true for every database row. Because the conditions are connected with <code className="text-cyber-blue font-bold font-mono">OR</code>, the complete <code className="text-cyber-title font-mono font-bold">WHERE</code> clause evaluates to true for all products.
          </p>
        </div>

        {/* Logic Truth Table representation */}
        <div className="bg-cyber-black/30 border border-cyber-border rounded-lg p-3 font-mono text-xs max-w-sm mx-auto text-center space-y-1">
          <span className="text-[9px] uppercase tracking-wider text-cyber-dim block font-bold mb-1">Tautology Logical Truth Table</span>
          <div>FALSE OR <span className="text-cyber-green font-bold">TRUE</span> = <span className="text-cyber-green font-bold">TRUE</span></div>
          <div>TRUE  OR <span className="text-cyber-green font-bold">TRUE</span> = <span className="text-cyber-green font-bold">TRUE</span></div>
        </div>

        {/* Leaked Unauthorized Result list */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-bold font-mono text-cyber-dim block uppercase tracking-wider">
            Unauthorized Result Leaked
          </span>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
            <div className="flex items-center gap-2 bg-cyber-black/20 border border-cyber-border rounded-lg px-3 py-2 text-cyber-dim">
              <Check className="w-3.5 h-3.5 text-cyber-dim" />
              Gaming Laptop
            </div>
            <div className="flex items-center gap-2 bg-cyber-black/20 border border-cyber-border rounded-lg px-3 py-2 text-cyber-dim">
              <Check className="w-3.5 h-3.5 text-cyber-dim" />
              Wireless Headphones
            </div>
            <div className="flex items-center gap-2 bg-cyber-black/20 border border-cyber-red/30 rounded-lg px-3 py-2 text-cyber-red/80 font-semibold">
              <AlertTriangle className="w-3.5 h-3.5 text-cyber-red animate-pulse" />
              Office Chair
            </div>
            <div className="flex items-center justify-between bg-cyber-red/5 border border-cyber-red/45 rounded-lg px-3 py-2 text-cyber-red font-bold">
              <span className="flex items-center gap-2">
                <XCircle className="w-3.5 h-3.5 text-cyber-red" />
                Administrator Dev Kit
              </span>
              <span className="text-[8px] border border-cyber-red/40 bg-cyber-red/10 px-1 py-0.25 rounded text-cyber-red uppercase tracking-wider font-bold">UNAUTHORIZED RECORD EXPOSED</span>
            </div>
          </div>
        </div>

        {/* Security Impact Card */}
        <div className="bg-cyber-red/5 border border-cyber-red/30 rounded-xl p-4 text-xs font-mono leading-relaxed text-cyber-red flex gap-3 items-start mt-4">
          <ShieldAlert className="w-5 h-5 shrink-0 text-cyber-red animate-pulse" />
          <div>
            <span className="font-bold text-cyber-title uppercase block mb-1">⚠️ Security impact</span>
            A successful Classic SQL Injection may expose records outside the requested category, reveal internal data, bypass application filters, or allow an attacker to interact with database content that the interface was never designed to display.
          </div>
        </div>
      </div>

      {/* 8. Section: How to secure the application */}
      <div className="bg-cyber-card border border-cyber-green/45 rounded-xl p-6 relative overflow-hidden space-y-4 w-full shadow-lg">
        <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-green animate-pulse" />
        <div className="flex items-center gap-2.5 border-b border-cyber-border/40 pb-3">
          <ShieldCheck className="w-4.5 h-4.5 text-cyber-green" />
          <h3 className="font-sans font-bold text-sm text-cyber-green tracking-wider uppercase">
            How to Prevent Classic SQL Injection
          </h3>
        </div>

        <p className="text-sm text-cyber-text leading-relaxed text-justify">
          The primary defense against SQL Injection is the use of <strong>parameterized queries</strong> (also known as prepared statements).
        </p>

        {/* Secure Python example */}
        <div className="space-y-2">
          <span className="text-xs font-bold font-mono text-cyber-dim block uppercase tracking-wider">
            Secure Python example
          </span>

          <CodeBox 
            lang="Python" 
            code={`category = request.args.get("category")

query = """
    SELECT id, name, category, price
    FROM products
    WHERE category = ?
"""

results = db.execute(query, (category,))`} 
          />

          <p className="text-xs text-cyber-text leading-relaxed text-justify mt-2 pl-1">
            The SQL command structure and the user-supplied values are sent to the database engine separately. The database treats the parameter value strictly as data, neutralizing quotes, SQL operators, or comment markers.
          </p>
        </div>

        {/* Conceptual Difference */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 text-xs font-mono">
          <div className="bg-cyber-red/5 border border-cyber-red/20 rounded-lg p-3 relative overflow-hidden">
            <span className="text-cyber-red font-bold text-[9px] uppercase tracking-wider block mb-1">Vulnerable Conceptual flow</span>
            <code className="text-cyber-text font-bold text-[10px] break-all leading-normal">
              SQL command + user input → one dynamically constructed query string
            </code>
          </div>
          <div className="bg-cyber-green/5 border border-cyber-green/20 rounded-lg p-3 relative overflow-hidden">
            <span className="text-cyber-green font-bold text-[9px] uppercase tracking-wider block mb-1">Secure Conceptual flow</span>
            <code className="text-cyber-title font-bold text-[10px] break-all leading-normal">
              Prepared SQL query template structure + separately bound data parameters
            </code>
          </div>
        </div>

        {/* Visual comparison table */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-bold font-mono text-cyber-dim block uppercase tracking-wider">
            Approach Comparison Table
          </span>
          <div className="overflow-x-auto border border-cyber-border rounded-lg bg-cyber-input">
            <table className="w-full border-collapse text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-cyber-border bg-cyber-card text-cyber-dim">
                  <th className="p-3 font-bold pl-4 text-cyber-red">Vulnerable Approach</th>
                  <th className="p-3 font-bold pr-4 text-cyber-green">Secure Approach</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                  <td className="p-3 pl-4 text-cyber-text">String concatenation</td>
                  <td className="p-3 pr-4 text-cyber-text">Parameterized query</td>
                </tr>
                <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                  <td className="p-3 pl-4 text-cyber-text">Input can alter SQL structure</td>
                  <td className="p-3 pr-4 text-cyber-text">Input remains restricted as a data value</td>
                </tr>
                <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                  <td className="p-3 pl-4 text-cyber-text">SQL execution logic may be modified</td>
                  <td className="p-3 pr-4 text-cyber-text">Query structure remains fixed</td>
                </tr>
                <tr className="hover:bg-cyber-blue/5">
                  <td className="p-3 pl-4 text-cyber-text">Difficult to validate securely</td>
                  <td className="p-3 pr-4 text-cyber-text">Handled safely by the database driver</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 9. Additional defensive measures */}
      <div className="space-y-4">
        <span className="text-xs font-bold font-mono text-cyber-dim block uppercase tracking-wider">
          Additional Defense-In-Depth Measures
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 font-mono text-xs space-y-2 relative overflow-hidden">
            <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-blue" />
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-cyber-blue" />
              <span className="font-bold text-cyber-title uppercase">1. Allow-list expected values</span>
            </div>
            <p className="text-cyber-dim leading-relaxed">
              Only accept known category values such as electronics, furniture, or clothing when the business logic permits it.
            </p>
            <CodeBox 
              lang="Python" 
              code={`allowed_categories = {"electronics", "furniture", "clothing"}

if category not in allowed_categories:
    return {"error": "Invalid category"}, 400`} 
            />
          </div>

          <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 font-mono text-xs space-y-2 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-blue" />
              <div className="flex items-center gap-2 mb-2">
                <Settings className="w-4 h-4 text-cyber-blue" />
                <span className="font-bold text-cyber-title uppercase">2. Least-privilege accounts</span>
              </div>
              <p className="text-cyber-dim leading-relaxed">
                The web application database account should receive only the minimum permissions required for its normal operations. Avoid using database superusers (like root or sa).
              </p>
            </div>
            <div className="bg-cyber-black/30 border border-cyber-border/40 rounded p-2.5 mt-4 text-[10px] text-cyber-dim">
              <strong>Example:</strong> Grant only SELECT permissions on the products table for the public reader account role.
            </div>
          </div>

          <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 font-mono text-xs space-y-2 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-blue" />
              <div className="flex items-center gap-2 mb-2">
                <EyeOff className="w-4 h-4 text-cyber-blue" />
                <span className="font-bold text-cyber-title uppercase">3. Avoid database error leak</span>
              </div>
              <p className="text-cyber-dim leading-relaxed">
                Return generic error messages to web clients and store detailed verbose database error codes only in protected backend server logs.
              </p>
            </div>
            <div className="bg-cyber-black/30 border border-cyber-border/40 rounded p-2.5 mt-4 text-[10px] text-cyber-dim">
              <strong>Vulnerable:</strong> "SQLITE_ERROR: near 'OR': syntax error"<br/>
              <strong>Secure:</strong> "An unexpected application database query error occurred."
            </div>
          </div>

          <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 font-mono text-xs space-y-2 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-blue" />
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="w-4 h-4 text-cyber-blue" />
                <span className="font-bold text-cyber-title uppercase">4. Add monitoring & testing</span>
              </div>
              <p className="text-cyber-dim leading-relaxed">
                Log suspicious query sequences and regularly test database-driven endpoints for query parsing behaviors during the security assessment cycle.
              </p>
            </div>
            <div className="bg-cyber-black/30 border border-cyber-border/40 rounded p-2.5 mt-4 text-[10px] text-cyber-dim">
              <strong>Action:</strong> Run periodic automated static analysis tools or perform targeted manual penetration testing.
            </div>
          </div>
        </div>

        <div className="bg-cyber-blue/5 border border-cyber-blue/20 rounded-lg p-3 font-mono text-[11px] text-cyber-blue-light text-center">
          💡 <strong>Defense-in-depth:</strong> Input validation is a helpful additional control, but it is not a replacement for parameterized queries.
        </div>
      </div>

      {/* 10. Final learning summary */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full font-mono">
        <div className="flex items-center gap-2 border-b border-cyber-border/40 pb-3">
          <ShieldAlert className="w-4.5 h-4.5 text-cyber-blue" />
          <h3 className="font-sans font-bold text-sm text-cyber-title tracking-wider uppercase">
            Key Takeaways
          </h3>
        </div>

        <ul className="list-disc list-inside space-y-2 text-xs text-cyber-dim leading-relaxed">
          <li>
            <strong className="text-cyber-title">Syntax breakout:</strong> Classic SQL Injection begins when untrusted input is inserted directly into an SQL query.
          </li>
          <li>
            <strong className="text-cyber-title">Escape boundaries:</strong> Quotes and SQL operators can allow input to escape its intended data context.
          </li>
          <li>
            <strong className="text-cyber-title">Tautology logic:</strong> A tautology such as <code className="text-cyber-red bg-cyber-red/5 px-1 py-0.5 rounded font-mono">1=1</code> can cause a filter condition to become true for every row.
          </li>
          <li>
            <strong className="text-cyber-title">Query separation:</strong> The main defense is to use parameterized queries or prepared statements.
          </li>
          <li>
            <strong className="text-cyber-title">Defense-in-depth:</strong> Clean input validation, least privilege database setup, generic errors, and monitoring provide additional layers of protection.
          </li>
        </ul>
      </div>

      {/* 11. Simulator call-to-action */}
      <div className="bg-cyber-card border border-cyber-border/70 rounded-2xl p-8 text-center space-y-5 shadow-2xl relative overflow-hidden w-full">
        <span className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyber-blue to-transparent" />
        <h3 className="font-sans font-extrabold text-lg text-cyber-title tracking-wider uppercase">
          Test the Vulnerable Query in the Local Lab
        </h3>
        <p className="text-sm text-cyber-text text-justify leading-relaxed max-w-2xl mx-auto font-sans">
          Use the Classic SQL Injection simulator to observe how a tautology payload changes the generated SQL query and causes records outside the intended filter to be returned.
        </p>
        <div className="pt-2">
          <Link
            to="/attacks/classic-injection"
            className="inline-flex items-center gap-2 bg-cyber-blue hover:bg-cyber-blue-light text-white px-8 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_20px_rgba(26,106,255,0.3)] hover:shadow-[0_0_30px_rgba(26,106,255,0.5)] transform hover:-translate-y-0.5"
          >
            <Terminal className="w-4 h-4" />
            Launch Classic SQL Injection Simulator
          </Link>
        </div>
      </div>

    </div>
  );
}
