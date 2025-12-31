import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useStore } from '../data/store';
import { supabase } from '../data/supabaseClient';
import toast from 'react-hot-toast';

export default function Studio() {
  const { user, setTab } = useStore();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('story');
  const [loading, setLoading] = useState(false);

  if (!user) { setTab('profile'); return null; }

  const handlePost = async () => {
    if (!title.trim() || !body.trim()) return toast.error('খালি ৰাখিব নোৱাৰিব');
    setLoading(true);
    const { error } = await supabase.from('posts').insert({ title, body, category, author_id: user.id });
    if (!error) { toast.success('সফলভাৱে প্ৰকাশিত!'); setTab('home'); }
    else toast.error('ভুল হৈছে');
    setLoading(false);
  };

  return (
    <div style={{ padding: 20, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <button onClick={() => setTab('home')} className="btn-icon"><X size={24} /></button>
        <button onClick={handlePost} disabled={loading} className="btn-primary" style={{ opacity: loading ? 0.5 : 1 }}>
            {loading ? '...' : 'প্ৰকাশ কৰক'}
        </button>
      </div>
      
      <input 
        value={title} onChange={e => setTitle(e.target.value)}
        placeholder="শিৰোনাম..." 
        style={{ background: 'transparent', border: 'none', fontSize: 32, fontWeight: 700, fontFamily: 'var(--font-body)', color: 'var(--text-primary)', width: '100%', marginBottom: 20, outline: 'none' }}
      />
      
      <div style={{ display: 'flex', gap: 10, marginBottom: 30 }}>
        {['story', 'poem'].map(c => (
            <button key={c} onClick={() => setCategory(c)} 
                style={{ 
                    padding: '8px 16px', borderRadius: 20, border: '1px solid var(--glass-border)', 
                    background: category === c ? 'var(--text-primary)' : 'transparent', 
                    color: category === c ? 'var(--bg-primary)' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
                }}>
                {c === 'story' ? 'গল্প' : 'কবিতা'}
            </button>
        ))}
      </div>

      <textarea 
        value={body} onChange={e => setBody(e.target.value)}
        placeholder="আপোনাৰ সৃষ্টি লিখক..." 
        style={{ flex: 1, background: 'transparent', border: 'none', fontSize: 20, lineHeight: 1.8, fontFamily: 'var(--font-body)', color: 'var(--text-primary)', outline: 'none', resize: 'none' }}
      />
    </div>
  );
}