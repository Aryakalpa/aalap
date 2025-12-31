import { useEffect, useState } from 'react';
import { supabase } from '../data/supabaseClient';
import { useStore } from '../data/store';
import PostCard from './PostCard';
import Skeleton from '../components/Skeleton';
import { motion } from 'framer-motion';

export default function Feed({ type = 'community' }) {
  const { user, bookmarks } = useStore();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (type === 'bookmarks') {
        setPosts(bookmarks);
        setLoading(false);
        return;
    }

    const fetchPosts = async () => {
        if(posts.length === 0) setLoading(true);
        let q = supabase.from('posts').select(`*, profiles(id, display_name, avatar_url)`).order('created_at', { ascending: false });
        if (type === 'user' && user) q = q.eq('author_id', user.id);
        
        const { data } = await q;
        setPosts(data || []);
        setLoading(false);
    };

    fetchPosts();
    const sub = supabase.channel('feed').on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, fetchPosts).subscribe();
    return () => { supabase.removeChannel(sub); };
  }, [type, bookmarks]);

  // ANIMATION VARIANTS
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 } // The Waterfall Effect
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } }
  };

  if (loading && posts.length === 0) return (
    <div style={{ paddingTop: '20px' }}>
        {[1,2,3].map(i => <div key={i} className="notepad-card" style={{ height: '200px' }}><Skeleton width="100%" height="100%" /></div>)}
    </div>
  );

  if (posts.length === 0) return <div style={{ textAlign: 'center', paddingTop: '100px', color: 'var(--text-sec)', fontFamily: 'var(--font-serif)', fontSize: '20px' }}>{type === 'bookmarks' ? 'আপোনাৰ সংগ্ৰহ শূন্য।' : 'এতিয়াও নিস্তব্ধ।'}</div>;

  return (
    <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        style={{ paddingBottom: '100px' }}
    >
        {posts.map(p => (
            <motion.div key={p.id} variants={item}>
                <PostCard post={p} />
            </motion.div>
        ))}
        {type === 'community' && <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-sec)', fontSize: '14px', fontFamily: 'var(--font-serif)', opacity: 0.5 }}>আৰু একো নাই</div>}
    </motion.div>
  );
}