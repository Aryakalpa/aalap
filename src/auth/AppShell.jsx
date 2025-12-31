import { useState } from 'react';
import { useStore } from '../data/store';
import { motion, AnimatePresence } from 'framer-motion';
import Feed from '../posts/Feed';
import Studio from '../posts/Studio';
import Reader from '../posts/Reader';
import Profile from '../profile/Profile';
import AuthorProfile from '../profile/AuthorProfile';
import EditProfile from '../profile/EditProfile';
import SettingsScreen from '../profile/SettingsScreen'; // NEW
import PrivacyScreen from '../profile/PrivacyScreen';   // NEW
import SearchScreen from '../components/SearchScreen';
import { SideNav, BottomNav } from '../components/Navigation';
import GrainOverlay from '../components/GrainOverlay';
import UpdatePrompt from '../components/UpdatePrompt';
import { Toaster } from 'sonner';
import nameLogo from '../assets/namelogo.png';

export default function AppShell() {
  const { view, viewData, theme } = useStore();
  const [tab, setTab] = useState('home');

  const transition = { type: 'spring', stiffness: 350, damping: 30 };
  
  return (
    <div className="main-layout">
      <GrainOverlay />
      <Toaster position="top-center" toastOptions={{ style: { background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)', fontFamily: 'var(--font-sans)' } }} />
      <UpdatePrompt /> 
      
      <SideNav activeTab={tab} setTab={setTab} />
      
      <AnimatePresence mode='wait'>
        {view !== 'main' && (
          <motion.div key={view} initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.95 }} transition={transition} className="app-stage" style={{ background: 'var(--bg)', zIndex: 200 }}>
            {view === 'studio' && <Studio />}
            {view === 'reader' && <Reader post={viewData} />}
            {view === 'search' && <SearchScreen />}
            {view === 'author' && <AuthorProfile authorId={viewData} />}
            {view === 'edit-profile' && <EditProfile />}
            {view === 'settings' && <SettingsScreen />}
            {view === 'privacy' && <PrivacyScreen />}
          </motion.div>
        )}

        {view === 'main' && (
          <motion.main key={tab} initial={{ opacity: 0, filter: 'blur(10px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, filter: 'blur(10px)' }} transition={{ duration: 0.4 }} className="app-stage main-content">
             <div className="mobile-only" style={{ marginBottom: '30px', paddingTop: '10px', display: 'flex', justifyContent: 'center' }}>
               <img src={nameLogo} alt="Aalap" style={{ height: '35px', filter: theme === 'night' ? 'invert(1)' : 'none', transition: 'filter 0.3s ease' }} />
             </div>
             {tab === 'home' && <Feed type="community" />}
             {tab === 'bookmarks' && <Feed type="bookmarks" />}
             {tab === 'search' && <Feed type="community" />} 
             {tab === 'profile' && <Profile />}
          </motion.main>
        )}
      </AnimatePresence>
      <BottomNav activeTab={tab} setTab={setTab} />
    </div>
  );
}