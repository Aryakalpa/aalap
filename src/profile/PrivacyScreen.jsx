import { ArrowLeft, Lock, Eye, Server } from 'lucide-react';

export default function PrivacyScreen() {
  return (
    <div className="main-content" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
        <button onClick={() => window.history.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-sec)' }}>
            <ArrowLeft size={24} />
        </button>
        <h2 style={{ fontSize: '22px', fontWeight: 700, margin: 0, fontFamily: 'var(--font-serif)' }}>Privacy</h2>
      </div>
      <div className="soul-card">
        <p style={{ color: 'var(--text-sec)', lineHeight: '1.6' }}>Your privacy is paramount. We do not sell data.</p>
      </div>
    </div>
  );
}