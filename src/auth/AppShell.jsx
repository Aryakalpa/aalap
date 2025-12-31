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

  // PHASE 22 ROUTING LOGIC
  useEffect(() => {
    if (theme === 'paper') document.body.classList.add('theme-paper');
    
    // Deep Linking
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('post');
    if (postId) {
        supabase.from('posts').select(`*, profiles(*)`).eq('id', postId).single().then(({data}) => {
            if (data) setView('reader', data);
        });
    }

    // Back Button Handling
    const handlePopState = (e) => {
        if (e.state?.view) {
            setView(e.state.view, e.state.viewData);
            if(e.state.tab) setTab(e.state.tab);
        } else {
            setView('main');
        }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update URL on View Change
  useEffect(() => {
     if (view === 'reader' && viewData?.id) {
         const url = `${window.location.pathname}?post=${viewData.id}`;
         if(window.location.search !== `?post=${viewData.id}`) window.history.pushState({view, viewData, tab: activeTab}, '', url);
     } else if (view === 'main') {
         if(window.location.search) window.history.pushState({view, viewData: null, tab: activeTab}, '', window.location.pathname);
     }
  }, [view, viewData]);

  return (
    <div className="main-layout">
      <Toaster position="top-center" toastOptions={{ style: { background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-light)' } }} />
      <SideNav activeTab={activeTab} setTab={setTab} />
      
      <main className="main-content">
        <div className="mobile-header">
           <img src={nameLogo} alt="Logo" style={{ height: 26, filter: theme === 'night' ? 'invert(1)' : 'none' }} />
           <button onClick={toggleTheme} style={{ padding: 8 }}>
              {theme === 'night' ? <Sun size={20} /> : <Moon size={20} />}
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
           <div style={{ position: 'relative', zIndex: 50 }}>
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