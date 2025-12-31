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
  
  // State for Counts & Status
  const [likesCount, setLikesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const isSaved = bookmarks.some(b => b.id === post.id);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
        // 1. GET REAL LIKE COUNT
        const { count: lCount } = await supabase.from('likes').select('id', { count: 'exact', head: true }).eq('post_id', post.id);
        
        // 2. GET REAL COMMENT COUNT
        const { count: cCount } = await supabase.from('comments').select('id', { count: 'exact', head: true }).eq('post_id', post.id);
        
        if (isMounted) {
            setLikesCount(lCount || 0);
            setCommentsCount(cCount || 0);
        }

        // 3. CHECK IF I LIKED IT
        if (user) {
            const { data } = await supabase.from('likes').select('id').eq('user_id', user.id).eq('post_id', post.id).maybeSingle();
            if (isMounted && data) setIsLiked(true);
        }
    };

    loadData();

    // REALTIME LISTENER (Updates instantly)
    const sub = supabase.channel(`card-${post.id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'likes', filter: `post_id=eq.${post.id}` }, () => {
             // Reload count on any change
             supabase.from('likes').select('id', { count: 'exact', head: true }).eq('post_id', post.id).then(({ count }) => setLikesCount(count || 0));
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'comments', filter: `post_id=eq.${post.id}` }, () => {
             supabase.from('comments').select('id', { count: 'exact', head: true }).eq('post_id', post.id).then(({ count }) => setCommentsCount(count || 0));
        })
        .subscribe();

    return () => { isMounted = false; supabase.removeChannel(sub); };
  }, [post.id, user]);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!user) return toast.error('Login to like');
    haptic.impactMedium();

    // Optimistic UI
    const wasLiked = isLiked;
    setIsLiked(!wasLiked);
    setLikesCount(prev => wasLiked ? prev - 1 : prev + 1);

    if (wasLiked) {
        const { error } = await supabase.from('likes').delete().eq('user_id', user.id).eq('post_id', post.id);
        if (error) { setIsLiked(true); setLikesCount(prev => prev + 1); toast.error('Error unliking'); }
    } else {
        const { error } = await supabase.from('likes').insert({ user_id: user.id, post_id: post.id });
        if (error) { 
            setIsLiked(false); setLikesCount(prev => prev - 1); 
            // Only show error if it's NOT a double-click duplicate
            if (error.code !== '23505') toast.error('Error liking'); 
        }
    }
  };

  const handleEcho = (e) => {
    e.stopPropagation();
    haptic.tap();
    setView('echo', post);
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    haptic.tap();
    const deepLink = `${window.location.origin}/?post=${post.id}`;
    if (navigator.share) await navigator.share({ title: 'Aalap', url: deepLink });
    else { await navigator.clipboard.writeText(deepLink); toast.success('Link copied'); }
  };

  const openReader = () => {
    haptic.tap();
    const newUrl = `${window.location.pathname}?post=${post.id}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
    setView('reader', post);
  };

  const openAuthor = (e) => {
     e.stopPropagation();
     setView('author', post.author_id);
  };

  const author = post.profiles || {};
  const categoryLabel = post.category === 'poem' ? 'কবিতা' : 'গল্প';

  return (
    <div className="notepad-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div className="card-click-area" onClick={openReader} style={{ padding: '24px 24px 10px 24px', flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div onClick={openAuthor} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', zIndex: 10 }}>
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