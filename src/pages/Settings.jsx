import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import { useAuth } from '../contexts/AuthContext'
import { User, Mail, Camera, Save, ChevronLeft, Sparkles } from 'lucide-react'
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
          username,
          bio,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) throw error
      await fetchProfile(user.id)
      alert("প্ৰ'ফাইল সফলতাৰে আপডেইট কৰা হ'ল!")
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
    <div className="page-shell fade-in">
      <header className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '1rem' }}>
          <button onClick={() => navigate(-1)} className="btn-icon">
            <ChevronLeft size={20} />
          </button>
          <div className="section-kicker" style={{ marginBottom: 0 }}>Profile studio</div>
        </div>
        <h1 className="page-title">প্ৰ'ফাইল সম্পাদনা</h1>
        <p className="page-subtitle">আপোনাৰ লেখক-পরিচয়, চেহেৰা, আৰু বৰ্ণনা অলপ অধিক মনোযোগেৰে গঢ়ি তোলক।</p>
      </header>

      <form onSubmit={handleSave} className="writer-layout" style={{ alignItems: 'start' }}>
        <div className="panel writer-canvas">
          <div className="field-group">
            <label className="field-label">
              <User size={14} style={{ marginRight: 6 }} /> নাম (Display Name)
            </label>
            <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
          </div>

          <div className="field-group">
            <label className="field-label">
              <Mail size={14} style={{ marginRight: 6 }} /> ইউজাৰনেম (Username)
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', fontWeight: 700 }}>@</span>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())} style={{ paddingLeft: '2rem' }} required />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">পৰিচয় (Bio)</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="আপোনাৰ বিষয়ে অলপ লিখক..." rows={6} />
          </div>

          <div className="field-group" style={{ marginBottom: 0 }}>
            <label className="field-label">অৱতাৰ URL</label>
            <input type="url" placeholder="https://example.com/photo.jpg" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
          </div>
        </div>

        <aside className="panel writer-sidebar">
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <Avatar profile={{ ...profile, avatar_url: avatarUrl }} size="xl" />
            <div style={{ marginTop: '0.9rem', color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              আপোনাৰ পাঠকসকলে প্ৰথমে এই মুখখনেই দেখিব।
            </div>
          </div>

          <div className="field-group">
            <label className="field-label"><Camera size={14} style={{ marginRight: 6 }} /> DiceBear avatar styles</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['avataaars', 'bottts', 'pixel-art', 'lorelei', 'notionists'].map(style => (
                <button
                  key={style}
                  type="button"
                  className="filter-chip"
                  onClick={() => setAvatarUrl(`https://api.dicebear.com/7.x/${style}/svg?seed=${Math.random().toString(36).substring(7)}`)}
                >
                  {style.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="field-group">
            <label className="field-label"><Sparkles size={14} style={{ marginRight: 6 }} /> Editorial tip</label>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: '1.75' }}>
              সংক্ষিপ্ত কিন্তু মনে থাকি যোৱা বায়' লিখক। নাম, আগ্ৰহ, বা লিখনিৰ ধাৰা উল্লেখ কৰিলে পাঠকে আপোনাক সহজে মনত ৰাখিব।
            </p>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
            <Save size={18} /> {loading ? 'সংৰক্ষণ হৈ আছে...' : 'পৰিৱৰ্তনসমূহ সংৰক্ষণ কৰক'}
          </button>
        </aside>
      </form>
    </div>
  )
}
