export default function PostCard({ post }) {
  return (
    <div style={{ 
      background: '#222', 
      border: '2px solid lime', /* Neon Green Border */
      padding: '20px', 
      marginBottom: '20px', 
      borderRadius: '8px',
      color: '#fff',
      minHeight: '100px',
      display: 'block'
    }}>
      <h2 style={{ color: 'lime', margin: '0 0 10px 0' }}>{post.title}</h2>
      <p style={{ color: '#ccc' }}>{post.body ? post.body.substring(0, 100) : 'No content'}...</p>
      <div style={{ marginTop: '10px', fontSize: '12px', color: '#888' }}>
        DEBUG MODE: ID {post.id}
      </div>
    </div>
  );
}