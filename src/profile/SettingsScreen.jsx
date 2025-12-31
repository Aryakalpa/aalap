import { ArrowLeft, Trash2, Moon, Sun, LogOut } from 'lucide-react';
import { useStore } from '../data/store';
import toast from 'react-hot-toast';

export default function SettingsScreen() {
  const { theme, setTheme, setView, signOut } = useStore();

  const clear = () => { localStorage.removeItem('aalap-bookmarks'); toast.success('Cache cleared'); };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', gap: 15, alignItems: 'center', marginBottom: 40 }}>
         <button onClick={() => setView('main')} className="btn-icon"><ArrowLeft /></button>
         <h2 style={{margin:0}}>Settings</h2>
      </div>

      <div className="glass-card">
         <h4 style={{ opacity: 0.5, marginBottom: 15, fontFamily: 'var(--font-ui)' }}>THEME</h4>
         <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setTheme('night')} style={{ flex: 1, padding: 20, borderRadius: 12, border: '1px solid var(--glass-border)', background: theme==='night'?'var(--bg-secondary)':'transparent', color:'inherit', cursor:'pointer' }}>
                <Moon style={{display:'block', margin:'0 auto 10px'}} /> Night
            </button>
            <button onClick={() => setTheme('paper')} style={{ flex: 1, padding: 20, borderRadius: 12, border: '1px solid var(--glass-border)', background: theme==='paper'?'#E0E0E0':'transparent', color: theme==='paper'?'#000':'inherit', cursor:'pointer' }}>
                <Sun style={{display:'block', margin:'0 auto 10px'}} /> Paper
            </button>
         </div>
      </div>

      <div className="glass-card">
         <h4 style={{ opacity: 0.5, marginBottom: 15, fontFamily: 'var(--font-ui)' }}>DATA</h4>
         <button onClick={clear} style={{ width: '100%', padding: 15, borderRadius: 12, border: 'none', background: 'rgba(255, 69, 58, 0.15)', color: 'var(--danger)', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <Trash2 size={18} /> Clear Cache
         </button>
      </div>

      <button onClick={() => { signOut(); setView('main'); }} style={{ width: '100%', padding: 15, borderRadius: 12, border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer' }}>
        Log Out
      </button>
    </div>
  );
}