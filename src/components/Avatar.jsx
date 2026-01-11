import { Link } from 'react-router-dom'
import { getAvatarUrl } from '../utils/helpers'

export default function Avatar({ profile, size = 'md', clickable = false, showBadge = false, authorId = null }) {
    const sizes = {
        sm: '32px',
        md: '48px',
        lg: '80px',
        xl: '120px'
    }

    const avatarUrl = profile?.avatar_url || getAvatarUrl(profile?.id, profile?.display_name)
    const displayName = profile?.display_name || 'অতিথি'
    const username = profile?.username || profile?.id

    const avatarStyle = {
        width: sizes[size],
        height: sizes[size],
        borderRadius: '50%',
        objectFit: 'cover',
        border: showBadge ? '3px solid var(--accent)' : '2px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all 0.2s ease',
        cursor: clickable ? 'pointer' : 'default'
    }

    const hoverStyle = clickable ? {
        transform: 'scale(1.05)',
        boxShadow: 'var(--shadow-md)',
        borderColor: 'var(--accent)'
    } : {}

    const content = (
        <img
            src={avatarUrl}
            alt={displayName}
            style={avatarStyle}
            onMouseEnter={(e) => {
                if (clickable) {
                    Object.assign(e.target.style, hoverStyle)
                }
            }}
            onMouseLeave={(e) => {
                if (clickable) {
                    Object.assign(e.target.style, avatarStyle)
                }
            }}
        />
    )

    if (clickable && (authorId || profile?.id)) {
        return <Link to={`/profile/${authorId || profile?.id}`}>{content}</Link>
    }

    return content
}
