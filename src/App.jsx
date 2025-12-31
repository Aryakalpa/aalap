import { useEffect, useState } from 'react';
import { useStore } from './data/store';
import { supabase } from './data/supabaseClient';
import AppShell from './auth/AppShell';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  const { setUser } = useStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setUser(session?.user || null); setReady(true); });
    supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user || null));
  }, []);

  if(!ready) return <div style={{height:'100vh', background:'var(--bg-primary)'}} />;
  return <ErrorBoundary><AppShell /></ErrorBoundary>;
}