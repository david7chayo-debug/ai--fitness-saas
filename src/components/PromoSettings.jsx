import { useState } from 'react'
import { theme, ease } from '../theme'
import { usePromoSettings, useSpecialSettings } from '../hooks/usePromoSettings'

export function PromoSettings({ lang }) {
  const [promoSettings, setPromoSettings] = usePromoSettings()
  const [specialSettings, setSpecialSettings] = useSpecialSettings()
  const [tempSettings, setTempSettings] = useState(promoSettings)
  const [tempSpecial, setTempSpecial] = useState(specialSettings)
  const isHe = lang === 'he'

  const updateTemp = (key, value) => {
    setTempSettings(prev => ({ ...prev, [key]: value }))
  }

  const updateTempSpecial = (key, value) => {
    setTempSpecial(prev => ({ ...prev, [key]: value }))
  }

  const save = () => {
    setPromoSettings(tempSettings)
    setSpecialSettings(tempSpecial)
    alert(isHe ? 'הגדרות נשמרו!' : 'Settings saved!')
  }

  const colorOptions = [
    { key: 'gold', label: 'Gold', color: '#C8922A' },
    { key: 'blue', label: 'Blue', color: '#1A3A6B' },
    { key: 'red', label: 'Red', color: '#B22222' },
  ]

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ fontSize: 20, fontWeight: 900, color: theme.gold, marginBottom: 20 }}>
        📢 {isHe ? 'הגדרות פרומו' : 'Promo Settings'}
      </h2>

      {/* Active Toggle */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={tempSettings.active}
            onChange={e => updateTemp('active', e.target.checked)}
            style={{ width: 16, height: 16 }}
          />
          <span style={{ fontSize: 16, color: theme.stone }}>
            {isHe ? 'הפרומו פעיל' : 'Promo Active'}
          </span>
        </label>
      </div>

      {/* Text Fields */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 14, color: theme.gold, marginBottom: 4 }}>
            {isHe ? 'טקסט עברית:' : 'Hebrew Text:'}
          </label>
          <textarea
            value={tempSettings.text_he}
            onChange={e => updateTemp('text_he', e.target.value)}
            style={{
              width: '100%',
              padding: 8,
              border: `1px solid ${theme.accent}`,
              borderRadius: 4,
              background: theme.card,
              color: theme.stone,
              fontFamily: 'inherit',
              fontSize: 14,
              minHeight: 60,
            }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 14, color: theme.gold, marginBottom: 4 }}>
            {isHe ? 'טקסט אנגלית:' : 'English Text:'}
          </label>
          <textarea
            value={tempSettings.text_en}
            onChange={e => updateTemp('text_en', e.target.value)}
            style={{
              width: '100%',
              padding: 8,
              border: `1px solid ${theme.accent}`,
              borderRadius: 4,
              background: theme.card,
              color: theme.stone,
              fontFamily: 'inherit',
              fontSize: 14,
              minHeight: 60,
            }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 14, color: theme.gold, marginBottom: 4 }}>
            {isHe ? 'תת-טקסט עברית:' : 'Hebrew Subtext:'}
          </label>
          <input
            type="text"
            value={tempSettings.subtext_he}
            onChange={e => updateTemp('subtext_he', e.target.value)}
            style={{
              width: '100%',
              padding: 8,
              border: `1px solid ${theme.accent}`,
              borderRadius: 4,
              background: theme.card,
              color: theme.stone,
              fontFamily: 'inherit',
              fontSize: 14,
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 14, color: theme.gold, marginBottom: 4 }}>
            {isHe ? 'תת-טקסט אנגלית:' : 'English Subtext:'}
          </label>
          <input
            type="text"
            value={tempSettings.subtext_en}
            onChange={e => updateTemp('subtext_en', e.target.value)}
            style={{
              width: '100%',
              padding: 8,
              border: `1px solid ${theme.accent}`,
              borderRadius: 4,
              background: theme.card,
              color: theme.stone,
              fontFamily: 'inherit',
              fontSize: 14,
            }}
          />
        </div>
      </div>

      {/* Color Picker */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 14, color: theme.gold, marginBottom: 8 }}>
          {isHe ? 'צבע:' : 'Color:'}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {colorOptions.map(option => (
            <button
              key={option.key}
              onClick={() => updateTemp('color', option.key)}
              style={{
                padding: '8px 12px',
                border: `2px solid ${tempSettings.color === option.key ? theme.gold : theme.accent}`,
                borderRadius: 6,
                background: option.color,
                color: theme.stone,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                transition: `border-color 150ms ${ease}`,
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Special of the Night Section */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 900, color: theme.gold, marginBottom: 16 }}>
          ✨ {isHe ? 'מיוחד הלילה / Tonight\'s Special' : 'Tonight\'s Special'}
        </h2>

        {/* Special Active Toggle */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={tempSpecial.active}
              onChange={e => updateTempSpecial('active', e.target.checked)}
              style={{ width: 16, height: 16 }}
            />
            <span style={{ fontSize: 14, color: theme.stone }}>
              {isHe ? 'פעיל' : 'Active'}
            </span>
          </label>
        </div>

        {/* Special Text Fields */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 14, color: theme.gold, marginBottom: 4 }}>
              {isHe ? 'טקסט עברית:' : 'Hebrew Text:'}
            </label>
            <input
              type="text"
              value={tempSpecial.text_he}
              onChange={e => updateTempSpecial('text_he', e.target.value)}
              style={{
                width: '100%',
                padding: 8,
                border: `1px solid ${theme.accent}`,
                borderRadius: 4,
                background: theme.card,
                color: theme.stone,
                fontFamily: 'inherit',
                fontSize: 14,
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 14, color: theme.gold, marginBottom: 4 }}>
              {isHe ? 'טקסט אנגלית:' : 'English Text:'}
            </label>
            <input
              type="text"
              value={tempSpecial.text_en}
              onChange={e => updateTempSpecial('text_en', e.target.value)}
              style={{
                width: '100%',
                padding: 8,
                border: `1px solid ${theme.accent}`,
                borderRadius: 4,
                background: theme.card,
                color: theme.stone,
                fontFamily: 'inherit',
                fontSize: 14,
              }}
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={save}
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
          transition: `transform 150ms ${ease}, filter 150ms ${ease}`,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.02)'
          e.currentTarget.style.filter = 'brightness(1.1)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.filter = 'brightness(1)'
        }}
      >
        {isHe ? 'שמור' : 'Save'}
      </button>
    </div>
  )
}