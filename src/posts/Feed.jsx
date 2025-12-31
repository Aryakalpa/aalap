import { useState, useEffect } from 'react';
import { supabase } from '../data/supabaseClient';
import { useStore } from '../data/store';
import PostCard from './PostCard';

export default function Feed({ type }) {
  const { user, setTab } = useStore();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Force fetch for guest or user
    const fetchPosts = async () => {
      setLoading(true);
      try {
          // Ignore bookmarks logic for now. Just fetch posts.
          const { data, error } = await supabase.from('posts').select(`*`);
          if (error) console.error(error);
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
    <div style={{ padding: '20px', background: 'red', minHeight: '100vh' }}>
      <h1 style={{ color: 'white' }}>DEBUG FEED</h1>
      <p style={{ color: 'white' }}>Status: {loading ? "Loading..." : "Done"}</p>
      <p style={{ color: 'white' }}>Count: {posts.length}</p>
      
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}