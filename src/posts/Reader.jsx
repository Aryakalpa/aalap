import { ArrowLeft, Heart, Share2, Type, MessageCircle } from 'lucide-react';
import { useStore } from '../data/store';
import { useHaptic } from '../hooks/useHaptic';
import Avatar from '../components/Avatar';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { supabase } from '../data/supabaseClient';
import { useState, useEffect } from 'react';

export default function Reader({ post }) {
  const { setView, user } = useStore();
  const haptic = useHaptic();
  
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (user) {
        supabase.from('likes').select('id').eq('user_id', user.id).eq('post_id', post.id).maybeSingle()
        .then(({ data }) => { if(data) setIsLiked(true); });
    }
  }, [user, post.id]);

  const handleLike = async () => {
    if (!user) return toast.error('Login to like');
    haptic.impactMedium();
    
    const prevLiked = isLiked;
    setIsLiked(!prevLiked);
    setLikesCount(prev => prevLiked ? prev - 1 : prev + 1);

    if (prevLiked) await supabase.from('likes').delete().eq('user_id', user.id).eq('post_id', post.id);
    else await supabase.from('likes').insert({ user_id: user.id, post_id: post.id });
  };

  const handleShare = async () => {
    haptic.tap();
    const deepLink = `${window.location.origin}/?post=${post.id}`;
    if (navigator.share) await navigator.share({ title: 'Aalap', url: deepLink });
    else { await navigator.clipboard.writeText(deepLink); toast.success('Link copied'); }
  };

  const author = post.profiles || {};

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: '100px', userSelect: 'none' }}>
      
      {/* HEADER */}
      <div style={{ position: 'sticky', top: 0, zIndex: 999, padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--glass)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', pointerEvents: 'auto' }}>
        <button onClick={() => setView('main')} className="haptic-btn" style={{ background: 'none', border: 'none', color: 'var(--text)', padding: '10px' }}>
          <ArrowLeft size={24} />
        </button>
        <div style={{ display: 'flex', gap: '15px' }}>
            <button onClick={() => setView('echo', post)} className="haptic-btn" style={{ background: 'none', border: 'none', color: 'var(--text)', padding: '10px' }}><MessageCircle size={22} /></button>
            <button onClick={handleShare} className="haptic-btn" style={{ background: 'none', border: 'none', color: 'var(--text)', padding: '10px' }}><Share2 size={22} /></button>
        </div>
      </div>

      {/* CONTENT */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ maxWidth: '680px', margin: '0 auto', padding: '30px 20px' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', fontWeight: 900, lineHeight: '1.2', marginBottom: '20px', color: 'var(--text)' }}>{post.title}</h1>
        <div onClick={() => setView('author', post.author_id)} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px', cursor: 'pointer', pointerEvents: 'auto' }}>
            <Avatar url={author.avatar_url} size={40} />
            <div>
                <div style={{ fontSize: '15px', fontWeight: 700 }}>{author.display_name || 'নামবিহীন'}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-sec)' }}>{new Date(post.created_at).toLocaleDateString()}</div>
            </div>
        </div>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '19px', lineHeight: '1.8', color: 'var(--text)', whiteSpace: 'pre-wrap' }}>{post.body}</div>

        <div style={{ marginTop: '50px', paddingTop: '30px', borderTop: '1px solid var(--border)', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <button onClick={handleLike} className="haptic-btn" style={{ background: 'var(--surface-2)', border: 'none', padding: '12px 24px', borderRadius: '30px', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 600, color: isLiked ? 'var(--danger)' : 'var(--text)', pointerEvents: 'auto' }}>
                <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} /> {likesCount} Likes
            </button>
            <button onClick={() => setView('echo', post)} className="haptic-btn" style={{ background: 'var(--surface-2)', border: 'none', padding: '12px 24px', borderRadius: '30px', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 600, color: 'var(--text)', pointerEvents: 'auto' }}>
                <MessageCircle size={20} /> Comments
            </button>
        </div>
      </motion.div>
    </div>
  );
}