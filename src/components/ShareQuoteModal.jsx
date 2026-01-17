import { useState, useRef, useEffect } from 'react'
import html2canvas from 'html2canvas'
import { X, Share2, Download, Image as ImageIcon } from 'lucide-react'

import nameLogo from '../logo/namelogo.png'

const THEMES = [
    { id: 'midnight', bg: 'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)', text: '#ffffff', isDark: true },
    { id: 'sunset', bg: 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 99%, #FECFEF 100%)', text: '#5e4b56', isDark: false }, // Adjusted for aesthetics
    { id: 'ocean', bg: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)', text: '#4a4a4a', isDark: false }, // Softer pastel
    { id: 'forest', bg: 'linear-gradient(135deg, #134E5E 0%, #71B280 100%)', text: '#ffffff', isDark: true },
    { id: 'classic', bg: '#1c1c1e', text: '#ffffff', isDark: true }, // Apple Dark
    { id: 'minimal', bg: '#ffffff', text: '#000000', isDark: false },
    { id: 'paper', bg: 'url("https://www.transparenttextures.com/patterns/cream-paper.png"), #fdfbf7', text: '#2c3e50', isDark: false }
]

const CHAR_LIMIT = 300

export default function ShareQuoteModal({ isOpen, onClose, text, title, author, postId }) {
    const [themeIndex, setThemeIndex] = useState(0)
    const [loading, setLoading] = useState(false)
    const cardRef = useRef(null)

    // Ensure text isn't too long for the aesthetic layout
    const displayQuote = text.length > CHAR_LIMIT
        ? text.substring(0, CHAR_LIMIT) + '...'
        : text

    const theme = THEMES[themeIndex]

    const [processedLogo, setProcessedLogo] = useState(nameLogo)

    // Pre-process logo for html2canvas compatibility (since it ignores CSS filters)
    useEffect(() => {
        const processLogo = async () => {
            if (!theme.isDark) {
                setProcessedLogo(nameLogo)
                return
            }

            const img = new Image()
            img.src = nameLogo
            img.crossOrigin = 'anonymous'

            img.onload = () => {
                const canvas = document.createElement('canvas')
                canvas.width = img.width
                canvas.height = img.height
                const ctx = canvas.getContext('2d')

                // Bake the filter into the image
                ctx.filter = 'brightness(0) invert(1)'
                ctx.drawImage(img, 0, 0)

                setProcessedLogo(canvas.toDataURL())
            }
        }
        processLogo()
    }, [theme.isDark])

    const cycleTheme = () => {
        setThemeIndex((prev) => (prev + 1) % THEMES.length)
    }

    if (!isOpen) return null

    const generateBlob = async () => {
        if (!cardRef.current) return null

        // Wait for images to be fully ready
        await new Promise(resolve => setTimeout(resolve, 100))

        // 4x scale for crisp retina-like quality
        const canvas = await html2canvas(cardRef.current, { scale: 4, useCORS: true, backgroundColor: null })
        return new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
    }

    const handleShare = async () => {
        setLoading(true)
        const blob = await generateBlob()
        if (!blob) { setLoading(false); return }

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
                alert('এই ডিভাইচত ডাইৰেক্ট শ্বেয়াৰ সম্ভৱ নহয়। অনুগ্ৰহ কৰি ডাউনলোড কৰক।')
            }
        } catch (err) {
            console.error('Share failed', err)
        } finally {
            setLoading(false)
        }
    }

    const handleDownload = async () => {
        setLoading(true)
        const blob = await generateBlob()
        if (!blob) { setLoading(false); return }

        const link = document.createElement('a')
        link.download = `aalap-quote-${postId}.png`
        link.href = URL.createObjectURL(blob)
        link.click()
        setLoading(false)
    }

    return (
        <div className="modal-overlay fade-in" onClick={onClose} style={{ zIndex: 2000 }}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{
                maxWidth: '420px',
                width: '90%',
                padding: '0',
                background: 'var(--bg-secondary)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '24px' // More rounded
            }}>

                {/* Header */}
                <div style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}>
                        <ImageIcon size={18} /> শ্বেয়াৰ কাৰ্ড
                    </h3>
                    <button className="btn-icon" onClick={onClose} style={{ background: 'var(--bg-tertiary)', borderRadius: '50%', padding: '0.4rem' }}><X size={18} /></button>
                </div>

                <div style={{ padding: '0 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>

                    {/* Preview Area - Interactive */}
                    <div
                        onClick={cycleTheme}
                        style={{
                            cursor: 'pointer',
                            borderRadius: '20px',
                            boxShadow: '0 20px 50px -12px rgba(0,0,0,0.25)',
                            transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            position: 'relative'
                        }}
                        className="quote-card-container"
                    >
                        {/* Tap hint overlay */}
                        <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.2)', padding: '4px 8px', borderRadius: '12px', fontSize: '10px', color: 'white', pointerEvents: 'none', backdropFilter: 'blur(4px)', zIndex: 10 }}>Tap to change</div>

                        <div
                            ref={cardRef}
                            style={{
                                width: '100%',
                                aspectRatio: '4/5',
                                background: theme.bg,
                                color: theme.text,
                                padding: '3rem 2rem',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                position: 'relative',
                                fontFamily: '"Tiro Bangla", serif',
                                userSelect: 'none'
                            }}
                        >
                            {/* Logo */}
                            <div style={{ display: 'flex', justifyContent: 'center', opacity: 0.95, marginBottom: '2rem' }}>
                                <img
                                    src={processedLogo}
                                    alt="Aalap"
                                    style={{
                                        height: '28px',
                                        objectFit: 'contain',
                                        dropShadow: theme.isDark ? '0 2px 10px rgba(0,0,0,0.3)' : 'none'
                                    }}
                                />
                            </div>

                            {/* Quote */}
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{
                                    fontSize: displayQuote.length > 200 ? '1.1rem' : displayQuote.length > 100 ? '1.3rem' : '1.6rem',
                                    lineHeight: '1.5',
                                    textAlign: 'center',
                                    fontWeight: '500',
                                    whiteSpace: 'pre-wrap',
                                    fontFeatureSettings: '"kern" 1, "liga" 1',
                                }}>
                                    {displayQuote}
                                </div>
                            </div>

                            {/* Footer */}
                            <div style={{ marginTop: '2.5rem', textAlign: 'center', borderTop: `1px solid ${theme.text}20`, paddingTop: '1.5rem' }}>
                                <div style={{ fontSize: '1.1rem', fontWeight: '700', letterSpacing: '-0.01em' }}>{title}</div>
                                <div style={{ fontSize: '0.9rem', opacity: 0.75, marginTop: '0.3rem', fontStyle: 'italic', fontFamily: '"Hind Siliguri", sans-serif' }}>{author}</div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '1rem', width: '100%', marginTop: '0.5rem' }}>
                        <button
                            className="btn"
                            onClick={handleDownload}
                            disabled={loading}
                            style={{ flex: 1, padding: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.9rem', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                        >
                            <Download size={18} /> ডাউনলোড
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleShare}
                            disabled={loading}
                            style={{ flex: 1, padding: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.9rem' }}
                        >
                            <Share2 size={18} /> শ্বেয়াৰ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
