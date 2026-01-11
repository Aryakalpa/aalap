import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { supabase } from '../supabase'
import { useState, useEffect } from 'react'
import { Home, TrendingUp, PenTool, Bell, User, Search, Moon, Sun, LogOut } from 'lucide-react'

export default function Layout({ children }) {
    const { user, profile, signInWithGoogle, signOut } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const location = useLocation()
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => {
        if (user) {
            fetchUnreadCount()
            const subscription = supabase
                .channel('notifications')
                .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'notifications',
                    filter: `recipient_id=eq.${user.id}`
                }, () => fetchUnreadCount())
                .subscribe()
            return () => subscription.unsubscribe()
        }
    }, [user])

    const fetchUnreadCount = async () => {
        const { count } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('recipient_id', user.id)
            .eq('is_read', false)
        setUnreadCount(count || 0)
    }

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/'
        return location.pathname.startsWith(path)
    }

    const handleProtectedClick = (e, path) => {
        if (!user) {
            e.preventDefault()
            alert('আপোনাৰ সৃষ্টিশীল যাত্ৰা আৰম্ভ কৰিবলৈ অনুগ্ৰহ কৰি লগ ইন কৰক। (Please log in to start your writing journey.)')
            signInWithGoogle()
        }
    }

    return (
        <div className="layout-main">
            <nav className="top-nav">
                <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4.5rem' }}>
                    <Link to="/" style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', gap: '0.5rem', letterSpacing: '-0.02em' }}>
                        আলাপ
                    </Link>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Link to="/search" className="btn-icon">
                            <Search size={22} />
                        </Link>

                        <button className="btn-icon" onClick={toggleTheme}>
                            {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
                        </button>

                        {user ? (
                            <button className="btn-icon" onClick={signOut} title="Log Out">
                                <LogOut size={20} />
                            </button>
                        ) : (
                            <button className="btn btn-primary" onClick={signInWithGoogle} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', marginLeft: '0.5rem' }}>
                                সোমাওঁক
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            <main className="layout-content">
                {children}
            </main>

            <nav className="bottom-nav">
                <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
                    <Home className="nav-icon" />
                    <div className="nav-indicator" />
                </Link>
                <Link to="/trending" className={`nav-item ${isActive('/trending') ? 'active' : ''}`}>
                    <TrendingUp className="nav-icon" />
                    <div className="nav-indicator" />
                </Link>
                <Link to="/write" onClick={handleProtectedClick} className={`nav-item ${isActive('/write') ? 'active' : ''}`}>
                    <div className="nav-write-btn">
                        <PenTool className="nav-icon" style={{ color: 'white' }} />
                    </div>
                </Link>
                <Link to="/notifications" onClick={handleProtectedClick} className={`nav-item ${isActive('/notifications') ? 'active' : ''}`}>
                    <div style={{ position: 'relative' }}>
                        <Bell className="nav-icon" />
                        {unreadCount > 0 && <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
                    </div>
                    <div className="nav-indicator" />
                </Link>
                <Link
                    to={user ? `/profile/${user.id}` : '/login'}
                    onClick={handleProtectedClick}
                    className={`nav-item ${isActive(`/profile`) ? 'active' : ''}`}
                >
                    <User className="nav-icon" />
                    <div className="nav-indicator" />
                </Link>
            </nav>
        </div>
    )
}
