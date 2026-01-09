import { Home, Bookmark, PenTool, Bell, Sun, Moon } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';
import { useStore } from '../data/store';
import Avatar from './Avatar';
import nameLogo from '../assets/namelogo.png';

export function SideNav() {
  const { user, theme, toggleTheme, unreadCount } = useStore();

  // UPDATED: Pure Assamese Labels
  const items = [
    { id: 'home', icon: Home, label: 'মুখ্য পৃষ্ঠা', path: '/' },
    { id: 'bookmarks', icon: Bookmark, label: 'সংৰক্ষিত', path: '/bookmarks' },
    { id: 'write', icon: PenTool, label: 'লিখক', path: '/write' },
    { id: 'notifications', icon: Bell, label: 'জাননী', path: '/notifications' },
  ];

  return (
    <aside className="side-nav">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
        <img src={nameLogo} alt="Aalap" style={{ height: 28, filter: theme === 'night' ? 'invert(1)' : 'none' }} />
        <button onClick={toggleTheme} className="btn-icon" style={{ background: 'var(--btn-soft)', borderRadius: '50%' }}>
          {theme === 'night' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {items.map(i => (
          <NavLink
            key={i.id}
            to={i.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            style={{ position: 'relative' }}
          >
            <i.icon size={20} /> {i.label}
            {i.id === 'notifications' && unreadCount > 0 && (
              <div style={{
                position: 'absolute', top: 10, left: 30, width: 8, height: 8,
                borderRadius: '50%', background: 'var(--danger)', border: '1px solid var(--bg-card)'
              }} />
            )}
          </NavLink>
        ))}
      </div>

      <NavLink to="/profile" className="nav-item" style={{ marginTop: 'auto', background: 'var(--btn-soft)' }}>
        <Avatar url={user?.user_metadata?.avatar_url} size={32} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.2 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>
            {user ? user.user_metadata?.full_name?.split(' ')[0] : 'অতিথি'}
          </span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {user ? 'প্ৰ’ফাইল' : 'লগ-ইন'}
          </span>
        </div>
      </NavLink>
    </aside>
  );
}

export function BottomNav() {
  const { user, unreadCount } = useStore();
  const icons = [
    { id: 'home', icon: Home, path: '/' },
    { id: 'bookmarks', icon: Bookmark, path: '/bookmarks' },
    { id: 'write', icon: PenTool, path: '/write' },
    { id: 'notifications', icon: Bell, path: '/notifications' }
  ];

  return (
    <nav className="bottom-nav">
      {icons.map(i => (
        <NavLink
          key={i.id}
          to={i.path}
          className="btn-icon"
          style={({ isActive }) => ({ color: isActive ? 'var(--text-main)' : 'var(--text-muted)', position: 'relative' })}
        >
          {({ isActive }) => (
            <>
              <i.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              {i.id === 'notifications' && unreadCount > 0 && (
                <div style={{
                  position: 'absolute', top: 12, right: 12, width: 8, height: 8,
                  borderRadius: '50%', background: 'var(--danger)', border: '1px solid var(--bg-card)'
                }} />
              )}
            </>
          )}
        </NavLink>
      ))}
      <NavLink to="/profile" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Avatar url={user?.user_metadata?.avatar_url} size={28} />
      </NavLink>
    </nav>
  );
}