import { supabase } from '../supabase'
import { MAX_SEARCH_RESULTS } from '../constants/app'
import { buildOrLikeQuery } from '../lib/query'

export const fetchProfileByIdOrUsername = async (identifier) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .or(`username.eq.${identifier},id.eq.${identifier}`)
    .single()

  if (error) throw error
  return data
}

export const fetchProfileByUserId = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

export const searchProfiles = async (query, limit = MAX_SEARCH_RESULTS) => {
  const orQuery = buildOrLikeQuery(['username', 'display_name'], query)
  if (!orQuery) return []

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .or(orQuery)
    .limit(limit)

  if (error) throw error
  return data || []
}
