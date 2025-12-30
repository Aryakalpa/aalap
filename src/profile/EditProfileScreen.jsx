import { useState } from 'react';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { supabase } from '../data/supabaseClient';
import { useStore } from '../data/store';
import Avatar from '../components/Avatar';
import toast from 'react-hot-toast';

export default function EditProfileScreen() {
  const { user, profile, setView } = useStore();
  const [name, setName] = useState(profile?.display_name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || null);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
            display_name: name, 
            bio, 
            avatar_url: avatarUrl,
            updated_at: new Date() 
        })
        .eq('id', user.id);

      if (error) throw error;
      window.location.reload(); 
      toast.success('Profile updated.');
    } catch (e) {
      toast.error(e.message);
      setLoading(false);
    }
  };

  return (
    <div className="main-content" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <button onClick={() => setView('main')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-sec)' }}>
          <ArrowLeft size={24} />
        </button>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Edit Profile</h2>
        <button onClick={handleSave} disabled={loading} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)' }}>
          {loading ? <Loader2 className="spin" size={24} /> : <Save size={24} />}
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
         <Avatar 
            url={avatarUrl} 
            size={120} 
            editable={true}
            onUpload={(e, url) => {
                setAvatarUrl(url);
                toast.success("Image uploaded. Click Save.");
            }}
         />
      </div>

      <div className="soul-card">
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: 'var(--text-sec)', marginBottom: '8px' }}>DISPLAY NAME</label>
        <input 
          value={name} onChange={(e) => setName(e.target.value)}
          className="studio-input" 
          style={{ fontSize: '18px', borderBottom: '1px solid var(--border) !important', paddingBottom: '10px', marginBottom: '20px' }} 
        />

        <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: 'var(--text-sec)', marginBottom: '8px' }}>BIO</label>
        <textarea 
          value={bio} onChange={(e) => setBio(e.target.value)}
          className="studio-input" 
          rows={4}
          style={{ fontSize: '16px', resize: 'none' }} 
        />
      </div>
    </div>
  );
}