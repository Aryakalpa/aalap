import { useState, useRef, useEffect } from 'react'
import { Share2, Copy, Check, MessageCircle } from 'lucide-react'
import { shareToWhatsApp, shareToTelegram, copyToClipboard } from '../utils/helpers'

export default function ShareButton({ title, postId }) {
    const [open, setOpen] = useState(false)
    const [copied, setCopied] = useState(false)
    const menuRef = useRef(null)

    const url = `${window.location.origin}/post/${postId}`

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleCopy = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        const success = await copyToClipboard(url)
        if (success) {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const handleWhatsApp = (e) => {
        e.preventDefault()
        e.stopPropagation()
        shareToWhatsApp(title, url)
        setOpen(false)
    }

    const handleTelegram = (e) => {
        e.preventDefault()
        e.stopPropagation()
        shareToTelegram(title, url)
        setOpen(false)
    }

    const toggleMenu = (e) => {
        if (e) {
            e.preventDefault()
            e.stopPropagation()
        }
        setOpen(!open)
    }

    return (
        <div
            ref={menuRef}
            style={{ position: 'relative' }}
            onClick={(e) => e.stopPropagation()}
        >
            <button
                className="btn-ghost"
                onClick={toggleMenu}
                style={{ position: 'relative', zIndex: 1 }}
            >
                <Share2 size={18} />
            </button>

            {open && (
                <div className="share-menu fade-in" style={{ zIndex: 1100 }}>
                    <div className="share-menu-item" onClick={handleWhatsApp}>
                        <MessageCircle size={18} style={{ color: '#25D366' }} />
                        <span>WhatsApp</span>
                    </div>
                    <div className="share-menu-item" onClick={handleTelegram}>
                        <MessageCircle size={18} style={{ color: '#0088cc' }} />
                        <span>Telegram</span>
                    </div>
                    <div className="share-menu-item" onClick={handleCopy}>
                        {copied ? <Check size={18} style={{ color: 'var(--accent)' }} /> : <Copy size={18} />}
                        <span>{copied ? 'কপি হ\'ল!' : 'লিংক কপি কৰক'}</span>
                    </div>
                </div>
            )}
        </div>
    )
}
