import { ArrowLeft, Heart, MessageCircle } from 'lucide-react';
import { useStore } from '../data/store';
import Avatar from '../components/Avatar';

export default function Reader({ post }) {
  const { setView } = useStore();
  const author = post.profiles || {};

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: 20 }}>
      {/* Navbar */}
      <div style={{ position: 'sticky', top: 0, background: 'var(--bg-primary)', zIndex: 10, paddingBottom: 20, display: 'flex', alignItems: 'center', gap: 15 }}>
        <button onClick={() => setView('main')} className="btn-icon"><ArrowLeft /></button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar url={author.avatar_url} size={32} />
            <span style={{ fontWeight: 600, fontSize: 14 }} className="font-ui">{author.display_name}</span>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', paddingTop: 20 }}>
          <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 30, lineHeight: 1.2 }}>{post.title}</h1>
          <div style={{ fontSize: 20, lineHeight: 2, color: 'var(--text-primary)', whiteSpace: 'pre-wrap', opacity: 0.95 }}>
            {post.body}
          </div>
          
          <div style={{ marginTop: 60, paddingTop: 30, borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'center' }}>
              <button onClick={() => setView('echo', post)} className="btn-primary" style={{ borderRadius: 50, padding: '12px 30px' }}>মন্তব্য চাওক (Comments)</button>
          </div>
      </div>
    </div>
  );
}