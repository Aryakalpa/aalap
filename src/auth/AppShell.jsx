import { useState, useEffect } from 'react';
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
import EchoChamber from '../posts/EchoChamber'; // NEW
import { SideNav, BottomNav } from '../components/Navigation';
import UpdatePrompt from '../components/UpdatePrompt';
import SplashScreen from '../components/SplashScreen';
import { Toaster } from 'react-hot-toast';
import nameLogo from '../assets/namelogo.png';
import { useScrollDirection } from '../hooks/useScrollDirection';

export default function AppShell() {
  const { view, viewData, setView, theme } = useStore();
  const [tab, setTab] = useState('home');
  const [loading, setLoading] = useState(true);
  const scrollDir = useScrollDirection(); 
  const showNav = view === 'main' && (scrollDir === 'up' || !scrollDir);

  useEffect(() => {
    const handleDeepLink = async () => {
        const params = new URLSearchParams(window.location.search);
        const postId = params.get('post');
        if (postId) {
            const { data } = await supabase.from('posts').select(`*, profiles(*)`).eq('id', postId).single();
            if (data) { setLoading(false); setView('reader', data); }
        }
    };
    handleDeepLink();
  }, [setView]);

  useEffect(() => {
    if (view !== 'main' && view !== 'echo') { 
        // Logic for history navigation
    } 
    const handlePopState = () => { if (view !== 'main') { setView('main'); window.history.pushState({}, '', window.location.pathname); } };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [view, setView]);

  if (loading) return <SplashScreen onComplete={() => setLoading(false)} />;

  return (
    <div className="main-layout">
      <Toaster position="top-center" containerStyle={{ zIndex: 99999 }} />
      <UpdatePrompt /> 
      <SideNav activeTab={tab} setTab={setTab} />
      
      <AnimatePresence mode='wait'>
        {/* MODAL VIEWS */}
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

        {/* MAIN FEED */}
        {view === 'main' && (
          <motion.main key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="app-stage main-content">
             <motion.div className="mobile-only" animate={{ y: showNav ? 0 : -100, opacity: showNav ? 1 : 0 }} transition={{ duration: 0.4 }} style={{ marginBottom: '30px', paddingTop: '10px', display: 'flex', justifyContent: 'center', position: 'sticky', top: 0, zIndex: 40 }}>
               <img src={nameLogo} alt="Aalap" style={{ height: '35px', filter: theme === 'night' ? 'invert(1)' : 'none', transition: 'filter 0.3s ease' }} />
             </motion.div>
             {tab === 'home' && <Feed type="community" />}
             {tab === 'bookmarks' && <Feed type="bookmarks" />}
             {tab === 'notifications' && <Notifications />} 
             {tab === 'profile' && <Profile />}
          </motion.main>
        )}
      </AnimatePresence>

      {/* ECHO CHAMBER OVERLAY */}
      <AnimatePresence>
        {view === 'echo' && (
             <EchoChamber post={viewData} onClose={() => setView('main')} />
        )}
      </AnimatePresence>

      <motion.div animate={{ y: showNav ? 0 : 100, opacity: showNav ? 1 : 0 }} transition={{ duration: 0.4 }} style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, pointerEvents: showNav ? 'auto' : 'none' }}>
        <BottomNav activeTab={tab} setTab={setTab} />
      </motion.div>
    </div>
  );
}