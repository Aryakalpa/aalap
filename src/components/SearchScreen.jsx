import { useState, useEffect } from 'react';
import { Search as SearchIcon, ArrowLeft } from 'lucide-react';
import { supabase } from '../data/supabaseClient';
import { useStore } from '../data/store';
import PostCard from '../posts/PostCard';

export default function SearchScreen() {
  const { setView } = useStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if(query.length > 2) {
        const { data } = await supabase.from('posts').select(`*, profiles(*)`).ilike('title', `%${query}%`).limit(10);
        setResults(data || []);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="main-content">
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
        <button onClick={() => setView('main')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-sec)' }}><ArrowLeft size={24} /></button>
        <div style={{ position: 'relative', flex: 1 }}>
          <SearchIcon size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-sec)' }} />
          <input autoFocus className="soul-card" placeholder="গল্প বিচাৰক..." value={query} onChange={(e) => setQuery(e.target.value)} // Search stories...
            style={{ width: '100%', padding: '16px 16px 16px 50px', margin: 0, border: 'none', borderRadius: '18px', background: 'var(--card)', fontSize: '18px', fontFamily: 'var(--font-serif)', boxShadow: 'var(--sh-md)' }} />
        </div>
      </div>
      <div>{results.map(p => <PostCard key={p.id} post={p} />)}</div>
    </div>
  );
}