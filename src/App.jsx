import { useEffect, useState } from 'react';
import { useStore } from './data/store';
import { supabase } from './data/supabaseClient';
import AppShell from './auth/AppShell';
import SplashScreen from './components/SplashScreen'; // Re-using splash as loader

export default function App() {
  const { setUser, setTheme } = useStore();
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    const initApp = async () => {
        // 1. Get Session
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);

        // 2. Set Theme
        const savedTheme = localStorage.getItem('aalap-theme') || 'paper';
        document.body.className = `theme-${savedTheme}`;
        setTheme(savedTheme);

        // 3. Mark Ready
        setSessionChecked(true);
    };

    initApp();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, [setUser, setTheme]);

  // CRITICAL FIX: Do not render AppShell until we know who the user is
  if (!sessionChecked) return null; 

  return <AppShell />;
}