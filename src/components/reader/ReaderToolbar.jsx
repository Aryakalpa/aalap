import { MoreVertical, Edit, Trash2, EyeOff, Eye, Image as ImageIcon, Minus, Plus, ChevronLeft } from 'lucide-react'
import ShareButton from '../ShareButton'

export default function ReaderToolbar({
  navigate,
  fontSize,
  setFontSize,
  openQuoteModal,
  post,
  user,
  menuRef,
  showMenu,
  setShowMenu,
  onTogglePublish,
  onDelete,
}) {
  return (
    <div className="reader-toolbar">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <button onClick={() => navigate(-1)} className="btn-icon"><ChevronLeft size={20} /></button>

        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem', border: '1px solid var(--border-color)', borderRadius: '999px', background: 'var(--surface-raised)' }}>
            <button className="btn-icon" onClick={() => setFontSize((prev) => Math.max(16, prev - 1))} title="Decrease text size">
              <Minus size={16} />
            </button>
            <span style={{ minWidth: '2.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 700 }}>{fontSize}</span>
            <button className="btn-icon" onClick={() => setFontSize((prev) => Math.min(26, prev + 1))} title="Increase text size">
              <Plus size={16} />
            </button>
          </div>

          <button className="btn-ghost" onClick={openQuoteModal} title="Share as Card"><ImageIcon size={18} /> <span className="reader-card-label">Card</span></button>
          <ShareButton title={post.title} postId={post.id} direction="down" />

          {user && user.id === post.author_id && (
            <div ref={menuRef} style={{ position: 'relative' }}>
              <button className="btn-icon" onClick={() => setShowMenu(!showMenu)}><MoreVertical size={18} /></button>
              {showMenu && (
                <div className="share-menu fade-in" style={{ right: 0, top: 'calc(100% + 10px)', minWidth: '180px' }}>
                  <div className="share-menu-item" onClick={() => navigate(`/write/${post.id}`)}><Edit size={16} /> <span>সম্পাদনা</span></div>
                  <div className="share-menu-item" onClick={onTogglePublish}>
                    {post.is_published ? <EyeOff size={16} /> : <Eye size={16} />}
                    <span>{post.is_published ? 'লুকুৱাই ৰাখক' : 'প্ৰকাশ কৰক'}</span>
                  </div>
                  <div className="share-divider" />
                  <div className="share-menu-item danger" onClick={onDelete}><Trash2 size={16} /> <span>মচি পেলাওক</span></div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
