import { useState } from 'react'
import { theme, ease } from '../theme'
import { LangToggle } from '../ui/LangToggle'
import { AvailabilityEditor } from './AvailabilityEditor'
import { MenuEditor } from './MenuEditor'
import { IGPlanner } from './IGPlanner'
import { PromoCalc } from './PromoCalc'
import { AlertCenter } from './AlertCenter'
import { useAlerts } from '../hooks/useAlerts'

const ROLE_TABS = {
  bar:   ['availability'],
  yosi:  ['availability', 'alerts', 'instagram', 'promo'],
  admin: ['availability', 'menu', 'alerts', 'instagram', 'promo'],
}

const TAB_META = {
  availability: { icon: '🟢', he: 'זמינות', en: 'Availability' },
  alerts:       { icon: '🚨', he: 'התראות', en: 'Alerts' },
  menu:         { icon: '✏️', he: 'תפריט', en: 'Menu' },
  instagram:    { icon: '📸', he: 'אינסטגרם', en: 'Instagram' },
  promo:        { icon: '💰', he: 'רווחים', en: 'Profits' },
}

export function StaffPanel({ user, menu, setMenu, lang, setLang, onLogout, onViewMenu }) {
  const tabs = ROLE_TABS[user.role] || ['availability']
  const [active, setActive] = useState(tabs[0])
  const isHe = lang === 'he'
  const { unresolvedCount } = useAlerts()

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 70 }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        background: theme.cardDeep,
        borderBottom: `1px solid ${theme.accent}`,
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 900, color: theme.gold, letterSpacing: 2 }}>
            אצל יוסי
          </div>
          <div style={{ fontSize: 11, color: theme.warmGray }}>
            {isHe ? user.name : user.name} · {user.role}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <LangToggle lang={lang} setLang={setLang} />
          <button
            onClick={onViewMenu}
            style={{
              fontSize: 11,
              color: theme.warmGray,
              padding: '5px 10px',
              border: `1px solid ${theme.accent}`,
              borderRadius: 4,
            }}
          >
            {isHe ? 'תפריט' : 'Menu'}
          </button>
          <button
            onClick={onLogout}
            style={{
              fontSize: 11,
              color: '#e74c3c',
              padding: '5px 10px',
              border: '1px solid #c0392b44',
              borderRadius: 4,
            }}
          >
            {isHe ? 'יציאה' : 'Logout'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div key={active} style={{ animation: 'fadeSlideIn 200ms cubic-bezier(0.4,0,0.2,1) both' }}>
        {active === 'availability' && <AvailabilityEditor menu={menu} setMenu={setMenu} lang={lang} />}
        {active === 'menu'         && <MenuEditor menu={menu} setMenu={setMenu} lang={lang} />}
        {active === 'alerts'       && <AlertCenter lang={lang} />}
        {active === 'instagram'    && <IGPlanner lang={lang} />}
        {active === 'promo'        && <PromoCalc lang={lang} />}
      </div>

      {/* Bottom nav */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 430,
        background: theme.cardDeep,
        borderTop: `1px solid ${theme.accent}`,
        display: 'flex',
        zIndex: 200,
      }}>
        {tabs.map(tabId => {
          const meta = TAB_META[tabId]
          const isAct = active === tabId
          return (
            <button
              key={tabId}
              onClick={() => setActive(tabId)}
              style={{
                flex: 1,
                padding: '10px 4px',
                textAlign: 'center',
                borderTop: `2px solid ${isAct ? theme.gold : 'transparent'}`,
                transition: `border-color 150ms ${ease}`,
                position: 'relative',
              }}
            >
              <div style={{ fontSize: 18, lineHeight: 1, position: 'relative' }}>
                {meta.icon}
                {tabId === 'alerts' && unresolvedCount > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    background: '#B22222',
                    color: theme.stone,
                    fontSize: 10,
                    fontWeight: 900,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {unresolvedCount > 9 ? '9+' : unresolvedCount}
                  </div>
                )}
              </div>
              <div style={{ fontSize: 10, color: isAct ? theme.gold : theme.warmGray, marginTop: 2, fontWeight: isAct ? 700 : 400 }}>
                {isHe ? meta.he : meta.en}
              </div>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
