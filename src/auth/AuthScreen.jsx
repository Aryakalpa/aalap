import { useState } from 'react';
import { supabase } from '../data/supabaseClient';
import toast, { Toaster } from 'react-hot-toast';
import { Loader2, ArrowRight, Mail } from 'lucide-react';
import GrainOverlay from '../components/GrainOverlay';
import logo from '../assets/logo.png';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleMagicLink = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("ইমেইল ঠিকনা দিয়ক");
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin }});
    setLoading(false);
    if (error) toast.error(error.message); else setSent(true);
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) toast.error(error.message);
  };

  if (sent) return (
    <div style={{ height: '100vh', display: 'grid', placeItems: 'center', textAlign: 'center', padding: '20px' }}>
        <div className="notepad-card" style={{ maxWidth: '400px', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Mail size={48} color="var(--accent)" style={{ marginBottom: '20px' }} />
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', marginBottom: '10px' }}>ইমেইল চেক কৰক</h2>
            <p style={{ color: 'var(--text-sec)', fontSize: '16px', fontFamily: 'var(--font-serif)', lineHeight: '1.6' }}>
                আপোনাৰ <strong>{email}</strong> ঠিকনাত আমি এটা লিংক পঠাইছো। সেইটোত ক্লিক কৰিলে আপুনি লগ-ইন হৈ যাব।
            </p>
            <button onClick={() => setSent(false)} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', marginTop: '30px', fontWeight: 600, fontFamily: 'var(--font-serif)', fontSize: '15px' }}>
                বেলেগ ইমেইল ব্যৱহাৰ কৰক
            </button>
        </div>
    </div>
  );

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <GrainOverlay />
      <Toaster position="top-center" />
      
      <div style={{ marginBottom: '50px', textAlign: 'center' }}>
        <img 
            src={logo} 
            alt="Aalap" 
            style={{ width: '140px', height: 'auto', marginBottom: '20px' }} 
        />
        <p style={{ color: 'var(--text-sec)', fontSize: '20px', margin: 0, fontFamily: 'var(--font-serif)' }}>লেখকৰ বাবে এক নিৰিবিলি আশ্ৰয়</p>
      </div>

      <div style={{ width: '100%', maxWidth: '380px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* GOOGLE LOGIN BUTTON */}
        <button 
            onClick={handleGoogleLogin}
            className="haptic-btn"
            style={{
                width: '100%', padding: '16px', borderRadius: '30px', border: '1px solid var(--border)',
                background: 'var(--card)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                fontSize: '16px', fontWeight: 600, color: 'var(--text)', cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontFamily: 'var(--font-sans)'
            }}
        >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="G" style={{ width: '24px', height: '24px' }} />
            Google ৰে আৰম্ভ কৰক
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.4, margin: '10px 0' }}>
            <div style={{ height: '1px', flex: 1, background: 'var(--text)' }}></div>
            <span style={{ fontSize: '12px', fontWeight: 600 }}>অথবা (OR)</span>
            <div style={{ height: '1px', flex: 1, background: 'var(--text)' }}></div>
        </div>

        {/* EMAIL FORM */}
        <form onSubmit={handleMagicLink} style={{ position: 'relative' }}>
          <input 
            type="email" 
            placeholder="name@example.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="soul-card" 
            style={{ width: '100%', padding: '20px', paddingRight: '70px', fontSize: '16px', fontWeight: 500, outline: 'none', borderRadius: '30px', margin: 0, boxShadow: 'var(--sh-lg)', border: '1px solid var(--border)' }} 
          />
          <button disabled={loading} type="submit" style={{ position: 'absolute', right: '8px', top: '8px', bottom: '8px', background: 'var(--accent)', color: 'var(--bg)', border: 'none', borderRadius: '24px', width: '50px', cursor: 'pointer', display: 'grid', placeItems: 'center', transition: '0.2s' }}>
            {loading ? <Loader2 className="spin" size={20} /> : <ArrowRight size={22} />}
          </button>
        </form>

      </div>
    </div>
  );
}