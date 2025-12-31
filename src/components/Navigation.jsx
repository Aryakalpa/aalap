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
      <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 40 }}>aalap</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {navItems.map((item) => (
          <button key={item.id} onClick={() => setTab(item.id)} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px', background: activeTab === item.id ? 'rgba(128,128,128,0.1)' : 'transparent', color: activeTab === item.id ? 'inherit' : 'rgba(128,128,128,0.7)', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 600 }}>
            <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} /> <span style={{ fontFamily: 'Inter' }}>{item.label}</span>
          </button>
        ))}
      </div>
      <div onClick={() => setTab('profile')} style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', padding: 10 }}>
        <Avatar url={user?.user_metadata?.avatar_url} size={36} />
        <div>
           <div style={{ fontWeight: 'bold', fontSize: 14, fontFamily: 'Inter' }}>{user ? (user.user_metadata?.full_name || 'User') : 'Guest'}</div>
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
        <button key={item.id} onClick={() => setTab(item.id)} className="haptic-btn" style={{ color: activeTab === item.id ? 'inherit' : 'rgba(128,128,128,0.6)' }}>
          <item.icon size={24} strokeWidth={activeTab === item.id ? 2.5 : 2} />
        </button>
      ))}
      <div onClick={() => setTab('profile')}><Avatar url={user?.user_metadata?.avatar_url} size={26} /></div>
    </nav>
  );
}