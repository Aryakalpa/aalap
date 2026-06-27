const encodeSvg = (svg) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`

const escapeText = (text = '') =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

export const COVER_PRESETS = [
  {
    id: 'paper-ink',
    label: 'Paper Ink',
    bg: '#f6f1e8',
    fg: '#1d1916',
    accent: '#a65a3a',
  },
  {
    id: 'river-mist',
    label: 'River Mist',
    bg: '#e9eef2',
    fg: '#22303d',
    accent: '#6b7a8f',
  },
  {
    id: 'terracotta',
    label: 'Terracotta',
    bg: '#f1e0d6',
    fg: '#3f2418',
    accent: '#b96e4b',
  },
  {
    id: 'night-ink',
    label: 'Night Ink',
    bg: '#1a1715',
    fg: '#f3ebe2',
    accent: '#d0a06c',
  },
  {
    id: 'forest-cloth',
    label: 'Forest Cloth',
    bg: '#dde5dd',
    fg: '#243128',
    accent: '#556b5a',
  },
  {
    id: 'gold-manuscript',
    label: 'Gold Manuscript',
    bg: '#f3ead6',
    fg: '#32281b',
    accent: '#b38a3d',
  },
]

export function buildCoverSvg({
  title = 'আলাপ',
  category = 'অন্যান্য',
  author = '',
  presetId = 'paper-ink',
}) {
  const preset = COVER_PRESETS.find((p) => p.id === presetId) || COVER_PRESETS[0]
  const safeTitle = escapeText(title).slice(0, 120)
  const safeCategory = escapeText(category).slice(0, 40)
  const safeAuthor = escapeText(author).slice(0, 60)

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1500" viewBox="0 0 1200 1500">
    <rect width="1200" height="1500" fill="${preset.bg}"/>
    <rect x="80" y="80" width="1040" height="1340" rx="28" fill="none" stroke="${preset.accent}" stroke-width="3" opacity="0.55"/>
    <rect x="120" y="120" width="960" height="1260" rx="16" fill="none" stroke="${preset.accent}" stroke-width="1.5" opacity="0.22"/>

    <path d="M120 240 H1080" stroke="${preset.accent}" stroke-width="3" opacity="0.35"/>
    <path d="M120 1260 H1080" stroke="${preset.accent}" stroke-width="3" opacity="0.2"/>

    <circle cx="190" cy="170" r="12" fill="${preset.accent}" opacity="0.85"/>
    <circle cx="1010" cy="170" r="12" fill="${preset.accent}" opacity="0.5"/>

    <text x="150" y="200" fill="${preset.accent}" font-family="Georgia, serif" font-size="44" letter-spacing="7">আলাপ</text>

    <text x="150" y="320" fill="${preset.accent}" font-family="Arial, sans-serif" font-size="30" letter-spacing="4">${safeCategory}</text>

    <foreignObject x="150" y="410" width="900" height="600">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: Georgia, 'Times New Roman', serif; color:${preset.fg}; font-size:88px; line-height:1.12; font-weight:700; word-break:break-word;">
        ${safeTitle}
      </div>
    </foreignObject>

    <rect x="150" y="1080" width="220" height="4" fill="${preset.accent}" opacity="0.75"/>
    <text x="150" y="1160" fill="${preset.fg}" font-family="Arial, sans-serif" font-size="34" opacity="0.85">${safeAuthor}</text>
  </svg>`

  return encodeSvg(svg)
}

export function isGeneratedCover(value = '') {
  return typeof value === 'string' && value.startsWith('data:image/svg+xml')
}
