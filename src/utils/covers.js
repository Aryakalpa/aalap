const encodeSvg = (svg) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`

export const COVER_IMAGES = {
  'starry-night': '/covers/starry-night-lowpoly.jpg',
  'sunset': '/covers/sunset-lowpoly.jpg',
  'meadow': '/covers/meadow-lowpoly.jpg',
}

export const COVER_PRESETS = [
  { id: 'paper-ink', label: 'Paper Ink', bg: '#f6f1e8', accent: '#a65a3a', soft: '#ead7cb', line: '#d4b9a7' },
  { id: 'river-mist', label: 'River Mist', bg: '#e9eef2', accent: '#6b7a8f', soft: '#d7e0e8', line: '#b8c6d3' },
  { id: 'terracotta', label: 'Terracotta', bg: '#f1e0d6', accent: '#b96e4b', soft: '#ebcfc0', line: '#d8ab92' },
  { id: 'night-ink', label: 'Night Ink', bg: '#1a1715', accent: '#d0a06c', soft: '#2b2521', line: '#5c4737' },
  { id: 'forest-cloth', label: 'Forest Cloth', bg: '#dde5dd', accent: '#556b5a', soft: '#cfdbcf', line: '#a9bca9' },
  { id: 'gold-manuscript', label: 'Gold Manuscript', bg: '#f3ead6', accent: '#b38a3d', soft: '#eadfbe', line: '#d7c28c' },
  { id: 'starry-night', label: '✨ Starry Night', bg: '#1a1a2e', accent: '#e8d5b7', soft: '#2d2d5a', line: '#4a4a8a', isImage: true },
  { id: 'sunset', label: '🌅 Sunset', bg: '#ff7e5f', accent: '#feb47b', soft: '#ff9068', line: '#ffcb8e', isImage: true },
  { id: 'meadow', label: '🌿 Meadow', bg: '#98d8aa', accent: '#f7f7dc', soft: '#c9e4ca', line: '#7bc88f', isImage: true },
]

const patternByCategory = (category = '', accent = '#a65a3a', line = '#d4b9a7') => {
  const key = String(category).toLowerCase()

  if (key.includes('কবিতা') || key.includes('poetry') || key.includes('poem')) {
    return `
      <path d="M120 700 C280 540, 410 810, 560 650 S850 470, 1020 630 S1270 790, 1480 610" fill="none" stroke="${accent}" stroke-width="10" opacity="0.24" stroke-linecap="round"/>
      <path d="M180 510 C350 380, 470 630, 620 520 S930 360, 1110 510 S1300 650, 1440 540" fill="none" stroke="${line}" stroke-width="6" opacity="0.22" stroke-linecap="round"/>
    `
  }

  if (key.includes('গল্প') || key.includes('story') || key.includes('golpo')) {
    return `
      <rect x="110" y="120" width="380" height="660" rx="30" fill="${accent}" opacity="0.08"/>
      <rect x="220" y="210" width="380" height="520" rx="30" fill="${accent}" opacity="0.12"/>
      <rect x="330" y="150" width="380" height="610" rx="30" fill="${line}" opacity="0.18"/>
    `
  }

  if (key.includes('প্ৰৱন্ধ') || key.includes('essay') || key.includes('article')) {
    return `
      <path d="M140 180 H1460" stroke="${line}" stroke-width="6" opacity="0.35"/>
      <path d="M140 280 H1200" stroke="${line}" stroke-width="16" opacity="0.18" stroke-linecap="round"/>
      <path d="M140 360 H1360" stroke="${line}" stroke-width="16" opacity="0.18" stroke-linecap="round"/>
      <path d="M140 440 H1180" stroke="${line}" stroke-width="16" opacity="0.18" stroke-linecap="round"/>
      <path d="M140 520 H1280" stroke="${line}" stroke-width="16" opacity="0.18" stroke-linecap="round"/>
      <path d="M140 600 H980" stroke="${line}" stroke-width="16" opacity="0.18" stroke-linecap="round"/>
    `
  }

  return `
    <circle cx="1230" cy="240" r="170" fill="${accent}" opacity="0.08"/>
    <circle cx="1100" cy="520" r="120" fill="${line}" opacity="0.14"/>
    <circle cx="1360" cy="590" r="90" fill="${accent}" opacity="0.12"/>
  `
}

export function buildCoverSvg({ category = 'অন্যান্য', presetId = 'paper-ink' }) {
  const preset = COVER_PRESETS.find((p) => p.id === presetId) || COVER_PRESETS[0]
  const safeCategory = String(category || 'অন্যান্য')

  // Return image path for image-based presets
  if (preset.isImage && COVER_IMAGES[preset.id]) {
    return COVER_IMAGES[preset.id]
  }

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
    <rect width="1600" height="900" fill="${preset.bg}"/>
    <rect x="34" y="34" width="1532" height="832" rx="26" fill="none" stroke="${preset.line}" stroke-width="2" opacity="0.55"/>

    <rect x="90" y="90" width="520" height="720" rx="34" fill="${preset.soft}" opacity="0.8"/>
    <rect x="130" y="130" width="440" height="640" rx="26" fill="none" stroke="${preset.accent}" stroke-width="2" opacity="0.16"/>

    ${patternByCategory(safeCategory, preset.accent, preset.line)}

    <rect x="110" y="120" width="160" height="40" rx="20" fill="${preset.bg}" opacity="0.92" stroke="${preset.accent}" stroke-width="1.5"/>
    <text x="145" y="147" fill="${preset.accent}" font-family="Arial, sans-serif" font-size="22" letter-spacing="3">${safeCategory}</text>

    <text x="126" y="750" fill="${preset.accent}" font-family="Georgia, serif" font-size="38" letter-spacing="6" opacity="0.92">আলাপ</text>
    <path d="M126 770 H314" stroke="${preset.accent}" stroke-width="3" opacity="0.5"/>
  </svg>`

  return encodeSvg(svg)
}

export function isGeneratedCover(value = '') {
  if (typeof value !== 'string') return false
  // Handle both SVG data URIs and image paths
  return value.startsWith('data:image/svg+xml') || value.startsWith('/covers/')
}

export function isImageCover(value = '') {
  return typeof value === 'string' && value.startsWith('/covers/')
}
