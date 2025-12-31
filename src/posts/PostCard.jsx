import Avatar from '../components/Avatar';

export default function PostCard({ post }) {
  return (
    <div style={{ padding: '10px', background: '#333', borderRadius: '4px' }}>
       <p style={{ color: '#ccc' }}>{post.body?.substring(0, 50)}...</p>
       <div style={{ marginTop: '10px', display: 'flex', gap: '10px', fontSize: '12px' }}>
          <span>❤️ {post.likes_count || 0}</span>
          <span>💬 {post.comments_count || 0}</span>
       </div>
    </div>
  );
}