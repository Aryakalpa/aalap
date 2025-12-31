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
      try {
          // Always fetch community posts for now to ensure data shows
          const { data } = await supabase.from('posts').select(`*, profiles(*)`);
          setPosts(data || []);
      } catch (err) {
          console.error(err);
      } finally {
          setLoading(false);
      }
    };
    fetchPosts();
  }, [type, user]);

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>Loading...</div>;

  if (type === 'bookmarks' && !user) {
      return (
          <div style={{ textAlign: 'center', padding: 60, color: '#888' }}>
              <h3>Login required</h3>
              <button onClick={() => setTab('profile')} style={{ padding: '10px 20px', background: '#eee', color: '#000', border: 'none', borderRadius: 4, marginTop: 10 }}>Login</button>
          </div>
      );
  }

  return (
    <div style={{ paddingBottom: 100 }}>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      {posts.length === 0 && <div style={{ padding: 20, color: '#666' }}>No stories.</div>}
    </div>
  );
}