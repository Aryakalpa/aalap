import { useState, useEffect } from 'react';
import { X, Save, Trash2, Image as ImageIcon, Check } from 'lucide-react';
import { useStore } from '../data/store';
import { supabase } from '../data/supabaseClient';
import toast from 'react-hot-toast';

export default function Studio() {
  const { user, setTab, viewData, setView } = useStore();
  
  // EDIT MODE: If viewData exists, we are editing that post
  const isEditing = !!viewData?.id;
  const editPost = viewData || {};

  // STATE INITIALIZATION (Draft vs Edit Data)
  const [title, setTitle] = useState(() => isEditing ? editPost.title : (localStorage.getItem('draft-title') || ''));
  const [body, setBody] = useState(() => isEditing ? editPost.body : (localStorage.getItem('draft-body') || ''));
  const [category, setCategory] = useState(() => isEditing ? editPost.category : 'story');
  const [cover, setCover] = useState(() => isEditing ? editPost.cover_image : null);
  
  const [showCoverPicker, setShowCoverPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const categories = [
    { id: 'story', label: 'গল্প' },
    { id: 'poem', label: 'কবিতা' },
    { id: 'article', label: 'প্ৰবন্ধ' },
    { id: 'misc', label: 'অন্যান্য' }
  ];

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

  // AUTO-SAVE (Only for New Posts, not Editing)
  useEffect(() => {
    if (!isEditing) {
        localStorage.setItem('draft-title', title);
        localStorage.setItem('draft-body', body);
    }
  }, [title, body, isEditing]);

  if (!user) { setTab('profile'); return null; }

  const handleClose = () => {
      if(isEditing) setView('main');
      else setTab('home');
  };

  const clearDraft = () => {
    if(!confirm('Delete Draft?')) return;
    setTitle(''); setBody(''); setCover(null);
    localStorage.removeItem('draft-title');
    localStorage.removeItem('draft-body');
    toast.success('Draft Cleared');
  };

  const handleSave = async () => {
    if (!title.trim() || !body.trim()) return toast.error('শিৰোনাম আৰু মূল কথা লিখিব লাগিব');
    setLoading(true);
    
    let error;
    
    if (isEditing) {
        // UPDATE EXISTING POST
        const { error: err } = await supabase.from('posts').update({ 
            title, body, category, cover_image: cover 
        }).eq('id', editPost.id);
        error = err;
    } else {
        // CREATE NEW POST
        const { error: err } = await supabase.from('posts').insert({ 
            title, body, category, author_id: user.id, cover_image: cover 
        });
        error = err;
    }

    if (!error) { 
        toast.success(isEditing ? 'আপডেট কৰা হ’ল' : 'প্ৰকাশ কৰা হ’ল!'); 
        if(!isEditing) {
            localStorage.removeItem('draft-title');
            localStorage.removeItem('draft-body');
        }
        handleClose();
    } else { 
        toast.error('ভুল হৈছে'); 
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-body)', position: 'fixed', inset: 0, zIndex: 2000 }}>
      
      {/* HEADER */}
      <div style={{ padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)' }}>
        <button onClick={handleClose} className="btn-icon"><X size={24} /></button>
        <div style={{ display: 'flex', gap: 10 }}>
           {!isEditing && (title || body) && <button onClick={clearDraft} className="btn-icon" style={{ color: 'var(--danger)' }}><Trash2 size={20} /></button>}
           <button onClick={handleSave} disabled={loading} className="btn-soft" style={{ background: 'var(--text-main)', color: 'var(--bg-body)' }}>
              {loading ? '...' : (isEditing ? 'Update' : 'Publish')}
           </button>
        </div>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: 20, paddingBottom: 60 }}>
          
          {/* COVER AREA */}
          {cover ? (
            <div style={{ width: '100%', height: 160, borderRadius: 12, marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', background: cover.includes('gradient') ? cover : `url(${cover}) center/cover` }} />
                <button onClick={() => setCover(null)} style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.6)', borderRadius: '50%', padding: 6, color: 'white' }}><X size={16} /></button>
            </div>
          ) : (
              <button onClick={() => setShowCoverPicker(!showCoverPicker)} className="btn-soft" style={{ width: '100%', marginBottom: 20, justifyContent: 'center', border: '1px dashed var(--border-light)', background: 'transparent' }}>
                  <ImageIcon size={18} /> {isEditing ? 'Add/Change Cover' : 'Add Cover Image'}
              </button>
          )}

          {/* THEME PICKER */}
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
            placeholder="Title (শিৰোনাম)" 
            style={{ background: 'transparent', border: 'none', fontSize: 24, fontWeight: 700, color: 'var(--text-main)', width: '100%', marginBottom: 15, outline: 'none', fontFamily: 'var(--font-serif)' }}
          />
          
          <div style={{ display: 'flex', gap: 10, marginBottom: 20, overflowX: 'auto', paddingBottom: 5 }}>
            {categories.map(c => (
                <button key={c.id} onClick={() => setCategory(c.id)} style={{ padding: '6px 16px', borderRadius: 20, border: '1px solid var(--border-light)', background: category === c.id ? 'var(--text-main)' : 'transparent', color: category === c.id ? 'var(--bg-body)' : 'var(--text-muted)', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap' }}>{c.label}</button>
            ))}
          </div>

          <textarea 
            value={body} onChange={e => setBody(e.target.value)}
            placeholder="Write your story here..." 
            style={{ 
                width: '100%', 
                minHeight: '60vh', // FORCES FULL SCREEN HEIGHT
                background: 'transparent', 
                border: 'none', 
                fontSize: 18, 
                lineHeight: 1.8, 
                color: 'var(--text-main)', 
                outline: 'none', 
                resize: 'none', 
                fontFamily: 'var(--font-serif)', 
                whiteSpace: 'pre-wrap'
            }}
          />
      </div>

      <div style={{ padding: '10px 20px', background: 'var(--bg-card)', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)' }}>
          <span>{wordCount} words</span>
          <span>{readTime} min read</span>
      </div>
    </div>
  );
}