import { Heart, Bookmark, Share2, MessageCircle } from 'lucide-react';
import { useStore } from '../data/store';
import { useHaptic } from '../hooks/useHaptic';
import Avatar from '../components/Avatar';
import toast from 'react-hot-toast';

export default function PostCard({ post }) {
  const { setView, toggleBookmark, bookmarks } = useStore();
  const haptic = useHaptic();
  if (!post) return null;
  
  const author = post.profiles || {};
  const isSaved = bookmarks.some(b => b.id === post.id);
  const categoryLabel = post.category === 'poem' ? 'কবিতা' : 'গল্প';

  // --- ACTIONS ---
  const handleLike = () => {
    haptic.impactMedium();
    toast.success('আপুনি ভাল পালে!', { icon: '❤️' });
  };

  const handleEcho = () => {
    haptic.tap();
    toast('মন্তব্য বিভাগ শীঘ্ৰে আহিব', { icon: '💬' });
  };

  const handleShare = async () => {
    haptic.tap();
    const shareData = {
        title: `Aalap: ${post.title}`,
        text: `Read "${post.title}" by ${author.display_name} on Aalap.\n\n`,
        url: window.location.href 
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
            toast.success('লিংক কপি কৰা হ\'ল');
        }
    } catch (err) {
        console.error('Share failed:', err);
    }
  };

  const handleBookmark = () => {
    haptic.impactLight();
    toggleBookmark(post);
  };

  const openReader = () => {
    haptic.tap();
    setView('reader', post);
  };

  const openAuthor = (e) => {
    e.stopPropagation();
    setView('author', post.author_id);
  };

  return (
    <div className="notepad-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      
      {/* ZONE A: CONTENT (CLICK TO READ) */}
      <div 
        onClick={openReader} 
        style={{ padding: '24px 24px 10px 24px', cursor: 'pointer', flex: 1 }}
      >
          {/* HEADER */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div onClick={openAuthor} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', zIndex: 10 }}>
              <Avatar url={author.avatar_url} size={32} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', lineHeight: '1.2' }}>{author.display_name || 'নামবিহীন'}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-sec)' }}>{new Date(post.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <span className="meta-badge">{categoryLabel}</span>
          </div>
          
          {/* TITLE & BODY */}
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 800, margin: '0 0 10px', lineHeight: '1.3', color: 'var(--text)' }}>
            {post.title}
          </h3>
          
          <p style={{ 
            fontFamily: 'var(--font-serif)', fontSize: '17px', lineHeight: '1.7', 
            color: 'var(--text-sec)', margin: '0 0 15px', 
            display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' 
          }}>
            {post.body}
          </p>
      </div>

      {/* ZONE B: FOOTER (SAFE ZONE - NO PARENT CLICK) */}
      <div style={{ 
          padding: '10px 24px 20px 24px', 
          marginTop: 'auto', 
          borderTop: '1px dashed var(--border)', /* Visual separation */
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--card)', /* Ensure it sits on top */
          zIndex: 5
      }}>
        
        {/* LEFT: Like & Echo */}
        <div style={{ display: 'flex', gap: '20px' }}>
            <button onClick={handleLike} className="haptic-btn" style={{ background: 'none', border: 'none', padding: '8px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-sec)', fontSize: '13px', fontWeight: 600 }}>
                <Heart size={22} /> {post.likes_count || 0}
            </button>

            <button onClick={handleEcho} className="haptic-btn" style={{ background: 'none', border: 'none', padding: '8px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-sec)', fontSize: '13px', fontWeight: 600 }}>
                <MessageCircle size={22} /> 
            </button>
        </div>
        
        {/* RIGHT: Share & Save */}
        <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleShare} className="haptic-btn" style={{ background: 'none', border: 'none', color: 'var(--text-sec)', padding: '8px' }}>
                <Share2 size={22} />
            </button>

            <button onClick={handleBookmark} className="haptic-btn" style={{ background: 'none', border: 'none', color: isSaved ? 'var(--accent)' : 'var(--text-sec)', padding: '8px' }}>
                <Bookmark size={22} fill={isSaved ? 'currentColor' : 'none'} strokeWidth={isSaved ? 0 : 2} />
            </button>
        </div>

      </div>
    </div>
  );
}