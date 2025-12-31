import { useState } from 'react';
import { supabase } from '../data/supabaseClient';
import toast from 'react-hot-toast';
export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) toast.error(error.message); else toast.success('Check email!');
  };
  const handleGoogle = async () => { await supabase.auth.signInWithOAuth({ provider: 'google' }); };
  return (
    <div style={{ padding: 40, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <h1 style={{ marginBottom: 10 }}>aalap</h1>
      <p style={{ opacity: 0.6, marginBottom: 40 }}>Where words find their rhythm.</p>
      <div className="auth-box" style={{ padding: 20, borderRadius: 12, background: '#111', border: '1px solid #222' }}>
        <button onClick={handleGoogle} style={{ width:'100%', padding: 12, background: '#fff', color: '#000', border: 'none', borderRadius: 8, marginBottom: 20, fontWeight: 'bold' }}>Continue with Google</button>
        <div style={{ opacity: 0.4, margin: '20px 0' }}>— OR —</div>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.1)', color: 'inherit', border: '1px solid rgba(255,255,255,0.1)', marginBottom: 10 }} />
          <button style={{ width: '100%', padding: 12, background: '#333', color: '#fff', border: 'none', borderRadius: 8 }}>Send Magic Link</button>
        </form>
      </div>
    </div>
  );
}