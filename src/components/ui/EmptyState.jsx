export default function EmptyState({
  icon = null,
  title,
  description = null,
  action = null,
  className = 'empty-state card',
  style,
}) {
  return (
    <div className={className} style={style}>
      {icon ? <div className="empty-state-icon">{icon}</div> : null}
      <h3 className="empty-state-title">{title}</h3>
      {description ? <p className="empty-state-desc">{description}</p> : null}
      {action ? action : null}
    </div>
  )
}
