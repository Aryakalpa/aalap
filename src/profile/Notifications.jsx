import { Bell, Heart, UserPlus } from 'lucide-react';
import { useStore } from '../data/store';
import { motion } from 'framer-motion';

export default function Notifications() {
  // Mock data for now (Backend logic would go here)
  const alerts = [
    { id: 1, type: 'like', user: 'Poli Dutta', text: 'liked your story "Atmohotya"', time: '2m ago' },
    { id: 2, type: 'follow', user: 'Arnab J.', text: 'started following you', time: '1h ago' },
    { id: 3, type: 'system', user: 'Aalap Team', text: 'Welcome to Aalap v11.0', time: 'Just now' }
  ];

  return (
    <div className="main-content" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 25px', fontFamily: 'var(--font-serif)' }}>জাননী (Notifications)</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {alerts.map((item, i) => (
            <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="notepad-card"
                style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px', marginBottom: 0 }}
            >
                <div style={{ 
                    width: '40px', height: '40px', borderRadius: '50%', 
                    background: item.type === 'like' ? 'rgba(255, 90, 77, 0.1)' : 'var(--surface-2)',
                    color: item.type === 'like' ? 'var(--danger)' : 'var(--text)',
                    display: 'grid', placeItems: 'center'
                }}>
                    {item.type === 'like' && <Heart size={20} fill="currentColor" />}
                    {item.type === 'follow' && <UserPlus size={20} />}
                    {item.type === 'system' && <Bell size={20} />}
                </div>
                <div>
                    <div style={{ fontSize: '15px', fontWeight: 600 }}>
                        {item.user} <span style={{ fontWeight: 400, color: 'var(--text-sec)' }}>{item.text}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-sec)', marginTop: '4px' }}>{item.time}</div>
                </div>
            </motion.div>
        ))}
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '50px', opacity: 0.3, fontSize: '12px' }}>
        You are all caught up
      </div>
    </div>
  );
}