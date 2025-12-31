import { useState, useEffect, useRef } from 'react';
import { X, Send, Trash2 } from 'lucide-react';
import { supabase } from '../data/supabaseClient';
import { useStore } from '../data/store';
import Avatar from './Avatar';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function EchoChamber({ post, onClose }) {
  const { user } = useStore();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // Fetch Comments
  useEffect(() => {
    const fetchComments = async () => {
      const { data } = await supabase
        .from('comments')
        .select(`*, profiles(id, display_name, avatar_url)`)
        .eq('post_id', post.id)
        .order('created_at', { ascending: true });
      setComments(data || []);
      // Scroll to bottom
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    };

    fetchComments();

    // Realtime Listener
    const sub = supabase.channel('comments-room')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'comments', filter: `post_id=eq.${post.id}` }, 
      async (payload) => {
          // Fetch the full profile for the new comment
          const { data } = await supabase.from('profiles').select('*').eq('id', payload.new.user_id).single();
          setComments(prev => [...prev, { ...payload.new, profiles: data }]);
          setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      })
      .subscribe();

    return () => supabase.removeChannel(sub);
  }, [post.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    // Optimistic Update (Show it immediately)
    const tempId = Date.now();
    const tempComment = { id: tempId, body: newComment, user_id: user.id, created_at: new Date().toISOString(), profiles: { avatar_url: user.user_metadata.avatar_url, display_name: 'You' } };
    setComments([...comments, tempComment]);
    setNewComment('');
    setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

    const { error } = await supabase.from('comments').insert({ post_id: post.id, user_id: user.id, body: tempComment.body });
    if (error) {
        toast.error('Failed to post');
        setComments(prev => prev.filter(c => c.id !== tempId)); // Rollback
    }
  };

  return (
    <motion.div 
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}
    >
      {/* HEADER */}
      <div style={{ padding: '15px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--glass)', backdropFilter: 'blur(10)' }}>
        <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '18px' }}>Echoes ({comments.length})</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)' }}><X size={24} /></button>
      </div>

      {/* LIST */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', paddingBottom: '100px' }}>
        {comments.length === 0 && <div style={{ textAlign: 'center', marginTop: '50px', color: 'var(--text-sec)', opacity: 0.5 }}>Be the first to echo...</div>}
        
        {comments.map((c) => (
            <div key={c.id} style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                <Avatar url={c.profiles?.avatar_url} size={32} />
                <div style={{ flex: 1 }}>
                    <div style={{ background: 'var(--card)', padding: '10px 14px', borderRadius: '12px', border: '1px solid var(--border)', display: 'inline-block', minWidth: '150px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '4px', color: 'var(--text-sec)' }}>{c.profiles?.display_name || 'Ghost'}</div>
                        <div style={{ fontSize: '15px', fontFamily: 'var(--font-serif)', lineHeight: '1.4' }}>{c.body}</div>
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-sec)', marginTop: '4px', marginLeft: '5px' }}>{new Date(c.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                </div>
            </div>
        ))}
        <div ref={scrollRef}></div>
      </div>

      {/* INPUT */}
      <div style={{ padding: '15px', borderTop: '1px solid var(--border)', background: 'var(--card)', paddingBottom: '30px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
            <input 
                className="studio-input" 
                value={newComment} onChange={e => setNewComment(e.target.value)}
                placeholder="Write an echo..." 
                autoFocus
                style={{ background: 'var(--bg) !important', padding: '12px 20px', borderRadius: '25px', border: '1px solid var(--border) !important' }} 
            />
            <button type="submit" disabled={!newComment} style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'var(--accent)', color: 'white', border: 'none', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <Send size={18} />
            </button>
        </form>
      </div>
    </motion.div>
  );
}