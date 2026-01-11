// Avatar generation using DiceBear
export const getAvatarUrl = (userId, displayName) => {
    const seed = userId || displayName || 'default'
    return `https://api.dicebear.com/7.x/adventurer-neutral/png?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`
}

// Word count calculator
export const countWords = (text) => {
    if (!text) return 0
    return text.trim().split(/\s+/).filter(word => word.length > 0).length
}

// Reading time estimator
export const estimateReadingTime = (text) => {
    const words = countWords(text)
    const minutes = Math.ceil(words / 200)
    return `পঢ়িবলৈ ${minutes} মিনিট`
}

// Format date in Assamese with Roman numbers
export const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'এতিয়াই'
    if (diffMins < 60) return `${diffMins} মি: আগতে`
    if (diffHours < 24) return `${diffHours} ঘণ্টা আগতে`
    if (diffDays < 7) return `${diffDays} দিন আগতে`

    return date.toLocaleDateString('as-IN', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    }).replace(/[০-৯]/g, d => '০১২৩৪৫৬৭৮৯'.indexOf(d)) // Fallback if locale uses native numbers
}

// Truncate text
export const truncateText = (text, maxLength = 150) => {
    if (!text || text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + '...'
}

// Generate excerpt from content
export const generateExcerpt = (content, maxLength = 200) => {
    const plainText = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
    return truncateText(plainText, maxLength)
}

// Badge levels based on post count (Assamese)
export const getBadgeLevel = (postCount) => {
    if (postCount >= 100) return { name: 'শব্দৰ যাদুকৰ', color: '#FFD700', icon: '👑', tier: 'legendary' }
    if (postCount >= 50) return { name: 'প্ৰতিষ্ঠিত লেখক', color: '#C0C0C0', icon: '⭐', tier: 'master' }
    if (postCount >= 20) return { name: 'উদীয়মান লেখক', color: '#CD7F32', icon: '✨', tier: 'expert' }
    if (postCount >= 5) return { name: 'গল্পকাৰ', color: '#58cc02', icon: '📖', tier: 'writer' }
    return { name: 'নৱাগত', color: '#64748b', icon: '✍️', tier: 'beginner' }
}

// Achievement badges
export const getAchievements = (profile) => {
    const achievements = []

    if (profile.post_count >= 1) achievements.push({ name: 'প্ৰথম খোজ', icon: '🎉', desc: 'প্ৰথম লিখনি প্ৰকাশ কৰা' })
    if (profile.post_count >= 10) achievements.push({ name: 'অবিৰাম লেখক', icon: '📚', desc: '10টা লিখনি সম্পূৰ্ণ কৰা' })
    if (profile.post_count >= 50) achievements.push({ name: 'মাষ্টাৰ', icon: '🏆', desc: '50টা লিখনি প্ৰকাশ কৰা' })
    if (profile.followers_count >= 100) achievements.push({ name: 'জনপ্ৰিয়', icon: '🌟', desc: '100 অনুসৰণকাৰী লাভ কৰা' })
    if (profile.followers_count >= 1000) achievements.push({ name: 'তাৰকা', icon: '💫', desc: '1000 অনুসৰণকাৰী লাভ কৰা' })

    return achievements
}

// Format number for display (compact notation)
export const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
}

// Categories from database
export const CATEGORIES = [
    { id: 'poetry', label: 'কবিতা', aliases: ['poem', 'Poetry'] },
    { id: 'story', label: 'গল্প', aliases: ['Story', 'golpo'] },
    { id: 'essay', label: 'প্ৰৱন্ধ', aliases: ['Article', 'article'] },
    { id: 'misc', label: 'অন্যান্য', aliases: ['Misc', 'other'] },
]

// Category colors for badges
export const getCategoryColor = (categoryId) => {
    const colors = {
        'poetry': '#8b5cf6',
        'poem': '#8b5cf6',
        'story': '#ec4899',
        'golpo': '#ec4899',
        'essay': '#3b82f6',
        'article': '#3b82f6',
        'misc': '#f59e0b',
        'অন্যান্য': '#f59e0b',
        'কবিতা': '#8b5cf6',
        'গল্প': '#ec4899',
        'প্ৰৱন্ধ': '#3b82f6'
    }
    return colors[categoryId?.toLowerCase()] || '#64748b'
}

// Share functions
export const shareToWhatsApp = (title, url) => {
    const text = encodeURIComponent(`"${title}" পঢ়ক আলাপত - ${url}`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
}

export const shareToTelegram = (title, url) => {
    const text = encodeURIComponent(`"${title}" পঢ়ক আলাপত`)
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${text}`, '_blank')
}

export const copyToClipboard = async (url) => {
    try {
        await navigator.clipboard.writeText(url)
        return true
    } catch {
        return false
    }
}
