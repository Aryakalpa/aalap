import Badge from './Badge'

export default function ProfileBadge({ badge, achievements }) {
    return (
        <div className="card" style={{ background: 'var(--depth-100)', padding: '2rem' }}>
            {/* Main Badge */}
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <div style={{
                    display: 'inline-flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '2rem',
                    borderRadius: 'var(--radius-lg)',
                    background: `linear-gradient(135deg, ${badge.color}15, ${badge.color}25)`,
                    border: `3px solid ${badge.color}`,
                    boxShadow: `0 8px 24px ${badge.color}44`
                }}>
                    <div style={{ fontSize: '4rem' }}>{badge.icon}</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '800', color: badge.color }}>{badge.name}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>{badge.tier.toUpperCase()} TIER</div>
                </div>
            </div>

            {/* Achievements */}
            {achievements.length > 0 && (
                <div>
                    <h4 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>আনলক কৰা কৃতিত্বসমূহ</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
                        {achievements.map((achievement, idx) => (
                            <div
                                key={idx}
                                className="card"
                                style={{
                                    padding: '1.5rem',
                                    textAlign: 'center',
                                    background: 'var(--bg-secondary)',
                                    border: '2px solid var(--border-color)',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)'
                                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
                                    e.currentTarget.style.borderColor = 'var(--accent)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)'
                                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                                    e.currentTarget.style.borderColor = 'var(--border-color)'
                                }}
                            >
                                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{achievement.icon}</div>
                                <div style={{ fontWeight: '700', marginBottom: '0.5rem', fontSize: '0.95rem' }}>{achievement.name}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{achievement.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
