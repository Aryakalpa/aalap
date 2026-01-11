import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabase'
import { useAuth } from '../contexts/AuthContext'
import { formatDate, estimateReadingTime } from '../utils/helpers'
import { Heart, MessageSquare, Bookmark, BookOpen, Clock } from 'lucide-react'
import Avatar from './Avatar'
import Badge from './Badge'
import CategoryBadge from './CategoryBadge'
import ShareButton from './ShareButton'
import { MoreVertical, Edit, Trash2, EyeOff, Eye } from 'lucide-react'
import { useRef, useEffect } from 'react'

export default function PostCard({ post, onUpdate }) {
    const { user } = useAuth()
    const [liked, setLiked] = useState(false)
    const [likeCount, setLikeCount] = useState(post.likes_count || 0)
    const [bookmarked, setBookmarked] = useState(false)
    const [likeAnimating, setLikeAnimating] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    const menuRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowMenu(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleLike = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (!user) {
            alert('পছন্দ কৰিবলৈ অনুগ্ৰহ কৰি লগ ইন কৰক।')
            return
        }

        setLikeAnimating(true)
        setTimeout(() => setLikeAnimating(false), 600)

        try {
            if (liked) {
                await supabase.from('likes').delete().match({ user_id: user.id, post_id: post.id })
                setLiked(false)
                setLikeCount(prev => prev - 1)
            } else {
                await supabase.from('likes').insert({ user_id: user.id, post_id: post.id })
                setLiked(true)
                setLikeCount(prev => prev + 1)
            }
            if (onUpdate) onUpdate()
        } catch (e) {
            console.error(e)
        }
    }

    const handleBookmark = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (!user) {
            alert('সংৰক্ষণ কৰিবলৈ অনুগ্ৰহ কৰি লগ ইন কৰক।')
            return
        }

        try {
            if (bookmarked) {
                await supabase.from('bookmarks').delete().match({ user_id: user.id, post_id: post.id })
                setBookmarked(false)
            } else {
                await supabase.from('bookmarks').insert({ user_id: user.id, post_id: post.id })
                setBookmarked(true)
            }
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <Link
            to={`/post/${post.id}`}
            className="card fade-in"
            style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'block'
            }}
        >
            {/* Header: Author Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <Avatar profile={post.profiles} size="md" />
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>
                            {post.profiles?.display_name || 'অতিথি'}
                        </span>
                        <Badge postCount={post.profiles?.post_count || 0} size="sm" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                        <span>{formatDate(post.created_at)}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Clock size={12} />
                            {estimateReadingTime(post.body)}
                        </span>
                        {!post.is_published && (
                            <span style={{ color: 'var(--danger)', fontWeight: '700' }}>(অঘোষিত/Hidden)</span>
                        )}
                    </div>
                </div>

                {user && user.id === post.author_id && (
                    <div ref={menuRef} style={{ position: 'relative' }}>
                        <button
                            className="btn-icon"
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setShowMenu(!showMenu)
                            }}
                        >
                            <MoreVertical size={20} />
                        </button>
                        {showMenu && (
                            <div className="share-menu fade-in" style={{ right: 0, top: '100%', minWidth: '150px', zIndex: 100 }}>
                                <div className="share-menu-item" onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    window.location.href = `/write/${post.id}`
                                }}>
                                    <Edit size={16} /> <span>সম্পাদনা (Edit)</span>
                                </div>
                                <div className="share-menu-item" onClick={async (e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    const { error } = await supabase.from('posts').update({ is_published: !post.is_published }).eq('id', post.id)
                                    if (!error && onUpdate) onUpdate()
                                    setShowMenu(false)
                                }}>
                                    {post.is_published ? <EyeOff size={16} /> : <Eye size={16} />}
                                    <span>{post.is_published ? 'লুকুৱাই ৰাখক (Hide)' : 'প্ৰকাশ কৰক (Show)'}</span>
                                </div>
                                <div className="share-menu-item" style={{ color: 'var(--danger)' }} onClick={async (e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    if (window.confirm('আপুনি নিশ্চিতনে? এই লিখনিটো সমূলি মচি পেলোৱা হ\'ব।')) {
                                        const { error } = await supabase.from('posts').delete().eq('id', post.id)
                                        if (!error && onUpdate) onUpdate()
                                    }
                                }}>
                                    <Trash2 size={16} /> <span>মচি পেলাওক (Delete)</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Content */}
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.25rem' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <h3 style={{
                            fontSize: '1.5rem',
                            fontWeight: '800',
                            lineHeight: '1.3',
                            margin: 0
                        }}>
                            {post.title}
                        </h3>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <CategoryBadge category={post.category} size="sm" />
                    </div>

                    <p style={{
                        color: 'var(--text-secondary)',
                        fontSize: '0.95rem',
                        lineHeight: '1.6',
                        display: '-webkit-box',
                        WebkitLineClamp: '3',
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}>
                        {post.body ? post.body.replace(/<[^>]*>/g, '').substring(0, 200) + '...' : ''}
                    </p>
                </div>

                {post.cover_image && (
                    <div style={{
                        width: '140px',
                        height: '140px',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                        flexShrink: 0,
                        position: 'relative'
                    }}>
                        <img
                            src={post.cover_image}
                            alt=""
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transition: 'transform 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                        />
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent)',
                            pointerEvents: 'none'
                        }} />
                    </div>
                )}
            </div>

            {/* Footer: Interactions */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '1rem',
                borderTop: '1px solid var(--border-color)'
            }}>
                <div style={{ display: 'flex', gap: '2rem' }}>
                    <button
                        className={`btn-ghost ${liked ? 'text-danger' : ''}`}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            fontSize: '0.85rem',
                            animation: likeAnimating ? 'heartBeat 0.6s ease' : 'none'
                        }}
                        onClick={handleLike}
                    >
                        <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
                        {likeCount}
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
                        <MessageSquare size={18} />
                        {post.comments_count || 0}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
                        <BookOpen size={18} />
                        {post.views_count || 0}
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                        className={`btn-ghost ${bookmarked ? 'text-accent-blue' : ''}`}
                        onClick={handleBookmark}
                        title="Save for later"
                    >
                        <Bookmark size={18} fill={bookmarked ? 'currentColor' : 'none'} />
                    </button>
                    <ShareButton title={post.title} postId={post.id} />
                </div>
            </div>
        </Link>
    )
}
