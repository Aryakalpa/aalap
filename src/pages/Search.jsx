import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import PostCard from '../components/PostCard'
import { Search as SearchIcon, Users, FileText, ChevronRight, X, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import Avatar from '../components/Avatar'

export default function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState({ posts: [], profiles: [] })
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('posts')

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length > 1) handleSearch()
      else setResults({ posts: [], profiles: [] })
    }, 500)
    return () => clearTimeout(timer)
  }, [query])

  const handleSearch = async () => {
    setLoading(true)
    try {
      const { data: posts } = await supabase
        .from('posts')
        .select('*, profiles(*)')
        .eq('is_published', true)
        .or(`title.ilike.%${query}%,body.ilike.%${query}%`)
        .limit(10)

      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
        .limit(10)

      setResults({ posts: posts || [], profiles: profiles || [] })
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-shell fade-in">
      <header className="page-header">
        <div className="section-kicker">Discovery</div>
        <h1 className="page-title">সন্ধান কৰক</h1>
        <p className="page-subtitle">লিখনি, লেখক, আৰু পঢ়িবলগীয়া নতুন দিশ বিচাৰিবলৈ চাৰ্চ ব্যৱহাৰ কৰক।</p>
      </header>

      <div className="panel card" style={{ marginBottom: '2rem' }}>
        <div className="search-box">
          <input
            type="text"
            className="search-input"
            placeholder="লিখনি বা লেখকৰ সন্ধান কৰক..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <SearchIcon size={22} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          {query && (
            <button onClick={() => setQuery('')} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          )}
          {loading && <div style={{ position: 'absolute', right: '3rem', top: '50%', transform: 'translateY(-50%)' }}><div className="spinner-sm" /></div>}
        </div>

        {!query && (
          <div className="shelf-grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
            <div className="shelf-item"><div className="shelf-title">কবিতা</div><div className="shelf-copy">মেজাজ, স্মৃতি, ভাষাৰ সংগীত</div></div>
            <div className="shelf-item"><div className="shelf-title">গল্প</div><div className="shelf-copy">চৰিত্ৰ, ঘটনা, আৰু কল্পনাৰ জগত</div></div>
            <div className="shelf-item"><div className="shelf-title">প্ৰৱন্ধ</div><div className="shelf-copy">ভাবনা, মত, আৰু ব্যাখ্যা</div></div>
          </div>
        )}
      </div>

      {query && (
        <div className="tab-row">
          <button className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`} onClick={() => setActiveTab('posts')}>
            <FileText size={18} /> লিখনি ({results.posts.length})
          </button>
          <button className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
            <Users size={18} /> লেখক ({results.profiles.length})
          </button>
        </div>
      )}

      <div>
        {activeTab === 'posts' ? (
          <div className="feed-list">
            {results.posts.map(post => <PostCard key={post.id} post={post} />)}
            {query && !loading && results.posts.length === 0 && (
              <div className="empty-state">
                <FileText size={48} color="var(--text-tertiary)" style={{ opacity: 0.4, marginBottom: '1rem' }} />
                <h3 className="empty-state-title">এই নামেৰে কোনো লিখনি পোৱা নগ’ল</h3>
                <p className="empty-state-desc">অন্য শব্দ চেষ্টা কৰক অথবা অন্য বিভাগ ব্ৰাউজ কৰক।</p>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {results.profiles.map(p => (
              <Link key={p.id} to={`/profile/${p.id}`} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Avatar profile={p} size="md" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700' }}>{p.display_name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>@{p.username || 'user'}</div>
                </div>
                <ChevronRight size={18} color="var(--text-tertiary)" />
              </Link>
            ))}
            {query && !loading && results.profiles.length === 0 && (
              <div className="empty-state">
                <Users size={48} color="var(--text-tertiary)" style={{ opacity: 0.4, marginBottom: '1rem' }} />
                <h3 className="empty-state-title">এই নামেৰে কোনো লেখক পোৱা নগ’ল</h3>
                <p className="empty-state-desc">বানান সঠিক নে চাওক অথবা অন্য নাম চেষ্টা কৰক।</p>
              </div>
            )}
          </div>
        )}
      </div>

      {!query && (
        <div className="empty-state" style={{ marginTop: '1rem' }}>
          <BookOpen size={42} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <h3 className="empty-state-title">কি বিচাৰিব খুজিছে?</h3>
          <p className="empty-state-desc">প্ৰিয় বিষয়, লেখক, বা শব্দ লিখি আৰম্ভ কৰক।</p>
        </div>
      )}
    </div>
  )
}
