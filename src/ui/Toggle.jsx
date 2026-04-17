import { theme, ease } from '../theme'

export function Toggle({ on, onChange }) {
  return (
    <button
      onClick={() => onChange(!on)}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        background: on ? theme.gold : theme.accent,
        border: `1px solid ${on ? theme.brass : theme.accent}`,
        position: 'relative',
        transition: `background 200ms ${ease}, border-color 200ms ${ease}`,
        flexShrink: 0,
      }}
      aria-checked={on}
      role="switch"
    >
      <span style={{
        position: 'absolute',
        top: 2,
        left: on ? 22 : 2,
        width: 18,
        height: 18,
        borderRadius: '50%',
        background: on ? theme.ink : theme.warmGray,
        transition: `left 200ms ${ease}, background 200ms ${ease}`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
      }} />
    </button>
  )
}
