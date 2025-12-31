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

  useEffect(() => {
    supabase.from('likes').select('id', {count:'exact',head:true}).eq('post_id', post.id).then(({count}) => setStats(s => ({...s, likes:count||0})));
    supabase.from('comments').select('id', {count:'exact',head:true}).eq('post_id', post.id).then(({count}) => setStats(s => ({...s, comments:count||0})));
    if(user) supabase.from('likes').select('id').eq('user_id', user.id).eq('post_id', post.id).maybeSingle().then(({data}) => { if(data) setIsLiked(true); });
  }, [post.id, user]);

  const authGuard = () => { if(!user) { toast.error('Login required'); setTab('profile'); return false; } return true; };

  const like = async (e) => {
    e.stopPropagation(); if(!authGuard()) return; haptic.impactMedium();
    const prev = isLiked; setIsLiked(!prev); setStats(s => ({...s, likes: prev ? s.likes-1 : s.likes+1}));
    if(prev) await supabase.from('likes').delete().eq('user_id', user.id).eq('post_id', post.id);
    else await supabase.from('likes').insert({ user_id: user.id, post_id: post.id });
  };

  return (
    <div className="notepad-card">
      <div onClick={(e) => { e.stopPropagation(); setView('author', post.author_id); }} style={{ padding: '20px 20px 10px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
         <Avatar url={post.profiles?.avatar_url} size={40} />
         <div>
            <div style={{ fontWeight: 700, fontSize: 15, fontFamily: 'var(--font-sans)', color:'var(--text-main)' }}>{post.profiles?.display_name || 'Anonymous'}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(post.created_at).toLocaleDateString()}</div>
         </div>
      </div>
      
      <div onClick={() => { haptic.tap(); setView('reader', post); }} style={{ padding: '0 20px 15px', cursor: 'pointer' }}>
         <h3 style={{ fontSize: 22, fontWeight: 700, margin: '10px 0', lineHeight: 1.3, color:'var(--text-main)' }}>{post.title}</h3>
         <p style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--text-main)', opacity: 0.9, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 }}>{post.body}</p>
      </div>

      <div style={{ padding: '10px 20px 20px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)' }}>
         <div style={{ display: 'flex', gap: 20 }}>
            <button onClick={like} className="btn-icon" style={{color: isLiked ? 'var(--danger)' : 'var(--text-muted)'}}><Heart size={22} fill={isLiked ? "currentColor" : "none"} /> {stats.likes}</button>
            <button onClick={(e) => { e.stopPropagation(); setView('echo', post); }} className="btn-icon"><MessageCircle size={22} /> {stats.comments > 0 && stats.comments}</button>
         </div>
         <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(window.location.origin); toast.success('Copied'); }} className="btn-icon"><Share2 size={22} /></button>
            <button onClick={(e) => { e.stopPropagation(); if(authGuard()) toggleBookmark(post); }} className="btn-icon" style={{color: isSaved ? 'var(--text-main)' : 'var(--text-muted)'}}><Bookmark size={22} fill={isSaved ? "currentColor" : "none"} /></button>
         </div>
      </div>
    </div>
  );
}