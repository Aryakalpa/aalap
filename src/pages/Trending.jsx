import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import PostCard from '../components/PostCard'
import { TrendingUp } from 'lucide-react'

export default function Trending() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState('week')

  useEffect(() => {
    fetchTrendingPosts()
  }, [timeframe])

  const fetchTrendingPosts = async () => {
    setLoading(true)
    try {
      const now = new Date()
      let startDate = new Date()

      if (timeframe === 'today') startDate.setDate(now.getDate() - 1)
      else if (timeframe === 'week') startDate.setDate(now.getDate() - 7)
      else if (timeframe === 'month') startDate.setMonth(now.getMonth() - 1)

      const { data, error } = await supabase
        .from('posts')
        .select('*, profiles(*)')
        .eq('is_published', true)
        .gte('created_at', startDate.toISOString())
        .order('likes_count', { ascending: false })
        .limit(20)

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('Error fetching trending posts:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-shell fade-in">
      <header className="page-header">
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <TrendingUp size={28} />
          জনপ্ৰিয় আলাপ
        </h1>
      </header>

      <div className="tab-row" style={{ marginBottom: '2rem' }}>
        <button className={`tab-btn ${timeframe === 'today' ? 'active' : ''}`} onClick={() => setTimeframe('today')}>আজিৰ</button>
        <button className={`tab-btn ${timeframe === 'week' ? 'active' : ''}`} onClick={() => setTimeframe('week')}>এই সপ্তাহৰ</button>
        <button className={`tab-btn ${timeframe === 'month' ? 'active' : ''}`} onClick={() => setTimeframe('month')}>এই মাহৰ</button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}><div className="spinner" /></div>
      ) : posts.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-state-icon">📈</div>
          <h3 className="empty-state-title">এতিয়ালৈকে কোনো জনপ্ৰিয় লিখনি নাই</h3>
          <p className="empty-state-desc">এই সময়ছোৱাত কোনো লিখনিয়ে এতিয়ালৈকে জনপ্ৰিয়তা লাভ কৰা নাই। অলপ পিছত আকৌ চেষ্টা কৰিব।</p>
        </div>
      ) : (
        <div className="feed-list">
          {posts.map(post => <PostCard key={post.id} post={post} onUpdate={fetchTrendingPosts} />)}
        </div>
      )}
    </div>
  )
}
