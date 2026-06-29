const TRANSLITERATION_MAP = {
  'অ': 'o', 'আ': 'a', 'ই': 'i', 'ঈ': 'i', 'উ': 'u', 'ঊ': 'u', 'ঋ': 'ri', 'এ': 'e', 'ঐ': 'oi', 'ও': 'o', 'ঔ': 'ou',
  'ক': 'k', 'খ': 'kh', 'গ': 'g', 'ঘ': 'gh', 'ঙ': 'ng', 'চ': 'ch', 'ছ': 'chh', 'জ': 'j', 'ঝ': 'jh', 'ঞ': 'ny',
  'ট': 't', 'ঠ': 'th', 'ড': 'd', 'ঢ': 'dh', 'ণ': 'n', 'ত': 't', 'থ': 'th', 'দ': 'd', 'ধ': 'dh', 'ন': 'n',
  'প': 'p', 'ফ': 'ph', 'ব': 'b', 'ভ': 'bh', 'ম': 'm', 'য': 'j', 'ৰ': 'r', 'র': 'r', 'ল': 'l', 'ৱ': 'w', 'শ': 'sh', 'ষ': 'x', 'স': 's', 'হ': 'h',
  'ক্ষ': 'khyo', 'ড়': 'r', 'ঢ়': 'rh', 'য়': 'y', 'ৎ': 't',
  'া': 'a', 'ি': 'i', 'ী': 'i', 'ু': 'u', 'ূ': 'u', 'ৃ': 'ri', 'ে': 'e', 'ৈ': 'oi', 'ো': 'o', 'ৌ': 'ou',
  'ং': 'ng', 'ঃ': 'h', 'ঁ': '', '্': '', '।': '',
  '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4', '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9',
}

const transliterateToEnglish = (value = '') => {
  let output = ''
  const input = String(value || '')
  for (let index = 0; index < input.length; index += 1) {
    const pair = input.slice(index, index + 2)
    if (TRANSLITERATION_MAP[pair]) {
      output += TRANSLITERATION_MAP[pair]
      index += 1
      continue
    }
    const char = input[index]
    output += TRANSLITERATION_MAP[char] ?? char
  }
  return output
}

export const slugifyTitle = (title = '') => {
  const english = transliterateToEnglish(title)
  const slug = english
    .trim()
    .toLowerCase()
    .replace(/[\u2018\u2019']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
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
