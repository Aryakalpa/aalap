import { useState, useRef, useEffect } from 'react'
import html2canvas from 'html2canvas'
import { X, Share2, Image as ImageIcon } from 'lucide-react'

const THEMES = [
    { id: 'midnight', bg: 'linear-gradient(135deg, #1e1e2e 0%, #2d2d44 100%)', text: '#ffffff' },
    { id: 'sunset', bg: 'linear-gradient(135deg, #ee7752 0%, #e73c7e 100%)', text: '#ffffff' },
    { id: 'ocean', bg: 'linear-gradient(135deg, #23d5ab 0%, #23a6d5 100%)', text: '#ffffff' },
    { id: 'forest', bg: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)', text: '#ffffff' },
    { id: 'paper', bg: 'url("https://www.transparenttextures.com/patterns/cream-paper.png"), #fdfbf7', text: '#2c3e50' },
    { id: 'minimal', bg: '#ffffff', text: '#000000' }
]

const CHAR_LIMIT = 400

export default function ShareQuoteModal({ isOpen, onClose, text, title, author, postId }) {
    const [themeIndex, setThemeIndex] = useState(0)
    const [loading, setLoading] = useState(false)
    const cardRef = useRef(null)

    // Truncate text if needed
    const displayQuote = text.length > CHAR_LIMIT
        ? text.substring(0, CHAR_LIMIT) + '...'
        : text

    const theme = THEMES[themeIndex]

    const cycleTheme = () => {
        setThemeIndex((prev) => (prev + 1) % THEMES.length)
    }

    if (!isOpen) return null

    const handleShare = async () => {
        setLoading(true)
        const blob = await new Promise(resolve => {
            if (!cardRef.current) resolve(null)
            html2canvas(cardRef.current, { scale: 3, useCORS: true, backgroundColor: null }).then(canvas => {
                canvas.toBlob(resolve, 'image/png')
            })
        })

        if (!blob) {
            setLoading(false)
            return
        }

        const file = new File([blob], `aalap-quote-${postId}.png`, { type: 'image/png' })
        const shareData = {
            files: [file],
            title: `Quote from ${title}`,
            text: `Read "${title}" by ${author} on Aalap:\n\n${window.location.origin}/post/${postId}`
        }

        try {
            if (navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData)
            } else {
                // Fallback: Download
                const link = document.createElement('a')
                link.download = `aalap-quote-${postId}.png`
                link.href = URL.createObjectURL(blob)
                link.click()
                alert('ছবি ডাউনলোড কৰা হ\'ল!') // Image downloaded!
            }
        } catch (err) {
            console.error('Share failed', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="modal-overlay fade-in" onClick={onClose} style={{ zIndex: 2000 }}>
            {/* Added touch-action: none to prevent scrolling on mobile while touching the card */}
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{
                maxWidth: '400px',
                width: '90%',
                padding: '0',
                background: 'var(--bg-secondary)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
            }}>

                {/* Header */}
                <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ImageIcon size={18} /> উদ্ধৃতি শ্বেয়াৰ কৰক
                    </h3>
                    <button className="btn-icon" onClick={onClose}><X size={20} /></button>
                </div>

                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>

                    {/* Simplified Hint */}
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                        থীম সলনি কৰিবলৈ কাৰ্ডখনত ক্লিক কৰক
                    </div>

                    {/* Preview Area - Interactive */}
                    <div
                        onClick={cycleTheme}
                        style={{
                            cursor: 'pointer',
                            borderRadius: 'var(--radius-md)',
                            overflow: 'hidden',
                            boxShadow: 'var(--shadow-lg)',
                            transition: 'transform 0.1s active',
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                        className="quote-card-container"
                    >
                        <div
                            ref={cardRef}
                            style={{
                                width: '100%',
                                maxWidth: '320px',
                                aspectRatio: '4/5', // Instagram portrait ratio
                                background: theme.bg,
                                color: theme.text,
                                padding: '2rem',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                position: 'relative',
                                fontFamily: '"Tiro Bangla", serif',
                                userSelect: 'none'
                            }}
                        >
                            {/* Watermark / Logo Top */}
                            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', opacity: 0.9 }}>
                                <img src="/src/logo/namelogo.png" alt="Aalap" style={{ height: '24px', objectFit: 'contain', filter: theme.id === 'white' ? 'none' : 'brightness(0) invert(1)' }} />
                            </div>

                            {/* Quote Content */}
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{
                                    fontSize: displayQuote.length > 150 ? '1rem' : '1.3rem',
                                    lineHeight: '1.6',
                                    textAlign: 'center',
                                    fontWeight: '500',
                                    whiteSpace: 'pre-wrap',
                                    fontStyle: 'italic'
                                }}>
                                    "{displayQuote}"
                                </div>
                            </div>

                            {/* Footer / Author */}
                            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                                <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>{title}</div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '0.2rem' }}>{author}</div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <button
                        className="btn btn-primary"
                        onClick={handleShare}
                        disabled={loading}
                        style={{ width: '100%', padding: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '1rem', marginTop: '0.5rem' }}
                    >
                        {loading ? 'প্ৰস্তুত হৈ আছে...' : (
                            <>
                                <Share2 size={18} /> ডাউনলোড / শ্বেয়াৰ
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
