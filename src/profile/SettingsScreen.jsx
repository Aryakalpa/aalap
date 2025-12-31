import { ArrowLeft, Trash2, Moon, Sun } from 'lucide-react';
import { useStore } from '../data/store';
import toast from 'react-hot-toast';

export default function SettingsScreen() {
  const { theme, setTheme } = useStore();

  const handleClearCache = () => {
    localStorage.removeItem('aalap-bookmarks');
    toast.success('Cache Cleared');
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', gap: 15, alignItems: 'center', marginBottom: 40 }}>
         <button onClick={() => window.history.back()} style={{background:'none',border:'none',color:'inherit'}}><ArrowLeft /></button>
         <h2>Settings</h2>
      </div>

      <div style={{ marginBottom: 30 }}>
         <h4 style={{ opacity: 0.5, marginBottom: 10, fontFamily: 'Inter' }}>APPEARANCE</h4>
         <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setTheme('night')} style={{ flex: 1, padding: 15, borderRadius: 8, border: '1px solid #333', background: theme === 'night' ? '#222' : 'transparent', color: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <Moon size={24} /> Night
            </button>
            <button onClick={() => setTheme('paper')} style={{ flex: 1, padding: 15, borderRadius: 8, border: '1px solid #333', background: theme === 'paper' ? '#E8E6DF' : 'transparent', color: theme === 'paper' ? '#000' : 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <Sun size={24} /> Paper
            </button>
         </div>
      </div>

      <div style={{ marginBottom: 30 }}>
         <h4 style={{ opacity: 0.5, marginBottom: 10, fontFamily: 'Inter' }}>DATA</h4>
         <button onClick={handleClearCache} style={{ width: '100%', padding: 15, background: 'rgba(255,0,0,0.1)', color: '#ff4d4d', border: 'none', borderRadius: 8, display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'center' }}>
            <Trash2 size={20} /> Clear Local Cache
         </button>
      </div>
    </div>
  );
}