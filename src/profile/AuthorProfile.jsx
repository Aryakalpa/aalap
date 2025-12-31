import { useEffect, useState } from 'react';
import { supabase } from '../data/supabaseClient';
import { useStore } from '../data/store';
import Avatar from '../components/Avatar';
import PostCard from '../posts/PostCard';
export default function AuthorProfile({ authorId, isOwnProfile }) {
  const { signOut } = useStore();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    supabase.from('profiles').select('*').eq('id', authorId).single().then(({data}) => setProfile(data));
    supabase.from('posts').select(`*, profiles(*)`).eq('author_id', authorId).then(({data}) => setPosts(data||[]));
  }, [authorId]);
  if (!profile) return <div>Loading...</div>;
  return (
    <div>
      <div style={{ padding: 20, borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', gap: 20 }}>
         <Avatar url={profile.avatar_url} size={80} />
         <div><h2>{profile.display_name}</h2>{isOwnProfile && <button onClick={signOut} style={{color:'red',background:'none',border:'none'}}>Logout</button>}</div>
      </div>
      <div style={{ padding: 20 }}>{posts.map(post => <PostCard key={post.id} post={post} />)}</div>
    </div>
  );
}