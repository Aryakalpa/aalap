import { Home, Bookmark, Bell, PenTool } from 'lucide-react';
import { useStore } from '../data/store';
import Avatar from './Avatar';

export function SideNav({ activeTab, setTab }) {
  const { user } = useStore();
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'bookmarks', icon: Bookmark, label: 'Saved' },
    { id: 'write', icon: PenTool, label: 'Write' },
    { id: 'notifications', icon: Bell, label: 'Notifs' },
  ];
  return (
    <nav className="side-nav">
      <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 40 }}>aalap</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {navItems.map((item) => (
          <button key={item.id} onClick={() => setTab(item.id)} style={{ display: 'flex', alignItems: 'center', gap: 15, padding: 12, background: activeTab === item.id ? '#222' : 'transparent', color: activeTab === item.id ? '#fff' : '#888', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 600 }}>
            <item.icon size={20} /> {item.label}
          </button>
        ))}
      </div>
      <div onClick={() => setTab('profile')} style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: 10 }}>
        <Avatar url={user?.user_metadata?.avatar_url} size={32} />
        <div>
           <div style={{ fontWeight: 'bold', fontSize: 14 }}>{user ? (user.user_metadata?.full_name || 'User') : 'Guest'}</div>
        </div>
      </div>
    </nav>
  );
}

export function BottomNav({ activeTab, setTab }) {
  const { user } = useStore();
  const navItems = [{ id: 'home', icon: Home }, { id: 'bookmarks', icon: Bookmark }, { id: 'write', icon: PenTool }, { id: 'notifications', icon: Bell }];
  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <button key={item.id} onClick={() => setTab(item.id)} className="haptic-btn" style={{ color: activeTab === item.id ? '#fff' : '#666' }}>
          <item.icon size={24} strokeWidth={activeTab === item.id ? 2.5 : 2} />
        </button>
      ))}
      <div onClick={() => setTab('profile')}><Avatar url={user?.user_metadata?.avatar_url} size={26} /></div>
    </nav>
  );
}