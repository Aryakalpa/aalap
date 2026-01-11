import { getCategoryColor } from '../utils/helpers'

export default function CategoryBadge({ category, size = 'sm' }) {
    const categoryMap = {
        'poetry': 'কবিতা',
        'poem': 'কবিতা',
        'story': 'গল্প',
        'golpo': 'গল্প',
        'essay': 'প্ৰৱন্ধ',
        'article': 'প্ৰৱন্ধ',
        'travel': 'ভ্ৰমণ',
        'experience': 'অনুভৱ',
        'feelings': 'অনুভৱ',
        'misc': 'অন্যান্য'
    }

    const displayCategory = categoryMap[category?.toLowerCase()] || category || 'অন্যান্য'
    const color = getCategoryColor(displayCategory)

    const sizes = {
        sm: { fontSize: '0.75rem', padding: '0.3rem 0.75rem' },
        md: { fontSize: '0.9rem', padding: '0.5rem 1rem' }
    }

    const sizeStyle = sizes[size]

    return (
        <div style={{
            display: 'inline-block',
            padding: sizeStyle.padding,
            borderRadius: '2rem',
            background: `linear-gradient(135deg, ${color}15, ${color}25)`,
            border: `1.5px solid ${color}`,
            fontSize: sizeStyle.fontSize,
            fontWeight: '700',
            color: color,
            whiteSpace: 'nowrap',
            lineHeight: '1.4'
        }}>
            {displayCategory}
        </div>
    )
}
