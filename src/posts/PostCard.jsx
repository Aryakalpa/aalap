import { useState } from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import Avatar from '../components/Avatar';

export default function PostCard({ post }) {
  const author = post.profiles || {};
  
  return (
    <div className="notepad-card" style={{ backgroundColor: '#121212', color: 'white' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
          <Avatar url={author.avatar_url} size={32} />
          <div>
             <div style={{ fontWeight: 'bold', color: 'white' }}>{author.display_name || 'Author'}</div>
             <div style={{ fontSize: '12px', color: '#888' }}>{new Date(post.created_at).toLocaleDateString()}</div>
          </div>
      </div>

      {/* CONTENT */}
      <h3 style={{ margin: '0 0 10px 0', color: 'white', fontSize: '20px' }}>{post.title}</h3>
      <p style={{ color: '#ccc', lineHeight: '1.6', marginBottom: '20px' }}>
         {post.body}
      </p>

      {/* FOOTER */}
      <div style={{ display: 'flex', gap: '20px', borderTop: '1px solid #333', paddingTop: '10px' }}>
         <div style={{ display: 'flex', gap: '5px', color: '#888' }}>
            <Heart size={18} /> {post.likes_count || 0}
         </div>
         <div style={{ display: 'flex', gap: '5px', color: '#888' }}>
            <MessageCircle size={18} /> {post.comments_count || 0}
         </div>
      </div>

    </div>
  );
}