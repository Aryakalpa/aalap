import { useRef, useState } from 'react';
import * as htmlToImage from 'html-to-image';
import download from 'downloadjs';
import { X, Check, Image, Type, Palette, Minimize2, Maximize2 } from 'lucide-react';
import Avatar from './Avatar';

export default function ShareImageModal({ post, user, close }) {
    const ref = useRef(null);
    const [loading, setLoading] = useState(false);
    const [theme, setTheme] = useState('midnight');
    const [font, setFont] = useState('hind');
    const [aspect, setAspect] = useState('story'); // 'square' or 'story'

    const themes = {
        midnight: { bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', text: '#f8fafc', border: '#334155', accent: '#38bdf8' },
        sunset: { bg: 'linear-gradient(135deg, #4c1d95 0%, #db2777 100%)', text: '#fff', border: 'transparent', accent: '#f472b6' },
        paper: { bg: '#fdfbf7', text: '#2d2d2d', border: '#e6ded3', accent: '#8b5e34' },
        night: { bg: '#121212', text: '#e0e0e0', border: '#282828', accent: '#1db954' }
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
            const dataUrl = await htmlToImage.toPng(ref.current, {
                quality: 1,
                pixelRatio: 3,
                style: { borderRadius: '0' } // Ensure clean edges for download
            });
            download(dataUrl, `aalap-share-${post.id}.png`);
            close();
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    if (!post) return null;

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(10px)' }}>
            <div style={{ background: 'var(--bg-card)', width: '100%', maxWidth: 500, borderRadius: 24, overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '95vh', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>

                <div style={{ padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)' }}>
                    <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>সুন্দৰ হস্তলিপি (Spotify Style)</h3>
                    <button onClick={close} className="btn-icon" style={{ opacity: 0.6 }}><X size={22} /></button>
                </div>

                {/* PREVIEW CONTAINER */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '30px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#000', gap: 20 }}>

                    {/* ASPECT RATIO TOGGLE */}
                    <div style={{ display: 'flex', gap: 8, background: 'rgba(255,255,255,0.1)', padding: 4, borderRadius: 12 }}>
                        <button onClick={() => setAspect('square')} style={{ padding: '6px 12px', borderRadius: 8, fontSize: 12, border: 'none', background: aspect === 'square' ? '#fff' : 'transparent', color: aspect === 'square' ? '#000' : '#fff', cursor: 'pointer', transition: '0.2s' }}>Square</button>
                        <button onClick={() => setAspect('story')} style={{ padding: '6px 12px', borderRadius: 8, fontSize: 12, border: 'none', background: aspect === 'story' ? '#fff' : 'transparent', color: aspect === 'story' ? '#000' : '#fff', cursor: 'pointer', transition: '0.2s' }}>Story</button>
                    </div>

                    <div ref={ref} style={{
                        width: '100%',
                        maxWidth: aspect === 'square' ? 400 : 340,
                        aspectRatio: aspect === 'square' ? '1/1' : '9/16',
                        padding: aspect === 'square' ? 30 : 40,
                        borderRadius: aspect === 'square' ? 12 : 0, // Story often looks better without radius to the card itself if it fills
                        background: themes[theme].bg,
                        color: themes[theme].text,
                        fontFamily: fonts[font],
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                    }}>
                        {/* HEADER - BRANDING */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 25 }}>
                            <Avatar url={user?.avatar_url} size={36} />
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: 14, fontFamily: 'Inter', fontWeight: 700, letterSpacing: -0.2 }}>{user?.display_name}</span>
                                <span style={{ fontSize: 11, opacity: 0.6, fontFamily: 'Inter' }}>aalap.app</span>
                            </div>
                        </div>

                        {/* CONTENT */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <h2 style={{
                                margin: '0 0 15px',
                                lineHeight: 1.2,
                                fontSize: aspect === 'square' ? 28 : 36,
                                fontWeight: 800,
                                letterSpacing: '-0.02em',
                                color: themes[theme].accent
                            }}>{post.title}</h2>

                            <div style={{
                                whiteSpace: 'pre-wrap',
                                lineHeight: 1.6,
                                fontSize: aspect === 'square' ? 16 : 19,
                                opacity: 0.95,
                                display: '-webkit-box',
                                WebkitLineClamp: aspect === 'square' ? 8 : 12,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                            }}>
                                {post.body}
                            </div>
                        </div>

                        {/* FOOTER - VIRALITY */}
                        <div style={{
                            marginTop: 30,
                            paddingTop: 20,
                            borderTop: `1px solid rgba(255,255,255,0.1)`,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 24, height: 24, background: '#fff', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 900, fontSize: 14 }}>আ</div>
                                <span style={{ fontSize: 16, fontWeight: 800, fontFamily: 'Galada' }}>আলাপ</span>
                            </div>
                            <div style={{ opacity: 0.6, fontSize: 11, fontFamily: 'Inter', textTransform: 'uppercase', letterSpacing: 1 }}>Read more on Aalap</div>
                        </div>
                    </div>
                </div>

                {/* CONTROLS */}
                <div style={{ padding: 24, borderTop: '1px solid var(--border-light)', background: 'var(--bg-card)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, opacity: 0.7 }}>Theme & Style</span>
                        <div style={{ display: 'flex', gap: 10 }}>
                            {Object.keys(themes).map(k => (
                                <button key={k} onClick={() => setTheme(k)} style={{
                                    width: 28, height: 28, borderRadius: '50%', border: theme === k ? '2px solid var(--text-main)' : '2px solid transparent',
                                    background: themes[k].bg, cursor: 'pointer', outline: 'none'
                                }} />
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto', paddingBottom: 4 }}>
                        <button onClick={() => setFont('hind')} className={`btn-soft ${font === 'hind' ? 'active' : ''}`} style={{ flexShrink: 0, padding: '8px 16px', borderRadius: 12, border: font === 'hind' ? '1px solid var(--text-main)' : '1px solid transparent' }}>আধুনিক</button>
                        <button onClick={() => setFont('serif')} className={`btn-soft ${font === 'serif' ? 'active' : ''}`} style={{ flexShrink: 0, padding: '8px 16px', borderRadius: 12 }}>সাধাৰণ</button>
                        <button onClick={() => setFont('tiro')} className={`btn-soft ${font === 'tiro' ? 'active' : ''}`} style={{ flexShrink: 0, padding: '8px 16px', borderRadius: 12 }}>টাইৰ’</button>
                        <button onClick={() => setFont('galada')} className={`btn-soft ${font === 'galada' ? 'active' : ''}`} style={{ flexShrink: 0, padding: '8px 16px', borderRadius: 12 }}>নন্দন</button>
                    </div>

                    <button
                        onClick={downloadImage} disabled={loading}
                        className="btn-primary"
                        style={{ width: '100%', justifyContent: 'center', height: 54, fontSize: 16, borderRadius: 16, fontWeight: 700, gap: 10 }}
                    >
                        {loading ? <span className="spin">⌛</span> : <Image size={20} />}
                        {loading ? 'ৰন্ধন চলি আছে...' : 'Image ডাউনল’ড কৰক'}
                    </button>
                </div>
            </div>

            <style>{`
                .active { background: var(--text-main) !important; color: var(--bg-body) !important; }
                .spin { animation: spin 1s linear infinite; }
            `}</style>
        </div>
    );
}
