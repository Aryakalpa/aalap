import { useEffect, useState } from 'react';
import { supabase } from '../data/supabaseClient';
import { useStore } from '../data/store';
import Avatar from '../components/Avatar';
import { Heart } from 'lucide-react';

export default function Notifications() {
  const { user } = useStore();
  const [list, setList] = useState([]);

  useEffect(() => {
    if(!user) return;
    const fetch = async () => {
        const { data: posts } = await supabase.from('posts').select('id').eq('author_id', user.id);
        const ids = posts.map(p => p.id);
        if(ids.length > 0) {
            const { data } = await supabase.from('likes').select(`created_at, profiles(display_name, avatar_url)`).in('post_id', ids).neq('user_id', user.id).order('created_at', {ascending: false}).limit(30);
            setList(data || []);
        }
    };
    fetch();
  }, [user]);

  if(!user) return <div style={{padding:40, textAlign:'center'}}>Login required</div>;

  return (
    <div style={{ padding: 20 }}>
       <h2 style={{ marginBottom: 30 }}>জাননী (Notifications)</h2>
       {list.length === 0 && <div style={{ opacity: 0.5 }}>No new activity</div>}
       {list.map((item, i) => (
           <div key={i} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: 15, padding: 15 }}>
               <Avatar url={item.profiles?.avatar_url} size={40} />
               <div>
                   <div style={{ fontSize: 15 }}><span style={{fontWeight:700}}>{item.profiles?.display_name}</span> liked your post</div>
                   <div style={{ fontSize: 12, opacity: 0.5 }}>{new Date(item.created_at).toLocaleDateString()}</div>
               </div>
               <Heart size={16} fill="var(--danger)" color="var(--danger)" style={{ marginLeft: 'auto' }} />
           </div>
       ))}
    </div>
  );
}