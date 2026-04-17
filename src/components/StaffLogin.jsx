import { useState } from 'react'
import { theme, ease } from '../theme'

const CREDS = {
  bar:   { pass: 'bar2024',   role: 'bar',   name_he: 'צוות',  name_en: 'Staff' },
  yosi:  { pass: 'yosi2024',  role: 'yosi',  name_he: 'יוסי',  name_en: 'Yosi' },
  admin: { pass: 'admin123',  role: 'admin', name_he: 'אדמין', name_en: 'Admin' },
}

export function StaffLogin({ onLogin, onClose, lang }) {
  const [role, setRole] = useState('bar')
  const [pass, setPass] = useState('')
  const [err, setErr]   = useState('')

  function handleLogin() {
    const c = CREDS[role]
    if (pass === c.pass) {
      onLogin({ role: c.role, name: lang === 'he' ? c.name_he : c.name_en })
    } else {
      setErr(lang === 'he' ? 'סיסמה שגויה' : 'Wrong password')
    }
  }

  const roleLabels = {
    bar:   lang === 'he' ? 'צוות' : 'Staff',
    yosi:  lang === 'he' ? 'יוסי — בעלים' : 'Yosi — Owner',
    admin: lang === 'he' ? 'אדמין' : 'Admin',
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
        animation: 'fadeIn 150ms ease both',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: theme.card,
          border: `1px solid ${theme.accent}`,
          borderRadius: 10,
          padding: 28,
          width: '100%',
          maxWidth: 320,
          animation: 'fadeSlideIn 200ms cubic-bezier(0.4,0,0.2,1) both',
        }}
      >
        <h2 style={{ fontSize: 20, fontWeight: 900, color: theme.gold, marginBottom: 4 }}>
          {lang === 'he' ? 'כניסת צוות' : 'Staff Login'}
        </h2>
        <p style={{ fontSize: 13, color: theme.warmGray, marginBottom: 20 }}>
          {lang === 'he' ? 'אצל יוסי · נחלאות' : "At Yosi's · Nachlaot"}
        </p>

        <label style={{ display: 'block', marginBottom: 12 }}>
          <span style={{ fontSize: 11, color: theme.warmGray, display: 'block', marginBottom: 4 }}>
            {lang === 'he' ? 'תפקיד' : 'Role'}
          </span>
          <select
            value={role}
            onChange={e => { setRole(e.target.value); setErr('') }}
            style={{
              width: '100%',
              background: theme.cardDeep,
              border: `1px solid ${theme.accent}`,
              color: theme.stone,
              borderRadius: 6,
              padding: '10px 12px',
              fontSize: 14,
              fontFamily: "'Frank Ruhl Libre', serif",
            }}
          >
            {Object.keys(CREDS).map(r => (
              <option key={r} value={r}>{roleLabels[r]}</option>
            ))}
          </select>
        </label>

        <label style={{ display: 'block', marginBottom: 16 }}>
          <span style={{ fontSize: 11, color: theme.warmGray, display: 'block', marginBottom: 4 }}>
            {lang === 'he' ? 'סיסמה' : 'Password'}
          </span>
          <input
            type="password"
            value={pass}
            onChange={e => { setPass(e.target.value); setErr('') }}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder={lang === 'he' ? '••••••••' : '••••••••'}
            style={{
              width: '100%',
              background: theme.cardDeep,
              border: `1px solid ${err ? '#c0392b' : theme.accent}`,
              color: theme.stone,
              borderRadius: 6,
              padding: '10px 12px',
              fontSize: 14,
              fontFamily: "'Frank Ruhl Libre', serif",
              outline: 'none',
            }}
          />
        </label>

        {err && (
          <p style={{ fontSize: 12, color: '#e74c3c', marginBottom: 12 }}>{err}</p>
        )}

        <button
          onClick={handleLogin}
          style={{
            width: '100%',
            background: theme.gold,
            color: theme.ink,
            fontWeight: 700,
            fontSize: 15,
            padding: '12px 0',
            borderRadius: 6,
            transition: `transform 150ms ${ease}, filter 150ms ${ease}`,
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.filter = 'brightness(1.08)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.filter = 'brightness(1)' }}
        >
          {lang === 'he' ? 'כניסה ←' : 'Enter →'}
        </button>
      </div>
    </div>
  )
}
