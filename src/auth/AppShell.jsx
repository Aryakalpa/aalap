import { useState, useEffect, useRef } from 'react';
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
import { useScrollDirection } from '../hooks/useScrollDirection';

export default function AppShell() {
  const { view, viewData, setView, theme, activeTab, setTab, user } = useStore();
  const scrollDir = useScrollDirection(); 
  const showNav = view === 'main' && (scrollDir === 'up' || !scrollDir);

  // AUTH GUARD
  useEffect(() => {
    if (!user && (activeTab === 'notifications' || activeTab === 'write')) {
        setTab('profile');
    }
  }, [activeTab, user, setTab]);

  // HISTORY
  const isPopping = useRef(false);
  useEffect(() => { window.history.replaceState({ view: 'main', tab: 'home' }, ''); }, []);
  useEffect(() => {
    const handlePopState = (event) => {
        if (event.state) {
            isPopping.current = true;
            if (event.state.view) setView(event.state.view, event.state.viewData);
            if (event.state.view === 'main' && event.state.tab) setTab(event.state.tab);
        } else { setView('main'); }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setView, setTab]);

  useEffect(() => {
    if (isPopping.current) { isPopping.current = false; return; }
    window.history.pushState({ view, viewData, tab: activeTab }, '');
  }, [view, viewData, activeTab]);

  // DEEP LINK
  useEffect(() => {
    const handleDeepLink = async () => {
        const params = new URLSearchParams(window.location.search);
        const postId = params.get('post');
        if (postId) {
            const { data } = await supabase.from('posts').select(`*, profiles(*)`).eq('id', postId).single();
            if (data) { 
                setView('reader', data); 
                window.history.replaceState({ view: 'main', tab: 'home' }, '');
                window.history.pushState({ view: 'reader', viewData: data }, '');
            }
        }
    };
    handleDeepLink();
  }, [setView]);

  return (
    <div className="main-layout">
      <Toaster position="top-center" containerStyle={{ zIndex: 99999 }} />
      <UpdatePrompt /> 
      <SideNav activeTab={activeTab} setTab={setTab} />
      
      {/* 1. OVERLAYS (Full Screen Views) */}
      {view !== 'main' && view !== 'echo' && (
          <div className="app-stage" style={{ background: 'var(--bg)', zIndex: 200, position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', overflowY: 'auto' }}>
            {view === 'studio' && <Studio />}
            {view === 'reader' && <Reader post={viewData} />}
            {view === 'author' && <AuthorProfile authorId={viewData} />}
            {view === 'edit-profile' && <EditProfile />}
            {view === 'settings' && <SettingsScreen />}
            {view === 'privacy' && <PrivacyScreen />}
          </div>
      )}

      {/* 2. MAIN FEED (Always Rendered if view is main) */}
      {view === 'main' && (
          <main className="app-stage main-content" style={{ display: 'block', opacity: 1 }}>
             <div className="mobile-only" style={{ marginBottom: '30px', paddingTop: '10px', display: 'flex', justifyContent: 'center', position: 'sticky', top: 0, zIndex: 40, transition: 'transform 0.3s', transform: showNav ? 'translateY(0)' : 'translateY(-100%)' }}>
               <img src={nameLogo} alt="Aalap" style={{ height: '35px', filter: theme === 'night' ? 'invert(1)' : 'none' }} />
             </div>
             
             {/* RENDER ACTIVE TAB DIRECTLY */}
             {activeTab === 'home' && <Feed type="community" />}
             {activeTab === 'bookmarks' && <Feed type="bookmarks" />}
             {activeTab === 'notifications' && <Notifications />} 
             {activeTab === 'profile' && <Profile />}
          </main>
      )}

      {/* 3. ECHO CHAMBER */}
      {view === 'echo' && <EchoChamber post={viewData} onClose={() => window.history.back()} />}

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, transition: 'transform 0.3s', transform: showNav ? 'translateY(0)' : 'translateY(100%)' }}>
        <BottomNav activeTab={activeTab} setTab={setTab} />
      </div>
    </div>
  );
}