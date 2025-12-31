import { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { supabase } from '../data/supabaseClient';
import { useStore } from '../data/store';
import Avatar from '../components/Avatar';
import toast from 'react-hot-toast';

export default function EchoChamber({ post }) {
  const { user, setTab } = useStore();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    supabase.from('comments').select(`*, profiles(*)`).eq('post_id', post.id).order('created_at', {ascending: false})
      .then(({data}) => setComments(data||[]));
  }, [post.id]);

  const send = async () => {
    if(!user) { toast.error('লগ-ইন কৰক'); setTab('profile'); return; }
    if(!text.trim()) return;
    const { error } = await supabase.from('comments').insert({ post_id: post.id, user_id: user.id, body: text });
    if(!error) { 
        setText(''); 
        supabase.from('comments').select(`*, profiles(*)`).eq('post_id', post.id).order('created_at', {ascending: false})
          .then(({data}) => setComments(data||[]));
    }
  };

  // SMART CLOSE: Use history back to respect browser stack
  const close = () => {
     window.history.back();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'flex-end' }}>
      <div style={{ width: '100%', height: '85vh', background: 'var(--bg-body)', borderTopLeftRadius: 24, borderTopRightRadius: 24, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 20, borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <h3 style={{ margin: 0 }}>মন্তব্য ({comments.length})</h3>
           <button onClick={close} className="btn-icon" style={{ padding: 10 }}><X /></button>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
           {comments.map(c => (
               <div key={c.id} style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                   <Avatar url={c.profiles?.avatar_url} size={36} />
                   <div>
                       <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{c.profiles?.display_name}</div>
                       <div style={{ fontSize: 16, opacity: 0.9, lineHeight: 1.5 }}>{c.body}</div>
                   </div>
               </div>
           ))}
        </div>

        <div style={{ padding: '20px', borderTop: '1px solid var(--border-light)', display: 'flex', gap: 10, paddingBottom: 30 }}>
           <input value={text} onChange={e => setText(e.target.value)} className="glass-input" placeholder="লিখক..." />
           <button onClick={send} className="btn-icon" style={{ background: 'var(--text-main)', color: 'var(--bg-body)', borderRadius: '50%', width: 50, height: 50, padding: 0, justifyContent: 'center' }}><Send size={20} /></button>
        </div>
      </div>
    </div>
  );
}