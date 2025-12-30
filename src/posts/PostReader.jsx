import { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Share, Loader2 } from 'lucide-react';
import { useStore } from '../data/store';
import { supabase } from '../data/supabaseClient';
import CommentSection from '../components/CommentSection';
import toast from 'react-hot-toast';

export default function PostReader({ post }) {
  const { setView, user } = useStore();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);

  // Check if user liked this post
  useEffect(() => {
    if (user) {
      supabase.from('likes').select('*').eq('user_id', user.id).eq('post_id', post.id)
        .then(({ data }) => { if (data.length > 0) setIsLiked(true); });
    }
  }, [user, post.id]);

  const toggleLike = async () => {
    if (!user) return toast.error("Sign in to appreciate.");
    
    // Optimistic UI Update
    const newStatus = !isLiked;
    setIsLiked(newStatus);
    setLikesCount(prev => newStatus ? prev + 1 : prev - 1);

    if (newStatus) {
      await supabase.from('likes').insert({ user_id: user.id, post_id: post.id });
      await supabase.rpc('increment_likes', { row_id: post.id }); // Needs RPC or trigger (simplified here)
    } else {
      await supabase.from('likes').delete().eq('user_id', user.id).eq('post_id', post.id);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };

  if (!post) return null;

  return (
    <div className="main-content" style={{ maxWidth: '720px', margin: '0 auto', paddingTop: '40px', paddingBottom: '100px' }}>
      <button onClick={() => setView('main')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-sec)', marginBottom: '30px' }}>
        <ArrowLeft size={24} />
      </button>

      <article className="fade-in">
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', fontWeight: '900', lineHeight: '1.1', marginBottom: '10px' }}>
          {post.title}
        </h1>
        
        <div style={{ display: 'flex', gap: '15px', color: 'var(--text-sec)', fontSize: '14px', marginBottom: '40px' }}>
            <span style={{ fontWeight: '600', color: 'var(--accent)' }}>{post.profiles?.display_name || 'Unknown Author'}</span>
            <span>•</span>
            <span>{new Date(post.created_at).toLocaleDateString()}</span>
        </div>

        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', lineHeight: '1.8', color: 'var(--text)' }}>
          {post.body.split('\n').map((para, i) => (
            <p key={i} style={{ marginBottom: '24px' }}>{para}</p>
          ))}
        </div>
      </article>

      <div style={{ marginTop: '60px', display: 'flex', justifyContent: 'center', gap: '40px' }}>
         <button onClick={toggleLike} className="haptic-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', color: isLiked ? '#ff3b5c' : 'var(--text-sec)' }}>
            <Heart size={32} fill={isLiked ? '#ff3b5c' : 'none'} />
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{likesCount}</span>
         </button>
         <button onClick={handleShare} className="haptic-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', color: 'var(--text-sec)' }}>
            <Share size={32} />
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Share</span>
         </button>
      </div>

      <CommentSection postId={post.id} />
    </div>
  );
}