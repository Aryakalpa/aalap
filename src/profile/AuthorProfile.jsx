import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../data/supabaseClient';
import { useStore } from '../data/store';
import PostCard from '../posts/PostCard';
import Avatar from '../components/Avatar';

export default function AuthorProfile({ authorId }) {
  const { setView } = useStore();
  const [author, setAuthor] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    supabase.from('profiles').select('*').eq('id', authorId).single().then(({data}) => setAuthor(data));
    supabase.from('posts').select(`*, profiles(*)`).eq('author_id', authorId).order('created_at', { ascending: false }).then(({data}) => setPosts(data || []));
  }, [authorId]);

  if (!author) return <div style={{ paddingTop: '100px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="main-content">
      <button onClick={() => setView('main')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-sec)', marginBottom: '20px' }}><ArrowLeft size={24} /></button>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}><Avatar url={author.avatar_url} size={100} /></div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', margin: '0 0 10px' }}>{author.display_name}</h1>
        <p style={{ color: 'var(--text-sec)', maxWidth: '400px', margin: '0 auto' }}>{author.bio}</p>
        <div style={{ marginTop: '20px', fontSize: '13px', fontWeight: 700, color: 'var(--accent)', background: 'var(--card)', display: 'inline-block', padding: '6px 12px', borderRadius: '20px', border: '1px solid var(--border)' }}>{posts.length} Writings</div>
      </div>
      <div>{posts.map(p => <PostCard key={p.id} post={p} />)}</div>
    </div>
  );
}