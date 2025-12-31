import { useState } from 'react';
import { supabase } from '../data/supabaseClient';
import toast from 'react-hot-toast';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault(); setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if(error) toast.error(error.message); else toast.success('মেইল চেক কৰক (Check Email)');
    setLoading(false);
  };

  const google = async () => { await supabase.auth.signInWithOAuth({ provider: 'google' }); };

  return (
    <div style={{ padding: 40, minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
      <h1 style={{ fontSize: 40, marginBottom: 10, letterSpacing: -2 }}>আলাপ</h1>
      <p style={{ opacity: 0.6, marginBottom: 40, fontFamily: 'var(--font-ui)' }}>শব্দৰ জৰিয়তে সংযোগ</p>
      
      <button onClick={google} style={{ background: '#fff', color: '#000', border: 'none', padding: 15, borderRadius: 12, fontWeight: 700, fontSize: 16, cursor: 'pointer', marginBottom: 20 }}>Google ৰ সৈতে আগবাঢ়ক</button>
      
      <div style={{ opacity: 0.3, margin: '20px 0' }}>— অথবা —</div>
      
      <form onSubmit={login}>
         <input className="glass-input" type="email" placeholder="ইমেইল দিয়ক..." value={email} onChange={e => setEmail(e.target.value)} style={{ marginBottom: 15 }} />
         <button disabled={loading} className="btn-primary" style={{ width: '100%' }}>{loading ? '...' : 'লিংক পঠাওক'}</button>
      </form>
    </div>
  );
}