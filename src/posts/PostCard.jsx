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
  
  const [likesCount, setLikesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const isSaved = bookmarks.some(b => b.id === post.id);

  const requireAuth = () => {
    if (!user) { toast.error('লগ-ইন কৰক (Login required)'); setTab('profile'); return false; }
    return true;
  };

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
        const { count: lCount } = await supabase.from('likes').select('id', { count: 'exact', head: true }).eq('post_id', post.id);
        const { count: cCount } = await supabase.from('comments').select('id', { count: 'exact', head: true }).eq('post_id', post.id);
        if (isMounted) { setLikesCount(lCount || 0); setCommentsCount(cCount || 0); }
        if (user) {
            const { data } = await supabase.from('likes').select('id').eq('user_id', user.id).eq('post_id', post.id).maybeSingle();
            if (isMounted && data) setIsLiked(true);
        }
    };
    loadData();
    return () => { isMounted = false; };
  }, [post.id, user]);

  const handleLike = async (e) => { e.stopPropagation(); if (!requireAuth()) return; haptic.impactMedium(); const was = isLiked; setIsLiked(!was); setLikesCount(p => was ? p-1 : p+1); if(was) await supabase.from('likes').delete().eq('user_id', user.id).eq('post_id', post.id); else await supabase.from('likes').insert({ user_id: user.id, post_id: post.id }); };
  const handleEcho = (e) => { e.stopPropagation(); haptic.tap(); if (!requireAuth()) return; setView('echo', post); };
  const handleShare = async (e) => { e.stopPropagation(); haptic.tap(); const url = `${window.location.origin}/?post=${post.id}`; navigator.clipboard.writeText(url); toast.success('লিংক কপি কৰা হ’ল'); };
  const handleBookmark = (e) => { e.stopPropagation(); if (!requireAuth()) return; toggleBookmark(post); };
  const openReader = () => { haptic.tap(); window.history.pushState({ path: `?post=${post.id}` }, '', `?post=${post.id}`); setView('reader', post); };
  const openAuthor = (e) => { e.stopPropagation(); setView('author', post.author_id); };
  
  const author = post.profiles || {};
  const categoryLabel = post.category === 'poem' ? 'কবিতা' : 'গল্প';

  return (
    <div className="notepad-card">
      <div className="card-click-area" onClick={openReader}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div onClick={openAuthor} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
              <Avatar url={author.avatar_url} size={36} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{author.display_name || 'নামবিহীন'}</div>
                <div style={{ fontSize: 11, opacity: 0.7, fontFamily: 'Inter, sans-serif' }}>{new Date(post.created_at).toLocaleDateString()}</div>
              </div>
            </div>
            <span className="meta-badge">{categoryLabel}</span>
          </div>
          
          <h3 style={{ fontSize: 22, lineHeight: 1.4, marginBottom: 12 }}>{post.title}</h3>
          <p style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', opacity: 0.9 }}>{post.body}</p>
      </div>

      <div style={{ padding: '12px 0 0', borderTop: '1px dashed rgba(128,128,128,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 24 }}>
            <button onClick={handleLike} className="haptic-btn" style={{ color: isLiked ? '#ff4d4d' : 'inherit', opacity: isLiked ? 1 : 0.6 }}>
                <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} /> <span style={{fontSize: 13, fontWeight: 600}}>{likesCount}</span>
            </button>
            <button onClick={handleEcho} className="haptic-btn" style={{ opacity: 0.6 }}>
                <MessageCircle size={20} /> <span style={{fontSize: 13, fontWeight: 600}}>{commentsCount > 0 && commentsCount}</span>
            </button>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
            <button onClick={handleShare} className="haptic-btn" style={{ opacity: 0.6 }}><Share2 size={20} /></button>
            <button onClick={handleBookmark} className="haptic-btn" style={{ color: isSaved ? '#ff5a4d' : 'inherit', opacity: isSaved ? 1 : 0.6 }}><Bookmark size={20} fill={isSaved ? 'currentColor' : 'none'} /></button>
        </div>
      </div>
    </div>
  );
}