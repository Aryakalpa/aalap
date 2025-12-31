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

  if(!profile) return <div style={{padding:40, textAlign:'center'}}>Loading...</div>;

  return (
    <div>
      <div style={{ padding: 30, display: 'flex', alignItems: 'center', gap: 20 }}>
         <Avatar url={profile.avatar_url} size={80} />
         <div>
            <h2 style={{ margin: 0, fontSize: 24 }}>{profile.display_name}</h2>
            {profile.bio && <p style={{ margin: '5px 0', opacity: 0.7, fontSize: 14 }}>{profile.bio}</p>}
         </div>
      </div>

      {isOwnProfile && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 10, padding: '0 20px 20px' }}>
            <button onClick={() => setView('edit-profile')} className="glass-input" style={{ padding: 10, textAlign: 'center', cursor: 'pointer' }}>Edit</button>
            <button onClick={() => setView('settings')} className="glass-input" style={{ padding: 10, textAlign: 'center', cursor: 'pointer' }}>Settings</button>
            <button onClick={signOut} className="glass-input" style={{ padding: 10, width: 50, display: 'grid', placeItems: 'center', color: 'var(--danger)', cursor: 'pointer' }}><LogOut size={20}/></button>
        </div>
      )}

      <div style={{ padding: 20 }}>
          <h4 style={{ fontFamily: 'var(--font-ui)', opacity: 0.5, letterSpacing: 1, fontSize: 12 }}>PUBLISHED ({posts.length})</h4>
          {posts.map(p => <PostCard key={p.id} post={p} />)}
      </div>
    </div>
  );
}