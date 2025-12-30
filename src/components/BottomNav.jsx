import { Home, Edit3, User, Search } from 'lucide-react';
import { useStore } from '../data/store';

export const BottomNav = ({ activeTab, setTab }) => {
  const { setView } = useStore();

  const NavItem = ({ id, Icon, isAction, isSearch }) => (
    <div 
      onClick={() => {
        if (isAction) setView('studio');
        else if (isSearch) setView('search');
        else setTab(id);
      }}
      className="haptic-btn"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, cursor: 'pointer', color: activeTab === id && !isAction && !isSearch ? 'var(--accent)' : 'var(--text-sec)' }}
    >
      <div style={{ background: isAction ? 'var(--accent)' : 'transparent', padding: isAction ? '12px' : '0', borderRadius: '50%', color: isAction ? '#fff' : 'inherit', marginTop: isAction ? '-20px' : '0', boxShadow: isAction ? '0 4px 10px rgba(0,113,227,0.3)' : 'none' }}>
        <Icon size={isAction ? 24 : 26} />
      </div>
    </div>
  );

  return (
    <nav className="bottom-nav">
      <NavItem id="home" Icon={Home} />
      <NavItem id="search" Icon={Search} isSearch />
      <NavItem id="write" Icon={Edit3} isAction />
      <NavItem id="profile" Icon={User} />
    </nav>
  );
};