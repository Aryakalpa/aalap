import { useState, useEffect } from 'react';
import { supabase } from '../data/supabaseClient';
import { useStore } from '../data/store';
import PostCard from './PostCard';
import { motion } from 'framer-motion';

export default function Feed({ type }) {
  const { user, setTab } = useStore();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // GUARD: Guest cannot see bookmarks
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
             
             // CRITICAL FIX: Ensure data is an array
             setPosts(data || []);
          }
      } catch (err) {
          console.error("Feed Error:", err);
          setPosts([]); // Safety net
      } finally {
          setLoading(false);
      }
    };

    fetchPosts();
  }, [type, user]);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-sec)', fontSize: '14px' }}>Loading...</div>;

  // Guest View for Bookmarks
  if (type === 'bookmarks' && !user) {
      return (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-sec)' }}>
              <h3>Login to view bookmarks</h3>
              <button onClick={() => setTab('profile')} style={{ marginTop: '15px', padding: '10px 24px', background: 'var(--text)', color: 'var(--bg)', border: 'none', borderRadius: '30px', fontWeight: 600, cursor: 'pointer' }}>
                  Go to Login
              </button>
          </div>
      );
  }

  if (posts.length === 0) return <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-sec)' }}>No stories found.</div>;

  return (
    <div className="feed-container">
      {posts.map((post, i) => (
        <motion.div
          key={post.id || i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.5) }} // Cap delay
        >
          <PostCard post={post} />
        </motion.div>
      ))}
    </div>
  );
}