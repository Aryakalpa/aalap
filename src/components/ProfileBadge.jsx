import Badge from './Badge'

export default function ProfileBadge({ badge, achievements }) {
    return (
        <div className="card" style={{ background: 'var(--depth-100)', padding: '1.25rem' }}>
            {/* Main Badge */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{
                    display: 'inline-flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1.25rem 2rem',
                    borderRadius: 'var(--radius-lg)',
                    background: `linear-gradient(135deg, ${badge.color}15, ${badge.color}25)`,
                    border: '2px solid ' + badge.color,
                    boxShadow: `0 4px 12px ${badge.color}22`
                }}>
                    <div style={{ fontSize: '2.5rem' }}>{badge.icon}</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '900', color: badge.color, letterSpacing: '0.05em' }}>{badge.name.toUpperCase()}</div>
                </div>
            </div>

            {/* Achievements */}
            {achievements.length > 0 && (
                <div>
                    <h4 style={{ marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-tertiary)', textAlign: 'center', textTransform: 'uppercase', fontWeight: '800' }}>আনলক কৰা কৃতিত্বসমূহ</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem' }}>
                        {achievements.map((achievement, idx) => (
                            <div
                                key={idx}
                                className="card"
                                style={{
                                    padding: '0.75rem',
                                    textAlign: 'center',
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-md)'
                                }}
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
