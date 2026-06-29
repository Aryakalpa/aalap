import { Link, useLocation } from 'react-router-dom'
import logo from '../logo/namelogo.png'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { supabase } from '../supabase'
import { useState, useEffect, useRef } from 'react'
import { Home, TrendingUp, PenTool, Bell, User, Search, Moon, Sun, LogOut, Monitor } from 'lucide-react'

export default function Layout({ children }) {
  const { user, signInWithGoogle, signOut } = useAuth()
  const { theme, resolvedTheme, setTheme } = useTheme()
  const location = useLocation()
  const [unreadCount, setUnreadCount] = useState(0)
  const [showThemeMenu, setShowThemeMenu] = useState(false)
  const themeMenuRef = useRef(null)

  useEffect(() => {
    if (user) {
      fetchUnreadCount()
      const subscription = supabase
        .channel('notifications')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notifications',
            filter: `recipient_id=eq.${user.id}`,
          },
          () => fetchUnreadCount(),
        )
        .subscribe()
      return () => subscription.unsubscribe()
    }
  }, [user])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target)) setShowThemeMenu(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

  const handleProtectedClick = (e) => {
    if (!user) {
      e.preventDefault()
      alert('আপোনাৰ সৃষ্টিশীল যাত্ৰা আৰম্ভ কৰিবলৈ অনুগ্ৰহ কৰি লগ ইন কৰক। (Please log in to start your writing journey.)')
      signInWithGoogle()
    }
  }

  return (
    <div className="layout-main">
      <nav className="top-nav">
        <div className="top-nav-inner">
          <Link to="/" className="nav-brand">
            <img src={logo} alt="Aalap Logo" className="nav-logo" />
          </Link>

          <div className="top-nav-actions">
            <Link to="/search" className="btn-icon">
              <Search size={20} />
            </Link>

            <div ref={themeMenuRef} className="theme-menu-wrap">
              <button
                className="btn-icon"
                onClick={() => setShowThemeMenu((open) => !open)}
                title="Appearance"
                aria-label="Appearance"
                aria-expanded={showThemeMenu}
              >
                {resolvedTheme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              {showThemeMenu && (
                <div className="share-menu fade-in theme-menu">
                  <button className={`theme-menu-item ${theme === 'system' ? 'active' : ''}`} onClick={() => { setTheme('system'); setShowThemeMenu(false) }}>
                    <Monitor size={17} />
                    <span>System</span>
                  </button>
                  <button className={`theme-menu-item ${theme === 'light' ? 'active' : ''}`} onClick={() => { setTheme('light'); setShowThemeMenu(false) }}>
                    <Sun size={17} />
                    <span>Light</span>
                  </button>
                  <button className={`theme-menu-item ${theme === 'dark' ? 'active' : ''}`} onClick={() => { setTheme('dark'); setShowThemeMenu(false) }}>
                    <Moon size={17} />
                    <span>Dark</span>
                  </button>
                </div>
              )}
            </div>

            {user ? (
              <button className="btn-icon" onClick={signOut} title="Log Out">
                <LogOut size={18} />
              </button>
            ) : (
              <button className="btn btn-primary" onClick={signInWithGoogle} style={{ padding: '0.72rem 1rem' }}>
                সোমাওঁক
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="layout-content">{children}</main>

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
            <PenTool className="nav-icon" style={{ color: 'inherit' }} />
          </div>
        </Link>
        <Link to="/notifications" onClick={handleProtectedClick} className={`nav-item ${isActive('/notifications') ? 'active' : ''}`}>
          <div style={{ position: 'relative' }}>
            <Bell className="nav-icon" />
            {unreadCount > 0 && <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
          </div>
          <div className="nav-indicator" />
        </Link>
        <Link to={user ? `/profile/${user.id}` : '/login'} onClick={handleProtectedClick} className={`nav-item ${isActive('/profile') ? 'active' : ''}`}>
          <User className="nav-icon" />
          <div className="nav-indicator" />
        </Link>
      </nav>
    </div>
  )
}
