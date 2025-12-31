import { useEffect, useState } from 'react';
import { useStore } from './data/store';
import { supabase } from './data/supabaseClient';
import AppShell from './auth/AppShell';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  const { setUser, setTheme } = useStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // 1. Session
    supabase.auth.getSession().then(({ data: { session } }) => { setUser(session?.user || null); setReady(true); });
    supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user || null));

    // 2. Theme (Safe Load)
    const saved = localStorage.getItem('aalap-theme') || 'night';
    if (saved === 'paper') document.body.classList.add('theme-paper');
    setTheme(saved);

  }, [setUser, setTheme]);

  if (!ready) return <div style={{background:'#050505', height:'100vh'}} />;
  return <ErrorBoundary><AppShell /></ErrorBoundary>;
}