import { useState } from 'react';
import { X } from 'lucide-react';
import { useStore } from '../data/store';
import { supabase } from '../data/supabaseClient';
import toast from 'react-hot-toast';

export default function Studio() {
  const { user, setTab } = useStore();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('story');
  const [loading, setLoading] = useState(false);

  if (!user) { toast.error("Login to write"); setTab('profile'); return null; }

  const handlePost = async () => {
    if (!title.trim() || !body.trim()) return toast.error('লিখিবলৈ একো নাই (Empty)');
    setLoading(true);
    const { error } = await supabase.from('posts').insert({ title, body, category, author_id: user.id });
    if (error) toast.error(error.message); else { toast.success('প্ৰকাশ কৰা হ’ল (Published)'); setTab('home'); }
    setLoading(false);
  };

  return (
    <div style={{ padding: 20, height: '100vh', background: 'inherit' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 30 }}>
        <button onClick={() => setTab('home')} style={{ background: 'none', border: 'none', opacity: 0.6, color: 'inherit' }}><X size={24} /></button>
        <button onClick={handlePost} disabled={loading} style={{ background: '#333', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: 20, fontFamily: 'Inter', fontSize: 13, fontWeight: 600 }}>{loading ? '...' : 'প্ৰকাশ কৰক'}</button>
      </div>

      <input className="studio-input" style={{ fontSize: 28, fontWeight: 700, marginBottom: 20 }} placeholder="শিৰোনাম..." value={title} onChange={e => setTitle(e.target.value)} />
      
      <div style={{ display: 'flex', gap: 10, marginBottom: 25 }}>
        {['story', 'poem'].map(c => (
            <button key={c} onClick={() => setCategory(c)} style={{ border: '1px solid #444', background: category === c ? '#444' : 'transparent', color: 'inherit', padding: '6px 14px', borderRadius: 20, fontSize: 12 }}>
                {c === 'story' ? 'গল্প' : 'কবিতা'}
            </button>
        ))}
      </div>

      <textarea className="studio-input" style={{ height: 'calc(100% - 200px)' }} placeholder="ইয়াত লিখক..." value={body} onChange={e => setBody(e.target.value)} />
    </div>
  );
}