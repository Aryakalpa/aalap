import { useStore } from '../data/store';
import { Sun, Moon, Edit2, LogOut, Settings, Shield } from 'lucide-react';
import Avatar from '../components/Avatar';
import { useHaptic } from '../hooks/useHaptic';

export default function Profile() {
  const { user, profile, theme, setTheme, setView, signOut } = useStore();
  const haptic = useHaptic();
  
  if (!user) return null;

  const toggleTheme = () => {
    haptic.tap();
    setTheme(theme === 'paper' ? 'night' : 'paper');
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '40px', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <Avatar url={profile?.avatar_url} size={120} />
        </div>
        <h2 style={{ fontSize: '32px', fontWeight: 900, margin: '0 0 8px', fontFamily: 'var(--font-serif)', color: 'var(--text)' }}>
            {profile?.display_name || 'নামবিহীন'}
        </h2>
        <p style={{ color: 'var(--text-sec)', fontSize: '16px', margin: 0, fontWeight: 500 }}>
            @{profile?.username || 'user'}
        </p>
        <button onClick={() => setView('edit-profile')} className="haptic-btn" style={{ position: 'absolute', top: 0, right: 0, background: 'var(--card)', border: '1px solid var(--border)', width: '40px', height: '40px', borderRadius: '50%', display: 'grid', placeItems: 'center', color: 'var(--text)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <Edit2 size={18} />
        </button>
      </div>

      <div className="soul-card" onClick={toggleTheme} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: theme === 'paper' ? '#fff' : '#222' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg)', display: 'grid', placeItems: 'center', border: '1px solid var(--border)' }}>
                {theme === 'paper' ? <Sun size={24} color="orange" /> : <Moon size={24} color="yellow" />}
            </div>
            <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-serif)' }}>পৰিৱেশ সলনি কৰক</h3>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-sec)' }}>বৰ্তমান: {theme === 'paper' ? 'দিন (Day)' : 'ৰাতি (Night)'}</p>
            </div>
        </div>
        <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid var(--border)', background: theme === 'night' ? 'var(--accent)' : 'transparent' }}></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
         <div className="soul-card haptic-btn" style={{ margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', height: '120px' }}>
            <Settings size={28} color="var(--text-sec)" />
            <span style={{ fontSize: '15px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>ছেটিংছ</span>
         </div>
         <div className="soul-card haptic-btn" style={{ margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', height: '120px' }}>
            <Shield size={28} color="var(--text-sec)" />
            <span style={{ fontSize: '15px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>গোপনীয়তা</span>
         </div>
      </div>

      <button onClick={signOut} className="haptic-btn" style={{ marginTop: '30px', width: '100%', padding: '18px', background: 'var(--card)', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: '20px', fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
        <LogOut size={20} /> ওলাই আহক
      </button>

      {/* VERSION STAMP - VISIBLE TO USER */}
      <div style={{ textAlign: 'center', marginTop: '30px', opacity: 0.3, fontSize: '12px', fontFamily: 'var(--font-sans)' }}>
        Aalap v6.6 (New Core)
      </div>
    </div>
  );
}