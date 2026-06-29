export const slugifyTitle = (title = '') => {
  const slug = String(title || '')
    .trim()
    .toLowerCase()
    .replace(/[\u2018\u2019']/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90)

  return slug || 'post'
}

export const getPostPath = (postOrId, title = '') => {
  const id = typeof postOrId === 'object' ? postOrId?.id : postOrId
  const resolvedTitle = typeof postOrId === 'object' ? postOrId?.title : title
  return `/post/${id}/${slugifyTitle(resolvedTitle)}`
}

export const getPostUrl = (postOrId, title = '') => {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  return `${origin}${getPostPath(postOrId, title)}`
}
