import { useStore } from '../data/store';
import { Sun, Moon, Edit2 } from 'lucide-react';
import Avatar from '../components/Avatar';

export default function ProfileScreen() {
  const { user, profile, theme, setTheme, setView, signOut } = useStore();
  
  if (!user) return null;

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '40px', position: 'relative' }}>
        <div style={{ margin: '0 auto 20px', display: 'flex', justifyContent: 'center' }}>
             <Avatar url={profile?.avatar_url} size={100} />
        </div>
        
        <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 5px' }}>{profile?.display_name || 'Writer'}</h2>
        <p style={{ color: 'var(--text-sec)', fontSize: '14px', margin: 0 }}>@{profile?.username || 'user'}</p>
        
        <button 
            onClick={() => setView('edit-profile')}
            style={{ position: 'absolute', top: 0, right: 0, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)' }}
        >
            <Edit2 size={20} />
        </button>
      </div>

      <div className="soul-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {theme === 'paper' ? <Sun size={20} /> : <Moon size={20} />}
            <span style={{ fontWeight: '600' }}>Reading Mode</span>
          </div>
          <button onClick={() => setTheme(theme === 'paper' ? 'night' : 'paper')} style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
            {theme === 'paper' ? 'Paper' : 'Night'}
          </button>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <button onClick={signOut} style={{ color: '#ff3b30', background: 'none', border: 'none', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>Sign Out</button>
      </div>
    </div>
  );
}