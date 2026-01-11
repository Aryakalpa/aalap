import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabase'
import { useAuth } from '../contexts/AuthContext'
import { formatDate, estimateReadingTime, countWords, formatNumber } from '../utils/helpers'
import { Heart, MessageSquare, Bookmark, Share2, ChevronLeft, Type, MoreVertical, Send, UserPlus, BookOpen, TrendingUp, Edit, Trash2, EyeOff, Eye } from 'lucide-react'
import Avatar from '../components/Avatar'
import Badge from '../components/Badge'
import CategoryBadge from '../components/CategoryBadge'
import ShareButton from '../components/ShareButton'

export default function Reader() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const contentRef = useRef(null)

    const [post, setPost] = useState(null)
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')
    const [liked, setLiked] = useState(false)
    const [bookmarked, setBookmarked] = useState(false)
    const [following, setFollowing] = useState(false)
    const [fontSize, setFontSize] = useState(20)
    const [loading, setLoading] = useState(true)
    const [likeAnimating, setLikeAnimating] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    const menuRef = useRef(null)

    useEffect(() => {
        fetchPost()
        fetchComments()
    }, [id])

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowMenu(false)
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
            loadReadingProgress()
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

    const loadReadingProgress = async () => {
        const { data } = await supabase
            .from('reading_progress')
            .select('*')
            .match({ user_id: user.id, work_id: id })
            .single()

        if (data?.scroll_offset) {
            setTimeout(() => {
                window.scrollTo(0, data.scroll_offset * document.documentElement.scrollHeight)
            }, 500)
        }
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
        if (!user) {
            alert('মন্তব্য কৰিবলৈ অনুগ্ৰহ কৰি আগতে লগ ইন কৰক।')
            signInWithGoogle()
            return
        }
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

    if (!post) return <div className="container-sm" style={{ padding: '5rem', textAlign: 'center' }}><h2>ধন্যবাদ, কিন্তু এই লিখনিটো বিচাৰি পোৱা নগ'ল।</h2><Link to="/" className="btn btn-primary mt-4">মূল পৃষ্ঠালৈ উভতি যাওক</Link></div>

    return (
        <div className="container-sm">
            {/* Header Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem 0', position: 'sticky', top: 0, background: 'var(--bg-primary)', zIndex: 10, borderBottom: '1px solid var(--border-color)' }}>
                <button onClick={() => navigate(-1)} className="btn-icon">
                    <ChevronLeft size={24} />
                </button>
                <div style={{ display: 'flex', gap: '0.75rem', position: 'relative' }}>
                    <button className="btn-icon" onClick={() => setFontSize(f => Math.min(f + 2, 28))} title="Increase font"><Type size={20} /></button>
                    <button className="btn-icon" onClick={() => setFontSize(f => Math.max(f - 2, 16))} title="Decrease font"><Type size={16} /></button>
                    <ShareButton title={post.title} postId={post.id} />

                    {user && user.id === post.author_id && (
                        <div ref={menuRef}>
                            <button className="btn-icon" onClick={() => setShowMenu(!showMenu)}>
                                <MoreVertical size={20} />
                            </button>
                            {showMenu && (
                                <div className="share-menu fade-in" style={{ right: 0, minWidth: '150px' }}>
                                    <div className="share-menu-item" onClick={() => navigate(`/write/${post.id}`)}>
                                        <Edit size={16} /> <span>সম্পাদনা (Edit)</span>
                                    </div>
                                    <div className="share-menu-item" onClick={async () => {
                                        const { error } = await supabase.from('posts').update({ is_published: !post.is_published }).eq('id', post.id)
                                        if (!error) fetchPost()
                                        setShowMenu(false)
                                    }}>
                                        {post.is_published ? <EyeOff size={16} /> : <Eye size={16} />}
                                        <span>{post.is_published ? 'লুকুৱাই ৰাখক (Hide)' : 'প্ৰকাশ কৰক (Show)'}</span>
                                    </div>
                                    <div className="share-menu-item" style={{ color: 'var(--danger)' }} onClick={async () => {
                                        if (window.confirm('আপুনি নিশ্চিতনে? এই লিখনিটো সমূলি মচি পেলোৱা হ\'ব।')) {
                                            const { error } = await supabase.from('posts').delete().eq('id', post.id)
                                            if (!error) navigate('/')
                                        }
                                    }}>
                                        <Trash2 size={16} /> <span>মচি পেলাওক (Delete)</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <article ref={contentRef} style={{ paddingBottom: '3rem' }} className="fade-in">
                {/* Cover Image */}
                {post.cover_image && (
                    <div style={{ marginBottom: '2.5rem', borderRadius: 'var(--radius-lg)', overflow: 'hidden', position: 'relative' }}>
                        <img src={post.cover_image} alt="" style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'cover' }} />
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '40%',
                            background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
                            pointerEvents: 'none'
                        }} />
                    </div>
                )}

                {/* Category Badge */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <CategoryBadge category={post.category} size="md" />
                </div>

                {/* Title */}
                <h1 className="gradient-text" style={{
                    fontSize: '3rem',
                    marginBottom: '2rem',
                    lineHeight: '1.5',
                    fontFamily: 'var(--font-serif)',
                    fontWeight: '800',
                    padding: '0.2rem 0'
                }}>{post.title}</h1>

                {/* Rich Author Card */}
                <div className="card" style={{ marginBottom: '3rem', background: 'var(--depth-100)', border: '2px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
                        <Avatar profile={post.profiles} size="lg" clickable showBadge authorId={post.author_id} />
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                <Link to={`/profile/${post.author_id}`} style={{ textDecoration: 'none' }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                                        {post.profiles?.display_name || 'অতিথি'}
                                    </h3>
                                </Link>
                                <Badge postCount={post.profiles?.post_count || 0} size="md" />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <BookOpen size={16} />
                                    <span>{formatNumber(post.profiles?.post_count || 0)} টা লিখনি</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <TrendingUp size={16} />
                                    <span>{formatNumber(post.profiles?.followers_count || 0)} অনুসৰণকাৰী</span>
                                </div>
                            </div>

                            {post.profiles?.bio && (
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.6' }}>
                                    {post.profiles.bio}
                                </p>
                            )}

                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                {user && user.id !== post.author_id && (
                                    <button
                                        className={`btn ${following ? 'btn-secondary' : 'btn-primary'}`}
                                        onClick={handleFollow}
                                        style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                                    >
                                        <UserPlus size={16} />
                                        {following ? 'অনুসৰণ কৰি থকা' : 'অনুসৰণ কৰক'}
                                    </button>
                                )}
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span>{formatDate(post.created_at)}</span>
                                    <span>•</span>
                                    <span>{estimateReadingTime(post.body)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="literature-content" style={{ fontSize: `${fontSize}px`, marginBottom: '4rem' }}>
                    {(post.body || '').split('\n').map((para, i) => (
                        <p key={i} style={{ marginBottom: '1.5rem' }}>{para}</p>
                    ))}
                </div>
            </article>

            {/* Interactions Bar */}
            <div style={{ borderTop: '2px solid var(--border-color)', borderBottom: '2px solid var(--border-color)', padding: '1.5rem 0', display: 'flex', justifyContent: 'space-between', marginBottom: '3rem', background: 'var(--depth-100)', margin: '0 -1.5rem', padding: '1.5rem 1.5rem' }}>
                <div style={{ display: 'flex', gap: '2.5rem' }}>
                    <button
                        onClick={handleLike}
                        className={`btn-ghost ${liked ? 'text-danger' : ''}`}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '1rem',
                            animation: likeAnimating ? 'heartBeat 0.6s ease' : 'none'
                        }}
                    >
                        <Heart size={24} fill={liked ? 'currentColor' : 'none'} />
                        <span style={{ fontWeight: '600' }}>{formatNumber(post.likes_count || 0)}</span>
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-tertiary)', fontSize: '1rem' }}>
                        <MessageSquare size={24} />
                        <span style={{ fontWeight: '600' }}>{comments.length}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-tertiary)', fontSize: '1rem' }}>
                        <BookOpen size={24} />
                        <span style={{ fontWeight: '600' }}>{formatNumber(post.views_count || 0)}</span>
                    </div>
                </div>
                <button onClick={handleBookmark} className={`btn-ghost ${bookmarked ? 'text-accent-blue' : ''}`}>
                    <Bookmark size={24} fill={bookmarked ? 'currentColor' : 'none'} />
                </button>
            </div>

            {/* Comments Section */}
            <section style={{ paddingBottom: '5rem' }}>
                <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>মন্তব্যসমূহ ({comments.length})</h3>
                {user ? (
                    <form onSubmit={handleComment} style={{ marginBottom: '3rem', position: 'relative' }}>
                        <textarea
                            placeholder="আপোনাৰ মতামত লিখক..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            style={{ minHeight: '120px', padding: '1.25rem', paddingRight: '4rem', background: 'var(--bg-secondary)' }}
                        />
                        <button type="submit" className="btn-primary" style={{ position: 'absolute', bottom: '1rem', right: '1rem', padding: '0.5rem 1rem' }}>
                            <Send size={18} />
                        </button>
                    </form>
                ) : (
                    <div className="card" style={{ textAlign: 'center', padding: '2rem', marginBottom: '3rem' }}>
                        <p>মন্তব্য কৰিবলৈ অনুগ্ৰহ কৰি লগ ইন কৰক।</p>
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {comments.map(comment => (
                        <div key={comment.id} className="card" style={{ display: 'flex', gap: '1rem' }}>
                            <Avatar profile={comment.profiles} size="md" clickable />
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: '700' }}>{comment.profiles?.display_name}</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{formatDate(comment.created_at)}</span>
                                </div>
                                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>{comment.body}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
