import { useState } from 'react'
import { theme } from '../theme'
import { Toggle } from '../ui/Toggle'
import { useAlerts } from '../hooks/useAlerts'

export function AvailabilityEditor({ menu, setMenu, lang }) {
  const isHe = lang === 'he'
  const { addAlert } = useAlerts()
  const [modal, setModal] = useState(null) // { catKey, subcatIdx, itemIdx, item }
  const [toast, setToast] = useState(null) // { message, type }

  function toggleItem(catKey, subcatIdx, itemIdx) {
    const item = menu[catKey].subcats[subcatIdx].items[itemIdx]
    
    // If turning OFF, show modal instead of toggling immediately
    if (item.active !== false) {
      setModal({ catKey, subcatIdx, itemIdx, item })
      return
    }
    
    // If already OFF, turn back ON without modal
    setMenu(prev => {
      const next = JSON.parse(JSON.stringify(prev))
      const updItem = next[catKey].subcats[subcatIdx].items[itemIdx]
      updItem.active = !updItem.active
      return next
    })
  }

  function handleModalChoice(reason) {
    if (!modal) return
    
    const { catKey, subcatIdx, itemIdx, item } = modal
    
    // Always toggle the item off
    setMenu(prev => {
      const next = JSON.parse(JSON.stringify(prev))
      const updItem = next[catKey].subcats[subcatIdx].items[itemIdx]
      updItem.active = false
      return next
    })
    
    // Create alert if "out of stock" was selected
    if (reason === 'out_of_stock') {
      const cat = menu[catKey]
      addAlert({
        productId: item.id,
        productName_he: item.he,
        productName_en: item.en,
        category_he: cat.label_he,
        category_en: cat.label_en,
        reportedBy: 'bar',
      })
      
      // Show toast
      setToast({ message: isHe ? '📱 נשלח התראה ליוסי' : '📱 Alert sent to Yosi', type: 'success' })
      setTimeout(() => setToast(null), 3000)
    }
    
    setModal(null)
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

      {/* Modal overlay */}
      {modal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          animation: 'fadeIn 200ms ease-out both',
        }}>
          <div style={{
            background: theme.card,
            border: `1px solid ${theme.accent}`,
            borderRadius: 8,
            padding: '24px 16px',
            maxWidth: 300,
            textAlign: 'center',
            animation: 'fadeSlideIn 200ms cubic-bezier(0.4,0,0.2,1) both',
          }}>
            <h3 style={{
              fontSize: 16,
              fontWeight: 900,
              color: theme.stone,
              marginBottom: 4,
            }}>
              {isHe ? 'למה אתה מכבה את הפריט?' : 'Why are you turning this off?'}
            </h3>
            <p style={{
              fontSize: 12,
              color: theme.warmGray,
              marginBottom: 16,
            }}>
              {modal.item.he}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button
                onClick={() => handleModalChoice('out_of_stock')}
                style={{
                  padding: '10px 12px',
                  background: '#B22222',
                  color: theme.stone,
                  border: 'none',
                  borderRadius: 4,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: `background 150ms ease`,
                }}
                onMouseEnter={(e) => e.target.style.background = '#A01919'}
                onMouseLeave={(e) => e.target.style.background = '#B22222'}
              >
                {isHe ? 'נגמר המלאי / Out of stock' : 'Out of stock'}
              </button>

              <button
                onClick={() => handleModalChoice('not_available_today')}
                style={{
                  padding: '10px 12px',
                  background: theme.brass,
                  color: theme.stone,
                  border: 'none',
                  borderRadius: 4,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: `background 150ms ease`,
                }}
                onMouseEnter={(e) => e.target.style.background = '#A08019'}
                onMouseLeave={(e) => e.target.style.background = theme.brass}
              >
                {isHe ? 'לא זמין היום / Not available today' : 'Not available today'}
              </button>

              <button
                onClick={() => handleModalChoice('other')}
                style={{
                  padding: '10px 12px',
                  background: theme.warmGray,
                  color: theme.ink,
                  border: 'none',
                  borderRadius: 4,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: `background 150ms ease`,
                }}
                onMouseEnter={(e) => e.target.style.background = '#9A8670'}
                onMouseLeave={(e) => e.target.style.background = theme.warmGray}
              >
                {isHe ? 'סיבה אחרת / Other reason' : 'Other reason'}
              </button>

              <button
                onClick={() => setModal(null)}
                style={{
                  padding: '10px 12px',
                  background: 'transparent',
                  color: theme.warmGray,
                  border: `1px solid ${theme.accent}`,
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: `color 150ms ease`,
                }}
                onMouseEnter={(e) => e.target.style.color = theme.gold}
                onMouseLeave={(e) => e.target.style.color = theme.warmGray}
              >
                {isHe ? 'ביטול' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#FFD700',
          color: '#000',
          padding: '12px 20px',
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 700,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 10000,
          animation: 'fadeIn 300ms ease-out, fadeOut 300ms ease-in 2700ms',
        }}>
          {toast.message}
        </div>
      )}
    </div>
  )
}
