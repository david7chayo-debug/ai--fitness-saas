import { useState } from 'react'
import { theme, ease } from '../theme'
import { igTemplates } from '../data/igTemplates'
import { useStorage } from '../hooks/useStorage'

const DAY_NAMES_HE = ['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת']
const DAY_NAMES_EN = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

function getWeekStart(offset = 0) {
  const d = new Date()
  d.setDate(d.getDate() - d.getDay() + offset * 7)
  d.setHours(0,0,0,0)
  return d
}

function fmt(d) { return `${d.getDate()}/${d.getMonth()+1}` }
function isoDate(d) { return d.toISOString().slice(0,10) }

export function IGPlanner({ lang }) {
  const isHe = lang === 'he'
  const [weekOffset, setWeekOffset] = useState(0)
  const [selectedDay, setSelectedDay] = useState(null)
  const [postLang, setPostLang]       = useState(lang)
  const [schedule, setSchedule]       = useStorage('ig_schedule', {})
  const [copied, setCopied]           = useState(false)

  const weekStart = getWeekStart(weekOffset)
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(weekStart.getDate() + i)
    return d
  })

  function assignTemplate(dayIso, templateId) {
    setSchedule(prev => ({ ...prev, [dayIso]: templateId }))
  }

  function removeTemplate(dayIso) {
    setSchedule(prev => {
      const next = { ...prev }
      delete next[dayIso]
      return next
    })
  }

  async function copyPost(templateId) {
    const tmpl = igTemplates.find(t => t.id === templateId)
    if (!tmpl) return
    const text = postLang === 'he' ? tmpl.he : tmpl.en
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  const selectedIso = selectedDay ? isoDate(selectedDay) : null
  const assignedTemplateId = selectedIso ? schedule[selectedIso] : null
  const assignedTemplate = assignedTemplateId ? igTemplates.find(t => t.id === assignedTemplateId) : null

  // Upcoming posts (next 30 days)
  const upcoming = Object.entries(schedule)
    .filter(([iso]) => iso >= isoDate(new Date()))
    .sort(([a],[b]) => a.localeCompare(b))
    .slice(0, 10)

  return (
    <div style={{ padding: '0 0 80px' }}>
      <div style={{ padding: '16px 16px 8px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: theme.stone, marginBottom: 4 }}>
          📸 {isHe ? 'תכנון אינסטגרם' : 'Instagram Planner'}
        </h2>
        <p style={{ fontSize: 13, color: theme.warmGray }}>
          {isHe ? 'שייך תבניות לימים, העתק לפרסום.' : 'Assign templates to days, copy to post.'}
        </p>
      </div>

      {/* Week nav */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 16px',
        marginBottom: 4,
      }}>
        <button onClick={() => setWeekOffset(w => w - 1)} style={{ color: theme.gold, fontSize: 20, padding: '4px 8px' }}>‹</button>
        <span style={{ fontSize: 13, color: theme.parchment, fontWeight: 700 }}>
          {fmt(days[0])} – {fmt(days[6])}
        </span>
        <button onClick={() => setWeekOffset(w => w + 1)} style={{ color: theme.gold, fontSize: 20, padding: '4px 8px' }}>›</button>
      </div>

      {/* Calendar grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 4,
        padding: '0 12px 16px',
      }}>
        {days.map((d, i) => {
          const iso    = isoDate(d)
          const hasTpl = !!schedule[iso]
          const isToday = isoDate(new Date()) === iso
          const isSel  = selectedDay && isoDate(selectedDay) === iso

          return (
            <button
              key={iso}
              onClick={() => setSelectedDay(isSel ? null : d)}
              style={{
                borderRadius: 6,
                padding: '8px 2px',
                background: isSel ? theme.gold : hasTpl ? `${theme.brass}44` : theme.card,
                border: `1px solid ${isSel ? theme.gold : isToday ? theme.brass : theme.accent}`,
                textAlign: 'center',
                transition: `background 150ms ${ease}`,
              }}
            >
              <div style={{ fontSize: 10, color: isSel ? theme.ink : theme.warmGray, marginBottom: 2 }}>
                {isHe ? DAY_NAMES_HE[i] : DAY_NAMES_EN[i]}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: isSel ? theme.ink : isToday ? theme.gold : theme.stone }}>
                {d.getDate()}
              </div>
              {hasTpl && (
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: isSel ? theme.ink : theme.gold, margin: '3px auto 0' }} />
              )}
            </button>
          )
        })}
      </div>

      {/* Template selector */}
      {selectedDay && (
        <div style={{
          padding: '0 16px 16px',
          animation: 'fadeSlideIn 200ms ease both',
        }}>
          <div style={{
            fontSize: 13,
            fontWeight: 700,
            color: theme.gold,
            marginBottom: 10,
          }}>
            {isHe ? `יום ${DAY_NAMES_HE[selectedDay.getDay()]} ${fmt(selectedDay)}` : `${DAY_NAMES_EN[selectedDay.getDay()]} ${fmt(selectedDay)}`}
          </div>

          {/* Post language toggle */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
            {['he','en'].map(l => (
              <button
                key={l}
                onClick={() => setPostLang(l)}
                style={{
                  padding: '5px 14px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 700,
                  background: postLang === l ? theme.gold : theme.card,
                  color: postLang === l ? theme.ink : theme.warmGray,
                  border: `1px solid ${postLang === l ? theme.gold : theme.accent}`,
                  transition: `all 150ms ${ease}`,
                }}
              >
                {l === 'he' ? 'עברית' : 'English'}
              </button>
            ))}
          </div>

          {/* Templates */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {igTemplates.map(tmpl => {
              const isAssigned = schedule[selectedIso] === tmpl.id
              return (
                <div
                  key={tmpl.id}
                  style={{
                    background: isAssigned ? `${theme.gold}22` : theme.card,
                    border: `1px solid ${isAssigned ? theme.gold : theme.accent}`,
                    borderRadius: 6,
                    padding: '10px 12px',
                    cursor: 'pointer',
                  }}
                  onClick={() => isAssigned ? removeTemplate(selectedIso) : assignTemplate(selectedIso, tmpl.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 18 }}>{tmpl.emoji}</span>
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color: isAssigned ? theme.gold : theme.stone }}>
                      {tmpl.title}
                    </span>
                    {isAssigned && (
                      <span style={{ fontSize: 11, color: theme.gold }}>✓ {isHe ? 'משויך' : 'Assigned'}</span>
                    )}
                  </div>
                  <div style={{
                    fontSize: 11,
                    color: theme.warmGray,
                    whiteSpace: 'pre-line',
                    maxHeight: 50,
                    overflow: 'hidden',
                  }}>
                    {(postLang === 'he' ? tmpl.he : tmpl.en).split('\n').slice(0,3).join('\n')}...
                  </div>
                </div>
              )
            })}
          </div>

          {/* Copy button */}
          {assignedTemplate && (
            <div style={{ marginTop: 12 }}>
              <div style={{
                background: theme.cardDeep,
                border: `1px solid ${theme.accent}`,
                borderRadius: 6,
                padding: 12,
                fontSize: 12,
                color: theme.parchment,
                whiteSpace: 'pre-line',
                lineHeight: 1.6,
                marginBottom: 8,
              }}>
                {postLang === 'he' ? assignedTemplate.he : assignedTemplate.en}
              </div>
              <button
                onClick={() => copyPost(assignedTemplate.id)}
                style={{
                  width: '100%',
                  padding: '11px 0',
                  background: copied ? `${theme.gold}44` : theme.gold,
                  color: theme.ink,
                  fontWeight: 700,
                  fontSize: 14,
                  borderRadius: 6,
                  transition: `background 150ms ${ease}`,
                }}
              >
                {copied ? (isHe ? '✓ הועתק!' : '✓ Copied!') : (isHe ? '📋 העתק לקליפבורד' : '📋 Copy to clipboard')}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Upcoming posts */}
      {upcoming.length > 0 && (
        <div style={{ padding: '0 16px' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: theme.gold, marginBottom: 10 }}>
            {isHe ? '📅 פוסטים מתוכננים' : '📅 Upcoming posts'}
          </div>
          {upcoming.map(([iso, tid]) => {
            const tmpl = igTemplates.find(t => t.id === tid)
            if (!tmpl) return null
            const d = new Date(iso)
            const dayName = isHe ? DAY_NAMES_HE[d.getDay()] : DAY_NAMES_EN[d.getDay()]
            return (
              <div key={iso} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '8px 0',
                borderBottom: `1px solid ${theme.accent}20`,
              }}>
                <span style={{ fontSize: 18 }}>{tmpl.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: theme.stone }}>{tmpl.title}</div>
                  <div style={{ fontSize: 11, color: theme.warmGray }}>{dayName} {fmt(d)}</div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
