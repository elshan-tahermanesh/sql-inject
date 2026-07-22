import React, { lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './layouts/Layout.jsx';
import PageTransition from './components/PageTransition.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

// Helper for delayed lazy loading to create an authentic virtual environment startup sensation
const delayedLazy = (importFunc) => {
  return lazy(importFunc);
};

// Lazy loading all primary sandbox pages for maximum bundle efficiency
const Home = delayedLazy(() => import('./pages/Home.jsx'));
const Login = delayedLazy(() => import('./pages/Login.jsx'));
const Attacks = delayedLazy(() => import('./pages/Attacks.jsx'));
const Instructions = delayedLazy(() => import('./pages/Instructions.jsx'));
const Logs = delayedLazy(() => import('./pages/Logs.jsx'));
const PayloadLibrary = delayedLazy(() => import('./pages/PayloadLibrary.jsx'));
const ClassicSqlInjection = delayedLazy(() => import('./pages/payloads/ClassicSqlInjection.jsx'));
const LoginBypassPayloads = delayedLazy(() => import('./pages/payloads/LoginBypass.jsx'));
const UnionAttackPayloads = delayedLazy(() => import('./pages/payloads/UnionAttack.jsx'));
const BlindInjectionPayloads = delayedLazy(() => import('./pages/payloads/BlindInjection.jsx'));
const DropTableAttackPayloads = delayedLazy(() => import('./pages/payloads/DropTableAttack.jsx'));
const CommentAttackPayloads = delayedLazy(() => import('./pages/payloads/CommentAttack.jsx'));

const RemoteLoginBypass = delayedLazy(() => import('./pages/RemoteLoginBypass.jsx'));
const RemoteClassicInjection = delayedLazy(() => import('./pages/RemoteClassicInjection.jsx'));
const RemoteUnionAttack = delayedLazy(() => import('./pages/RemoteUnionAttack.jsx'));
const RemoteBlindInjection = delayedLazy(() => import('./pages/RemoteBlindInjection.jsx'));
const RemoteDropTable = delayedLazy(() => import('./pages/RemoteDropTable.jsx'));
const RemoteCommentAttack = delayedLazy(() => import('./pages/RemoteCommentAttack.jsx'));

// Lazy loading new Phase 1 pages
const About = delayedLazy(() => import('./pages/About.jsx'));
const Search = delayedLazy(() => import('./pages/Search.jsx'));
const Product = delayedLazy(() => import('./pages/Product.jsx'));
const DemoLogin = delayedLazy(() => import('./pages/DemoLogin.jsx'));
const DemoRegister = delayedLazy(() => import('./pages/DemoRegister.jsx'));
const DemoAttack = delayedLazy(() => import('./pages/DemoAttack.jsx'));
const DemoResult = delayedLazy(() => import('./pages/DemoResult.jsx'));
const AdminUsers = delayedLazy(() => import('./pages/AdminUsers.jsx'));
const AdminAddUser = delayedLazy(() => import('./pages/AdminAddUser.jsx'));

// Lazy loading specific attack detail micro-sandboxes
const ClassicInjection = delayedLazy(() => import('./pages/attacks/ClassicInjection.jsx'));
const LoginBypass = delayedLazy(() => import('./pages/attacks/LoginBypass.jsx'));
const UnionAttack = delayedLazy(() => import('./pages/attacks/UnionAttack.jsx'));
const BlindInjection = delayedLazy(() => import('./pages/attacks/BlindInjection.jsx'));
const DropTable = delayedLazy(() => import('./pages/attacks/DropTable.jsx'));
const CommentAttack = delayedLazy(() => import('./pages/attacks/CommentAttack.jsx'));

// Premium, tech-themed loading placeholder
function ModuleSuspenseLoader() {
  return (
    <div className="w-full min-h-[400px] flex flex-col items-center justify-center font-mono">
      <div className="flex items-center gap-3 text-sm text-[#1a6aff]">
        <span className="w-2 h-2 rounded-full bg-[#1a6aff] animate-ping" />
        <span className="tracking-[3px] uppercase animate-pulse">LOADING VIRTUAL MODULE...</span>
      </div>
      <div className="text-[10px] text-[#5a7a9a] mt-2 uppercase tracking-widest">
        binding security virtual environment
      </div>
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();
  return (
    <PageTransition>
      <Suspense fallback={<ModuleSuspenseLoader />}>
        <Routes location={location}>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          
          {/* Remote Sandboxes */}
          <Route path="/attacks/classic-injection" element={<RemoteClassicInjection />} />
          <Route path="/attacks/login-bypass" element={<RemoteLoginBypass />} />
          <Route path="/attacks/union-attack" element={<RemoteUnionAttack />} />
          <Route path="/attacks/blind-injection" element={<RemoteBlindInjection />} />
          <Route path="/attacks/drop-table" element={<RemoteDropTable />} />
          <Route path="/attacks/comment-attack" element={<RemoteCommentAttack />} />

          {/* Backward compatibility redirects for old simulator URLs */}
          <Route path="/classic-injection" element={<Navigate to="/attacks/classic-injection" replace />} />
          <Route path="/login-bypass" element={<Navigate to="/attacks/login-bypass" replace />} />
          <Route path="/union-attack" element={<Navigate to="/attacks/union-attack" replace />} />
          <Route path="/blind-injection" element={<Navigate to="/attacks/blind-injection" replace />} />
          <Route path="/drop-table-attack" element={<Navigate to="/attacks/drop-table" replace />} />
          <Route path="/drop-table" element={<Navigate to="/attacks/drop-table" replace />} />
          <Route path="/comment-attack" element={<Navigate to="/attacks/comment-attack" replace />} />

          <Route path="/attacks" element={<Attacks />} />
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/payload-library" element={<PayloadLibrary />} />

          {/* Phase 1 Integration Routes */}
          <Route path="/about" element={<About />} />
          <Route path="/search" element={<Search />} />
          <Route path="/product" element={<Product />} />
          <Route path="/demo/login" element={<DemoLogin />} />
          <Route path="/demo/register" element={<DemoRegister />} />
          <Route path="/demo/attack" element={<DemoAttack />} />
          <Route path="/demo/result" element={<DemoResult />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/add-user" element={<AdminAddUser />} />
          <Route path="/payload-library/classic-sql-injection" element={<ClassicSqlInjection />} />
          <Route path="/payload-library/login-bypass" element={<LoginBypassPayloads />} />
          <Route path="/payload-library/union-attack" element={<UnionAttackPayloads />} />
          <Route path="/payload-library/blind-injection" element={<BlindInjectionPayloads />} />
          <Route path="/payload-library/drop-table-attack" element={<DropTableAttackPayloads />} />
          <Route path="/payload-library/comment-attack" element={<CommentAttackPayloads />} />

          {/* Simulated Injection Attack details sub-paths */}
          <Route path="/instructions/classic-sql-injection" element={<ClassicInjection />} />
          <Route path="/instructions/login-bypass" element={<LoginBypass />} />
          <Route path="/instructions/union-attack" element={<UnionAttack />} />
          <Route path="/instructions/blind-injection" element={<BlindInjection />} />
          <Route path="/instructions/drop-table-attack" element={<DropTable />} />
          <Route path="/instructions/comment-attack" element={<CommentAttack />} />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </PageTransition>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </Layout>
    </Router>
  );
}
