import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../supabase'
import { useAuth } from '../contexts/AuthContext'
import { CATEGORIES, countWords } from '../utils/helpers'
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
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('id', id)
            .eq('author_id', user.id)
            .single()

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
            alert('অনুগ্ৰহ কৰি সঠিকভাৱে শিৰোনাম, বিষয়বস্তু আৰু বিভাগ বাছনি কৰক।')
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
                updated_at: new Date().toISOString()
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
            alert('সংৰক্ষণ কৰিবলৈ অসুবিধা হৈছে। অনুগ্ৰহ কৰি পুনৰ চেষ্টা কৰক।')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="container-sm">
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '2rem',
                position: 'sticky',
                top: '4.5rem',
                background: 'var(--bg-primary)',
                padding: '1rem 0',
                zIndex: 10,
                borderBottom: '1px solid var(--border-color)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button onClick={() => navigate(-1)} className="btn-icon">
                        <ChevronLeft size={22} />
                    </button>
                    <h1 style={{ fontSize: '1.25rem', margin: 0 }}>লিখন কক্ষ</h1>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.7rem', color: isDraft ? 'var(--accent)' : 'var(--text-tertiary)', fontWeight: '700' }}>
                            {isDraft ? 'খচৰা (Draft)' : 'প্ৰকাশিত (Published)'}
                        </span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>
                            {lastSaved ? `শেহতীয়া: ${lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : `${countWords(body)} শব্দ`}
                        </span>
                    </div>
                    <button className="btn btn-secondary" onClick={handleSaveDraft} disabled={saving} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                        <Save size={16} /> খচৰা
                    </button>
                    <button className="btn btn-primary" onClick={() => handlePublish(true)} disabled={saving} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                        {saving ? 'প্ৰকাশ হৈ আছে...' : 'প্ৰকাশ কৰক'}
                    </button>
                </div>
            </div>

            <div className="card" style={{
                padding: 'var(--card-padding, 1.5rem)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-lg)',
                marginBottom: '4rem'
            }}>
                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <Image size={16} /> বেটুপাতৰ লিংক (ঐচ্ছিক)
                    </label>
                    <input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={coverImage}
                        onChange={(e) => setCoverImage(e.target.value)}
                    />
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <FileText size={16} /> শিৰোনাম
                    </label>
                    <input
                        type="text"
                        placeholder="আপোনাৰ লিখনৰ শিৰোনাম..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{
                            fontSize: '1.75rem',
                            fontWeight: '800',
                            border: 'none',
                            background: 'transparent',
                            padding: '0.5rem 0',
                            borderBottom: '2px solid var(--border-color)',
                            borderRadius: '0',
                            boxShadow: 'none'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <AlignLeft size={16} /> লিখনিৰ ধৰণ (Alignment)
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className={`btn ${alignment === 'left' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setAlignment('left')} style={{ padding: '0.5rem 1rem' }}><AlignLeft size={18} /></button>
                        <button className={`btn ${alignment === 'center' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setAlignment('center')} style={{ padding: '0.5rem 1rem' }}><AlignCenter size={18} /></button>
                        <button className={`btn ${alignment === 'justify' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setAlignment('justify')} style={{ padding: '0.5rem 1rem' }}><AlignJustify size={18} /></button>
                    </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <BookOpen size={16} /> ধাৰাবাহিকৰ নাম (ঐচ্ছিক)
                    </label>
                    <input
                        type="text"
                        placeholder="ধাৰাবাহিকৰ নাম লিখক..."
                        value={seriesName}
                        onChange={(e) => setSeriesName(e.target.value)}
                    />
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <CheckCircle size={16} /> বিভাগ বাছনি কৰক
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                className={`btn ${category === cat.id ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setCategory(cat.id)}
                                style={{ borderRadius: '2rem', padding: '0.4rem 1rem', fontSize: '0.8rem' }}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <PenTool size={16} /> লিখনি আৰম্ভ কৰক
                    </label>
                    <textarea
                        placeholder="আপোনাৰ মনৰ কথা লিখিবলৈ আৰম্ভ কৰক..."
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        style={{
                            minHeight: '400px',
                            fontSize: '1.15rem',
                            lineHeight: '1.8',
                            border: 'none',
                            background: 'transparent',
                            padding: '0',
                            color: 'var(--text-primary)',
                            fontFamily: 'var(--font-serif)',
                            boxShadow: 'none',
                            textAlign: alignment
                        }}
                    />
                </div>
            </div>
        </div>
    )
}
