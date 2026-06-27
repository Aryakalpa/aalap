import { supabase } from '../supabase'
import { MAX_FEED_POSTS, MAX_SEARCH_RESULTS, MAX_TRENDING_POSTS } from '../constants/app'
import { buildOrLikeQuery } from '../lib/query'
import { matchesCategory } from '../utils/helpers'

export const fetchPublishedPosts = async ({ categoryValues, limit = MAX_FEED_POSTS } = {}) => {
  let query = supabase
    .from('posts')
    .select('*, profiles(*)')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  const { data, error } = await query
  if (error) throw error

  const posts = data || []
  if (categoryValues?.length) {
    return posts.filter((post) => categoryValues.some((categoryValue) => matchesCategory(post.category, categoryValue)))
  }

  return posts
}

export const fetchTrendingPosts = async (startDate, limit = MAX_TRENDING_POSTS) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*, profiles(*)')
    .eq('is_published', true)
    .gte('created_at', startDate.toISOString())
    .order('likes_count', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

export const searchPosts = async (query, limit = MAX_SEARCH_RESULTS) => {
  const orQuery = buildOrLikeQuery(['title', 'body'], query)
  if (!orQuery) return []

  const { data, error } = await supabase
    .from('posts')
    .select('*, profiles(*)')
    .eq('is_published', true)
    .or(orQuery)
    .limit(limit)

  if (error) throw error
  return data || []
}
