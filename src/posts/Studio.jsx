import { useState, useEffect } from 'react';
import { X, Save, Trash2, Image as ImageIcon } from 'lucide-react';
import { useStore } from '../data/store';
import { supabase } from '../data/supabaseClient';
import toast from 'react-hot-toast';

export default function Studio() {
  const { user, setTab } = useStore();
  
  const [title, setTitle] = useState(() => localStorage.getItem('draft-title') || '');
  const [body, setBody] = useState(() => localStorage.getItem('draft-body') || '');
  const [category, setCategory] = useState('story');
  const [cover, setCover] = useState(null); // New Cover State
  const [showCoverPicker, setShowCoverPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const categories = [
    { id: 'story', label: 'গল্প' },
    { id: 'poem', label: 'কবিতা' },
    { id: 'article', label: 'প্ৰবন্ধ' },
    { id: 'misc', label: 'অন্যান্য' }
  ];

  // CURATED THEMES (Lightweight URLs)
  const themes = [
    { id: 'tea', url: 'https://images.unsplash.com/photo-1598335624134-226922375802?auto=format&fit=crop&w=800&q=80', label: 'চাহ বাগিচা' },
    { id: 'rain', url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=800&q=80', label: 'বৰষুণ' },
    { id: 'book', url: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80', label: 'কিতাপ' },
    { id: 'dark', url: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=800&q=80', label: 'নিশা' },
    { id: 'sky', url: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&w=800&q=80', label: 'আকাশ' },
    { id: 'grad1', url: 'linear-gradient(45deg, #FF9A9E 0%, #FECFEF 99%, #FECFEF 100%)', label: 'আবেগ' },
    { id: 'grad2', url: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)', label: 'শান্তি' },
    { id: 'grad3', url: 'linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)', label: 'সৰল' },
  ];

  const wordCount = body.trim().split(/\s+/).filter(w => w.length > 0).length;
  const readTime = Math.ceil(wordCount / 200);

  useEffect(() => {
    localStorage.setItem('draft-title', title);
    localStorage.setItem('draft-body', body);
  }, [title, body]);

  if (!user) { setTab('profile'); return null; }

  const clearDraft = () => {
    if(!confirm('Delete Draft?')) return;
    setTitle(''); setBody(''); setCover(null);
    localStorage.removeItem('draft-title');
    localStorage.removeItem('draft-body');
    toast.success('Draft Cleared');
  };

  const handlePost = async () => {
    if (!title.trim() || !body.trim()) return toast.error('শিৰোনাম আৰু মূল কথা লিখিব লাগিব');
    setLoading(true);
    
    const { error } = await supabase.from('posts').insert({ 
        title, body, category, author_id: user.id,
        cover_image: cover // Saving the URL
    });

    if (!error) { 
        toast.success('প্ৰকাশ কৰা হ’ল!'); 
        localStorage.removeItem('draft-title');
        localStorage.removeItem('draft-body');
        setTitle(''); setBody(''); setCover(null);
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
           {(title || body) && <button onClick={clearDraft} className="btn-icon" style={{ color: 'var(--danger)' }}><Trash2 size={20} /></button>}
           <button onClick={handlePost} disabled={loading} className="btn-soft" style={{ background: 'var(--text-main)', color: 'var(--bg-body)' }}>{loading ? '...' : 'প্ৰকাশ কৰক'}</button>
        </div>
      </div>
      
      {/* COVER PREVIEW */}
      {cover && (
        <div style={{ width: '100%', height: 120, borderRadius: 12, marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '100%', background: cover.includes('gradient') ? cover : `url(${cover}) center/cover` }} />
            <button onClick={() => setCover(null)} style={{ position: 'absolute', top: 5, right: 5, background: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: 5, color: 'white' }}><X size={14} /></button>
        </div>
      )}

      {/* COVER PICKER TOGGLE */}
      {!cover && (
          <button onClick={() => setShowCoverPicker(!showCoverPicker)} className="btn-soft" style={{ width: 'fit-content', marginBottom: 15, fontSize: 13 }}>
              <ImageIcon size={16} /> Cover যোগ কৰক
          </button>
      )}

      {/* THEME GRID */}
      {showCoverPicker && !cover && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 20 }}>
              {themes.map(t => (
                  <button key={t.id} onClick={() => { setCover(t.url); setShowCoverPicker(false); }} style={{ height: 60, borderRadius: 8, overflow: 'hidden', position: 'relative', border: '1px solid var(--border-light)' }}>
                      <div style={{ width: '100%', height: '100%', background: t.url.includes('gradient') ? t.url : `url(${t.url}) center/cover` }} />
                  </button>
              ))}
          </div>
      )}
      
      <input 
        value={title} onChange={e => setTitle(e.target.value)}
        placeholder="শিৰোনাম..." 
        style={{ background: 'transparent', border: 'none', fontSize: 28, fontWeight: 700, color: 'var(--text-main)', width: '100%', marginBottom: 20, outline: 'none', fontFamily: 'var(--font-serif)' }}
      />
      
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, overflowX: 'auto', paddingBottom: 5 }}>
        {categories.map(c => (
            <button key={c.id} onClick={() => setCategory(c.id)} style={{ padding: '6px 16px', borderRadius: 20, border: '1px solid var(--border-light)', background: category === c.id ? 'var(--text-main)' : 'transparent', color: category === c.id ? 'var(--bg-body)' : 'var(--text-muted)', fontSize: 14, fontWeight: 500, whiteSpace: 'nowrap' }}>{c.label}</button>
        ))}
      </div>

      <textarea 
        value={body} onChange={e => setBody(e.target.value)}
        placeholder="আপোনাৰ সৃষ্টি লিখক..." 
        style={{ flex: 1, background: 'transparent', border: 'none', fontSize: 18, lineHeight: 1.8, color: 'var(--text-main)', outline: 'none', resize: 'none', fontFamily: 'var(--font-serif)', whiteSpace: 'pre-wrap', overflowY: 'auto', paddingBottom: 40 }}
      />

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 0', background: 'var(--bg-body)', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>
          <span>{wordCount} words</span>
          <span>~{readTime} min read</span>
      </div>
    </div>
  );
}