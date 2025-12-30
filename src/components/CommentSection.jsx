import { useState, useEffect } from 'react';
import { supabase } from '../data/supabaseClient';
import { useStore } from '../data/store';
import { Send, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CommentSection({ postId }) {
  const { user } = useStore();
  const [echoes, setEchoes] = useState([]);
  const [newEcho, setNewEcho] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEchoes();
    
    // Real-time listener for new comments
    const channel = supabase.channel(`echoes:${postId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'echoes', filter: `post_id=eq.${postId}` }, 
      () => fetchEchoes())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [postId]);

  const fetchEchoes = async () => {
    const { data } = await supabase
      .from('echoes')
      .select(`*, profiles(display_name, username)`)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    setEchoes(data || []);
    setLoading(false);
  };

  const postEcho = async () => {
    if (!newEcho.trim()) return;
    if (!user) return toast.error("Sign in to echo.");

    try {
      const { error } = await supabase.from('echoes').insert({
        post_id: postId,
        user_id: user.id,
        body: newEcho
      });
      if (error) throw error;
      setNewEcho('');
    } catch (e) {
      toast.error(e.message);
    }
  };

  const deleteEcho = async (id) => {
    if(!confirm("Silence this echo?")) return;
    await supabase.from('echoes').delete().eq('id', id);
  };

  return (
    <div style={{ marginTop: '60px', borderTop: '1px solid var(--border)', paddingTop: '40px' }}>
      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', marginBottom: '20px' }}>Echoes ({echoes.length})</h3>

      {/* Input */}
      {user && (
        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
          <input 
            value={newEcho}
            onChange={(e) => setNewEcho(e.target.value)}
            placeholder="Share your thoughts..."
            onKeyDown={(e) => e.key === 'Enter' && postEcho()}
            style={{ 
              flex: 1, padding: '12px 20px', borderRadius: '20px', 
              border: '1px solid var(--border)', background: 'var(--bg)',
              fontFamily: 'var(--font-serif)', fontSize: '16px', outline: 'none'
            }}
          />
          <button onClick={postEcho} style={{ background: 'var(--accent)', color: '#fff', border: 'none', width: '46px', borderRadius: '50%', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
            <Send size={18} />
          </button>
        </div>
      )}

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {echoes.map(echo => (
          <div key={echo.id} style={{ display: 'flex', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--border)', display: 'grid', placeItems: 'center', fontSize: '12px', fontWeight: 'bold' }}>
              {echo.profiles?.display_name?.[0] || '?'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', fontWeight: '700' }}>{echo.profiles?.display_name}</span>
                {user?.id === echo.user_id && (
                  <button onClick={() => deleteEcho(echo.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-sec)', opacity: 0.6 }}>
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '15px', lineHeight: '1.5', color: 'var(--text)', fontFamily: 'var(--font-serif)' }}>
                {echo.body}
              </p>
            </div>
          </div>
        ))}
        {echoes.length === 0 && !loading && <p style={{ color: 'var(--text-sec)', fontStyle: 'italic' }}>Be the first to echo.</p>}
      </div>
    </div>
  );
}