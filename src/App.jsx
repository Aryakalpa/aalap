import { useEffect, useState } from 'react';
import { useStore } from './data/store';
import { supabase } from './data/supabaseClient';
import AuthScreen from './auth/AuthScreen';
import AppShell from './auth/AppShell';
import './styles/globals.css';

// V5.0 FONT LOADING
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/noto-serif-bengali/400.css';
import '@fontsource/noto-serif-bengali/700.css';
import '@fontsource/noto-serif-bengali/900.css';

export default function App() {
  const { initAuth, theme, setTheme } = useStore();
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setSession(session); if (session) initAuth(); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => { setSession(session); if (session) initAuth(); });
    setTheme(theme);
    return () => subscription.unsubscribe();
  }, []);

  return session ? <AppShell /> : <AuthScreen />;
}