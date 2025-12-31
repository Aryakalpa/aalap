import { useState, useEffect } from 'react';
import { ArrowLeft, Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import { useStore } from '../data/store';
import { supabase } from '../data/supabaseClient';
import Avatar from '../components/Avatar';
import toast from 'react-hot-toast';

export default function Reader({ post }) {
  const { setView, user, toggleBookmark, bookmarks } = useStore();
  const author = post.profiles || {};
  
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const isSaved = bookmarks.some(b => b.id === post.id);

  useEffect(() => {
    supabase.from('likes').select('id', { count: 'exact', head: true }).eq('post_id', post.id).then(({count}) => setLikes(count||0));
    if(user) supabase.from('likes').select('id').eq('user_id', user.id).eq('post_id', post.id).maybeSingle().then(({data}) => { if(data) setIsLiked(true); });
  }, [post.id, user]);

  const handleLike = async () => {
      if(!user) { toast.error('Login to like'); return; }
      const prev = isLiked; setIsLiked(!prev); setLikes(l => prev ? l-1 : l+1);
      if(prev) await supabase.from('likes').delete().eq('user_id', user.id).eq('post_id', post.id);
      else await supabase.from('likes').insert({ user_id: user.id, post_id: post.id });
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?post=${post.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Sharing link copied!');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-body)', position: 'relative' }}>
      <div style={{ position:'sticky', top:0, background:'var(--bg-body)', zIndex:10, padding:'20px', display:'flex', alignItems:'center', gap:15, borderBottom: '1px solid var(--border-light)' }}>
        <button onClick={() => setView('main')} className="btn-icon"><ArrowLeft /></button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar url={author.avatar_url} size={32} />
            <span style={{ fontWeight: 700, fontSize: 14 }}>{author.display_name}</span>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 20px 120px 20px' }}>
          <h1 style={{ fontSize: 32, marginBottom: 24, lineHeight: 1.3 }}>{post.title}</h1>
          <div style={{ fontSize: 19, lineHeight: 1.9, whiteSpace: 'pre-wrap', color: 'var(--text-main)' }}>{post.body}</div>
      </div>

      <div className="reader-actions" style={{ background: 'var(--bg-nav)', border: '1px solid var(--border-strong)', backdropFilter: 'blur(10px)' }}>
          <button onClick={handleLike} className="btn-icon" style={{color: isLiked ? 'var(--danger)' : 'var(--text-main)'}}>
             <Heart size={24} fill={isLiked ? "currentColor" : "none"} /> <span style={{fontSize:14, fontWeight:600}}>{likes}</span>
          </button>
          <button onClick={() => setView('echo', post)} className="btn-icon" style={{color: 'var(--text-main)'}}><MessageCircle size={24} /></button>
          <button onClick={() => toggleBookmark(post)} className="btn-icon" style={{color: isSaved ? 'var(--text-main)' : 'var(--text-muted)'}}><Bookmark size={24} fill={isSaved ? "currentColor" : "none"} /></button>
          <button onClick={handleShare} className="btn-icon" style={{color: 'var(--text-muted)'}}><Share2 size={24} /></button>
      </div>
    </div>
  );
}