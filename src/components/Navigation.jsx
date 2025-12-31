import { Home, Edit3, User, Search, Bookmark } from 'lucide-react';
import { useStore } from '../data/store';
import { useHaptic } from '../hooks/useHaptic';
import nameLogo from '../assets/namelogo.png';

export const SideNav = ({ activeTab, setTab }) => {
  const { signOut, setView, theme } = useStore();
  const haptic = useHaptic();
  const handleTab = (id) => { haptic.tap(); setTab(id); };

  const menu = [
    { id: 'home', icon: Home, label: 'চৰাঘৰ' },
    { id: 'search', icon: Search, label: 'অনুসন্ধান', action: () => setView('search') },
    { id: 'bookmarks', icon: Bookmark, label: 'সাঁচি থোৱা' },
    { id: 'profile', icon: User, label: 'পৰিচয়' },
  ];

  return (
    <nav className="side-nav">
      <img src={nameLogo} alt="Aalap" style={{ height: '40px', objectFit: 'contain', marginBottom: '40px', alignSelf: 'flex-start', filter: theme === 'night' ? 'invert(1)' : 'none', opacity: 0.9 }} />
      <div style={{ flex: 1 }}>
        {menu.map(item => (
          <button key={item.id} onClick={() => item.action ? item.action() : handleTab(item.id)} className="haptic-btn"
            style={{ 
              display: 'flex', alignItems: 'center', gap: '15px', width: '100%', padding: '12px 16px', marginBottom: '8px', borderRadius: '12px', cursor: 'pointer',
              background: activeTab === item.id ? 'var(--badge-bg)' : 'transparent',
              border: 'none',
              color: activeTab === item.id ? 'var(--accent)' : 'var(--text-sec)',
              fontWeight: activeTab === item.id ? 700 : 500,
              fontSize: '17px', fontFamily: 'var(--font-serif)',
            }}>
            <item.icon size={20} strokeWidth={2} /> {item.label}
          </button>
        ))}
        <button onClick={() => { haptic.success(); setView('studio'); }} className="haptic-btn" style={{ marginTop: '30px', width: '100%', padding: '14px', background: 'var(--accent)', color: 'var(--bg)', border: 'none', borderRadius: '16px', fontWeight: 600, display: 'flex', justifyContent: 'center', gap: '10px', cursor: 'pointer', boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }}>
          <Edit3 size={18} /> <span style={{ fontFamily: 'var(--font-serif)', fontSize: '16px' }}>সৃজন</span>
        </button>
      </div>
    </nav>
  );
};

export const BottomNav = ({ activeTab, setTab }) => {
  const { setView } = useStore();
  const haptic = useHaptic();
  const handleTab = (id) => { haptic.tap(); setTab(id); };
  
  // Custom Icon Wrapper for active state animation
  const NavItem = ({ id, Icon, isAction, isSearch }) => {
    const isActive = activeTab === id && !isAction && !isSearch;
    return (
      <div onClick={() => { if(isAction) setView('studio'); else if(isSearch) setView('search'); else handleTab(id); }} className="haptic-btn" 
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', width: '48px', height: '48px' }}>
        
        {/* Active Indicator Dot */}
        {isActive && <div style={{ position: 'absolute', bottom: '5px', width: '4px', height: '4px', background: 'var(--accent)', borderRadius: '50%' }}></div>}
        
        <div style={{ 
            background: isAction ? 'var(--accent)' : 'transparent', 
            padding: isAction ? '10px' : '0', borderRadius: '50%', 
            color: isAction ? 'var(--bg)' : (isActive ? 'var(--accent)' : 'var(--text-sec)'),
            boxShadow: isAction ? '0 4px 15px rgba(0,0,0,0.2)' : 'none',
            transform: isAction ? 'translateY(-15px)' : 'none' // Floats the Write button
        }}>
          <Icon size={isAction ? 22 : 24} strokeWidth={isActive ? 2.5 : 2} />
        </div>
      </div>
    );
  };

  return (
    <nav className="bottom-nav">
      <NavItem id="home" Icon={Home} />
      <NavItem id="search" Icon={Search} isSearch />
      <NavItem id="write" Icon={Edit3} isAction />
      <NavItem id="bookmarks" Icon={Bookmark} />
      <NavItem id="profile" Icon={User} />
    </nav>
  );
};