import { Home, Bookmark, PlusSquare, Bell, User } from 'lucide-react';
import { useStore } from '../data/store';
import Avatar from './Avatar';

export function SideNav({ activeTab, setTab }) {
  const { user } = useStore();
  const navItems = [
    { id: 'home', icon: Home, label: 'নীড় (Home)' },
    { id: 'bookmarks', icon: Bookmark, label: 'সংৰক্ষিত (Saved)' },
    { id: 'write', icon: PlusSquare, label: 'লিখক (Write)' },
    { id: 'notifications', icon: Bell, label: 'জাননী (Notifs)' },
  ];

  return (
    <nav className="side-nav">
      <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 40, letterSpacing: -1 }}>আলাপ</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {navItems.map((item) => (
          <button 
            key={item.id} onClick={() => setTab(item.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 15, padding: '14px 16px',
              background: activeTab === item.id ? 'var(--bg-secondary)' : 'transparent',
              color: activeTab === item.id ? 'var(--text-primary)' : 'var(--text-secondary)',
              border: 'none', borderRadius: 16, fontSize: 16, fontWeight: 600,
              transition: 'all 0.2s'
            }}
          >
            <item.icon size={22} strokeWidth={activeTab === item.id ? 2.5 : 2} /> 
            <span className="font-ui">{item.label}</span>
          </button>
        ))}
      </div>

      <button onClick={() => setTab('profile')} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10, border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}>
        <Avatar url={user?.user_metadata?.avatar_url} size={40} />
        <div>
           <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }} className="font-ui">{user ? (user.user_metadata?.full_name?.split(' ')[0] || 'User') : 'অতিথি'}</div>
           <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }} className="font-ui">{user ? 'View Profile' : 'Login'}</div>
        </div>
      </button>
    </nav>
  );
}

export function BottomNav({ activeTab, setTab }) {
  const { user } = useStore();
  const navItems = [
    { id: 'home', icon: Home },
    { id: 'bookmarks', icon: Bookmark },
    { id: 'write', icon: PlusSquare },
    { id: 'notifications', icon: Bell },
  ];
  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <button key={item.id} onClick={() => setTab(item.id)} className={`btn-icon ${activeTab === item.id ? 'active' : ''}`}>
          <item.icon size={24} strokeWidth={activeTab === item.id ? 2.5 : 2} />
        </button>
      ))}
      <button onClick={() => setTab('profile')} className={`btn-icon ${activeTab === 'profile' ? 'active' : ''}`}>
          <div style={{borderRadius:'50%', border: activeTab === 'profile' ? '2px solid var(--text-primary)' : 'none', padding: 2}}>
             <Avatar url={user?.user_metadata?.avatar_url} size={24} border={false} />
          </div>
      </button>
    </nav>
  );
}