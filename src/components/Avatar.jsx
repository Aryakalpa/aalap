import React from 'react';
export default function Avatar({ url, size = 40 }) {
  const style = { width: `${size}px`, height: `${size}px`, borderRadius: '50%', objectFit: 'cover', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-light)' };
  if (!url) return <div style={{ ...style, display: 'grid', placeItems: 'center', color: 'var(--text-muted)' }}>?</div>;
  return <img src={url} alt="User" style={style} />;
}