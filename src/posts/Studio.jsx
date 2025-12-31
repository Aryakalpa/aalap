import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useStore } from '../data/store';
import { supabase } from '../data/supabaseClient';
import toast from 'react-hot-toast';

export default function Studio() {
  const { user, setTab } = useStore();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  
  // NEW: Category State with 4 Options
  const [category, setCategory] = useState('story');
  const categories = [
    { id: 'story', label: 'গল্প' },
    { id: 'poem', label: 'কবিতা' },
    { id: 'article', label: 'প্ৰবন্ধ' },
    { id: 'misc', label: 'অন্যান্য' }
  ];

  const [loading, setLoading] = useState(false);

  if (!user) { setTab('profile'); return null; }

  const handlePost = async () => {
    if (!title.trim() || !body.trim()) return toast.error('শিৰোনাম আৰু মূল কথা লিখিব লাগিব');
    setLoading(true);
    
    const { error } = await supabase.from('posts').insert({ 
        title, 
        body, 
        category, // Saving the tag
        author_id: user.id 
    });

    if (!error) { 
        toast.success('প্ৰকাশ কৰা হ’ল!'); 
        setTab('home'); 
        setTitle(''); 
        setBody(''); 
    } else { 
        toast.error('ভুল হৈছে'); 
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <button onClick={() => setTab('home')} className="btn-icon"><X size={24} /></button>
        <button onClick={handlePost} disabled={loading} className="btn-soft" style={{ background: 'var(--text-main)', color: 'var(--bg-body)' }}>
            {loading ? '...' : 'প্ৰকাশ কৰক'}
        </button>
      </div>
      
      <input 
        value={title} onChange={e => setTitle(e.target.value)}
        placeholder="শিৰোনাম..." 
        style={{ background: 'transparent', border: 'none', fontSize: 24, fontWeight: 700, color: 'var(--text-main)', width: '100%', marginBottom: 20, outline: 'none', fontFamily: 'var(--font-serif)' }}
      />
      
      {/* TAG SELECTOR */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, overflowX: 'auto', paddingBottom: 5 }}>
        {categories.map(c => (
            <button 
                key={c.id} 
                onClick={() => setCategory(c.id)}
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

      <textarea 
        value={body} onChange={e => setBody(e.target.value)}
        placeholder="আপোনাৰ সৃষ্টি লিখক..." 
        style={{ flex: 1, background: 'transparent', border: 'none', fontSize: 18, lineHeight: 1.6, color: 'var(--text-main)', outline: 'none', resize: 'none', fontFamily: 'var(--font-serif)' }}
      />
    </div>
  );
}