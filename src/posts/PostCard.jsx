import { Heart, Bookmark, Clock, Share2 } from 'lucide-react';
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
  const wordCount = post.body ? post.body.trim().split(/\s+/).length : 0;
  const readTime = Math.ceil(wordCount / 200);
  const categoryLabel = post.category === 'poem' ? 'কবিতা' : 'গল্প';

  // --- SHARE LOGIC FIX ---
  const handleShare = async (e) => {
    e.stopPropagation();
    haptic.tap();
    const shareData = {
        title: `Aalap: ${post.title}`,
        text: `Read "${post.title}" by ${author.display_name} on Aalap.\n\n`,
        url: window.location.href // Ideally link to specific post if routing existed
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            // Fallback for desktop/unsupported browsers
            await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
            toast.success(' লিংক কপি কৰা হ\'ল'); // Link copied
        }
    } catch (err) {
        console.error('Share failed:', err);
    }
  };
  // ----------------------

  return (
    <div className="notepad-card" onClick={() => { haptic.tap(); setView('reader', post); }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div onClick={(e) => { e.stopPropagation(); setView('author', post.author_id); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', zIndex: 2 }}>
          <Avatar url={author.avatar_url} size={32} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', lineHeight: '1.2' }}>{author.display_name || 'নামবিহীন'}</span>
            <span style={{ fontSize: '11px', color: 'var(--text-sec)' }}>{new Date(post.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        <span className="meta-badge">{categoryLabel}</span>
      </div>
      
      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 800, margin: '0 0 10px', lineHeight: '1.3', color: 'var(--text)' }}>
        {post.title}
      </h3>
      
      <p style={{ 
        fontFamily: 'var(--font-serif)', fontSize: '17px', lineHeight: '1.7', 
        color: 'var(--text-sec)', margin: '0 0 20px', 
        display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' 
      }}>
        {post.body}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '15px', marginTop: '5px' }}>
        <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-sec)', fontSize: '12px', fontWeight: 600 }}>
                <Heart size={16} /> {post.likes_count || 0}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-sec)', fontSize: '12px', fontWeight: 600 }}>
                <Clock size={16} /> {readTime} min
            </div>
        </div>
        
        <div style={{ display: 'flex', gap: '15px' }}>
             {/* SHARE BUTTON ADDED */}
            <button onClick={handleShare} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-sec)', padding: '5px' }}>
                <Share2 size={20} />
            </button>

            <button onClick={(e) => { e.stopPropagation(); haptic.impactLight(); toggleBookmark(post); }} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: isSaved ? 'var(--accent)' : 'var(--text-sec)', padding: '5px' }}>
                <Bookmark size={20} fill={isSaved ? 'currentColor' : 'none'} strokeWidth={isSaved ? 0 : 2} />
            </button>
        </div>
      </div>
    </div>
  );
}