import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { useHaptic } from '../hooks/useHaptic';

export default function UpdatePrompt() {
  const [show, setShow] = useState(false);
  const haptic = useHaptic();

  useEffect(() => {
    // Simple check: If we have been open for more than 1 hour, suggest refresh
    const timer = setTimeout(() => setShow(true), 1000 * 60 * 60);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    haptic.success();
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (let registration of registrations) { registration.unregister(); }
      });
    }
    window.location.reload(true);
  };

  if (!show) return null;

  return (
    <button 
      onClick={handleRefresh}
      className="haptic-btn fade-in"
      style={{
        position: 'fixed', bottom: '90px', right: '20px', zIndex: 9999,
        background: 'var(--accent)', color: 'var(--bg)',
        border: 'none', borderRadius: '30px', padding: '10px 20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        display: 'flex', alignItems: 'center', gap: '10px',
        fontWeight: 700, fontFamily: 'var(--font-serif)', fontSize: '14px'
      }}
    >
      <RefreshCw size={16} /> নতুন আপডেট
    </button>
  );
}