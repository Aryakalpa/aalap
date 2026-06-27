import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabase'
import { useAuth } from '../contexts/AuthContext'
import { formatDate, estimateReadingTime, generateExcerpt } from '../utils/helpers'
import { Heart, MessageSquare, Bookmark, BookOpen, Clock, MoreVertical, Edit, Trash2, EyeOff, Eye } from 'lucide-react'
import Avatar from './Avatar'
import Badge from './Badge'
import CategoryBadge from './CategoryBadge'
import ShareButton from './ShareButton'
import CoverPreview from './CoverPreview'

export default function PostCard({ post, onUpdate }) {
  const { user } = useAuth()
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likes_count || 0)
  const [bookmarked, setBookmarked] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
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

  return (
    <Link to={`/post/${post.id}`} className="card fade-in post-card-shell" style={{ display: 'block', padding: 0, overflow: 'hidden' }}>
      {(post.cover_image || post.title) && (
        <div className="post-card-cover">
          <CoverPreview src={post.cover_image} title={post.title} category={post.category} author={post.profiles?.display_name} alt="" />
        </div>
      )}

      <div className="post-card-body" style={{ padding: '1.15rem 1.15rem 1.05rem' }}>
        <div className="post-author-line">
          <Avatar profile={post.profiles} size="md" clickable />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{post.profiles?.display_name || 'অতিথি'}</span>
              <Badge postCount={post.profiles?.post_count || 0} size="sm" />
            </div>
            <div className="meta-row">
              <span>{formatDate(post.created_at)}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={12} /> {estimateReadingTime(post.body)}</span>
              {!post.is_published && <span style={{ color: 'var(--danger)', fontWeight: 700 }}>(অঘোষিত/Hidden)</span>}
            </div>
          </div>

          {user && user.id === post.author_id && (
            <div ref={menuRef} style={{ position: 'relative' }}>
              <button className="btn-icon" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowMenu(!showMenu) }}>
                <MoreVertical size={18} />
              </button>
              {showMenu && (
                <div className="share-menu fade-in" style={{ right: 0, top: '100%' }}>
                  <div className="share-menu-item" onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = `/write/${post.id}` }}><Edit size={16} /> <span>সম্পাদনা</span></div>
                  <div className="share-menu-item" onClick={async (e) => { e.preventDefault(); e.stopPropagation(); const { error } = await supabase.from('posts').update({ is_published: !post.is_published }).eq('id', post.id); if (!error && onUpdate) onUpdate(); setShowMenu(false) }}>
                    {post.is_published ? <EyeOff size={16} /> : <Eye size={16} />}<span>{post.is_published ? 'লুকুৱাই ৰাখক' : 'প্ৰকাশ কৰক'}</span>
                  </div>
                  <div className="share-divider" />
                  <div className="share-menu-item danger" onClick={async (e) => { e.preventDefault(); e.stopPropagation(); if (window.confirm('আপুনি নিশ্চিতনে? এই লিখনিটো সমূলি মচি পেলোৱা হ\'ব।')) { const { error } = await supabase.from('posts').delete().eq('id', post.id); if (!error && onUpdate) onUpdate() } }}><Trash2 size={16} /> <span>মচি পেলাওক</span></div>
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <CategoryBadge category={post.category} size="sm" />
          {post.series_name && <div className="series-tag" style={{ marginTop: 0 }}><BookOpen size={12} /> {post.series_name}</div>}
        </div>

        <h3 className="post-title">{post.title}</h3>
        <p className={['poem', 'poetry', 'কবিতা'].includes(post.category?.toLowerCase()) ? 'post-excerpt poem-preview' : 'post-excerpt'}>{generateExcerpt(post.body || '', 220)}</p>

        <div className="post-actions">
          <div className="inline-stats">
            <button className={`btn-ghost ${liked ? 'text-danger' : ''}`} onClick={handleLike}><Heart size={18} fill={liked ? 'currentColor' : 'none'} /> {likeCount}</button>
            <span className="inline-stat"><MessageSquare size={18} /> {post.comments_count || 0}</span>
            <span className="inline-stat"><BookOpen size={18} /> {post.views_count || 0}</span>
          </div>
          <div className="inline-actions">
            <button className={`btn-ghost ${bookmarked ? 'text-accent-blue' : ''}`} onClick={handleBookmark} title="Save for later"><Bookmark size={18} fill={bookmarked ? 'currentColor' : 'none'} /></button>
            <ShareButton title={post.title} postId={post.id} />
          </div>
        </div>
      </div>
    </Link>
  )
}
