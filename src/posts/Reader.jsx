import { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Share, Loader2 } from 'lucide-react';
import { useStore } from '../data/store';
import { supabase } from '../data/supabaseClient';
import Avatar from '../components/Avatar';
import toast from 'react-hot-toast';

export default function Reader({ post }) {
  const { setView, user } = useStore();
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes_count || 0);

  useEffect(() => {
    if(user) supabase.from('likes').select('*').eq('user_id', user.id).eq('post_id', post.id).then(({data}) => setIsLiked(data.length > 0));
  }, [user]);

  const toggleLike = async () => {
    if(!user) return toast.error('প্ৰশংসা কৰিবলৈ লগ-ইন কৰক'); // Sign in to appreciate
    const nextState = !isLiked;
    setIsLiked(nextState);
    setLikes(prev => nextState ? prev + 1 : prev - 1);
    
    if(nextState) await supabase.from('likes').insert({ user_id: user.id, post_id: post.id });
    else await supabase.from('likes').delete().eq('user_id', user.id).eq('post_id', post.id);
  };

  if(!post) return null;
  const author = post.profiles || {};

  return (
    <div className="main-content" style={{ maxWidth: '720px', margin: '0 auto', paddingBottom: '120px' }}>
      <button onClick={() => setView('main')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-sec)', marginBottom: '30px' }}><ArrowLeft size={24} /></button>
      
      <article className="fade-in">
        {/* FLUID TYPOGRAPHY FOR TITLE */}
        <h1 style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: 'clamp(2rem, 5vw, 3.5rem)', // Scales from 32px to 56px
            fontWeight: 900, lineHeight: 1.1, marginBottom: '16px', letterSpacing: '-1px' 
        }}>
            {post.title}
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px', borderBottom: '1px solid var(--border)', paddingBottom: '25px' }}>
           <Avatar url={author.avatar_url} size={40} />
           <div>
             <div style={{ fontWeight: 700, fontSize: '15px' }}>{author.display_name || 'নামবিহীন'}</div>
             <div style={{ color: 'var(--text-sec)', fontSize: '13px' }}>{new Date(post.created_at).toLocaleDateString()}</div>
           </div>
        </div>
        
        {/* FLUID TYPOGRAPHY FOR BODY */}
        <div style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: 'clamp(18px, 2vw, 21px)', // Scales text for mobile
            lineHeight: 1.8, color: 'var(--text)' 
        }}>
          {post.body.split('\n').map((p, i) => <p key={i} style={{ marginBottom: '24px' }}>{p}</p>)}
        </div>
      </article>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '60px' }}>
         <button onClick={toggleLike} className="haptic-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', color: isLiked ? 'var(--danger)' : 'var(--text-sec)' }}>
            <Heart size={32} fill={isLiked ? 'currentColor' : 'none'} strokeWidth={1.5} />
            <span style={{ fontSize: '12px', fontWeight: 700 }}>{likes}</span>
         </button>
         <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('লিংক কপি কৰা হ\'ল'); }} className="haptic-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', color: 'var(--text-sec)' }}>
            <Share size={32} strokeWidth={1.5} />
            <span style={{ fontSize: '12px', fontWeight: 700 }}>শ্বেয়াৰ</span>
         </button>
      </div>
    </div>
  );
}