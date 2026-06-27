import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../supabase'
import PostCard from '../components/PostCard'
import { CATEGORIES } from '../utils/helpers'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { BookOpen, PenTool, ArrowRight } from 'lucide-react'
import CategoryBadge from '../components/CategoryBadge'

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
      let query = supabase
        .from('posts')
        .select('*, profiles(*)')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(50)

      if (filter !== 'all') {
        const category = CATEGORIES.find(c => c.id === filter)
        const possibleValues = category ? [category.id, ...(category.aliases || [])] : [filter]
        query = query.in('category', possibleValues)
      }

      const { data, error } = await query
      if (error) throw error
      setPosts(data || [])
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
      <header className="page-header">
        <div className="section-kicker">A digital adda for literature</div>
        <h1 className="page-title">অসমীয়া সাহিত্যৰ বাবে এক শান্ত, কৌতূহলী, ঘূৰি অহা ঠাই।</h1>
        <p className="page-subtitle">
          নতুন লিখনি পঢ়ক, প্ৰিয় লেখক বিচাৰক, আৰু নিজৰ ভাষাত নিজৰ কথা লিখক। আলাপক আমি ফিডৰ দৰে নহয়, পাঠাগাৰৰ দৰে অনুভৱ কৰাব বিচাৰিছোঁ।
        </p>
      </header>

      {featuredPost && (
        <section className="editorial-hero">
          <Link
            to={`/post/${featuredPost.id}`}
            className={`panel hero-feature ${featuredPost.cover_image ? 'has-image' : ''}`}
            style={featuredPost.cover_image ? { backgroundImage: `linear-gradient(180deg, rgba(15,10,8,0.1), rgba(15,10,8,0.72)), url(${featuredPost.cover_image})` } : {}}
          >
            <div className="hero-meta">
              <CategoryBadge category={featuredPost.category} />
              <span>{featuredPost.profiles?.display_name || 'অতিথি'}</span>
            </div>
            <h2 className="hero-title">{featuredPost.title}</h2>
            <p className="hero-excerpt">{featuredPost.body?.replace(/<[^>]*>/g, '').slice(0, 240)}...</p>
            <div className="hero-meta">
              <span>আজিৰ পাঠ</span>
              <span>•</span>
              <span>Continue reading</span>
            </div>
          </Link>

          <div className="hero-side">
            <div className="panel card">
              <div className="section-kicker">Why Aalap</div>
              <h3 className="section-title" style={{ fontSize: '1.6rem', marginBottom: '0.7rem' }}>Read with more calm, write with more care.</h3>
              <p className="section-desc" style={{ marginBottom: '1.25rem' }}>
                কম বিভ্ৰান্তি, অধিক পাঠযোগ্যতা, আৰু ভাষাৰ নিজস্ব মৰ্যাদাক কেন্দ্ৰ কৰি গঢ়া অভিজ্ঞতা।
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link to="/search" className="btn btn-secondary"><BookOpen size={16} /> বিচাৰক</Link>
                <Link to="/write" className="btn btn-primary"><PenTool size={16} /> লিখক</Link>
              </div>
            </div>

            <div className="panel card">
              <div className="section-kicker">Browse by form</div>
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
        <div className="section-header">
          <div>
            <div className="section-kicker">Shelves</div>
            <h2 className="section-title">ধৰণ অনুসৰি চাওক</h2>
          </div>
        </div>

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
        <div className="section-header">
          <div>
            <div className="section-kicker">Fresh writings</div>
            <h2 className="section-title">শেহতীয়া আলাপ</h2>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}><div className="spinner" /></div>
        ) : posts.length === 0 ? (
          <div className="empty-state card">
            <div className="empty-state-icon">📚</div>
            <h3 className="empty-state-title">এই শিতানত এতিয়ালৈকে কোনো লিখনি নাই</h3>
            <p className="empty-state-desc">
              {user ? 'আপোনাৰ সৃষ্টিশীল লিখনি এই শিতানত প্ৰথম হ\'ব পাৰে।' : 'নতুন লিখনি পঢ়িবলৈ অপেক্ষা কৰক অথবা নিজা লিখনি যোগ দিবলৈ লগ ইন কৰক।'}
            </p>
            {user && (
              <Link to="/write" className="btn btn-primary" style={{ marginTop: '1.25rem' }}>
                <PenTool size={18} /> নতুন লিখনি আৰম্ভ কৰক
              </Link>
            )}
          </div>
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
