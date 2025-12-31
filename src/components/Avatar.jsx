import React from 'react';
export default function Avatar({ url, size = 40 }) {
  const style = { width: `${size}px`, height: `${size}px`, borderRadius: '50%', objectFit: 'cover', backgroundColor: '#333', border: '1px solid #444' };
  if (!url) return <div style={{ ...style, display: 'grid', placeItems: 'center', color: '#666' }}>?</div>;
  return <img src={url} alt="User" style={style} />;
}