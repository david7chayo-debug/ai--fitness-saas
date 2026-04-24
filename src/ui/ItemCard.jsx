import { useState } from 'react'
import { theme } from '../theme'

export function ItemCard({ item, lang, index = 0 }) {
  const [imgErr, setImgErr] = useState(false)
  const name = lang === 'he' ? item.he : (item.en || item.he)
  const vibe = lang === 'he' ? item.vibe_he : (item.vibe_en || item.vibe_he)
  const note = lang === 'he' ? item.note_he : (item.note_en || item.note_he)

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '10px 16px',
      borderBottom: `1px solid ${theme.accent}20`,
      animation: 'fadeSlideIn 220ms cubic-bezier(0.4,0,0.2,1) both',
      animationDelay: `${index * 30}ms`,
    }}>
      <div style={{
        width: 60,
        height: 60,
        borderRadius: 6,
        background: theme.card,
        border: `1px solid ${theme.accent}`,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 30,
        overflow: 'hidden',
      }}>
        {item.img && !imgErr ? (
          <img
            src={item.img}
            alt={name}
            onError={() => setImgErr(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span>{item.emoji || '🍺'}</span>
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 16,
          fontWeight: 700,
          color: theme.stone,
          lineHeight: 1.3,
          marginBottom: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          {name}
          {item.popular && (
            <span style={{
              background: theme.accent,
              color: theme.gold,
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: 1,
              padding: '2px 6px',
              borderRadius: 10,
              whiteSpace: 'nowrap',
            }}>
              {lang === 'he' ? '🔥 פופולרי' : '🔥 Popular'}
            </span>
          )}
        </div>
        {vibe && (
          <div style={{
            fontFamily: "'Libre Baskerville', serif",
            fontStyle: 'italic',
            fontSize: 12,
            color: theme.gold,
            lineHeight: 1.4,
            marginBottom: note ? 2 : 0,
          }}>
            {vibe}
          </div>
        )}
        {note && (
          <div style={{
            fontSize: 11,
            color: theme.warmGray,
            fontWeight: 300,
          }}>
            {note}
          </div>
        )}
      </div>

      <div style={{
        flexShrink: 0,
        background: theme.card,
        border: `1px solid ${theme.brass}`,
        color: theme.gold,
        fontSize: 13,
        fontWeight: 700,
        padding: '4px 8px',
        borderRadius: 4,
        whiteSpace: 'nowrap',
      }}>
        {item.price}
      </div>
    </div>
  )
}
