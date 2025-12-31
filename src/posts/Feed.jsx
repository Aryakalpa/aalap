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

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>Loading...</div>;
  if (type === 'bookmarks' && !user) return <div style={{textAlign:'center',padding:60}}>Login required</div>;
  if (posts.length === 0) return <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>No stories.</div>;

  return <div style={{ paddingBottom: 100 }}>{posts.map(post => <PostCard key={post.id} post={post} />)}</div>;
}