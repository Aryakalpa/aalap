import { useState, useEffect } from 'react';
import { ArrowLeft, Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import { useStore } from '../data/store';
import { supabase } from '../data/supabaseClient';
import Avatar from '../components/Avatar';
import toast from 'react-hot-toast';

export default function Reader({ post }) {
  const { setView, user, toggleBookmark, bookmarks, setTab } = useStore();
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

  const handleBookmark = () => {
      if(!user) { toast.error('Login to save'); return; }
      toggleBookmark(post);
  };

  return (
    <div style={{ minHeight: '100vh', padding: 20 }}>
      {/* Top Bar */}
      <div style={{ position:'sticky', top:0, background:'var(--bg-body)', zIndex:10, paddingBottom:20, display:'flex', alignItems:'center', gap:15 }}>
        <button onClick={() => setView('main')} className="btn-icon"><ArrowLeft /></button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar url={author.avatar_url} size={32} />
            <span style={{ fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-sans)' }}>{author.display_name}</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 680, margin: '0 auto', paddingBottom: 100 }}>
          <h1 style={{ fontSize: 32, marginBottom: 24, lineHeight: 1.3 }}>{post.title}</h1>
          <div style={{ fontSize: 19, lineHeight: 1.9, whiteSpace: 'pre-wrap', color: 'var(--text-main)', opacity: 0.9 }}>{post.body}</div>
      </div>

      {/* FLOATING ACTION BAR (The Fix) */}
      <div className="reader-actions">
          <button onClick={handleLike} className="btn-icon" style={{color: isLiked ? 'var(--danger)' : 'var(--text-main)'}}>
             <Heart size={24} fill={isLiked ? "currentColor" : "none"} /> <span style={{fontSize:14, fontWeight:600}}>{likes}</span>
          </button>
          
          <button onClick={() => setView('echo', post)} className="btn-icon" style={{color: 'var(--text-main)'}}>
             <MessageCircle size={24} />
          </button>

          <button onClick={handleBookmark} className="btn-icon" style={{color: isSaved ? 'var(--text-main)' : 'var(--text-muted)'}}>
             <Bookmark size={24} fill={isSaved ? "currentColor" : "none"} />
          </button>
          
          <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Copied'); }} className="btn-icon" style={{color: 'var(--text-muted)'}}>
             <Share2 size={24} />
          </button>
      </div>
    </div>
  );
}