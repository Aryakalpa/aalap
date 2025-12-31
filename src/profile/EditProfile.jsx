import { useState, useEffect } from 'react';
import { supabase } from '../data/supabaseClient';
import { useStore } from '../data/store';
import { ArrowLeft, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EditProfile() {
  const { user, setView } = useStore();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(user) supabase.from('profiles').select('*').eq('id', user.id).single().then(({data}) => {
        if(data) { setName(data.display_name || ''); setBio(data.bio || ''); }
    });
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase.from('profiles').update({ display_name: name, bio }).eq('id', user.id);
    if (error) toast.error('Error updating'); else { toast.success('Profile updated'); setView('main'); }
    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
         <button onClick={() => setView('main')} style={{background:'none',border:'none',color:'inherit'}}><ArrowLeft /></button>
         <h2 style={{margin:0}}>Edit Profile</h2>
         <button onClick={handleSave} disabled={loading} style={{background:'none',border:'none',color:'inherit'}}><Check /></button>
      </div>

      <div style={{ marginBottom: 20 }}>
         <label style={{display:'block', marginBottom:10, opacity:0.6, fontSize:13}}>DISPLAY NAME</label>
         <input value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: 15, background: 'rgba(128,128,128,0.1)', border: 'none', borderRadius: 8, color: 'inherit', fontSize: 16 }} />
      </div>

      <div style={{ marginBottom: 20 }}>
         <label style={{display:'block', marginBottom:10, opacity:0.6, fontSize:13}}>BIO</label>
         <textarea value={bio} onChange={e => setBio(e.target.value)} style={{ width: '100%', padding: 15, background: 'rgba(128,128,128,0.1)', border: 'none', borderRadius: 8, color: 'inherit', fontSize: 16, height: 100 }} />
      </div>
    </div>
  );
}