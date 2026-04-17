import { useState } from 'react'
import { theme, ease } from '../theme'

const FIELD_LABELS = {
  he: 'שם עברית', en: 'English', price: 'מחיר',
  vibe_he: 'Vibe עברית', vibe_en: 'Vibe EN',
  note_he: 'הערה עברית', note_en: 'Note EN', emoji: 'אמוג׳י',
}

const EMPTY_ITEM = () => ({
  id: `new_${Date.now()}`,
  he: '', en: '', price: '', emoji: '🍺',
  vibe_he: '', vibe_en: '', note_he: '', note_en: '',
  active: true,
})

function InlineInput({ value, onChange, placeholder, multiline }) {
  const style = {
    background: theme.cardDeep,
    border: `1px solid ${theme.accent}`,
    color: theme.stone,
    borderRadius: 4,
    padding: '5px 8px',
    fontSize: 12,
    width: '100%',
    fontFamily: "'Frank Ruhl Libre', serif",
    resize: multiline ? 'vertical' : 'none',
    minHeight: multiline ? 48 : undefined,
  }
  return multiline
    ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={style} rows={2} />
    : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={style} />
}

export function MenuEditor({ menu, setMenu, lang }) {
  const [newItems, setNewItems]       = useState({})
  const [confirmDel, setConfirmDel]   = useState(null)
  const [saved, setSaved]             = useState(false)

  const isHe = lang === 'he'

  function updateItem(catKey, si, ii, field, value) {
    setMenu(prev => {
      const next = JSON.parse(JSON.stringify(prev))
      next[catKey].subcats[si].items[ii][field] = value
      return next
    })
  }

  function deleteItem(catKey, si, ii) {
    setMenu(prev => {
      const next = JSON.parse(JSON.stringify(prev))
      next[catKey].subcats[si].items.splice(ii, 1)
      return next
    })
    setConfirmDel(null)
  }

  function addItem(catKey, si) {
    const key = `${catKey}-${si}`
    const draft = newItems[key]
    if (!draft || !draft.he) return
    setMenu(prev => {
      const next = JSON.parse(JSON.stringify(prev))
      next[catKey].subcats[si].items.push({ ...draft, id: `new_${Date.now()}` })
      return next
    })
    setNewItems(prev => ({ ...prev, [key]: null }))
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  function initNew(catKey, si) {
    const key = `${catKey}-${si}`
    setNewItems(prev => ({ ...prev, [key]: EMPTY_ITEM() }))
  }

  const cats = Object.entries(menu).filter(([, cat]) => cat.subcats)

  return (
    <div style={{ padding: '0 0 100px' }}>
      <div style={{ padding: '16px 16px 8px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: theme.stone, marginBottom: 4 }}>
          ✏️ {isHe ? 'עריכת תפריט' : 'Menu Editor'}
        </h2>
        <p style={{ fontSize: 13, color: theme.warmGray }}>
          {isHe ? 'ערוך שמות, מחירים, ותיאורים. הוסף ומחק פריטים.' : 'Edit names, prices, descriptions. Add and delete items.'}
        </p>
      </div>

      {cats.map(([catKey, cat]) => (
        <div key={catKey} style={{ marginBottom: 16 }}>
          <div style={{
            padding: '10px 16px',
            fontSize: 14,
            fontWeight: 700,
            color: theme.gold,
            background: theme.cardDeep,
            borderBottom: `1px solid ${theme.accent}`,
            borderTop: `1px solid ${theme.accent}`,
          }}>
            {cat.icon} {isHe ? cat.label_he : cat.label_en}
          </div>

          {cat.subcats.map((sub, si) => {
            const newKey = `${catKey}-${si}`
            return (
              <div key={si}>
                <div style={{
                  padding: '8px 16px',
                  fontSize: 11,
                  color: theme.brass,
                  letterSpacing: 1,
                  background: `${theme.card}88`,
                  fontWeight: 700,
                }}>
                  {isHe ? sub.title_he : sub.title_en}
                </div>

                {sub.items.map((item, ii) => (
                  <div
                    key={item.id}
                    style={{
                      padding: '12px 16px',
                      borderBottom: `1px solid ${theme.accent}20`,
                      background: item.active === false ? `${theme.ink}88` : 'transparent',
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 8,
                    }}>
                      <span style={{ fontSize: 22 }}>{item.emoji}</span>
                      <span style={{ flex: 1, fontSize: 14, fontWeight: 700, color: item.active ? theme.stone : theme.warmGray }}>
                        {item.he}
                      </span>
                      <button
                        onClick={() => updateItem(catKey, si, ii, 'active', !item.active)}
                        style={{
                          fontSize: 11,
                          padding: '3px 8px',
                          borderRadius: 4,
                          background: item.active ? `${theme.gold}22` : `${theme.warmGray}22`,
                          color: item.active ? theme.gold : theme.warmGray,
                          border: `1px solid ${item.active ? theme.brass : theme.accent}`,
                        }}
                      >
                        {item.active ? (isHe ? 'פעיל' : 'Active') : (isHe ? 'כבוי' : 'Off')}
                      </button>
                      {confirmDel === `${catKey}-${si}-${ii}` ? (
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button
                            onClick={() => deleteItem(catKey, si, ii)}
                            style={{ fontSize: 11, padding: '3px 8px', background: '#c0392b33', color: '#e74c3c', border: '1px solid #c0392b', borderRadius: 4 }}
                          >
                            {isHe ? 'אשר' : 'Yes'}
                          </button>
                          <button
                            onClick={() => setConfirmDel(null)}
                            style={{ fontSize: 11, padding: '3px 8px', background: theme.card, color: theme.warmGray, border: `1px solid ${theme.accent}`, borderRadius: 4 }}
                          >
                            {isHe ? 'ביטול' : 'Cancel'}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDel(`${catKey}-${si}-${ii}`)}
                          style={{ fontSize: 11, padding: '3px 6px', color: '#e74c3c', border: '1px solid #c0392b44', borderRadius: 4, background: 'transparent' }}
                        >
                          🗑
                        </button>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                      {['he','en','price','emoji'].map(f => (
                        <div key={f}>
                          <div style={{ fontSize: 10, color: theme.warmGray, marginBottom: 2 }}>{FIELD_LABELS[f]}</div>
                          <InlineInput
                            value={item[f] || ''}
                            onChange={v => updateItem(catKey, si, ii, f, v)}
                            placeholder={FIELD_LABELS[f]}
                          />
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 6 }}>
                      {['vibe_he','vibe_en','note_he','note_en'].map(f => (
                        <div key={f}>
                          <div style={{ fontSize: 10, color: theme.warmGray, marginBottom: 2 }}>{FIELD_LABELS[f]}</div>
                          <InlineInput
                            value={item[f] || ''}
                            onChange={v => updateItem(catKey, si, ii, f, v)}
                            placeholder={FIELD_LABELS[f]}
                            multiline
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Add new item */}
                {newItems[newKey] ? (
                  <div style={{ padding: '12px 16px', background: `${theme.card}88`, borderBottom: `1px solid ${theme.accent}` }}>
                    <div style={{ fontSize: 12, color: theme.gold, fontWeight: 700, marginBottom: 8 }}>
                      {isHe ? '+ פריט חדש' : '+ New item'}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                      {['he','en','price','emoji'].map(f => (
                        <div key={f}>
                          <div style={{ fontSize: 10, color: theme.warmGray, marginBottom: 2 }}>{FIELD_LABELS[f]}</div>
                          <InlineInput
                            value={newItems[newKey]?.[f] || ''}
                            onChange={v => setNewItems(prev => ({ ...prev, [newKey]: { ...prev[newKey], [f]: v } }))}
                            placeholder={FIELD_LABELS[f]}
                          />
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                      <button
                        onClick={() => addItem(catKey, si)}
                        style={{
                          flex: 1,
                          padding: '8px 0',
                          background: theme.gold,
                          color: theme.ink,
                          fontWeight: 700,
                          fontSize: 13,
                          borderRadius: 4,
                        }}
                      >
                        {isHe ? 'הוסף ←' : 'Add →'}
                      </button>
                      <button
                        onClick={() => setNewItems(prev => ({ ...prev, [newKey]: null }))}
                        style={{
                          padding: '8px 16px',
                          background: theme.card,
                          color: theme.warmGray,
                          fontSize: 13,
                          borderRadius: 4,
                          border: `1px solid ${theme.accent}`,
                        }}
                      >
                        {isHe ? 'ביטול' : 'Cancel'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => initNew(catKey, si)}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      fontSize: 13,
                      color: theme.brass,
                      textAlign: lang === 'he' ? 'right' : 'left',
                      borderBottom: `1px solid ${theme.accent}20`,
                      background: `${theme.card}44`,
                    }}
                  >
                    + {isHe ? 'הוסף פריט' : 'Add item'}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      ))}

      {/* Sticky save indicator */}
      {saved && (
        <div style={{
          position: 'fixed',
          bottom: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          background: theme.gold,
          color: theme.ink,
          padding: '10px 24px',
          borderRadius: 20,
          fontWeight: 700,
          fontSize: 14,
          animation: 'fadeSlideIn 200ms ease both',
          zIndex: 200,
        }}>
          ✓ {isHe ? 'נשמר' : 'Saved'}
        </div>
      )}
    </div>
  )
}
