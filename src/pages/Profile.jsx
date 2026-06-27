import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../supabase'
import { fetchProfileByIdOrUsername } from '../services/profiles'
import { useAuth } from '../contexts/AuthContext'
import PostCard from '../components/PostCard'
import Avatar from '../components/Avatar'
import { formatNumber } from '../utils/helpers'
import { Settings, Globe, UserPlus, UserMinus } from 'lucide-react'

export default function Profile() {
  const { id } = useParams()
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [following, setFollowing] = useState(false)

  useEffect(() => {
    fetchProfile()
    fetchUserPosts()
  }, [id])

  useEffect(() => {
    if (user && profile) checkFollowing()
  }, [user, profile])

  const fetchProfile = async () => {
    if (!id || id === 'undefined') {
      setLoading(false)
      return
    }

    const decodedId = decodeURIComponent(id)
    setLoading(true)
    try {
      const data = await fetchProfileByIdOrUsername(decodedId)
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserPosts = async () => {
    if (!id || id === 'undefined') return
    const decodedId = decodeURIComponent(id)
    try {
      const { data } = await supabase.from('posts').select('*, profiles(*)').eq('author_id', decodedId).eq('is_published', true).order('created_at', { ascending: false })
      setPosts(data || [])
    } catch (e) {
      console.error(e)
    }
  }

  const checkFollowing = async () => {
    if (!profile?.id) return
    const { data } = await supabase.from('follows').select('*').match({ follower_id: user.id, following_id: profile.id }).single()
    setFollowing(!!data)
  }

  const handleFollow = async () => {
    if (!user) return alert('অনুসৰণ কৰিবলৈ অনুগ্ৰহ কৰি লগ ইন কৰক।')
    try {
      if (following) {
        await supabase.from('follows').delete().match({ follower_id: user.id, following_id: profile.id })
        setFollowing(false)
      } else {
        await supabase.from('follows').insert({ follower_id: user.id, following_id: profile.id })
        setFollowing(true)
      }
      fetchProfile()
    } catch (e) {
      console.error(e)
    }
  }

  if (loading) return <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '10rem' }}><div className="spinner" /></div>
  if (!profile) return <div className="container" style={{ textAlign: 'center', padding: '5rem' }}><h2>প্ৰ'ফাইল বিচাৰি পোৱা নগ'ল।</h2></div>

  const isOwnProfile = user?.id === profile.id

  return (
    <div className="page-shell fade-in">
      <div className="panel" style={{ padding: '1.5rem', marginBottom: '1.75rem', boxShadow: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <Avatar profile={profile} size="xl" />
          <div style={{ flex: 1, minWidth: '220px' }}>
            <h1 style={{ marginBottom: '0.35rem', fontSize: '2.2rem' }}>{profile.display_name}</h1>
            <p style={{ color: 'var(--text-tertiary)', marginBottom: '1rem' }}>@{profile.username}</p>
            {profile.bio && <p style={{ color: 'var(--text-secondary)', maxWidth: '52ch' }}>{profile.bio}</p>}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {isOwnProfile ? (
              <Link to="/settings" className="btn btn-secondary"><Settings size={18} /> প্ৰ'ফাইল সম্পাদনা</Link>
            ) : (
              <button className={`btn ${following ? 'btn-secondary' : 'btn-primary'}`} onClick={handleFollow}>
                {following ? <><UserMinus size={18} /> অনুসৰণ কৰা হৈছে</> : <><UserPlus size={18} /> অনুসৰণ কৰক</>}
              </button>
            )}
            {profile.website && <a href={profile.website} target="_blank" rel="noreferrer" className="btn btn-secondary"><Globe size={18} /> Website</a>}
          </div>
        </div>

        <div className="stats-strip">
          <div className="stat-box"><div className="stat-label">লিখনি (Posts)</div><div className="stat-value">{formatNumber(profile.post_count || 0)}</div></div>
          <div className="stat-box"><div className="stat-label">অনুসৰণকাৰী</div><div className="stat-value">{formatNumber(profile.followers_count || 0)}</div></div>
          <div className="stat-box"><div className="stat-label">অনুসৰণ</div><div className="stat-value">{formatNumber(profile.following_count || 0)}</div></div>
        </div>
      </div>


      <div>
        <div className="section-header">
          <div>
            <h2 className="section-title">প্ৰকাশিত লিখনিসমূহ ({posts.length})</h2>
          </div>
        </div>

        <div className="feed-list">
          {posts.map(post => <PostCard key={post.id} post={post} onUpdate={fetchUserPosts} />)}
          {posts.length === 0 && (
            <div className="empty-state card">
              <h3 className="empty-state-title">এতিয়ালৈকে কোনো লিখনি প্ৰকাশ কৰা নাই।</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
