import { useEffect } from 'react';
import { useStore } from './data/store';
import { supabase } from './data/supabaseClient';
import AppShell from './auth/AppShell';

export default function App() {
  const { setUser, setTheme } = useStore();

  useEffect(() => {
    // 1. Check Session on Load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    // 2. Listen for Auth Changes (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    // 3. Theme System
    const savedTheme = localStorage.getItem('aalap-theme') || 'paper';
    document.body.className = `theme-${savedTheme}`;
    setTheme(savedTheme);

    return () => subscription.unsubscribe();
  }, [setUser, setTheme]);

  // ALWAYS render the AppShell (The Shell will handle guests)
  return <AppShell />;
}