import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShieldAlert, Terminal as TermIcon, Lock, Download, Home, HelpCircle, Sun, Moon, LogOut, BookOpen, Activity, Layers } from 'lucide-react';
import { logout } from '../services/authService.js';

export default function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);
  
  // Theme state: 'light' or 'dark', defaulting to 'dark'
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const location = useLocation();
  const isLoginPage = location.pathname === '/' || location.pathname === '/login';

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallBtn(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    // Apply class to documentElement
    const root = window.document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }
  }, [theme]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    setDeferredPrompt(null);
    setShowInstallBtn(false);
  };

  const navLinks = [
    { path: '/home',            label: 'Home',            icon: Home     },
    { path: '/instructions',    label: 'Instructions',    icon: BookOpen },
    { path: '/attacks',         label: 'Attacks',         icon: TermIcon },
    { path: '/payload-library', label: 'Payloads',        icon: Layers   },
    { path: '/logs',            label: 'Logs',            icon: Activity },
  ];

  const attackLinks = [
    { path: '/attacks/classic-injection', label: 'Remote Classic SQLi' },
    { path: '/attacks/login-bypass', label: 'Remote Login Bypass' },
    { path: '/attacks/union-attack', label: 'Remote UNION Attack' },
    { path: '/attacks/blind-injection', label: 'Remote Blind SQLi' },
    { path: '/attacks/drop-table', label: 'Remote Drop Table' },
    { path: '/attacks/comment-attack', label: 'Remote Comment Attack' },
  ];

  const isActive = (path) => path === '/attacks' ? location.pathname.startsWith('/attacks') : location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-cyber-black text-cyber-text font-sans selection:bg-cyber-blue/35 selection:text-cyber-title transition-colors duration-300 relative">
      {/* Absolute positioned theme toggler for clean login layout */}
      {isLoginPage && (
        <div className="absolute top-6 right-6 z-50">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2.5 bg-cyber-card border border-cyber-border hover:border-cyber-blue rounded-lg text-cyber-text hover:text-cyber-blue-light transition-all duration-200 cursor-pointer select-none animate-fade-in"
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-cyber-blue" />
            ) : (
              <Sun className="w-4 h-4 text-[#ffbd2e]" />
            )}
          </button>
        </div>
      )}



      {/* Main Glassmorphic Sticky Header */}
      {!isLoginPage && (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-cyber-header border-b border-cyber-border px-4 md:px-8 py-4 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-3">
          <ShieldAlert className="text-cyber-blue w-6 h-6 animate-pulse" />
          <Link to="/home" className="font-mono text-xl font-bold tracking-[3px] text-cyber-blue hover:text-cyber-blue-light transition-colors">
            SQL_INJECT
          </Link>
        </div>

        {/* Desktop Main Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider transition-colors duration-200 ${
                  isActive(link.path)
                    ? 'text-cyber-blue border-b-2 border-cyber-blue pb-1'
                    : 'text-cyber-dim hover:text-cyber-blue-light'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
          <Link
            to="/logout"
            onClick={() => logout()}
            className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider transition-colors duration-200 ${
              isActive('/logout')
                ? 'text-cyber-red border-b-2 border-cyber-red pb-1'
                : 'text-cyber-dim hover:text-[#ff3a3a]'
            }`}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {/* Theme Toggle Icon Button */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2.5 bg-cyber-card border border-cyber-border hover:border-cyber-blue rounded-lg text-cyber-text hover:text-cyber-blue-light transition-all duration-200 cursor-pointer select-none"
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-cyber-blue" />
            ) : (
              <Sun className="w-4 h-4 text-[#ffbd2e]" />
            )}
          </button>

          {/* PWA Custom Install Trigger */}
          {showInstallBtn && (
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-2 bg-cyber-blue hover:bg-cyber-blue-light text-white px-3 py-1.5 rounded-md text-xs font-bold font-mono tracking-wider transition-all duration-200 transform hover:-translate-y-0.5 shadow-[0_0_15px_rgba(26,106,255,0.3)] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              INSTALL
            </button>
          )}

          {/* Hamburger Menu Toggle (Mobile Devices) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-cyber-dim hover:text-cyber-text transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>
      )}

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[105px] z-40 bg-cyber-black/95 backdrop-blur-md border-b border-cyber-border lg:hidden flex flex-col p-6 animate-fade-in">
          <div className="text-xs font-mono text-cyber-dim tracking-wider uppercase mb-3">Core Modules</div>
          <div className="flex flex-col gap-4 mb-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 text-sm font-semibold uppercase tracking-wider py-2 border-b border-cyber-border/40 ${
                    isActive(link.path) ? 'text-cyber-blue' : 'text-cyber-dim'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
            <Link
              to="/logout"
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
              }}
              className={`flex items-center gap-3 text-sm font-semibold uppercase tracking-wider py-2 border-b border-cyber-border/40 ${
                isActive('/logout') ? 'text-[#ff3a3a]' : 'text-cyber-dim hover:text-[#ff3a3a]'
              }`}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Link>
          </div>

          <div className="text-xs font-mono text-cyber-dim tracking-wider uppercase mb-3">Interactive Attacks</div>
          <div className="grid grid-cols-2 gap-3">
            {attackLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-xs font-semibold py-2 px-3 bg-cyber-card border border-cyber-border rounded-md transition-all ${
                  isActive(link.path) ? 'text-cyber-blue border-cyber-blue' : 'text-cyber-text hover:border-cyber-blue/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Main Page Layout Container */}
      <main className={isLoginPage ? "flex-1 flex items-center justify-center w-full px-4" : "flex-1 max-w-6xl w-full mx-auto px-4 md:px-8 py-10"}>
        <div className="animate-fade-in duration-300 w-full flex justify-center">
          {children}
        </div>
      </main>

      {/* Cybersecurity Cyber Footer */}
      {!isLoginPage && (
        <footer className="site-footer">
          <p>© 2026 SQL_INJECT. All rights reserved.</p>
        </footer>
      )}
    </div>
  );
}
