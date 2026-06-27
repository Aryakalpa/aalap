export const COVER_IMAGES = {
  'starry-night': '/covers/starry-night-lowpoly.jpg',
  'sunset': '/covers/sunset-lowpoly.jpg',
  'meadow': '/covers/meadow-lowpoly.jpg',
  'ember-dusk': '/covers/ember-dusk-lowpoly.png',
  'aurora-peak': '/covers/aurora-peak-lowpoly.png',
  'lavender-field': '/covers/lavender-field-lowpoly.png',
  'canyon-bloom': '/covers/canyon-bloom-lowpoly.png',
  'monsoon-vale': '/covers/monsoon-vale-lowpoly.png',
  'iceberg': '/covers/iceberg-lowpoly.png',
}

export const HOME_COVER_IDS = Object.keys(COVER_IMAGES)

export const getRandomCoverForPost = (post) => {
  const seedSource = String(post?.id || post?.title || post?.created_at || 'aalap')
  let hash = 0

  for (let i = 0; i < seedSource.length; i += 1) {
    hash = (hash * 31 + seedSource.charCodeAt(i)) >>> 0
  }

  return COVER_IMAGES[HOME_COVER_IDS[hash % HOME_COVER_IDS.length]]
}

export function isGeneratedCover(value = '') {
  if (typeof value !== 'string') return false
  return value.startsWith('data:image/svg+xml') || value.startsWith('/covers/')
}

export function isImageCover(value = '') {
  return typeof value === 'string' && value.startsWith('/covers/')
}
