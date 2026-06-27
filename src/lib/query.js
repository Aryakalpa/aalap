export const escapeLikeQuery = (value = '') => value.replace(/[,%]/g, '').trim()

export const buildOrLikeQuery = (fields = [], rawValue = '') => {
  const value = escapeLikeQuery(rawValue)
  if (!value) return ''
  return fields.map((field) => `${field}.ilike.%${value}%`).join(',')
}
