import { useState, useEffect } from 'react'
import { theme, ease } from '../theme'
import { useSportsEvents } from '../hooks/useSportsEvents'

const EVENT_TYPES = {
  beitar: { icon: '🏆', title_he: 'ביתר ירושלים', title_en: 'Beitar Jerusalem' },
  champions: { icon: '⭐', title_he: 'ליגת האלופות', title_en: 'Champions League' },
  mundial: { icon: '🌍', title_he: 'מונדיאל 2026', title_en: 'World Cup 2026' },
  israeli: { icon: '🇮🇱', title_he: 'ליגה ישראלית', title_en: 'Israeli League' },
  clasico: { icon: '⚽', title_he: 'קלאסיקו', title_en: 'Clasico' },
  custom: { icon: '✏️', title_he: 'מותאם אישית', title_en: 'Custom' },
}

const PRESET_PROMOS = [
  { text_he: '🥃 שוט על גול', text_en: '🥃 Shot per goal' },
  { text_he: '🍺 קומבו לפני משחק', text_en: '🍺 Pre-match combo' },
  { text_he: '⏰ האפי אוור עד קיקאוף', text_en: '⏰ Happy hour until kickoff' },
  { text_he: '👥 שולחן לקבוצות', text_en: '👥 Group tables' },
]

const COLOR_OPTIONS = [
  { key: 'gold', color: '#C8922A' },
  { key: 'blue', color: '#1A3A6B' },
  { key: 'red', color: '#B22222' },
]

