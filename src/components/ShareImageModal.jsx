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
    const [content, setContent] = useState(post?.body || '');
    const [copied, setCopied] = useState(false);

    // STABLE SOLID THEMES - PREVENT CAPTURE FAILURES
    const themes = {
        midnight: { bg: '#0f172a', text: '#f8fafc', accent: '#38bdf8' },
        slate: { bg: '#334155', text: '#f1f5f9', accent: '#94a3b8' },
        charcoal: { bg: '#171717', text: '#e5e5e5', accent: '#22c55e' },
        rose: { bg: '#4c0519', text: '#fff1f2', accent: '#fb7185' },
        paper: { bg: '#fdfbf7', text: '#2d2e2e', accent: '#8b5e34' },
        ocean: { bg: '#0c4a6e', text: '#f0f9ff', accent: '#38bdf8' }
    };

    const fonts = {
        hind: "'Hind Siliguri', sans-serif",
        serif: "'Noto Serif Bengali', serif",
        tiro: "'Tiro Bangla', serif"
    };

    const downloadImage = async () => {
        if (!ref.current || loading) return;
        setLoading(true);
        const toastId = toast.loading('Image তৈয়াৰী হৈছে...');

        try {
            console.log("V4: Starting capture...");
            const dataUrl = await htmlToImage.toPng(ref.current, {
                quality: 0.8, // Slightly lower for faster mobile processing
                pixelRatio: 2,
                cacheBust: true,
                useCORS: true,
                backgroundColor: themes[theme].bg
            });

            if (!dataUrl || dataUrl.length < 100) throw new Error("Capture failed");

            console.log("V4: Capture success, triggering download");
            download(dataUrl, `alap-${post.id}.png`);
            toast.success('ডাউনল’ড সমাপ্ত', { id: toastId });
        } catch (err) {
            console.error("V4 Error:", err);
            toast.error('ফলস্বৰূপ ডাউনলোড বিফল হ’ল। স্ক্ৰীনশ্বট লওক।', { id: toastId });
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
                toast.success('কপি হ’ল');
                setTimeout(() => setCopied(false), 2000);
            }
        } catch (err) {
            console.error("V4 Clipboard Fail:", err);
            toast.error('কপি কৰিব নোৱাৰি');
        }
        setLoading(false);
    };

    if (!post) return null;

    return (
        <div
            style={{
                position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.95)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '10px', backdropFilter: 'blur(10px)', touchAction: 'none'
            }}
            onClick={close}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: 'var(--bg-card)', width: '100%', maxWidth: 480, borderRadius: 24,
                    overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '96vh',
                    boxShadow: '0 0 100px rgba(0,0,0,0.5)', position: 'relative'
                }}
            >
                {/* TOP BAR */}
                <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, background: 'var(--btn-soft)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Image size={20} />
                        </div>
                        <span style={{ fontWeight: 800, fontSize: 16 }}>Share Preview</span>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); close(); }}
                        style={{ border: 'none', background: 'var(--btn-soft)', color: 'var(--text-main)', padding: 8, borderRadius: '50%', cursor: 'pointer', display: 'flex' }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* CONTENT AREA */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>

                    {/* ASPECT TOGGLES */}
                    <div style={{ display: 'flex', gap: 5, background: 'rgba(0,0,0,0.3)', padding: 4, borderRadius: 14 }}>
                        {['square', 'story'].map(a => (
                            <button key={a} onClick={() => setAspect(a)} style={{
                                padding: '8px 24px', borderRadius: 10, fontSize: 12, border: 'none',
                                background: aspect === a ? '#fff' : 'transparent',
                                color: aspect === a ? '#000' : '#fff', cursor: 'pointer', transition: '0.2s',
                                fontWeight: 800, textTransform: 'uppercase'
                            }}>{a}</button>
                        ))}
                    </div>

                    {/* PREVIEW CONTAINER */}
                    <div
                        ref={ref}
                        style={{
                            width: '100%',
                            maxWidth: aspect === 'square' ? 380 : 310,
                            aspectRatio: aspect === 'square' ? '1/1' : '9/16',
                            padding: aspect === 'square' ? 30 : 40,
                            background: themes[theme].bg,
                            color: themes[theme].text,
                            fontFamily: fonts[font],
                            display: 'flex', flexDirection: 'column', position: 'relative',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.3)', flexShrink: 0
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                            <Avatar url={user?.avatar_url} size={38} />
                            <div>
                                <div style={{ fontSize: 14, fontWeight: 800, fontFamily: 'Inter' }}>{user?.display_name || 'Alap Writer'}</div>
                                <div style={{ fontSize: 11, opacity: 0.5, fontFamily: 'Inter' }}>aalap.app</div>
                            </div>
                        </div>

                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <h2 style={{ color: themes[theme].accent, margin: '0 0 10px', fontSize: aspect === 'square' ? 24 : 32, fontWeight: 900, lineHeight: 1.2 }}>
                                {post.title}
                            </h2>
                            <div style={{ fontSize: aspect === 'square' ? 16 : 19, lineHeight: 1.6, opacity: 0.9, whiteSpace: 'pre-wrap' }}>
                                {content}
                            </div>
                        </div>

                        <div style={{ marginTop: 20, paddingTop: 15, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <div style={{ background: '#fff', color: '#000', padding: '2px 6px', borderRadius: 4, fontWeight: 900 }}>আ</div>
                                <span style={{ fontWeight: 900, fontSize: 16 }}>আলাপ</span>
                            </div>
                            <div style={{ fontSize: 10, opacity: 0.4, fontFamily: 'Inter' }}>Download on Play Store</div>
                        </div>
                    </div>

                    {/* INTERNAL EDITOR */}
                    <div style={{ width: '100%', maxWidth: 400 }}>
                        <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Type size={14} /> Edit lines before sharing
                        </div>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            style={{
                                width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 16, padding: 15, color: '#fff', fontSize: 14, minHeight: 100,
                                resize: 'none', outline: 'none'
                            }}
                        />
                    </div>
                </div>

                {/* CONTROLS */}
                <div style={{ padding: '24px', borderTop: '1px solid var(--border-light)', background: 'var(--bg-card)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <div style={{ display: 'flex', gap: 10 }}>
                            {Object.keys(themes).map(t => (
                                <button
                                    key={t} onClick={() => setTheme(t)}
                                    style={{
                                        width: 28, height: 28, borderRadius: '50%', background: themes[t].bg,
                                        border: theme === t ? '2px solid #fff' : '2px solid transparent', cursor: 'pointer'
                                    }}
                                />
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: 6 }}>
                            {Object.keys(fonts).map(f => (
                                <button
                                    key={f} onClick={() => setFont(f)}
                                    style={{
                                        border: 'none', background: font === f ? '#fff' : 'rgba(255,255,255,0.05)',
                                        color: font === f ? '#000' : '#fff', padding: '6px 12px', borderRadius: 8,
                                        fontSize: 10, fontWeight: 900, cursor: 'pointer', textTransform: 'uppercase'
                                    }}
                                >{f}</button>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 10 }}>
                        <button
                            disabled={loading} onClick={copyToClipboard}
                            style={{ flex: 1, padding: '16px', borderRadius: 16, border: '1px solid var(--border-light)', background: 'var(--btn-soft)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 700, cursor: 'pointer' }}
                        >
                            {copied ? <Check size={18} /> : <Copy size={18} />}
                            {copied ? 'কপি হ’ল' : 'Copy'}
                        </button>
                        <button
                            disabled={loading} onClick={downloadImage}
                            style={{ flex: 2, padding: '16px', borderRadius: 16, border: 'none', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 900, cursor: 'pointer' }}
                        >
                            {loading ? <span className="loader" /> : <Image size={20} />}
                            {loading ? 'Preparing...' : 'ডাউনল’ড কৰক'}
                        </button>
                    </div>
                </div>
            </div>

            <style>{`.loader { width: 20px; height: 20px; border: 3px solid #fff; border-bottom-color: transparent; border-radius: 50%; display: inline-block; animation: rotation 1s linear infinite; } @keyframes rotation { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
