import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { formatDate } from '../utils/helpers'
import { Heart, MessageSquare, UserPlus, Bell, ChevronRight } from 'lucide-react'
import EmptyState from '../components/ui/EmptyState'
import LoadingState from '../components/ui/LoadingState'

export default function Notifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchNotifications()
      markAllAsRead()
    }
  }, [user])

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*, actor:profiles!actor_id(*), post:posts(*)')
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      setNotifications(data || [])
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAllAsRead = async () => {
    await supabase.from('notifications').update({ is_read: true }).eq('recipient_id', user.id).eq('is_read', false)
  }

  const getNotificationContent = (notification) => {
    const actorName = notification.actor?.display_name || 'এজন সদস্যই'
    switch (notification.type) {
      case 'like':
        return { icon: <Heart size={18} className="text-danger" fill="currentColor" />, text: <span><strong>{actorName}</strong>-এ আপোনাৰ লিখনি পছন্দ কৰিছে</span> }
      case 'comment':
        return { icon: <MessageSquare size={18} className="text-accent-blue" />, text: <span><strong>{actorName}</strong>-এ আপোনাৰ লিখনিত মন্তব্য কৰিছে</span> }
      case 'follow':
        return { icon: <UserPlus size={18} className="text-success" />, text: <span><strong>{actorName}</strong>-এ আপোনাক অনুসৰণ কৰিবলৈ আৰম্ভ কৰিছে</span> }
      default:
        return { icon: <Bell size={18} />, text: 'নতুন জাননী' }
    }
  }

  if (loading) return <LoadingState padding="10rem" />

  return (
    <div className="page-shell fade-in">
      <header className="page-header">
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Bell size={28} />
          জাননীসমূহ
        </h1>
      </header>

      {notifications.length === 0 ? (
        <EmptyState title="আপোনাৰ এতিয়ালৈকে কোনো জাননী নাই।" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {notifications.map(n => {
            const { icon, text } = getNotificationContent(n)
            return (
              <Link key={n.id} to={n.post_id ? getPostPath(n.post_id, n.posts?.title || '') : `/profile/${n.actor_id}`} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: n.is_read ? 'var(--surface-raised)' : 'var(--bg-secondary)' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-tertiary)' }}>
                  {icon}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{text}</p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>{formatDate(n.created_at)}</p>
                </div>
                <ChevronRight size={18} color="var(--text-tertiary)" />
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
