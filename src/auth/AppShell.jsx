import { useEffect } from 'react';
import { useStore } from '../data/store';
import { supabase } from '../data/supabaseClient';
import Feed from '../posts/Feed';
import Studio from '../posts/Studio';
import Reader from '../posts/Reader';
import Profile from '../profile/Profile';
import AuthorProfile from '../profile/AuthorProfile';
import Notifications from '../profile/Notifications';
import EchoChamber from '../posts/EchoChamber';
import { SideNav, BottomNav } from '../components/Navigation';
import { Toaster } from 'react-hot-toast';

export default function AppShell() {
  const { view, viewData, setView, activeTab, setTab } = useStore();
  
  useEffect(() => {
    const handlePopState = (event) => {
        if (event.state?.view) { setView(event.state.view, event.state.viewData); if (event.state.tab) setTab(event.state.tab); }
        else setView('main');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setView, setTab]);

  return (
    <div className="main-layout">
      <Toaster position="top-center" toastOptions={{ style: { background: '#333', color: '#fff' } }} />
      <SideNav activeTab={activeTab} setTab={setTab} />
      <main className="main-content">
         <div className="mobile-only" style={{textAlign:'center',marginBottom:20}}><h2>aalap</h2></div>
         {view === 'main' ? (
            <>
              {activeTab === 'home' && <Feed type="community" />}
              {activeTab === 'bookmarks' && <Feed type="bookmarks" />}
              {activeTab === 'write' && <Studio />}
              {activeTab === 'notifications' && <Notifications />}
              {activeTab === 'profile' && <Profile />}
            </>
         ) : (
            <div style={{ background: '#000', minHeight: '100vh', position: 'relative', zIndex: 200 }}>
                {view === 'studio' && <Studio />}
                {view === 'reader' && <Reader post={viewData} />}
                {view === 'author' && <AuthorProfile authorId={viewData} />}
            </div>
         )}
      </main>
      {view === 'echo' && <EchoChamber post={viewData} onClose={() => window.history.back()} />}
      <BottomNav activeTab={activeTab} setTab={setTab} />
    </div>
  );
}