import { useEffect, useState } from 'react';
import { supabase } from '../data/supabaseClient';
import { useStore } from '../data/store';
import Avatar from '../components/Avatar';
import PostCard from '../posts/PostCard';
import { Settings, LogOut, Edit3 } from 'lucide-react';

export default function AuthorProfile({ authorId, isOwnProfile }) {
  const { setView, signOut } = useStore();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    supabase.from('profiles').select('*').eq('id', authorId).single().then(({data}) => setProfile(data));
    supabase.from('posts').select(`*, profiles(*)`).eq('author_id', authorId).order('created_at', {ascending: false}).then(({data}) => setPosts(data||[]));
  }, [authorId]);

  if (!profile) return <div style={{padding:20, opacity:0.5}}>Loading profile...</div>;

  return (
    <div>
      <div style={{ padding: '30px 20px', display: 'flex', alignItems: 'center', gap: 20, borderBottom: '1px solid rgba(128,128,128,0.1)' }}>
         <Avatar url={profile.avatar_url} size={80} />
         <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, fontSize: 24 }}>{profile.display_name}</h2>
            {profile.bio && <p style={{ opacity: 0.7, margin: '5px 0', fontSize: 15 }}>{profile.bio}</p>}
         </div>
      </div>
      
      {isOwnProfile && (
        <div style={{ display: 'flex', gap: 10, padding: 20 }}>
            <button onClick={() => setView('edit-profile')} style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #333', background: 'transparent', color: 'inherit', display: 'flex', justifyContent: 'center', gap: 8 }}><Edit3 size={18}/> Edit</button>
            <button onClick={() => setView('settings')} style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #333', background: 'transparent', color: 'inherit', display: 'flex', justifyContent: 'center', gap: 8 }}><Settings size={18}/> Settings</button>
            <button onClick={signOut} style={{ padding: 10, borderRadius: 8, border: '1px solid #333', background: 'transparent', color: '#ff4d4d' }}><LogOut size={18}/></button>
        </div>
      )}

      <div style={{ padding: 20 }}>
         <h3 style={{ fontSize: 14, opacity: 0.5, marginBottom: 20, fontFamily: 'Inter' }}>STORIES ({posts.length})</h3>
         {posts.map(post => <PostCard key={post.id} post={post} />)}
      </div>
    </div>
  );
}