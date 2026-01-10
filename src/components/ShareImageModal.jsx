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
    const [font, setFont] = useState('hind'); // Default to Hind Siliguri (more stable)
    const [aspect, setAspect] = useState('story');
    const [content, setContent] = useState(post?.body || '');
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
        console.log("Starting download process...");
        try {
            // Wait for fonts with a timeout
            const fontTimeout = new Promise(resolve => setTimeout(resolve, 1500));
            await Promise.race([document.fonts.ready, fontTimeout]);
            console.log("Fonts ready or timeout reached");

            const options = {
                quality: 0.95,
                pixelRatio: 2,
                cacheBust: true,
                useCORS: true,
                backgroundColor: '#000', // Provide base color
                style: { borderRadius: '0' }
            };

            console.log("Capturing image with options:", options);
            const dataUrl = await htmlToImage.toPng(ref.current, options);

            if (!dataUrl || dataUrl === 'data:,') {
                throw new Error("Invalid image data generated");
            }

            console.log("Image captured, triggering download");
            download(dataUrl, `aalap-share-${post.id}.png`);
            toast.success('ডাউনল’ড সমাপ্ত');
        } catch (err) {
            console.error("Download Error:", err);
            toast.error('ডাউনল’ড বিফল হ’ল। অনুগ্ৰহ কৰি স্ক্ৰীনশ্বট লওক।');
            // Log specific error info for debugging if user reports again
            if (err.message) console.error("Error Message:", err.message);
        }
        setLoading(false);
    };

    const copyToClipboard = async () => {
        if (!ref.current) return;
        setLoading(true);
        try {
            const blob = await htmlToImage.toBlob(ref.current, { cacheBust: true, useCORS: true, pixelRatio: 2 });
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
            console.error("Clipboard Error:", err);
            toast.error('কপি কৰাত অসুবিধা হৈছে');
        }
        setLoading(false);
    };

    useEffect(() => {
        const handleEsc = (e) => { if (e.key === 'Escape') close(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [close]);

    if (!post) return null;

    return (
        <div
            onClick={close}
            style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', backdropFilter: 'blur(10px)' }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{ background: 'var(--bg-card)', width: '100%', maxWidth: 500, borderRadius: 24, overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '98vh', boxShadow: '0 20px 60px rgba(0,0,0,0.6)', position: 'relative' }}
            >
                {/* HEADER */}
                <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, background: 'var(--primary-soft)', color: 'var(--primary)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Image size={18} />
                        </div>
                        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Share as Image</h3>
                    </div>
                    <button onClick={close} className="btn-icon" style={{ background: 'var(--btn-soft)', borderRadius: '50%' }}><X size={20} /></button>
                </div>

                {/* SCROLLABLE AREA */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#0a0a0a', gap: 20 }}>

                    <div style={{ display: 'flex', gap: 8, background: 'rgba(255,255,255,0.05)', padding: 4, borderRadius: 12 }}>
                        {['square', 'story'].map(a => (
                            <button key={a} onClick={() => setAspect(a)} style={{
                                padding: '6px 18px', borderRadius: 8, fontSize: 12, border: 'none',
                                background: aspect === a ? '#fff' : 'transparent',
                                color: aspect === a ? '#000' : '#fff', cursor: 'pointer', transition: '0.2s',
                                fontWeight: 700, textTransform: 'capitalize'
                            }}>{a}</button>
                        ))}
                    </div>

                    {/* CAPTURE CONTENT */}
                    <div ref={ref} style={{
                        width: '100%',
                        maxWidth: aspect === 'square' ? 380 : 320,
                        aspectRatio: aspect === 'square' ? '1/1' : '9/16',
                        padding: aspect === 'square' ? 30 : 40,
                        background: themes[theme].bg,
                        color: themes[theme].text,
                        fontFamily: fonts[font],
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        boxShadow: '0 15px 45px rgba(0,0,0,0.5)',
                        flexShrink: 0
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                            <Avatar url={user?.avatar_url} size={38} />
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: 14, fontFamily: 'Inter', fontWeight: 700 }}>{user?.display_name || 'Alap User'}</span>
                                <span style={{ fontSize: 11, opacity: 0.6, fontFamily: 'Inter' }}>aalap.app</span>
                            </div>
                        </div>

                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <h2 style={{
                                margin: '0 0 12px',
                                lineHeight: 1.25,
                                fontSize: aspect === 'square' ? 26 : 32,
                                fontWeight: 800,
                                color: themes[theme].accent
                            }}>{post.title}</h2>

                            <div style={{
                                whiteSpace: 'pre-wrap',
                                lineHeight: 1.65,
                                fontSize: aspect === 'square' ? 16 : 19,
                                opacity: 0.95
                            }}>
                                {content}
                            </div>
                        </div>

                        <div style={{ marginTop: 25, paddingTop: 18, borderTop: `1px solid rgba(255,255,255,0.12)`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <div style={{ width: 24, height: 24, background: '#fff', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 900, fontSize: 13 }}>আ</div>
                                <span style={{ fontSize: 15, fontWeight: 800, fontFamily: 'Galada' }}>আলাপ</span>
                            </div>
                            <div style={{ opacity: 0.5, fontSize: 11, fontFamily: 'Inter' }}>Download on Play Store</div>
                        </div>
                    </div>

                    {/* SURGICAL EDITOR */}
                    <div style={{ width: '100%', maxWidth: 400 }}>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Type size={14} /> Edit specific lines to share
                        </div>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            style={{
                                width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 16, padding: 15, color: '#fff', fontSize: 15, minHeight: 120,
                                resize: 'none', outline: 'none', lineHeight: 1.5
                            }}
                        />
                    </div>
                </div>

                {/* CONTROLS */}
                <div style={{ padding: '24px', borderTop: '1px solid var(--border-light)', background: 'var(--bg-card)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
                        <div style={{ display: 'flex', gap: 10 }}>
                            {Object.keys(themes).map(k => (
                                <button key={k} onClick={() => setTheme(k)} style={{
                                    width: 26, height: 26, borderRadius: '50%', border: theme === k ? '2px solid var(--text-main)' : '2px solid transparent',
                                    background: themes[k].bg, cursor: 'pointer', transition: '0.2s', padding: 0
                                }} />
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: 5 }}>
                            {['hind', 'serif', 'galada'].map(f => (
                                <button key={f} onClick={() => setFont(f)} style={{
                                    padding: '5px 12px', borderRadius: 10, fontSize: 11, border: 'none',
                                    background: font === f ? 'var(--text-main)' : 'var(--btn-soft)',
                                    color: font === f ? 'var(--bg-card)' : 'var(--text-main)',
                                    cursor: 'pointer', fontWeight: 700, textTransform: 'uppercase'
                                }}>{f}</button>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 12 }}>
                        <button
                            disabled={loading} onClick={copyToClipboard}
                            className="btn-soft" style={{ flex: 1, height: 54, borderRadius: 18, justifyContent: 'center' }}
                        >
                            {copied ? <Check size={20} color="var(--success)" /> : <Copy size={20} />}
                            <span style={{ marginLeft: 8 }}>{copied ? 'কপি হ’ল' : 'কপি কৰক'}</span>
                        </button>
                        <button
                            onClick={downloadImage} disabled={loading}
                            className="btn-primary"
                            style={{ flex: 2, justifyContent: 'center', height: 54, borderRadius: 18, fontWeight: 800, gap: 10 }}
                        >
                            {loading ? <span className="spin">⌛</span> : <Image size={22} />}
                            {loading ? 'ৰন্ধন চলি আছে...' : 'ডাউনল’ড কৰক'}
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                .spin { animation: spin 0.8s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
