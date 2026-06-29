import { useState, useEffect, useMemo } from 'react'
import { fetchPublishedPosts } from '../services/posts'
import PostCard from '../components/PostCard'
import { CATEGORIES, matchesCategory } from '../utils/helpers'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Sparkles, PenTool, ArrowRight } from 'lucide-react'
import CategoryBadge from '../components/CategoryBadge'
import EmptyState from '../components/ui/EmptyState'
import LoadingState from '../components/ui/LoadingState'
import { getRandomCoverForPost } from '../utils/covers'
import { getPostPath } from '../utils/routes'

export default function Home() {
  const { user, loading: authLoading } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (authLoading) return
    let cancelled = false
    fetchPosts({ cancelled: () => cancelled })
    return () => { cancelled = true }
  }, [filter, authLoading])

  useEffect(() => {
    const refreshIfEmpty = () => {
      if (!authLoading && document.visibilityState === 'visible' && !loading && posts.length === 0) fetchPosts({ silent: true })
    }
    window.addEventListener('focus', refreshIfEmpty)
    document.addEventListener('visibilitychange', refreshIfEmpty)
    return () => {
      window.removeEventListener('focus', refreshIfEmpty)
      document.removeEventListener('visibilitychange', refreshIfEmpty)
    }
  }, [authLoading, loading, posts.length, filter])

  const fetchPosts = async ({ silent = false, cancelled = () => false } = {}) => {
    if (!silent) setLoading(true)
    setError('')
    const category = filter !== 'all' ? CATEGORIES.find(c => c.id === filter) : null
    const possibleValues = category ? [category.id, ...(category.aliases || [])] : filter !== 'all' ? [filter] : undefined

    try {
      let data = []
      let lastError = null
      for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
          data = await fetchPublishedPosts({ categoryValues: possibleValues })
          if (data.length > 0 || filter !== 'all') break
        } catch (err) {
          lastError = err
        }
        if (attempt < 2) await new Promise(resolve => setTimeout(resolve, 450 * (attempt + 1)))
      }
      if (lastError && data.length === 0) throw lastError
      if (!cancelled()) setPosts(data)
    } catch (error) {
      console.error('Error fetching posts:', error)
      if (!cancelled()) setError('লিখনিসমূহ লোড কৰিব পৰা নগল। অনুগ্ৰহ কৰি পুনৰ চেষ্টা কৰক।')
    } finally {
      if (!cancelled()) setLoading(false)
    }
  }

  const featuredPost = posts[0]
  const latestPosts = posts.slice(1)

  const categoryCounts = useMemo(() => {
    return CATEGORIES.map(cat => ({
      ...cat,
      count: posts.filter(p => matchesCategory(p.category, cat.id)).length,
    }))
  }, [posts])

  return (
    <div className="page-shell fade-in">
      {featuredPost && (
        <section className="editorial-hero editorial-hero-quiet">
          <Link
            to={getPostPath(featuredPost)}
            className="panel hero-feature has-image"
            style={{ backgroundImage: `linear-gradient(180deg, rgba(18,14,12,0.14), rgba(18,14,12,0.42)), url(${getRandomCoverForPost(featuredPost)})` }}
          >
            <div className="hero-meta">
              <CategoryBadge category={featuredPost.category} />
              <span>{featuredPost.profiles?.display_name || 'অতিথি'}</span>
            </div>
            <h2 className="hero-title">{featuredPost.title}</h2>
            <p className="hero-excerpt">{featuredPost.body?.replace(/<[^>]*>/g, '').slice(0, 240)}...</p>
          </Link>

          <div className="hero-side">
            <div className="panel card" style={{ padding: '1.25rem' }}>
              <h1 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.5rem' }}>
                <Sparkles size={22} />
                শেহতীয়া আলাপ
              </h1>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link to="/write" className="btn btn-secondary"><PenTool size={16} /> নতুন লিখনি আৰম্ভ কৰক</Link>
              </div>
            </div>

            <div className="panel card" style={{ padding: '1rem' }}>
              <div className="shelf-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                {categoryCounts.slice(0, 4).map(cat => (
                  <button key={cat.id} className="shelf-item" onClick={() => setFilter(cat.id)}>
                    <div>
                      <div className="shelf-title">{cat.label}</div>
                      <div className="shelf-copy">{cat.count} লিখনি</div>
                    </div>
                    <ArrowRight size={16} color="var(--text-tertiary)" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section style={{ marginBottom: '2rem' }}>
        <div className="filter-bar">
          <button className={`filter-chip ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>সকলো</button>
          {CATEGORIES.map(cat => (
            <button key={cat.id} className={`filter-chip ${filter === cat.id ? 'active' : ''}`} onClick={() => setFilter(cat.id)}>
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      <section>
        {authLoading || loading ? (
          <LoadingState containerClassName="page-shell" />
        ) : error ? (
          <EmptyState
            icon="⚠️"
            title={error}
            description="নেটৱৰ্ক বা চাৰ্ভাৰ ঠাণ্ডা আৰম্ভণিৰ বাবে এনে হ’ব পাৰে।"
            action={<button className="btn btn-primary" style={{ marginTop: '1.25rem' }} onClick={() => fetchPosts()}>পুনৰ চেষ্টা কৰক</button>}
          />
        ) : posts.length === 0 ? (
          <EmptyState
            icon="📚"
            title="এই শিতানত এতিয়ালৈকে কোনো লিখনি নাই"
            description={user ? "আপোনাৰ সৃষ্টিশীল লিখনি এই শিতানত প্ৰথম হ'ব পাৰে!" : 'নতুন লিখনি পঢ়িবলৈ অপেক্ষা কৰক অথবা নিজা লিখনি যোগ দিবলৈ লগ ইন কৰক।'}
            action={user ? (
              <Link to="/write" className="btn btn-primary" style={{ marginTop: '1.25rem' }}>
                <PenTool size={18} /> নতুন লিখনি আৰম্ভ কৰক
              </Link>
            ) : null}
          />
        ) : (
          <div className="feed-list">
            {(featuredPost ? latestPosts : posts).map(post => (
              <PostCard key={post.id} post={post} onUpdate={fetchPosts} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
