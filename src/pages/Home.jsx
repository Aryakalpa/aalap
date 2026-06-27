import { useState, useEffect, useMemo } from 'react'
import { fetchPublishedPosts } from '../services/posts'
import PostCard from '../components/PostCard'
import { CATEGORIES } from '../utils/helpers'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Sparkles, PenTool, ArrowRight } from 'lucide-react'
import CategoryBadge from '../components/CategoryBadge'
import EmptyState from '../components/ui/EmptyState'
import LoadingState from '../components/ui/LoadingState'

export default function Home() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchPosts()
  }, [filter])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const category = filter !== 'all' ? CATEGORIES.find(c => c.id === filter) : null
      const possibleValues = category ? [category.id, ...(category.aliases || [])] : filter !== 'all' ? [filter] : undefined
      const data = await fetchPublishedPosts({ categoryValues: possibleValues })
      setPosts(data)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const featuredPost = posts[0]
  const latestPosts = posts.slice(1)

  const categoryCounts = useMemo(() => {
    return CATEGORIES.map(cat => ({
      ...cat,
      count: posts.filter(p => [cat.id, ...(cat.aliases || [])].map(v => v.toLowerCase()).includes(p.category?.toLowerCase())).length,
    }))
  }, [posts])

  return (
    <div className="page-shell fade-in">
      {featuredPost && (
        <section className="editorial-hero editorial-hero-quiet">
          <Link
            to={`/post/${featuredPost.id}`}
            className={`panel hero-feature ${featuredPost.cover_image ? 'has-image' : ''}`}
            style={featuredPost.cover_image ? { backgroundImage: `linear-gradient(180deg, rgba(18,14,12,0.14), rgba(18,14,12,0.42)), url(${featuredPost.cover_image})` } : { background: 'var(--surface-raised)' }}
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
        {loading ? (
          <LoadingState containerClassName="page-shell" />
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
