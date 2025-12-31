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
    const fetchPosts = async () => {
      setLoading(true);
      try {
          if (type === 'bookmarks') {
             const local = JSON.parse(localStorage.getItem('aalap-bookmarks') || '[]');
             setPosts(local);
          } else {
             const { data } = await supabase.from('posts').select(`*, profiles(*)`).order('created_at', { ascending: false });
             setPosts(data || []);
          }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchPosts();
  }, [type, user]);

  if (loading) return <div style={{ padding: 40, textAlign: 'center', opacity: 0.5 }}>লোড হৈ আছে (Loading)...</div>;

  if (type === 'bookmarks' && !user) {
      return (
          <div style={{ textAlign: 'center', padding: 60, opacity: 0.7, border: '1px dashed #333', borderRadius: 12 }}>
              <h3>লগ-ইন কৰক</h3>
              <p style={{fontSize: 13, margin: '10px 0'}}>বুকমাৰ্ক চাবলৈ অনুগ্ৰহ কৰি লগ-ইন কৰক</p>
              <button onClick={() => setTab('profile')} style={{ padding: '8px 20px', background: '#333', color: '#fff', border: 'none', borderRadius: 20, fontFamily: 'Inter' }}>Login</button>
          </div>
      );
  }

  if (posts.length === 0) return <div style={{ padding: 40, textAlign: 'center', opacity: 0.5 }}>কোনো কাহিনী পোৱা নগ’ল (No stories).</div>;

  return <div style={{ paddingBottom: 100 }}>{posts.map(post => <PostCard key={post.id} post={post} />)}</div>;
}