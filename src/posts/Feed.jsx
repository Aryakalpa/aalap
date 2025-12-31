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
    const fetch = async () => {
      setLoading(true);
      if (type === 'bookmarks') {
         setPosts(JSON.parse(localStorage.getItem('aalap-bookmarks') || '[]'));
      } else {
         const { data } = await supabase.from('posts').select(`*, profiles(*)`).order('created_at', { ascending: false });
         setPosts(data || []);
      }
      setLoading(false);
    };
    fetch();
  }, [type, user]);

  if (loading) return <div style={{ padding: 40, textAlign: 'center', opacity: 0.5 }}>লোড হৈ আছে...</div>;

  if (type === 'bookmarks' && !user) return (
      <div style={{ padding: 60, textAlign: 'center', opacity: 0.8 }}>
          <h3 style={{ marginBottom: 10 }}>লগ-ইন প্ৰয়োজনীয়</h3>
          <p style={{ fontSize: 14, opacity: 0.6, marginBottom: 20 }}>বুকমাৰ্ক চাবলৈ অনুগ্ৰহ কৰি লগ-ইন কৰক</p>
          <button onClick={() => setTab('profile')} className="btn-soft" style={{ margin: '0 auto', background: 'var(--text-main)', color: 'var(--bg-body)' }}>
             লগ-ইন কৰক
          </button>
      </div>
  );

  if (posts.length === 0) return <div style={{ padding: 40, textAlign: 'center', opacity: 0.5 }}>কোনো কাহিনী পোৱা নগ’ল</div>;

  return <div style={{ paddingBottom: 100 }}>{posts.map(post => <PostCard key={post.id} post={post} />)}</div>;
}