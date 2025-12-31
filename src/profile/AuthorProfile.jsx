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

  if (!profile) return <div style={{padding:40, textAlign:'center', opacity:0.5}}>Loading...</div>;

  return (
    <div>
      <div style={{ padding: '30px 20px', display: 'flex', alignItems: 'center', gap: 20 }}>
         <Avatar url={profile.avatar_url} size={80} />
         <div>
            <h2 style={{ margin: 0, fontSize: 24 }}>{profile.display_name}</h2>
            {profile.bio && <p style={{ margin: '5px 0', opacity: 0.7, fontSize: 14 }}>{profile.bio}</p>}
         </div>
      </div>
      
      {isOwnProfile && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 10, padding: '0 20px 20px' }}>
            <button onClick={() => setView('edit-profile')} className="btn-soft"><Edit3 size={16}/> Edit</button>
            <button onClick={() => setView('settings')} className="btn-soft"><Settings size={16}/> Settings</button>
            <button onClick={signOut} className="btn-soft" style={{ color: 'var(--danger)', background: 'rgba(255,0,0,0.1)' }}><LogOut size={18}/></button>
        </div>
      )}

      <div style={{ padding: 20 }}>
         <h3 style={{ fontSize: 12, opacity: 0.5, marginBottom: 20, letterSpacing: 1, fontFamily: 'Inter' }}>STORIES ({posts.length})</h3>
         {posts.map(post => <PostCard key={post.id} post={post} />)}
      </div>
    </div>
  );
}