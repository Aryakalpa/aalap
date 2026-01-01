import { useState, useEffect, useRef } from 'react';
import { supabase } from '../data/supabaseClient';
import { useStore } from '../data/store';
import PostCard from './PostCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { RefreshCcw, Search, X, Loader2 } from 'lucide-react';

export default function Feed({ type }) {
  const { user, setTab } = useStore();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // SEARCH STATE
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState('');
  
  // PULL TO REFRESH STATE
  const [pullY, setPullY] = useState(0);
  const startY = useRef(0);
  const isRefreshing = useRef(false);

  // CORE FETCH FUNCTION
  const fetchPosts = async (searchTerm = '') => {
    setLoading(true);
    
    if (type === 'bookmarks') {
       const saved = JSON.parse(localStorage.getItem('aalap-bookmarks') || '[]');
       if (searchTerm) {
           const lower = searchTerm.toLowerCase();
           setPosts(saved.filter(p => p.title.toLowerCase().includes(lower) || p.body.toLowerCase().includes(lower)));
       } else {
           setPosts(saved);
       }
       setLoading(false);
    } else {
       // Database Fetch
       let q = supabase.from('posts').select(`*, profiles(*)`);
       if (searchTerm) {
           q = q.or(`title.ilike.%${searchTerm}%,body.ilike.%${searchTerm}%`);
       }
       const { data } = await q.order('created_at', { ascending: false });
       setPosts(data || []);
       setLoading(false);
    }
  };

  // INITIAL LOAD
  useEffect(() => {
    if (type === 'bookmarks' && !user) { setLoading(false); return; }
    fetchPosts('');
  }, [type, user]);

  // LIVE SEARCH EFFECT (DEBOUNCED)
  useEffect(() => {
    // Only trigger if search mode is active
    if (!showSearch) return;

    // Instant filter for bookmarks (Local data)
    if (type === 'bookmarks') {
        fetchPosts(query);
        return;
    }

    // Debounced fetch for DB (Wait 500ms after typing stops)
    const delay = setTimeout(() => {
        fetchPosts(query);
    }, 500);

    return () => clearTimeout(delay);
  }, [query, showSearch]);

  const closeSearch = () => {
      setQuery('');
      setShowSearch(false);
      fetchPosts(''); // Reset feed
  };

  // PULL TO REFRESH LOGIC
  const handleTouchStart = (e) => { if (window.scrollY === 0) startY.current = e.touches[0].clientY; };
  const handleTouchMove = (e) => {
      if (window.scrollY === 0 && startY.current > 0) {
          const pull = e.touches[0].clientY - startY.current;
          if (pull > 0) setPullY(pull * 0.4);
      }
  };
  const handleTouchEnd = async () => {
      if (pullY > 60 && !isRefreshing.current) {
          isRefreshing.current = true;
          setPullY(60);
          await fetchPosts(query);
          isRefreshing.current = false;
      }
      setPullY(0); startY.current = 0;
  };

  if (type === 'bookmarks' && !user) return (
      <div style={{ padding: 60, textAlign: 'center', opacity: 0.8 }}>
          <h3 style={{ marginBottom: 10 }}>লগ-ইন প্ৰয়োজনীয়</h3>
          <p style={{ fontSize: 14, opacity: 0.6, marginBottom: 20 }}>বুকমাৰ্ক চাবলৈ অনুগ্ৰহ কৰি লগ-ইন কৰক</p>
          <button onClick={() => setTab('profile')} className="btn-soft" style={{ margin: '0 auto', background: 'var(--text-main)', color: 'var(--bg-body)' }}>লগ-ইন কৰক</button>
      </div>
  );

  return (
    <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} style={{ paddingBottom: 100, minHeight: '80vh' }}>
      
      {/* HEADER WITH LIVE SEARCH */}
      <div style={{ padding: '0 0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 60 }}>
          {showSearch ? (
              <div style={{ flex: 1, display: 'flex', gap: 10, alignItems: 'center', animation: 'fadeIn 0.2s' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                      <input 
                        autoFocus
                        value={query} onChange={e => setQuery(e.target.value)}
                        placeholder={type === 'bookmarks' ? "Search saved..." : "Search Aalap..."}
                        style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-light)', padding: '10px 15px', borderRadius: 20, color: 'var(--text-main)', outline: 'none', paddingRight: 35 }}
                      />
                      {loading && <Loader2 size={16} className="spin" style={{ position: 'absolute', right: 12, top: 12, opacity: 0.5 }} />}
                  </div>
                  <button onClick={closeSearch} className="btn-icon" style={{ background: 'var(--bg-card)', borderRadius: '50%' }}><X size={20}/></button>
              </div>
          ) : (
              <>
                <h2 style={{ margin: 0, fontSize: 22 }}>{type === 'bookmarks' ? 'সংৰক্ষিত (Saved)' : 'সদ্যপ্ৰকাশিত'}</h2>
                <button onClick={() => setShowSearch(true)} className="btn-icon" style={{ background: 'var(--bg-input)', borderRadius: '50%' }}>
                    <Search size={20} />
                </button>
              </>
          )}
      </div>

      {/* PULL INDICATOR */}
      <div style={{ height: pullY, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: pullY > 0 ? 1 : 0, transition: isRefreshing.current ? 'none' : 'height 0.3s' }}>
          <div style={{ background: 'var(--bg-card)', borderRadius: '50%', padding: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
             <RefreshCcw size={20} className={isRefreshing.current ? 'spin' : ''} style={{ transform: `rotate(${pullY * 2}deg)` }} />
          </div>
      </div>

      {loading && pullY === 0 && !query ? (
          <div style={{ paddingTop: 10 }}>{[1, 2, 3].map(i => <SkeletonLoader key={i} />)}</div>
      ) : (
          posts.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center', opacity: 0.5 }}>
                {query ? (
                    <>
                        <div style={{ fontSize: 24, marginBottom: 10 }}>🔍</div>
                        <div>কোনো ফলাফল পোৱা নগ’ল</div>
                        <div style={{ fontSize: 12, marginTop: 5 }}>"{query}"</div>
                    </>
                ) : 'কোনো কাহিনী পোৱা নগ’ল'}
            </div>
          ) : (
            <div style={{ animation: 'fadeIn 0.3s' }}>
                {posts.map(post => <PostCard key={post.id} post={post} />)}
            </div>
          )
      )}
      
      <style>{`
        .spin { animation: spin 1s linear infinite; } 
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}