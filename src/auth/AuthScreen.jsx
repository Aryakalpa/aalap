import { useState } from 'react';
import { supabase } from '../data/supabaseClient';
import toast, { Toaster } from 'react-hot-toast';
import { Loader2, ArrowRight } from 'lucide-react';
import GrainOverlay from '../components/GrainOverlay';
import logo from '../assets/logo.png'; // IMPORT MAIN LOGO

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("ইমেইল ঠিকনা দিয়ক");
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin }});
    setLoading(false);
    if (error) toast.error(error.message); else setSent(true);
  };

  if (sent) return <div style={{ height: '100vh', display: 'grid', placeItems: 'center', textAlign: 'center', padding: '20px' }}><div className="soul-card" style={{ maxWidth: '400px', padding: '40px' }}><h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px' }}>ইমেইল চেক কৰক</h2><p style={{ color: 'var(--text-sec)', fontSize: '18px', fontFamily: 'var(--font-serif)' }}>আপোনাৰ <strong>{email}</strong> ঠিকনাত আমি এটা যাদুকৰী লিংক পঠাইছো।</p><button onClick={() => setSent(false)} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', marginTop: '20px', fontWeight: 600, fontFamily: 'var(--font-serif)', fontSize: '16px' }}>বেলেগ ইমেইল ব্যৱহাৰ কৰক</button></div></div>;

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <GrainOverlay />
      
      <div style={{ marginBottom: '50px', textAlign: 'center' }}>
        {/* LOGO IMAGE */}
        <img 
            src={logo} 
            alt="Aalap" 
            style={{ 
                width: '140px', 
                height: 'auto', 
                marginBottom: '20px',
                // Assuming logo is black, invert for dark mode if user has system dark mode preference. 
                // Since this screen doesn't have theme state yet (it's pre-login), we trust the image.
            }} 
        />
        <p style={{ color: 'var(--text-sec)', fontSize: '24px', margin: 0, fontFamily: 'var(--font-serif)' }}>লেখকৰ বাবে এক নিৰিবিলি আশ্ৰয়</p>
      </div>

      <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: '380px' }}>
        <div style={{ position: 'relative' }}>
          <input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="soul-card" style={{ width: '100%', padding: '22px', paddingRight: '70px', fontSize: '18px', fontWeight: 500, outline: 'none', borderRadius: '24px', margin: 0, boxShadow: 'var(--sh-lg)' }} />
          <button disabled={loading} type="submit" style={{ position: 'absolute', right: '12px', top: '12px', bottom: '12px', background: 'var(--accent)', color: 'var(--bg)', border: 'none', borderRadius: '16px', width: '50px', cursor: 'pointer', display: 'grid', placeItems: 'center', transition: '0.2s' }}>{loading ? <Loader2 className="spin" size={20} /> : <ArrowRight size={22} />}</button>
        </div>
      </form>
    </div>
  );
}