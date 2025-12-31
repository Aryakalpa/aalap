import { useState, useEffect } from 'react';
import { Heart, Bookmark, Share2, MessageCircle } from 'lucide-react';
import { useStore } from '../data/store';
import { supabase } from '../data/supabaseClient';
import { useHaptic } from '../hooks/useHaptic';
import Avatar from '../components/Avatar';
import toast from 'react-hot-toast';

export default function PostCard({ post }) {
  const { user, setView, toggleBookmark, bookmarks } = useStore();
  const haptic = useHaptic();
  
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [commentsCount, setCommentsCount] = useState(post.comments_count || 0);
  const [isLiked, setIsLiked] = useState(false);
  const isSaved = bookmarks.some(b => b.id === post.id);

  // Subscribe to realtime updates for counts
  useEffect(() => {
    const sub = supabase.channel(`post-${post.id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'posts', filter: `id=eq.${post.id}` }, 
      (payload) => {
          if (payload.new.likes_count !== undefined) setLikesCount(payload.new.likes_count);
          if (payload.new.comments_count !== undefined) setCommentsCount(payload.new.comments_count);
      })
      .subscribe();
      
    // Check if liked
    if (user) {
        supabase.from('likes').select('id').eq('user_id', user.id).eq('post_id', post.id).maybeSingle()
        .then(({ data }) => { if(data) setIsLiked(true); });
    }

    return () => supabase.removeChannel(sub);
  }, [post.id, user]);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!user) return toast.error('Login to like');
    haptic.impactMedium(); // Now safe to call

    const prevLiked = isLiked;
    setIsLiked(!prevLiked);
    setLikesCount(prev => prevLiked ? prev - 1 : prev + 1);

    if (prevLiked) {
        await supabase.from('likes').delete().eq('user_id', user.id).eq('post_id', post.id);
    } else {
        await supabase.from('likes').insert({ user_id: user.id, post_id: post.id });
    }
  };

  const handleEcho = (e) => {
    e.stopPropagation();
    haptic.tap();
    setView('echo', post);
  };

  const openReader = () => {
    haptic.tap();
    setView('reader', post);
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    haptic.tap();
    const deepLink = `${window.location.origin}/?post=${post.id}`;
    if (navigator.share) await navigator.share({ title: 'Aalap', url: deepLink });
    else { await navigator.clipboard.writeText(deepLink); toast.success('Link copied'); }
  };

  const author = post.profiles || {};
  const categoryLabel = post.category === 'poem' ? 'কবিতা' : 'গল্প';

  return (
    <div className="notepad-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div className="card-click-area" onClick={openReader} style={{ padding: '24px 24px 10px 24px', flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div onClick={(e) => { e.stopPropagation(); setView('author', post.author_id); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', zIndex: 10 }}>
              <Avatar url={author.avatar_url} size={32} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700 }}>{author.display_name || 'নামবিহীন'}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-sec)' }}>{new Date(post.created_at).toLocaleDateString()}</div>
              </div>
            </div>
            <span className="meta-badge">{categoryLabel}</span>
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 800, margin: '0 0 10px', lineHeight: '1.3' }}>{post.title}</h3>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: '17px', lineHeight: '1.7', color: 'var(--text-sec)', margin: '0 0 15px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.body}</p>
      </div>

      <div style={{ padding: '10px 24px 20px 24px', marginTop: 'auto', borderTop: '1px dashed var(--border)', display: 'flex', justifyContent: 'space-between', background: 'var(--card)', position: 'relative', zIndex: 20 }}>
        <div style={{ display: 'flex', gap: '20px' }}>
            <button onClick={handleLike} className="haptic-btn" style={{ background: 'none', border: 'none', padding: '8px', display: 'flex', alignItems: 'center', gap: '6px', color: isLiked ? 'var(--danger)' : 'var(--text-sec)', fontSize: '13px', fontWeight: 600 }}>
                <Heart size={22} fill={isLiked ? 'currentColor' : 'none'} /> {likesCount}
            </button>
            <button onClick={handleEcho} className="haptic-btn" style={{ background: 'none', border: 'none', padding: '8px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-sec)', fontSize: '13px', fontWeight: 600 }}>
                <MessageCircle size={22} /> {commentsCount > 0 && commentsCount}
            </button>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleShare} className="haptic-btn" style={{ background: 'none', border: 'none', color: 'var(--text-sec)', padding: '8px' }}><Share2 size={22} /></button>
            <button onClick={(e) => { e.stopPropagation(); toggleBookmark(post); }} className="haptic-btn" style={{ background: 'none', border: 'none', color: bookmarks.some(b => b.id === post.id) ? 'var(--accent)' : 'var(--text-sec)', padding: '8px' }}><Bookmark size={22} fill={bookmarks.some(b => b.id === post.id) ? 'currentColor' : 'none'} /></button>
        </div>
      </div>
    </div>
  );
}