import { Home, Bookmark, Bell, PenTool, User } from 'lucide-react';
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

  // Safe User Data Access
  const avatarUrl = user?.user_metadata?.avatar_url;
  const displayName = user?.user_metadata?.full_name || 'Author';

  return (
    <nav className="side-nav">
      <div style={{ marginBottom: '40px', paddingLeft: '12px' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>
          aalap
        </h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '12px 16px', borderRadius: '12px',
                background: isActive ? 'var(--surface-2)' : 'transparent',
                color: isActive ? 'var(--text)' : 'var(--text-sec)',
                border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: isActive ? 600 : 500
              }}
            >
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              {item.label}
            </button>
          );
        })}
      </div>

      <div onClick={() => setTab('profile')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', cursor: 'pointer', marginTop: 'auto' }}>
        {user ? (
             <Avatar url={avatarUrl} size={36} />
        ) : (
             <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--surface-2)', display: 'grid', placeItems: 'center' }}>
                <User size={20} color="var(--text-sec)" />
             </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>{user ? displayName : 'Guest'}</span>
          <span style={{ fontSize: '12px', color: 'var(--text-sec)' }}>{user ? 'View Profile' : 'Tap to Login'}</span>
        </div>
      </div>
    </nav>
  );
}

export function BottomNav({ activeTab, setTab }) {
  const { user } = useStore();
  const avatarUrl = user?.user_metadata?.avatar_url;

  const navItems = [
    { id: 'home', icon: Home },
    { id: 'bookmarks', icon: Bookmark },
    { id: 'write', icon: PenTool },
    { id: 'notifications', icon: Bell },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className="haptic-btn"
            style={{
              background: 'none', border: 'none', padding: '10px',
              color: isActive ? 'var(--text)' : 'var(--text-sec)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
          </button>
        );
      })}
      
      <div onClick={() => setTab('profile')} style={{ padding: '5px' }}>
         {user ? (
             <Avatar url={avatarUrl} size={28} />
         ) : (
             <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--surface-2)', display: 'grid', placeItems: 'center' }}>
                <User size={16} color="var(--text-sec)" />
             </div>
         )}
      </div>
    </nav>
  );
}