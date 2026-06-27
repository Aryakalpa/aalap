import { Link } from 'react-router-dom'
import { PenTool } from 'lucide-react'
import { getAvatarUrl } from '../utils/helpers'

export default function Avatar({ profile, size = 'md', clickable = false, showBadge = false, authorId = null }) {
  const sizes = {
    sm: '34px',
    md: '48px',
    lg: '80px',
    xl: '120px',
  }

  const stickerSizes = {
    sm: 14,
    md: 16,
    lg: 22,
    xl: 28,
  }

  const avatarUrl = getAvatarUrl(profile?.id, profile?.display_name)
  const displayName = profile?.display_name || 'অতিথি'
  const hasPublished = (profile?.post_count || 0) > 0

  const avatarStyle = {
    width: sizes[size],
    height: sizes[size],
    borderRadius: '50%',
    objectFit: 'cover',
    border: showBadge ? '2px solid var(--text-primary)' : '1px solid var(--border-color)',
    boxShadow: 'var(--shadow-sm)',
    transition: 'all 0.2s ease',
    cursor: clickable ? 'pointer' : 'default',
    background: 'var(--bg-secondary)',
  }

  const content = (
    <div style={{ position: 'relative', display: 'inline-block', lineHeight: 0 }}>
      <img src={avatarUrl} alt={displayName} style={avatarStyle} />
      {hasPublished && (
        <div
          title="প্ৰকাশিত লেখক"
          style={{
            position: 'absolute',
            right: '-2px',
            bottom: '-2px',
            width: `${stickerSizes[size]}px`,
            height: `${stickerSizes[size]}px`,
            borderRadius: '999px',
            background: '#4a7bd0',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid var(--bg-primary)',
            boxShadow: '0 4px 10px rgba(0,0,0,0.18)',
          }}
        >
          <PenTool size={Math.max(8, Math.floor(stickerSizes[size] * 0.52))} />
        </div>
      )}
    </div>
  )

  if (clickable && (authorId || profile?.id)) {
    return <Link to={`/profile/${authorId || profile?.id}`}>{content}</Link>
  }

  return content
}
