import { useEffect } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
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
import SearchScreen from '../components/SearchScreen';
import ShareSheet from '../components/ShareSheet';
import { SideNav, BottomNav } from '../components/Navigation';
import { Toaster } from 'react-hot-toast';
import nameLogo from '../assets/namelogo.png';
import { Sun, Moon } from 'lucide-react';

function Layout() {
  const { theme, toggleTheme } = useStore();

  return (
    <div className="app-wrapper">
      <Toaster position="top-center" toastOptions={{ style: { background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-light)' } }} />
      <SideNav />

      <div className="mobile-header">
        <img src={nameLogo} alt="Logo" style={{ height: 24, filter: theme === 'night' ? 'invert(1)' : 'none' }} />
        <button onClick={toggleTheme} className="btn-icon">
          {theme === 'night' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <main className="main-container">
        <Outlet />
      </main>

      <ShareSheet />
      <BottomNav />
    </div>
  );
}

export default function AppShell() {
  const { theme } = useStore();

  useEffect(() => {
    if (theme === 'paper') document.documentElement.classList.add('theme-paper');
  }, [theme]);

  // Handle legacy URL params (if someone shares an old link)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('post');
    if (postId) {
      // We could redirect here if we wanted, but for now we rely on the router. 
      // Ideally we redirect /?post=123 to /post/123
      window.history.replaceState(null, '', `/post/${postId}`);
    }
  }, []);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Feed type="community" />} />
        <Route path="/bookmarks" element={<Feed type="bookmarks" />} />
        <Route path="/write" element={<Studio />} />
        <Route path="/studio/:id" element={<Studio />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/settings" element={<SettingsScreen />} />
        <Route path="/search" element={<SearchScreen />} />
        <Route path="/post/:id" element={<Reader />} />
        <Route path="/post/:id/comments" element={<EchoChamber />} />
        <Route path="/author/:id" element={<AuthorProfile />} />
      </Route>
    </Routes>
  );
}