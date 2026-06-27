import { getRandomCoverForPost } from '../utils/covers'

export default function CoverPreview({ title, category, author, presetId, src, alt = '', post }) {
  const imageSrc = src || (post ? getRandomCoverForPost(post) : getRandomCoverForPost({ title, category, author, presetId }))

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
