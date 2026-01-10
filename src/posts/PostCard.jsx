import { useState, useEffect } from 'react';
import { Heart, Bookmark, Share2, MessageCircle, Trash2, Edit3, Image as ImageIcon } from 'lucide-react';
import { useStore } from '../data/store';
import { supabase } from '../data/supabaseClient';
import { useNavigate } from 'react-router-dom';
import Avatar from '../components/Avatar';
import toast from 'react-hot-toast';
import ShareImageModal from '../components/ShareImageModal';

export default function PostCard({ post }) {
   const { user, toggleBookmark, bookmarks, setShareTarget, getBadges } = useStore();
   const navigate = useNavigate();
   const [stats, setStats] = useState({ likes: 0, comments: 0 });
   const [isLiked, setIsLiked] = useState(false);
   const [showImageModal, setShowImageModal] = useState(false);
   const [authorBadges, setAuthorBadges] = useState([]); // NEW

   const isSaved = Array.isArray(bookmarks) && bookmarks.some(b => b && b.id === post.id);
   const isAuthor = user && user.id === post.author_id;

   const getCategoryLabel = (c) => {
      const map = { 'poem': 'কবিতা', 'story': 'গল্প', 'article': 'প্ৰবন্ধ', 'misc': 'অন্যান্য' };
      return map[c] || 'লেখা';
   };

   useEffect(() => {
      // 1. Post Stats
      supabase.from('likes').select('id', { count: 'exact', head: true }).eq('post_id', post.id).then(({ count }) => setStats(s => ({ ...s, likes: count || 0 })));
      supabase.from('comments').select('id', { count: 'exact', head: true }).eq('post_id', post.id).then(({ count }) => setStats(s => ({ ...s, comments: count || 0 })));
      if (user) supabase.from('likes').select('id').eq('user_id', user.id).eq('post_id', post.id).maybeSingle().then(({ data }) => { if (data) setIsLiked(true); });

      // 2. Author Stats for Badges
      const loadAuthorBadges = async () => {
         try {
            const authorId = post.author_id;
            const [{ count: pCount }, { data: pIds }, { count: cCount }] = await Promise.all([
               supabase.from('posts').select('id', { count: 'exact', head: true }).eq('author_id', authorId),
               supabase.from('posts').select('id').eq('author_id', authorId),
               supabase.from('comments').select('id', { count: 'exact', head: true }).eq('user_id', authorId)
            ]);

            let totalLikes = 0;
            if (pIds && pIds.length > 0) {
               const { count } = await supabase.from('likes').select('id', { count: 'exact', head: true }).in('post_id', pIds.map(p => p.id));
               totalLikes = count || 0;
            }

            const badges = getBadges({ posts: pCount || 0, likes: totalLikes, comments: cCount || 0 });
            setAuthorBadges(badges);
         } catch (e) {
            console.error("Error loading badges", e);
         }
      };
      loadAuthorBadges();
   }, [post.id, user, post.author_id]);

   const authGuard = () => { if (!user) { toast.error('লগ-ইন কৰক'); navigate('/profile'); return false; } return true; };

   const like = async (e) => {
      e.stopPropagation(); if (!authGuard()) return;
      const prev = isLiked; setIsLiked(!prev); setStats(s => ({ ...s, likes: prev ? s.likes - 1 : s.likes + 1 }));
      if (prev) await supabase.from('likes').delete().eq('user_id', user.id).eq('post_id', post.id);
      else await supabase.from('likes').insert({ user_id: user.id, post_id: post.id });
   };

   const handleDelete = async (e) => {
      e.stopPropagation();
      if (!confirm('Delete?')) return;
      const { error } = await supabase.from('posts').delete().eq('id', post.id);
      if (!error) { toast.success('Deleted'); window.location.reload(); } else { toast.error('Error'); }
   };

   return (
      <div className="story-card">
         {/* IMAGE MODAL */}
         {showImageModal && <ShareImageModal post={post} user={post.profiles} close={() => setShowImageModal(false)} />}

         {post.cover_image && (
            <div onClick={() => navigate(`/post/${post.id}`, { state: post })} style={{ height: 160, width: '100%', cursor: 'pointer', background: post.cover_image.includes('gradient') ? post.cover_image : `url(${post.cover_image}) center/cover` }} />
         )}

         <div onClick={(e) => { e.stopPropagation(); navigate(`/author/${post.author_id}`); }} style={{ padding: '15px 20px 5px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
            <Avatar url={post.profiles?.avatar_url} size={40} />
            <div style={{ flex: 1 }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-main)' }}>{post.profiles?.display_name || 'Anonymous'}</div>
                  {/* BADGES ON FEED */}
                  <div style={{ display: 'flex', gap: 4 }}>
                     {authorBadges.map(b => (
                        <div key={b.id} title={b.label} style={{ width: 8, height: 8, borderRadius: '50%', background: b.color }} />
                     ))}
                  </div>
               </div>
               <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(post.created_at).toLocaleDateString()}</div>
            </div>
            {post.category && (<span style={{ fontSize: 11, background: 'var(--btn-soft)', padding: '4px 10px', borderRadius: 20, color: 'var(--text-muted)' }}>{getCategoryLabel(post.category)}</span>)}
         </div>

         <div onClick={() => navigate(`/post/${post.id}`, { state: post })} style={{ padding: '0 20px 15px', cursor: 'pointer' }}>
            <h3 style={{ fontSize: 22, fontWeight: 700, margin: '10px 0', lineHeight: 1.3, color: 'var(--text-main)' }}>{post.title}</h3>
            {!post.cover_image && (
               <p style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--text-main)', opacity: 0.9, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 }}>{post.body}</p>
            )}
            {post.cover_image && (
               <p style={{ fontSize: 15, lineHeight: 1.5, color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 }}>{post.body}</p>
            )}
         </div>

         <div style={{ padding: '10px 20px 20px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', gap: 20 }}>
               <button onClick={like} className="btn-icon" style={{ color: isLiked ? 'var(--danger)' : 'var(--text-muted)' }}><Heart size={22} fill={isLiked ? "currentColor" : "none"} /> {stats.likes}</button>
               <button onClick={(e) => { e.stopPropagation(); navigate(`/post/${post.id}/comments`); }} className="btn-icon"><MessageCircle size={22} /> {stats.comments > 0 && stats.comments}</button>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
               {isAuthor && (
                  <>
                     <button onClick={(e) => { e.stopPropagation(); navigate(`/studio/${post.id}`, { state: post }); }} className="btn-icon"><Edit3 size={20} /></button>
                     <button onClick={handleDelete} className="btn-icon" style={{ color: 'var(--danger)' }}><Trash2 size={20} /></button>
                  </>
               )}
               <button onClick={(e) => { e.stopPropagation(); setShowImageModal(true); }} className="btn-icon" style={{ color: 'var(--primary)' }}><ImageIcon size={22} /></button>
               <button onClick={(e) => { e.stopPropagation(); setShareTarget(post); }} className="btn-icon"><Share2 size={22} /></button>
               <button onClick={(e) => { e.stopPropagation(); if (authGuard()) toggleBookmark(post); }} className="btn-icon" style={{ color: isSaved ? 'var(--text-main)' : 'var(--text-muted)' }}><Bookmark size={22} fill={isSaved ? "currentColor" : "none"} /></button>
            </div>
         </div>
      </div>
   );
}
