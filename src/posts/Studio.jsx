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
    if (!title.trim() || !body.trim()) return toast.error('Empty fields');
    setLoading(true);
    const { error } = await supabase.from('posts').insert({ title, body, category, author_id: user.id });
    if (error) toast.error(error.message); else { toast.success('Published!'); setTab('home'); }
    setLoading(false);
  };

  return (
    <div style={{ padding: 20, height: '100vh', background: '#000' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 30 }}>
        <button onClick={() => setTab('home')} style={{ background: 'none', border: 'none', color: '#888' }}><X size={24} /></button>
        <button onClick={handlePost} disabled={loading} style={{ background: '#eee', color: '#000', border: 'none', padding: '8px 16px', borderRadius: 20 }}>{loading ? '...' : 'Publish'}</button>
      </div>
      <input className="studio-input" style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }} placeholder="Title..." value={title} onChange={e => setTitle(e.target.value)} />
      <textarea className="studio-input" style={{ height: 'calc(100% - 200px)' }} placeholder="Write..." value={body} onChange={e => setBody(e.target.value)} />
    </div>
  );
}