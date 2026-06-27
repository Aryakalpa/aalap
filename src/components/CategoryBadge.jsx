import { getCategoryColor } from '../utils/helpers'

export default function CategoryBadge({ category, size = 'sm', variant = 'default' }) {
  const categoryMap = {
    poetry: 'কবিতা',
    poem: 'কবিতা',
    story: 'গল্প',
    golpo: 'গল্প',
    essay: 'প্ৰৱন্ধ',
    article: 'প্ৰৱন্ধ',
    travel: 'ভ্ৰমণ',
    experience: 'অনুভৱ',
    feelings: 'অনুভৱ',
    misc: 'অন্যান্য',
  }

  const displayCategory = categoryMap[category?.toLowerCase()] || category || 'অন্যান্য'
  const color = getCategoryColor(displayCategory)

  const sizes = {
    sm: { fontSize: '0.74rem', padding: '0.34rem 0.7rem' },
    md: { fontSize: '0.88rem', padding: '0.42rem 0.9rem' },
  }

  const sizeStyle = sizes[size]

  const overlayStyle = variant === 'overlay'
    ? {
        background: 'rgba(255, 255, 255, 0.16)',
        border: '1px solid rgba(255, 255, 255, 0.24)',
        color: '#ffffff',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        textShadow: '0 1px 10px rgba(0,0,0,0.18)',
      }
    : {
        background: `${color}12`,
        border: `1px solid ${color}33`,
        color,
      }

  return (
    <div
      style={{
        display: 'inline-block',
        padding: sizeStyle.padding,
        borderRadius: '999px',
        fontSize: sizeStyle.fontSize,
        fontWeight: '700',
        whiteSpace: 'nowrap',
        lineHeight: '1.4',
        ...overlayStyle,
      }}
    >
      {displayCategory}
    </div>
  )
}
