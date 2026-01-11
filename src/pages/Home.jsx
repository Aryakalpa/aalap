import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import PostCard from '../components/PostCard'
import { CATEGORIES } from '../utils/helpers'
import { Sparkles, BookOpen, PenTool } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

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

    return (
        <div className="container-sm">
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Sparkles className="text-accent" size={28} />
                    শেহতীয়া আলাপ
                </h1>

                {/* Category Filter */}
                <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.75rem', scrollbarWidth: 'none' }}>
                    <button
                        className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilter('all')}
                        style={{ padding: '0.5rem 1.25rem', whiteSpace: 'nowrap', borderRadius: '2rem' }}
                    >
                        সকলো
                    </button>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            className={`btn ${filter === cat.id ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setFilter(cat.id)}
                            style={{ padding: '0.5rem 1.25rem', whiteSpace: 'nowrap', borderRadius: '2rem' }}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
                    <div className="spinner" />
                </div>
            ) : posts.length === 0 ? (
                <div className="empty-state card">
                    <div className="empty-state-icon">📚</div>
                    <h3 className="empty-state-title">এই শিতানত এতিয়ালৈকে কোনো লিখনি নাই</h3>
                    <p className="empty-state-desc">
                        {user ? 'আপোনাৰ সৃষ্টিশীল লিখনি এই শিতানত প্ৰথম হ\'ব পাৰে!' : 'নতুন লিখনি পঢ়িবলৈ অপেক্ষা কৰক অথবা নিজা লিখনি যোগ দিবলৈ লগ ইন কৰক।'}
                    </p>
                    {user && (
                        <Link to="/write" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                            <PenTool size={18} />
                            নতুন লিখনি আৰম্ভ কৰক
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid" style={{ gridTemplateColumns: '1fr', gap: '2rem' }}>
                    {posts.map(post => (
                        <PostCard key={post.id} post={post} onUpdate={fetchPosts} />
                    ))}
                </div>
            )}
        </div>
    )
}
