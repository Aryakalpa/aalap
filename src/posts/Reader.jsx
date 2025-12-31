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
    <div style={{ padding: '20px', minHeight: '100vh', background: '#000', color: '#eee' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 30 }}>
        <button onClick={() => setView('main')} style={{ background: 'none', border: 'none', color: '#fff' }}><ArrowLeft /></button>
        <Avatar url={author.avatar_url} size={30} />
        <span style={{ fontWeight: 'bold' }}>{author.display_name}</span>
      </div>
      <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 20 }}>{post.title}</h1>
      <div style={{ fontSize: 18, lineHeight: 1.8, whiteSpace: 'pre-wrap', color: '#ccc', marginBottom: 50 }}>{post.body}</div>
    </div>
  );
}