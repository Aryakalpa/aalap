import { supabase } from '../supabase'

export const fetchReaderPost = async (postId) => {
  const { data, error } = await supabase.from('posts').select('*, profiles(*)').eq('id', postId).single()
  if (error) throw error
  return data
}

export const fetchPostComments = async (postId) => {
  const { data, error } = await supabase.from('comments').select('*, profiles(*)').eq('post_id', postId).order('created_at', { ascending: true })
  if (error) throw error
  return data || []
}

export const fetchSimilarPostsByCategory = async ({ category, postId, limit = 3 }) => {
  const { data, error } = await supabase.from('posts').select('*, profiles(*)').eq('category', category).neq('id', postId).eq('is_published', true).limit(limit)
  if (error) throw error
  return data || []
}

export const fetchSeriesPostsByName = async ({ seriesName, authorId }) => {
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, created_at')
    .eq('series_name', seriesName)
    .eq('author_id', authorId)
    .eq('is_published', true)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data || []
}

export const fetchLikeState = async ({ userId, postId }) => {
  const { data } = await supabase.from('likes').select('*').match({ user_id: userId, post_id: postId }).single()
  return !!data
}

export const fetchBookmarkState = async ({ userId, postId }) => {
  const { data } = await supabase.from('bookmarks').select('*').match({ user_id: userId, post_id: postId }).single()
  return !!data
}

export const fetchFollowState = async ({ followerId, followingId }) => {
  const { data } = await supabase.from('follows').select('*').match({ follower_id: followerId, following_id: followingId }).single()
  return !!data
}

export const toggleLike = async ({ liked, userId, postId }) => {
  if (liked) await supabase.from('likes').delete().match({ user_id: userId, post_id: postId })
  else await supabase.from('likes').insert({ user_id: userId, post_id: postId })
}

export const toggleBookmark = async ({ bookmarked, userId, postId }) => {
  if (bookmarked) await supabase.from('bookmarks').delete().match({ user_id: userId, post_id: postId })
  else await supabase.from('bookmarks').insert({ user_id: userId, post_id: postId })
}

export const toggleFollow = async ({ following, followerId, followingId }) => {
  if (following) await supabase.from('follows').delete().match({ follower_id: followerId, following_id: followingId })
  else await supabase.from('follows').insert({ follower_id: followerId, following_id: followingId })
}

export const addComment = async ({ postId, userId, body }) => {
  const { error } = await supabase.from('comments').insert({ post_id: postId, user_id: userId, body })
  if (error) throw error
}

export const updatePostPublishState = async ({ postId, isPublished }) => {
  const { error } = await supabase.from('posts').update({ is_published: !isPublished }).eq('id', postId)
  if (error) throw error
}

export const deletePostById = async (postId) => {
  const { error } = await supabase.from('posts').delete().eq('id', postId)
  if (error) throw error
}
