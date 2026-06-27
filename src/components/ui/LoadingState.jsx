export default function LoadingState({ centered = true, padding = '5rem', containerClassName = 'container' }) {
  return (
    <div className={containerClassName} style={{ display: 'flex', justifyContent: centered ? 'center' : 'flex-start', padding }}>
      <div className="spinner" />
    </div>
  )
}
