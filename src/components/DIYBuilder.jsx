import { useState } from 'react'
import { theme, ease } from '../theme'

const BASES = [
  { id: 'vodka',   he: 'וודקה',  en: 'Vodka',   price: 15 },
  { id: 'gin',     he: "ג'ין",   en: 'Gin',      price: 15 },
  { id: 'rum',     he: 'רום',    en: 'Rum',       price: 15 },
  { id: 'tequila', he: 'טקילה',  en: 'Tequila',  price: 18 },
  { id: 'whisky',  he: 'וויסקי', en: 'Whisky',   price: 20 },
  { id: 'arak',    he: 'ערק',    en: 'Arak',      price: 12 },
]

const MIXERS = [
  { id: 'cola',     he: 'קולה',    en: 'Cola',      extra: 0 },
  { id: 'soda',     he: 'סודה',    en: 'Soda',      extra: 0 },
  { id: 'oj',       he: 'מיץ תפוז', en: 'OJ',       extra: 0 },
  { id: 'lemonade', he: 'לימונדה', en: 'Lemonade',   extra: 5 },
  { id: 'tonic',    he: 'טוניק',   en: 'Tonic',     extra: 5 },
  { id: 'energy',   he: 'אנרגי',   en: 'Energy',    extra: 8 },
]

const EXTRAS = [
  { id: 'lemon', he: 'לימון',    en: 'Lemon' },
  { id: 'mint',  he: 'נענע',     en: 'Mint' },
  { id: 'ice',   he: 'קרח',      en: 'Ice' },
  { id: 'salt',  he: 'מלח על שפה', en: 'Salt rim' },
]

const COMBO_NAMES = {
  'vodka-cola':     { he: 'וודקה קולה', en: 'Vodka Cola' },
  'vodka-soda':     { he: 'וודקה סודה', en: 'Vodka Soda' },
  'vodka-oj':       { he: 'וודקה מיץ', en: 'Screwdriver' },
  'vodka-lemonade': { he: 'וודקה לימונדה', en: 'Vodka Lemonade' },
  'vodka-tonic':    { he: 'וודקה טוניק', en: 'Vodka Tonic' },
  'vodka-energy':   { he: 'וודקה אנרגי', en: 'Vodka Energy' },
  'gin-tonic':      { he: "ג'ין טוניק", en: 'Gin & Tonic' },
  'gin-lemonade':   { he: "ג'ין לימונדה", en: 'Gin Lemonade' },
  'gin-soda':       { he: "ג'ין סודה", en: 'Gin Soda' },
  'rum-cola':       { he: 'קובה ליברה', en: 'Cuba Libre' },
  'rum-lemonade':   { he: 'רום לימונדה', en: 'Rum Lemonade' },
  'whisky-cola':    { he: 'וויסקי קולה', en: 'Whisky Cola' },
  'whisky-soda':    { he: 'וויסקי סודה', en: 'Whisky Soda' },
  'tequila-oj':     { he: 'טקילה סאנרייז', en: 'Tequila Sunrise' },
  'arak-lemonade':  { he: 'שרק לימונית', en: 'Sharak Limonit' },
  'arak-soda':      { he: 'ערק סודה', en: 'Arak Soda' },
}

function Chip({ label, selected, onClick, suffix }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '7px 14px',
        borderRadius: 20,
        fontSize: 13,
        fontWeight: selected ? 700 : 400,
        background: selected ? theme.gold : theme.card,
        color: selected ? theme.ink : theme.parchment,
        border: `1px solid ${selected ? theme.gold : theme.accent}`,
        transition: `all 180ms ${ease}`,
        fontFamily: "'Frank Ruhl Libre', serif",
      }}
    >
      {label}{suffix && <span style={{ fontSize: 11, opacity: 0.8 }}> {suffix}</span>}
    </button>
  )
}

