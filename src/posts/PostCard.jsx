import { useState, useEffect } from 'react';
import { Heart, Bookmark, Share2, MessageCircle } from 'lucide-react';
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

  // DATA FETCH
  useEffect(() => {
    let mounted = true;
    const load = async () => {
        const { count: l } = await supabase.from('likes').select('id', { count: 'exact', head: true }).eq('post_id', post.id);
        const { count: c } = await supabase.from('comments').select('id', { count: 'exact', head: true }).eq('post_id', post.id);
        if(mounted) setStats({ likes: l || 0, comments: c || 0 });
        
        if(user) {
            const { data } = await supabase.from('likes').select('id').eq('user_id', user.id).eq('post_id', post.id).maybeSingle();
            if(mounted && data) setIsLiked(true);
        }
    };
    load();
    return () => { mounted = false; };
  }, [post.id, user]);

  const authGuard = () => {
    if(!user) { toast.error('অনুগ্ৰহ কৰি লগ-ইন কৰক'); setTab('profile'); return false; }
    return true;
  };

  const handleLike = async (e) => {
    e.stopPropagation(); // CRITICAL: Stop bubble
    if(!authGuard()) return;
    haptic.impactMedium();
    
    const prev = isLiked;
    setIsLiked(!prev);
    setStats(s => ({ ...s, likes: prev ? s.likes - 1 : s.likes + 1 }));

    if(prev) await supabase.from('likes').delete().eq('user_id', user.id).eq('post_id', post.id);
    else await supabase.from('likes').insert({ user_id: user.id, post_id: post.id });
  };

  return (
    <div className="notepad-card">
      
      {/* 1. HEADER (Profile Click) */}
      <div 
        onClick={(e) => { e.stopPropagation(); setView('author', post.author_id); }}
        style={{ padding: '20px 20px 10px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', borderBottom: '1px solid transparent' }}
      >
         <Avatar url={post.profiles?.avatar_url} size={40} />
         <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{post.profiles?.display_name || 'Anonymous'}</div>
            <div style={{ fontSize: 12, opacity: 0.6, fontFamily: 'Inter' }}>{new Date(post.created_at).toLocaleDateString()}</div>
         </div>
      </div>

      {/* 2. BODY (Reader Click) */}
      <div 
        onClick={() => { haptic.tap(); setView('reader', post); }}
        style={{ padding: '0 20px 15px', cursor: 'pointer' }}
      >
         <h3 style={{ fontSize: 22, fontWeight: 700, margin: '10px 0', lineHeight: 1.3 }}>{post.title}</h3>
         <p style={{ fontSize: 17, lineHeight: 1.6, opacity: 0.9, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 }}>
            {post.body}
         </p>
      </div>

      {/* 3. FOOTER (Action Clicks) */}
      <div style={{ padding: '10px 20px 20px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(128,128,128,0.1)' }}>
         <div style={{ display: 'flex', gap: 20 }}>
            <button onClick={handleLike} className="haptic-btn" style={{ color: isLiked ? '#ff4d4d' : 'inherit' }}>
               <Heart size={22} fill={isLiked ? "currentColor" : "none"} /> 
               <span style={{ fontWeight: 600, fontSize: 14 }}>{stats.likes}</span>
            </button>
            <button onClick={(e) => { e.stopPropagation(); setView('echo', post); }} className="haptic-btn">
               <MessageCircle size={22} />
               <span style={{ fontWeight: 600, fontSize: 14 }}>{stats.comments > 0 && stats.comments}</span>
            </button>
         </div>
         <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(window.location.origin); toast.success('Link Copied'); }} className="haptic-btn">
               <Share2 size={22} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); if(authGuard()) toggleBookmark(post); }} className="haptic-btn" style={{ color: isSaved ? '#fff' : 'inherit' }}>
               <Bookmark size={22} fill={isSaved ? "currentColor" : "none"} />
            </button>
         </div>
      </div>

    </div>
  );
}