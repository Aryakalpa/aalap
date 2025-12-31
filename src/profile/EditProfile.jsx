import { useState, useEffect } from 'react';
import { supabase } from '../data/supabaseClient';
import { useStore } from '../data/store';
import { ArrowLeft, Check } from 'lucide-react';
import Avatar from '../components/Avatar';
import toast from 'react-hot-toast';

export default function EditProfile() {
  const { user, setView } = useStore();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');

  // PRESET AVATARS (DiceBear Notion Style)
  const presets = [
    'https://api.dicebear.com/7.x/notionists/svg?seed=Felix',
    'https://api.dicebear.com/7.x/notionists/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/notionists/svg?seed=Milo',
    'https://api.dicebear.com/7.x/notionists/svg?seed=Lola',
    'https://api.dicebear.com/7.x/notionists/svg?seed=Bear',
    'https://api.dicebear.com/7.x/notionists/svg?seed=Ginger',
  ];

  useEffect(() => {
    if(user) supabase.from('profiles').select('*').eq('id', user.id).single().then(({data}) => {
        if(data) { 
            setName(data.display_name||''); 
            setBio(data.bio||''); 
            setAvatar(data.avatar_url||'');
        }
    });
  }, [user]);

  const save = async () => {
    if(!name.trim()) return toast.error('নাম লিখিব লাগিব');
    const { error } = await supabase.from('profiles').update({ 
        display_name: name, 
        bio,
        avatar_url: avatar 
    }).eq('id', user.id);
    
    if(!error) { 
        toast.success('সফলভাৱে সংৰক্ষণ কৰা হ’ল'); 
        window.location.reload(); // Refresh to update avatars everywhere
    } else {
        toast.error('ভুল হৈছে');
    }
  };

  return (
    <div style={{ paddingBottom: 100 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
         <button onClick={() => setView('main')} className="btn-icon"><ArrowLeft /></button>
         <h2 style={{ margin: 0, fontSize: 20 }}>প্ৰ’ফাইল সলনি কৰক</h2>
         <button onClick={save} className="btn-soft" style={{ background: 'var(--text-main)', color: 'var(--bg-body)' }}><Check size={18} /> Save</button>
      </div>

      {/* AVATAR SELECTOR */}
      <div style={{ marginBottom: 30, textAlign: 'center' }}>
          <div style={{ marginBottom: 15 }}>
             <Avatar url={avatar} size={80} />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
             {presets.map(url => (
                 <button 
                    key={url} onClick={() => setAvatar(url)}
                    style={{ 
                        borderRadius: '50%', padding: 2, 
                        border: avatar === url ? '2px solid var(--text-main)' : '2px solid transparent',
                        cursor: 'pointer'
                    }}
                 >
                     <img src={url} style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-input)' }} />
                 </button>
             ))}
          </div>
      </div>

      <div style={{ marginBottom: 20 }}>
         <label style={{ display:'block', marginBottom: 8, opacity: 0.6, fontSize: 13, fontFamily: 'var(--font-sans)' }}>NAME</label>
         <input className="glass-input" value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div>
         <label style={{ display:'block', marginBottom: 8, opacity: 0.6, fontSize: 13, fontFamily: 'var(--font-sans)' }}>BIO</label>
         <textarea className="glass-input" value={bio} onChange={e => setBio(e.target.value)} style={{height: 100, resize: 'none'}} />
      </div>
    </div>
  );
}