export function DIYBuilder({ lang }) {
  const [base, setBase]     = useState(null)
  const [mixer, setMixer]   = useState(null)
  const [extras, setExtras] = useState([])

  const isHe = lang === 'he'

  function toggleExtra(id) {
    setExtras(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id])
  }

  const baseObj  = BASES.find(b => b.id === base)
  const mixerObj = MIXERS.find(m => m.id === mixer)
  const total    = (baseObj?.price || 0) + (mixerObj?.extra || 0)

  const comboKey  = base && mixer ? `${base}-${mixer}` : null
  const comboName = comboKey && COMBO_NAMES[comboKey]
    ? (isHe ? COMBO_NAMES[comboKey].he : COMBO_NAMES[comboKey].en)
    : base && mixer
      ? (isHe ? `${baseObj?.he} + ${mixerObj?.he}` : `${baseObj?.en} + ${mixerObj?.en}`)
      : null

  const sectionStyle = { marginBottom: 24 }
  const labelStyle = { fontSize: 12, color: theme.warmGray, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10, display: 'block' }
  const chipsStyle = { display: 'flex', flexWrap: 'wrap', gap: 8 }

  return (
    <div style={{ padding: '20px 16px' }}>
      <h2 style={{ fontSize: 18, fontWeight: 900, color: theme.stone, marginBottom: 6 }}>
        {isHe ? '✨ בנה את הדריקס שלך' : '✨ Build Your Drink'}
      </h2>
      <p style={{ fontSize: 13, color: theme.warmGray, marginBottom: 24, fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic' }}>
        {isHe ? 'בחר בסיס + מיקסר, ואם רוצה — תוספות. ואז תראה לבר.' : 'Pick a base + mixer, add extras if you want. Then show the bar.'}
      </p>

      {/* Step 1: Base */}
      <div style={sectionStyle}>
        <span style={labelStyle}>{isHe ? 'שלב 1 — בסיס' : 'Step 1 — Base'}</span>
        <div style={chipsStyle}>
          {BASES.map(b => (
            <Chip
              key={b.id}
              label={isHe ? b.he : b.en}
              selected={base === b.id}
              onClick={() => setBase(base === b.id ? null : b.id)}
              suffix={`${b.price}₪`}
            />
          ))}
        </div>
      </div>

      {/* Step 2: Mixer */}
      <div style={sectionStyle}>
        <span style={labelStyle}>{isHe ? 'שלב 2 — מיקסר' : 'Step 2 — Mixer'}</span>
        <div style={chipsStyle}>
          {MIXERS.map(m => (
            <Chip
              key={m.id}
              label={isHe ? m.he : m.en}
              selected={mixer === m.id}
              onClick={() => setMixer(mixer === m.id ? null : m.id)}
              suffix={m.extra > 0 ? `+${m.extra}₪` : isHe ? 'חינם' : 'free'}
            />
          ))}
        </div>
      </div>

      {/* Step 3: Extras */}
      <div style={sectionStyle}>
        <span style={labelStyle}>{isHe ? 'שלב 3 — תוספות (אופציונלי)' : 'Step 3 — Extras (optional)'}</span>
        <div style={chipsStyle}>
          {EXTRAS.map(ex => (
            <Chip
              key={ex.id}
              label={isHe ? ex.he : ex.en}
              selected={extras.includes(ex.id)}
              onClick={() => toggleExtra(ex.id)}
              suffix={isHe ? 'חינם' : 'free'}
            />
          ))}
        </div>
      </div>

      {/* Result */}
      {base && mixer && (
        <div style={{
          background: theme.card,
          border: `1px solid ${theme.brass}`,
          borderRadius: 8,
          padding: 20,
          textAlign: 'center',
          animation: 'fadeSlideIn 200ms cubic-bezier(0.4,0,0.2,1) both',
        }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: theme.gold, marginBottom: 6 }}>
            {comboName}
          </div>
          {extras.length > 0 && (
            <div style={{ fontSize: 12, color: theme.warmGray, marginBottom: 8 }}>
              + {extras.map(id => {
                const ex = EXTRAS.find(e => e.id === id)
                return isHe ? ex?.he : ex?.en
              }).join(', ')}
            </div>
          )}
          <div style={{ fontSize: 32, fontWeight: 900, color: theme.gold }}>
            {total} ₪
          </div>
          <p style={{
            marginTop: 12,
            fontSize: 13,
            color: theme.parchment,
            fontFamily: "'Libre Baskerville', serif",
            fontStyle: 'italic',
          }}>
            {isHe ? 'תראה לבר את הבחירות שלך 🍹' : 'Show your choices to the bartender 🍹'}
          </p>
        </div>
      )}
    </div>
  )
}
