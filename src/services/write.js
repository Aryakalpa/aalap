import { supabase } from '../supabase'

export const fetchEditablePost = async ({ postId, authorId }) => {
  const { data, error } = await supabase.from('posts').select('*').eq('id', postId).eq('author_id', authorId).single()
  if (error) throw error
  return data
}

export const savePost = async ({ id, postData }) => {
  const { data, error } = id
    ? await supabase.from('posts').update(postData).eq('id', id).select().single()
    : await supabase.from('posts').insert(postData).select().single()

  if (error) throw error
  return data
}
