import { useEffect, useState } from 'react';
import { supabase } from '../data/supabaseClient';
import { useStore } from '../data/store';
import PostCard from './PostCard';
import { Loader2 } from 'lucide-react';

const SkeletonCard = () => (
  <div className="soul-card" style={{ opacity: 0.7 }}>
    <div style={{ width: '60px', height: '16px', background: 'var(--border)', borderRadius: '4px', marginBottom: '15px' }}></div>
    <div style={{ width: '80%', height: '24px', background: 'var(--border)', borderRadius: '6px', marginBottom: '10px' }}></div>
    <div style={{ width: '100%', height: '16px', background: 'var(--border)', borderRadius: '4px', marginBottom: '8px' }}></div>
    <div style={{ width: '90%', height: '16px', background: 'var(--border)', borderRadius: '4px', marginBottom: '20px' }}></div>
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--border)' }}></div>
      <div style={{ width: '100px', height: '12px', background: 'var(--border)', borderRadius: '4px' }}></div>
    </div>
  </div>
);

export default function FeedScreen({ type = 'community' }) {
  const { user } = useStore();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    // Only show full loader on initial mount, silent refresh otherwise
    if (posts.length === 0) setLoading(true);
    
    let q = supabase.from('posts').select(`*, profiles (id, username, display_name)`).order('created_at', { ascending: false });
    if (type === 'user' && user) q = q.eq('author_id', user.id);
    
    const { data } = await q;
    setPosts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
    const channel = supabase.channel('public:posts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, () => fetchPosts())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [type]);

  if (loading) {
    return (
      <div style={{ paddingBottom: '100px' }}>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div style={{ textAlign: 'center', paddingTop: '80px', color: 'var(--text-sec)' }}>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '18px' }}>
          {type === 'user' ? "Write your first story." : "Silence is golden."}
        </p>
      </div>
    );
  }

  return <div style={{ paddingBottom: '100px' }}>{posts.map(p => <PostCard key={p.id} post={p} />)}</div>;
}