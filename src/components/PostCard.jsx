import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabase'
import { useAuth } from '../contexts/AuthContext'
import { formatDate, estimateReadingTime, generateExcerpt, shareToWhatsApp, shareToTelegram, copyToClipboard } from '../utils/helpers'
import { Heart, MessageSquare, Bookmark, BookOpen, Clock, MoreVertical, Edit, Trash2, EyeOff, Eye, Copy, Check, MessageCircle } from 'lucide-react'
import Avatar from './Avatar'
import Badge from './Badge'
import CategoryBadge from './CategoryBadge'
import CoverPreview from './CoverPreview'

export default function PostCard({ post, onUpdate }) {
  const { user } = useAuth()
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likes_count || 0)
  const [bookmarked, setBookmarked] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [copied, setCopied] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (user && post.id) checkUserInteractions()
  }, [user, post.id])

  const checkUserInteractions = async () => {
    try {
      const { data: L } = await supabase.from('likes').select('*').match({ user_id: user.id, post_id: post.id }).single()
      if (L) setLiked(true)
      const { data: B } = await supabase.from('bookmarks').select('*').match({ user_id: user.id, post_id: post.id }).single()
      if (B) setBookmarked(true)
    } catch {}
  }

  const handleLike = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) return alert('পছন্দ কৰিবলৈ অনুগ্ৰহ কৰি লগ ইন কৰক।')
    try {
      if (liked) {
        await supabase.from('likes').delete().match({ user_id: user.id, post_id: post.id })
        setLiked(false)
        setLikeCount((prev) => prev - 1)
      } else {
        await supabase.from('likes').insert({ user_id: user.id, post_id: post.id })
        setLiked(true)
        setLikeCount((prev) => prev + 1)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleBookmark = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) return alert('সংৰক্ষণ কৰিবলৈ অনুগ্ৰহ কৰি লগ ইন কৰক।')
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

  const postUrl = typeof window !== 'undefined' ? `${window.location.origin}/post/${post.id}` : `/post/${post.id}`

  const closeMenu = () => setShowMenu(false)

  const handleShareCopy = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    const success = await copyToClipboard(postUrl)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleShareWhatsApp = (e) => {
    e.preventDefault()
    e.stopPropagation()
    shareToWhatsApp(post.title, postUrl)
    closeMenu()
  }

  const handleShareTelegram = (e) => {
    e.preventDefault()
    e.stopPropagation()
    shareToTelegram(post.title, postUrl)
    closeMenu()
  }

  const handleTogglePublish = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    const { error } = await supabase.from('posts').update({ is_published: !post.is_published }).eq('id', post.id)
    if (!error && onUpdate) onUpdate()
    closeMenu()
  }

  const handleDelete = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (window.confirm('আপুনি নিশ্চিতনে? এই লিখনিটো সমূলি মচি পেলোৱা হ\'ব।')) {
      const { error } = await supabase.from('posts').delete().eq('id', post.id)
      if (!error && onUpdate) onUpdate()
    }
    closeMenu()
  }

  return (
    <Link to={`/post/${post.id}`} className="card fade-in post-card-shell editorial-post-card" style={{ display: 'block', padding: 0, overflow: 'hidden' }}>
      {post.title && (
        <div className="post-card-cover editorial-cover-shell">
          <CoverPreview post={post} alt="" />
          <div className="editorial-cover-scrim" />
          <div className="editorial-cover-badges">
            <CategoryBadge category={post.category} size="sm" variant="overlay" />
            {post.series_name && <div className="series-tag editorial-series-tag"><BookOpen size={12} /> {post.series_name}</div>}
          </div>

          <div ref={menuRef} className="editorial-overflow-wrap">
            <button
              className="btn-icon editorial-menu-btn editorial-overflow-btn"
              aria-label="Post actions"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowMenu(!showMenu) }}
            >
              <MoreVertical size={19} />
            </button>
            {showMenu && (
              <div className="share-menu fade-in editorial-action-menu">
                <div className="share-menu-item" onClick={handleBookmark}>
                  <Bookmark size={17} fill={bookmarked ? 'currentColor' : 'none'} />
                  <span>{bookmarked ? 'সংৰক্ষণ আঁতৰাওক' : 'সংৰক্ষণ কৰক'}</span>
                </div>
                <div className="share-divider" />
                <div className="share-menu-item" onClick={handleShareWhatsApp}>
                  <MessageCircle size={17} style={{ color: '#25D366' }} />
                  <span>WhatsApp</span>
                </div>
                <div className="share-menu-item" onClick={handleShareTelegram}>
                  <MessageCircle size={17} style={{ color: '#0088cc' }} />
                  <span>Telegram</span>
                </div>
                <div className="share-menu-item" onClick={handleShareCopy}>
                  {copied ? <Check size={17} style={{ color: 'var(--accent)' }} /> : <Copy size={17} />}
                  <span>{copied ? 'কপি হ\'ল!' : 'লিংক কপি কৰক'}</span>
                </div>

                {user && user.id === post.author_id && (
                  <>
                    <div className="share-divider" />
                    <div className="share-menu-item" onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = `/write/${post.id}` }}>
                      <Edit size={17} />
                      <span>সম্পাদনা</span>
                    </div>
                    <div className="share-menu-item" onClick={handleTogglePublish}>
                      {post.is_published ? <EyeOff size={17} /> : <Eye size={17} />}
                      <span>{post.is_published ? 'লুকুৱাই ৰাখক' : 'প্ৰকাশ কৰক'}</span>
                    </div>
                    <div className="share-menu-item danger" onClick={handleDelete}>
                      <Trash2 size={17} />
                      <span>মচি পেলাওক</span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="post-card-body editorial-post-body">
        <div className="editorial-title-block">
          <div className="editorial-author-strip">
            <Avatar profile={post.profiles} size="sm" />
            <div className="editorial-author-copy">
              <div className="editorial-author-line">
                <span className="editorial-author-name">{post.profiles?.display_name || 'অতিথি'}</span>
                <Badge postCount={post.profiles?.post_count || 0} size="sm" />
              </div>
              <div className="meta-row editorial-readable-meta">
                <span>{formatDate(post.created_at)}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={12} /> {estimateReadingTime(post.body)}</span>
                {!post.is_published && <span style={{ color: 'var(--danger)', fontWeight: 700 }}>(অঘোষিত/Hidden)</span>}
              </div>
            </div>
          </div>
          <h3 className="post-title editorial-post-title">{post.title}</h3>
          <p className={['poem', 'poetry', 'কবিতা'].includes(post.category?.toLowerCase()) ? 'post-excerpt poem-preview' : 'post-excerpt'}>{generateExcerpt(post.body || '', 220)}</p>
        </div>

        <div className="post-actions premium-post-actions">
          <div className="inline-stats premium-inline-stats">
            <button className={`btn-ghost premium-stat-btn ${liked ? 'text-danger active' : ''}`} onClick={handleLike}><Heart size={18} fill={liked ? 'currentColor' : 'none'} /> <span>{likeCount}</span></button>
            <span className="inline-stat premium-inline-stat"><MessageSquare size={16} /> <span>{post.comments_count || 0}</span></span>
            <span className="inline-stat premium-inline-stat"><BookOpen size={16} /> <span>{post.views_count || 0}</span></span>
          </div>
        </div>
      </div>
    </Link>
  )
}
