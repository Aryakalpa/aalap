import { Heart, Bookmark } from 'lucide-react';
import { useStore } from '../data/store';
import { useHaptic } from '../hooks/useHaptic';
import Avatar from '../components/Avatar';

export default function PostCard({ post }) {
  const { setView, toggleBookmark, bookmarks } = useStore();
  const haptic = useHaptic();
  if (!post) return null;
  
  const author = post.profiles || {};
  const isSaved = bookmarks.some(b => b.id === post.id);

  return (
    // CHANGED TO 'notepad-card' CLASS
    <div className="notepad-card" onClick={() => { haptic.tap(); setView('reader', post); }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div onClick={(e) => { e.stopPropagation(); setView('author', post.author_id); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', zIndex: 2 }}>
          <Avatar url={author.avatar_url} size={36} />
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>{author.display_name || 'নামবিহীন'}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-sec)' }}>{new Date(post.created_at).toLocaleDateString()}</div>
          </div>
        </div>
      </div>
      
      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 800, margin: '0 0 10px', lineHeight: '1.3' }}>{post.title}</h3>
      
      <p style={{ 
        fontFamily: 'var(--font-serif)', 
        fontSize: '17px', 
        lineHeight: '1.8', 
        color: 'var(--text-sec)', 
        margin: '0 0 20px', 
        display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' 
      }}>
        {post.body}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px dashed var(--border)', paddingTop: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-sec)', fontSize: '13px', fontWeight: 600 }}>
            <Heart size={16} /> {post.likes_count || 0}
        </div>
        <button onClick={(e) => { e.stopPropagation(); haptic.impactLight(); toggleBookmark(post); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: isSaved ? 'var(--accent)' : 'var(--text-sec)' }}>
            <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
        </button>
      </div>
    </div>
  );
}