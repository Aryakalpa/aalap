import React from 'react';
export default function Avatar({ url, size = 40, border = true }) {
  const style = { 
    width: `${size}px`, height: `${size}px`, 
    borderRadius: '50%', objectFit: 'cover', 
    backgroundColor: 'var(--bg-secondary)', 
    border: border ? '2px solid var(--bg-card)' : 'none' 
  };
  
  if (!url) return (
    <div style={{ ...style, display: 'grid', placeItems: 'center', color: 'var(--text-tertiary)', fontSize: size/2.5, fontWeight: 'bold', fontFamily: 'var(--font-ui)' }}>
      A
    </div>
  );
  return <img src={url} alt="User" style={style} />;
}