import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Toaster } from 'react-hot-toast';

// TYPEFACE INJECTION (Local Bundle)
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/noto-serif-bengali/300.css';
import '@fontsource/noto-serif-bengali/400.css';
import '@fontsource/noto-serif-bengali/500.css';
import '@fontsource/noto-serif-bengali/600.css';
import '@fontsource/noto-serif-bengali/700.css';
import '@fontsource/noto-serif-bengali/900.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Toaster 
      position="top-center" 
      toastOptions={{ 
        style: { 
          fontFamily: '"Inter", sans-serif', 
          borderRadius: '16px', 
          background: 'var(--card)', 
          color: 'var(--text)',
          border: '1px solid var(--border)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          fontSize: '14px',
          fontWeight: 500
        },
        success: { iconTheme: { primary: 'var(--accent)', secondary: 'var(--bg)' } }
      }} 
    />
    <App />
  </React.StrictMode>
);