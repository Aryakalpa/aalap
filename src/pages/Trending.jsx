import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import PostCard from '../components/PostCard'
import { TrendingUp, Clock } from 'lucide-react'

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
        <div className="container-sm">
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <TrendingUp className="text-accent" size={28} />
                    জনপ্ৰিয় আলাপ
                </h1>

                <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'none' }}>
                    <button
                        className={`btn ${timeframe === 'today' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setTimeframe('today')}
                        style={{ padding: '0.5rem 1.25rem', borderRadius: '2rem', whiteSpace: 'nowrap' }}
                    >
                        আজিৰ
                    </button>
                    <button
                        className={`btn ${timeframe === 'week' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setTimeframe('week')}
                        style={{ padding: '0.5rem 1.25rem', borderRadius: '2rem', whiteSpace: 'nowrap' }}
                    >
                        এই সপ্তাহৰ
                    </button>
                    <button
                        className={`btn ${timeframe === 'month' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setTimeframe('month')}
                        style={{ padding: '0.5rem 1.25rem', borderRadius: '2rem', whiteSpace: 'nowrap' }}
                    >
                        এই মাহৰ
                    </button>
                </div>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
                    <div className="spinner" />
                </div>
            ) : posts.length === 0 ? (
                <div className="empty-state card">
                    <div className="empty-state-icon">📈</div>
                    <h3 className="empty-state-title">এতিয়ালৈকে কোনো জনপ্ৰিয় লিখনি নাই</h3>
                    <p className="empty-state-desc">
                        এই সময়ছোৱাত কোনো লিখনিয়ে এতিয়ালৈকে জনপ্ৰিয়তা লাভ কৰা নাই। অলপ পিছত আকৌ চেষ্টা কৰিব।
                    </p>
                </div>
            ) : (
                <div className="grid" style={{ gridTemplateColumns: '1fr', gap: '2rem' }}>
                    {posts.map(post => (
                        <PostCard key={post.id} post={post} onUpdate={fetchTrendingPosts} />
                    ))}
                </div>
            )}
        </div>
    )
}
