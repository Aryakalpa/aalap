import { ArrowLeft, Bell, Smartphone, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsScreen() {
  
  const handleClearCache = () => {
    localStorage.removeItem('aalap-bookmarks');
    toast.success('Cache Cleared');
  };

  return (
    <div className="main-content" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
        {/* CHANGED: Just use browser back, handled by AppShell */}
        <button onClick={() => window.history.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-sec)' }}>
            <ArrowLeft size={24} />
        </button>
        <h2 style={{ fontSize: '22px', fontWeight: 700, margin: 0, fontFamily: 'var(--font-serif)' }}>Settings</h2>
      </div>

      <div className="soul-card">
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', fontFamily: 'var(--font-serif)' }}>General</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Bell size={20} color="var(--text-sec)" />
                <span style={{ fontSize: '15px', fontWeight: 500 }}>Notifications</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-sec)' }}>Soon</div>
        </div>
      </div>

      <div className="soul-card" style={{ borderColor: 'var(--danger)' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', fontFamily: 'var(--font-serif)', color: 'var(--danger)' }}>Danger Zone</h3>
        <button onClick={handleClearCache} style={{ width: '100%', background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--danger)', cursor: 'pointer', padding: '10px 0' }}>
            <Trash2 size={20} />
            <span style={{ fontSize: '15px', fontWeight: 600 }}>Clear Cache</span>
        </button>
      </div>
    </div>
  );
}