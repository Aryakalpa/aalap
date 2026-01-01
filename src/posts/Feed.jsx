import { useState, useEffect, useRef } from 'react';
import { supabase } from '../data/supabaseClient';
import { useStore } from '../data/store';
import PostCard from './PostCard';
import { Loader2, RefreshCcw } from 'lucide-react';

export default function Feed({ type }) {
  const { user, setTab } = useStore();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pullY, setPullY] = useState(0);
  const startY = useRef(0);
  const isRefreshing = useRef(false);

  const fetchPosts = async () => {
    setLoading(true);
    if (type === 'bookmarks') {
       setPosts(JSON.parse(localStorage.getItem('aalap-bookmarks') || '[]'));
    } else {
       const { data } = await supabase.from('posts').select(`*, profiles(*)`).order('created_at', { ascending: false });
       setPosts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (type === 'bookmarks' && !user) { setLoading(false); return; }
    fetchPosts();
  }, [type, user]);

  // PULL TO REFRESH LOGIC
  const handleTouchStart = (e) => {
      if (window.scrollY === 0) startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
      if (window.scrollY === 0 && startY.current > 0) {
          const pull = e.touches[0].clientY - startY.current;
          if (pull > 0) setPullY(pull * 0.4); // Dampening
      }
  };

  const handleTouchEnd = async () => {
      if (pullY > 60 && !isRefreshing.current) {
          isRefreshing.current = true;
          setPullY(60); // Snap to loading position
          await fetchPosts();
          isRefreshing.current = false;
      }
      setPullY(0);
      startY.current = 0;
  };

  // RENDER HELPERS
  if (type === 'bookmarks' && !user) return (
      <div style={{ padding: 60, textAlign: 'center', opacity: 0.8 }}>
          <h3 style={{ marginBottom: 10 }}>লগ-ইন প্ৰয়োজনীয়</h3>
          <p style={{ fontSize: 14, opacity: 0.6, marginBottom: 20 }}>বুকমাৰ্ক চাবলৈ অনুগ্ৰহ কৰি লগ-ইন কৰক</p>
          <button onClick={() => setTab('profile')} className="btn-soft" style={{ margin: '0 auto', background: 'var(--text-main)', color: 'var(--bg-body)' }}>
             লগ-ইন কৰক
          </button>
      </div>
  );

  return (
    <div 
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ paddingBottom: 100, minHeight: '80vh', transition: 'transform 0.3s cubic-bezier(0,0,0.2,1)' }}
    >
      {/* PULL INDICATOR */}
      <div style={{ 
          height: pullY, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: pullY > 0 ? 1 : 0, transition: isRefreshing.current ? 'none' : 'height 0.3s'
      }}>
          <div style={{ background: 'var(--bg-card)', borderRadius: '50%', padding: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
             <RefreshCcw size={20} className={isRefreshing.current ? 'spin' : ''} style={{ transform: `rotate(${pullY * 2}deg)` }} />
          </div>
      </div>

      {loading && pullY === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', opacity: 0.5, display: 'flex', justifyContent: 'center' }}>
             <Loader2 className="spin" />
          </div>
      ) : (
          posts.length === 0 ? (
             <div style={{ padding: 40, textAlign: 'center', opacity: 0.5 }}>কোনো কাহিনী পোৱা নগ’ল</div>
          ) : (
             posts.map(post => <PostCard key={post.id} post={post} />)
          )
      )}
      
      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}