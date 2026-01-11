import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import { useAuth } from '../contexts/AuthContext'
import { User, Mail, Camera, Save, ChevronLeft } from 'lucide-react'
import Avatar from '../components/Avatar'

export default function Settings() {
    const { user, profile, fetchProfile } = useAuth()
    const navigate = useNavigate()

    const [displayName, setDisplayName] = useState('')
    const [username, setUsername] = useState('')
    const [bio, setBio] = useState('')
    const [avatarUrl, setAvatarUrl] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (profile) {
            setDisplayName(profile.display_name || '')
            setUsername(profile.username || '')
            setBio(profile.bio || '')
            setAvatarUrl(profile.avatar_url || '')
        }
    }, [profile])

    const handleSave = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    display_name: displayName,
                    username: username,
                    bio: bio,
                    avatar_url: avatarUrl,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id)

            if (error) throw error
            await fetchProfile()
            alert('প্ৰ\'ফাইল সফলতাৰে আপডেইট কৰা হ\'ল!')
            navigate(`/profile/${user.id}`)
        } catch (error) {
            console.error(error)
            alert('কিবা খেলিমেলি হৈছে। অনুগ্ৰহ কৰি পুনৰ চেষ্টা কৰক।')
        } finally {
            setLoading(false)
        }
    }

    if (!user) return null

    return (
        <div className="container-sm fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
                <button onClick={() => navigate(-1)} className="btn-icon">
                    <ChevronLeft size={24} />
                </button>
                <h1 style={{ fontSize: '1.75rem', margin: 0 }}>প্ৰ'ফাইল সম্পাদনা</h1>
            </div>

            <form onSubmit={handleSave} className="card" style={{ padding: '2.5rem' }}>
                {/* Avatar Edit */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <Avatar profile={{ ...profile, avatar_url: avatarUrl }} size="xl" />
                        <div style={{
                            position: 'absolute',
                            bottom: '0',
                            right: '0',
                            background: 'var(--accent)',
                            color: 'white',
                            padding: '0.5rem',
                            borderRadius: '50%',
                            border: '3px solid var(--bg-secondary)',
                            boxShadow: 'var(--shadow-md)'
                        }}>
                            <Camera size={20} />
                        </div>
                    </div>
                    <div style={{ marginTop: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>
                            Avatar URL
                        </label>
                        <input
                            type="url"
                            placeholder="https://example.com/photo.jpg"
                            value={avatarUrl}
                            onChange={(e) => setAvatarUrl(e.target.value)}
                            style={{ maxWidth: '400px', margin: '0 auto' }}
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gap: '2rem' }}>
                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
                            <User size={18} /> নাম (Display Name)
                        </label>
                        <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
                            <Mail size={18} /> ইউজাৰনেম (Username)
                        </label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', fontWeight: '700' }}>@</span>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                                style={{ paddingLeft: '2.2rem' }}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
                            পৰিচয় (Bio)
                        </label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="আপোনাৰ বিষয়ে অলপ লিখক..."
                            rows={4}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '1.25rem', fontSize: '1.1rem' }}>
                        <Save size={20} /> {loading ? 'সংৰক্ষণ হৈ আছে...' : 'পৰিৱৰ্তনসমূহ সংৰক্ষণ কৰক'}
                    </button>
                </div>
            </form>
        </div>
    )
}
