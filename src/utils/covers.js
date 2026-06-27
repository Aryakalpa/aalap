const encodeSvg = (svg) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`

const escapeText = (text = '') =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

export const COVER_PRESETS = [
  { id: 'paper-ink', label: 'Paper Ink', bg: '#f6f1e8', fg: '#1d1916', accent: '#a65a3a', accentSoft: '#ead7cb' },
  { id: 'river-mist', label: 'River Mist', bg: '#e9eef2', fg: '#22303d', accent: '#6b7a8f', accentSoft: '#d6dfe7' },
  { id: 'terracotta', label: 'Terracotta', bg: '#f1e0d6', fg: '#3f2418', accent: '#b96e4b', accentSoft: '#ecd0c1' },
  { id: 'night-ink', label: 'Night Ink', bg: '#1a1715', fg: '#f3ebe2', accent: '#d0a06c', accentSoft: '#2b2521' },
  { id: 'forest-cloth', label: 'Forest Cloth', bg: '#dde5dd', fg: '#243128', accent: '#556b5a', accentSoft: '#d0dacf' },
  { id: 'gold-manuscript', label: 'Gold Manuscript', bg: '#f3ead6', fg: '#32281b', accent: '#b38a3d', accentSoft: '#eadfbe' },
]

export function buildCoverSvg({ title = 'আলাপ', category = 'অন্যান্য', author = '', presetId = 'paper-ink' }) {
  const preset = COVER_PRESETS.find((p) => p.id === presetId) || COVER_PRESETS[0]
  const safeTitle = escapeText(title).slice(0, 120)
  const safeCategory = escapeText(category).slice(0, 40)
  const safeAuthor = escapeText(author).slice(0, 60)

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
    <rect width="1600" height="900" fill="${preset.bg}"/>
    <rect x="40" y="40" width="1520" height="820" rx="28" fill="none" stroke="${preset.accent}" stroke-width="2" opacity="0.32"/>

    <rect x="80" y="90" width="520" height="720" rx="22" fill="${preset.accentSoft}" opacity="0.7"/>
    <rect x="640" y="120" width="880" height="180" rx="18" fill="${preset.accent}" opacity="0.08"/>
    <rect x="640" y="340" width="820" height="18" rx="9" fill="${preset.accent}" opacity="0.14"/>
    <rect x="640" y="386" width="720" height="18" rx="9" fill="${preset.accent}" opacity="0.1"/>
    <rect x="640" y="432" width="640" height="18" rx="9" fill="${preset.accent}" opacity="0.08"/>

    <circle cx="1380" cy="170" r="110" fill="${preset.accent}" opacity="0.08"/>
    <circle cx="1320" cy="170" r="58" fill="${preset.accent}" opacity="0.18"/>

    <text x="120" y="170" fill="${preset.accent}" font-family="Arial, sans-serif" font-size="28" letter-spacing="5">${safeCategory}</text>
    <text x="120" y="760" fill="${preset.accent}" font-family="Georgia, serif" font-size="40" letter-spacing="6">আলাপ</text>

    <foreignObject x="120" y="240" width="420" height="420">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: Georgia, 'Times New Roman', serif; color:${preset.fg}; font-size:64px; line-height:1.08; font-weight:700; word-break:break-word; display:flex; align-items:flex-start; height:100%;">
        ${safeTitle}
      </div>
    </foreignObject>

    <text x="640" y="610" fill="${preset.fg}" font-family="Georgia, serif" font-size="92" font-weight="700">${safeTitle.slice(0, 24)}</text>
    <text x="640" y="690" fill="${preset.fg}" font-family="Arial, sans-serif" font-size="34" opacity="0.75">${safeAuthor}</text>
    <rect x="640" y="735" width="220" height="4" fill="${preset.accent}" opacity="0.65"/>
  </svg>`

  return encodeSvg(svg)
}

export function isGeneratedCover(value = '') {
  return typeof value === 'string' && value.startsWith('data:image/svg+xml')
}
