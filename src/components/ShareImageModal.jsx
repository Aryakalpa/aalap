import { useRef, useState, useEffect } from 'react';
import * as htmlToImage from 'html-to-image';
import download from 'downloadjs';
import { X, Image, Type, Palette, Copy, Check } from 'lucide-react';
import Avatar from './Avatar';
import toast from 'react-hot-toast';

export default function ShareImageModal({ post, user, close }) {
    const ref = useRef(null);
    const [loading, setLoading] = useState(false);
    const [theme, setTheme] = useState('midnight');
    const [font, setFont] = useState('hind');
    const [aspect, setAspect] = useState('story');
    const [content, setContent] = useState(post?.body || ''); // Editable content
    const [copied, setCopied] = useState(false);

    const themes = {
        midnight: { bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', text: '#f8fafc', border: '#334155', accent: '#38bdf8' },
        sunset: { bg: 'linear-gradient(135deg, #4c1d95 0%, #db2777 100%)', text: '#fff', border: 'transparent', accent: '#f472b6' },
        paper: { bg: '#fdfbf7', text: '#2d2d2d', border: '#e6ded3', accent: '#8b5e34' },
        night: { bg: '#121212', text: '#e0e0e0', border: '#282828', accent: '#1db954' },
        ocean: { bg: 'linear-gradient(135deg, #076585 0%, #fff 100%)', text: '#002c3e', border: '#076585', accent: '#076585' }
    };

    const fonts = {
        hind: "'Hind Siliguri', sans-serif",
        serif: "'Noto Serif Bengali', serif",
        galada: "'Galada', cursive",
        tiro: "'Tiro Bangla', serif"
    };

    const downloadImage = async () => {
        if (!ref.current) return;
        setLoading(true);
        try {
            // Wait for fonts to be ready
            await document.fonts.ready;

            const dataUrl = await htmlToImage.toPng(ref.current, {
                quality: 1,
                pixelRatio: 2,
                cacheBust: true,
                useCORS: true,
                style: { borderRadius: '0' }
            });

            download(dataUrl, `aalap-share-${post.id}.png`);
            toast.success('ডাউনল’ড সমাপ্ত');
        } catch (err) {
            console.error(err);
            toast.error('ডাউনল’ড বিফল হ’ল। স্ক্ৰীনশ্বট লওক।');
        }
        setLoading(false);
    };

    const copyToClipboard = async () => {
        if (!ref.current) return;
        setLoading(true);
        try {
            const blob = await htmlToImage.toBlob(ref.current, { cacheBust: true, useCORS: true });
            if (navigator.clipboard && window.ClipboardItem) {
                await navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob })
                ]);
                setCopied(true);
                toast.success('কপি কৰা হ’ল');
                setTimeout(() => setCopied(false), 2000);
            } else {
                throw new Error("Clipboard API not available");
            }
        } catch (err) {
            console.error("Clipboard fail", err);
            toast.error('কপি কৰিবলৈ অসুবিধা হৈছে');
        }
        setLoading(false);
    };

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e) => { if (e.key === 'Escape') close(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [close]);

    if (!post) return null;

    return (
        <div
            onClick={close} // FIX: CLOSE ON BACKDROP CLICK
            style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', backdropFilter: 'blur(10px)' }}
        >
            <div
                onClick={e => e.stopPropagation()} // PREVENT CLOSE ON MODAL CLICK
                style={{ background: 'var(--bg-card)', width: '100%', maxWidth: 500, borderRadius: 24, overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '98vh', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', position: 'relative' }}
            >
                {/* HEADER */}
                <div style={{ padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, background: 'var(--btn-soft)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Image size={18} />
                        </div>
                        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Share as Image</h3>
                    </div>
                    <button onClick={close} className="btn-icon" style={{ opacity: 0.6, background: 'var(--btn-soft)', borderRadius: '50%' }}><X size={20} /></button>
                </div>

                {/* SCROLLABLE AREA */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#0a0a0a', gap: 20 }}>

                    <div style={{ display: 'flex', gap: 8, background: 'rgba(255,255,255,0.05)', padding: 4, borderRadius: 12 }}>
                        {['square', 'story'].map(a => (
                            <button key={a} onClick={() => setAspect(a)} style={{
                                padding: '6px 16px', borderRadius: 8, fontSize: 12, border: 'none',
                                background: aspect === a ? '#fff' : 'transparent',
                                color: aspect === a ? '#000' : '#fff', cursor: 'pointer', transition: '0.2s',
                                fontWeight: 600, textTransform: 'capitalize'
                            }}>{a}</button>
                        ))}
                    </div>

                    <div ref={ref} style={{
                        width: '100%',
                        maxWidth: aspect === 'square' ? 380 : 320,
                        aspectRatio: aspect === 'square' ? '1/1' : '9/16',
                        padding: aspect === 'square' ? 30 : 40,
                        borderRadius: aspect === 'square' ? 12 : 0,
                        background: themes[theme].bg,
                        color: themes[theme].text,
                        fontFamily: fonts[font],
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
                        flexShrink: 0
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                            <Avatar url={user?.avatar_url} size={36} />
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: 14, fontFamily: 'Inter', fontWeight: 700 }}>{user?.display_name}</span>
                                <span style={{ fontSize: 11, opacity: 0.6, fontFamily: 'Inter' }}>aalap.app</span>
                            </div>
                        </div>

                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <h2 style={{
                                margin: '0 0 10px',
                                lineHeight: 1.2,
                                fontSize: aspect === 'square' ? 24 : 32,
                                fontWeight: 800,
                                color: themes[theme].accent
                            }}>{post.title}</h2>

                            <div style={{
                                whiteSpace: 'pre-wrap',
                                lineHeight: 1.6,
                                fontSize: aspect === 'square' ? 15 : 18,
                                opacity: 0.9,
                                overflow: 'hidden'
                            }}>
                                {content}
                            </div>
                        </div>

                        <div style={{ marginTop: 20, paddingTop: 15, borderTop: `1px solid rgba(255,255,255,0.1)`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <div style={{ width: 22, height: 22, background: '#fff', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 900, fontSize: 12 }}>আ</div>
                                <span style={{ fontSize: 14, fontWeight: 800, fontFamily: 'Galada' }}>আলাপ</span>
                            </div>
                            <div style={{ opacity: 0.5, fontSize: 10, fontFamily: 'Inter' }}>aalap.app</div>
                        </div>
                    </div>

                    {/* TEXT EDITOR - CRITICAL FOR SNRUGICAL SELECTION */}
                    <div style={{ width: '100%', maxWidth: 400 }}>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Type size={14} /> Edit text to share specific lines
                        </div>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Type something stylish..."
                            style={{
                                width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 12, padding: 12, color: '#fff', fontSize: 14, minHeight: 100,
                                resize: 'none', outline: 'none', fontFamily: 'inherit'
                            }}
                        />
                    </div>
                </div>

                {/* BOTTOM TOOLS */}
                <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border-light)', background: 'var(--bg-card)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                            {Object.keys(themes).map(k => (
                                <button key={k} onClick={() => setTheme(k)} style={{
                                    width: 24, height: 24, borderRadius: '50%', border: theme === k ? '2px solid var(--text-main)' : '2px solid transparent',
                                    background: themes[k].bg, cursor: 'pointer', transition: '0.2s'
                                }} />
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: 4 }}>
                            {['hind', 'serif', 'galada'].map(f => (
                                <button key={f} onClick={() => setFont(f)} style={{
                                    padding: '4px 10px', borderRadius: 8, fontSize: 11, border: 'none',
                                    background: font === f ? 'var(--text-main)' : 'var(--btn-soft)',
                                    color: font === f ? 'var(--bg-card)' : 'var(--text-main)',
                                    cursor: 'pointer', transition: '0.2s', fontWeight: 600
                                }}>{f.toUpperCase()}</button>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 10 }}>
                        <button
                            disabled={loading} onClick={copyToClipboard}
                            className="btn-soft" style={{ flex: 1, height: 50, borderRadius: 16, justifyContent: 'center', border: '1px solid var(--border-light)' }}
                        >
                            {copied ? <Check size={18} color="var(--success)" /> : <Copy size={18} />}
                            {copied ? 'কপি হ’ল' : 'কপি কৰক'}
                        </button>
                        <button
                            onClick={downloadImage} disabled={loading}
                            className="btn-primary"
                            style={{ flex: 2, justifyContent: 'center', height: 50, borderRadius: 16, fontWeight: 700 }}
                        >
                            {loading ? <span className="spin">⌛</span> : <Image size={20} />}
                            {loading ? 'ৰন্ধন চলি আছে...' : 'Image ডাউনল’ড কৰক'}
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
