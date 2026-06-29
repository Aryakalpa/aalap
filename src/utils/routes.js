const INDEPENDENT_VOWELS = {
  'অ': 'o', 'আ': 'a', 'ই': 'i', 'ঈ': 'i', 'উ': 'u', 'ঊ': 'u', 'ঋ': 'ri', 'এ': 'e', 'ঐ': 'oi', 'ও': 'o', 'ঔ': 'ou',
}

const CONSONANTS = {
  'ক': 'k', 'খ': 'kh', 'গ': 'g', 'ঘ': 'gh', 'ঙ': 'ng', 'চ': 'ch', 'ছ': 'chh', 'জ': 'j', 'ঝ': 'jh', 'ঞ': 'ny',
  'ট': 't', 'ঠ': 'th', 'ড': 'd', 'ঢ': 'dh', 'ণ': 'n', 'ত': 't', 'থ': 'th', 'দ': 'd', 'ধ': 'dh', 'ন': 'n',
  'প': 'p', 'ফ': 'ph', 'ব': 'b', 'ভ': 'bh', 'ম': 'm', 'য': 'j', 'ৰ': 'r', 'র': 'r', 'ল': 'l', 'ৱ': 'w', 'শ': 'sh', 'ষ': 'x', 'স': 's', 'হ': 'h',
  'ড়': 'r', 'ঢ়': 'rh', 'য়': 'y', 'ৎ': 't',
}

const VOWEL_SIGNS = {
  'া': 'a', 'ি': 'i', 'ী': 'i', 'ু': 'u', 'ূ': 'u', 'ৃ': 'ri', 'ে': 'e', 'ৈ': 'oi', 'ো': 'o', 'ৌ': 'ou',
}

const OTHER_CHARS = {
  'ং': 'ng', 'ঃ': 'h', 'ঁ': '', '্': '', '।': '',
  '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4', '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9',
}

const hasVowelSignAfter = (input, index) => Boolean(VOWEL_SIGNS[input[index + 1]])
const hasHasantaAfter = (input, index) => input[index + 1] === '্'
const hasConsonantAfter = (input, index) => Boolean(CONSONANTS[input[index + 1]])

const transliterateToEnglish = (value = '') => {
  let output = ''
  const input = String(value || '')

  for (let index = 0; index < input.length; index += 1) {
    const pair = input.slice(index, index + 2)
    if (pair === 'ক্ষ') {
      output += 'khyo'
      index += 1
      continue
    }

    const char = input[index]

    if (INDEPENDENT_VOWELS[char]) {
      output += INDEPENDENT_VOWELS[char]
      continue
    }

    if (CONSONANTS[char]) {
      output += CONSONANTS[char]
      // Add the natural Assamese inherent vowel only when another consonant follows.
      // This makes বতাহ -> botah, মন -> mon, ঘৰ -> ghor, while ফুল stays phul.
      if (!hasVowelSignAfter(input, index) && !hasHasantaAfter(input, index) && hasConsonantAfter(input, index)) {
        output += 'o'
      }
      continue
    }

    if (VOWEL_SIGNS[char]) {
      output += VOWEL_SIGNS[char]
      continue
    }

    output += OTHER_CHARS[char] ?? char
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

export const isUuidLike = (value = '') => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value))

export const getPostPath = (postOrId, title = '') => {
  const id = typeof postOrId === 'object' ? postOrId?.id : postOrId
  const resolvedTitle = typeof postOrId === 'object' ? postOrId?.title : title
  const slug = slugifyTitle(resolvedTitle)

  // New public links are clean and readable. If we only have an ID, keep legacy compatibility.
  if (resolvedTitle) return `/post/${slug}`
  return `/post/${id}`
}

export const getPostUrl = (postOrId, title = '') => {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  return `${origin}${getPostPath(postOrId, title)}`
}
