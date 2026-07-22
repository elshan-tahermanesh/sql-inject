import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { login } from '../services/authService.js';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [responseMsg, setResponseMsg] = useState('');
  const [responseStatus, setResponseStatus] = useState(null); // 'success' | 'error'
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const presets = [
    { u: "admin' --", p: "anything", label: "admin' --" },
    { u: "' OR '1'='1' --", p: "anything", label: "' OR '1'='1' --" },
    { u: "admin' #", p: "anything", label: "admin' #" }
  ];

  const handleFill = (u, p) => {
    setUsername(u);
    setPassword(p);
  };

  const handleLogin = async () => {
  if (isAuthenticating) return;

  if (!username || !password) {
    setResponseStatus('error');
    setResponseMsg('❌ Please enter username and password.');
    setShakeKey(prev => prev + 1);
    return;
  }

  const uLower = username.toLowerCase();
  // Simulate injection detection criteria matching SQL comments and standard true statements
  const bypassed = username.includes("'") && (
    username.includes('--') ||
    username.includes('#') ||
    uLower.includes("or '1'='1") ||
    uLower.includes("or 1=1")
  );

  if (bypassed) {
    // Call authentication service login (prints response to console)
    login(username, password);
    setResponseStatus('success');
    setResponseMsg('');
    setIsAuthenticating(true);

    setTimeout(() => {
      navigate('/home');
    }, 1500);
    return;
  }

  try {
    setIsAuthenticating(true);
    // Call authentication service login (prints response to console)
    login(username, password);

    const response = await fetch("http://localhost:5000/api/secure/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });

    const result = await response.json();

    if (response.ok && result.status === "success") {
      setResponseStatus('success');
      setResponseMsg('');

      setTimeout(() => {
        navigate('/home');
      }, 1500);
    } else {
      setResponseStatus('error');
      setResponseMsg("❌ " + result.message);
      setShakeKey(prev => prev + 1);
      setIsAuthenticating(false);
    }
  } catch (error) {
    setResponseStatus('error');
    setResponseMsg("❌ Could not connect to backend.");
    setShakeKey(prev => prev + 1);
    setIsAuthenticating(false);
  }
};

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isAuthenticating) {
      handleLogin();
    }
  };

  return (
    <div className="flex justify-center select-none w-full max-w-[420px] mx-auto">
      <div className="w-full space-y-6">
        {/* Glowing Animated Outer Border Frame */}
        <div className="cyber-animated-border-frame shadow-[0_10px_35px_var(--accent-glow)] cyber-glow">
          {/* Circling Beam */}
          <div className="cyber-animated-border-beam" />
          
          {/* Inner Content Card */}
          <div className="bg-cyber-card rounded-[11px] p-8 relative z-10 w-full">
            {/* Simple and elegant internal card header */}
            <div className="flex flex-col items-center justify-center mb-6 space-y-2">
              <div className="w-11 h-11 rounded-lg bg-cyber-blue/10 border border-cyber-blue/20 flex items-center justify-center text-cyber-blue mb-1">
                <Lock className="w-5 h-5 animate-pulse" />
              </div>
              <h2 className="text-xl font-bold uppercase tracking-[2px] text-cyber-title">
                System <span className="text-cyber-blue">Login</span>
              </h2>
              <p className="text-[10px] font-mono text-cyber-dim uppercase tracking-widest">
                Secure authentication gateway
              </p>
            </div>

            <div className="space-y-4">
              {/* Username field */}
              <div className="space-y-2">
                <label className="block text-xs uppercase font-mono tracking-widest text-cyber-blue">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isAuthenticating}
                  placeholder="Enter username"
                  className={`w-full bg-cyber-black border border-cyber-border rounded-lg px-4 py-3 text-sm font-mono text-cyber-title placeholder-cyber-dim/40 focus:outline-none focus:border-cyber-blue focus:ring-2 focus:ring-cyber-blue/20 transition-all tracking-wider ${
                    isAuthenticating ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                />
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <label className="block text-xs uppercase font-mono tracking-widest text-cyber-blue">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isAuthenticating}
                  placeholder="Enter password"
                  className={`w-full bg-cyber-black border border-cyber-border rounded-lg px-4 py-3 text-sm font-mono text-cyber-title placeholder-cyber-dim/40 focus:outline-none focus:border-cyber-blue focus:ring-2 focus:ring-cyber-blue/20 transition-all tracking-wider ${
                    isAuthenticating ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                />
              </div>

              {/* Action button */}
              <button
                onClick={handleLogin}
                disabled={isAuthenticating}
                className={`w-full flex items-center justify-center gap-2 bg-cyber-blue text-white py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all mt-2 ${
                  isAuthenticating
                    ? 'opacity-80 cursor-not-allowed'
                    : 'hover:bg-cyber-blue-light cursor-pointer shadow-[0_0_15px_var(--accent-glow)]'
                }`}
              >
                {isAuthenticating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    Authenticating...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Action output message box (Only show errors, green box is removed) */}
        {responseStatus === 'error' && responseMsg && (
          <div key={shakeKey} className="rounded-xl p-5 border font-mono text-xs leading-relaxed whitespace-pre-line animate-cyber-shake shadow-md select-text bg-cyber-red/5 border-cyber-red/30 text-cyber-red">
            <div className="flex gap-2.5 items-start">
              <AlertCircle className="w-4 h-4 shrink-0 text-cyber-red" />
              <div>{responseMsg}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
