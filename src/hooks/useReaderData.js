import { useEffect, useState } from 'react'
import {
  fetchReaderPost,
  fetchPostComments,
  fetchSimilarPostsByCategory,
  fetchSeriesPostsByName,
  fetchLikeState,
  fetchBookmarkState,
  fetchFollowState,
} from '../services/reader'

export default function useReaderData({ postId, user }) {
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [comments, setComments] = useState([])
  const [similarPosts, setSimilarPosts] = useState([])
  const [seriesPosts, setSeriesPosts] = useState([])
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [following, setFollowing] = useState(false)

  const resolvedPostId = post?.id || postId

  const refreshPost = async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const data = await fetchReaderPost(postId)
      setPost(data)
      try {
        const commentData = await fetchPostComments(data.id)
        setComments(commentData)
      } catch (commentError) {
        console.error('Error fetching comments:', commentError)
      }
      return data
    } catch (error) {
      console.error('Error fetching post:', error)
      setPost(null)
      return null
    } finally {
      setLoading(false)
    }
  }

  const refreshComments = async () => {
    try {
      const data = await fetchPostComments(resolvedPostId)
      setComments(data)
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  useEffect(() => {
    refreshPost()
  }, [postId])

  useEffect(() => {
    const loadRelated = async () => {
      if (!post) return
      try {
        const [similar, series] = await Promise.all([
          fetchSimilarPostsByCategory({ category: post.category, postId: post.id }),
          post.series_name ? fetchSeriesPostsByName({ seriesName: post.series_name, authorId: post.author_id }) : Promise.resolve([]),
        ])
        setSimilarPosts(similar)
        setSeriesPosts(series)
      } catch (error) {
        console.error('Error fetching related posts:', error)
      }
    }
    loadRelated()
  }, [post, postId])

  useEffect(() => {
    const loadStates = async () => {
      if (!user || !post) return
      try {
        const [likedState, bookmarkedState, followingState] = await Promise.all([
          fetchLikeState({ userId: user.id, postId: resolvedPostId }),
          fetchBookmarkState({ userId: user.id, postId: resolvedPostId }),
          fetchFollowState({ followerId: user.id, followingId: post.author_id }),
        ])
        setLiked(likedState)
        setBookmarked(bookmarkedState)
        setFollowing(followingState)
      } catch (error) {
        console.error('Error fetching reader states:', error)
      }
    }
    loadStates()
  }, [user, post, resolvedPostId])

  return {
    post,
    loading,
    comments,
    similarPosts,
    seriesPosts,
    liked,
    bookmarked,
    following,
    setLiked,
    setBookmarked,
    setFollowing,
    refreshPost,
    refreshComments,
  }
}
