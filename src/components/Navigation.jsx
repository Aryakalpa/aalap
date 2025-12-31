import { Home, Bookmark, PenTool, Bell } from 'lucide-react';
import { useStore } from '../data/store';
import Avatar from './Avatar';

export function SideNav({ activeTab, setTab }) {
  const { user } = useStore();
  
  const items = [
    { id: 'home', icon: Home, label: 'নীড় (Home)' },
    { id: 'bookmarks', icon: Bookmark, label: 'সংৰক্ষিত (Saved)' },
    { id: 'write', icon: PenTool, label: 'লিখক (Write)' },
    { id: 'notifications', icon: Bell, label: 'জাননী (Notifs)' },
  ];

  return (
    <nav className="side-nav">
      <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 40, letterSpacing: -1 }}>আলাপ</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 'auto' }}>
        {items.map(i => (
          <button 
            key={i.id} onClick={() => setTab(i.id)} 
            className={`nav-btn ${activeTab === i.id ? 'nav-btn-active' : ''}`}
          >
            <i.icon size={22} strokeWidth={2.5} /> {i.label}
          </button>
        ))}
      </div>

      <button onClick={() => setTab('profile')} className="nav-btn" style={{ marginTop: 20 }}>
        <Avatar url={user?.user_metadata?.avatar_url} size={32} />
        <span>{user ? 'My Profile' : 'Login'}</span>
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
        <button key={i.id} onClick={() => setTab(i.id)} className="haptic-btn" style={{ color: activeTab === i.id ? 'inherit' : '#666' }}>
           <i.icon size={26} strokeWidth={activeTab === i.id ? 2.5 : 2} />
        </button>
      ))}
      <button onClick={() => setTab('profile')} className="haptic-btn">
         <Avatar url={user?.user_metadata?.avatar_url} size={28} />
      </button>
    </nav>
  );
}