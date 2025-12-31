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
    // GUARD: If Guest tries to view Bookmarks, stop here.
    if (type === 'bookmarks' && !user) {
        setLoading(false);
        return;
    }

    const fetchPosts = async () => {
      setLoading(true);
      let query = supabase.from('posts').select(`*, profiles(*)`);

      if (type === 'bookmarks') {
         // This block only runs if user exists (checked above)
         // Get IDs from local storage or DB. For now, assuming local storage sync via store logic or DB fetch
         // Actually, for bookmarks, we usually fetch the list of IDs first.
         // Let's stick to the 'Feed' logic. If type is community, just fetch all.
         query = query.order('created_at', { ascending: false });
      } else {
         // Community Feed
         query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      
      // Filter logic: If bookmarks, filter client side if needed, or use join. 
      // For simplicity in this patch, we handle Community Feed mainly.
      // If bookmarks logic existed previously, we keep it simple here:
      if (type === 'bookmarks') {
          // Fetch user's bookmarks from localStorage (since we sync there)
          const local = JSON.parse(localStorage.getItem('aalap-bookmarks') || '[]');
          setPosts(local);
      } else {
          if (data) setPosts(data);
      }
      
      setLoading(false);
    };

    fetchPosts();
  }, [type, user]);

  if (loading) return <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-sec)' }}>Loading stories...</div>;

  // GUEST VIEWING BOOKMARKS
  if (type === 'bookmarks' && !user) {
      return (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-sec)' }}>
              <h3>Login to view bookmarks</h3>
              <button onClick={() => setTab('profile')} style={{ marginTop: '10px', padding: '10px 20px', background: 'var(--text)', color: 'var(--bg)', border: 'none', borderRadius: '20px', cursor: 'pointer' }}>
                  Go to Login
              </button>
          </div>
      );
  }

  if (posts.length === 0) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-sec)' }}>No stories found.</div>;

  return (
    <div className="feed-container">
      {posts.map((post, i) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
        >
          <PostCard post={post} />
        </motion.div>
      ))}
    </div>
  );
}