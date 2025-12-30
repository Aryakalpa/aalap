import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useStore } from '../data/store';
import { supabase } from '../data/supabaseClient';
import toast from 'react-hot-toast';

export default function CreatePostScreen({ editPost }) {
  const { user, setView } = useStore();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (editPost) { setTitle(editPost.title); setBody(editPost.body); } }, [editPost]);

  const handlePublish = async () => {
    if (!title.trim() || !body.trim()) return toast.error("Write something.");
    setLoading(true);
    const payload = { author_id: user.id, title, body, category: 'story', is_published: true, updated_at: new Date() };
    const { error } = editPost ? await supabase.from('posts').update(payload).eq('id', editPost.id) : await supabase.from('posts').insert([payload]);
    setLoading(false);
    if (error) toast.error(error.message);
    else { toast.success('Published!'); setView('main'); }
  };

  return (
    <div className="main-content" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
        <button onClick={() => setView('main')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-sec)' }}><ArrowLeft size={24} /></button>
        <button onClick={handlePublish} disabled={loading} style={{ background: 'var(--text)', color: 'var(--bg)', border: 'none', padding: '10px 20px', borderRadius: '20px', fontWeight: 'bold', cursor: loading ? 'wait' : 'pointer', display: 'flex', gap: '8px' }}>{loading ? <Loader2 size={18} className="spin" /> : <Save size={18} />}{editPost ? 'Update' : 'Publish'}</button>
      </div>
      <input className="studio-input" placeholder="Title..." value={title} onChange={(e) => setTitle(e.target.value)} style={{ fontSize: '36px', fontWeight: '900', marginBottom: '20px' }} />
      <textarea className="studio-input" placeholder="Start writing..." value={body} onChange={(e) => setBody(e.target.value)} style={{ fontSize: '20px', lineHeight: '1.8', minHeight: '60vh', resize: 'none' }} />
    </div>
  );
}