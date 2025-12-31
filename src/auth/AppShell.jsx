import { useState, useEffect, useRef } from 'react';
import { useStore } from '../data/store';
import { supabase } from '../data/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import Feed from '../posts/Feed';
import Studio from '../posts/Studio';
import Reader from '../posts/Reader';
import Profile from '../profile/Profile';
import AuthorProfile from '../profile/AuthorProfile';
import EditProfile from '../profile/EditProfile';
import SettingsScreen from '../profile/SettingsScreen';
import PrivacyScreen from '../profile/PrivacyScreen';
import Notifications from '../profile/Notifications';
import EchoChamber from '../posts/EchoChamber';
import { SideNav, BottomNav } from '../components/Navigation';
import UpdatePrompt from '../components/UpdatePrompt';
import SplashScreen from '../components/SplashScreen';
import { Toaster } from 'react-hot-toast';
import nameLogo from '../assets/namelogo.png';
import { useScrollDirection } from '../hooks/useScrollDirection';

export default function AppShell() {
  const { view, viewData, setView, theme, activeTab, setTab, user } = useStore(); // Using Store Tab
  const [loading, setLoading] = useState(true);
  const scrollDir = useScrollDirection(); 
  const showNav = view === 'main' && (scrollDir === 'up' || !scrollDir);

  // AUTH GUARD FOR NOTIFICATIONS & STUDIO
  useEffect(() => {
    if (!user && (activeTab === 'notifications' || activeTab === 'write')) {
        // If guest tries to go here, force them to profile (Login)
        setTab('profile');
    }
  }, [activeTab, user, setTab]);

  const isPopping = useRef(false);

  useEffect(() => {
    window.history.replaceState({ view: 'main', tab: 'home' }, '');
  }, []);

  useEffect(() => {
    const handlePopState = (event) => {
        if (event.state) {
            isPopping.current = true;
            if (event.state.view) setView(event.state.view, event.state.viewData);
            if (event.state.view === 'main' && event.state.tab) setTab(event.state.tab);
        } else {
            setView('main');
        }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setView, setTab]);

  useEffect(() => {
    if (isPopping.current) { isPopping.current = false; return; }
    if (view === 'echo') window.history.pushState({ view, viewData, tab: activeTab }, '');
    else window.history.pushState({ view, viewData, tab: activeTab }, '');
  }, [view, viewData, activeTab]);

  useEffect(() => {
    const handleDeepLink = async () => {
        const params = new URLSearchParams(window.location.search);
        const postId = params.get('post');
        if (postId) {
            const { data } = await supabase.from('posts').select(`*, profiles(*)`).eq('id', postId).single();
            if (data) { 
                setLoading(false); 
                setView('reader', data); 
                window.history.replaceState({ view: 'main', tab: 'home' }, '');
                window.history.pushState({ view: 'reader', viewData: data }, '');
            }
        }
    };
    handleDeepLink();
  }, [setView]);

  if (loading) return <SplashScreen onComplete={() => setLoading(false)} />;

  return (
    <div className="main-layout">
      <Toaster position="top-center" containerStyle={{ zIndex: 99999 }} />
      <UpdatePrompt /> 
      <SideNav activeTab={activeTab} setTab={setTab} />
      
      <AnimatePresence mode='wait'>
        {view !== 'main' && view !== 'echo' && (
          <motion.div 
            key={view} 
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} 
            className="app-stage" style={{ background: 'var(--bg)', zIndex: 200 }}
          >
            {view === 'studio' && <Studio />}
            {view === 'reader' && <Reader post={viewData} />}
            {view === 'author' && <AuthorProfile authorId={viewData} />}
            {view === 'edit-profile' && <EditProfile />}
            {view === 'settings' && <SettingsScreen />}
            {view === 'privacy' && <PrivacyScreen />}
          </motion.div>
        )}

        {view === 'main' && (
          <motion.main key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="app-stage main-content">
             <motion.div className="mobile-only" animate={{ y: showNav ? 0 : -100, opacity: showNav ? 1 : 0 }} transition={{ duration: 0.4 }} style={{ marginBottom: '30px', paddingTop: '10px', display: 'flex', justifyContent: 'center', position: 'sticky', top: 0, zIndex: 40 }}>
               <img src={nameLogo} alt="Aalap" style={{ height: '35px', filter: theme === 'night' ? 'invert(1)' : 'none', transition: 'filter 0.3s ease' }} />
             </motion.div>
             {activeTab === 'home' && <Feed type="community" />}
             {activeTab === 'bookmarks' && <Feed type="bookmarks" />}
             {activeTab === 'notifications' && <Notifications />} 
             {activeTab === 'profile' && <Profile />}
          </motion.main>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {view === 'echo' && <EchoChamber post={viewData} onClose={() => window.history.back()} />}
      </AnimatePresence>

      <motion.div animate={{ y: showNav ? 0 : 100, opacity: showNav ? 1 : 0 }} transition={{ duration: 0.4 }} style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, pointerEvents: showNav ? 'auto' : 'none' }}>
        <BottomNav activeTab={activeTab} setTab={setTab} />
      </motion.div>
    </div>
  );
}