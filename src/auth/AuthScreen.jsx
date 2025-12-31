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
      <h1 style={{ marginBottom: 40 }}>aalap</h1>
      <button onClick={handleGoogle} style={{ padding: 12, background: '#fff', color: '#000', border: 'none', borderRadius: 8, marginBottom: 20 }}>Continue with Google</button>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: 12, borderRadius: 8, background: '#111', color: '#fff', border: '1px solid #333', marginBottom: 10 }} />
        <button style={{ width: '100%', padding: 12, background: '#333', color: '#fff', border: 'none', borderRadius: 8 }}>Send Magic Link</button>
      </form>
    </div>
  );
}