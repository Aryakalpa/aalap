import { Home, Bookmark, PenTool, Bell, Sun, Moon } from 'lucide-react';
import { useStore } from '../data/store';
import Avatar from './Avatar';

export function SideNav({ activeTab, setTab }) {
  const { user, theme, toggleTheme } = useStore();
  
  const items = [
    { id: 'home', icon: Home, label: 'নীড় (Home)' },
    { id: 'bookmarks', icon: Bookmark, label: 'সংৰক্ষিত (Saved)' },
    { id: 'write', icon: PenTool, label: 'লিখক (Write)' },
    { id: 'notifications', icon: Bell, label: 'জাননী (Notifs)' },
  ];

  return (
    <nav className="side-nav">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 40 }}>
         <h1 style={{ fontSize: 28, fontWeight: 900, margin:0, letterSpacing: -1 }}>আলাপ</h1>
         <button onClick={toggleTheme} className="theme-btn" title="Toggle Theme">
            {theme === 'night' ? <Sun size={20} /> : <Moon size={20} />}
         </button>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 'auto' }}>
        {items.map(i => (
          <button 
            key={i.id} onClick={() => setTab(i.id)} 
            className={`nav-btn ${activeTab === i.id ? 'nav-btn-active' : ''}`}
          >
            <i.icon size={20} strokeWidth={2} /> {i.label}
          </button>
        ))}
      </div>

      <button onClick={() => setTab('profile')} className="nav-btn" style={{ marginTop: 20 }}>
        <Avatar url={user?.user_metadata?.avatar_url} size={28} />
        <span style={{ fontSize: 14 }}>{user ? 'My Profile' : 'Login / Guest'}</span>
      </button>
    </nav>
  );
}

export function BottomNav({ activeTab, setTab }) {
  const { user } = useStore();
  const items = [
    { id: 'home', icon: Home },
    { id: 'bookmarks', icon: Bookmark },
    { id: 'write', icon: PenTool },
    { id: 'notifications', icon: Bell },
  ];

  return (
    <nav className="bottom-nav">
      {items.map(i => (
        <button key={i.id} onClick={() => setTab(i.id)} className="haptic-btn" style={{ color: activeTab === i.id ? 'inherit' : '#aaa' }}>
           <i.icon size={26} strokeWidth={activeTab === i.id ? 2.5 : 2} />
        </button>
      ))}
      <button onClick={() => setTab('profile')} className="haptic-btn">
         <Avatar url={user?.user_metadata?.avatar_url} size={28} />
      </button>
    </nav>
  );
}