import { useEffect, useState } from 'react';
import { useStore } from './data/store';
import { supabase } from './data/supabaseClient';
import AppShell from './auth/AppShell';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  const { setUser, setTheme } = useStore();
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    console.log(">>> APP STARTING...");
    
    const initApp = async () => {
        try {
            console.log("   1. Checking Session...");
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) console.error("   ! Session Error:", error);
            
            console.log("   2. User Found:", session?.user ? "YES" : "NO (Guest Mode)");
            setUser(session?.user || null);

            const savedTheme = localStorage.getItem('aalap-theme') || 'paper';
            document.body.className = `theme-${savedTheme}`;
            setTheme(savedTheme);

            setSessionChecked(true);
            console.log("   3. App Ready.");
        } catch (err) {
            console.error("CRITICAL INIT FAILURE:", err);
        }
    };

    initApp();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("   ! Auth State Changed:", _event);
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, [setUser, setTheme]);

  if (!sessionChecked) {
      return <div style={{ display: 'grid', placeItems: 'center', height: '100vh', color: '#888' }}>Starting Aalap...</div>;
  }

  return (
    <ErrorBoundary>
      <AppShell />
    </ErrorBoundary>
  );
}