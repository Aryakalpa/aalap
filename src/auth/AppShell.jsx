import { useEffect } from 'react';
import { useStore } from '../data/store';
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

  useEffect(() => {
    if (theme === 'paper') document.body.classList.add('theme-paper');
    const handlePopState = (e) => { if(e.state?.view) { setView(e.state.view, e.state.viewData); if(e.state.tab) setTab(e.state.tab); } else setView('main'); };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div className="main-layout">
      <Toaster position="top-center" toastOptions={{ style: { background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-light)' } }} />
      <SideNav activeTab={activeTab} setTab={setTab} />
      
      <main className="main-content">
        <div className="mobile-header">
           <img src={nameLogo} alt="Aalap" style={{ height: 28, filter: theme === 'night' ? 'invert(1)' : 'none' }} />
           <button onClick={toggleTheme} className="theme-toggle">
              {theme === 'night' ? <Sun size={18} /> : <Moon size={18} />}
           </button>
        </div>

        {view === 'main' ? (
           <>
              {activeTab === 'home' && <Feed type="community" />}
              {activeTab === 'bookmarks' && <Feed type="bookmarks" />}
              {activeTab === 'write' && <Studio />}
              {activeTab === 'notifications' && <Notifications />}
              {activeTab === 'profile' && <Profile />}
           </>
        ) : (
           <div style={{ position: 'relative', zIndex: 10 }}>
              {view === 'studio' && <Studio />}
              {view === 'reader' && <Reader post={viewData} />}
              {view === 'author' && <AuthorProfile authorId={viewData} />}
              {view === 'edit-profile' && <EditProfile />}
              {view === 'settings' && <SettingsScreen />}
           </div>
        )}
      </main>
      
      {view === 'echo' && <EchoChamber post={viewData} onClose={() => window.history.back()} />}
      <BottomNav activeTab={activeTab} setTab={setTab} />
    </div>
  );
}