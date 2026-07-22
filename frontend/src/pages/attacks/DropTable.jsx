import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Database, Trash2, ShieldAlert, CheckCircle2, XCircle, AlertTriangle, Check, ShieldCheck, ServerCrash, DatabaseZap, Terminal } from 'lucide-react';

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
    const vars = ['product_id', 'query', 'result', 'db', 'user', 'username', 'password'];
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
      'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'UNION', 'LIMIT', 'DROP', 'TABLE', 'DELETE', 'TRUNCATE', 'ALTER', 'CREATE', 'COUNT', 'TRUE', 'FALSE'
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

export default function DropTable() {
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
          Drop Table <span className="text-cyber-red">SQL Injection</span>
        </h1>
        <p className="text-cyber-text text-sm text-justify w-full leading-relaxed font-medium">
          Learn how unsafe SQL query construction can allow attacker-controlled input to append destructive database commands.
        </p>
        <div className="pt-1">
          <span className="inline-flex items-center text-[9px] font-mono font-bold tracking-wider text-cyber-red border border-cyber-red/30 bg-cyber-red/5 px-2.5 py-0.5 rounded uppercase">
            DESTRUCTIVE SQL INJECTION TECHNIQUE
          </span>
        </div>
      </div>

      {/* 2. Section: What is a Drop Table SQL Injection attack? */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2.5 border-b border-cyber-border/40 pb-3">
          <DatabaseZap className="w-4.5 h-4.5 text-cyber-red" />
          <h3 className="font-sans font-bold text-sm text-cyber-title tracking-wider uppercase">
            What is a Drop Table SQL Injection Attack?
          </h3>
        </div>
        <div className="space-y-3 text-sm text-cyber-text leading-relaxed text-justify">
          <p>
            A Drop Table SQL Injection attack occurs when unsafe user input is able to append a destructive SQL statement such as <code className="text-cyber-red font-mono bg-cyber-red/5 px-1 py-0.5 rounded">DROP TABLE</code> to an existing database query.
          </p>
          <p>
            If the database driver allows multiple statements and the application database account has sufficient privileges, the injected command may delete an entire table and all records stored inside it.
          </p>
          <p className="text-xs text-cyber-dim font-sans italic border-l-2 border-cyber-red/40 bg-cyber-red/5 pl-3 py-1 pr-2 mt-2">
            <strong>Note:</strong> DROP TABLE is only one destructive example. SQL Injection may also be used to modify, delete, truncate, or corrupt database data.
          </p>
        </div>

        {/* Info Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-cyber-border/30 text-xs font-mono">
          <div className="bg-cyber-black/30 border border-cyber-border/50 rounded-lg p-2.5">
            <span className="text-cyber-dim font-bold block uppercase text-[9px] tracking-wider mb-0.5">Cause</span>
            <span className="text-cyber-title font-bold">Raw input is inserted directly into an SQL statement</span>
          </div>
          <div className="bg-cyber-black/30 border border-cyber-border/50 rounded-lg p-2.5">
            <span className="text-cyber-dim font-bold block uppercase text-[9px] tracking-wider mb-0.5">Attacker Goal</span>
            <span className="text-cyber-red font-bold">Append a destructive database command</span>
          </div>
          <div className="bg-cyber-black/30 border border-cyber-border/50 rounded-lg p-2.5">
            <span className="text-cyber-dim font-bold block uppercase text-[9px] tracking-wider mb-0.5">Possible Impact</span>
            <span className="text-cyber-red font-bold">Permanent data loss and application failure</span>
          </div>
        </div>
      </div>

      {/* 3. Section: Understand DROP TABLE */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2.5 border-b border-cyber-border/40 pb-3">
          <Trash2 className="w-4.5 h-4.5 text-cyber-red animate-pulse" />
          <h3 className="font-sans font-bold text-sm text-cyber-title tracking-wider uppercase">
            What does DROP TABLE do?
          </h3>
        </div>

        <p className="text-sm text-cyber-text leading-relaxed text-justify">
          The <code className="text-cyber-red font-mono bg-cyber-red/5 px-1 py-0.5 rounded font-bold">DROP TABLE</code> command removes the entire table definition, its columns, constraints, and all rows stored inside the table from the database catalog.
        </p>

        <div className="space-y-1.5">
          <span className="text-xs font-bold font-mono text-cyber-dim block uppercase tracking-wider">SQL Command</span>
          <CodeBox lang="SQL" code={`DROP TABLE products;`} />
        </div>

        {/* Visual Before and After Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="bg-cyber-black/30 border border-cyber-border rounded-xl p-4 space-y-2">
            <span className="text-cyber-green font-bold text-[9px] uppercase tracking-wider block border-b border-cyber-border/40 pb-1.5">
              Before DROP TABLE
            </span>
            <div className="space-y-1 pl-1">
              <div>✓ products (table exists)</div>
              <div>✓ users</div>
              <div>✓ orders</div>
              <div>✓ order_items</div>
            </div>
          </div>
          <div className="bg-cyber-red/5 border border-cyber-red/25 rounded-xl p-4 space-y-2">
            <span className="text-cyber-red font-bold text-[9px] uppercase tracking-wider block border-b border-cyber-red/20 pb-1.5">
              After DROP TABLE products
            </span>
            <div className="space-y-1 pl-1">
              <div className="text-cyber-red line-through">✗ products (deleted permanently)</div>
              <div>✓ users</div>
              <div>✓ orders</div>
              <div>✓ order_items</div>
            </div>
          </div>
        </div>

        <p className="text-xs text-cyber-red/80 font-sans italic pl-1 border-l-2 border-cyber-red/40 bg-cyber-red/5 py-1 pr-2">
          <strong>Critical Warning:</strong> Unlike DELETE, DROP TABLE removes the entire database object definition, not only selected rows.
        </p>

        {/* Comparison Table */}
        <div className="space-y-2 pt-2">
          <span className="text-[10px] font-bold font-mono text-cyber-dim block uppercase tracking-wider">Destructive Commands Differences</span>
          <div className="overflow-x-auto border border-cyber-border rounded-lg bg-cyber-input">
            <table className="w-full border-collapse text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-cyber-border bg-cyber-card text-cyber-dim">
                  <th className="p-2.5 font-bold pl-4">SQL Command</th>
                  <th className="p-2.5 font-bold pr-4">Effect</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                  <td className="p-2.5 pl-4 text-cyber-text">`DELETE FROM products`</td>
                  <td className="p-2.5 pr-4 text-cyber-dim">Deletes rows but keeps the table structure intact.</td>
                </tr>
                <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                  <td className="p-2.5 pl-4 text-cyber-text">`TRUNCATE TABLE products`</td>
                  <td className="p-2.5 pr-4 text-cyber-dim">Removes all rows and resets table storage (much faster, keeps structure).</td>
                </tr>
                <tr className="hover:bg-cyber-blue/5 text-cyber-red">
                  <td className="p-2.5 pl-4 font-bold">`DROP TABLE products`</td>
                  <td className="p-2.5 pr-4 font-medium text-cyber-red/90">Removes the entire table definition and its data permanently.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <span className="text-[9px] text-cyber-dim block font-sans italic pl-1">
            * Note that the exact transactional behavior and rollback options depend on the database engine.
          </span>
        </div>
      </div>

      {/* 4. Section: Vulnerable product lookup scenario */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2.5 border-b border-cyber-border/40 pb-3">
          <ShieldAlert className="w-4.5 h-4.5 text-cyber-red animate-pulse" />
          <h3 className="font-sans font-bold text-sm text-cyber-title tracking-wider uppercase">
            Vulnerable Golimar Store Product Endpoint
          </h3>
        </div>

        <p className="text-sm text-cyber-text leading-relaxed text-justify">
          Imagine that the Golimar Store application receives a product identifier and places it directly into a database query.
        </p>

        {/* Database Table Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono text-cyber-dim block uppercase tracking-wider">
              Database Table: <code className="text-cyber-title bg-cyber-input px-1.5 py-0.5 rounded font-mono font-medium">products</code>
            </span>
            <span className="text-[8px] border border-cyber-red/40 bg-cyber-red/10 px-2 py-0.5 rounded text-cyber-red font-bold">CRITICAL APPLICATION TABLE</span>
          </div>
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
                  <td className="p-3 text-cyber-text">electronics</td>
                  <td className="p-3 pr-4 text-cyber-text">1299.00</td>
                </tr>
                <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                  <td className="p-3 pl-4 text-cyber-dim">2</td>
                  <td className="p-3 text-cyber-title font-semibold">Wireless Headphones</td>
                  <td className="p-3 text-cyber-text">electronics</td>
                  <td className="p-3 pr-4 text-cyber-text">299.00</td>
                </tr>
                <tr className="hover:bg-cyber-blue/5">
                  <td className="p-3 pl-4 text-cyber-dim">3</td>
                  <td className="p-3 text-cyber-title font-semibold">Office Chair</td>
                  <td className="p-3 text-cyber-text">furniture</td>
                  <td className="p-3 pr-4 text-cyber-text">249.00</td>
                </tr>
              </tbody>
            </table>
          </div>
          <span className="text-[10px] text-cyber-dim block font-sans italic mt-1 pl-1">
            * If this table were deleted, the store could no longer display or manage products.
          </span>
        </div>

        {/* 5. Show the vulnerable backend code */}
        <div className="space-y-2 pt-4 border-t border-cyber-border/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono text-cyber-dim uppercase tracking-wider">
              Vulnerable Python database code
            </span>
            <span className="text-[9px] font-mono font-bold text-cyber-red border border-cyber-red/30 bg-cyber-red/5 px-2 py-0.5 rounded uppercase">
              UNSAFE STRING CONCATENATION
            </span>
          </div>

          <CodeBox 
            lang="Python" 
            code={`product_id = request.args.get("id")

query = (
    "SELECT id, name, category, price "
    "FROM products "
    "WHERE id = '" + product_id + "'"
)

result = db.execute(query)`} 
          />

          <p className="text-xs text-cyber-text leading-relaxed text-justify mt-2 pl-1">
            The product identifier is inserted directly into the SQL command. A crafted input can close the original value and append another SQL statement.
          </p>

          <div className="bg-cyber-red/5 border border-cyber-red/20 rounded-lg p-2.5 font-mono text-xs text-cyber-red/90 mt-2 text-center">
            <span className="font-extrabold uppercase text-[10px] tracking-wider block mb-1">Unsafe Parameter Interpolation Point:</span>
            <code className="bg-cyber-black/40 px-2 py-1 rounded inline-block select-all font-mono font-bold">
              "WHERE id = '" + product_id + "'"
            </code>
            <span className="text-[10px] text-cyber-red block mt-2 font-bold">
              ⚠️ The risk becomes more severe when the database driver permits multiple statements in a single execution call.
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
              http://127.0.0.1:2000/api/vulnerable/drop-products
            </div>
          </div>
          <div className="space-y-1.5">
            <span className="text-cyber-dim font-bold uppercase tracking-wider block">Submitted Value</span>
            <div className="bg-cyber-input border border-cyber-border rounded-lg p-2.5 text-cyber-title font-bold">
              1
            </div>
          </div>
          <div className="space-y-1.5">
            <span className="text-cyber-dim font-bold uppercase tracking-wider block">Result</span>
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
WHERE id = '1';`} 
          />
        </div>

        <div className="bg-cyber-green/5 border border-cyber-green/20 rounded-lg p-3 text-xs font-mono leading-relaxed">
          <p className="text-cyber-green font-medium">
            <strong>Result:</strong> The application performs the intended product lookup.
          </p>
        </div>
      </div>

      {/* 7. Show the malicious payload (Step 2) */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2 border-b border-cyber-border/40 pb-3">
          <div className="w-5 h-5 rounded-full bg-cyber-red/10 border border-cyber-red/30 flex items-center justify-center text-cyber-red text-[10px] font-bold font-mono">2</div>
          <h3 className="font-sans font-bold text-sm text-cyber-red tracking-wider uppercase">
            Step 2 — Destructive injected request
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div className="space-y-1.5">
            <span className="text-cyber-dim font-bold uppercase tracking-wider block">Target Endpoint</span>
            <div className="bg-cyber-input border border-cyber-border rounded-lg p-2.5 text-cyber-red truncate select-all font-bold">
              http://127.0.0.1:2000/api/vulnerable/drop-products
            </div>
          </div>
          <div className="space-y-1.5">
            <span className="text-cyber-dim font-bold uppercase tracking-wider block">Submitted Input Payload</span>
            <div className="bg-cyber-input border border-cyber-border rounded-lg p-2.5 text-cyber-red font-bold select-all">
              1'; DROP TABLE products; --
            </div>
          </div>
        </div>

        <div className="space-y-1.5 font-mono text-xs">
          <span className="text-cyber-dim font-bold uppercase tracking-wider block">Transformed Multi-Statement Query</span>
          <CodeBox 
            lang="SQL" 
            code={`SELECT id, name, category, price
FROM products
WHERE id = '1';

DROP TABLE products;

--';`} 
          />
          <span className="text-[10px] text-cyber-dim block font-sans italic pl-1 mt-1">
            * The exact final query depends on the original backend syntax and the database driver. This example illustrates how the injected value can terminate the original query and append a second statement.
          </span>
        </div>

        {/* 8. Break down the payload */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-bold font-mono text-cyber-dim block uppercase tracking-wider">
            Payload Breakdown Structure
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 font-mono text-xs">
            <div className="bg-cyber-black/40 border border-cyber-border rounded-lg p-3 relative overflow-hidden space-y-1">
              <span className="absolute top-0 left-0 bottom-0 w-[3px] bg-cyber-blue" />
              <span className="text-cyber-blue font-bold text-[9px] uppercase block">Part 1</span>
              <code className="text-cyber-title font-bold bg-cyber-input px-1.5 py-0.5 rounded font-mono">1</code>
              <p className="text-[10px] text-cyber-dim leading-relaxed">
                Supplies valid ID for the original query.
              </p>
            </div>
            <div className="bg-cyber-black/40 border border-cyber-border rounded-lg p-3 relative overflow-hidden space-y-1">
              <span className="absolute top-0 left-0 bottom-0 w-[3px] bg-cyber-blue" />
              <span className="text-cyber-blue font-bold text-[9px] uppercase block">Part 2</span>
              <code className="text-cyber-title font-bold bg-cyber-input px-1.5 py-0.5 rounded font-mono">'</code>
              <p className="text-[10px] text-cyber-dim leading-relaxed">
                Closes the original quoted string boundary.
              </p>
            </div>
            <div className="bg-cyber-black/40 border border-cyber-border rounded-lg p-3 relative overflow-hidden space-y-1">
              <span className="absolute top-0 left-0 bottom-0 w-[3px] bg-cyber-red" />
              <span className="text-cyber-red font-bold text-[9px] uppercase block">Part 3</span>
              <code className="text-cyber-red font-bold bg-cyber-input px-1.5 py-0.5 rounded font-mono">;</code>
              <p className="text-[10px] text-cyber-dim leading-relaxed">
                Terminates the original SQL SELECT statement.
              </p>
            </div>
            <div className="bg-cyber-black/40 border border-cyber-border rounded-lg p-3 relative overflow-hidden space-y-1">
              <span className="absolute top-0 left-0 bottom-0 w-[3px] bg-cyber-red" />
              <span className="text-cyber-red font-bold text-[9px] uppercase block">Part 4</span>
              <code className="text-cyber-red font-bold bg-cyber-input px-1.5 py-0.5 rounded font-mono">DROP TABLE products</code>
              <p className="text-[10px] text-cyber-dim leading-relaxed">
                Appends the table-destroying schema command.
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

      {/* 9. Explain stacked queries */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2.5 border-b border-cyber-border/40 pb-3">
          <Terminal className="w-4.5 h-4.5 text-cyber-blue" />
          <h3 className="font-sans font-bold text-sm text-cyber-title tracking-wider uppercase">
            Why are multiple statements dangerous?
          </h3>
        </div>

        <p className="text-sm text-cyber-text leading-relaxed text-justify">
          Some database drivers allow multiple SQL statements to be executed in one database call. This behavior is often called stacked queries or multi-statement execution.
        </p>

        {/* Stacked Flow diagram */}
        <div className="max-w-md mx-auto py-2 font-mono text-xs text-center space-y-2">
          <div className="bg-cyber-card/85 border border-cyber-border p-2 rounded-lg text-cyber-blue-light">
            Original SELECT statement
          </div>
          <div className="text-cyber-red font-bold">; (Semicolon separator)</div>
          <div className="bg-cyber-red/5 border border-cyber-red/25 p-2 rounded-lg text-cyber-red font-bold">
            Injected DROP TABLE statement
          </div>
          <div className="text-cyber-dim font-bold">↓</div>
          <div className="bg-cyber-red/10 border border-cyber-red/20 p-2 rounded-lg text-cyber-red font-bold">
            Multiple database commands executed in sequence
          </div>
        </div>

        <p className="text-xs text-cyber-dim font-sans italic pl-1 border-l border-cyber-dim/50">
          * <strong>Warning:</strong> Not every database engine, driver, or configuration permits stacked queries. However, relying on that restriction is not a valid security defense.
        </p>
        <div className="pt-1 text-center">
          <span className="inline-flex items-center text-[9px] font-mono font-bold tracking-wider text-cyber-blue border border-cyber-blue/30 bg-cyber-blue/5 px-2.5 py-0.5 rounded uppercase">
            DRIVER AND CONFIGURATION DEPENDENT
          </span>
        </div>
      </div>

      {/* 10. Explain the real impact */}
      <div className="bg-cyber-card border border-[#ff3a3a]/40 bg-[#ff3a3a]/5 rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-red animate-pulse" />
        <div className="flex items-center gap-2.5 border-b border-[#ff3a3a]/20 pb-3">
          <ServerCrash className="w-4.5 h-4.5 text-cyber-red" />
          <h3 className="font-sans font-bold text-sm text-cyber-red tracking-wider uppercase">
            What would happen if the table were really deleted?
          </h3>
        </div>

        <p className="text-sm text-cyber-text leading-relaxed text-justify">
          If a real drop table query succeeds, the products database object is deleted. The store is immediately broken:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div className="bg-cyber-black/35 border border-cyber-border rounded-lg p-2.5">
            • Product pages fail to load
          </div>
          <div className="bg-cyber-black/35 border border-cyber-border rounded-lg p-2.5">
            • Search functions throw exceptions
          </div>
          <div className="bg-cyber-black/35 border border-cyber-border rounded-lg p-2.5">
            • Admin interfaces crash
          </div>
          <div className="bg-cyber-black/35 border border-cyber-border rounded-lg p-2.5">
            • Foreign-key constraints break
          </div>
          <div className="bg-cyber-black/35 border border-cyber-border rounded-lg p-2.5 md:col-span-2">
            • Backup recovery procedures are required to restore catalog items
          </div>
        </div>

        <div className="space-y-1.5 font-mono text-xs pt-1">
          <span className="text-cyber-red font-bold uppercase tracking-wider block">Simulated Output Error:</span>
          <pre className="bg-cyber-black/60 border border-cyber-red/35 rounded-lg p-3 text-cyber-red font-bold select-all whitespace-pre-wrap leading-normal">
            Database error: relation "products" does not exist
          </pre>
        </div>

        <div className="pt-1 text-center">
          <span className="inline-flex items-center text-[9px] font-mono font-bold tracking-wider text-cyber-red border border-cyber-red/30 bg-cyber-red/10 px-2.5 py-0.5 rounded uppercase">
            APPLICATION-WIDE FAILURE
          </span>
        </div>
      </div>

      {/* 11. Safe lab simulation behavior (Essential!) */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2.5 border-b border-cyber-border/40 pb-3">
          <ShieldAlert className="w-4.5 h-4.5 text-[#ffbd2e]" />
          <h3 className="font-sans font-bold text-sm text-cyber-title tracking-wider uppercase">
            How this educational lab handles the payload
          </h3>
        </div>

        <p className="text-sm text-cyber-text leading-relaxed text-justify">
          The local Golimar Store lab must not actually execute the DROP TABLE command. Instead, the application detects or simulates the destructive statement and returns an educational result indicating that the endpoint is vulnerable.
        </p>

        {/* Expected safe response simulation */}
        <div className="space-y-2 bg-[#ffbd2e]/5 border border-[#ffbd2e]/30 rounded-xl p-4 font-mono text-xs leading-relaxed text-[#ffbd2e]/90">
          <span className="font-extrabold uppercase text-[10px] tracking-wider block mb-1 text-cyber-title">Safe Simulated Response Block:</span>
          <div className="text-[#ffbd2e] font-bold">Vulnerability detected</div>
          <div className="text-cyber-dim mt-1.5">
            The supplied input could terminate the original query and append:<br />
            <code className="text-cyber-red bg-cyber-black/40 px-1 rounded">DROP TABLE products;</code>
          </div>
          <div className="text-cyber-green-light font-bold mt-2 border-t border-cyber-border/30 pt-2 flex items-center gap-1.5">
            <Check className="w-4 h-4 text-cyber-green-light" />
            For safety, the destructive command was not executed. The products table remains intact.
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1.5 font-mono text-[9px] justify-center">
          <span className="border border-cyber-red/30 bg-cyber-red/10 px-2.5 py-0.5 rounded font-bold uppercase text-cyber-red tracking-wider">
            VULNERABLE
          </span>
          <span className="border border-[#ffbd2e]/40 bg-[#ffbd2e]/10 px-2.5 py-0.5 rounded font-bold uppercase text-[#ffbd2e] tracking-wider">
            DESTRUCTIVE COMMAND BLOCKED
          </span>
          <span className="border border-cyber-green/45 bg-cyber-green/10 px-2.5 py-0.5 rounded font-bold uppercase text-cyber-green-light tracking-wider">
            DATABASE PRESERVED
          </span>
        </div>
      </div>

      {/* 12. Verify table remains intact */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2.5 border-b border-cyber-border/40 pb-3">
          <CheckCircle2 className="w-4.5 h-4.5 text-cyber-green" />
          <h3 className="font-sans font-bold text-sm text-cyber-title tracking-wider uppercase">
            Post-Attack Safety Check
          </h3>
        </div>

        <p className="text-sm text-cyber-text leading-relaxed text-justify">
          To verify that the database remains safe, the lab checks catalog size directly after the attack is triggered:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold font-mono text-cyber-dim uppercase tracking-wider block">Verification Check Query</span>
            <CodeBox lang="SQL" code={`SELECT COUNT(*) FROM products;`} />
          </div>
          <div className="bg-cyber-black/30 border border-cyber-border rounded-xl p-4 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-cyber-dim uppercase tracking-wider block mb-1">Check Result Output:</span>
              <span className="text-cyber-green font-bold block text-sm">3 product records found</span>
              <span className="text-cyber-title font-bold block mt-1.5 text-xs">products table status: AVAILABLE</span>
            </div>
            <span className="text-[10px] text-cyber-dim italic block mt-2 font-sans">
              * The lab demonstrates the risk without damaging the project database.
            </span>
          </div>
        </div>

        <div className="pt-1 text-center">
          <span className="inline-flex items-center text-[9px] font-mono font-bold tracking-wider text-cyber-green border border-cyber-green/30 bg-cyber-green/5 px-2.5 py-0.5 rounded uppercase">
            TABLE STILL EXISTS
          </span>
        </div>
      </div>

      {/* 13. Explain why the attack works */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2.5 border-b border-cyber-border/40 pb-3">
          <Database className="w-4.5 h-4.5 text-cyber-blue" />
          <h3 className="font-sans font-bold text-sm text-cyber-title tracking-wider uppercase">
            Why does the attack work?
          </h3>
        </div>

        <p className="text-sm text-cyber-text leading-relaxed text-justify">
          The application fails to separate SQL instructions from user-supplied data. The apostrophe closes the original string, the semicolon ends the first statement, and the attacker-controlled DROP TABLE command becomes a second executable statement.
        </p>

        {/* Simplified Flow */}
        <div className="max-w-md mx-auto py-2 font-mono text-xs text-center space-y-2">
          <div className="bg-cyber-card/85 border border-cyber-border p-2 rounded-lg">
            Raw user input
          </div>
          <div className="text-cyber-dim font-bold">↓</div>
          <div className="bg-cyber-red/5 border border-cyber-red/20 p-2 rounded-lg text-cyber-red font-bold">
            Original SQL string is terminated
          </div>
          <div className="text-cyber-dim font-bold">↓</div>
          <div className="bg-cyber-red/5 border border-cyber-red/20 p-2 rounded-lg text-cyber-red font-bold">
            Destructive statement is appended
          </div>
          <div className="text-cyber-dim font-bold">↓</div>
          <div className="bg-cyber-red/10 border border-cyber-red/20 p-2 rounded-lg text-cyber-red font-bold">
            Database driver may execute both statements
          </div>
        </div>

        <p className="text-sm text-cyber-text leading-relaxed text-justify font-bold mt-2">
          The vulnerability exists before DROP TABLE is reached. The root problem is unsafe query construction.
        </p>
      </div>

      {/* 14. Security impact section */}
      <div className="bg-cyber-card border border-cyber-red/40 rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2.5 border-b border-cyber-border/40 pb-3">
          <ShieldAlert className="w-4.5 h-4.5 text-cyber-red animate-pulse" />
          <h3 className="font-sans font-bold text-sm text-cyber-red tracking-wider uppercase">
            Security Impact
          </h3>
        </div>
        
        <p className="text-sm text-cyber-text leading-relaxed text-justify">
          Destructive SQL Injection can damage both data availability and data integrity. A successful attack may delete database objects, remove records, break application features, or cause extended service outages.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs pt-1">
          <div className="flex items-start gap-2.5 bg-cyber-red/5 border border-cyber-red/20 rounded-lg p-3">
            <Trash2 className="w-4 h-4 text-cyber-red shrink-0" />
            <div>
              <span className="text-cyber-title font-bold uppercase block mb-0.5">Permanent table deletion</span>
              <span className="text-cyber-dim">Total loss of products, transaction history, or customer profile records.</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5 bg-cyber-red/5 border border-cyber-red/20 rounded-lg p-3">
            <DatabaseZap className="w-4 h-4 text-cyber-red shrink-0" />
            <div>
              <span className="text-cyber-title font-bold uppercase block mb-0.5">Schema integrity collapse</span>
              <span className="text-cyber-dim">Foreign-key references and constraints fail, corrupting relational structures.</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5 bg-cyber-red/5 border border-cyber-red/20 rounded-lg p-3">
            <ServerCrash className="w-4 h-4 text-cyber-red shrink-0" />
            <div>
              <span className="text-cyber-title font-bold uppercase block mb-0.5">Extended service downtime</span>
              <span className="text-cyber-dim">Web application remains offline until engineers rebuild catalog tables.</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5 bg-cyber-red/5 border border-cyber-red/20 rounded-lg p-3">
            <AlertTriangle className="w-4 h-4 text-cyber-red shrink-0" />
            <div>
              <span className="text-cyber-title font-bold uppercase block mb-0.5">Costly recovery checks</span>
              <span className="text-cyber-dim">Requires rollback restoration tests, which may leak transaction gaps.</span>
            </div>
          </div>
        </div>
      </div>

      {/* 15. Section: How to secure the application */}
      <div className="bg-cyber-card border border-cyber-green/40 rounded-xl p-6 relative overflow-hidden space-y-4 w-full shadow-lg">
        <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-green animate-pulse" />
        <div className="flex items-center gap-2.5 border-b border-cyber-border/40 pb-3">
          <ShieldCheck className="w-4.5 h-4.5 text-cyber-green" />
          <h3 className="font-sans font-bold text-sm text-cyber-green tracking-wider uppercase">
            How to Prevent Destructive SQL Injection
          </h3>
        </div>

        <p className="text-sm text-cyber-text leading-relaxed text-justify">
          The primary defense against stacked command queries is using <strong>parameterized queries</strong>.
        </p>

        {/* Secure Code Snippet */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono text-cyber-dim block uppercase tracking-wider">
              1. Secure Parameterized Query
            </span>
            <span className="text-[9px] font-mono font-bold text-cyber-green border border-cyber-green/30 bg-cyber-green/5 px-2 py-0.5 rounded uppercase">
              PARAMETERIZED QUERY
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

result = db.execute(query, (product_id,))`} 
          />

          <p className="text-xs text-cyber-text leading-relaxed text-justify mt-2 pl-1">
            The SQL statement and the submitted value are passed separately. The database treats the payload as a literal value rather than executable SQL syntax. Characters such as quotes, semicolons, DROP TABLE, and SQL comments cannot change the query structure.
          </p>
        </div>

        {/* 16. Validate the expected identifier type */}
        <div className="space-y-2 pt-4 border-t border-cyber-border/30">
          <span className="text-xs font-bold font-mono text-cyber-dim block uppercase tracking-wider">
            2. Numeric Identifier Validation
          </span>

          <CodeBox 
            lang="Python" 
            code={`try:
    product_id = int(request.args.get("id"))
except (TypeError, ValueError):
    return {"error": "Invalid product ID"}, 400`} 
          />

          <p className="text-xs text-cyber-text leading-relaxed text-justify mt-2 pl-1">
            If the application expects an integer identifier, convert and validate the value before performing the query. Type validation is an additional control. It does not replace parameterized queries.
          </p>
        </div>

        {/* 17. Disable multi-statement execution */}
        <div className="space-y-2 pt-4 border-t border-cyber-border/30 font-mono text-xs">
          <span className="text-xs font-bold text-cyber-dim block uppercase tracking-wider">
            3. Disable Stacked Queries in Driver Config
          </span>
          <p className="text-xs text-cyber-text leading-relaxed text-justify font-sans">
            Do not enable database-driver options that permit multiple SQL statements unless the application has a specific and justified need. Disabling stacked statements reduces the attack surface, but it is only a defense-in-depth measure. Unsafe concatenated queries must still be fixed.
          </p>
        </div>

        {/* 18. Apply least-privilege database permissions */}
        <div className="space-y-2 pt-4 border-t border-cyber-border/30 font-mono text-xs">
          <span className="text-xs font-bold text-cyber-dim block uppercase tracking-wider">
            4. Least-Privilege Database Account Permissions
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="bg-cyber-black/35 border border-cyber-border rounded-lg p-3">
              <span className="text-cyber-green font-bold text-[9px] uppercase tracking-wider block mb-1">Permitted Operations</span>
              <div>✓ SELECT products</div>
              <div>✓ INSERT orders</div>
              <div>✓ UPDATE inventory</div>
            </div>
            <div className="bg-cyber-red/5 border border-cyber-red/20 rounded-lg p-3">
              <span className="text-cyber-red font-bold text-[9px] uppercase tracking-wider block mb-1">Restricted Administrative Commands</span>
              <div>✗ DROP TABLE (no permission)</div>
              <div>✗ ALTER SCHEMA (no permission)</div>
              <div>✗ CREATE INDEX (no permission)</div>
            </div>
          </div>
          <p className="text-xs text-cyber-text leading-relaxed text-justify mt-2 font-sans font-bold">
            The web application database account should not have schema-administration permissions. Even if SQL Injection occurs, a least-privilege account can reduce the damage.
          </p>
        </div>

        {/* 19. Vulnerable versus secure flow */}
        <div className="space-y-2 pt-4 border-t border-cyber-border/30">
          <span className="text-xs font-bold font-mono text-cyber-dim block uppercase tracking-wider">
            Vulnerable vs Secure Query Flow Comparison
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-cyber-red/5 border border-cyber-red/20 rounded-lg p-3">
              <span className="text-cyber-red font-bold text-[9px] uppercase tracking-wider block mb-1">Vulnerable flow</span>
              <p className="text-cyber-dim leading-relaxed">
                SQL command + raw product ID<br />
                → attacker appends a semicolon and DROP TABLE<br />
                → database may execute a destructive second statement
              </p>
            </div>
            <div className="bg-cyber-green/5 border border-cyber-green/20 rounded-lg p-3">
              <span className="text-cyber-green font-bold text-[9px] uppercase tracking-wider block mb-1">Secure flow</span>
              <p className="text-cyber-title font-semibold leading-relaxed">
                Fixed SQL command + bound product ID<br />
                → payload remains a value<br />
                → destructive SQL is never parsed as a command
              </p>
            </div>
          </div>
        </div>

        {/* 20. Vulnerable versus secure comparison table */}
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
                  <td className="p-3 pl-4 text-cyber-text">Raw input concatenated into SQL string</td>
                  <td className="p-3 pr-4 text-cyber-text">Bound query parameter values</td>
                </tr>
                <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                  <td className="p-3 pl-4 text-cyber-text">Semicolons may append stacked commands</td>
                  <td className="p-3 pr-4 text-cyber-text">Input cannot change query structure</td>
                </tr>
                <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                  <td className="p-3 pl-4 text-cyber-text">Database account has broad privileges (e.g. DBA)</td>
                  <td className="p-3 pr-4 text-cyber-text">Least-privilege database account configuration</td>
                </tr>
                <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                  <td className="p-3 pl-4 text-cyber-text">Multi-statement execution enabled</td>
                  <td className="p-3 pr-4 text-cyber-text">Unnecessary multi-statements disabled in driver</td>
                </tr>
                <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                  <td className="p-3 pl-4 text-cyber-text">Destructive commands may execute directly</td>
                  <td className="p-3 pr-4 text-cyber-text">Schema commands are not permitted by user</td>
                </tr>
                <tr className="hover:bg-cyber-blue/5">
                  <td className="p-3 pl-4 text-cyber-text">No data recovery preparation active</td>
                  <td className="p-3 pr-4 text-cyber-text">Tested backup and recovery restoration processes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 21. Additional defensive measures */}
      <div className="space-y-4">
        <span className="text-xs font-bold font-mono text-cyber-dim block uppercase tracking-wider">
          Additional Defense-In-Depth Measures
        </span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 space-y-2 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-blue" />
              <span className="font-bold text-cyber-title uppercase block mb-1">1. Parameterize queries</span>
              <p className="text-cyber-dim leading-relaxed">
                Never build SQL statements by concatenating raw user inputs into command strings.
              </p>
            </div>
          </div>

          <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 space-y-2 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-blue" />
              <span className="font-bold text-cyber-title uppercase block mb-1">2. Use least privilege</span>
              <p className="text-cyber-dim leading-relaxed">
                Remove DROP, ALTER, CREATE, and unnecessary DELETE permissions from the app database account.
              </p>
            </div>
          </div>

          <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 space-y-2 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-blue" />
              <span className="font-bold text-cyber-title uppercase block mb-1">3. Validate input types</span>
              <p className="text-cyber-dim leading-relaxed">
                Reject values that do not match the expected integer identifier or alphanumeric format.
              </p>
            </div>
          </div>

          <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 space-y-2 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-blue" />
              <span className="font-bold text-cyber-title uppercase block mb-1">4. Disable stacked queries</span>
              <p className="text-cyber-dim leading-relaxed">
                Disable unnecessary multi-statement or batch-query support options in the database driver.
              </p>
            </div>
          </div>

          <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 space-y-2 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-blue" />
              <span className="font-bold text-cyber-title uppercase block mb-1">5. Use tested backups</span>
              <p className="text-cyber-dim leading-relaxed">
                Maintain regular offline backups and verify that database restoration procedures work.
              </p>
            </div>
          </div>

          <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 space-y-2 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-blue" />
              <span className="font-bold text-cyber-title uppercase block mb-1">6. Monitor SQL patterns</span>
              <p className="text-cyber-dim leading-relaxed">
                Alert on suspicious inputs containing schema-modification keywords, semicolons, or comments.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-cyber-blue/5 border border-cyber-blue/20 rounded-lg p-3 font-mono text-[11px] text-cyber-blue-light text-center">
          💡 <strong>Note:</strong> Monitoring and keyword detection are secondary controls. They do not replace secure query construction.
        </div>
      </div>

      {/* 22. Explain why keyword blocking is insufficient */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-3 w-full font-mono">
        <div className="flex items-center gap-2 border-b border-cyber-border/40 pb-3">
          <ShieldAlert className="w-4.5 h-4.5 text-[#ffbd2e]" />
          <h3 className="font-sans font-bold text-sm text-cyber-title tracking-wider uppercase">
            Why not simply block DROP TABLE?
          </h3>
        </div>
        <p className="text-xs text-cyber-dim leading-relaxed text-justify">
          Keyword blacklists are unreliable because database syntax can vary and attackers may use capitalization changes, comments, encoding, alternative destructive statements, or other database features. The correct defense is to prevent user input from becoming executable SQL code and to remove destructive database privileges from the application account.
        </p>
        <div className="bg-cyber-black/40 border border-cyber-border rounded p-3 text-[11px] text-cyber-title text-center font-bold">
          Do not attempt to recognize every dangerous SQL command. Make all submitted input non-executable.
        </div>
      </div>

      {/* 23. Recovery and resilience section */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-3 w-full font-mono">
        <div className="flex items-center gap-2 border-b border-cyber-border/40 pb-3">
          <CheckCircle2 className="w-4.5 h-4.5 text-cyber-blue" />
          <h3 className="font-sans font-bold text-sm text-cyber-title tracking-wider uppercase">
            Security also includes recovery
          </h3>
        </div>
        <p className="text-xs text-cyber-dim leading-relaxed text-justify">
          Preventive controls are essential, but organizations must also prepare for database corruption, operator mistakes, software bugs, and successful attacks. A robust security posture must configure:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-[10px] text-cyber-dim text-center">
          <div className="bg-cyber-black/30 p-2 border border-cyber-border rounded">Automated backups</div>
          <div className="bg-cyber-black/30 p-2 border border-cyber-border rounded">Isolated storage</div>
          <div className="bg-cyber-black/30 p-2 border border-cyber-border rounded">Regular restore tests</div>
          <div className="bg-cyber-black/30 p-2 border border-cyber-border rounded">Recovery-point (RPO)</div>
          <div className="bg-cyber-black/30 p-2 border border-cyber-border rounded">Recovery-time (RTO)</div>
          <div className="bg-cyber-black/30 p-2 border border-cyber-border rounded">Audit transaction logs</div>
        </div>
      </div>

      {/* 24. Final learning summary */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full font-mono">
        <div className="flex items-center gap-2 border-b border-cyber-border/40 pb-3">
          <ShieldCheck className="w-4.5 h-4.5 text-cyber-blue" />
          <h3 className="font-sans font-bold text-sm text-cyber-title tracking-wider uppercase">
            Key Takeaways
          </h3>
        </div>

        <ul className="list-disc list-inside space-y-2 text-xs text-cyber-dim leading-relaxed">
          <li>
            <strong className="text-cyber-title">Destructive attack:</strong> Drop Table SQL Injection is a destructive form of SQL Injection.
          </li>
          <li>
            <strong className="text-cyber-title">Stacked queries:</strong> The payload closes the original value, ends the statement, and appends a destructive command.
          </li>
          <li>
            <strong className="text-cyber-title">Multi-execution:</strong> Stacked queries may allow multiple SQL statements to execute in one database call.
          </li>
          <li>
            <strong className="text-cyber-title">Catalog wipe:</strong> A real DROP TABLE command can delete both a table definition and its data.
          </li>
          <li>
            <strong className="text-cyber-title">Lab safety check:</strong> This educational lab must simulate the attack and preserve the products table.
          </li>
          <li>
            <strong className="text-cyber-title">Command template:</strong> Parameterized queries prevent user input from becoming executable SQL commands.
          </li>
          <li>
            <strong className="text-cyber-title">Surface reduction:</strong> Least privilege and disabling unnecessary multi-statement execution reduce potential damage.
          </li>
          <li>
            <strong className="text-cyber-title">Resilience planning:</strong> Backups, monitoring, validation, and recovery testing provide additional protection.
          </li>
        </ul>
      </div>

      {/* 25. Simulator call-to-action */}
      <div className="bg-cyber-card border border-cyber-border/70 rounded-2xl p-8 text-center space-y-5 shadow-2xl relative overflow-hidden w-full">
        <span className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyber-blue to-transparent" />
        <h3 className="font-sans font-extrabold text-lg text-cyber-title tracking-wider uppercase">
          Test the Drop Table Payload Safely
        </h3>
        <p className="text-sm text-cyber-text text-justify leading-relaxed max-w-2xl mx-auto font-sans">
          Use the Drop Table simulator to observe how the payload can terminate the original query and append a destructive SQL statement. For safety, the local lab must detect the vulnerability without deleting the products table.
        </p>
        <div className="pt-2">
          <Link
            to="/attacks/drop-table"
            className="inline-flex items-center gap-2 bg-[#ff3a3a] hover:bg-[#ff6060] text-white px-8 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_20px_rgba(255,58,58,0.3)] hover:shadow-[0_0_30px_rgba(255,58,58,0.5)] transform hover:-translate-y-0.5"
          >
            <Terminal className="w-4 h-4" />
            Launch Drop Table Simulator
          </Link>
        </div>
      </div>

    </div>
  );
}
