import { useState, useEffect } from 'react';
import { supabase } from '../data/supabaseClient';
import { useStore } from '../data/store';
import PostCard from './PostCard';

export default function Feed({ type }) {
  const { user, setTab } = useStore();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
          // Always fetch community posts for safety for now
          const { data } = await supabase.from('posts').select(`*, profiles(*)`);
          setPosts(data || []);
      } catch (err) {
          console.error(err);
      } finally {
          setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="feed-container" style={{ display: 'block', width: '100%' }}>
      {/* HEADER FOR DEBUGGING */}
      <div style={{ padding: '10px', borderBottom: '1px solid #333', marginBottom: '20px' }}>
         <h2 style={{ margin: 0, color: 'white' }}>Feed Active</h2>
         <small style={{ color: 'grey' }}>{loading ? "Loading..." : `${posts.length} Stories`}</small>
      </div>

      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      
      {/* If empty */}
      {!loading && posts.length === 0 && (
         <div style={{ padding: 20, color: 'grey' }}>No stories found.</div>
      )}
    </div>
  );
}