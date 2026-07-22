import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Register PWA Service Worker for offline execution support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('Progressive Web App: Service Worker registered successfully.', reg.scope);
      })
      .catch((err) => {
        console.error('Progressive Web App: Service Worker registration failed.', err);
      });
  });
}
