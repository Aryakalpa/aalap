import { useState, useEffect } from 'react';
import { X, Save, Trash2 } from 'lucide-react';
import { useStore } from '../data/store';
import { supabase } from '../data/supabaseClient';
import toast from 'react-hot-toast';

export default function Studio() {
  const { user, setTab } = useStore();
  
  // Load draft or default to empty
  const [title, setTitle] = useState(() => localStorage.getItem('draft-title') || '');
  const [body, setBody] = useState(() => localStorage.getItem('draft-body') || '');
  
  const [category, setCategory] = useState('story');
  const [loading, setLoading] = useState(false);
  
  const categories = [
    { id: 'story', label: 'গল্প' },
    { id: 'poem', label: 'কবিতা' },
    { id: 'article', label: 'প্ৰবন্ধ' },
    { id: 'misc', label: 'অন্যান্য' }
  ];

  // METRICS CALCULATION
  const wordCount = body.trim().split(/\s+/).filter(w => w.length > 0).length;
  const readTime = Math.ceil(wordCount / 200); // Approx 200 wpm

  // AUTO-SAVE EFFECT
  useEffect(() => {
    localStorage.setItem('draft-title', title);
    localStorage.setItem('draft-body', body);
  }, [title, body]);

  if (!user) { setTab('profile'); return null; }

  const clearDraft = () => {
    if(!confirm('আপুনি এই খচৰা মচি পেলাব বিচাৰে নেকি? (Delete Draft?)')) return;
    setTitle('');
    setBody('');
    localStorage.removeItem('draft-title');
    localStorage.removeItem('draft-body');
    toast.success('খচৰা মচা হ’ল (Draft Cleared)');
  };

  const handlePost = async () => {
    if (!title.trim() || !body.trim()) return toast.error('শিৰোনাম আৰু মূল কথা লিখিব লাগিব');
    setLoading(true);
    
    const { error } = await supabase.from('posts').insert({ 
        title, 
        body, 
        category, 
        author_id: user.id 
    });

    if (!error) { 
        toast.success('প্ৰকাশ কৰা হ’ল!'); 
        // Clear Draft on Success
        localStorage.removeItem('draft-title');
        localStorage.removeItem('draft-body');
        setTitle('');
        setBody('');
        setTab('home'); 
    } else { 
        toast.error('ভুল হৈছে'); 
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <button onClick={() => setTab('home')} className="btn-icon"><X size={24} /></button>
        <div style={{ display: 'flex', gap: 10 }}>
           {/* Draft Clear Button */}
           {(title || body) && (
             <button onClick={clearDraft} className="btn-icon" style={{ color: 'var(--danger)' }} title="Clear Draft">
                <Trash2 size={20} />
             </button>
           )}
           <button onClick={handlePost} disabled={loading} className="btn-soft" style={{ background: 'var(--text-main)', color: 'var(--bg-body)' }}>
              {loading ? '...' : 'প্ৰকাশ কৰক'}
           </button>
        </div>
      </div>
      
      {/* TITLE INPUT */}
      <input 
        value={title} onChange={e => setTitle(e.target.value)}
        placeholder="শিৰোনাম..." 
        style={{ 
          background: 'transparent', border: 'none', 
          fontSize: 28, fontWeight: 700, color: 'var(--text-main)', 
          width: '100%', marginBottom: 20, outline: 'none', 
          fontFamily: 'var(--font-serif)' 
        }}
      />
      
      {/* TAGS */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, overflowX: 'auto', paddingBottom: 5 }}>
        {categories.map(c => (
            <button 
                key={c.id} onClick={() => setCategory(c.id)}
                style={{ 
                    padding: '6px 16px', borderRadius: 20, 
                    border: '1px solid var(--border-light)', 
                    background: category === c.id ? 'var(--text-main)' : 'transparent', 
                    color: category === c.id ? 'var(--bg-body)' : 'var(--text-muted)',
                    fontSize: 14, fontWeight: 500, whiteSpace: 'nowrap'
                }}
            >
                {c.label}
            </button>
        ))}
      </div>

      {/* MAIN EDITOR (SCROLL FIX APPLIED) */}
      <textarea 
        value={body} onChange={e => setBody(e.target.value)}
        placeholder="আপোনাৰ সৃষ্টি লিখক..." 
        style={{ 
            flex: 1, 
            background: 'transparent', 
            border: 'none', 
            fontSize: 18, 
            lineHeight: 1.8, 
            color: 'var(--text-main)', 
            outline: 'none', 
            resize: 'none', 
            fontFamily: 'var(--font-serif)',
            whiteSpace: 'pre-wrap',  /* CRITICAL FIX FOR LONG TEXT */
            overflowY: 'auto',       /* CRITICAL FIX FOR SCROLLING */
            paddingBottom: 40        /* Space for metrics */
        }}
      />

      {/* FOOTER METRICS */}
      <div style={{ 
          position: 'absolute', bottom: 0, left: 0, right: 0, 
          padding: '10px 0', background: 'var(--bg-body)', 
          borderTop: '1px solid var(--border-light)',
          display: 'flex', justifyContent: 'space-between', 
          fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)'
      }}>
          <span>{wordCount} words</span>
          <span>~{readTime} min read</span>
      </div>

    </div>
  );
}