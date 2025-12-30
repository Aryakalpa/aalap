import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Save, Loader2, Eraser, AlignLeft, Clock, Cloud } from 'lucide-react';
import { useStore } from '../data/store';
import { supabase } from '../data/supabaseClient';
import { useHaptic } from '../hooks/useHaptic';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function Studio() {
  const { user, setView, viewData } = useStore();
  const haptic = useHaptic();
  
  const [title, setTitle] = useState(viewData?.title || localStorage.getItem('aalap-draft-title') || '');
  const [body, setBody] = useState(viewData?.body || localStorage.getItem('aalap-draft-body') || '');
  const [category, setCategory] = useState(viewData?.category || 'story');
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle');
  
  const wordCount = body.trim().split(/\s+/).filter(w => w.length > 0).length;
  const readTime = Math.ceil(wordCount / 200);
  
  const textareaRef = useRef(null);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [body]);

  useEffect(() => {
    if (!viewData) {
        if (title || body) setSaveStatus('saving');
        const timer = setTimeout(() => {
            localStorage.setItem('aalap-draft-title', title);
            localStorage.setItem('aalap-draft-body', body);
            if (title || body) setSaveStatus('saved'); else setSaveStatus('idle');
        }, 1500);
        return () => clearTimeout(timer);
    }
  }, [title, body, viewData]);

  const handlePublish = async () => {
    if (!title.trim() || !body.trim()) return toast.error("খালি কাগজত কি প্ৰকাশ কৰিব?");
    setLoading(true);
    haptic.impactLight();
    
    try {
      const payload = { author_id: user.id, title, body, category, updated_at: new Date() };
      const { error } = viewData ? await supabase.from('posts').update(payload).eq('id', viewData.id) : await supabase.from('posts').insert([payload]);
      if (error) throw error;
      haptic.success();
      toast.success(viewData ? 'সংশোধন কৰা হ\'ল' : 'প্ৰকাশ কৰা হ\'ল');
      localStorage.removeItem('aalap-draft-title');
      localStorage.removeItem('aalap-draft-body');
      setView('main');
    } catch (e) { toast.error(e.message); haptic.error(); } 
    finally { setLoading(false); }
  };

  const clearDraft = () => {
      if(confirm('লিখাখিনি মচি পেলাব নেকি?')) { 
          setTitle(''); setBody('');
          localStorage.removeItem('aalap-draft-title');
          localStorage.removeItem('aalap-draft-body');
          setSaveStatus('idle');
          haptic.impactHeavy();
      }
  };

  const categories = [ { id: 'story', label: 'গল্প' }, { id: 'poem', label: 'কবিতা' }, { id: 'article', label: 'প্ৰবন্ধ' }, { id: 'thoughts', label: 'অনুভৱ' } ];

  return (
    <div className="main-content" style={{ maxWidth: '800px', margin: '0 auto', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 10, padding: '10px 0' }}>
        <button onClick={() => setView('main')} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '50%', width: '40px', height: '40px', display: 'grid', placeItems: 'center', cursor: 'pointer', color: 'var(--text-sec)' }}><ArrowLeft size={20} /></button>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <AnimatePresence>
                {!viewData && saveStatus !== 'idle' && (
                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-sec)', fontFamily: 'var(--font-serif)', marginRight: '5px' }}>
                        {saveStatus === 'saving' ? <Loader2 size={10} className="spin" /> : <Cloud size={10} />}
                        <span className="mobile-hide">{saveStatus === 'saving' ? 'সংৰক্ষণ...' : 'সংৰক্ষিত'}</span>
                    </motion.div>
                )}
            </AnimatePresence>
            {!viewData && (title || body) && <button onClick={clearDraft} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-sec)', padding: '8px' }}><Eraser size={20} /></button>}
            <button onClick={handlePublish} disabled={loading} style={{ background: 'var(--accent)', color: 'var(--bg)', border: 'none', padding: '10px 20px', borderRadius: '30px', fontWeight: 600, cursor: 'pointer', display: 'flex', gap: '6px', alignItems: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                {loading ? <Loader2 size={18} className="spin" /> : <Save size={18} />} 
                <span style={{ fontFamily: 'var(--font-serif)' }}>{viewData ? 'আপডেট' : 'প্ৰকাশ'}</span>
            </button>
        </div>
      </div>

      {/* CATEGORIES */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '30px', overflowX: 'auto', paddingBottom: '5px' }}>
        {categories.map(cat => (
            <button key={cat.id} onClick={() => setCategory(cat.id)} className="haptic-btn"
                style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid var(--border)', cursor: 'pointer', background: category === cat.id ? 'var(--text)' : 'transparent', color: category === cat.id ? 'var(--bg)' : 'var(--text-sec)', fontFamily: 'var(--font-serif)', fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                {cat.label}
            </button>
        ))}
      </div>

      {/* CANVAS (Fluid Typography: clamp(min, preferred, max)) */}
      <input 
        className="studio-input" 
        placeholder="শিৰোনাম..." 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        style={{ 
            fontSize: 'clamp(28px, 5vw, 42px)', // Resizes automatically
            fontWeight: 900, marginBottom: '20px', lineHeight: '1.3' 
        }} 
      />
      
      <textarea
        ref={textareaRef}
        className="studio-input" 
        placeholder="আপোনাৰ মনৰ কথা লিখক..." 
        value={body} 
        onChange={(e) => setBody(e.target.value)} 
        style={{ 
            fontSize: 'clamp(17px, 2vw, 21px)', // Resizes automatically
            lineHeight: '1.8', minHeight: '50vh' 
        }} 
      />

      {/* FOOTER STATS */}
      <div style={{ marginTop: 'auto', paddingTop: '40px', paddingBottom: '20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', color: 'var(--text-sec)', fontSize: '12px', fontFamily: 'var(--font-serif)' }}>
        <div style={{ display: 'flex', gap: '15px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><AlignLeft size={12} /> {wordCount} শব্দ</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {readTime} মি.</span>
        </div>
      </div>
    </div>
  );
}