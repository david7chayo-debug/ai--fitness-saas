import { useRef, useEffect } from 'react'
import { theme, ease } from '../theme'

export function TabBar({ tabs, active, onChange, sticky }) {
  const ref = useRef(null)
  const activeRef = useRef(null)

  useEffect(() => {
    if (activeRef.current && ref.current) {
      const el = activeRef.current
      const container = ref.current
      const elLeft = el.offsetLeft
      const elWidth = el.offsetWidth
      const containerWidth = container.offsetWidth
      container.scrollTo({ left: elLeft - containerWidth / 2 + elWidth / 2, behavior: 'smooth' })
    }
  }, [active])

  return (
    <div style={{
      position: sticky ? 'sticky' : 'relative',
      top: 0,
      zIndex: 100,
      background: `${theme.bg}cc`,
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      borderBottom: `1px solid ${theme.accent}`,
    }}>
      <div
        ref={ref}
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          padding: '0 4px',
        }}
      >
        {tabs.map(tab => {
          const isActive = active === tab.id
          return (
            <button
              key={tab.id}
              ref={isActive ? activeRef : null}
              onClick={() => onChange(tab.id)}
              style={{
                flexShrink: 0,
                padding: '12px 14px',
                fontSize: 13,
                fontWeight: isActive ? 700 : 400,
                color: isActive ? theme.gold : theme.warmGray,
                borderBottom: isActive ? `2px solid ${theme.gold}` : '2px solid transparent',
                background: 'none',
                transition: `color 180ms ${ease}, border-color 180ms ${ease}`,
                whiteSpace: 'nowrap',
                fontFamily: "'Frank Ruhl Libre', serif",
              }}
            >
              {tab.icon} {tab.label}
            </button>
          )
        })}
      </div>
      <style>{`.tab-scroll::-webkit-scrollbar{display:none}`}</style>
    </div>
  )
}
