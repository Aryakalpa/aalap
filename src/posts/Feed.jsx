import { useState, useEffect } from 'react';
import { supabase } from '../data/supabaseClient';
import { useStore } from '../data/store';
import PostCard from './PostCard';

export default function Feed({ type }) {
  const { user, setTab } = useStore();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (type === 'bookmarks' && !user) {
        setLoading(false);
        return;
    }

    const fetchPosts = async () => {
      setLoading(true);
      try {
          if (type === 'bookmarks') {
             const local = JSON.parse(localStorage.getItem('aalap-bookmarks') || '[]');
             setPosts(local);
          } else {
             const { data, error } = await supabase
                .from('posts')
                .select(`*, profiles(*)`)
                .order('created_at', { ascending: false });
             
             if (error) throw error;
             setPosts(data || []);
          }
      } catch (err) {
          console.error("FEED ERROR:", err);
      } finally {
          setLoading(false);
      }
    };

    fetchPosts();
  }, [type, user]);

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-sec)', fontSize: '14px' }}>Loading stories...</div>;

  if (type === 'bookmarks' && !user) {
      return (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-sec)' }}>
              <h3>Login to view bookmarks</h3>
              <button onClick={() => setTab('profile')} style={{ marginTop: '15px', padding: '10px 24px', background: 'var(--text)', color: 'var(--bg)', border: 'none', borderRadius: '30px', fontWeight: 600, cursor: 'pointer' }}>Go to Login</button>
          </div>
      );
  }

  if (posts.length === 0) return <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-sec)' }}>No stories found.</div>;

  return (
    <div style={{ paddingBottom: '100px' }}>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}