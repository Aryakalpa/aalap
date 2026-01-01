import { useEffect } from 'react';
import { useStore } from '../data/store';
import { X, Link, MessageCircle, Twitter, Send } from 'lucide-react'; // Using icons for buttons
import toast from 'react-hot-toast';

export default function ShareSheet() {
  const { shareTarget, setShareTarget } = useStore();

  if (!shareTarget) return null;

  const post = shareTarget;
  const author = post.profiles?.display_name || 'Anonymous';
  const url = `${window.location.origin}/?post=${post.id}`;
  const text = `✨ আলাপত পঢ়ক: "${post.title}"\nRead on Aalap:\n`;
  const fullText = `${text}${url}`;

  // WHATSAPP URL
  const waLink = `https://wa.me/?text=${encodeURIComponent(fullText)}`;
  // TWITTER URL
  const twLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  // TELEGRAM URL
  const tgLink = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;

  const copyLink = () => {
    navigator.clipboard.writeText(fullText);
    toast.success('লিংক কপি হ’ল (Copied)');
    setShareTarget(null);
  };

  const handleNativeShare = async () => {
      if (navigator.share) {
          try {
              await navigator.share({ title: post.title, text: text, url: url });
              setShareTarget(null);
          } catch (e) {
              console.log('Native share closed');
          }
      } else {
          toast.error('Native sharing not supported');
      }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 3000, display: 'flex', alignItems: 'flex-end', background: 'rgba(0,0,0,0.6)' }} onClick={() => setShareTarget(null)}>
      <div 
        onClick={e => e.stopPropagation()} 
        style={{ width: '100%', background: 'var(--bg-card)', padding: '25px 20px 40px', borderTopLeftRadius: 24, borderTopRightRadius: 24, borderTop: '1px solid var(--border-light)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: 16 }}>Share via</h3>
            <button onClick={() => setShareTarget(null)} className="btn-icon"><X size={20}/></button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 15 }}>
            {/* WhatsApp */}
            <a href={waLink} target="_blank" rel="noreferrer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'inherit' }}>
                <div style={{ width: 50, height: 50, background: '#25D366', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <MessageCircle size={24} />
                </div>
                <span style={{ fontSize: 12 }}>WhatsApp</span>
            </a>

            {/* Telegram/Msg */}
            <a href={tgLink} target="_blank" rel="noreferrer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'inherit' }}>
                <div style={{ width: 50, height: 50, background: '#0088cc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <Send size={22} />
                </div>
                <span style={{ fontSize: 12 }}>Telegram</span>
            </a>

            {/* Twitter/X */}
            <a href={twLink} target="_blank" rel="noreferrer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'inherit' }}>
                <div style={{ width: 50, height: 50, background: 'var(--text-main)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bg-body)' }}>
                    <Twitter size={22} />
                </div>
                <span style={{ fontSize: 12 }}>X</span>
            </a>

            {/* Copy Link */}
            <button onClick={copyLink} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 50, height: 50, background: 'var(--bg-input)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', border: '1px solid var(--border-light)' }}>
                    <Link size={22} />
                </div>
                <span style={{ fontSize: 12 }}>Copy</span>
            </button>
        </div>

        {/* Native Option (Hidden if not supported, or added as extra) */}
        {navigator.share && (
            <button onClick={handleNativeShare} className="btn-soft" style={{ width: '100%', marginTop: 25, justifyContent: 'center' }}>
                More Options...
            </button>
        )}
      </div>
    </div>
  );
}