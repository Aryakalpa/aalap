import { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { supabase } from '../data/supabaseClient';
import { useStore } from '../data/store';
import Avatar from '../components/Avatar';
import toast from 'react-hot-toast';

export default function EchoChamber({ post, onClose }) {
  const { user, setTab } = useStore();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    supabase.from('comments').select(`*, profiles(*)`).eq('post_id', post.id).order('created_at', {ascending: false}).then(({data}) => setComments(data||[]));
  }, [post.id]);

  const handleSend = async () => {
    if (!user) { toast.error('Login to comment'); return setTab('profile'); }
    if (!newComment.trim()) return;
    await supabase.from('comments').insert({ post_id: post.id, user_id: user.id, body: newComment });
    setNewComment('');
  };

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', height: '80vh', background: '#111', zIndex: 900, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: 20, borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between' }}>
         <h3 style={{ margin: 0 }}>Echoes</h3>
         <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff' }}><X /></button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
         {comments.map(c => (
            <div key={c.id} style={{ marginBottom: 20, display: 'flex', gap: 10 }}>
                <Avatar url={c.profiles?.avatar_url} size={32} />
                <div><div style={{fontWeight:'bold'}}>{c.profiles?.display_name}</div><div style={{color:'#ccc'}}>{c.body}</div></div>
            </div>
         ))}
      </div>
      <div style={{ padding: 20, borderTop: '1px solid #333', display: 'flex', gap: 10 }}>
         <input value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Write..." style={{ flex: 1, background: '#222', border: 'none', borderRadius: 20, padding: 10, color: '#fff' }} />
         <button onClick={handleSend} style={{ background: '#eee', border: 'none', borderRadius: '50%', width: 40, height: 40 }}><Send size={18} /></button>
      </div>
    </div>
  );
}