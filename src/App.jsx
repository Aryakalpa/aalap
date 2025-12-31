import { useEffect, useState } from 'react';
import { useStore } from './data/store';
import { supabase } from './data/supabaseClient';
import AppShell from './auth/AppShell';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  const { setUser, setTheme } = useStore();
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    const initApp = async () => {
        // 1. Session Check
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);

        // 2. Theme Enforcement (Default to Night for safety)
        const savedTheme = localStorage.getItem('aalap-theme') || 'night';
        document.body.className = `theme-${savedTheme}`;
        setTheme(savedTheme);

        setSessionChecked(true);
    };

    initApp();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, [setUser, setTheme]);

  if (!sessionChecked) return null;

  return (
    <ErrorBoundary>
      <AppShell />
    </ErrorBoundary>
  );
}