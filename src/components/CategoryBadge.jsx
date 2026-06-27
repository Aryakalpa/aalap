import { getCategoryColor } from '../utils/helpers'

export default function CategoryBadge({ category, size = 'sm' }) {
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

  return (
    <div
      style={{
        display: 'inline-block',
        padding: sizeStyle.padding,
        borderRadius: '999px',
        background: `${color}12`,
        border: `1px solid ${color}33`,
        fontSize: sizeStyle.fontSize,
        fontWeight: '700',
        color,
        whiteSpace: 'nowrap',
        lineHeight: '1.4',
      }}
    >
      {displayCategory}
    </div>
  )
}
