import { useState, useEffect } from 'react';
import { Heart, Bookmark, MessageCircle, Share } from 'lucide-react';
import { useStore } from '../data/store';
import { supabase } from '../data/supabaseClient';
import { useHaptic } from '../hooks/useHaptic';
import Avatar from '../components/Avatar';
import toast from 'react-hot-toast';

export default function PostCard({ post }) {
  const { user, setView, toggleBookmark, bookmarks, setTab } = useStore();
  const haptic = useHaptic();
  
  const [stats, setStats] = useState({ likes: 0, comments: 0 });
  const [isLiked, setIsLiked] = useState(false);
  const isSaved = bookmarks.some(b => b.id === post.id);

  useEffect(() => {
    let mounted = true;
    const fetchStats = async () => {
        const { count: l } = await supabase.from('likes').select('id', { count: 'exact', head: true }).eq('post_id', post.id);
        const { count: c } = await supabase.from('comments').select('id', { count: 'exact', head: true }).eq('post_id', post.id);
        if(mounted) setStats({ likes: l || 0, comments: c || 0 });
        
        if(user) {
            const { data } = await supabase.from('likes').select('id').eq('user_id', user.id).eq('post_id', post.id).maybeSingle();
            if(mounted && data) setIsLiked(true);
        }
    };
    fetchStats();
    return () => { mounted = false; };
  }, [post.id, user]);

  const authGuard = () => {
      if(!user) { toast.error('অনুগ্ৰহ কৰি লগ-ইন কৰক'); setTab('profile'); return false; }
      return true;
  }

  const handleLike = async (e) => {
    e.stopPropagation();
    if(!authGuard()) return;
    haptic.impact();
    const prevLiked = isLiked;
    setIsLiked(!prevLiked);
    setStats(s => ({ ...s, likes: prevLiked ? s.likes - 1 : s.likes + 1 }));
    
    if(prevLiked) await supabase.from('likes').delete().eq('user_id', user.id).eq('post_id', post.id);
    else await supabase.from('likes').insert({ user_id: user.id, post_id: post.id });
  };

  const handleShare = (e) => {
      e.stopPropagation(); haptic.tap();
      navigator.clipboard.writeText(`${window.location.origin}/?post=${post.id}`);
      toast.success('লিংক কপি কৰা হ’ল');
  }

  return (
    <div className="glass-card animate-enter">
      <div onClick={() => { haptic.tap(); setView('reader', post); }} style={{ cursor: 'pointer' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
             <div onClick={(e) => { e.stopPropagation(); setView('author', post.author_id); }} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar url={post.profiles?.avatar_url} size={36} />
                <div>
                    <div style={{ fontWeight: 700, fontSize: 15, fontFamily: 'var(--font-ui)' }}>{post.profiles?.display_name || 'Anonymous'}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{new Date(post.created_at).toLocaleDateString()}</div>
                </div>
             </div>
             <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', background: 'var(--bg-secondary)', padding: '4px 10px', borderRadius: 20 }}>
                 {post.category === 'poem' ? 'কবিতা' : 'গল্প'}
             </span>
          </div>

          {/* Body */}
          <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10, lineHeight: 1.3 }}>{post.title}</h3>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {post.body}
          </p>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', gap: 20 }}>
              <button onClick={handleLike} className="btn-icon" style={{ padding: 0, gap: 6, width: 'auto', borderRadius: 0, color: isLiked ? var(--danger) : 'var(--text-secondary)' }}>
                  <Heart size={20} fill={isLiked ? "currentColor" : "none"} color={isLiked ? "var(--danger)" : "currentColor"} />
                  <span style={{fontSize: 14, fontWeight: 600}}>{stats.likes}</span>
              </button>
              <button onClick={(e) => { e.stopPropagation(); setView('echo', post); }} className="btn-icon" style={{ padding: 0, gap: 6, width: 'auto', borderRadius: 0 }}>
                  <MessageCircle size={20} />
                  <span style={{fontSize: 14, fontWeight: 600}}>{stats.comments > 0 && stats.comments}</span>
              </button>
          </div>
          <div style={{ display: 'flex', gap: 15 }}>
              <button onClick={handleShare} className="btn-icon" style={{padding:0}}><Share size={20} /></button>
              <button onClick={(e) => { e.stopPropagation(); if(authGuard()) toggleBookmark(post); }} className="btn-icon" style={{padding:0, color: isSaved ? 'var(--accent-color)' : 'var(--text-secondary)'}}>
                  <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
              </button>
          </div>
      </div>
    </div>
  );
}