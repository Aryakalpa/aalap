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
            style={{ position: 'relative', display: 'inline-block' }}
            onMouseEnter={() => setShowTip(true)}
            onMouseLeave={() => setShowTip(false)}
        >
            <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: sizeStyle.padding,
                borderRadius: '2rem',
                background: `linear-gradient(135deg, ${badge.color}22, ${badge.color}44)`,
                border: `2px solid ${badge.color}`,
                fontSize: sizeStyle.fontSize,
                fontWeight: '700',
                color: badge.color,
                cursor: showTooltip ? 'pointer' : 'default',
                transition: 'all 0.2s ease',
                boxShadow: `0 2px 8px ${badge.color}33`
            }}>
                <span style={{ fontSize: sizeStyle.iconSize }}>{badge.icon}</span>
                <span>{badge.name}</span>
            </div>

            {showTooltip && showTip && (
                <div style={{
                    position: 'absolute',
                    bottom: 'calc(100% + 8px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 1rem',
                    boxShadow: 'var(--shadow-lg)',
                    whiteSpace: 'nowrap',
                    zIndex: 1000,
                    fontSize: '0.85rem'
                }}>
                    <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{badge.name}</div>
                    <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                        {postCount} টা লিখনি প্ৰকাশ কৰিছে
                    </div>
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 0,
                        height: 0,
                        borderLeft: '6px solid transparent',
                        borderRight: '6px solid transparent',
                        borderTop: '6px solid var(--border-color)'
                    }} />
                </div>
            )}
        </div>
    )
}
