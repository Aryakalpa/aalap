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
  
  // Local State for Instant Interaction
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [isLiked, setIsLiked] = useState(false); // Default false, updated by effect
  const isSaved = bookmarks.some(b => b.id === post.id);

  // Check if User Liked This Post
  useEffect(() => {
    if (!user) return;
    const checkLike = async () => {
        const { data } = await supabase.from('likes').select('id').eq('user_id', user.id).eq('post_id', post.id).single();
        if (data) setIsLiked(true);
    };
    checkLike();
  }, [user, post.id]);

  const handleLike = async () => {
    if (!user) return toast.error('Please login to like');
    haptic.impactMedium();

    // 1. Optimistic Update (Immediate UI Change)
    const oldLiked = isLiked;
    const oldCount = likesCount;
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);

    // 2. Server Sync
    if (oldLiked) {
        // Unlike
        const { error } = await supabase.from('likes').delete().eq('user_id', user.id).eq('post_id', post.id);
        if (error) { setIsLiked(true); setLikesCount(oldCount); } // Revert on error
    } else {
        // Like
        const { error } = await supabase.from('likes').insert({ user_id: user.id, post_id: post.id });
        if (error) { setIsLiked(false); setLikesCount(oldCount); }
    }
  };

  const handleEcho = () => {
    haptic.tap();
    // Open the Echo Chamber
    setView('echo', post);
  };

  const handleShare = async () => {
    haptic.tap();
    const deepLink = `${window.location.origin}/?post=${post.id}`;
    const shareData = { title: `Aalap`, text: `Read "${post.title}" on Aalap.\n`, url: deepLink };
    if (navigator.share) await navigator.share(shareData);
    else { await navigator.clipboard.writeText(deepLink); toast.success('Link copied'); }
  };

  const openReader = () => {
    haptic.tap();
    const newUrl = `${window.location.pathname}?post=${post.id}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
    setView('reader', post);
  };

  const author = post.profiles || {};
  const categoryLabel = post.category === 'poem' ? 'কবিতা' : 'গল্প';

  return (
    <div className="notepad-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      
      {/* CLICKABLE AREA */}
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

      {/* FOOTER ACTIONS */}
      <div style={{ padding: '10px 24px 20px 24px', marginTop: 'auto', borderTop: '1px dashed var(--border)', display: 'flex', justifyContent: 'space-between', background: 'var(--card)', position: 'relative', zIndex: 20 }}>
        <div style={{ display: 'flex', gap: '20px' }}>
            {/* LIKE */}
            <button onClick={handleLike} className="haptic-btn" style={{ background: 'none', border: 'none', padding: '8px', display: 'flex', alignItems: 'center', gap: '6px', color: isLiked ? 'var(--danger)' : 'var(--text-sec)', fontSize: '13px', fontWeight: 600 }}>
                <Heart size={22} fill={isLiked ? 'currentColor' : 'none'} /> {likesCount}
            </button>
            {/* ECHO */}
            <button onClick={handleEcho} className="haptic-btn" style={{ background: 'none', border: 'none', padding: '8px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-sec)', fontSize: '13px', fontWeight: 600 }}>
                <MessageCircle size={22} /> 
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