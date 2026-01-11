import { useRef, useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { formatDate, estimateReadingTime, formatNumber } from '../utils/helpers'
import {
    Heart, MessageSquare, Bookmark, Share2,
    MoreVertical, Edit, Trash2, EyeOff, Eye,
    Type, Send, AlignLeft, AlignCenter, AlignJustify, ChevronLeft, BookOpen
} from 'lucide-react'
import Avatar from '../components/Avatar'
import CategoryBadge from '../components/CategoryBadge'
import ShareButton from '../components/ShareButton'

export default function Reader() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const { theme, setTheme } = useTheme()

    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')
    const [showMenu, setShowMenu] = useState(false)
    const [showSettings, setShowSettings] = useState(false)

    const [liked, setLiked] = useState(false)
    const [bookmarked, setBookmarked] = useState(false)
    const [following, setFollowing] = useState(false)
    const [likeAnimating, setLikeAnimating] = useState(false)

    // Reader Preferences
    const [fontSize, setFontSize] = useState(18)
    const [fontFamily, setFontFamily] = useState('serif') // serif or sans
    const [alignment, setAlignment] = useState('left')

    const menuRef = useRef(null)
    const settingsRef = useRef(null)

    useEffect(() => {
        fetchPost()
        fetchComments()
    }, [id])

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowMenu(false)
            }
            if (settingsRef.current && !settingsRef.current.contains(e.target)) {
                setShowSettings(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        if (user && post) {
            checkLiked()
            checkBookmarked()
            checkFollowing()
        }
    }, [user, post])

    const fetchPost = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('posts')
                .select('*, profiles(*)')
                .eq('id', id)
                .single()

            if (error) throw error
            setPost(data)
            if (data.alignment) setAlignment(data.alignment)
        } catch (error) {
            console.error('Error fetching post:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchComments = async () => {
        const { data } = await supabase
            .from('comments')
            .select('*, profiles(*)')
            .eq('post_id', id)
            .order('created_at', { ascending: true })
        setComments(data || [])
    }

    const checkLiked = async () => {
        const { data } = await supabase
            .from('likes')
            .select('*')
            .match({ user_id: user.id, post_id: id })
            .single()
        setLiked(!!data)
    }

    const checkBookmarked = async () => {
        const { data } = await supabase
            .from('bookmarks')
            .select('*')
            .match({ user_id: user.id, post_id: id })
            .single()
        setBookmarked(!!data)
    }

    const checkFollowing = async () => {
        if (!post) return
        const { data } = await supabase
            .from('follows')
            .select('*')
            .match({ follower_id: user.id, following_id: post.author_id })
            .single()
        setFollowing(!!data)
    }

    const handleLike = async () => {
        if (!user) return alert('পছন্দ কৰিবলৈ অনুগ্ৰহ কৰি লগ ইন কৰক।')
        setLikeAnimating(true)
        setTimeout(() => setLikeAnimating(false), 600)
        try {
            if (liked) {
                await supabase.from('likes').delete().match({ user_id: user.id, post_id: id })
                setLiked(false)
            } else {
                await supabase.from('likes').insert({ user_id: user.id, post_id: id })
                setLiked(true)
            }
            fetchPost()
        } catch (e) { console.error(e) }
    }

    const handleBookmark = async () => {
        if (!user) return alert('সংৰক্ষণ কৰিবলৈ অনুগ্ৰহ কৰি লগ ইন কৰক।')
        try {
            if (bookmarked) {
                await supabase.from('bookmarks').delete().match({ user_id: user.id, post_id: id })
                setBookmarked(false)
            } else {
                await supabase.from('bookmarks').insert({ user_id: user.id, post_id: id })
                setBookmarked(true)
            }
        } catch (e) { console.error(e) }
    }

    const handleFollow = async () => {
        if (!user) return alert('অনুসৰণ কৰিবলৈ অনুগ্ৰহ কৰি লগ ইন কৰক।')
        try {
            if (following) {
                await supabase.from('follows').delete().match({ follower_id: user.id, following_id: post.author_id })
                setFollowing(false)
            } else {
                await supabase.from('follows').insert({ follower_id: user.id, following_id: post.author_id })
                setFollowing(true)
            }
        } catch (e) { console.error(e) }
    }

    const handleComment = async (e) => {
        e.preventDefault()
        if (!user) return alert('মন্তব্য কৰিবলৈ অনুগ্ৰহ কৰি লগ ইন কৰক।')
        if (!newComment.trim()) return

        const { error } = await supabase.from('comments').insert({
            post_id: id,
            user_id: user.id,
            body: newComment
        })

        if (!error) {
            setNewComment('')
            fetchComments()
        }
    }

    if (loading) return <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '10rem' }}><div className="spinner" /></div>
    if (!post) return <div className="container-sm" style={{ padding: '5rem', textAlign: 'center' }}><h2>বন্ধ কৰক, এই লিখনিটো বিচাৰি পোৱা নগ'ল।</h2><Link to="/" className="btn btn-primary mt-4">মূল পৃষ্ঠালৈ উভতি যাওক</Link></div>

    return (
        <div className="container-sm">
            {/* Nav Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0', position: 'sticky', top: '4.5rem', background: 'var(--bg-primary)', zIndex: 10, borderBottom: '1px solid var(--border-color)' }}>
                <button onClick={() => navigate(-1)} className="btn-icon">
                    <ChevronLeft size={24} />
                </button>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <div ref={settingsRef} style={{ position: 'relative' }}>
                        <button className={`btn-icon ${showSettings ? 'text-accent' : ''}`} onClick={() => setShowSettings(!showSettings)}>
                            <Type size={22} />
                        </button>
                        {showSettings && (
                            <div className="share-menu fade-in" style={{ right: 0, top: '100%', minWidth: '280px', padding: '1.25rem', zIndex: 1200 }}>
                                <div style={{ marginBottom: '1.25rem' }}>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '0.75rem', fontWeight: '700' }}>থীম (Theme)</div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button onClick={() => setTheme('light')} style={{ flex: 1, height: '32px', background: '#ffffff', border: theme === 'light' ? '2px solid var(--accent)' : '1px solid #ddd', borderRadius: '4px' }} />
                                        <button onClick={() => setTheme('paper')} style={{ flex: 1, height: '32px', background: '#f5f2e9', border: theme === 'paper' ? '2px solid var(--accent)' : '1px solid #ddd', borderRadius: '4px' }} />
                                        <button onClick={() => setTheme('dark')} style={{ flex: 1, height: '32px', background: '#020617', border: theme === 'dark' ? '2px solid var(--accent)' : '1px solid #333', borderRadius: '4px' }} />
                                    </div>
                                </div>
                                <div style={{ marginBottom: '1.25rem' }}>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '0.75rem', fontWeight: '700' }}>ফণ্ট (Font)</div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button className={`btn ${fontFamily === 'serif' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFontFamily('serif')} style={{ flex: 1, fontSize: '0.8rem', padding: '0.4rem' }}>Tiro</button>
                                        <button className={`btn ${fontFamily === 'sans' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFontFamily('sans')} style={{ flex: 1, fontSize: '0.8rem', padding: '0.4rem' }}>Siliguri</button>
                                    </div>
                                </div>
                                <div style={{ marginBottom: '1.25rem' }}>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '0.75rem', fontWeight: '700' }}>আকাৰ (Size)</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <span style={{ fontSize: '0.8rem' }}>Aa</span>
                                        <input type="range" min="16" max="28" step="2" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} style={{ flex: 1 }} />
                                        <span style={{ fontSize: '1.2rem' }}>Aa</span>
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '0.75rem', fontWeight: '700' }}>শাৰীবদ্ধতা (Alignment)</div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button className={`btn ${alignment === 'left' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setAlignment('left')} style={{ flex: 1, padding: '0.4rem' }}><AlignLeft size={18} /></button>
                                        <button className={`btn ${alignment === 'center' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setAlignment('center')} style={{ flex: 1, padding: '0.4rem' }}><AlignCenter size={18} /></button>
                                        <button className={`btn ${alignment === 'justify' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setAlignment('justify')} style={{ flex: 1, padding: '0.4rem' }}><AlignJustify size={18} /></button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <ShareButton title={post.title} postId={post.id} />
                    {user && user.id === post.author_id && (
                        <div ref={menuRef} style={{ position: 'relative' }}>
                            <button className="btn-icon" onClick={() => setShowMenu(!showMenu)}><MoreVertical size={20} /></button>
                            {showMenu && (
                                <div className="share-menu fade-in" style={{ right: 0, top: '100%', minWidth: '180px', zIndex: 1200 }}>
                                    <div className="share-menu-item" onClick={() => navigate(`/write/${post.id}`)}><Edit size={16} /> <span>সম্পাদনা</span></div>
                                    <div className="share-menu-item" onClick={async () => {
                                        await supabase.from('posts').update({ is_published: !post.is_published }).eq('id', post.id)
                                        fetchPost()
                                        setShowMenu(false)
                                    }}>
                                        {post.is_published ? <EyeOff size={16} /> : <Eye size={16} />}
                                        <span>{post.is_published ? 'লুকুৱাই ৰাখক' : 'প্ৰকাশ কৰক'}</span>
                                    </div>
                                    <div className="share-divider" />
                                    <div className="share-menu-item danger" onClick={async () => {
                                        if (window.confirm('মচি পেলাব বিচাৰিছেনে?')) {
                                            await supabase.from('posts').delete().eq('id', post.id)
                                            navigate('/')
                                        }
                                    }}><Trash2 size={16} /> <span>মচি পেলাওক</span></div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Post Layout */}
            <article style={{ padding: '2rem 0' }}>
                {post.cover_image && (
                    <div style={{ marginBottom: '2.5rem', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                        <img src={post.cover_image} alt="" style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }} />
                    </div>
                )}
                <div style={{ marginBottom: '1rem' }}><CategoryBadge category={post.category} size="md" /></div>
                <h1 style={{ fontSize: 'clamp(2rem, 8vw, 3.5rem)', fontWeight: '800', lineHeight: '1.2', marginBottom: '2rem', textAlign: alignment === 'center' ? 'center' : 'left' }} className="gradient-text">
                    {post.title}
                </h1>

                {/* Author simplified */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Avatar profile={post.profiles} size="md" clickable showBadge authorId={post.author_id} />
                        <div>
                            <Link to={`/profile/${post.author_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0 }}>{post.profiles?.display_name || 'অতিথি'}</h3>
                            </Link>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{formatDate(post.created_at)} • {estimateReadingTime(post.body)}</div>
                        </div>
                    </div>
                    {user && user.id !== post.author_id && (
                        <button className={`btn ${following ? 'btn-secondary' : 'btn-primary'}`} onClick={handleFollow} style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem', borderRadius: '2rem' }}>
                            {following ? 'অনুসৰণ কৰি থকা' : 'অনুসৰণ কৰক'}
                        </button>
                    )}
                </div>

                <div
                    className={`literature-content ${fontFamily === 'serif' ? 'font-serif' : 'font-display'} text-${alignment} ${['poem', 'poetry'].includes(post.category?.toLowerCase()) ? 'poem-content' : ''}`}
                    style={{ fontSize: `${fontSize}px` }}
                >
                    {post.body}
                </div>
            </article>

            {/* Footer Stats */}
            <div style={{ borderTop: '2px solid var(--border-color)', padding: '2rem 0', display: 'flex', justifyContent: 'space-between', marginBottom: '3rem' }}>
                <div style={{ display: 'flex', gap: '2rem' }}>
                    <button onClick={handleLike} className={`btn-ghost ${liked ? 'text-danger' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', animation: likeAnimating ? 'heartBeat 0.6s ease' : 'none' }}>
                        <Heart size={24} fill={liked ? 'currentColor' : 'none'} /> <b>{post.likes_count || 0}</b>
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-tertiary)' }}><MessageSquare size={24} /> <b>{comments.length}</b></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-tertiary)' }}><BookOpen size={24} /> <b>{post.views_count || 0}</b></div>
                </div>
                <button onClick={handleBookmark} className={`btn-ghost ${bookmarked ? 'text-accent-blue' : ''}`}><Bookmark size={24} fill={bookmarked ? 'currentColor' : 'none'} /></button>
            </div>

            {/* Comments */}
            <section style={{ paddingBottom: '5rem' }}>
                <h3 style={{ marginBottom: '2rem' }}>মন্তব্য ({comments.length})</h3>
                {user ? (
                    <form onSubmit={handleComment} style={{ marginBottom: '3rem', position: 'relative' }}>
                        <textarea className="comment-area" placeholder="মতামত লিখক..." value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                        <button type="submit" className="btn-primary" style={{ position: 'absolute', bottom: '1rem', right: '1rem', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)' }}><Send size={18} /></button>
                    </form>
                ) : (
                    <div className="card" style={{ textAlign: 'center', padding: '2rem', marginBottom: '2rem' }}><p>মন্তব্য কৰিবলৈ লগ ইন কৰক।</p></div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {comments.map(c => (
                        <div key={c.id} className="card" style={{ display: 'flex', gap: '1rem' }}>
                            <Avatar profile={c.profiles} size="sm" clickable />
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                    <b>{c.profiles?.display_name}</b> <small style={{ color: 'var(--text-tertiary)' }}>{formatDate(c.created_at)}</small>
                                </div>
                                <p style={{ fontSize: '0.95rem' }}>{c.body}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
