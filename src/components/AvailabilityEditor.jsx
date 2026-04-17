import { theme } from '../theme'
import { Toggle } from '../ui/Toggle'

export function AvailabilityEditor({ menu, setMenu, lang }) {
  const isHe = lang === 'he'

  function toggleItem(catKey, subcatIdx, itemIdx) {
    setMenu(prev => {
      const next = JSON.parse(JSON.stringify(prev))
      const item = next[catKey].subcats[subcatIdx].items[itemIdx]
      item.active = !item.active
      return next
    })
  }

  const cats = Object.entries(menu).filter(([, cat]) => cat.subcats)

  return (
    <div style={{ padding: '0 0 80px' }}>
      <div style={{ padding: '16px 16px 8px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: theme.stone, marginBottom: 4 }}>
          🟢 {isHe ? 'זמינות מוצרים' : 'Item Availability'}
        </h2>
        <p style={{ fontSize: 13, color: theme.warmGray }}>
          {isHe
            ? 'כבו פריטים שאזלו — הם יוסתרו מהתפריט הציבורי מיד.'
            : 'Toggle items off to hide them from the public menu immediately.'}
        </p>
      </div>

      {cats.map(([catKey, cat]) => (
        <div key={catKey} style={{ marginBottom: 8 }}>
          <div style={{
            padding: '10px 16px 6px',
            fontSize: 13,
            fontWeight: 700,
            color: theme.gold,
            letterSpacing: 1,
            background: theme.cardDeep,
            borderBottom: `1px solid ${theme.accent}`,
          }}>
            {cat.icon} {isHe ? cat.label_he : cat.label_en}
          </div>

          {cat.subcats.map((sub, si) => (
            <div key={si}>
              {cat.subcats.length > 1 && (
                <div style={{
                  padding: '6px 16px',
                  fontSize: 11,
                  color: theme.warmGray,
                  background: `${theme.card}88`,
                  letterSpacing: 1,
                }}>
                  {isHe ? sub.title_he : sub.title_en}
                </div>
              )}
              {sub.items.map((item, ii) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 16px',
                    borderBottom: `1px solid ${theme.accent}20`,
                    opacity: item.active ? 1 : 0.45,
                    transition: 'opacity 200ms ease',
                  }}
                >
                  <Toggle
                    on={item.active !== false}
                    onChange={() => toggleItem(catKey, si, ii)}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: theme.stone }}>
                      {item.he}
                    </div>
                    {(item.note_he || item.note_en) && (
                      <div style={{ fontSize: 11, color: theme.warmGray }}>
                        {isHe ? item.note_he : item.note_en}
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: theme.brass, fontWeight: 700 }}>
                    {item.price}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
