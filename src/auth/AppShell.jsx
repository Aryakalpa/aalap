import { useState, useEffect } from 'react';
import { useStore } from '../data/store';
import { supabase } from '../data/supabaseClient';
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
import { Toaster } from 'react-hot-toast';
import nameLogo from '../assets/namelogo.png';

export default function AppShell() {
  const { view, viewData, setView, activeTab, setTab } = useStore();

  // HISTORY LOGIC
  useEffect(() => {
    const handlePopState = (event) => {
        if (event.state && event.state.view) {
            setView(event.state.view, event.state.viewData);
            if (event.state.tab) setTab(event.state.tab);
        } else {
            setView('main');
        }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setView, setTab]);

  return (
    <div className="main-layout">
      <Toaster position="top-center" />
      <UpdatePrompt /> 
      
      {/* 1. SIDE NAV (Desktop) */}
      <SideNav activeTab={activeTab} setTab={setTab} />
      
      {/* 2. MAIN CONTENT ZONE */}
      <main className="main-content">
         {/* LOGO HEADER (Mobile) */}
         <div className="mobile-only" style={{ textAlign: 'center', marginBottom: 20, display: 'none' }}>
           <img src={nameLogo} alt="Aalap" style={{ height: 30, filter: 'invert(1)' }} />
         </div>

         {/* ROUTER SWITCH */}
         {view === 'main' ? (
            <>
              {activeTab === 'home' && <Feed type="community" />}
              {activeTab === 'bookmarks' && <Feed type="bookmarks" />}
              {activeTab === 'notifications' && <Notifications />} 
              {activeTab === 'profile' && <Profile />}
            </>
         ) : (
            // FULL SCREEN VIEWS
            <div style={{ background: '#121212', minHeight: '100vh' }}>
                {view === 'studio' && <Studio />}
                {view === 'reader' && <Reader post={viewData} />}
                {view === 'author' && <AuthorProfile authorId={viewData} />}
                {view === 'edit-profile' && <EditProfile />}
                {view === 'settings' && <SettingsScreen />}
                {view === 'privacy' && <PrivacyScreen />}
                {view === 'echo' && <EchoChamber post={viewData} onClose={() => window.history.back()} />}
            </div>
         )}
      </main>

      {/* 3. BOTTOM NAV (Mobile) */}
      <BottomNav activeTab={activeTab} setTab={setTab} />
    </div>
  );
}