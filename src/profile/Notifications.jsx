import { useEffect, useState } from 'react';
import { Bell, Heart, User } from 'lucide-react';
import { useStore } from '../data/store';
import { supabase } from '../data/supabaseClient';
import { motion } from 'framer-motion';
import Avatar from '../components/Avatar';
import Skeleton from '../components/Skeleton';
import { formatDistanceToNow } from 'date-fns'; // Requires: npm install date-fns

export default function Notifications() {
  const { user } = useStore();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      // Fetch alerts + who sent them + which post it was about
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          actor:profiles!actor_id (display_name, avatar_url),
          post:posts (title)
        `)
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (!error) setAlerts(data);
      setLoading(false);
    };

    fetchNotifications();

    // Subscribe to REALTIME alerts
    const sub = supabase
      .channel('realtime-alerts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `recipient_id=eq.${user.id}` }, 
        (payload) => {
           // When a new alert comes in, refresh the list
           fetchNotifications(); 
      })
      .subscribe();

    return () => { supabase.removeChannel(sub); };
  }, [user]);

  if (loading) return (
    <div className="main-content" style={{ maxWidth: '600px', margin: '0 auto', paddingTop: '20px' }}>
         {[1,2,3].map(i => <div key={i} className="notepad-card" style={{ height: '80px' }}><Skeleton width="100%" height="100%" /></div>)}
    </div>
  );

  return (
    <div className="main-content" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 25px', fontFamily: 'var(--font-serif)' }}>জাননী (Notifications)</h2>
      
      {alerts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', opacity: 0.5 }}>
            <Bell size={40} style={{ marginBottom: '10px' }} />
            <div style={{ fontFamily: 'var(--font-serif)' }}>কোনো নতুন জাননী নাই</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {alerts.map((item, i) => (
                <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="notepad-card"
                    style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '15px', marginBottom: 0, borderLeft: !item.is_read ? '4px solid var(--accent)' : '1px solid var(--border)' }}
                >
                    {/* Icon / Avatar Layer */}
                    <div style={{ position: 'relative' }}>
                        <Avatar url={item.actor?.avatar_url} size={40} />
                        <div style={{ 
                            position: 'absolute', bottom: -2, right: -2, 
                            background: item.type === 'like' ? 'var(--danger)' : 'var(--text)', 
                            color: 'white', borderRadius: '50%', padding: '3px',
                            display: 'grid', placeItems: 'center', border: '2px solid var(--card)'
                        }}>
                            {item.type === 'like' ? <Heart size={10} fill="currentColor" /> : <Bell size={10} />}
                        </div>
                    </div>

                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '15px', lineHeight: '1.4' }}>
                            <span style={{ fontWeight: 700 }}>{item.actor?.display_name || 'Anonymous'}</span>
                            <span style={{ color: 'var(--text-sec)' }}>
                                {item.type === 'like' && ' আপোনাৰ লেখনিটো ভাল পাইছে'} {/* liked your post */}
                                {item.type === 'system' && ' Welcome to Aalap'}
                            </span>
                        </div>
                        {item.post?.title && (
                            <div style={{ fontSize: '13px', fontWeight: 600, marginTop: '2px', fontFamily: 'var(--font-serif)', color: 'var(--text)' }}>
                                "{item.post.title}"
                            </div>
                        )}
                        <div style={{ fontSize: '11px', color: 'var(--text-sec)', marginTop: '4px', opacity: 0.7 }}>
                           {new Date(item.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}, {new Date(item.created_at).toLocaleDateString()}
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
      )}
    </div>
  );
}