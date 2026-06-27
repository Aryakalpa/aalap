import { useState, useEffect } from 'react'
import PostCard from '../components/PostCard'
import { Search as SearchIcon, Users, FileText, ChevronRight, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import Avatar from '../components/Avatar'
import useDebouncedValue from '../hooks/useDebouncedValue'
import { SEARCH_DEBOUNCE_MS } from '../constants/app'
import { searchPosts } from '../services/posts'
import { searchProfiles } from '../services/profiles'

export default function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState({ posts: [], profiles: [] })
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('posts')
  const debouncedQuery = useDebouncedValue(query, SEARCH_DEBOUNCE_MS)

  useEffect(() => {
    if (debouncedQuery.trim().length > 1) handleSearch(debouncedQuery)
    else setResults({ posts: [], profiles: [] })
  }, [debouncedQuery])

  const handleSearch = async (searchTerm) => {
    setLoading(true)
    try {
      const [posts, profiles] = await Promise.all([
        searchPosts(searchTerm),
        searchProfiles(searchTerm),
      ])

      setResults({ posts, profiles })
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-shell fade-in">
      <header className="page-header">
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <SearchIcon size={28} />
          সন্ধান কৰক
        </h1>
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
                <h3 className="empty-state-title">এই নামেৰে কোনো লিখনি পোৱা নগ’ল।</h3>
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
                <h3 className="empty-state-title">এই নামেৰে কোনো লেখক পোৱা নগ’ল।</h3>
              </div>
            )}
          </div>
        )}
      </div>

      {!query && (
        <div className="empty-state" style={{ marginTop: '1rem' }}>
          <h3 className="empty-state-title">সন্ধান কৰক</h3>
          <p className="empty-state-desc">প্ৰিয় বিষয় বা লেখক বিচাৰিবলৈ ওপৰৰ চাৰ্চ বক্সটো ব্যৱহাৰ কৰক।</p>
        </div>
      )}
    </div>
  )
}
