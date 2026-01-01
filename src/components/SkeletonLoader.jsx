export default function SkeletonLoader() {
  return (
    <div className="story-card" style={{ padding: 20, border: '1px solid var(--border-light)' }}>
      {/* Header */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 15 }}>
        <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%' }}></div>
        <div style={{ flex: 1 }}>
            <div className="skeleton" style={{ width: '40%', height: 14, marginBottom: 6 }}></div>
            <div className="skeleton" style={{ width: '20%', height: 10 }}></div>
        </div>
      </div>
      {/* Body */}
      <div className="skeleton" style={{ width: '80%', height: 24, marginBottom: 10 }}></div>
      <div className="skeleton" style={{ width: '100%', height: 14, marginBottom: 6 }}></div>
      <div className="skeleton" style={{ width: '100%', height: 14, marginBottom: 6 }}></div>
      <div className="skeleton" style={{ width: '60%', height: 14 }}></div>
      {/* Footer */}
      <div style={{ marginTop: 20, display: 'flex', gap: 20 }}>
          <div className="skeleton" style={{ width: 30, height: 20 }}></div>
          <div className="skeleton" style={{ width: 30, height: 20 }}></div>
      </div>
    </div>
  );
}