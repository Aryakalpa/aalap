import { buildCoverSvg } from '../utils/covers'

export default function CoverPreview({ title, category, author, presetId, src, alt = '' }) {
  const imageSrc = src || buildCoverSvg({ title, category, author, presetId })

  return (
    <img
      src={imageSrc}
      alt={alt}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
      }}
    />
  )
}
