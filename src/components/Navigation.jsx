import { Home, Edit3, User, Search, Bookmark } from 'lucide-react';
import { useStore } from '../data/store';
import { useHaptic } from '../hooks/useHaptic';
import nameLogo from '../assets/namelogo.png'; // IMPORT LOGO

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
      {/* BRAND LOGO */}
      <img 
        src={nameLogo} 
        alt="Aalap" 
        style={{ 
            height: '45px', 
            objectFit: 'contain', 
            marginBottom: '40px', 
            alignSelf: 'flex-start',
            filter: theme === 'night' ? 'invert(1)' : 'none', // Auto-invert for dark mode
            transition: 'filter 0.3s ease'
        }} 
      />

      <div style={{ flex: 1 }}>
        {menu.map(item => (
          <button key={item.id} onClick={() => item.action ? item.action() : handleTab(item.id)} className="haptic-btn"
            style={{ 
              display: 'flex', alignItems: 'center', gap: '15px', width: '100%', padding: '14px 20px', marginBottom: '8px', borderRadius: '18px', cursor: 'pointer',
              background: activeTab === item.id ? 'var(--card)' : 'transparent',
              border: activeTab === item.id ? '1px solid var(--border)' : 'none',
              color: activeTab === item.id ? 'var(--accent)' : 'var(--text-sec)',
              fontWeight: activeTab === item.id ? 700 : 500,
              fontSize: '18px', fontFamily: 'var(--font-serif)',
              boxShadow: activeTab === item.id ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
            }}>
            <item.icon size={20} /> {item.label}
          </button>
        ))}
        <button onClick={() => { haptic.success(); setView('studio'); }} className="haptic-btn" style={{ marginTop: '30px', width: '100%', padding: '16px', background: 'var(--accent)', color: 'var(--bg)', border: 'none', borderRadius: '20px', fontWeight: 600, display: 'flex', justifyContent: 'center', gap: '10px', cursor: 'pointer', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
          <Edit3 size={18} /> <span style={{ fontFamily: 'var(--font-serif)', fontSize: '18px' }}>সৃজন</span>
        </button>
      </div>
    </nav>
  );
};

export const BottomNav = ({ activeTab, setTab }) => {
  const { setView } = useStore();
  const haptic = useHaptic();
  const handleTab = (id) => { haptic.tap(); setTab(id); };
  
  const NavItem = ({ id, Icon, isAction, isSearch }) => (
    <div onClick={() => { if(isAction) setView('studio'); else if(isSearch) setView('search'); else handleTab(id); }} className="haptic-btn" 
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', cursor: 'pointer', color: activeTab === id && !isAction && !isSearch ? 'var(--accent)' : 'var(--text-sec)' }}>
      <div style={{ background: isAction ? 'var(--accent)' : 'transparent', padding: isAction ? '12px' : '0', borderRadius: '50%', color: isAction ? 'var(--bg)' : 'inherit', boxShadow: isAction ? '0 5px 20px rgba(0,0,0,0.2)' : 'none' }}>
        <Icon size={isAction ? 24 : 26} strokeWidth={activeTab === id ? 2.5 : 2} />
      </div>
    </div>
  );
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