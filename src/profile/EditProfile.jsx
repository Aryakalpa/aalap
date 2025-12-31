import { useState, useEffect } from 'react';
import { supabase } from '../data/supabaseClient';
import { useStore } from '../data/store';
import { ArrowLeft, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EditProfile() {
  const { user, setView } = useStore();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    if(user) supabase.from('profiles').select('*').eq('id', user.id).single().then(({data}) => {
        if(data) { setName(data.display_name||''); setBio(data.bio||''); }
    });
  }, [user]);

  const save = async () => {
    const { error } = await supabase.from('profiles').update({ display_name: name, bio }).eq('id', user.id);
    if(!error) { toast.success('Saved'); setView('main'); }
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 40 }}>
         <button onClick={() => setView('main')} className="btn-icon"><ArrowLeft /></button>
         <h2 style={{ margin: 0 }}>Edit Profile</h2>
         <button onClick={save} className="btn-icon"><Check /></button>
      </div>
      <div style={{ marginBottom: 20 }}>
         <label style={{ display:'block', marginBottom: 10, opacity: 0.6, fontSize: 13, fontFamily: 'var(--font-ui)' }}>NAME</label>
         <input className="glass-input" value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div>
         <label style={{ display:'block', marginBottom: 10, opacity: 0.6, fontSize: 13, fontFamily: 'var(--font-ui)' }}>BIO</label>
         <textarea className="glass-input" value={bio} onChange={e => setBio(e.target.value)} style={{height: 100, resize: 'none'}} />
      </div>
    </div>
  );
}