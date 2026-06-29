import { useEffect, useMemo, useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { X, Share2, Download, Copy, Check, Sparkles } from 'lucide-react'

import nameLogo from '../logo/namelogo.png'

const TEMPLATES = [
    {
        id: 'ivory',
        label: 'Ivory',
        bg: 'radial-gradient(circle at 20% 8%, rgba(255,255,255,0.92), transparent 28%), linear-gradient(145deg, #fffaf1 0%, #f2e4cf 100%)',
        text: '#2f241b',
        muted: '#7a6654',
        accent: '#9a633f',
        border: 'rgba(92, 61, 39, 0.18)',
        logoFilter: 'none',
        isDark: false,
    },
    {
        id: 'midnight',
        label: 'Midnight',
        bg: 'radial-gradient(circle at 82% 12%, rgba(143,180,255,0.28), transparent 30%), linear-gradient(145deg, #0d111a 0%, #1b2230 58%, #101318 100%)',
        text: '#f7f3ec',
        muted: '#c1b8aa',
        accent: '#d7b777',
        border: 'rgba(255,255,255,0.16)',
        logoFilter: 'brightness(0) invert(1)',
        isDark: true,
    },
    {
        id: 'minimal',
        label: 'Minimal',
        bg: 'linear-gradient(180deg, #ffffff 0%, #f6f7f9 100%)',
        text: '#111214',
        muted: '#69707b',
        accent: '#1677ff',
        border: 'rgba(17,18,20,0.1)',
        logoFilter: 'none',
        isDark: false,
    },
    {
        id: 'monsoon',
        label: 'Monsoon',
        bg: 'radial-gradient(circle at 14% 12%, rgba(255,255,255,0.34), transparent 28%), linear-gradient(145deg, #dfefff 0%, #a9c9e8 48%, #587b99 100%)',
        text: '#102536',
        muted: '#31516a',
        accent: '#0e5d8f',
        border: 'rgba(16,37,54,0.16)',
        logoFilter: 'none',
        isDark: false,
    },
    {
        id: 'manuscript',
        label: 'Forest',
        bg: 'radial-gradient(circle at 78% 12%, rgba(209,189,126,0.22), transparent 30%), linear-gradient(145deg, #14251e 0%, #284338 56%, #111c18 100%)',
        text: '#fff8e8',
        muted: '#cbbf9e',
        accent: '#d7be73',
        border: 'rgba(255,255,255,0.14)',
        logoFilter: 'brightness(0) invert(1)',
        isDark: true,
    },
]

const SIZES = [
    { id: 'story', label: 'Story', hint: '9:16', aspect: '9 / 16', width: 1080, height: 1920 },
    { id: 'portrait', label: 'Feed', hint: '4:5', aspect: '4 / 5', width: 1080, height: 1350 },
    { id: 'square', label: 'Square', hint: '1:1', aspect: '1 / 1', width: 1080, height: 1080 },
]

const MAX_CHARS = 420

const trimText = (value = '') => value.replace(/\s+$/g, '').slice(0, MAX_CHARS)

export default function ShareQuoteModal({ isOpen, onClose, text = '', title = '', author = 'অতিথি', postId }) {
    const [templateId, setTemplateId] = useState('ivory')
    const [sizeId, setSizeId] = useState('story')
    const [mode, setMode] = useState(text ? 'quote' : 'announcement')
    const [quoteText, setQuoteText] = useState(trimText(text))
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const cardRef = useRef(null)

    const template = TEMPLATES.find((item) => item.id === templateId) || TEMPLATES[0]
    const size = SIZES.find((item) => item.id === sizeId) || SIZES[0]
    const postUrl = `${window.location.origin}/post/${postId}`
    const readableUrl = postUrl.replace(/^https?:\/\//, '')
    const content = mode === 'announcement'
        ? `নতুন লিখনি প্ৰকাশিত\n${title}`
        : trimText(quoteText || text || title)
    const isTooLong = quoteText.length >= MAX_CHARS

    const fontSize = useMemo(() => {
        const length = content.length
        if (size.id === 'square') {
            if (length > 260) return '1.18rem'
            if (length > 150) return '1.42rem'
            return '1.8rem'
        }
        if (length > 300) return '1.18rem'
        if (length > 180) return '1.42rem'
        if (length > 90) return '1.72rem'
        return '2.08rem'
    }, [content, size.id])

    useEffect(() => {
        if (!isOpen) return
        const nextText = trimText(text)
        setQuoteText(nextText)
        setMode(nextText ? 'quote' : 'announcement')
    }, [isOpen, text])

    if (!isOpen) return null

    const generateBlob = async () => {
        if (!cardRef.current) return null
        await document.fonts?.ready
        await new Promise(resolve => setTimeout(resolve, 120))
        const exportScale = size.width / cardRef.current.offsetWidth
        const canvas = await html2canvas(cardRef.current, {
            scale: exportScale,
            useCORS: true,
            backgroundColor: null,
            width: cardRef.current.offsetWidth,
            height: cardRef.current.offsetHeight,
        })
        return new Promise(resolve => canvas.toBlob(resolve, 'image/png', 0.96))
    }

    const handleShare = async () => {
        setLoading(true)
        const blob = await generateBlob()
        if (!blob) { setLoading(false); return }

        const file = new File([blob], `aalap-card-${postId}-${size.id}.png`, { type: 'image/png' })
        const shareData = {
            files: [file],
            title: title || 'Aalap',
            text: `Read "${title}" by ${author} on Aalap:\n${postUrl}`,
        }

        try {
            if (navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData)
            } else {
                await handleDownload(blob)
                alert('ডাইৰেক্ট শ্বেয়াৰ সম্ভৱ নহয়, সেয়ে কাৰ্ডখন ডাউনলোড কৰা হৈছে।')
            }
        } catch (err) {
            console.error('Share failed', err)
        } finally {
            setLoading(false)
        }
    }

    const handleDownload = async (existingBlob = null) => {
        setLoading(true)
        const blob = existingBlob || await generateBlob()
        if (!blob) { setLoading(false); return }

        const link = document.createElement('a')
        link.download = `aalap-card-${postId}-${size.id}.png`
        link.href = URL.createObjectURL(blob)
        link.click()
        URL.revokeObjectURL(link.href)
        setLoading(false)
    }

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(postUrl)
            setCopied(true)
            setTimeout(() => setCopied(false), 1800)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="modal-overlay fade-in" onClick={onClose} style={{ zIndex: 2000 }}>
            <div
                className="modal-content share-card-modal"
                onClick={e => e.stopPropagation()}
                style={{
                    maxWidth: '980px',
                    width: 'min(96vw, 980px)',
                    maxHeight: '92vh',
                    padding: 0,
                    overflow: 'hidden',
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1fr) minmax(300px, 370px)',
                    borderRadius: '28px',
                    background: 'var(--surface-elevated)',
                }}
            >
                <section style={{ padding: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)', minHeight: 0 }}>
                    <div style={{ width: size.id === 'story' ? 'min(52vh, 330px)' : 'min(68vh, 430px)', maxWidth: '100%', boxShadow: '0 26px 70px rgba(0,0,0,0.24)', borderRadius: '24px', overflow: 'hidden' }}>
                        <div
                            ref={cardRef}
                            style={{
                                width: '100%',
                                aspectRatio: size.aspect,
                                background: template.bg,
                                color: template.text,
                                padding: size.id === 'story' ? '9% 8%' : '8% 7.5%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                position: 'relative',
                                fontFamily: 'var(--font-serif)',
                                userSelect: 'none',
                                overflow: 'hidden',
                            }}
                        >
                            <div style={{ position: 'absolute', inset: '5%', border: `1px solid ${template.border}`, borderRadius: size.id === 'square' ? '24px' : '30px', pointerEvents: 'none' }} />
                            <div style={{ position: 'absolute', width: '44%', aspectRatio: '1', borderRadius: '50%', right: '-18%', top: '-10%', background: template.accent, opacity: template.isDark ? 0.12 : 0.09 }} />

                            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', position: 'relative', zIndex: 1 }}>
                                <img src={nameLogo} alt="Aalap" style={{ height: size.id === 'story' ? '30px' : '25px', objectFit: 'contain', filter: template.logoFilter, opacity: 0.92 }} />
                                <div style={{ color: template.muted, fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Aalap Card</div>
                            </header>

                            <main style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, padding: size.id === 'story' ? '10% 0' : '7% 0' }}>
                                {mode === 'quote' && <div style={{ color: template.accent, fontSize: '3.2rem', lineHeight: 0.8, fontFamily: 'Georgia, serif', marginBottom: '0.5rem' }}>“</div>}
                                <div style={{
                                    fontSize,
                                    lineHeight: mode === 'announcement' ? 1.18 : 1.48,
                                    whiteSpace: 'pre-wrap',
                                    fontWeight: mode === 'announcement' ? 700 : 500,
                                    textAlign: size.id === 'story' ? 'left' : 'center',
                                    letterSpacing: '0.004em',
                                }}>
                                    {content}
                                </div>
                                {mode === 'quote' && <div style={{ width: '52px', height: '3px', borderRadius: '999px', background: template.accent, marginTop: '1.45rem', opacity: 0.88 }} />}
                            </main>

                            <footer style={{ position: 'relative', zIndex: 1, borderTop: `1px solid ${template.border}`, paddingTop: '1rem' }}>
                                {mode === 'quote' && <div style={{ fontFamily: 'var(--font-decorative)', fontSize: size.id === 'story' ? '1.25rem' : '1.05rem', lineHeight: 1.15, fontWeight: 500 }}>{title}</div>}
                                <div style={{ marginTop: mode === 'quote' ? '0.35rem' : 0, color: template.muted, fontSize: '0.94rem', fontWeight: 700 }}>— {author}</div>
                                <div style={{ marginTop: '0.8rem', display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'end', color: template.muted, fontSize: '0.74rem', lineHeight: 1.35 }}>
                                    <span>সম্পূৰ্ণ লিখনি Aalap-ত পঢ়ক</span>
                                    <span style={{ textAlign: 'right', maxWidth: '48%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{readableUrl}</span>
                                </div>
                            </footer>
                        </div>
                    </div>
                </section>

                <aside style={{ padding: '1.1rem', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.08rem', display: 'flex', alignItems: 'center', gap: '0.55rem', fontWeight: 800 }}>
                            <Sparkles size={18} /> Share as Card
                        </h3>
                        <button className="btn-icon" onClick={onClose}><X size={18} /></button>
                    </div>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <div>
                            <div className="field-label">Card type</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                <button className={`tab-btn ${mode === 'quote' ? 'active' : ''}`} onClick={() => setMode('quote')}>Quote</button>
                                <button className={`tab-btn ${mode === 'announcement' ? 'active' : ''}`} onClick={() => setMode('announcement')}>Announcement</button>
                            </div>
                        </div>

                        {mode === 'quote' && (
                            <div>
                                <div className="field-label">Quote / excerpt</div>
                                <textarea
                                    value={quoteText}
                                    onChange={(e) => setQuoteText(trimText(e.target.value))}
                                    rows={6}
                                    placeholder="Select a quote from the reader or write a short excerpt..."
                                    style={{ resize: 'vertical', fontFamily: 'var(--font-serif)' }}
                                />
                                <div style={{ marginTop: '0.35rem', fontSize: '0.78rem', color: isTooLong ? 'var(--danger)' : 'var(--text-tertiary)' }}>{quoteText.length}/{MAX_CHARS} characters. Short cards perform better.</div>
                            </div>
                        )}

                        <div>
                            <div className="field-label">Template</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
                                {TEMPLATES.map((item) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => setTemplateId(item.id)}
                                        title={item.label}
                                        style={{
                                            height: '52px',
                                            borderRadius: '16px',
                                            border: templateId === item.id ? '2px solid var(--accent)' : '1px solid var(--border-color)',
                                            background: item.bg,
                                            cursor: 'pointer',
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="field-label">Size</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                                {SIZES.map((item) => (
                                    <button key={item.id} className={`tab-btn ${sizeId === item.id ? 'active' : ''}`} onClick={() => setSizeId(item.id)}>
                                        <span>{item.label}</span>
                                        <small style={{ display: 'block', opacity: 0.7 }}>{item.hint}</small>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gap: '0.65rem', marginTop: '0.25rem' }}>
                            <button className="btn btn-primary" onClick={handleShare} disabled={loading} style={{ width: '100%' }}>
                                <Share2 size={18} /> {loading ? 'Preparing...' : 'Share image'}
                            </button>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                                <button className="btn btn-secondary" onClick={() => handleDownload()} disabled={loading}><Download size={17} /> Download</button>
                                <button className="btn btn-secondary" onClick={handleCopyLink}><Copy size={17} /> {copied ? <Check size={17} /> : 'Link'}</button>
                            </div>
                        </div>

                        <p style={{ margin: 0, color: 'var(--text-tertiary)', fontSize: '0.84rem', lineHeight: 1.5 }}>
                            Tip: share a sharp line, not the whole post. The card is a teaser that brings readers back to Aalap.
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    )
}
