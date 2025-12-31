import { ArrowLeft, Heart, Share2, Type } from 'lucide-react';
import { useStore } from '../data/store';
import { useHaptic } from '../hooks/useHaptic';
import Avatar from '../components/Avatar';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Reader({ post }) {
  const { setView } = useStore();
  const haptic = useHaptic();

  if (!post) return null;
  const author = post.profiles || {};

  const handleShare = async () => {
    haptic.tap();
    const shareData = {
        title: `Aalap: ${post.title}`,
        text: `Read "${post.title}" by ${author.display_name} on Aalap.\n\n`,
        url: window.location.href 
    };
    try {
        if (navigator.share) await navigator.share(shareData);
        else {
            await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
            toast.success('লিংক কপি কৰা হ\'ল');
        }
    } catch (err) { console.error(err); }
  };

  const handleLike = () => {
    haptic.impactMedium();
    toast.success('আপুনি ভাল পালে!', { icon: '❤️' });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: '100px', userSelect: 'none' }}>
      
      {/* HEADER - High Z-Index, Explicit Pointer Events */}
      <div style={{ 
        position: 'sticky', top: 0, zIndex: 999, 
        padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'var(--glass)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)',
        pointerEvents: 'auto' 
      }}>
        <button onClick={() => setView('main')} className="haptic-btn" style={{ background: 'none', border: 'none', color: 'var(--text)', padding: '10px' }}>
          <ArrowLeft size={24} />
        </button>
        <div style={{ display: 'flex', gap: '15px' }}>
            <button className="haptic-btn" style={{ background: 'none', border: 'none', color: 'var(--text)', padding: '10px' }}><Type size={20} /></button>
            <button onClick={handleShare} className="haptic-btn" style={{ background: 'none', border: 'none', color: 'var(--text)', padding: '10px' }}><Share2 size={20} /></button>
        </div>
      </div>

      {/* CONTENT */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ maxWidth: '680px', margin: '0 auto', padding: '30px 20px' }}
      >
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', fontWeight: 900, lineHeight: '1.2', marginBottom: '20px', color: 'var(--text)' }}>
          {post.title}
        </h1>

        <div onClick={() => setView('author', post.author_id)} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px', cursor: 'pointer' }}>
            <Avatar url={author.avatar_url} size={40} />
            <div>
                <div style={{ fontSize: '15px', fontWeight: 700 }}>{author.display_name || 'নামবিহীন'}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-sec)' }}>{new Date(post.created_at).toLocaleDateString()}</div>
            </div>
        </div>

        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '19px', lineHeight: '1.8', color: 'var(--text)', whiteSpace: 'pre-wrap' }}>
            {post.body}
        </div>

        {/* BOTTOM LIKE BUTTON */}
        <div style={{ marginTop: '50px', paddingTop: '30px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
            <button 
                onClick={handleLike} 
                className="haptic-btn" 
                style={{ 
                    background: 'var(--surface-2)', border: 'none', padding: '12px 24px', borderRadius: '30px', 
                    display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 600, color: 'var(--text)',
                    pointerEvents: 'auto', cursor: 'pointer' 
                }}>
                <Heart size={20} /> ভাল লাগিল
            </button>
        </div>
      </motion.div>
    </div>
  );
}