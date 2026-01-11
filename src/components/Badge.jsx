import { useState } from 'react'
import { getBadgeLevel } from '../utils/helpers'

export default function Badge({ postCount, size = 'md', showTooltip = true }) {
    const [showTip, setShowTip] = useState(false)
    const badge = getBadgeLevel(postCount || 0)

    const sizes = {
        sm: { fontSize: '0.7rem', padding: '0.25rem 0.5rem', iconSize: '0.9rem' },
        md: { fontSize: '0.85rem', padding: '0.4rem 0.75rem', iconSize: '1rem' },
        lg: { fontSize: '1rem', padding: '0.5rem 1rem', iconSize: '1.2rem' }
    }

    const sizeStyle = sizes[size]

    return (
        <div
            style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
            onMouseEnter={() => setShowTip(true)}
            onMouseLeave={() => setShowTip(false)}
        >
            <div style={{
                width: size === 'sm' ? '8px' : '10px',
                height: size === 'sm' ? '8px' : '10px',
                borderRadius: '50%',
                background: badge.color,
                boxShadow: `0 0 10px ${badge.color}66`,
                cursor: showTooltip ? 'pointer' : 'default',
                transition: 'all 0.2s ease',
            }} />

            {showTooltip && showTip && (
                <div style={{
                    position: 'absolute',
                    bottom: 'calc(100% + 12px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.6rem 0.8rem',
                    boxShadow: 'var(--shadow-lg)',
                    whiteSpace: 'nowrap',
                    zIndex: 2000,
                    fontSize: '0.75rem',
                    textAlign: 'center'
                }}>
                    <div style={{ fontWeight: '800', color: badge.color, marginBottom: '0.2rem' }}>{badge.name}</div>
                    <div style={{ color: 'var(--text-tertiary)' }}>{postCount} টা লিখনি</div>
                </div>
            )}
        </div>
    )
}