export function SportsPlanner({ lang }) {
  const [events, setEvents] = useSportsEvents()
  const [editingEvent, setEditingEvent] = useState(null)
  const [form, setForm] = useState({
    type: 'beitar',
    icon: '🏆',
    title_he: '',
    title_en: '',
    teams: '',
    date: '',
    time: '',
    promos: [],
    note: '',
    color: 'gold',
    postText_he: '',
    postText_en: '',
  })
  const [postTab, setPostTab] = useState('he')
  const isHe = lang === 'he'

  // Calculate World Cup countdown
  const today = new Date()
  const worldCup = new Date('2026-06-11')
  const daysUntil = Math.ceil((worldCup - today) / (1000 * 60 * 60 * 24))

  useEffect(() => {
    if (editingEvent) {
      setForm(editingEvent)
    } else {
      resetForm()
    }
  }, [editingEvent])

  const resetForm = () => {
    setForm({
      type: 'beitar',
      icon: EVENT_TYPES.beitar.icon,
      title_he: EVENT_TYPES.beitar.title_he,
      title_en: EVENT_TYPES.beitar.title_en,
      teams: '',
      date: '',
      time: '',
      promos: [],
      note: '',
      color: 'gold',
      postText_he: '',
      postText_en: '',
    })
  }

  const updateForm = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleTypeChange = (type) => {
    updateForm('type', type)
    if (type !== 'custom') {
      updateForm('icon', EVENT_TYPES[type].icon)
      updateForm('title_he', EVENT_TYPES[type].title_he)
      updateForm('title_en', EVENT_TYPES[type].title_en)
    } else {
      updateForm('icon', '✏️')
      updateForm('title_he', '')
      updateForm('title_en', '')
    }
  }

  const addPromo = () => {
    const newPromo = { id: Date.now().toString(), text_he: '', text_en: '', active: true }
    updateForm('promos', [...form.promos, newPromo])
  }

  const updatePromo = (id, key, value) => {
    updateForm('promos', form.promos.map(p => p.id === id ? { ...p, [key]: value } : p))
  }

  const deletePromo = (id) => {
    updateForm('promos', form.promos.filter(p => p.id !== id))
  }

  const addPresetPromo = (preset) => {
    const newPromo = { id: Date.now().toString(), ...preset, active: true }
    updateForm('promos', [...form.promos, newPromo])
  }

  const generatePost = () => {
    const activePromos = form.promos.filter(p => p.active)
    const dateObj = new Date(form.date)
    const formattedDate = dateObj.toLocaleDateString(isHe ? 'he-IL' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    const promoListHe = activePromos.map(p => `• ${p.text_he}`).join('\n')
    const promoListEn = activePromos.map(p => `• ${p.text_en}`).join('\n')

    const postHe = `${form.icon} ${form.title_he} — ${form.teams}\n${formattedDate} | ${form.time}\n\n${promoListHe}\n\nאצל יוסי | נסים בשר 18, נחלאות\n@etzelyosi\n#ביתר_ירושלים #נחלאות #אצל_יוסי`
    const postEn = `${form.icon} ${form.title_en} — ${form.teams}\n${formattedDate} | ${form.time}\n\n${promoListEn}\n\nEtzel Yosi | Nissim Bachar 18, Nachlaot\n@etzelyosi\n#beitarjerusalem #nachlaot #etzelyosi #jerusalem`

    updateForm('postText_he', postHe)
    updateForm('postText_en', postEn)
  }

  const saveEvent = () => {
    const event = {
      ...form,
      id: editingEvent ? editingEvent.id : Date.now().toString(),
      createdAt: editingEvent ? editingEvent.createdAt : new Date().toISOString(),
    }

    if (editingEvent) {
      setEvents(events.map(e => e.id === editingEvent.id ? event : e))
    } else {
      setEvents([...events, event])
    }

    setEditingEvent(null)
    resetForm()
  }

  const editEvent = (event) => {
    setEditingEvent(event)
  }

  const deleteEvent = (id) => {
    if (confirm(isHe ? 'האם למחוק את המשחק?' : 'Delete this match?')) {
      setEvents(events.filter(e => e.id !== id))
    }
  }

  const copyPost = (event) => {
    const text = isHe ? event.postText_he : event.postText_en
    navigator.clipboard.writeText(text)
    alert(isHe ? 'הפוסט הועתק!' : 'Post copied!')
  }

  const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <div style={{ padding: 16 }}>
      {/* World Cup Countdown */}
      <div style={{
        background: `linear-gradient(135deg, ${theme.gold}, ${theme.brass})`,
        padding: 16,
        borderRadius: 8,
        textAlign: 'center',
        marginBottom: 20,
        border: `2px solid ${theme.gold}`,
      }}>
        <div style={{ fontSize: 18, fontWeight: 900, color: theme.ink }}>
          {isHe ? `${daysUntil} ימים למונדיאל 2026` : `${daysUntil} days to World Cup 2026`}
        </div>
        <div style={{ fontSize: 12, color: theme.ink, opacity: 0.8, marginTop: 4 }}>
          🌍 June 11, 2026
        </div>
      </div>

      {/* Add/Edit Form */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 18, fontWeight: 900, color: theme.gold, marginBottom: 16 }}>
          ➕ {isHe ? 'הוסף משחק' : 'Add Match'}
        </h3>

        {/* Event Type */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 14, color: theme.gold, marginBottom: 8 }}>
            {isHe ? 'סוג משחק:' : 'Event Type:'}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {Object.entries(EVENT_TYPES).map(([key, type]) => (
              <button
                key={key}
                onClick={() => handleTypeChange(key)}
                style={{
                  padding: '8px 12px',
                  border: `2px solid ${form.type === key ? theme.gold : theme.accent}`,
                  borderRadius: 6,
                  background: form.type === key ? theme.card : theme.cardDeep,
                  color: theme.stone,
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                {type.icon} {isHe ? type.title_he : type.title_en}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Fields */}
        {form.type === 'custom' && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                placeholder={isHe ? 'איקון' : 'Icon'}
                value={form.icon}
                onChange={e => updateForm('icon', e.target.value)}
                style={{
                  flex: 1,
                  padding: 8,
                  border: `1px solid ${theme.accent}`,
                  borderRadius: 4,
                  background: theme.card,
                  color: theme.stone,
                }}
              />
              <input
                type="text"
                placeholder={isHe ? 'כותרת עברית' : 'Hebrew Title'}
                value={form.title_he}
                onChange={e => updateForm('title_he', e.target.value)}
                style={{
                  flex: 1,
                  padding: 8,
                  border: `1px solid ${theme.accent}`,
                  borderRadius: 4,
                  background: theme.card,
                  color: theme.stone,
                }}
              />
              <input
                type="text"
                placeholder={isHe ? 'כותרת אנגלית' : 'English Title'}
                value={form.title_en}
                onChange={e => updateForm('title_en', e.target.value)}
                style={{
                  flex: 1,
                  padding: 8,
                  border: `1px solid ${theme.accent}`,
                  borderRadius: 4,
                  background: theme.card,
                  color: theme.stone,
                }}
              />
            </div>
          </div>
        )}

        {/* Teams */}
        <div style={{ marginBottom: 16 }}>
          <input
            type="text"
            placeholder={isHe ? 'ביתר נגד ___' : 'Beitar vs ___'}
            value={form.teams}
            onChange={e => updateForm('teams', e.target.value)}
            style={{
              width: '100%',
              padding: 8,
              border: `1px solid ${theme.accent}`,
              borderRadius: 4,
              background: theme.card,
              color: theme.stone,
            }}
          />
        </div>

        {/* Date & Time */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <input
            type="date"
            value={form.date}
            onChange={e => updateForm('date', e.target.value)}
            style={{
              flex: 1,
              padding: 8,
              border: `1px solid ${theme.accent}`,
              borderRadius: 4,
              background: theme.card,
              color: theme.stone,
            }}
          />
          <input
            type="time"
            value={form.time}
            onChange={e => updateForm('time', e.target.value)}
            style={{
              flex: 1,
              padding: 8,
              border: `1px solid ${theme.accent}`,
              borderRadius: 4,
              background: theme.card,
              color: theme.stone,
            }}
          />
        </div>

        {/* Promos */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 14, color: theme.gold, marginBottom: 8 }}>
            {isHe ? 'פרומואים:' : 'Promos:'}
          </div>
          {form.promos.map(promo => (
            <div key={promo.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <input
                type="checkbox"
                checked={promo.active}
                onChange={e => updatePromo(promo.id, 'active', e.target.checked)}
              />
              <input
                type="text"
                placeholder={isHe ? 'טקסט עברית' : 'Hebrew text'}
                value={promo.text_he}
                onChange={e => updatePromo(promo.id, 'text_he', e.target.value)}
                style={{
                  flex: 1,
                  padding: 6,
                  border: `1px solid ${theme.accent}`,
                  borderRadius: 4,
                  background: theme.card,
                  color: theme.stone,
                  fontSize: 12,
                }}
              />
              <input
                type="text"
                placeholder={isHe ? 'טקסט אנגלית' : 'English text'}
                value={promo.text_en}
                onChange={e => updatePromo(promo.id, 'text_en', e.target.value)}
                style={{
                  flex: 1,
                  padding: 6,
                  border: `1px solid ${theme.accent}`,
                  borderRadius: 4,
                  background: theme.card,
                  color: theme.stone,
                  fontSize: 12,
                }}
              />
              <button
                onClick={() => deletePromo(promo.id)}
                style={{
                  padding: '6px 8px',
                  background: '#B22222',
                  color: theme.stone,
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                }}
              >
                🗑
              </button>
            </div>
          ))}
          <button
            onClick={addPromo}
            style={{
              padding: '8px 12px',
              background: theme.accent,
              color: theme.stone,
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              marginRight: 8,
            }}
          >
            ➕ {isHe ? 'הוסף פרומו' : 'Add Promo'}
          </button>
          {PRESET_PROMOS.map((preset, i) => (
            <button
              key={i}
              onClick={() => addPresetPromo(preset)}
              style={{
                padding: '6px 10px',
                background: theme.card,
                color: theme.stone,
                border: `1px solid ${theme.accent}`,
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: 11,
                marginRight: 4,
                marginBottom: 4,
              }}
            >
              {isHe ? preset.text_he : preset.text_en}
            </button>
          ))}
        </div>

        {/* Color */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 14, color: theme.gold, marginBottom: 8 }}>
            {isHe ? 'צבע:' : 'Color:'}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {COLOR_OPTIONS.map(option => (
              <button
                key={option.key}
                onClick={() => updateForm('color', option.key)}
                style={{
                  width: 30,
                  height: 30,
                  border: `2px solid ${form.color === option.key ? theme.gold : theme.accent}`,
                  borderRadius: '50%',
                  background: option.color,
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>
        </div>

        {/* Note */}
        <div style={{ marginBottom: 16 }}>
          <input
            type="text"
            placeholder={isHe ? 'הערה (אופציונלי)' : 'Note (optional)'}
            value={form.note}
            onChange={e => updateForm('note', e.target.value)}
            style={{
              width: '100%',
              padding: 8,
              border: `1px solid ${theme.accent}`,
              borderRadius: 4,
              background: theme.card,
              color: theme.stone,
            }}
          />
        </div>

        {/* Generate Post */}
        <button
          onClick={generatePost}
          style={{
            padding: '10px 16px',
            background: theme.gold,
            color: theme.ink,
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            marginBottom: 16,
          }}
        >
          {isHe ? 'צור פוסט אוטומטי' : 'Auto-generate Post'}
        </button>

        {/* Post Editor */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
            <button
              onClick={() => setPostTab('he')}
              style={{
                padding: '6px 12px',
                background: postTab === 'he' ? theme.gold : theme.accent,
                color: postTab === 'he' ? theme.ink : theme.stone,
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              עברית
            </button>
            <button
              onClick={() => setPostTab('en')}
              style={{
                padding: '6px 12px',
                background: postTab === 'en' ? theme.gold : theme.accent,
                color: postTab === 'en' ? theme.ink : theme.stone,
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              English
            </button>
          </div>
          <textarea
            value={postTab === 'he' ? form.postText_he : form.postText_en}
            onChange={e => updateForm(postTab === 'he' ? 'postText_he' : 'postText_en', e.target.value)}
            style={{
              width: '100%',
              height: 120,
              padding: 8,
              border: `1px solid ${theme.accent}`,
              borderRadius: 4,
              background: theme.card,
              color: theme.stone,
              fontFamily: 'monospace',
              fontSize: 12,
            }}
          />
        </div>

        {/* Save */}
        <button
          onClick={saveEvent}
          style={{
            width: '100%',
            padding: '12px',
            background: theme.gold,
            color: theme.ink,
            border: 'none',
            borderRadius: 6,
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {isHe ? 'שמור משחק' : 'Save Match'}
        </button>
      </div>

      {/* Events List */}
      <div>
        <h3 style={{ fontSize: 18, fontWeight: 900, color: theme.gold, marginBottom: 16 }}>
          {isHe ? 'משחקים מתוכננים' : 'Scheduled Matches'}
        </h3>
        {sortedEvents.map(event => {
          const isPast = new Date(event.date) < today
          return (
            <div
              key={event.id}
              style={{
                background: theme.card,
                borderLeft: `4px solid ${COLOR_OPTIONS.find(c => c.key === event.color)?.color || theme.gold}`,
                padding: 12,
                borderRadius: 6,
                marginBottom: 12,
                opacity: isPast ? 0.6 : 1,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: theme.stone }}>
                    {event.icon} {isHe ? event.title_he : event.title_en} — {event.teams}
                  </div>
                  <div style={{ fontSize: 12, color: theme.warmGray, marginTop: 4 }}>
                    {new Date(event.date).toLocaleDateString()} | {event.time}
                  </div>
                  <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' }}>
                    {event.promos.filter(p => p.active).map(promo => (
                      <span
                        key={promo.id}
                        style={{
                          background: theme.accent,
                          color: theme.stone,
                          padding: '2px 6px',
                          borderRadius: 10,
                          fontSize: 10,
                        }}
                      >
                        {isHe ? promo.text_he : promo.text_en}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button
                    onClick={() => editEvent(event)}
                    style={{
                      padding: '4px 8px',
                      background: theme.accent,
                      color: theme.stone,
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontSize: 12,
                    }}
                  >
                    ✏️ {isHe ? 'ערוך' : 'Edit'}
                  </button>
                  <button
                    onClick={() => copyPost(event)}
                    style={{
                      padding: '4px 8px',
                      background: theme.gold,
                      color: theme.ink,
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontSize: 12,
                    }}
                  >
                    📋 {isHe ? 'העתק' : 'Copy'}
                  </button>
                  <button
                    onClick={() => deleteEvent(event.id)}
                    style={{
                      padding: '4px 8px',
                      background: '#B22222',
                      color: theme.stone,
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontSize: 12,
                    }}
                  >
                    🗑 {isHe ? 'מחק' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}