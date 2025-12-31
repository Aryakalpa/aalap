import { useState, useEffect } from 'react';
import { supabase } from '../data/supabaseClient';
import { useStore } from '../data/store';
import PostCard from './PostCard';

export default function Feed({ type }) {
  const { user, setTab } = useStore();
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState('INIT'); // INIT, LOADING, ERROR, EMPTY, SUCCESS

  useEffect(() => {
    if (type === 'bookmarks' && !user) {
        setStatus('GUEST');
        return;
    }

    const fetchPosts = async () => {
      setStatus('LOADING');
      try {
          if (type === 'bookmarks') {
             const local = JSON.parse(localStorage.getItem('aalap-bookmarks') || '[]');
             setPosts(local);
             setStatus(local.length ? 'SUCCESS' : 'EMPTY');
          } else {
             const { data, error } = await supabase
                .from('posts')
                .select(`*, profiles(*)`)
                .order('created_at', { ascending: false });
             
             if (error) throw error;
             setPosts(data || []);
             setStatus(data && data.length > 0 ? 'SUCCESS' : 'EMPTY');
          }
      } catch (err) {
          console.error("DEVIL ERROR:", err);
          setStatus('ERROR');
      }
    };

    fetchPosts();
  }, [type, user]);

  // RENDER STATES (Explicit Returns)
  if (status === 'LOADING') return <div style={{padding: 20, color: 'orange'}}>LOADING DATA...</div>;
  if (status === 'ERROR') return <div style={{padding: 20, color: 'red'}}>DATABASE ERROR. CHECK CONSOLE.</div>;
  if (status === 'EMPTY') return <div style={{padding: 20, color: 'gray'}}>NO STORIES FOUND.</div>;
  
  if (status === 'GUEST') {
      return (
          <div style={{ textAlign: 'center', padding: 40, border: '1px solid #333', marginTop: 20 }}>
              <h3>Login Required</h3>
              <button onClick={() => setTab('profile')} style={{ padding: '10px 20px', marginTop: 10 }}>Login</button>
          </div>
      );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}