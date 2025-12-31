import { useEffect, useState } from 'react';
import { supabase } from '../data/supabaseClient';
import { useStore } from '../data/store';
import PostCard from './PostCard';
import Skeleton from '../components/Skeleton';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';

export default function Feed({ type = 'community' }) {
  const { user, bookmarks } = useStore();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
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

  // Client-side Search Filter (Instant)
  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } }
  };

  return (
    <div style={{ paddingBottom: '100px' }}>
        {/* SEARCH BAR (Only on Community Feed) */}
        {type === 'community' && (
            <div style={{ position: 'relative', marginBottom: '25px', zIndex: 10 }}>
                <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-sec)', opacity: 0.7 }} />
                <input 
                    className="soul-card" 
                    placeholder="গল্প বা কবিতা বিচাৰক..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ 
                        width: '100%', margin: 0, padding: '14px 14px 14px 45px', 
                        fontSize: '16px', fontFamily: 'var(--font-serif)', 
                        borderRadius: '30px', border: '1px solid var(--border)',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                        background: 'var(--card)'
                    }} 
                />
                {searchQuery && (
                    <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'var(--text-sec)', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'grid', placeItems: 'center', color: 'var(--bg)', cursor: 'pointer' }}>
                        <X size={12} />
                    </button>
                )}
            </div>
        )}

        {loading && posts.length === 0 ? (
            <div style={{ paddingTop: '10px' }}>
                {[1,2,3].map(i => <div key={i} className="notepad-card" style={{ height: '200px' }}><Skeleton width="100%" height="100%" /></div>)}
            </div>
        ) : (
            <motion.div variants={container} initial="hidden" animate="show">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map(p => (
                        <motion.div key={p.id} variants={item}>
                            <PostCard post={p} />
                        </motion.div>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', paddingTop: '60px', color: 'var(--text-sec)', opacity: 0.6 }}>
                        <div style={{ fontSize: '40px', marginBottom: '10px' }}>🔍</div>
                        <div style={{ fontFamily: 'var(--font-serif)' }}>একো পোৱা নগ’ল</div>
                    </div>
                )}
                
                {filteredPosts.length > 0 && type === 'community' && !searchQuery && (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-sec)', fontSize: '13px', fontFamily: 'var(--font-serif)', opacity: 0.4 }}>
                        ~ সমাপ্ত ~
                    </div>
                )}
            </motion.div>
        )}
    </div>
  );
}