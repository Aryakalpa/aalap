import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../supabase'
import { useAuth } from '../contexts/AuthContext'
import { CATEGORIES, countWords, estimateReadingTime } from '../utils/helpers'
import { PenTool, Image, CheckCircle, ChevronLeft, Save, AlignLeft, AlignCenter, AlignJustify, BookOpen } from 'lucide-react'
import CoverPreview from '../components/CoverPreview'
import { COVER_PRESETS, buildCoverSvg, isGeneratedCover } from '../utils/covers'

export default function Write() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [category, setCategory] = useState('')
  const [seriesName, setSeriesName] = useState('')
  const [alignment, setAlignment] = useState('left')
  const [isDraft, setIsDraft] = useState(true)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const [coverMode, setCoverMode] = useState('preset')
  const [coverPreset, setCoverPreset] = useState('paper-ink')

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
      setAlignment(data.alignment || 'left')
      setIsDraft(!data.is_published)
      if (!data.cover_image) {
        setCoverMode('none')
      } else if (isGeneratedCover(data.cover_image)) {
        setCoverMode('preset')
      } else {
        setCoverMode('preset')
      }
    }
  }

  const handleSaveDraft = () => handlePublish(false)

  const handlePublish = async (publish = true) => {
    if (!title.trim() || !body.trim() || !category) {
      alert('অনুগ্ৰহ কৰি সঠিকভাৱে শিৰোনাম, বিষয়বস্তু আৰু বিভাগ বাছনি কৰক।')
      return
    }

    setSaving(true)
    try {
      const resolvedCoverImage =
        coverMode === 'preset'
          ? buildCoverSvg({
              category: CATEGORIES.find((c) => c.id === category)?.label || category,
              presetId: coverPreset,
            })
          : ''

      const postData = {
        title,
        body,
        category,
        series_name: seriesName,
        cover_image: resolvedCoverImage,
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
      alert(error.message || 'সংৰক্ষণ কৰিবলৈ অসুবিধা হৈছে। অনুগ্ৰহ কৰি পুনৰ চেষ্টা কৰক।')
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
            <h1 style={{ fontSize: '1.5rem', margin: 0 }}>লিখন কক্ষ</h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
              {lastSaved ? `শেহতীয়া: ${lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : isDraft ? 'খচৰা (Draft)' : 'প্ৰকাশিত (Published)'}
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
            <input type="text" placeholder="আপোনাৰ লিখনৰ শিৰোনাম..." value={title} onChange={(e) => setTitle(e.target.value)} style={{ fontSize: '2rem', fontWeight: '800', border: 'none', background: 'transparent', padding: '0.25rem 0', boxShadow: 'none' }} />
          </div>

          <div className="stats-strip" style={{ marginBottom: '1.25rem' }}>
            <div className="stat-box"><div className="stat-label">শব্দ</div><div className="stat-value">{countWords(body)}</div></div>
            <div className="stat-box"><div className="stat-label">পঢ়িবলৈ</div><div className="stat-value" style={{ fontSize: '1.1rem' }}>{estimateReadingTime(body)}</div></div>
            <div className="stat-box"><div className="stat-label">অৱস্থা</div><div className="stat-value" style={{ fontSize: '1.1rem' }}>{isDraft ? 'খচৰা (Draft)' : 'প্ৰকাশিত (Published)'}</div></div>
          </div>

          <div className="field-group">
            <label className="field-label">লিখনি আৰম্ভ কৰক</label>
            <textarea placeholder="আপোনাৰ মনৰ কথা লিখিবলৈ আৰম্ভ কৰক..." value={body} onChange={(e) => setBody(e.target.value)} style={{ minHeight: '70vh', fontSize: '1.16rem', lineHeight: '1.95', border: 'none', background: 'transparent', padding: 0, boxShadow: 'none', color: 'var(--text-primary)', fontFamily: 'var(--font-serif)', textAlign: alignment }} />
          </div>
        </div>

        <aside className="panel writer-sidebar">
          <div className="field-group">
            <label className="field-label"><CheckCircle size={14} style={{ marginRight: 6 }} />বিভাগ বাছনি কৰক</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {CATEGORIES.map((cat) => (
                <button key={cat.id} className={`filter-chip ${category === cat.id ? 'active' : ''}`} onClick={() => setCategory(cat.id)}>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="field-group">
            <label className="field-label"><AlignLeft size={14} style={{ marginRight: 6 }} />লিখনিৰ ধৰণ (Alignment)</label>
            <div className="tab-row">
              <button className={`tab-btn ${alignment === 'left' ? 'active' : ''}`} onClick={() => setAlignment('left')}><AlignLeft size={16} /></button>
              <button className={`tab-btn ${alignment === 'center' ? 'active' : ''}`} onClick={() => setAlignment('center')}><AlignCenter size={16} /></button>
              <button className={`tab-btn ${alignment === 'justify' ? 'active' : ''}`} onClick={() => setAlignment('justify')}><AlignJustify size={16} /></button>
            </div>
          </div>

          <div className="field-group">
            <label className="field-label"><BookOpen size={14} style={{ marginRight: 6 }} />ধাৰাবাহিকৰ নাম (ঐচ্ছিক)</label>
            <input type="text" placeholder="ধাৰাবাহিকৰ নাম লিখক..." value={seriesName} onChange={(e) => setSeriesName(e.target.value)} />
          </div>

          <div className="field-group">
            <label className="field-label"><Image size={14} style={{ marginRight: 6 }} />বেটুপাত</label>
            <div className="tab-row" style={{ marginBottom: '0.75rem' }}>
              <button type="button" className={`tab-btn ${coverMode === 'preset' ? 'active' : ''}`} onClick={() => setCoverMode('preset')}>Preset</button>
              <button type="button" className={`tab-btn ${coverMode === 'none' ? 'active' : ''}`} onClick={() => setCoverMode('none')}>None</button>
            </div>

            {coverMode === 'preset' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.75rem', marginBottom: '0.9rem' }}>
                  {COVER_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setCoverPreset(preset.id)}
                      style={{
                        border: coverPreset === preset.id ? '2px solid var(--text-primary)' : '1px solid var(--border-color)',
                        borderRadius: '14px',
                        overflow: 'hidden',
                        background: 'var(--surface-raised)',
                        cursor: 'pointer',
                        padding: 0,
                        textAlign: 'left',
                      }}
                    >
                      <div style={{ aspectRatio: '4 / 5', background: 'var(--bg-secondary)' }}>
                        <CoverPreview
                          title=""
                          category={CATEGORIES.find((c) => c.id === category)?.label || category || 'অন্যান্য'}
                          author=""
                          presetId={preset.id}
                          alt={preset.label}
                        />
                      </div>
                      <div style={{ padding: '0.55rem 0.7rem', fontSize: '0.82rem', fontWeight: 700 }}>{preset.label}</div>
                    </button>
                  ))}
                </div>
                <div className="panel" style={{ padding: '0.75rem' }}>
                  <div style={{ aspectRatio: '4 / 5', borderRadius: '12px', overflow: 'hidden' }}>
                    <CoverPreview
                      title=""
                      category={CATEGORIES.find((c) => c.id === category)?.label || category || 'অন্যান্য'}
                      author=""
                      presetId={coverPreset}
                      alt="Cover preview"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="field-group" style={{ marginBottom: 0 }}>
            <label className="field-label"><PenTool size={14} style={{ marginRight: 6 }} />লিখন কক্ষ</label>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: '1.75' }}>
              আপোনাৰ লিখনি লিখক, খচৰা হিচাপে ৰাখক, বা প্ৰকাশ কৰক।
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
