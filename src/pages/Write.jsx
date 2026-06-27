import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../supabase'
import { useAuth } from '../contexts/AuthContext'
import { CATEGORIES, countWords, estimateReadingTime } from '../utils/helpers'
import { PenTool, Image, FileText, CheckCircle, ChevronLeft, Save, AlignLeft, AlignCenter, AlignJustify, BookOpen } from 'lucide-react'

export default function Write() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [category, setCategory] = useState('')
  const [seriesName, setSeriesName] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [alignment, setAlignment] = useState('left')
  const [isDraft, setIsDraft] = useState(true)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)

  useEffect(() => {
    if (!user) {
      alert('লিখিবলৈ অনুগ্ৰহ কৰি লগ ইন কৰক।')
      navigate('/')
      return
    }
    if (id) fetchPost()
  }, [id, user])

  const fetchPost = async () => {
    const { data } = await supabase.from('posts').select('*').eq('id', id).eq('author_id', user.id).single()
    if (data) {
      setTitle(data.title || '')
      setBody(data.body || '')
      setCategory(data.category || '')
      setSeriesName(data.series_name || '')
      setCoverImage(data.cover_image || '')
      setAlignment(data.alignment || 'left')
      setIsDraft(!data.is_published)
    }
  }

  const handleSaveDraft = () => handlePublish(false)

  const handlePublish = async (publish = true) => {
    if (!title.trim() || !body.trim() || !category) {
      alert('অনুগ্ৰহ কৰি শিৰোনাম, বিষয়বস্তু আৰু বিভাগ পূৰণ কৰক।')
      return
    }

    setSaving(true)
    try {
      const postData = {
        title,
        body,
        category,
        series_name: seriesName,
        cover_image: coverImage,
        alignment,
        author_id: user.id,
        is_published: publish,
        updated_at: new Date().toISOString(),
      }

      const { data, error } = id
        ? await supabase.from('posts').update(postData).eq('id', id).select().single()
        : await supabase.from('posts').insert(postData).select().single()

      if (error) throw error

      if (publish) {
        navigate(`/post/${data.id}`)
      } else {
        setLastSaved(new Date())
        setIsDraft(true)
        if (!id) navigate(`/write/${data.id}`, { replace: true })
      }
    } catch (error) {
      console.error('Error saving:', error)
      alert(error.message || 'সংৰক্ষণ কৰিবলৈ অসুবিধা হৈছে।')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page-shell fade-in">
      <div className="editor-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button onClick={() => navigate(-1)} className="btn-icon"><ChevronLeft size={20} /></button>
            <div>
              <div className="section-kicker">Writing studio</div>
              <h1 style={{ fontSize: '1.5rem', margin: 0 }}>লিখন কক্ষ</h1>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
              {lastSaved ? `শেহতীয়া সংৰক্ষণ: ${lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : isDraft ? 'খচৰা' : 'প্ৰকাশিত'}
            </span>
            <button className="btn btn-secondary" onClick={handleSaveDraft} disabled={saving}><Save size={16} /> খচৰা</button>
            <button className="btn btn-primary" onClick={() => handlePublish(true)} disabled={saving}>{saving ? 'প্ৰকাশ হৈ আছে...' : 'প্ৰকাশ কৰক'}</button>
          </div>
        </div>
      </div>

      <div className="writer-layout">
        <div className="panel writer-canvas">
          <div className="field-group">
            <label className="field-label">শিৰোনাম</label>
            <input
              type="text"
              placeholder="আপোনাৰ লিখনৰ শিৰোনাম..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ fontSize: '2rem', fontWeight: '800', border: 'none', background: 'transparent', padding: '0.25rem 0', boxShadow: 'none' }}
            />
          </div>

          <div className="stats-strip" style={{ marginBottom: '1.25rem' }}>
            <div className="stat-box"><div className="stat-label">শব্দ</div><div className="stat-value">{countWords(body)}</div></div>
            <div className="stat-box"><div className="stat-label">পঢ়াৰ সময়</div><div className="stat-value" style={{ fontSize: '1.1rem' }}>{estimateReadingTime(body)}</div></div>
            <div className="stat-box"><div className="stat-label">অৱস্থা</div><div className="stat-value" style={{ fontSize: '1.1rem' }}>{isDraft ? 'খচৰা' : 'প্ৰকাশিত'}</div></div>
          </div>

          <div className="field-group">
            <label className="field-label">লিখন</label>
            <textarea
              placeholder="আপোনাৰ মনৰ কথা লিখিবলৈ আৰম্ভ কৰক..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              style={{ minHeight: '70vh', fontSize: '1.16rem', lineHeight: '1.95', border: 'none', background: 'transparent', padding: 0, boxShadow: 'none', color: 'var(--text-primary)', fontFamily: 'var(--font-serif)', textAlign: alignment }}
            />
          </div>
        </div>

        <aside className="panel writer-sidebar">
          <div className="field-group">
            <label className="field-label"><CheckCircle size={14} style={{ marginRight: 6 }} />বিভাগ</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {CATEGORIES.map(cat => (
                <button key={cat.id} className={`filter-chip ${category === cat.id ? 'active' : ''}`} onClick={() => setCategory(cat.id)}>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="field-group">
            <label className="field-label"><AlignLeft size={14} style={{ marginRight: 6 }} />Alignment</label>
            <div className="tab-row">
              <button className={`tab-btn ${alignment === 'left' ? 'active' : ''}`} onClick={() => setAlignment('left')}><AlignLeft size={16} /></button>
              <button className={`tab-btn ${alignment === 'center' ? 'active' : ''}`} onClick={() => setAlignment('center')}><AlignCenter size={16} /></button>
              <button className={`tab-btn ${alignment === 'justify' ? 'active' : ''}`} onClick={() => setAlignment('justify')}><AlignJustify size={16} /></button>
            </div>
          </div>

          <div className="field-group">
            <label className="field-label"><BookOpen size={14} style={{ marginRight: 6 }} />ধাৰাবাহিকৰ নাম</label>
            <input type="text" placeholder="ধাৰাবাহিকৰ নাম লিখক..." value={seriesName} onChange={(e) => setSeriesName(e.target.value)} />
          </div>

          <div className="field-group">
            <label className="field-label"><Image size={14} style={{ marginRight: 6 }} />বেটুপাতৰ লিংক</label>
            <input type="url" placeholder="https://example.com/image.jpg" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} />
          </div>

          <div className="field-group" style={{ marginBottom: 0 }}>
            <label className="field-label"><FileText size={14} style={{ marginRight: 6 }} />Editorial note</label>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: '1.75' }}>
              প্ৰথমে লিখনটোৰ কণ্ঠ, তাল, আৰু গতি ধৰি ৰাখক। Metadata পিছতও ঠিক কৰিব পাৰি।
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
