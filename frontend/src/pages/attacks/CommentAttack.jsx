import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Database, ShieldAlert, CheckCircle2, XCircle, AlertTriangle, Check, ShieldCheck, Terminal } from 'lucide-react';

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
    const pyKeywords = ['if', 'not', 'in', 'return', 'def', 'import', 'from', 'for', 'class', 'else', 'try', 'except', 'and'];
    pyKeywords.forEach(kw => {
      const regex = new RegExp(`\\b(${kw})\\b`, 'g');
      escaped = escaped.replace(regex, '<span class="text-cyber-blue font-bold">$1</span>');
    });

    // 4. Highlight variables
    const vars = ['username', 'password', 'query', 'user', 'db', 'result', 'password_hash'];
    vars.forEach(v => {
      const regex = new RegExp(`\\b(${v})\\b`, 'g');
      escaped = escaped.replace(regex, '<span class="text-code-variable font-semibold">$1</span>');
    });

    // 5. Highlight functions, methods, builtins
    escaped = escaped.replace(/\b(request\.form\.get|db\.execute|\.fetchone|check_password_hash|login_user)\b/g, '<span class="text-code-function font-semibold">$1</span>');

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
      'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'UNION', 'LIMIT', 'TRUE', 'FALSE'
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

export default function CommentAttack() {
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
          SQL Comment <span className="text-cyber-blue">Attack</span>
        </h1>
        <p className="text-cyber-text text-sm text-justify w-full leading-relaxed font-medium">
          Learn how SQL comment markers can remove the remaining part of a vulnerable query and bypass intended application conditions.
        </p>
        <div className="pt-1">
          <span className="inline-flex items-center text-[9px] font-mono font-bold tracking-wider text-cyber-blue border border-cyber-blue/30 bg-cyber-blue/5 px-2.5 py-0.5 rounded uppercase">
            QUERY TRUNCATION TECHNIQUE
          </span>
        </div>
      </div>

      {/* 2. Section: What is an SQL Comment Attack? */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2.5 border-b border-cyber-border/40 pb-3">
          <ShieldAlert className="w-4.5 h-4.5 text-cyber-blue" />
          <h3 className="font-sans font-bold text-sm text-cyber-title tracking-wider uppercase">
            What is an SQL Comment Attack?
          </h3>
        </div>
        <div className="space-y-3 text-sm text-cyber-text leading-relaxed text-justify">
          <p>
            An SQL Comment Attack occurs when an attacker injects SQL comment syntax into a vulnerable query to make the database ignore the remaining characters of the original statement.
          </p>
          <p>
            Comment markers are normally used by developers to add notes inside SQL code. In an injection attack, they may be abused to remove password checks, closing quotes, filters, or other security conditions from the executed query.
          </p>
          <p className="text-xs text-cyber-dim font-sans italic border-l-2 border-cyber-blue/50 pl-3 mt-2">
            <strong>Note:</strong> The comment marker does not create the vulnerability by itself. The vulnerability begins when raw user input is allowed to become part of the SQL syntax.
          </p>
        </div>

        {/* Info Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-cyber-border/30 text-xs font-mono">
          <div className="bg-cyber-black/30 border border-cyber-border/50 rounded-lg p-2.5">
            <span className="text-cyber-dim font-bold block uppercase text-[9px] tracking-wider mb-0.5">Cause</span>
            <span className="text-cyber-title font-bold">User input is inserted directly into SQL</span>
          </div>
          <div className="bg-cyber-black/30 border border-cyber-border/50 rounded-lg p-2.5">
            <span className="text-cyber-dim font-bold block uppercase text-[9px] tracking-wider mb-0.5">Attacker Goal</span>
            <span className="text-cyber-red font-bold">Ignore the remaining part of the original query</span>
          </div>
          <div className="bg-cyber-black/30 border border-cyber-border/50 rounded-lg p-2.5">
            <span className="text-cyber-dim font-bold block uppercase text-[9px] tracking-wider mb-0.5">Possible Impact</span>
            <span className="text-cyber-red font-bold">Authentication bypass or filter bypass</span>
          </div>
        </div>
      </div>

      {/* 3. Section: Understand SQL comments */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2.5 border-b border-cyber-border/40 pb-3">
          <Database className="w-4.5 h-4.5 text-cyber-blue" />
          <h3 className="font-sans font-bold text-sm text-cyber-title tracking-wider uppercase">
            How do SQL comments work?
          </h3>
        </div>

        <p className="text-sm text-cyber-text leading-relaxed text-justify">
          SQL databases support comment syntax to allow developers to include documentation notes inside queries. Anything marked as a comment is ignored by the database compiler at run-time. Common markers include:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="bg-cyber-black/30 border border-cyber-border rounded-xl p-4 space-y-1">
            <span className="text-cyber-blue font-bold text-[9px] uppercase tracking-wider block">Single-line comment</span>
            <code className="text-cyber-title font-bold bg-cyber-input px-1.5 py-0.5 rounded font-mono">--</code>
            <p className="text-[10px] text-cyber-dim leading-normal pt-1">
              Ignores everything to the end of the line. Commonly requires a space directly after it.
            </p>
          </div>
          <div className="bg-cyber-black/30 border border-cyber-border rounded-xl p-4 space-y-1">
            <span className="text-cyber-blue font-bold text-[9px] uppercase tracking-wider block">Alternative single-line</span>
            <code className="text-cyber-title font-bold bg-cyber-input px-1.5 py-0.5 rounded font-mono">#</code>
            <p className="text-[10px] text-cyber-dim leading-normal pt-1">
              Ignores everything to the end of the line. Supported by some engines like MySQL.
            </p>
          </div>
          <div className="bg-cyber-black/30 border border-cyber-border rounded-xl p-4 space-y-1">
            <span className="text-cyber-blue font-bold text-[9px] uppercase tracking-wider block">Block comment</span>
            <code className="text-cyber-title font-bold bg-cyber-input px-1.5 py-0.5 rounded font-mono">/* ... */</code>
            <p className="text-[10px] text-cyber-dim leading-normal pt-1">
              Ignores all characters enclosed inside the markers. Can be injected inline.
            </p>
          </div>
        </div>

        <p className="text-xs text-cyber-dim italic pl-1">
          * <strong>Compatibility note:</strong> Comment syntax differs between database engines. The local lab should demonstrate only the syntax supported by its actual database and driver.
        </p>

        {/* Comment Query Example */}
        <div className="space-y-1.5 pt-2">
          <span className="text-xs font-bold font-mono text-cyber-dim block uppercase tracking-wider">Example Ignored Condition Query</span>
          <CodeBox 
            lang="SQL" 
            code={`SELECT id, username
FROM users
WHERE username = 'admin'
-- AND account_disabled = 0;`} 
          />
          <p className="text-xs text-cyber-text leading-relaxed pl-1">
            Everything after the comment marker <code className="text-cyber-blue font-mono font-bold">--</code> is ignored by the database query analyzer.
          </p>
        </div>

        <div className="pt-1">
          <span className="inline-flex items-center text-[9px] font-mono font-bold tracking-wider text-cyber-blue border border-cyber-blue/30 bg-cyber-blue/5 px-2.5 py-0.5 rounded uppercase">
            COMMENTED SQL IS NOT EXECUTED
          </span>
        </div>
      </div>

      {/* 4. Vulnerable login scenario */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2.5 border-b border-cyber-border/40 pb-3">
          <ShieldAlert className="w-4.5 h-4.5 text-cyber-red animate-pulse" />
          <h3 className="font-sans font-bold text-sm text-cyber-title tracking-wider uppercase">
            Vulnerable Golimar Store Login Query
          </h3>
        </div>

        <p className="text-sm text-cyber-text leading-relaxed text-justify">
          Imagine that the Golimar Store application receives a username and password and directly inserts both values into an authentication query.
        </p>

        {/* Users Table Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono text-cyber-dim block uppercase tracking-wider">
              Database Table: <code className="text-cyber-title bg-cyber-input px-1.5 py-0.5 rounded font-mono font-medium">users</code>
            </span>
          </div>
          <div className="overflow-x-auto border border-cyber-border rounded-lg bg-cyber-input">
            <table className="w-full border-collapse text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-cyber-border bg-cyber-card text-cyber-dim">
                  <th className="p-3 font-bold pl-4">id</th>
                  <th className="p-3 font-bold">username</th>
                  <th className="p-3 font-bold">password_hash</th>
                  <th className="p-3 font-bold">role</th>
                  <th className="p-3 font-bold pr-4">active</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5 bg-cyber-red/5">
                  <td className="p-3 pl-4 text-cyber-dim">1</td>
                  <td className="p-3 text-cyber-title font-extrabold">admin</td>
                  <td className="p-3 text-cyber-red font-semibold">hashed_admin_password</td>
                  <td className="p-3 text-cyber-text">administrator</td>
                  <td className="p-3 pr-4 text-cyber-text flex items-center justify-between">
                    <span>1</span>
                    <span className="text-[8px] border border-cyber-red/40 bg-cyber-red/10 px-2 py-0.5 rounded text-cyber-red font-bold shrink-0">PRIVILEGED ACCOUNT</span>
                  </td>
                </tr>
                <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                  <td className="p-3 pl-4 text-cyber-dim">2</td>
                  <td className="p-3 text-cyber-title font-semibold">alice</td>
                  <td className="p-3 text-cyber-dim">hashed_alice_password</td>
                  <td className="p-3 text-cyber-text">customer</td>
                  <td className="p-3 pr-4 text-cyber-text">1</td>
                </tr>
                <tr className="hover:bg-cyber-blue/5">
                  <td className="p-3 pl-4 text-cyber-dim">3</td>
                  <td className="p-3 text-cyber-title font-semibold">bob</td>
                  <td className="p-3 text-cyber-dim">hashed_bob_password</td>
                  <td className="p-3 text-cyber-text">customer</td>
                  <td className="p-3 pr-4 text-cyber-text">0</td>
                </tr>
              </tbody>
            </table>
          </div>
          <span className="text-[10px] text-cyber-dim block font-sans italic mt-1 pl-1">
            * The application should return a user only when the username, password, and active status all satisfy the intended conditions.
          </span>
        </div>

        {/* 5. Show the vulnerable backend code */}
        <div className="space-y-2 pt-4 border-t border-cyber-border/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono text-cyber-dim uppercase tracking-wider">
              Vulnerable Python authentication code
            </span>
            <span className="text-[9px] font-mono font-bold text-cyber-red border border-cyber-red/30 bg-cyber-red/5 px-2 py-0.5 rounded uppercase">
              UNSAFE AUTHENTICATION QUERY
            </span>
          </div>

          <CodeBox 
            lang="Python" 
            code={`username = request.form.get("username")
password = request.form.get("password")

query = (
    "SELECT id, username, role "
    "FROM users "
    "WHERE username = '" + username + "' "
    "AND password = '" + password + "' "
    "AND active = 1"
)

user = db.execute(query).fetchone()`} 
          />

          <p className="text-xs text-cyber-text leading-relaxed text-justify mt-2 pl-1">
            The username and password are concatenated directly into the SQL statement. This allows input containing quotes and comment markers to modify which conditions are actually evaluated.
          </p>

          <div className="bg-cyber-red/5 border border-cyber-red/20 rounded-lg p-2.5 font-mono text-xs text-cyber-red/90 mt-2 text-center space-y-1">
            <span className="font-extrabold uppercase text-[10px] tracking-wider block">Unsafe Interpolation Points:</span>
            <div className="space-x-2">
              <code className="bg-cyber-black/40 px-2 py-1 rounded inline-block font-mono">"WHERE username = '" + username + "'"</code>
              <code className="bg-cyber-black/40 px-2 py-1 rounded inline-block font-mono">"AND password = '" + password + "'"</code>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Show normal login behavior (Step 1) */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2 border-b border-cyber-border/40 pb-3">
          <div className="w-5 h-5 rounded-full bg-cyber-green/10 border border-cyber-green/30 flex items-center justify-center text-cyber-green text-[10px] font-bold font-mono">1</div>
          <h3 className="font-sans font-bold text-sm text-cyber-green tracking-wider uppercase">
            Step 1 — Normal login request
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="space-y-1.5">
            <span className="text-cyber-dim font-bold uppercase tracking-wider block">Username input</span>
            <div className="bg-cyber-input border border-cyber-border rounded-lg p-2.5 text-cyber-title font-bold">
              admin
            </div>
          </div>
          <div className="space-y-1.5">
            <span className="text-cyber-dim font-bold uppercase tracking-wider block">Password input</span>
            <div className="bg-cyber-input border border-cyber-border rounded-lg p-2.5 text-cyber-title font-bold">
              CorrectAdminPassword
            </div>
          </div>
          <div className="space-y-1.5">
            <span className="text-cyber-dim font-bold uppercase tracking-wider block">Result Outcome</span>
            <div className="bg-cyber-input border border-cyber-border rounded-lg p-2.5 text-cyber-green font-bold truncate">
              Authenticated user: admin | Role: administrator
            </div>
          </div>
        </div>

        <div className="space-y-1.5 font-mono text-xs">
          <span className="text-cyber-dim font-bold uppercase tracking-wider block">Generated SQL Query</span>
          <CodeBox 
            lang="SQL" 
            code={`SELECT id, username, role
FROM users
WHERE username = 'admin'
AND password = 'CorrectAdminPassword'
AND active = 1;`} 
          />
        </div>

        <div className="bg-cyber-green/5 border border-cyber-green/20 rounded-lg p-3 text-xs font-mono leading-relaxed">
          <p className="text-cyber-green font-medium">
            <strong>Result:</strong> All intended conditions are evaluated. The user is authenticated only when the username, password, and active status match.
          </p>
        </div>
      </div>

      {/* 7. Show incorrect login behavior (Step 2) */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2 border-b border-cyber-border/40 pb-3">
          <div className="w-5 h-5 rounded-full bg-cyber-red/10 border border-cyber-red/30 flex items-center justify-center text-cyber-red text-[10px] font-bold font-mono">2</div>
          <h3 className="font-sans font-bold text-sm text-cyber-red tracking-wider uppercase">
            Step 2 — Incorrect password
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="space-y-1.5">
            <span className="text-cyber-dim font-bold uppercase tracking-wider block">Username input</span>
            <div className="bg-cyber-input border border-cyber-border rounded-lg p-2.5 text-cyber-title font-bold">
              admin
            </div>
          </div>
          <div className="space-y-1.5">
            <span className="text-cyber-dim font-bold uppercase tracking-wider block">Password input</span>
            <div className="bg-cyber-input border border-cyber-border rounded-lg p-2.5 text-cyber-red font-bold">
              wrongpassword
            </div>
          </div>
          <div className="space-y-1.5">
            <span className="text-cyber-dim font-bold uppercase tracking-wider block">Result Outcome</span>
            <div className="bg-cyber-input border border-cyber-border rounded-lg p-2.5 text-cyber-red font-bold truncate">
              Authentication failed
            </div>
          </div>
        </div>

        <div className="space-y-1.5 font-mono text-xs">
          <span className="text-cyber-dim font-bold uppercase tracking-wider block">Generated SQL Query</span>
          <CodeBox 
            lang="SQL" 
            code={`SELECT id, username, role
FROM users
WHERE username = 'admin'
AND password = 'wrongpassword'
AND active = 1;`} 
          />
        </div>

        <div className="bg-cyber-red/5 border border-cyber-red/20 rounded-lg p-3 text-xs font-mono leading-relaxed">
          <p className="text-cyber-red font-medium">
            <strong>Result:</strong> The password condition is false, so no user record is returned.
          </p>
        </div>
      </div>

      {/* 8. Show the comment-based payload (Step 3) */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2 border-b border-cyber-border/40 pb-3">
          <div className="w-5 h-5 rounded-full bg-cyber-red/10 border border-cyber-red/30 flex items-center justify-center text-cyber-red text-[10px] font-bold font-mono">3</div>
          <h3 className="font-sans font-bold text-sm text-cyber-red tracking-wider uppercase">
            Step 3 — Injected comment request
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="space-y-1.5">
            <span className="text-cyber-dim font-bold uppercase tracking-wider block">Injected username</span>
            <div className="bg-cyber-input border border-cyber-border rounded-lg p-2.5 text-cyber-red font-bold select-all">
              admin' --
            </div>
          </div>
          <div className="space-y-1.5">
            <span className="text-cyber-dim font-bold uppercase tracking-wider block">Submitted password</span>
            <div className="bg-cyber-input border border-cyber-border rounded-lg p-2.5 text-cyber-dim font-bold">
              Any value
            </div>
          </div>
          <div className="space-y-1.5">
            <span className="text-cyber-dim font-bold uppercase tracking-wider block">Observed SQL Query</span>
            <div className="bg-cyber-input border border-cyber-border rounded-lg p-2.5 text-cyber-red font-bold truncate">
              Truncation triggered
            </div>
          </div>
        </div>

        <div className="space-y-1.5 font-mono text-xs">
          <span className="text-cyber-dim font-bold uppercase tracking-wider block">Combined Transformed SQL Query</span>
          <CodeBox 
            lang="SQL" 
            code={`SELECT id, username, role
FROM users
WHERE username = 'admin' --'
AND password = 'Any value'
AND active = 1;`} 
          />
          <span className="text-[10px] text-cyber-dim block font-sans italic pl-1 mt-1">
            * The exact required whitespace after <code className="text-cyber-red font-mono bg-cyber-input px-1 rounded font-bold">--</code> depends on the database engine. Preserve the syntax that works in the local lab.
          </span>
        </div>

        {/* 9. Break down the payload */}
        <div className="space-y-2 pt-2 border-t border-cyber-border/30">
          <span className="text-xs font-bold font-mono text-cyber-dim block uppercase tracking-wider">
            Payload Breakdown Structure
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
            <div className="bg-cyber-black/40 border border-cyber-border rounded-lg p-3 relative overflow-hidden space-y-1">
              <span className="absolute top-0 left-0 bottom-0 w-[3px] bg-cyber-blue" />
              <span className="text-cyber-blue font-bold text-[9px] uppercase block">Part 1</span>
              <code className="text-cyber-title font-bold bg-cyber-input px-1.5 py-0.5 rounded font-mono">admin</code>
              <p className="text-[10px] text-cyber-dim leading-relaxed">
                Targets the administrator username string.
              </p>
            </div>
            <div className="bg-cyber-black/40 border border-cyber-border rounded-lg p-3 relative overflow-hidden space-y-1">
              <span className="absolute top-0 left-0 bottom-0 w-[3px] bg-cyber-blue" />
              <span className="text-cyber-blue font-bold text-[9px] uppercase block">Part 2</span>
              <code className="text-cyber-title font-bold bg-cyber-input px-1.5 py-0.5 rounded font-mono">'</code>
              <p className="text-[10px] text-cyber-dim leading-relaxed">
                Closes the original username query string quote.
              </p>
            </div>
            <div className="bg-cyber-black/40 border border-cyber-border rounded-lg p-3 relative overflow-hidden space-y-1">
              <span className="absolute top-0 left-0 bottom-0 w-[3px] bg-cyber-red" />
              <span className="text-cyber-red font-bold text-[9px] uppercase block">Part 3</span>
              <code className="text-cyber-red font-bold bg-cyber-input px-1.5 py-0.5 rounded font-mono">--</code>
              <p className="text-[10px] text-cyber-dim leading-relaxed">
                Starts a single-line SQL comment sequence.
              </p>
            </div>
            <div className="bg-cyber-black/40 border border-cyber-border rounded-lg p-3 relative overflow-hidden space-y-1 opacity-60">
              <span className="absolute top-0 left-0 bottom-0 w-[3px] bg-cyber-dim" />
              <span className="text-cyber-dim font-bold text-[9px] uppercase block">Part 4</span>
              <code className="text-cyber-dim font-bold bg-cyber-input px-1.5 py-0.5 rounded font-mono">password &amp; active checks</code>
              <p className="text-[10px] text-cyber-dim leading-relaxed line-through">
                Ignored by the database parser at execute time.
              </p>
            </div>
          </div>
        </div>

        {/* 10. Show the effective executed query */}
        <div className="space-y-2 pt-4 border-t border-cyber-border/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono text-cyber-dim block uppercase tracking-wider">
              What query does the database effectively evaluate?
            </span>
            <span className="text-[9px] font-mono font-bold text-cyber-red border border-cyber-red/30 bg-cyber-red/5 px-2 py-0.5 rounded uppercase">
              SECURITY CONDITIONS REMOVED
            </span>
          </div>

          <CodeBox 
            lang="SQL" 
            code={`SELECT id, username, role
FROM users
WHERE username = 'admin'
-- AND password = 'Any value'
-- AND active = 1;`} 
          />

          <div className="bg-cyber-red/5 border border-cyber-red/20 rounded-lg p-2.5 font-mono text-xs text-cyber-red/90 mt-2 text-center">
            <span className="font-extrabold uppercase text-[10px] tracking-wider block mb-1">Effective Condition Executed:</span>
            <code className="bg-cyber-black/40 px-2 py-1 rounded inline-block font-mono font-bold">
              WHERE username = 'admin'
            </code>
            <p className="text-xs text-cyber-dim leading-relaxed pt-2">
              The password and active-account checks are no longer part of the executable query.
            </p>
          </div>
        </div>

        {/* 11. Explain why the attack works */}
        <div className="space-y-2 pt-4 border-t border-cyber-border/30">
          <span className="text-xs font-bold font-mono text-cyber-dim block uppercase tracking-wider">
            Why does the comment attack work?
          </span>
          <p className="text-sm text-cyber-text leading-relaxed text-justify">
            The attacker first closes the original username string with an apostrophe. The comment marker then causes the database to ignore everything that follows on the same line. Because the ignored section contains the password and account-status checks, the database may return the admin record based only on the username.
          </p>

          <div className="max-w-md mx-auto py-2 font-mono text-xs text-center space-y-2">
            <div className="bg-cyber-card/85 border border-cyber-border p-2 rounded-lg">
              Raw username input
            </div>
            <div className="text-cyber-dim font-bold">↓</div>
            <div className="bg-cyber-red/5 border border-cyber-red/20 p-2 rounded-lg text-cyber-red font-bold">
              Original string is closed
            </div>
            <div className="text-cyber-dim font-bold">↓</div>
            <div className="bg-cyber-red/5 border border-cyber-red/20 p-2 rounded-lg text-cyber-red font-bold">
              Comment marker begins
            </div>
            <div className="text-cyber-dim font-bold">↓</div>
            <div className="bg-cyber-red/10 border border-cyber-red/20 p-2 rounded-lg text-cyber-red font-bold">
              Password condition is ignored
            </div>
            <div className="text-cyber-dim font-bold">↓</div>
            <div className="bg-cyber-green/10 border border-cyber-green/20 p-2 rounded-lg text-cyber-green font-bold">
              User record returned &amp; Authenticated
            </div>
          </div>

          <p className="text-sm text-cyber-text leading-relaxed text-justify font-bold mt-2">
            The attack succeeds because the application trusts a returned row as proof of authentication.
          </p>
        </div>

        {/* 12. Show the authentication impact */}
        <div className="space-y-2 pt-4 border-t border-cyber-border/30 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-cyber-dim font-bold uppercase tracking-wider block">Authentication Bypass Result</span>
            <span className="text-[9px] font-mono font-bold text-cyber-red border border-cyber-red/30 bg-cyber-red/5 px-2 py-0.5 rounded uppercase">
              PASSWORD CHECK BYPASSED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="bg-cyber-red/5 border border-cyber-red/25 rounded-xl p-4 space-y-1">
              <span className="text-cyber-dim block uppercase text-[9px] tracking-wider mb-0.5">Database returns:</span>
              <div className="text-cyber-red font-bold text-sm">admin → administrator</div>
            </div>
            <div className="bg-cyber-red/5 border border-cyber-red/25 rounded-xl p-4 space-y-1">
              <span className="text-cyber-dim block uppercase text-[9px] tracking-wider mb-0.5">Application Outcome:</span>
              <div className="text-cyber-red font-bold text-sm">Session generated successfully</div>
            </div>
          </div>
          <p className="text-xs text-cyber-dim leading-relaxed font-sans pt-1">
            * The attacker did not know or recover the real password. The password condition was removed from the executed query.
          </p>
        </div>
      </div>

      {/* 13. Explain comment attacks beyond login forms */}
      <div className="space-y-4">
        <span className="text-xs font-bold font-mono text-cyber-dim block uppercase tracking-wider">
          Comment attacks are not limited to login pages
        </span>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 space-y-2 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-blue" />
              <span className="font-bold text-cyber-title uppercase block mb-1">Product Filtering</span>
              <code className="text-cyber-red font-bold bg-cyber-input px-1.5 py-0.5 rounded font-mono text-[10px]">category = 'electronics' -- AND visible = 1</code>
              <p className="text-cyber-dim leading-relaxed text-[10px] pt-1.5">
                A visibility restriction check may be ignored.
              </p>
            </div>
          </div>

          <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 space-y-2 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-blue" />
              <span className="font-bold text-cyber-title uppercase block mb-1">Account Lookup</span>
              <code className="text-cyber-red font-bold bg-cyber-input px-1.5 py-0.5 rounded font-mono text-[10px]">username = 'alice' -- AND tenant_id = 5</code>
              <p className="text-cyber-dim leading-relaxed text-[10px] pt-1.5">
                A tenant-isolation condition may be removed.
              </p>
            </div>
          </div>

          <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 space-y-2 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-blue" />
              <span className="font-bold text-cyber-title uppercase block mb-1">Order Access</span>
              <code className="text-cyber-red font-bold bg-cyber-input px-1.5 py-0.5 rounded font-mono text-[10px]">order_id = 100 -- AND customer_id = 25</code>
              <p className="text-cyber-dim leading-relaxed text-[10px] pt-1.5">
                An ownership check may be ignored.
              </p>
            </div>
          </div>

          <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 space-y-2 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-blue" />
              <span className="font-bold text-cyber-title uppercase block mb-1">Administrative Actions</span>
              <code className="text-cyber-red font-bold bg-cyber-input px-1.5 py-0.5 rounded font-mono text-[10px]">user_id = 10 -- AND current_user_is_admin = 1</code>
              <p className="text-cyber-dim leading-relaxed text-[10px] pt-1.5">
                A privilege condition may be removed.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-cyber-blue/5 border border-cyber-blue/20 rounded-lg p-3 font-mono text-[11px] text-cyber-blue-light text-center">
          💡 Any condition placed after attacker-controlled input may become a target if the query is assembled unsafely.
        </div>
      </div>

      {/* 14. Explain SQL comment syntax differences */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2.5 border-b border-cyber-border/40 pb-3">
          <Terminal className="w-4.5 h-4.5 text-cyber-blue" />
          <h3 className="font-sans font-bold text-sm text-cyber-title tracking-wider uppercase">
            Database-specific comment behavior
          </h3>
        </div>

        <div className="overflow-x-auto border border-cyber-border rounded-lg bg-cyber-input">
          <table className="w-full border-collapse text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-cyber-border bg-cyber-card text-cyber-dim">
                <th className="p-3 font-bold pl-4">Comment syntax</th>
                <th className="p-3 font-bold">Common support</th>
                <th className="p-3 font-bold pr-4">Important detail</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                <td className="p-3 pl-4 text-cyber-title">`--`</td>
                <td className="p-3 text-cyber-text">Widely supported (standard SQL)</td>
                <td className="p-3 pr-4 text-cyber-dim">Some engines require a trailing space/character after it.</td>
              </tr>
              <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                <td className="p-3 pl-4 text-cyber-title">`#`</td>
                <td className="p-3 text-cyber-text">Supported by MySQL/MariaDB</td>
                <td className="p-3 pr-4 text-cyber-dim">Not portable across all database engines.</td>
              </tr>
              <tr className="hover:bg-cyber-blue/5">
                <td className="p-3 pl-4 text-cyber-title">`/* ... */`</td>
                <td className="p-3 text-cyber-text">Widely supported</td>
                <td className="p-3 pr-4 text-cyber-dim">Can comment a section inside a statement (inline).</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-cyber-dim font-sans italic pl-1">
          * An educational lab should demonstrate the syntax used by its actual database. Security must not depend on assuming that an attacker will use only one specific comment style.
        </p>
      </div>

      {/* 15. Security impact section */}
      <div className="bg-cyber-card border border-cyber-red/40 rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2.5 border-b border-cyber-border/40 pb-3">
          <ShieldAlert className="w-4.5 h-4.5 text-cyber-red animate-pulse" />
          <h3 className="font-sans font-bold text-sm text-cyber-red tracking-wider uppercase">
            Security Impact
          </h3>
        </div>
        
        <p className="text-sm text-cyber-text leading-relaxed text-justify">
          A successful SQL Comment Attack can remove important security conditions from an SQL query. Depending on the vulnerable endpoint, this may bypass authentication, expose hidden records, defeat tenant isolation, or ignore ownership checks.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs pt-1">
          <div className="flex items-start gap-2.5 bg-cyber-red/5 border border-cyber-red/20 rounded-lg p-3">
            <XCircle className="w-4 h-4 text-cyber-red shrink-0 font-bold" />
            <div>
              <span className="text-cyber-title font-bold uppercase block mb-0.5">Password verification bypass</span>
              <span className="text-cyber-dim">Allows logging into accounts without knowing passwords.</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5 bg-cyber-red/5 border border-cyber-red/20 rounded-lg p-3">
            <XCircle className="w-4 h-4 text-cyber-red shrink-0" />
            <div>
              <span className="text-cyber-title font-bold uppercase block mb-0.5">Disabled-account access</span>
              <span className="text-cyber-dim">Bypasses verification flags like active status or lockout checks.</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5 bg-cyber-red/5 border border-cyber-red/20 rounded-lg p-3">
            <XCircle className="w-4 h-4 text-cyber-red shrink-0" />
            <div>
              <span className="text-cyber-title font-bold uppercase block mb-0.5">Tenant-isolation bypass</span>
              <span className="text-cyber-dim">Removes query boundary clauses designed to segregate tenant profiles.</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5 bg-cyber-red/5 border border-cyber-red/20 rounded-lg p-3">
            <XCircle className="w-4 h-4 text-cyber-red shrink-0" />
            <div>
              <span className="text-cyber-title font-bold uppercase block mb-0.5">Ownership-check bypass</span>
              <span className="text-cyber-dim">Neutralizes constraints checking user ownership on accessed files.</span>
            </div>
          </div>
        </div>
      </div>

      {/* 16. Section: How to secure the application */}
      <div className="bg-cyber-card border border-cyber-green/40 rounded-xl p-6 relative overflow-hidden space-y-4 w-full shadow-lg">
        <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-green animate-pulse" />
        <div className="flex items-center gap-2.5 border-b border-cyber-border/40 pb-3">
          <ShieldCheck className="w-4.5 h-4.5 text-cyber-green" />
          <h3 className="font-sans font-bold text-sm text-cyber-green tracking-wider uppercase">
            How to Prevent SQL Comment Attacks
          </h3>
        </div>

        <p className="text-sm text-cyber-text leading-relaxed text-justify">
          The primary defense against comment injection is using <strong>parameterized queries</strong>, combined with password hashing logic inside the application codebase.
        </p>

        {/* Secure Code Snippet */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono text-cyber-dim block uppercase tracking-wider">
              1. Secure Parameterized Query
            </span>
            <span className="text-[9px] font-mono font-bold text-cyber-green border border-cyber-green/30 bg-cyber-green/5 px-2 py-0.5 rounded uppercase">
              PARAMETERIZED USER LOOKUP
            </span>
          </div>

          <CodeBox 
            lang="Python" 
            code={`username = request.form.get("username")

query = """
    SELECT id, username, password_hash, role, active
    FROM users
    WHERE username = ?
"""

user = db.execute(query, (username,)).fetchone()`} 
          />

          <p className="text-xs text-cyber-text leading-relaxed text-justify mt-2 pl-1">
            The username is passed separately from the SQL command. A value containing apostrophes or comment markers remains a literal data value. The comment marker cannot remove the remaining query conditions because it is never parsed as SQL syntax.
          </p>
        </div>

        {/* 17. Secure password verification */}
        <div className="space-y-2 pt-4 border-t border-cyber-border/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono text-cyber-dim block uppercase tracking-wider">
              2. Verify the Password Outside the SQL Query
            </span>
            <span className="text-[9px] font-mono font-bold text-cyber-green border border-cyber-green/30 bg-cyber-green/5 px-2 py-0.5 rounded uppercase">
              PASSWORD HASH VERIFICATION
            </span>
          </div>

          <CodeBox 
            lang="Python" 
            code={`from werkzeug.security import check_password_hash

if (
    user
    and user["active"] == 1
    and check_password_hash(user["password_hash"], password)
):
    login_user(user)
else:
    return {"error": "Invalid username or password"}, 401`} 
          />

          <p className="text-xs text-cyber-text leading-relaxed text-justify mt-2 pl-1">
            The application safely retrieves the user by username, verifies the account status, and checks the submitted password against a stored password hash.
          </p>
        </div>

        {/* 18. Show why parameterization makes comments harmless */}
        <div className="space-y-2 pt-4 border-t border-cyber-border/30">
          <span className="text-xs font-bold font-mono text-cyber-dim block uppercase tracking-wider">
            Why Parameterization Neutralizes Comments
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
            <div className="bg-cyber-black/35 border border-cyber-border rounded-lg p-2.5">
              <span className="text-cyber-dim font-bold block uppercase text-[8px] tracking-wider mb-0.5">Submitted Value</span>
              <span className="text-cyber-red font-bold">admin' --</span>
            </div>
            <div className="bg-cyber-red/5 border border-cyber-red/20 rounded-lg p-2.5">
              <span className="text-cyber-red font-bold block uppercase text-[8px] tracking-wider mb-0.5">Vulnerable interpretation</span>
              <span>Close the string and comment out the password condition</span>
            </div>
            <div className="bg-cyber-green/5 border border-cyber-green/20 rounded-lg p-2.5">
              <span className="text-cyber-green font-bold block uppercase text-[8px] tracking-wider mb-0.5">Secure interpretation</span>
              <span>Search for a literal username whose value is: <code className="text-cyber-green font-bold">admin' --</code></span>
            </div>
          </div>
          <p className="text-xs text-cyber-text leading-relaxed font-bold mt-2">
            The database does not treat `--` as a comment when it is supplied as a bound parameter. Comment characters are dangerous only when input is allowed to become SQL code.
          </p>
        </div>

        {/* 19. Secure authentication flow */}
        <div className="space-y-2 pt-4 border-t border-cyber-border/30">
          <span className="text-xs font-bold font-mono text-cyber-dim block uppercase tracking-wider">
            Secure Authentication Pipeline Flow
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 font-mono text-xs text-center">
            <div className="bg-cyber-black/40 border border-cyber-border rounded-lg p-2.5 flex flex-col justify-between">
              <span className="text-cyber-blue font-bold text-[9px] uppercase block mb-1">Step 1</span>
              <p className="text-[10px] text-cyber-dim leading-relaxed">
                Receive username &amp; password over HTTPS
              </p>
            </div>
            <div className="bg-cyber-black/40 border border-cyber-border rounded-lg p-2.5 flex flex-col justify-between">
              <span className="text-cyber-blue font-bold text-[9px] uppercase block mb-1">Step 2</span>
              <p className="text-[10px] text-cyber-dim leading-relaxed">
                Retrieve account using parameterized query
              </p>
            </div>
            <div className="bg-cyber-black/40 border border-cyber-border rounded-lg p-2.5 flex flex-col justify-between">
              <span className="text-cyber-blue font-bold text-[9px] uppercase block mb-1">Step 3</span>
              <p className="text-[10px] text-cyber-dim leading-relaxed">
                Check whether the account is active
              </p>
            </div>
            <div className="bg-cyber-black/40 border border-cyber-border rounded-lg p-2.5 flex flex-col justify-between">
              <span className="text-cyber-blue font-bold text-[9px] uppercase block mb-1">Step 4</span>
              <p className="text-[10px] text-cyber-dim leading-relaxed">
                Verify the secure password hash
              </p>
            </div>
            <div className="bg-cyber-green/10 border border-cyber-green/20 rounded-lg p-2.5 flex flex-col justify-between">
              <span className="text-cyber-green font-bold text-[9px] uppercase block mb-1">Step 5</span>
              <p className="text-[10px] text-cyber-green-light leading-relaxed font-bold">
                Create a session only after all checks pass
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
                  <td className="p-3 pl-4 text-cyber-text">Raw username input is inserted directly into SQL query</td>
                  <td className="p-3 pr-4 text-cyber-text">Username passed as a bound parameter value</td>
                </tr>
                <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                  <td className="p-3 pl-4 text-cyber-text">Comment syntax can truncate the remaining conditions</td>
                  <td className="p-3 pr-4 text-cyber-text">Comment markers remain literal data string characters</td>
                </tr>
                <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                  <td className="p-3 pl-4 text-cyber-text">Password check occurs inside the dynamic SQL statement</td>
                  <td className="p-3 pr-4 text-cyber-text">Password hash verified safely in application code</td>
                </tr>
                <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                  <td className="p-3 pl-4 text-cyber-text">Account active-status condition may be bypassed</td>
                  <td className="p-3 pr-4 text-cyber-text">Account status flags verified explicitly</td>
                </tr>
                <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                  <td className="p-3 pl-4 text-cyber-text">Returned query row automatically means success</td>
                  <td className="p-3 pr-4 text-cyber-text">Session generated only after all assertions pass</td>
                </tr>
                <tr className="hover:bg-cyber-blue/5">
                  <td className="p-3 pl-4 text-cyber-text">Detailed error codes may reveal syntax formats</td>
                  <td className="p-3 pr-4 text-cyber-text">Generic authentication error messages returned</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 21. Additional defensive measures */}
      <div className="space-y-4">
        <span className="text-xs font-bold font-mono text-cyber-dim block uppercase tracking-wider">
          Additional Defensive Measures
        </span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 space-y-2 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-blue" />
              <span className="font-bold text-cyber-title uppercase block mb-1">1. Use parameterized queries</span>
              <p className="text-cyber-dim leading-relaxed">
                Never combine raw login, search, filter, or identifier input with SQL statement templates.
              </p>
            </div>
          </div>

          <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 space-y-2 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-blue" />
              <span className="font-bold text-cyber-title uppercase block mb-1">2. Store password hashes</span>
              <p className="text-cyber-dim leading-relaxed">
                Use Argon2id, bcrypt, scrypt, or PBKDF2 instead of plain-text passwords or simple MD5.
              </p>
            </div>
          </div>

          <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 space-y-2 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-blue" />
              <span className="font-bold text-cyber-title uppercase block mb-1">3. Check account state separately</span>
              <p className="text-cyber-dim leading-relaxed">
                Verify active, locked, disabled, and role-related conditions in secure application code logic.
              </p>
            </div>
          </div>

          <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 space-y-2 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-blue" />
              <span className="font-bold text-cyber-title uppercase block mb-1">4. Use generic error messages</span>
              <p className="text-cyber-dim leading-relaxed">
                Return the same generic error for unknown users and incorrect password submissions.
              </p>
            </div>
          </div>

          <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 space-y-2 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-blue" />
              <span className="font-bold text-cyber-title uppercase block mb-1">5. Apply least privilege</span>
              <p className="text-cyber-dim leading-relaxed">
                Restrict the application database account to only the tables and operations it needs.
              </p>
            </div>
          </div>

          <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 space-y-2 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-blue" />
              <span className="font-bold text-cyber-title uppercase block mb-1">6. Monitor query patterns</span>
              <p className="text-cyber-dim leading-relaxed">
                Log repeated apostrophes, comment characters, and failed login counts without storing clear passwords.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-cyber-blue/5 border border-cyber-blue/20 rounded-lg p-3 font-mono text-[11px] text-cyber-blue-light text-center">
          💡 Monitoring comment markers is a secondary control. It does not replace parameterized queries.
        </div>
      </div>

      {/* 22. Explain why blocking comment symbols is insufficient */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-2 w-full font-mono">
          <div className="flex items-center gap-2 border-b border-cyber-border/40 pb-3">
            <ShieldAlert className="w-4.5 h-4.5 text-[#ffbd2e]" />
            <h3 className="font-sans font-bold text-sm text-cyber-title tracking-wider uppercase">
              Why not simply block -- or #?
            </h3>
          </div>
          <p className="text-xs text-cyber-dim leading-relaxed text-justify">
            Comment syntax differs across database engines, and attackers may use whitespace changes, block comments, encoding, or alternative query structures. A blacklist may also block legitimate input without addressing the actual vulnerability.
          </p>
          <div className="bg-cyber-black/40 border border-cyber-border rounded p-2 text-[10px] text-cyber-title text-center font-bold">
            The correct defense is to ensure that user-controlled values are never parsed as SQL syntax.
          </div>
        </div>

        {/* 23. Explain why hiding errors is not enough */}
        <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-2 w-full font-mono">
          <div className="flex items-center gap-2 border-b border-cyber-border/40 pb-3">
            <ShieldAlert className="w-4.5 h-4.5 text-[#ffbd2e]" />
            <h3 className="font-sans font-bold text-sm text-cyber-title tracking-wider uppercase">
              Does hiding SQL errors fix the problem?
            </h3>
          </div>
          <p className="text-xs text-cyber-dim leading-relaxed text-justify">
            No. Generic errors reduce information leakage, but they do not prevent comment syntax from changing an unsafe SQL query. The query must be rebuilt using parameterized statements.
          </p>
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
            <strong className="text-cyber-title">Truncation marker:</strong> SQL comments instruct the database compiler to ignore part of a statement.
          </li>
          <li>
            <strong className="text-cyber-title">Query trimming:</strong> An attacker may close an input string and comment out the remaining query conditions.
          </li>
          <li>
            <strong className="text-cyber-title">Rule exclusion:</strong> Password, account-status, ownership, or visibility conditions may be removed.
          </li>
          <li>
            <strong className="text-cyber-title">Credential bypass:</strong> The attacker does not need to know the real password when the password check is ignored.
          </li>
          <li>
            <strong className="text-cyber-title">Engine syntax:</strong> Comment syntax varies between database engines (standard `-- `, MySQL `#`, inline `/* */`).
          </li>
          <li>
            <strong className="text-cyber-title">Data boundary:</strong> Parameterized queries keep comment markers inside literal data values.
          </li>
          <li>
            <strong className="text-cyber-title">Layered validation:</strong> Password hashes, explicit account checks, least privilege, generic errors, and monitoring provide additional protection.
          </li>
        </ul>
      </div>

      {/* 25. Simulator call-to-action */}
      <div className="bg-cyber-card border border-cyber-border/70 rounded-2xl p-8 text-center space-y-5 shadow-2xl relative overflow-hidden w-full">
        <span className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyber-blue to-transparent" />
        <h3 className="font-sans font-extrabold text-lg text-cyber-title tracking-wider uppercase">
          Test the SQL Comment Attack in the Local Lab
        </h3>
        <p className="text-sm text-cyber-text text-justify leading-relaxed max-w-2xl mx-auto font-sans">
          Use the Comment Attack simulator to observe how a comment marker can remove the remaining password or filter conditions from a vulnerable SQL query.
        </p>
        <div className="pt-2">
          <Link
            to="/attacks/comment-attack"
            className="inline-flex items-center gap-2 bg-cyber-blue hover:bg-cyber-blue-light text-white px-8 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_20px_rgba(26,106,255,0.3)] hover:shadow-[0_0_30px_rgba(26,106,255,0.5)] transform hover:-translate-y-0.5"
          >
            <Terminal className="w-4 h-4" />
            Launch Comment Attack Simulator
          </Link>
        </div>
      </div>

    </div>
  );
}
