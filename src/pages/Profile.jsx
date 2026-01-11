import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../supabase'
import { useAuth } from '../contexts/AuthContext'
import PostCard from '../components/PostCard'
import ProfileBadge from '../components/ProfileBadge'
import Avatar from '../components/Avatar'
import { getBadgeLevel, getAchievements, formatNumber, getAvatarUrl } from '../utils/helpers'
import { Settings, Globe, MessageCircle, UserPlus, UserMinus } from 'lucide-react'

export default function Profile() {
    const { id } = useParams()
    const { user, profile: authProfile } = useAuth()
    const [profile, setProfile] = useState(null)
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [following, setFollowing] = useState(false)

    useEffect(() => {
        fetchProfile()
        fetchUserPosts()
    }, [id])

    useEffect(() => {
        if (user && profile) {
            checkFollowing()
        }
    }, [user, profile])

    const fetchProfile = async () => {
        if (!id || id === 'undefined') {
            setLoading(false)
            return
        }

        // Decode URL parameter in case of spaces/special chars
        const decodedId = decodeURIComponent(id)

        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .or(`username.eq.${decodedId},id.eq.${decodedId}`)
                .single()

            if (error) throw error
            setProfile(data)
        } catch (error) {
            console.error('Error fetching profile:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchUserPosts = async () => {
        if (!id || id === 'undefined') {
            return
        }

        const decodedId = decodeURIComponent(id)

        try {
            const { data } = await supabase
                .from('posts')
                .select('*, profiles(*)')
                .eq('author_id', decodedId)
                .eq('is_published', true)
                .order('created_at', { ascending: false })
            setPosts(data || [])
        } catch (e) { console.error(e) }
    }

    const checkFollowing = async () => {
        if (!profile || !profile.id) return
        const { data } = await supabase
            .from('follows')
            .select('*')
            .match({ follower_id: user.id, following_id: profile.id })
            .single()
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
        } catch (e) { console.error(e) }
    }

    if (loading) return <div className="container" style={{ display: 'flex', justifyContent: ' center', padding: '10rem' }}><div className="spinner" /></div>
    if (!profile) return <div className="container" style={{ textAlign: 'center', padding: '5rem' }}><h2>প্ৰ'ফাইল বিচাৰি পোৱা নগ'ল।</h2></div>

    const isOwnProfile = user?.id === profile.id
    const badge = getBadgeLevel(profile.post_count || 0)
    const achievements = getAchievements(profile)

    return (
        <div className="container-sm fade-in">
            {/* Profile Header */}
            <div className="card" style={{
                padding: '3rem',
                marginBottom: '3rem',
                background: `linear-gradient(135deg, ${badge.color}08, transparent)`,
                border: '2px solid var(--border-color)',
                textAlign: 'center'
            }}>
                {/* Avatar */}
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.5rem' }}>
                    <img
                        src={profile.avatar_url || getAvatarUrl(profile.id, profile.display_name)}
                        alt={profile.display_name}
                        style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: `4px solid ${badge.color}`,
                            boxShadow: `0 8px 24px ${badge.color}55`
                        }}
                    />
                    {/* Badge Icon Overlay */}
                    <div style={{
                        position: 'absolute',
                        bottom: '0',
                        right: '0',
                        background: badge.color,
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        border: '3px solid var(--bg-secondary)',
                        boxShadow: 'var(--shadow-md)'
                    }}>
                        {badge.icon}
                    </div>
                </div>

                <h1 style={{ marginBottom: '0.5rem', fontSize: '2rem' }}>{profile.display_name}</h1>
                <p style={{ color: 'var(--text-tertiary)', marginBottom: '1.5rem', fontSize: '1rem' }}>@{profile.username}</p>

                {/* Stats */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginBottom: '2rem' }}>
                    <div>
                        <div style={{ fontWeight: '800', fontSize: '1.75rem', color: 'var(--accent)' }}>{formatNumber(profile.post_count || 0)}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: '600' }}>লিখনি (Posts)</div>
                    </div>
                    <div>
                        <div style={{ fontWeight: '800', fontSize: '1.75rem', color: 'var(--accent-purple)' }}>{formatNumber(profile.followers_count || 0)}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: '600' }}>অনুসৰণকাৰী</div>
                    </div>
                    <div>
                        <div style={{ fontWeight: '800', fontSize: '1.75rem', color: 'var(--accent-blue)' }}>{formatNumber(profile.following_count || 0)}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: '600' }}>অনুসৰণ</div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    {isOwnProfile ? (
                        <Link to="/settings" className="btn btn-secondary">
                            <Settings size={18} /> প্ৰ'ফাইল সম্পাদনা
                        </Link>
                    ) : (
                        <>
                            <button
                                className={`btn ${following ? 'btn-secondary' : 'btn-primary'}`}
                                onClick={handleFollow}
                            >
                                {following ? (
                                    <><UserMinus size={18} /> অনুসৰণ কৰি থকা</>
                                ) : (
                                    <><UserPlus size={18} /> অনুসৰণ কৰক</>
                                )}
                            </button>
                        </>
                    )}
                </div>

                {/* Bio */}
                {profile.bio && (
                    <p style={{
                        maxWidth: '600px',
                        margin: '0 auto 2rem',
                        lineHeight: '1.7',
                        fontSize: '1.05rem',
                        color: 'var(--text-secondary)'
                    }}>
                        {profile.bio}
                    </p>
                )}

                {/* Social Links */}
                {(profile.website || profile.twitter || profile.instagram) && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                        {profile.website && (
                            <a
                                href={profile.website}
                                target="_blank"
                                rel="noreferrer"
                                className="btn-icon"
                                style={{ background: 'var(--depth-100)' }}
                            >
                                <Globe size={18} />
                            </a>
                        )}
                    </div>
                )}
            </div>

            {/* Achievements Section */}
            <div style={{ marginBottom: '4rem' }}>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.75rem' }}>
                    <span className="gradient-text">অৰ্জনসমূহ</span>
                </h3>
                <ProfileBadge badge={badge} achievements={achievements} />
            </div>

            {/* Published Works */}
            <div>
                <h3 style={{ marginBottom: '2rem', fontSize: '1.75rem' }}>
                    প্ৰকাশিত লিখনিসমূহ ({posts.length})
                </h3>
                <div className="grid" style={{ gridTemplateColumns: '1fr', gap: '2rem' }}>
                    {posts.map(post => <PostCard key={post.id} post={post} onUpdate={fetchUserPosts} />)}
                    {posts.length === 0 && (
                        <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
                            <p style={{ color: 'var(--text-tertiary)', fontSize: '1.1rem' }}>
                                এতিয়ালৈকে কোনো লিখনি প্ৰকাশ কৰা নাই।
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
