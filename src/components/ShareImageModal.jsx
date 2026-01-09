import { useRef, useState } from 'react';
import * as htmlToImage from 'html-to-image';
import download from 'downloadjs';
import { X, Check, Image, Type, Palette } from 'lucide-react';
import Avatar from './Avatar';

export default function ShareImageModal({ post, user, close }) {
    const ref = useRef(null);
    const [loading, setLoading] = useState(false);
    const [theme, setTheme] = useState('paper');
    const [font, setFont] = useState('serif');

    const themes = {
        paper: { bg: '#fdfbf7', text: '#2d2d2d', border: '#e6ded3' },
        night: { bg: '#1a1a1a', text: '#e0e0e0', border: '#333' },
        sunset: { bg: 'linear-gradient(135deg, #FFEFBA 0%, #FFFFFF 100%)', text: '#4a3b32', border: '#fff' },
        midnight: { bg: 'linear-gradient(to top, #09203f 0%, #537895 100%)', text: '#fff', border: 'transparent' }
    };

    const fonts = {
        serif: "'Noto Serif Bengali', serif",
        galada: "'Galada', cursive",
        tiro: "'Tiro Bangla', serif",
        rajon: "'Rajon Shoily', sans-serif"
    };

    const downloadImage = async () => {
        if (!ref.current) return;
        setLoading(true);
        try {
            const dataUrl = await htmlToImage.toPng(ref.current, { quality: 0.95, pixelRatio: 2 });
            download(dataUrl, `aalap-share-${post.id}.png`);
            close();
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    if (!post) return null;

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 20 }}>
            <div style={{ background: 'var(--bg-card)', width: '100%', maxWidth: 500, borderRadius: 20, overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>

                <div style={{ padding: 15, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)' }}>
                    <h3 style={{ margin: 0, fontSize: 16 }}>সুন্দৰ হস্তলিপি (Share as Image)</h3>
                    <button onClick={close} className="btn-icon"><X size={20} /></button>
                </div>

                {/* PREVIEW */}
                <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', justifyContent: 'center', background: '#111' }}>
                    <div ref={ref} style={{
                        width: '100%', maxWidth: 400, padding: 40, borderRadius: 4,
                        background: themes[theme].bg,
                        border: `1px solid ${themes[theme].border}`,
                        color: themes[theme].text,
                        fontFamily: fonts[font],
                        display: 'flex', flexDirection: 'column', gap: 20
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: 0.7 }}>
                            <Avatar url={user?.avatar_url} size={30} />
                            <span style={{ fontSize: 14, fontFamily: 'var(--font-sans)', fontWeight: 600 }}>{user?.display_name}</span>
                        </div>

                        <h2 style={{ margin: 0, lineHeight: 1.3, fontSize: 28, fontWeight: 700 }}>{post.title}</h2>

                        <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, fontSize: 18 }}>
                            {post.body}
                        </div>

                        <div style={{ marginTop: 'auto', paddingTop: 30, borderTop: `1px dashed ${themes[theme].text}`, opacity: 0.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, fontFamily: 'var(--font-sans)' }}>
                            <span>aalap.app</span>
                            <span>আলাপ</span>
                        </div>
                    </div>
                </div>

                {/* CONTROLS */}
                <div style={{ padding: 20, borderTop: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', gap: 10, marginBottom: 20, overflowX: 'auto', paddingBottom: 5 }}>
                        {Object.keys(themes).map(k => (
                            <button key={k} onClick={() => setTheme(k)} style={{
                                width: 30, height: 30, borderRadius: '50%', border: theme === k ? '2px solid var(--text-main)' : '1px solid #ccc',
                                background: themes[k].bg
                            }} />
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                        <button onClick={() => setFont('serif')} className={`btn-soft ${font === 'serif' ? 'active' : ''}`}>সাধাৰণ</button>
                        <button onClick={() => setFont('tiro')} className={`btn-soft ${font === 'tiro' ? 'active' : ''}`} style={{ fontFamily: "'Tiro Bangla', serif" }}>টাইৰ’</button>
                        <button onClick={() => setFont('rajon')} className={`btn-soft ${font === 'rajon' ? 'active' : ''}`} style={{ fontFamily: "'Rajon Shoily', sans-serif" }}>ৰাজন</button>
                        <button onClick={() => setFont('galada')} className={`btn-soft ${font === 'galada' ? 'active' : ''}`} style={{ fontFamily: "'Galada', cursive" }}>নন্দন</button>
                    </div>
                    <button
                        onClick={downloadImage} disabled={loading}
                        className="btn-primary"
                        style={{ width: '100%', justifyContent: 'center', height: 48, fontSize: 16 }}
                    >
                        {loading ? 'Processing...' : 'Download Image'}
                    </button>
                </div>
            </div>
        </div>
    );
}
