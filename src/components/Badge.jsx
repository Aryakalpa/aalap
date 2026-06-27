import { useState } from 'react'
import { getBadgeLevel } from '../utils/helpers'

export default function Badge({ postCount, size = 'md', showTooltip = true }) {
  const [showTip, setShowTip] = useState(false)
  const badge = getBadgeLevel(postCount || 0)

  return (
    <div
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
      onMouseEnter={() => setShowTip(true)}
      onMouseLeave={() => setShowTip(false)}
    >
      <div
        style={{
          width: size === 'sm' ? '8px' : '10px',
          height: size === 'sm' ? '8px' : '10px',
          borderRadius: '50%',
          background: badge.color,
          cursor: showTooltip ? 'pointer' : 'default',
        }}
      />

      {showTooltip && showTip && (
        <div
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 12px)',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--surface-raised)',
            border: '1px solid var(--border-color)',
            borderRadius: '14px',
            padding: '0.6rem 0.8rem',
            boxShadow: 'var(--shadow-lg)',
            whiteSpace: 'nowrap',
            zIndex: 2000,
            fontSize: '0.75rem',
            textAlign: 'center',
          }}
        >
          <div style={{ fontWeight: '800', color: badge.color, marginBottom: '0.2rem' }}>{badge.name}</div>
          <div style={{ color: 'var(--text-tertiary)' }}>{postCount} টা লিখনি</div>
        </div>
      )}
    </div>
  )
}
