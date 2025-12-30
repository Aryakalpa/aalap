import { User } from 'lucide-react';

export default function Avatar({ url, size = 48 }) {
  // If no URL, show placeholder. 
  // If URL exists, show image. No more Supabase downloading logic.
  
  return (
    <div style={{ width: size, height: size, minWidth: size, minHeight: size, borderRadius: '50%', overflow: 'hidden', background: 'var(--card)', border: '1px solid var(--border)', display: 'grid', placeItems: 'center' }}>
      {url ? (
        <img 
            src={url} 
            alt="Avatar" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      ) : (
        <User size={size * 0.5} color="var(--text-sec)" />
      )}
    </div>
  );
}