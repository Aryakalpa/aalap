import { useEffect } from 'react';
import { useStore } from '../data/store';
import { supabase } from '../data/supabaseClient';
import Feed from '../posts/Feed';
import Studio from '../posts/Studio';
import Reader from '../posts/Reader';
import Profile from '../profile/Profile';
import AuthorProfile from '../profile/AuthorProfile';
import EditProfile from '../profile/EditProfile';
import SettingsScreen from '../profile/SettingsScreen';
import Notifications from '../profile/Notifications';
import EchoChamber from '../posts/EchoChamber';
import { SideNav, BottomNav } from '../components/Navigation';
import { Toaster } from 'react-hot-toast';
import nameLogo from '../assets/namelogo.png';
import { Sun, Moon } from 'lucide-react';

export default function AppShell() {
  const { view, viewData, activeTab, setTab, setView, theme, toggleTheme } = useStore();

  // DEEP LINKING & INITIAL LOAD
  useEffect(() => {
    if (theme === 'paper') document.body.classList.add('theme-paper');
    
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('post');
    if (postId) {
        supabase.from('posts').select(`*, profiles(*)`).eq('id', postId).single().then(({data}) => {
            if (data) setView('reader', data);
        });
    }

    const handlePopState = (e) => {
        if (e.state?.view) {
            setView(e.state.view, e.state.viewData);
            if (e.state.tab) setTab(e.state.tab);
        } else {
            setView('main');
        }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // UPDATE URL ON VIEW CHANGE
  useEffect(() => {
    if (view === 'reader' && viewData?.id) {
        const newUrl = `${window.location.origin}${window.location.pathname}?post=${viewData.id}`;
        if (window.location.href !== newUrl) {
            window.history.pushState({ view, viewData, tab: activeTab }, '', newUrl);
        }
    } else if (view === 'main') {
        const cleanUrl = `${window.location.origin}${window.location.pathname}`;
        if (window.location.href !== cleanUrl) {
            window.history.pushState({ view, viewData: null, tab: activeTab }, '', cleanUrl);
        }
    }
  }, [view, viewData, activeTab]);

  return (
    <div className="main-layout">
      <Toaster position="top-center" toastOptions={{ style: { background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-light)', fontFamily: 'var(--font-serif)' } }} />
      <SideNav activeTab={activeTab} setTab={setTab} />
      
      <main className="main-content">
        <div className="mobile-header">
           <img src={nameLogo} alt="Aalap" style={{ height: 28, filter: theme === 'night' ? 'invert(1)' : 'none' }} />
           <button onClick={toggleTheme} className="theme-toggle">
              {theme === 'night' ? <Sun size={18} /> : <Moon size={18} />}
           </button>
        </div>

        <div style={{ display: view === 'main' ? 'block' : 'none' }}>
            {activeTab === 'home' && <Feed type="community" />}
            {activeTab === 'bookmarks' && <Feed type="bookmarks" />}
            {activeTab === 'write' && <Studio />}
            {activeTab === 'notifications' && <Notifications />}
            {activeTab === 'profile' && <Profile />}
        </div>

        {view !== 'main' && (
           <div style={{ position: 'relative', zIndex: 100 }}>
              {view === 'studio' && <Studio />}
              {view === 'reader' && <Reader post={viewData} />}
              {view === 'author' && <AuthorProfile authorId={viewData} />}
              {view === 'edit-profile' && <EditProfile />}
              {view === 'settings' && <SettingsScreen />}
           </div>
        )}
      </main>
      
      {view === 'echo' && <EchoChamber post={viewData} onClose={() => setView('reader', viewData)} />}
      <BottomNav activeTab={activeTab} setTab={setTab} />
    </div>
  );
}