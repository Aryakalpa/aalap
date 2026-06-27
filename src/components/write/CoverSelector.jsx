import CoverPreview from '../CoverPreview'
import { COVER_PRESETS } from '../../utils/covers'
import { CATEGORIES } from '../../utils/helpers'

export default function CoverSelector({ coverMode, setCoverMode, coverPreset, setCoverPreset, category }) {
  const resolvedCategory = CATEGORIES.find((c) => c.id === category)?.label || category || 'অন্যান্য'

  return (
    <>
      <div className="tab-row" style={{ marginBottom: '0.75rem' }}>
        <button type="button" className={`tab-btn ${coverMode === 'preset' ? 'active' : ''}`} onClick={() => setCoverMode('preset')}>Preset</button>
        <button type="button" className={`tab-btn ${coverMode === 'none' ? 'active' : ''}`} onClick={() => setCoverMode('none')}>None</button>
      </div>

      {coverMode === 'preset' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.75rem', marginBottom: '0.9rem' }}>
            {COVER_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setCoverPreset(preset.id)}
                style={{
                  border: coverPreset === preset.id ? '2px solid var(--text-primary)' : '1px solid var(--border-color)',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  background: 'var(--surface-raised)',
                  cursor: 'pointer',
                  padding: 0,
                  textAlign: 'left',
                }}
              >
                <div style={{ aspectRatio: '4 / 5', background: 'var(--bg-secondary)' }}>
                  <CoverPreview title="" category={resolvedCategory} author="" presetId={preset.id} alt={preset.label} />
                </div>
                <div style={{ padding: '0.55rem 0.7rem', fontSize: '0.82rem', fontWeight: 700 }}>{preset.label}</div>
              </button>
            ))}
          </div>
          <div className="panel" style={{ padding: '0.75rem' }}>
            <div style={{ aspectRatio: '4 / 5', borderRadius: '12px', overflow: 'hidden' }}>
              <CoverPreview title="" category={resolvedCategory} author="" presetId={coverPreset} alt="Cover preview" />
            </div>
          </div>
        </>
      )}
    </>
  )
}
