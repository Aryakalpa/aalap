import { useEffect, useState } from 'react';
import { supabase } from '../data/supabaseClient';
import { useStore } from '../data/store';
import Avatar from '../components/Avatar';
import { Heart, MessageCircle } from 'lucide-react';

export default function Notifications() {
  const { user, setTab } = useStore();
  const [items, setItems] = useState([]);
  
  if (!user) {
    return <div style={{padding:40, textAlign:'center', opacity:0.6}}>Login to see notifications</div>;
  }

  useEffect(() => {
    // Simulated notifications by fetching likes on my posts
    // Note: In a real app, you'd have a notifications table.
    // This queries "Likes on my posts where user != me"
    const fetchNotifs = async () => {
        // 1. Get my post IDs
        const { data: myPosts } = await supabase.from('posts').select('id').eq('author_id', user.id);
        const postIds = myPosts.map(p => p.id);
        
        if (postIds.length > 0) {
            const { data: likes } = await supabase.from('likes').select(`created_at, profiles(display_name, avatar_url)`).in('post_id', postIds).neq('user_id', user.id).order('created_at', {ascending:false}).limit(20);
            setItems(likes || []);
        }
    };
    fetchNotifs();
  }, [user]);

  return (
    <div style={{ padding: 20 }}>
       <h2 style={{ marginBottom: 30 }}>Notifications</h2>
       {items.length === 0 && <div style={{opacity:0.5}}>No recent activity.</div>}
       {items.map((item, i) => (
           <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 20 }}>
               <Avatar url={item.profiles?.avatar_url} size={40} />
               <div>
                   <div style={{ fontSize: 15 }}><span style={{fontWeight:700}}>{item.profiles?.display_name}</span> liked your story</div>
                   <div style={{ fontSize: 12, opacity: 0.5 }}>{new Date(item.created_at).toLocaleDateString()}</div>
               </div>
               <Heart size={16} fill="white" style={{marginLeft:'auto', opacity:0.5}} />
           </div>
       ))}
    </div>
  );
}