import { useState, useEffect } from 'react';
import { supabase } from '../data/supabaseClient';
import { useStore } from '../data/store';
import PostCard from './PostCard';

export default function Feed({ type }) {
  const { user, setTab } = useStore();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (type === 'bookmarks' && !user) { setLoading(false); return; }
    const fetch = async () => {
      setLoading(true);
      const query = supabase.from('posts').select(`*, profiles(*)`).order('created_at', { ascending: false });
      if (type === 'bookmarks') {
         const local = JSON.parse(localStorage.getItem('aalap-bookmarks') || '[]');
         setPosts(local);
      } else {
         const { data } = await query;
         setPosts(data || []);
      }
      setLoading(false);
    };
    fetch();
  }, [type, user]);

  if (loading) return <div style={{ padding: 40, textAlign: 'center', opacity: 0.5, fontFamily: 'var(--font-ui)' }}>লোড হৈ আছে...</div>;

  if (type === 'bookmarks' && !user) return (
      <div style={{ padding: 60, textAlign: 'center', opacity: 0.7 }}>
          <h3>লগ-ইন প্ৰয়োজনীয়</h3>
          <button onClick={() => setTab('profile')} className="btn-primary" style={{ marginTop: 20 }}>লগ-ইন কৰক</button>
      </div>
  );

  if (posts.length === 0) return <div style={{ padding: 40, textAlign: 'center', opacity: 0.5 }}>কোনো কাহিনী পোৱা নগ’ল</div>;

  return <div style={{ paddingBottom: 100 }}>{posts.map(p => <PostCard key={p.id} post={p} />)}</div>;
}