import { theme, ease } from '../theme'

export function LangToggle({ lang, setLang }) {
  return (
    <div style={{
      display: 'flex',
      background: theme.card,
      border: `1px solid ${theme.accent}`,
      borderRadius: 20,
      overflow: 'hidden',
      fontSize: 12,
      fontWeight: 700,
    }}>
      {['he', 'en'].map(l => (
        <button
          key={l}
          onClick={() => setLang(l)}
          style={{
            padding: '5px 12px',
            background: lang === l ? theme.gold : 'transparent',
            color: lang === l ? theme.ink : theme.warmGray,
            transition: `background 180ms ${ease}, color 180ms ${ease}`,
            fontFamily: "'Frank Ruhl Libre', serif",
            fontWeight: 700,
            fontSize: 12,
          }}
        >
          {l === 'he' ? 'עב' : 'EN'}
        </button>
      ))}
    </div>
  )
}
