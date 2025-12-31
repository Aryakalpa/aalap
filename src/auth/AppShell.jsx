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
import { Sun, Moon } from 'lucide-react';

export default function AppShell() {
  const { view, viewData, activeTab, setTab, setView, theme, toggleTheme } = useStore();

  useEffect(() => {
    // Apply Theme on Load
    if (theme === 'paper') document.body.classList.add('theme-paper');
    
    const handlePopState = (e) => {
        if(e.state?.view) { setView(e.state.view, e.state.viewData); if(e.state.tab) setTab(e.state.tab); }
        else setView('main');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div className="main-layout">
      <Toaster position="top-center" toastOptions={{ style: { background: '#333', color: '#fff', fontFamily: 'Noto Serif Bengali' } }} />
      <SideNav activeTab={activeTab} setTab={setTab} />
      
      <main className="main-content">
        {/* MOBILE HEADER with THEME TOGGLE */}
        <div className="mobile-only header-blur">
           <h2 style={{margin:0, fontSize:24, fontWeight:900, letterSpacing:-1}}>আলাপ</h2>
           <button onClick={toggleTheme} className="theme-btn" style={{ width:36, height:36 }}>
              {theme === 'night' ? <Sun size={18} /> : <Moon size={18} />}
           </button>
        </div>

        {view === 'main' ? (
           <div className="animate-fade">
              {activeTab === 'home' && <Feed type="community" />}
              {activeTab === 'bookmarks' && <Feed type="bookmarks" />}
              {activeTab === 'write' && <Studio />}
              {activeTab === 'notifications' && <Notifications />}
              {activeTab === 'profile' && <Profile />}
           </div>
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