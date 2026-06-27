export default function ProfileBadge({ badge, achievements }) {
  return (
    <div className="panel" style={{ padding: '1.25rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <div
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.7rem',
            padding: '1.25rem 2rem',
            borderRadius: '20px',
            background: `${badge.color}10`,
            border: `1px solid ${badge.color}44`,
          }}
        >
          <div style={{ fontSize: '2.4rem' }}>{badge.icon}</div>
          <div style={{ fontSize: '1.05rem', fontWeight: '900', color: badge.color }}>{badge.name}</div>
        </div>
      </div>

      {achievements.length > 0 && (
        <div>
          <h4 style={{ marginBottom: '1rem', fontSize: '0.8rem', color: 'var(--text-tertiary)', textAlign: 'center', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.08em' }}>
            আনলক কৰা কৃতিত্বসমূহ
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem' }}>
            {achievements.map((achievement, idx) => (
              <div
                key={idx}
                className="card"
                style={{ padding: '0.8rem', textAlign: 'center' }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>{achievement.icon}</div>
                <div style={{ fontWeight: '800', fontSize: '0.75rem', color: 'var(--text-primary)' }}>{achievement.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
