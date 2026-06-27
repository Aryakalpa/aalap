import { useRef, useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import { useAuth } from '../contexts/AuthContext'
import { formatDate, estimateReadingTime, generateExcerpt } from '../utils/helpers'
import {
  Heart,
  MessageSquare,
  Bookmark,
  MoreVertical,
  Edit,
  Trash2,
  EyeOff,
  Eye,
  Image as ImageIcon,
  Minus,
  Plus,
  Send,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  List,
} from 'lucide-react'
import Avatar from '../components/Avatar'
import CategoryBadge from '../components/CategoryBadge'
import ShareButton from '../components/ShareButton'
import ShareQuoteModal from '../components/ShareQuoteModal'
import CoverPreview from '../components/CoverPreview'
import EmptyState from '../components/ui/EmptyState'
import LoadingState from '../components/ui/LoadingState'

export default function Reader() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [showMenu, setShowMenu] = useState(false)
  const [similarPosts, setSimilarPosts] = useState([])
  const [seriesPosts, setSeriesPosts] = useState([])
  const [showQuoteModal, setShowQuoteModal] = useState(false)
  const [selectedQuote, setSelectedQuote] = useState('')

  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [following, setFollowing] = useState(false)

  const [fontSize, setFontSize] = useState(19)

  const menuRef = useRef(null)

  useEffect(() => {
    fetchPost()
    fetchComments()
  }, [id])

  useEffect(() => {
    if (post) {
      fetchSimilarPosts()
      if (post.series_name) fetchSeriesPosts()
      else setSeriesPosts([])
    }
  }, [post])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false)
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

  const fetchPost = async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const { data, error } = await supabase.from('posts').select('*, profiles(*)').eq('id', id).single()
      if (error) throw error
      setPost(data)
    } catch (error) {
      console.error('Error fetching post:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    const { data } = await supabase.from('comments').select('*, profiles(*)').eq('post_id', id).order('created_at', { ascending: true })
    setComments(data || [])
  }

  const fetchSimilarPosts = async () => {
    const { data } = await supabase.from('posts').select('*, profiles(*)').eq('category', post.category).neq('id', id).eq('is_published', true).limit(3)
    setSimilarPosts(data || [])
  }

  const fetchSeriesPosts = async () => {
    const { data } = await supabase
      .from('posts')
      .select('id, title, created_at')
      .eq('series_name', post.series_name)
      .eq('author_id', post.author_id)
      .eq('is_published', true)
      .order('created_at', { ascending: true })
    setSeriesPosts(data || [])
  }

  const currentIndex = seriesPosts.findIndex((p) => p.id === id)
  const prevPost = currentIndex > 0 ? seriesPosts[currentIndex - 1] : null
  const nextPost = currentIndex < seriesPosts.length - 1 ? seriesPosts[currentIndex + 1] : null

  const checkLiked = async () => {
    const { data } = await supabase.from('likes').select('*').match({ user_id: user.id, post_id: id }).single()
    setLiked(!!data)
  }

  const checkBookmarked = async () => {
    const { data } = await supabase.from('bookmarks').select('*').match({ user_id: user.id, post_id: id }).single()
    setBookmarked(!!data)
  }

  const checkFollowing = async () => {
    if (!post) return
    const { data } = await supabase.from('follows').select('*').match({ follower_id: user.id, following_id: post.author_id }).single()
    setFollowing(!!data)
  }

  const handleLike = async () => {
    if (!user) return alert('পছন্দ কৰিবলৈ অনুগ্ৰহ কৰি লগ ইন কৰক।')
    try {
      if (liked) {
        await supabase.from('likes').delete().match({ user_id: user.id, post_id: id })
        setLiked(false)
      } else {
        await supabase.from('likes').insert({ user_id: user.id, post_id: id })
        setLiked(true)
      }
      fetchPost(true)
    } catch (e) {
      console.error(e)
    }
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
    } catch (e) {
      console.error(e)
    }
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
    } catch (e) {
      console.error(e)
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!user) return alert('মন্তব্য কৰিবলৈ অনুগ্ৰহ কৰি লগ ইন কৰক।')
    if (!newComment.trim()) return

    const { error } = await supabase.from('comments').insert({ post_id: id, user_id: user.id, body: newComment })
    if (!error) {
      setNewComment('')
      fetchComments()
    }
  }

  const openQuoteModal = () => {
    const selection = window.getSelection().toString().trim()
    if (selection) setSelectedQuote(selection)
    else setSelectedQuote(generateExcerpt(post.body || '', 150))
    setShowQuoteModal(true)
  }

  if (loading) return <LoadingState padding="10rem" />
  if (!post) return <div className="container-sm" style={{ padding: '5rem', textAlign: 'center' }}><h2>বন্ধ কৰক, এই লিখনিটো বিচাৰি পোৱা নগ'ল।</h2><Link to="/" className="btn btn-primary">মূল পৃষ্ঠালৈ উভতি যাওক</Link></div>

  return (
    <div className="reading-shell fade-in">
      <div className="reader-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <button onClick={() => navigate(-1)} className="btn-icon"><ChevronLeft size={20} /></button>

          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem', border: '1px solid var(--border-color)', borderRadius: '999px', background: 'var(--surface-raised)' }}>
              <button className="btn-icon" onClick={() => setFontSize((prev) => Math.max(16, prev - 1))} title="Decrease text size">
                <Minus size={16} />
              </button>
              <span style={{ minWidth: '2.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 700 }}>{fontSize}</span>
              <button className="btn-icon" onClick={() => setFontSize((prev) => Math.min(26, prev + 1))} title="Increase text size">
                <Plus size={16} />
              </button>
            </div>

            <button className="btn-ghost" onClick={openQuoteModal} title="Create Quote Card"><ImageIcon size={18} /></button>
            <ShareButton title={post.title} postId={post.id} direction="down" />

            {user && user.id === post.author_id && (
              <div ref={menuRef} style={{ position: 'relative' }}>
                <button className="btn-icon" onClick={() => setShowMenu(!showMenu)}><MoreVertical size={18} /></button>
                {showMenu && (
                  <div className="share-menu fade-in" style={{ right: 0, top: 'calc(100% + 10px)', minWidth: '180px' }}>
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
      </div>

      <article className="reader-surface">
        {(post.cover_image || post.title) && (
          <div style={{ marginBottom: '2rem', borderRadius: '18px', overflow: 'hidden', background: 'var(--bg-secondary)' }}>
            <div style={{ width: '100%', maxHeight: '480px', aspectRatio: '16 / 9' }}>
              <CoverPreview src={post.cover_image} title={post.title} category={post.category} author={post.profiles?.display_name} alt="" />
            </div>
          </div>
        )}

        <div style={{ marginBottom: '1rem' }}><CategoryBadge category={post.category} size="md" /></div>
        <h1 className="reader-article-title" style={{ color: 'var(--text-primary)' }}>{post.title}</h1>

        {post.series_name && <div className="series-tag" style={{ marginBottom: '1.2rem' }}><BookOpen size={14} /> ধাৰাবাহিক: {post.series_name}</div>}

        <div className="panel" style={{ padding: '1rem', marginBottom: '2rem', background: 'var(--bg-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Avatar profile={post.profiles} size="md" clickable showBadge authorId={post.author_id} />
              <div>
                <Link to={`/profile/${post.author_id}`}><h3 style={{ fontSize: '1.1rem', margin: 0 }}>{post.profiles?.display_name || 'অতিথি'}</h3></Link>
                <div className="meta-row">
                  <span>{formatDate(post.created_at)}</span>
                  <span>{estimateReadingTime(post.body)}</span>
                </div>
              </div>
            </div>
            {user && user.id !== post.author_id && (
              <button className={`btn ${following ? 'btn-secondary' : 'btn-primary'}`} onClick={handleFollow}>
                {following ? 'অনুসৰণ কৰা হৈছে' : 'অনুসৰণ কৰক'}
              </button>
            )}
          </div>
        </div>

        <div className={`literature-content font-serif text-${post.alignment || 'left'} ${['poem', 'poetry'].includes(post.category?.toLowerCase()) ? 'poem-content' : ''}`} style={{ fontSize: `${fontSize}px`, marginBottom: '3rem' }}>
          {post.body}
        </div>

        {seriesPosts.length > 1 && (
          <div className="playlist-panel fade-in">
            <div className="playlist-header">
              <div className="playlist-name-container"><List size={20} /><span>{post.series_name}</span></div>
              <div className="playlist-progress-badge">{currentIndex + 1} / {seriesPosts.length}</div>
            </div>
            <div className="playlist-navigation-bar">
              <button className="playlist-nav-button" onClick={() => navigate(`/post/${prevPost.id}`)} disabled={!prevPost}><ChevronLeft size={18} /> আগৰ খণ্ড</button>
              <button className="playlist-nav-button" onClick={() => navigate(`/post/${nextPost.id}`)} disabled={!nextPost}>পৰৱৰ্তী খণ্ড <ChevronRight size={18} /></button>
            </div>
            <div className="playlist-items-list">
              {seriesPosts.map((p, i) => (
                <Link key={p.id} to={`/post/${p.id}`} className={`playlist-list-item ${p.id === id ? 'is-active' : ''}`}>
                  <div className="playlist-item-rank">{i + 1}</div>
                  <div className="playlist-item-label">{p.title}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="post-actions" style={{ marginTop: '2rem' }}>
          <div className="inline-stats">
            <button onClick={handleLike} className={`btn-ghost ${liked ? 'text-danger' : ''}`}><Heart size={20} fill={liked ? 'currentColor' : 'none'} /> {post.likes_count || 0}</button>
            <span className="inline-stat"><MessageSquare size={20} /> {comments.length}</span>
            <span className="inline-stat"><BookOpen size={20} /> {post.views_count || 0}</span>
          </div>
          <button onClick={handleBookmark} className={`btn-ghost ${bookmarked ? 'text-accent-blue' : ''}`}><Bookmark size={20} fill={bookmarked ? 'currentColor' : 'none'} /></button>
        </div>
      </article>

      <section style={{ padding: '2.5rem 0' }}>
        <div className="section-header">
          <div>
            <h3 className="section-title">মন্তব্য ({comments.length})</h3>
          </div>
        </div>

        {user ? (
          <form onSubmit={handleComment} className="panel" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
            <textarea placeholder="মতামত লিখক..." value={newComment} onChange={(e) => setNewComment(e.target.value)} rows={4} style={{ marginBottom: '0.75rem' }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary"><Send size={16} /></button>
            </div>
          </form>
        ) : (
          <EmptyState style={{ marginBottom: '1.5rem' }} title="মন্তব্য কৰিবলৈ লগ ইন কৰক।" />
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {comments.map((c) => (
            <div key={c.id} className="card" style={{ display: 'flex', gap: '1rem' }}>
              <Avatar profile={c.profiles} size="sm" clickable />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                  <strong>{c.profiles?.display_name}</strong>
                  <small style={{ color: 'var(--text-tertiary)' }}>{formatDate(c.created_at)}</small>
                </div>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>{c.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {similarPosts.length > 0 && (
        <section style={{ paddingBottom: '7rem' }}>
          <div className="section-header">
            <div>
              <h3 className="section-title">আপুনি ভাল পাব পৰা অন্যান্য লিখনি</h3>
            </div>
          </div>
          <div className="feed-list">
            {similarPosts.map((p) => (
              <Link key={p.id} to={`/post/${p.id}`} className="card" style={{ display: 'block', padding: 0, overflow: 'hidden' }}>
                <div style={{ width: '100%', aspectRatio: '16 / 9', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                  <CoverPreview src={p.cover_image} title={p.title} category={p.category} author={p.profiles?.display_name} alt="" />
                </div>
                <div style={{ padding: '1rem' }}>
                  <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1.1rem' }}>{p.title}</h4>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>{p.profiles?.display_name} • {formatDate(p.created_at)}</div>
                  <p style={{ marginTop: '0.45rem', color: 'var(--text-secondary)', fontSize: '0.92rem' }}>{generateExcerpt(p.body || '', 110)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <ShareQuoteModal isOpen={showQuoteModal} onClose={() => setShowQuoteModal(false)} text={selectedQuote} title={post.title} author={post.profiles?.display_name} postId={post.id} />
    </div>
  )
}
