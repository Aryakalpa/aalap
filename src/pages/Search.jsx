import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import PostCard from '../components/PostCard'
import { Search as SearchIcon, Users, FileText, ChevronRight, X } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Search() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState({ posts: [], profiles: [] })
    const [loading, setLoading] = useState(false)
    const [activeTab, setActiveTab] = useState('posts')

    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.trim().length > 1) {
                handleSearch()
            } else {
                setResults({ posts: [], profiles: [] })
            }
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
        <div className="container-sm">
            <div style={{ marginBottom: '3rem' }}>
                <h1 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <SearchIcon size={28} className="text-accent" />
                    সন্ধান কৰক
                </h1>
                <div style={{ position: 'relative' }}>
                    <input
                        type="text"
                        placeholder="লিখনি বা লেখকৰ সন্ধান কৰক..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{ paddingLeft: '3.5rem', paddingRight: '3.5rem' }}
                    />
                    <SearchIcon size={22} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                    {query && (
                        <button
                            onClick={() => setQuery('')}
                            style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}
                        >
                            <X size={20} />
                        </button>
                    )}
                    {loading && (
                        <div style={{ position: 'absolute', right: '3.5rem', top: '50%', transform: 'translateY(-50%)' }}>
                            <div className="spinner-sm" />
                        </div>
                    )}
                </div>
            </div>

            {query && (
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
                    <button
                        className={`btn-tab ${activeTab === 'posts' ? 'active' : ''}`}
                        onClick={() => setActiveTab('posts')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            borderBottom: activeTab === 'posts' ? '3px solid var(--accent)' : '3px solid transparent',
                            borderRadius: '0',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: activeTab === 'posts' ? 'var(--accent)' : 'var(--text-tertiary)',
                            fontWeight: '700'
                        }}
                    >
                        <FileText size={18} /> লিখনি ({results.posts.length})
                    </button>
                    <button
                        className={`btn-tab ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            borderBottom: activeTab === 'users' ? '3px solid var(--accent)' : '3px solid transparent',
                            borderRadius: '0',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: activeTab === 'users' ? 'var(--accent)' : 'var(--text-tertiary)',
                            fontWeight: '700'
                        }}
                    >
                        <Users size={18} /> লেখক ({results.profiles.length})
                    </button>
                </div>
            )}

            <div>
                {activeTab === 'posts' ? (
                    <div className="grid" style={{ gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                        {results.posts.map(post => <PostCard key={post.id} post={post} />)}
                        {query && !loading && results.posts.length === 0 && (
                            <div className="empty-state">
                                <FileText size={48} color="var(--text-tertiary)" style={{ opacity: 0.3, marginBottom: '1rem' }} />
                                <p style={{ textAlign: 'center', color: 'var(--text-tertiary)' }}>এই নামেৰে কোনো লিখনি পোৱা নগ’ল।</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {results.profiles.map(p => (
                            <Link key={p.id} to={`/profile/${p.id}`} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', color: 'inherit' }}>
                                <div className="avatar avatar-md">
                                    {p.avatar_url ? <img src={p.avatar_url} alt="" /> : <span>{p.display_name?.[0]}</span>}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '700' }}>{p.display_name}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>@{p.username || 'user'}</div>
                                </div>
                                <ChevronRight size={18} color="var(--text-tertiary)" />
                            </Link>
                        ))}
                        {query && !loading && results.profiles.length === 0 && (
                            <div className="empty-state">
                                <Users size={48} color="var(--text-tertiary)" style={{ opacity: 0.3, marginBottom: '1rem' }} />
                                <p style={{ textAlign: 'center', color: 'var(--text-tertiary)' }}>এই নামেৰে কোনো লেখক পোৱা নগ’ল।</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {!query && (
                <div className="empty-state" style={{ padding: '5rem 0' }}>
                    <SearchIcon className="empty-state-icon" style={{ opacity: 0.2 }} />
                    <h3 className="empty-state-title">সন্ধান কৰক</h3>
                    <p className="empty-state-desc">প্ৰিয় বিষয় বা লেখক বিচাৰিবলৈ ওপৰৰ চাৰ্চ বক্সটো ব্যৱহাৰ কৰক।</p>
                </div>
            )}
        </div>
    )
}
