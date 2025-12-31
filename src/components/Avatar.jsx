import React from 'react';
export default function Avatar({ url, size = 40 }) {
  const style = { width: `${size}px`, height: `${size}px`, borderRadius: '50%', objectFit: 'cover', backgroundColor: 'rgba(128,128,128,0.2)', border: '1px solid rgba(128,128,128,0.1)' };
  if (!url) return <div style={{ ...style, display: 'grid', placeItems: 'center', color: '#666', fontSize: size/2 }}>?</div>;
  return <img src={url} alt="User" style={style} />;
}