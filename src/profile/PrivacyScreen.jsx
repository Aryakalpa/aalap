import { ArrowLeft, Lock, Eye, Server } from 'lucide-react';
import { useStore } from '../data/store';

export default function PrivacyScreen() {
  const { setView } = useStore();

  return (
    <div className="main-content" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
        <button onClick={() => setView('profile')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-sec)' }}><ArrowLeft size={24} /></button>
        <h2 style={{ fontSize: '22px', fontWeight: 700, margin: 0, fontFamily: 'var(--font-serif)' }}>গোপনীয়তা নীতি</h2>
      </div>

      <div className="soul-card">
        <div style={{ marginBottom: '30px' }}>
            <Lock size={32} color="var(--accent)" style={{ marginBottom: '15px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px', fontFamily: 'var(--font-serif)' }}>আপোনাৰ তথ্য সুৰক্ষিত</h3>
            <p style={{ color: 'var(--text-sec)', lineHeight: '1.6', fontSize: '15px' }}>
                আলাপ (Aalap) ত আমি আপোনাৰ ব্যক্তিগত তথ্যৰ ওপৰত সম্পূৰ্ণ নিয়ন্ত্ৰণ দিওঁ। আমি কোনো বিজ্ঞাপনৰ বাবে আপোনাৰ তথ্য বিক্ৰী নকৰো।
            </p>
        </div>

        <div style={{ marginBottom: '30px' }}>
            <Eye size={32} color="var(--accent)" style={{ marginBottom: '15px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px', fontFamily: 'var(--font-serif)' }}>দৃশ্যমানতা</h3>
            <p style={{ color: 'var(--text-sec)', lineHeight: '1.6', fontSize: '15px' }}>
                আপুনি লিখা গল্প আৰু কবিতাবোৰ ৰাজহুৱা (Public)। কিন্তু আপোনাৰ ইমেইল ঠিকনা আমি কাকো নেদেখুৱাও।
            </p>
        </div>

        <div>
            <Server size={32} color="var(--accent)" style={{ marginBottom: '15px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px', fontFamily: 'var(--font-serif)' }}>তথ্য সংৰক্ষণ</h3>
            <p style={{ color: 'var(--text-sec)', lineHeight: '1.6', fontSize: '15px' }}>
                সকলো তথ্য Supabase ৰ সুৰক্ষিত চাৰ্ভাৰত এনক্ৰিপ্ট (Encrypt) কৰি ৰখা হয়।
            </p>
        </div>
      </div>
    </div>
  );
}