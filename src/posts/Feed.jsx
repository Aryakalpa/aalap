import { useState, useEffect } from 'react';
import { supabase } from '../data/supabaseClient';
import { useStore } from '../data/store';
import PostCard from './PostCard';
import { motion } from 'framer-motion';

export default function Feed({ type }) {
  const { user, setTab } = useStore();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    console.log(`>>> FEED LOADING (${type}). User:`, user ? "Logged In" : "Guest");

    if (type === 'bookmarks' && !user) {
        setLoading(false);
        return;
    }

    const fetchPosts = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
          if (type === 'bookmarks') {
             const local = JSON.parse(localStorage.getItem('aalap-bookmarks') || '[]');
             setPosts(local);
          } else {
             // Fetch Community Posts
             const { data, error } = await supabase
                .from('posts')
                .select(`*, profiles(*)`)
                .order('created_at', { ascending: false });
             
             if (error) {
                 console.error("!!! FEED FETCH ERROR:", error);
                 throw error;
             }
             
             console.log(">>> FETCH SUCCESS. Posts found:", data?.length);
             setPosts(data || []);
          }
      } catch (err) {
          console.error("FEED CRASH:", err);
          setErrorMsg(err.message || "Failed to load stories.");
      } finally {
          setLoading(false);
      }
    };

    fetchPosts();
  }, [type, user]);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-sec)' }}>Loading stories...</div>;

  if (errorMsg) {
      return (
        <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
            <p>Error loading feed:</p>
            <code>{errorMsg}</code>
            <br/><br/>
            <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      );
  }

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
          transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.5) }}
        >
          <PostCard post={post} />
        </motion.div>
      ))}
    </div>
  );
}