import { ArrowLeft, Heart, MessageCircle } from 'lucide-react';
import { useStore } from '../data/store';
import Avatar from '../components/Avatar';
import { useEffect, useState } from 'react';
import { supabase } from '../data/supabaseClient';

export default function Reader({ post }) {
  const { setView } = useStore();
  const author = post.profiles || {};
  const [likes, setLikes] = useState(0);
  useEffect(() => { supabase.from('likes').select('id', { count: 'exact', head: true }).eq('post_id', post.id).then(({count}) => setLikes(count||0)); }, [post.id]);

  return (
    <div style={{ padding: '20px', minHeight: '100vh', background: 'inherit' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 30 }}>
        <button onClick={() => setView('main')} style={{ background: 'none', border: 'none', color: 'inherit', opacity: 0.6 }}><ArrowLeft /></button>
        <Avatar url={author.avatar_url} size={30} />
        <span style={{ fontWeight: 700 }}>{author.display_name}</span>
      </div>
      <h1 style={{ fontSize: 32, marginBottom: 24, lineHeight: 1.3 }}>{post.title}</h1>
      <div style={{ fontSize: 19, lineHeight: 1.9, whiteSpace: 'pre-wrap', opacity: 0.9, marginBottom: 60 }}>{post.body}</div>
      <div style={{ borderTop: '1px dashed rgba(128,128,128,0.2)', paddingTop: 20, display: 'flex', gap: 20, justifyContent: 'center' }}>
         <div style={{display: 'flex', alignItems: 'center', gap: 8, opacity: 0.6}}><Heart size={20} /> {likes}</div>
         <button onClick={() => setView('echo', post)} style={{background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 8, color: 'inherit', opacity: 0.6}}><MessageCircle size={20} /> Echoes</button>
      </div>
    </div>
  );
}