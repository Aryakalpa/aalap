import { useState, useEffect } from 'react';
import { supabase } from '../data/supabaseClient';
import { useStore } from '../data/store';
import PostCard from './PostCard';

export default function Feed({ type }) {
  const { user } = useStore();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
          // Force fetch everything for now
          const { data, error } = await supabase.from('posts').select(`*, profiles(*)`);
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
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: 'cyan' }}>DEBUG FEED: {type}</h2>
      <p style={{ color: 'gray' }}>User Status: {user ? "Logged In" : "Guest"}</p>
      <p style={{ color: 'gray' }}>Stories Loaded: {posts.length}</p>

      {loading && <div style={{ color: 'yellow' }}>LOADING DATA...</div>}

      {posts.map((post) => (
        <div key={post.id} className="notepad-card">
           <div className="debug-text">ID: {post.id}</div>
           <h3 style={{ margin: '0 0 10px', color: '#fff' }}>{post.title}</h3>
           <PostCard post={post} />
        </div>
      ))}
    </div>
  );
}