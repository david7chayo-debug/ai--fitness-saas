import { useState } from 'react'
import { theme, ease } from '../theme'
import { LangToggle } from '../ui/LangToggle'
import { StaffLogin } from './StaffLogin'

export function LandingPage({ lang, setLang, onEnterMenu, onLogin }) {
  const [showLogin, setShowLogin] = useState(false)

  const isHe = lang === 'he'

  function handleLogin(user) {
    setShowLogin(false)
    onLogin(user)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      position: 'relative',
      textAlign: 'center',
    }}>
      {/* Language toggle top-left */}
      <div style={{
        position: 'absolute',
        top: 20,
        [isHe ? 'right' : 'left']: 16,
      }}>
        <LangToggle lang={lang} setLang={setLang} />
      </div>

      {/* Main content */}
      <div style={{ animation: 'fadeSlideIn 400ms cubic-bezier(0.4,0,0.2,1) both' }}>
        <h1 style={{
          fontFamily: "'Rubik', serif",
          fontWeight: 900,
          fontSize: 72,
          color: theme.gold,
          letterSpacing: 6,
          lineHeight: 1.1,
          textShadow: `0 0 40px ${theme.gold}55, 0 0 80px ${theme.gold}22`,
          marginBottom: 12,
        }}>
          אצל יוסי
        </h1>

        <p style={{
          fontFamily: "'Libre Baskerville', serif",
          fontStyle: 'italic',
          fontSize: 16,
          color: theme.parchment,
          letterSpacing: 2,
          marginBottom: 6,
        }}>
          {isHe ? 'נחלאות · ירושלים' : 'Nachlaot · Jerusalem'}
        </p>

        <p style={{
          fontSize: 13,
          color: theme.jerusalemBlue,
          fontWeight: 300,
          marginBottom: 48,
          letterSpacing: 1,
        }}>
          {isHe
            ? 'ראשון–חמישי 18:00–02:00 · שישי 09:00–03:00 · שבת 20:00–02:00'
            : 'Sun–Thu 18:00–02:00 · Fri 09:00–03:00 · Sat 20:00–02:00'}
        </p>

        <button
          onClick={onEnterMenu}
          style={{
            background: theme.gold,
            color: theme.ink,
            fontSize: 18,
            fontWeight: 700,
            padding: '16px 52px',
            borderRadius: 6,
            boxShadow: `0 4px 24px ${theme.gold}44`,
            transition: `transform 150ms ${ease}, box-shadow 150ms ${ease}, filter 150ms ${ease}`,
            fontFamily: "'Frank Ruhl Libre', serif",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.02)'
            e.currentTarget.style.filter = 'brightness(1.1)'
            e.currentTarget.style.boxShadow = `0 6px 32px ${theme.gold}66`
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.filter = 'brightness(1)'
            e.currentTarget.style.boxShadow = `0 4px 24px ${theme.gold}44`
          }}
        >
          {isHe ? '← לתפריט' : 'View Menu →'}
        </button>
      </div>

      {/* Staff link — nearly invisible */}
      <button
        onClick={() => setShowLogin(true)}
        style={{
          position: 'absolute',
          bottom: 24,
          [isHe ? 'left' : 'right']: 16,
          fontSize: 12,
          color: theme.accent,
          transition: `color 200ms ${ease}`,
          fontWeight: 300,
        }}
        onMouseEnter={e => e.currentTarget.style.color = theme.warmGray}
        onMouseLeave={e => e.currentTarget.style.color = theme.accent}
      >
        {isHe ? 'כניסת צוות' : 'Staff'}
      </button>

      {showLogin && (
        <StaffLogin
          lang={lang}
          onLogin={handleLogin}
          onClose={() => setShowLogin(false)}
        />
      )}
    </div>
  )
}
