import { useState, useEffect } from 'react';
import { Heart, Bookmark, Share2, MessageCircle, Trash2, Edit3 } from 'lucide-react';
import { useStore } from '../data/store';
import { supabase } from '../data/supabaseClient';
import { sharePost } from '../utils/share';
import Avatar from '../components/Avatar';
import toast from 'react-hot-toast';

export default function PostCard({ post }) {
  const { user, setView, toggleBookmark, bookmarks, setTab, setShareTarget } = useStore();
  const [stats, setStats] = useState({ likes: 0, comments: 0 });
  const [isLiked, setIsLiked] = useState(false);
  const isSaved = Array.isArray(bookmarks) && bookmarks.some(b => b && b.id === post.id);
  const isAuthor = user && user.id === post.author_id;

  const getCategoryLabel = (c) => {
      const map = { 'poem': 'কবিতা', 'story': 'গল্প', 'article': 'প্ৰবন্ধ', 'misc': 'অন্যান্য' };
      return map[c] || 'লেখা';
  };

  useEffect(() => {
    supabase.from('likes').select('id', {count:'exact',head:true}).eq('post_id', post.id).then(({count}) => setStats(s => ({...s, likes:count||0})));
    supabase.from('comments').select('id', {count:'exact',head:true}).eq('post_id', post.id).then(({count}) => setStats(s => ({...s, comments:count||0})));
    if(user) supabase.from('likes').select('id').eq('user_id', user.id).eq('post_id', post.id).maybeSingle().then(({data}) => { if(data) setIsLiked(true); });
  }, [post.id, user]);

  const authGuard = () => { if(!user) { toast.error('লগ-ইন কৰক'); setTab('profile'); return false; } return true; };

  const like = async (e) => {
    e.stopPropagation(); if(!authGuard()) return;
    const prev = isLiked; setIsLiked(!prev); setStats(s => ({...s, likes: prev ? s.likes-1 : s.likes+1}));
    if(prev) await supabase.from('likes').delete().eq('user_id', user.id).eq('post_id', post.id);
    else await supabase.from('likes').insert({ user_id: user.id, post_id: post.id });
  };

  const handleDelete = async (e) => {
      e.stopPropagation();
      if(!confirm('Delete?')) return;
      const { error } = await supabase.from('posts').delete().eq('id', post.id);
      if(!error) { toast.success('Deleted'); window.location.reload(); } else { toast.error('Error'); }
  };

  return (
    <div className="story-card">
      {post.cover_image && (
          <div onClick={() => setView('reader', post)} style={{ height: 160, width: '100%', cursor: 'pointer', background: post.cover_image.includes('gradient') ? post.cover_image : `url(${post.cover_image}) center/cover` }} />
      )}

      <div onClick={(e) => { e.stopPropagation(); setView('author', post.author_id); }} style={{ padding: '15px 20px 5px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
         <Avatar url={post.profiles?.avatar_url} size={40} />
         <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color:'var(--text-main)' }}>{post.profiles?.display_name || 'Anonymous'}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(post.created_at).toLocaleDateString()}</div>
         </div>
         {post.category && (<span style={{ fontSize: 11, background: 'var(--btn-soft)', padding: '4px 10px', borderRadius: 20, color: 'var(--text-muted)' }}>{getCategoryLabel(post.category)}</span>)}
      </div>

      <div onClick={() => setView('reader', post)} style={{ padding: '0 20px 15px', cursor: 'pointer' }}>
         <h3 style={{ fontSize: 22, fontWeight: 700, margin: '10px 0', lineHeight: 1.3, color:'var(--text-main)' }}>{post.title}</h3>
         {!post.cover_image && (
             <p style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--text-main)', opacity: 0.9, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 }}>{post.body}</p>
         )}
         {post.cover_image && (
             <p style={{ fontSize: 15, lineHeight: 1.5, color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 }}>{post.body}</p>
         )}
      </div>

      <div style={{ padding: '10px 20px 20px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)' }}>
         <div style={{ display: 'flex', gap: 20 }}>
            <button onClick={like} className="btn-icon" style={{color: isLiked ? 'var(--danger)' : 'var(--text-muted)'}}><Heart size={22} fill={isLiked ? "currentColor" : "none"} /> {stats.likes}</button>
            <button onClick={(e) => { e.stopPropagation(); setView('echo', post); }} className="btn-icon"><MessageCircle size={22} /> {stats.comments > 0 && stats.comments}</button>
         </div>
         <div style={{ display: 'flex', gap: 10 }}>
            {isAuthor && (
                <>
                   <button onClick={(e) => { e.stopPropagation(); setView('studio', post); }} className="btn-icon"><Edit3 size={20} /></button>
                   <button onClick={handleDelete} className="btn-icon" style={{ color: 'var(--danger)' }}><Trash2 size={20} /></button>
                </>
            )}
            <button onClick={(e) => { e.stopPropagation(); setShareTarget(post); }} className="btn-icon"><Share2 size={22} /></button>
            <button onClick={(e) => { e.stopPropagation(); if(authGuard()) toggleBookmark(post); }} className="btn-icon" style={{color: isSaved ? 'var(--text-main)' : 'var(--text-muted)'}}><Bookmark size={22} fill={isSaved ? "currentColor" : "none"} /></button>
         </div>
      </div>
    </div>
  );
}