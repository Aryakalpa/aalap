import { useState } from 'react';
import { ArrowLeft, Save, Loader2, Check } from 'lucide-react';
import { supabase } from '../data/supabaseClient';
import { useStore } from '../data/store';
import { STOCK_AVATARS } from '../data/avatars';
import Avatar from '../components/Avatar';
import toast from 'react-hot-toast';

export default function EditProfile() {
  const { user, profile, setView } = useStore();
  const [name, setName] = useState(profile?.display_name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [selectedAvatar, setSelectedAvatar] = useState(profile?.avatar_url || STOCK_AVATARS[0]);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from('profiles').update({ 
          display_name: name, 
          bio, 
          avatar_url: selectedAvatar,
          updated_at: new Date() 
      }).eq('id', user.id);

      if(error) throw error;
      window.location.reload();
      toast.success('পৰিচয় সলনি কৰা হ\'ল'); // Profile Updated
    } catch (e) { toast.error(e.message); } 
    finally { setLoading(false); }
  };

  return (
    <div className="main-content" style={{ maxWidth: '600px', margin: '0 auto' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <button onClick={() => setView('main')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-sec)' }}><ArrowLeft size={24} /></button>
        <h2 style={{ fontSize: '22px', fontWeight: 700, margin: 0, fontFamily: 'var(--font-serif)' }}>পৰিচয় সলনি</h2>
        <button onClick={handleSave} disabled={loading} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)' }}>{loading ? <Loader2 className="spin" size={24} /> : <Save size={24} />}</button>
      </div>

      {/* CURRENT AVATAR */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
         <div style={{ position: 'relative' }}>
            <Avatar url={selectedAvatar} size={120} />
            <div style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--accent)', color: 'var(--bg)', borderRadius: '50%', padding: '4px', border: '2px solid var(--bg)' }}>
                <Check size={14} strokeWidth={3} />
            </div>
         </div>
      </div>

      {/* AVATAR SELECTOR GRID */}
      <div style={{ marginBottom: '40px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: 'var(--text-sec)', marginBottom: '15px', fontFamily: 'var(--font-serif)' }}>ছবি বাছনি কৰক</label> {/* Choose Image */}
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '10px', scrollbarWidth: 'none' }}>
            {STOCK_AVATARS.map((url, i) => (
                <button 
                    key={i} 
                    onClick={() => setSelectedAvatar(url)}
                    style={{ 
                        background: 'transparent', padding: 0, border: selectedAvatar === url ? '2px solid var(--accent)' : '2px solid transparent', 
                        borderRadius: '50%', cursor: 'pointer', minWidth: '60px', transition: 'all 0.2s'
                    }}
                >
                    <Avatar url={url} size={56} />
                </button>
            ))}
        </div>
      </div>

      {/* FORM FIELDS */}
      <div className="soul-card">
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: 'var(--text-sec)', marginBottom: '10px', fontFamily: 'var(--font-serif)' }}>আপোনাৰ নাম</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="studio-input" style={{ fontSize: '20px', borderBottom: '1px solid var(--border) !important', paddingBottom: '12px', marginBottom: '24px', fontWeight: 500 }} />
        
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: 'var(--text-sec)', marginBottom: '10px', fontFamily: 'var(--font-serif)' }}>আপোনাৰ বিষয়ে (Bio)</label>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="studio-input" rows={4} style={{ fontSize: '18px', resize: 'none' }} />
      </div>
    </div>
  );
}