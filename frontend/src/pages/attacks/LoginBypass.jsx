import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, KeyRound, LogIn, ShieldAlert, CheckCircle2, XCircle, AlertTriangle, Check, ShieldCheck, UserX, ShieldOff, Terminal } from 'lucide-react';

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
    const vars = ['username', 'password', 'query', 'user', 'allowed_categories', 'results', 'db'];
    vars.forEach(v => {
      const regex = new RegExp(`\\b(${v})\\b`, 'g');
      escaped = escaped.replace(regex, '<span class="text-code-variable font-semibold">$1</span>');
    });

    // 5. Highlight functions, methods, builtins
    escaped = escaped.replace(/\b(request\.form\.get|request\.form|db\.execute|\.fetchone|check_password_hash|login_user)\b/g, '<span class="text-code-function font-semibold">$1</span>');

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

export default function LoginBypass() {
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
          SQL Injection <span className="text-cyber-blue">Login Bypass</span>
        </h1>
        <p className="text-cyber-text text-sm text-justify w-full leading-relaxed font-medium">
          Learn how unsafe authentication queries allow malicious input to change login logic and grant access without a valid password.
        </p>
        <div className="pt-1">
          <span className="inline-flex items-center text-[9px] font-mono font-bold tracking-wider text-cyber-blue border border-cyber-blue/30 bg-cyber-blue/5 px-2.5 py-0.5 rounded uppercase">
            AUTHENTICATION BYPASS TECHNIQUE
          </span>
        </div>
      </div>

      {/* 2. Section: What is SQL Injection Login Bypass? */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2.5 border-b border-cyber-border/40 pb-3">
          <KeyRound className="w-4.5 h-4.5 text-cyber-blue" />
          <h3 className="font-sans font-bold text-sm text-cyber-title tracking-wider uppercase">
            What is SQL Injection Login Bypass?
          </h3>
        </div>
        <div className="space-y-3 text-sm text-cyber-text leading-relaxed text-justify">
          <p>
            SQL Injection Login Bypass occurs when an application builds an authentication query by directly combining a username or password with SQL code.
          </p>
          <p>
            An attacker can insert quotes, Boolean operators, and SQL comments into a login field to modify the original WHERE clause. If the injected condition evaluates to true, the database may return a user record even though the attacker did not provide the correct password.
          </p>
          <p className="text-xs text-cyber-dim font-sans italic border-l-2 border-cyber-blue/50 pl-3 mt-2">
            <strong>Important:</strong> Login bypass does not crack or recover the real password. It manipulates the authentication query so that the password check is no longer enforced as intended.
          </p>
        </div>

        {/* Small Info Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-cyber-border/30 text-xs font-mono">
          <div className="bg-cyber-black/30 border border-cyber-border/50 rounded-lg p-2.5">
            <span className="text-cyber-dim font-bold block uppercase text-[9px] tracking-wider mb-0.5">Cause</span>
            <span className="text-cyber-title font-bold">Unsafe SQL string concatenation in authentication logic</span>
          </div>
          <div className="bg-cyber-black/30 border border-cyber-border/50 rounded-lg p-2.5">
            <span className="text-cyber-dim font-bold block uppercase text-[9px] tracking-wider mb-0.5">Attacker Goal</span>
            <span className="text-cyber-red font-bold">Make the login condition evaluate to true</span>
          </div>
          <div className="bg-cyber-black/30 border border-cyber-border/50 rounded-lg p-2.5">
            <span className="text-cyber-dim font-bold block uppercase text-[9px] tracking-wider mb-0.5">Possible Impact</span>
            <span className="text-cyber-red font-bold">Unauthorized account or administrative access</span>
          </div>
        </div>
      </div>

      {/* 3. Section: Vulnerable authentication scenario */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2.5 border-b border-cyber-border/40 pb-3">
          <LogIn className="w-4.5 h-4.5 text-cyber-red animate-pulse" />
          <h3 className="font-sans font-bold text-sm text-cyber-title tracking-wider uppercase">
            Vulnerable Golimar Store Login
          </h3>
        </div>

        <p className="text-sm text-cyber-text leading-relaxed text-justify">
          Imagine that the Golimar Store application receives a username and password from the login form and uses them directly inside an SQL query to find a matching user.
        </p>

        {/* Users Database Table Preview */}
        <div className="space-y-2">
          <span className="text-xs font-bold font-mono text-cyber-dim block uppercase tracking-wider">
            Database Table: <code className="text-cyber-title bg-cyber-input px-1.5 py-0.5 rounded font-mono font-medium">users</code>
          </span>
          <div className="overflow-x-auto border border-cyber-border rounded-lg bg-cyber-input">
            <table className="w-full border-collapse text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-cyber-border bg-cyber-card text-cyber-dim">
                  <th className="p-3 font-bold pl-4">id</th>
                  <th className="p-3 font-bold">username</th>
                  <th className="p-3 font-bold">password_hash</th>
                  <th className="p-3 font-bold pr-4">role</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-cyber-red/5 hover:bg-cyber-red/10 border-b border-cyber-border/30">
                  <td className="p-3 pl-4 text-cyber-red font-bold">1</td>
                  <td className="p-3 text-cyber-title font-extrabold text-cyber-red flex items-center gap-1.5">
                    <span>admin</span>
                    <span className="text-[8px] border border-cyber-red/40 bg-cyber-red/10 px-1.5 py-0.25 rounded text-cyber-red uppercase tracking-wider font-bold">PRIVILEGED ACCOUNT</span>
                  </td>
                  <td className="p-3 text-cyber-dim font-medium select-all">hashed_admin_password</td>
                  <td className="p-3 pr-4 text-cyber-red font-bold">administrator</td>
                </tr>
                <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                  <td className="p-3 pl-4 text-cyber-dim">2</td>
                  <td className="p-3 text-cyber-title font-semibold">alice</td>
                  <td className="p-3 text-cyber-dim select-all">hashed_alice_password</td>
                  <td className="p-3 pr-4 text-cyber-text">customer</td>
                </tr>
                <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                  <td className="p-3 pl-4 text-cyber-dim">3</td>
                  <td className="p-3 text-cyber-title font-semibold">bob</td>
                  <td className="p-3 text-cyber-dim select-all">hashed_bob_password</td>
                  <td className="p-3 pr-4 text-cyber-text">customer</td>
                </tr>
              </tbody>
            </table>
          </div>
          <span className="text-[10px] text-cyber-dim block font-sans italic mt-1 pl-1">
            * The admin account should only be returned when both the correct username and the correct password are supplied.
          </span>
        </div>

        {/* 4. Show the vulnerable backend code */}
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
    "AND password = '" + password + "'"
)

user = db.execute(query).fetchone()`} 
          />

          <p className="text-xs text-cyber-text leading-relaxed text-justify mt-2 pl-1">
            The application directly inserts the username and password into the SQL statement. This means that special SQL characters entered by the user can become part of the executable query.
          </p>

          <div className="bg-cyber-red/5 border border-cyber-red/20 rounded-lg p-3 font-mono text-xs text-cyber-red/90 mt-2 space-y-1.5">
            <span className="font-extrabold uppercase text-[10px] tracking-wider block">Unsafe Interpolation Scope:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
              <code className="bg-cyber-black/40 px-2 py-1 rounded block font-mono font-bold text-center select-all">
                "WHERE username = '" + username + "'"
              </code>
              <code className="bg-cyber-black/40 px-2 py-1 rounded block font-mono font-bold text-center select-all">
                "AND password = '" + password + "'"
              </code>
            </div>
            <span className="text-[10px] text-cyber-red block mt-2 text-center font-bold">
              ⚠️ Authentication decisions must never depend on SQL strings assembled from raw user input.
            </span>
          </div>
        </div>
      </div>

      {/* 5. Show normal login behavior (Step 1) */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2 border-b border-cyber-border/40 pb-3">
          <div className="w-5 h-5 rounded-full bg-cyber-green/10 border border-cyber-green/30 flex items-center justify-center text-cyber-green text-[10px] font-bold font-mono">1</div>
          <h3 className="font-sans font-bold text-sm text-cyber-green tracking-wider uppercase">
            Step 1 — Normal login request
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="space-y-1.5">
            <span className="text-cyber-dim font-bold uppercase tracking-wider block">Target URL</span>
            <div className="bg-cyber-input border border-cyber-border rounded-lg p-2.5 text-cyber-text truncate select-all">
              http://127.0.0.1:2000/login
            </div>
          </div>
          <div className="space-y-1.5">
            <span className="text-cyber-dim font-bold uppercase tracking-wider block">Username Input</span>
            <div className="bg-cyber-input border border-cyber-border rounded-lg p-2.5 text-cyber-title font-bold">
              admin
            </div>
          </div>
          <div className="space-y-1.5">
            <span className="text-cyber-dim font-bold uppercase tracking-wider block">Password Input</span>
            <div className="bg-cyber-input border border-cyber-border rounded-lg p-2.5 text-cyber-title font-bold">
              CorrectAdminPassword
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
AND password = 'CorrectAdminPassword';`} 
          />
        </div>

        <div className="bg-cyber-green/5 border border-cyber-green/20 rounded-lg p-4 text-xs font-mono leading-relaxed space-y-3">
          <p className="text-cyber-green font-medium">
            <strong>Result:</strong> The database searches for a row where both the username and password match. When both values are correct, the admin record is returned and the user is authenticated.
          </p>
          
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-cyber-dim uppercase tracking-wider block">Authentication Result:</span>
            <div className="bg-cyber-black/30 border border-cyber-green/30 rounded-lg p-2.5 text-cyber-title font-bold max-w-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyber-green" />
              <div>
                <span className="block text-cyber-green font-bold text-xs uppercase">SUCCESSFULLY AUTHENTICATED</span>
                <span className="text-[10px] text-cyber-dim">Authenticated user: <span className="text-cyber-title font-mono">admin</span> | Role: <span className="text-cyber-blue-light font-mono">administrator</span></span>
              </div>
            </div>
          </div>
          <span className="text-[9px] text-cyber-dim block font-sans italic pt-1">
            * In a real secure application, the database should store a password hash rather than the original password. This vulnerable query is intentionally simplified for educational purposes.
          </span>
        </div>
      </div>

      {/* 6. Show failed login behavior (Step 2) */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2 border-b border-cyber-border/40 pb-3">
          <div className="w-5 h-5 rounded-full bg-cyber-dim/20 border border-cyber-border flex items-center justify-center text-cyber-dim text-[10px] font-bold font-mono">2</div>
          <h3 className="font-sans font-bold text-sm text-cyber-dim tracking-wider uppercase">
            Step 2 — Incorrect password
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="space-y-1.5">
            <span className="text-cyber-dim font-bold uppercase tracking-wider block">Target URL</span>
            <div className="bg-cyber-input border border-cyber-border rounded-lg p-2.5 text-cyber-text truncate select-all">
              http://127.0.0.1:2000/login
            </div>
          </div>
          <div className="space-y-1.5">
            <span className="text-cyber-dim font-bold uppercase tracking-wider block">Username Input</span>
            <div className="bg-cyber-input border border-cyber-border rounded-lg p-2.5 text-cyber-title font-bold">
              admin
            </div>
          </div>
          <div className="space-y-1.5">
            <span className="text-cyber-dim font-bold uppercase tracking-wider block">Password Input</span>
            <div className="bg-cyber-input border border-cyber-border rounded-lg p-2.5 text-cyber-red font-bold">
              wrongpassword
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
AND password = 'wrongpassword';`} 
          />
        </div>

        <div className="bg-cyber-black/30 border border-cyber-border rounded-lg p-4 text-xs font-mono leading-relaxed space-y-3">
          <p className="text-cyber-dim font-medium">
            <strong>Result:</strong> No database row satisfies both conditions. The application correctly rejects the login attempt.
          </p>
          
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-cyber-dim uppercase tracking-wider block">Authentication Result:</span>
            <div className="bg-cyber-black/40 border border-cyber-red/20 rounded-lg p-2.5 text-cyber-red max-w-sm flex items-center gap-2 font-bold">
              <XCircle className="w-4 h-4 text-cyber-red animate-pulse" />
              <div>
                <span className="block text-cyber-red text-xs uppercase font-extrabold">Authentication failed</span>
                <span className="text-[9px] text-cyber-dim font-normal">No database row matched the username and password values.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Show malicious input and query transformation (Step 3) */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2 border-b border-cyber-border/40 pb-3">
          <div className="w-5 h-5 rounded-full bg-cyber-red/10 border border-cyber-red/30 flex items-center justify-center text-cyber-red text-[10px] font-bold font-mono">3</div>
          <h3 className="font-sans font-bold text-sm text-cyber-red tracking-wider uppercase">
            Step 3 — Injected login request
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="space-y-1.5">
            <span className="text-cyber-dim font-bold uppercase tracking-wider block">Target URL</span>
            <div className="bg-cyber-input border border-cyber-border rounded-lg p-2.5 text-cyber-red truncate select-all font-bold">
              http://127.0.0.1:2000/login
            </div>
          </div>
          <div className="space-y-1.5">
            <span className="text-cyber-dim font-bold uppercase tracking-wider block">Injected Username</span>
            <div className="bg-cyber-input border border-cyber-border rounded-lg p-2.5 text-cyber-red font-bold select-all">
              admin ' OR 1=1 --
            </div>
          </div>
          <div className="space-y-1.5">
            <span className="text-cyber-dim font-bold uppercase tracking-wider block">Password Input</span>
            <div className="bg-cyber-input border border-cyber-border rounded-lg p-2.5 text-cyber-dim font-bold">
              Any value
            </div>
          </div>
        </div>

        <div className="space-y-1.5 font-mono text-xs">
          <span className="text-cyber-dim font-bold uppercase tracking-wider block">Transformed SQL Query</span>
          <CodeBox 
            lang="SQL" 
            code={`SELECT id, username, role
FROM users
WHERE username = 'admin ' OR 1=1 --'
AND password = 'Any value';`} 
          />
          <span className="text-[10px] text-cyber-dim block font-sans italic pl-1 mt-1">
            * The exact whitespace and quote placement can vary depending on the vulnerable application’s original SQL query. The educational goal is to show how the injected OR condition and SQL comment change the authentication logic.
          </span>
        </div>

        {/* Payload Visual Breakdown */}
        <div className="space-y-2">
          <span className="text-xs font-bold font-mono text-cyber-dim block uppercase tracking-wider">
            Payload Breakdown Structure
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
            <div className="bg-cyber-black/40 border border-cyber-border rounded-lg p-3 relative overflow-hidden space-y-1">
              <span className="absolute top-0 left-0 bottom-0 w-[3px] bg-cyber-blue" />
              <span className="text-cyber-blue font-bold text-[9px] uppercase block">Part 1</span>
              <code className="text-cyber-title font-bold bg-cyber-input px-1.5 py-0.5 rounded font-mono">admin</code>
              <p className="text-[10px] text-cyber-dim leading-relaxed">
                Targets the administrator username.
              </p>
            </div>
            <div className="bg-cyber-black/40 border border-cyber-border rounded-lg p-3 relative overflow-hidden space-y-1">
              <span className="absolute top-0 left-0 bottom-0 w-[3px] bg-cyber-blue" />
              <span className="text-cyber-blue font-bold text-[9px] uppercase block">Part 2</span>
              <code className="text-cyber-title font-bold bg-cyber-input px-1.5 py-0.5 rounded font-mono">'</code>
              <p className="text-[10px] text-cyber-dim leading-relaxed">
                Closes the original username string literal boundary.
              </p>
            </div>
            <div className="bg-cyber-black/40 border border-cyber-border rounded-lg p-3 relative overflow-hidden space-y-1">
              <span className="absolute top-0 left-0 bottom-0 w-[3px] bg-cyber-red" />
              <span className="text-cyber-red font-bold text-[9px] uppercase block">Part 3</span>
              <code className="text-cyber-red font-bold bg-cyber-input px-1.5 py-0.5 rounded font-mono">OR 1=1</code>
              <p className="text-[10px] text-cyber-dim leading-relaxed">
                Adds a Boolean condition that is always true.
              </p>
            </div>
            <div className="bg-cyber-black/40 border border-cyber-border rounded-lg p-3 relative overflow-hidden space-y-1">
              <span className="absolute top-0 left-0 bottom-0 w-[3px] bg-[#ffbd2e]" />
              <span className="text-[#ffbd2e] font-bold text-[9px] uppercase block">Part 4</span>
              <code className="text-[#ffbd2e] font-bold bg-cyber-input px-1.5 py-0.5 rounded font-mono">--</code>
              <p className="text-[10px] text-cyber-dim leading-relaxed">
                Comments out the remaining statement, ignoring password checks.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 8. Explain why the login bypass works */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2.5 border-b border-cyber-border/40 pb-3">
          <AlertTriangle className="w-4.5 h-4.5 text-cyber-red animate-bounce" />
          <h3 className="font-sans font-bold text-sm text-cyber-title tracking-wider uppercase">
            Why does the login bypass work?
          </h3>
        </div>

        <div className="space-y-3 text-sm text-cyber-text leading-relaxed text-justify">
          <p>
            The expression <code className="text-cyber-red font-mono bg-cyber-red/5 px-1 py-0.5 rounded">1=1</code> is always true. Because it is connected with <code className="text-cyber-blue font-bold font-mono">OR</code>, the complete <code className="text-cyber-title font-mono font-bold">WHERE</code> condition can evaluate to true even when the original username comparison does not match exactly.
          </p>
          <p>
            The <code className="text-[#ffbd2e] font-mono bg-[#ffbd2e]/5 px-1 py-0.5 rounded">--</code> sequence causes the database to ignore the remaining part of the query. As a result, the original password condition is no longer evaluated.
          </p>
        </div>

        {/* Logic Truth Table representation */}
        <div className="bg-cyber-black/30 border border-cyber-border rounded-lg p-3 font-mono text-xs max-w-sm mx-auto text-center space-y-1">
          <span className="text-[9px] uppercase tracking-wider text-cyber-dim block font-bold mb-1">Effective Query Logic Evaluation</span>
          <div>username = 'admin' OR <span className="text-cyber-green font-bold">1=1</span></div>
          <div>FALSE OR <span className="text-cyber-green font-bold">TRUE</span> = <span className="text-cyber-green font-bold">TRUE</span></div>
          <div>TRUE  OR <span className="text-cyber-green font-bold">TRUE</span> = <span className="text-cyber-green font-bold">TRUE</span></div>
        </div>

        {/* Authentication results */}
        <div className="space-y-2 pt-2 font-mono text-xs">
          <span className="text-cyber-dim font-bold uppercase tracking-wider block">Bypassed Execution Results</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="flex items-center gap-2 bg-cyber-black/20 border border-cyber-border rounded-lg p-2.5 text-cyber-dim">
              <Check className="w-3.5 h-3.5 text-cyber-dim" />
              Database returns user record
            </div>
            <div className="flex items-center gap-2 bg-cyber-black/20 border border-cyber-border rounded-lg p-2.5 text-cyber-dim">
              <Check className="w-3.5 h-3.5 text-cyber-dim" />
              Application treats request as verified
            </div>
            <div className="flex items-center gap-2 bg-cyber-red/5 border border-cyber-red/35 rounded-lg p-2.5 text-cyber-red font-bold">
              <XCircle className="w-3.5 h-3.5 text-cyber-red animate-pulse" />
              Password verification is bypassed
            </div>
          </div>
        </div>

        <div className="bg-cyber-red/5 border border-cyber-red/30 rounded-xl p-4 text-xs font-mono leading-relaxed text-cyber-red flex items-center justify-between mt-4">
          <div className="flex gap-3 items-center">
            <ShieldOff className="w-5 h-5 shrink-0 text-cyber-red" />
            <span className="font-bold text-cyber-title uppercase block">🛡️ UNAUTHORIZED AUTHENTICATION</span>
          </div>
          <span className="text-[8px] border border-cyber-red/40 bg-cyber-red/10 px-2 py-0.5 rounded font-bold uppercase tracking-wider">EXPLOITED</span>
        </div>
      </div>

      {/* 9. Explain which account may be returned */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2.5 border-b border-cyber-border/40 pb-3">
          <UserX className="w-4.5 h-4.5 text-cyber-dim" />
          <h3 className="font-sans font-bold text-sm text-cyber-title tracking-wider uppercase">
            Which user account is returned?
          </h3>
        </div>

        <div className="space-y-3 text-sm text-cyber-text leading-relaxed text-justify">
          <p>
            When a vulnerable application uses <code className="text-cyber-title font-mono bg-cyber-card px-1 py-0.5 rounded">fetchone()</code> or selects the first matching database row, the returned account depends on the final query, database ordering, and stored records.
          </p>
          <p>
            In many simplified demonstrations, the first matching user may be the administrator account. However, developers must never rely on row order, and attackers cannot always guarantee which record will be returned.
          </p>
          <p className="text-xs text-cyber-dim italic pl-1 mt-2 font-sans border-l border-cyber-dim/50">
            <strong>Key Concept:</strong> The attack succeeds because authentication is based on the presence of a returned database row, not because the attacker knows the account password.
          </p>
        </div>

        <div className="bg-cyber-black/30 border border-cyber-border/60 rounded-lg p-3 font-mono text-xs max-w-sm mx-auto text-center">
          <span className="text-[10px] text-cyber-dim uppercase font-bold block mb-1">First matching database row:</span>
          <span className="text-cyber-red font-bold">admin</span> <span className="text-cyber-dim">→</span> <span className="text-cyber-title font-bold">administrator</span>
        </div>
      </div>

      {/* 10. Security impact section */}
      <div className="bg-cyber-card border border-cyber-red/40 rounded-xl p-6 relative overflow-hidden space-y-4 w-full">
        <div className="flex items-center gap-2.5 border-b border-cyber-border/40 pb-3">
          <ShieldAlert className="w-4.5 h-4.5 text-cyber-red animate-pulse" />
          <h3 className="font-sans font-bold text-sm text-cyber-red tracking-wider uppercase">
            Security Impact
          </h3>
        </div>
        
        <p className="text-sm text-cyber-text leading-relaxed text-justify">
          A successful SQL Injection Login Bypass can allow an attacker to access an application without valid credentials. If a privileged user record is returned, the attacker may gain access to administrative functions, customer data, product management, configuration pages, or other protected resources.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs pt-1">
          <div className="flex items-start gap-2.5 bg-cyber-red/5 border border-cyber-red/20 rounded-lg p-3">
            <XCircle className="w-4 h-4 text-cyber-red shrink-0" />
            <div>
              <span className="text-cyber-title font-bold uppercase block mb-0.5">Unauthorized account access</span>
              <span className="text-cyber-dim">Gain entry to user dashboard scopes without account passwords.</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5 bg-cyber-red/5 border border-cyber-red/20 rounded-lg p-3">
            <ShieldOff className="w-4 h-4 text-cyber-red shrink-0" />
            <div>
              <span className="text-cyber-title font-bold uppercase block mb-0.5">Administrative privilege exposure</span>
              <span className="text-cyber-dim">Intercept superuser tokens allowing control of the environment.</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5 bg-cyber-red/5 border border-cyber-red/20 rounded-lg p-3">
            <UserX className="w-4 h-4 text-cyber-red shrink-0" />
            <div>
              <span className="text-cyber-title font-bold uppercase block mb-0.5">Customer info exposure</span>
              <span className="text-cyber-dim">Extract sensitive profiles, records, addresses, or order details.</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5 bg-cyber-red/5 border border-cyber-red/20 rounded-lg p-3">
            <AlertTriangle className="w-4 h-4 text-cyber-red shrink-0" />
            <div>
              <span className="text-cyber-title font-bold uppercase block mb-0.5">Data tampering / deletion</span>
              <span className="text-cyber-dim">Modify inventory settings, categories, comments, or transaction logs.</span>
            </div>
          </div>
        </div>
      </div>

      {/* 11. Section: How to secure the login process */}
      <div className="bg-cyber-card border border-cyber-green/40 rounded-xl p-6 relative overflow-hidden space-y-4 w-full shadow-lg">
        <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-green animate-pulse" />
        <div className="flex items-center gap-2.5 border-b border-cyber-border/40 pb-3">
          <ShieldCheck className="w-4.5 h-4.5 text-cyber-green" />
          <h3 className="font-sans font-bold text-sm text-cyber-green tracking-wider uppercase">
            How to Prevent SQL Injection Login Bypass
          </h3>
        </div>

        <p className="text-sm text-cyber-text leading-relaxed text-justify">
          Secure login processes require both <strong>parameterized database queries</strong> and <strong>secure password hashing/verification</strong>.
        </p>

        {/* 12. Secure database lookup example */}
        <div className="space-y-2">
          <span className="text-xs font-bold font-mono text-cyber-dim block uppercase tracking-wider">
            1. Secure Database User Lookup
          </span>

          <CodeBox 
            lang="Python" 
            code={`username = request.form.get("username")
password = request.form.get("password")

query = """
    SELECT id, username, password_hash, role
    FROM users
    WHERE username = ?
"""

user = db.execute(query, (username,)).fetchone()`} 
          />

          <p className="text-xs text-cyber-text leading-relaxed text-justify mt-2 pl-1">
            The username is passed separately from the SQL command. The database treats the supplied value strictly as data, even when it contains quotes, OR operators, or SQL comments.
          </p>
        </div>

        {/* Conceptual Difference */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 text-xs font-mono">
          <div className="bg-cyber-red/5 border border-cyber-red/20 rounded-lg p-3 relative overflow-hidden">
            <span className="text-cyber-red font-bold text-[9px] uppercase tracking-wider block mb-1">Vulnerable authentication check</span>
            <code className="text-cyber-text font-bold text-[10px] break-all leading-normal">
              SQL command + username + password → one dynamically constructed SQL string
            </code>
          </div>
          <div className="bg-cyber-green/5 border border-cyber-green/20 rounded-lg p-3 relative overflow-hidden">
            <span className="text-cyber-green font-bold text-[9px] uppercase tracking-wider block mb-1">Secure authentication check</span>
            <code className="text-cyber-title font-bold text-[10px] break-all leading-normal">
              Fixed SQL command + separately bound username value → query structure is fixed
            </code>
          </div>
        </div>

        {/* 13. Secure password verification example */}
        <div className="space-y-2 pt-4 border-t border-cyber-border/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono text-cyber-dim block uppercase tracking-wider">
              2. Secure Password Verification
            </span>
            <span className="text-[9px] font-mono font-bold text-cyber-green border border-cyber-green/30 bg-cyber-green/5 px-2 py-0.5 rounded uppercase">
              PARAMETERIZED QUERY + PASSWORD HASH VERIFICATION
            </span>
          </div>

          <CodeBox 
            lang="Python" 
            code={`from werkzeug.security import check_password_hash

if user and check_password_hash(user["password_hash"], password):
    login_user(user)
else:
    return {"error": "Invalid username or password"}, 401`} 
          />

          <p className="text-xs text-cyber-text leading-relaxed text-justify mt-2 pl-1">
            The application first retrieves the user record safely by username. It then verifies the submitted password against the stored password hash inside the application. The password should not be inserted into an SQL WHERE clause and should never be stored as plain text.
          </p>
        </div>

        {/* 14. Show the full secure authentication flow */}
        <div className="space-y-2 pt-4 border-t border-cyber-border/30">
          <span className="text-xs font-bold font-mono text-cyber-dim block uppercase tracking-wider">
            Full Secure Authentication Flow
          </span>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 font-mono text-[10px] text-center">
            <div className="bg-cyber-black/40 border border-cyber-border rounded-lg p-2.5 flex flex-col justify-between">
              <span className="text-cyber-blue font-bold block mb-1">Step 1</span>
              <span>Receive username & password over HTTPS</span>
            </div>
            <div className="bg-cyber-black/40 border border-cyber-border rounded-lg p-2.5 flex flex-col justify-between">
              <span className="text-cyber-blue font-bold block mb-1">Step 2</span>
              <span>Retrieve user by username via parameterized query</span>
            </div>
            <div className="bg-cyber-black/40 border border-cyber-border rounded-lg p-2.5 flex flex-col justify-between">
              <span className="text-cyber-blue font-bold block mb-1">Step 3</span>
              <span>Verify password with secure hash check</span>
            </div>
            <div className="bg-cyber-black/40 border border-cyber-border rounded-lg p-2.5 flex flex-col justify-between">
              <span className="text-cyber-blue font-bold block mb-1">Step 4</span>
              <span>Create session only after successful check</span>
            </div>
            <div className="bg-cyber-black/40 border border-cyber-border rounded-lg p-2.5 flex flex-col justify-between">
              <span className="text-cyber-blue font-bold block mb-1">Step 5</span>
              <span>Return generic error when auth fails</span>
            </div>
          </div>
        </div>

        {/* 15. Vulnerable vs secure comparison table */}
        <div className="space-y-2 pt-4 border-t border-cyber-border/30">
          <span className="text-xs font-bold font-mono text-cyber-dim block uppercase tracking-wider">
            Login Approach Comparison Table
          </span>
          <div className="overflow-x-auto border border-cyber-border rounded-lg bg-cyber-input">
            <table className="w-full border-collapse text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-cyber-border bg-cyber-card text-cyber-dim">
                  <th className="p-3 font-bold pl-4 text-cyber-red">Vulnerable Login</th>
                  <th className="p-3 font-bold pr-4 text-cyber-green">Secure Login</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                  <td className="p-3 pl-4 text-cyber-text">Username inserted into SQL string</td>
                  <td className="p-3 pr-4 text-cyber-text">Username passed as a bound parameter</td>
                </tr>
                <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                  <td className="p-3 pl-4 text-cyber-text">Password compared inside dynamic SQL</td>
                  <td className="p-3 pr-4 text-cyber-text">Password verified using a password hash</td>
                </tr>
                <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                  <td className="p-3 pl-4 text-cyber-text">Input can modify SQL logic</td>
                  <td className="p-3 pr-4 text-cyber-text">Input remains data</td>
                </tr>
                <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                  <td className="p-3 pl-4 text-cyber-text">SQL comments may remove password checks</td>
                  <td className="p-3 pr-4 text-cyber-text">Query structure remains fixed</td>
                </tr>
                <tr className="border-b border-cyber-border/30 hover:bg-cyber-blue/5">
                  <td className="p-3 pl-4 text-cyber-text">Plain or directly compared passwords</td>
                  <td className="p-3 pr-4 text-cyber-text">Salted password hashes</td>
                </tr>
                <tr className="hover:bg-cyber-blue/5">
                  <td className="p-3 pl-4 text-cyber-text">Different errors may reveal account details</td>
                  <td className="p-3 pr-4 text-cyber-text">Generic authentication error message</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 16. Additional defensive measures */}
      <div className="space-y-4">
        <span className="text-xs font-bold font-mono text-cyber-dim block uppercase tracking-wider">
          Additional Defense-In-Depth Measures
        </span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 space-y-2 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-blue" />
              <span className="font-bold text-cyber-title uppercase block mb-1">1. Store only password hashes</span>
              <p className="text-cyber-dim leading-relaxed">
                Use a modern password-hashing algorithm such as Argon2id, bcrypt, scrypt, or PBKDF2. Never store plain-text passwords.
              </p>
            </div>
          </div>

          <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 space-y-2 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-blue" />
              <span className="font-bold text-cyber-title uppercase block mb-1">2. Use generic login errors</span>
              <p className="text-cyber-dim leading-relaxed">
                Return the same message for an unknown username and an incorrect password.
              </p>
            </div>
            <code className="bg-cyber-black/30 border border-cyber-border/40 p-2.5 rounded text-[10px] text-cyber-dim text-center">
              Invalid username or password
            </code>
          </div>

          <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 space-y-2 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-blue" />
              <span className="font-bold text-cyber-title uppercase block mb-1">3. Add rate limiting</span>
              <p className="text-cyber-dim leading-relaxed">
                Limit repeated login attempts to reduce automated attacks and brute-force credential guessing.
              </p>
            </div>
          </div>

          <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 space-y-2 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-blue" />
              <span className="font-bold text-cyber-title uppercase block mb-1">4. Use multi-factor auth</span>
              <p className="text-cyber-dim leading-relaxed">
                Require an additional verification factor (MFA/2FA) for sensitive or administrative accounts.
              </p>
            </div>
          </div>

          <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 space-y-2 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-blue" />
              <span className="font-bold text-cyber-title uppercase block mb-1">5. Apply least privilege</span>
              <p className="text-cyber-dim leading-relaxed">
                The application database account should only have the minimum permissions required for authentication operations.
              </p>
            </div>
          </div>

          <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 space-y-2 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-blue" />
              <span className="font-bold text-cyber-title uppercase block mb-1">6. Monitor suspicious input</span>
              <p className="text-cyber-dim leading-relaxed">
                Log unusual SQL characters, repeated failures, and suspicious authentication patterns without logging password inputs.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-cyber-blue/5 border border-cyber-blue/20 rounded-lg p-3 font-mono text-[11px] text-cyber-blue-light text-center">
          💡 <strong>Note:</strong> Blocking quotes or SQL keywords is not a reliable primary defense. Parameterized queries are required.
        </div>
      </div>

      {/* 17. Explain why input filtering alone is insufficient */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-3 w-full font-mono">
        <div className="flex items-center gap-2 border-b border-cyber-border/40 pb-3">
          <ShieldAlert className="w-4.5 h-4.5 text-[#ffbd2e]" />
          <h3 className="font-sans font-bold text-sm text-cyber-title tracking-wider uppercase">
            Why not simply block OR, quotes, or --?
          </h3>
        </div>
        <p className="text-xs text-cyber-dim leading-relaxed text-justify">
          Attack payloads can be written in many different forms. Database syntax, encoding, whitespace, comments, capitalization, and alternative operators can make blacklist-based filtering unreliable. The correct security model is to prevent user input from becoming executable SQL syntax.
        </p>
        <div className="bg-cyber-black/40 border border-cyber-border rounded p-3 text-[11px] text-cyber-title text-center font-bold">
          Do not try to recognize every possible malicious payload. Make payloads harmless by separating SQL code from user data.
        </div>
      </div>

      {/* 18. Final learning summary */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden space-y-4 w-full font-mono">
        <div className="flex items-center gap-2 border-b border-cyber-border/40 pb-3">
          <ShieldAlert className="w-4.5 h-4.5 text-cyber-blue" />
          <h3 className="font-sans font-bold text-sm text-cyber-title tracking-wider uppercase">
            Key Takeaways
          </h3>
        </div>

        <ul className="list-disc list-inside space-y-2 text-xs text-cyber-dim leading-relaxed">
          <li>
            <strong className="text-cyber-title">Syntax bypass:</strong> Login bypass occurs when authentication input is inserted directly into an SQL query.
          </li>
          <li>
            <strong className="text-cyber-title">No passwords required:</strong> The attacker does not need to know or recover the real password to succeed.
          </li>
          <li>
            <strong className="text-cyber-title">Tautology breakouts:</strong> A condition such as <code className="text-cyber-red bg-cyber-red/5 px-1 py-0.5 rounded font-mono">1=1</code> can make the authentication query evaluate to true.
          </li>
          <li>
            <strong className="text-cyber-title">Logic truncation:</strong> SQL comments may remove the original password condition from the executed query.
          </li>
          <li>
            <strong className="text-cyber-title">Secure separation:</strong> Parameterized queries prevent input from changing SQL query syntax structures.
          </li>
          <li>
            <strong className="text-cyber-title">App-level checks:</strong> Passwords must be stored as secure hashes and verified outside the SQL query engine.
          </li>
          <li>
            <strong className="text-cyber-title">Defense layering:</strong> Rate limiting, generic error flags, least privilege settings, MFA, and audits provide comprehensive security.
          </li>
        </ul>
      </div>

      {/* 19. Simulator call-to-action */}
      <div className="bg-cyber-card border border-cyber-border/70 rounded-2xl p-8 text-center space-y-5 shadow-2xl relative overflow-hidden w-full">
        <span className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyber-blue to-transparent" />
        <h3 className="font-sans font-extrabold text-lg text-cyber-title tracking-wider uppercase">
          Test Login Bypass in the Local Lab
        </h3>
        <p className="text-sm text-cyber-text text-justify leading-relaxed max-w-2xl mx-auto font-sans">
          Use the Login Bypass simulator to send the educational payload to the local Golimar Store login page and observe how an unsafe authentication query may return a user without validating the correct password.
        </p>
        <div className="pt-2">
          <Link
            to="/attacks/login-bypass"
            className="inline-flex items-center gap-2 bg-cyber-blue hover:bg-cyber-blue-light text-white px-8 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_20px_rgba(26,106,255,0.3)] hover:shadow-[0_0_30px_rgba(26,106,255,0.5)] transform hover:-translate-y-0.5"
          >
            <Terminal className="w-4 h-4" />
            Launch Login Bypass Simulator
          </Link>
        </div>
      </div>

    </div>
  );
}
