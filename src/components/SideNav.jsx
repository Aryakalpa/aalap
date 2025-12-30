import { Home, Edit3, User, BookOpen, LogOut, Search } from 'lucide-react';
import { useStore } from '../data/store';

export const SideNav = ({ activeTab, setTab }) => {
  const { signOut, setView } = useStore();

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Search', action: () => setView('search') },
    { id: 'my-writings', icon: BookOpen, label: 'My Writings' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="side-nav">
      <div style={{ padding: '40px' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', margin: 0, color: 'var(--accent)' }}>Aalap.</h1>
      </div>

      <div style={{ flex: 1, padding: '0 20px' }}>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => item.action ? item.action() : setTab(item.id)}
            className="haptic-btn"
            style={{
              display: 'flex', alignItems: 'center', gap: '15px',
              width: '100%', padding: '12px 20px', marginBottom: '8px',
              background: activeTab === item.id ? 'var(--card)' : 'transparent',
              border: activeTab === item.id ? '1px solid var(--border)' : 'none',
              borderRadius: '16px', cursor: 'pointer',
              color: activeTab === item.id ? 'var(--accent)' : 'var(--text-sec)',
              fontWeight: activeTab === item.id ? '700' : '500',
              fontSize: '16px'
            }}
          >
            <item.icon size={22} />
            {item.label}
          </button>
        ))}

        <button onClick={() => setView('studio')} className="haptic-btn" style={{ marginTop: '30px', width: '100%', padding: '16px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '16px', fontWeight: 'bold', fontSize: '16px', display: 'flex', justifyContent: 'center', gap: '10px', cursor: 'pointer' }}>
          <Edit3 size={18} /><span>Write</span>
        </button>
      </div>
      <div style={{ padding: '20px' }}><button onClick={signOut} style={{ display: 'flex', gap: '10px', background: 'none', border: 'none', color: 'var(--text-sec)', cursor: 'pointer', padding: '10px 20px' }}><LogOut size={18} /><span>Sign Out</span></button></div>
    </nav>
  );
};