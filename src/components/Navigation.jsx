import { Home, Bookmark, PenTool, Bell, Sun, Moon } from 'lucide-react';
import { useStore } from '../data/store';
import Avatar from './Avatar';
import nameLogo from '../assets/namelogo.png';

export function SideNav() {
  const { user, activeTab, setTab, theme, toggleTheme } = useStore();
  
  // UPDATED: Pure Assamese Labels
  const items = [
    { id: 'home', icon: Home, label: 'মুখ্য পৃষ্ঠা' },
    { id: 'bookmarks', icon: Bookmark, label: 'সংৰক্ষিত' },
    { id: 'write', icon: PenTool, label: 'লিখক' },
    { id: 'notifications', icon: Bell, label: 'জাননী' },
  ];

  return (
    <aside className="side-nav">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
        <img src={nameLogo} alt="Aalap" style={{ height: 28, filter: theme === 'night' ? 'invert(1)' : 'none' }} />
        <button onClick={toggleTheme} className="btn-icon" style={{ background: 'var(--btn-soft)', borderRadius: '50%' }}>
           {theme === 'night' ? <Sun size={18}/> : <Moon size={18}/>}
        </button>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {items.map(i => (
          <button key={i.id} onClick={() => setTab(i.id)} className={`nav-item ${activeTab === i.id ? 'active' : ''}`}>
            <i.icon size={20} /> {i.label}
          </button>
        ))}
      </div>
      
      <button onClick={() => setTab('profile')} className="nav-item" style={{ marginTop: 'auto', background: 'var(--btn-soft)' }}>
        <Avatar url={user?.user_metadata?.avatar_url} size={32} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.2 }}>
           <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>
              {user ? user.user_metadata?.full_name?.split(' ')[0] : 'অতিথি'}
           </span>
           <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {user ? 'প্ৰ’ফাইল' : 'লগ-ইন'}
           </span>
        </div>
      </button>
    </aside>
  );
}

export function BottomNav() {
  const { activeTab, setTab, user } = useStore();
  const icons = [{ id: 'home', icon: Home }, { id: 'bookmarks', icon: Bookmark }, { id: 'write', icon: PenTool }, { id: 'notifications', icon: Bell }];
  
  return (
    <nav className="bottom-nav">
      {icons.map(i => (
        <button key={i.id} onClick={() => setTab(i.id)} className="btn-icon" style={{ color: activeTab === i.id ? 'var(--text-main)' : 'var(--text-muted)' }}>
          <i.icon size={24} strokeWidth={activeTab === i.id ? 2.5 : 2} />
        </button>
      ))}
      <button onClick={() => setTab('profile')}>
         <Avatar url={user?.user_metadata?.avatar_url} size={28} />
      </button>
    </nav>
  );
}