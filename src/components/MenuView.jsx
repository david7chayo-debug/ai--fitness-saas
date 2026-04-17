import { useState } from 'react'
import { theme, ease } from '../theme'
import { TabBar } from '../ui/TabBar'
import { LangToggle } from '../ui/LangToggle'
import { ItemCard } from '../ui/ItemCard'
import { DIYBuilder } from './DIYBuilder'

const TAB_ORDER = ['beer', 'spirits', 'cocktails', 'diy', 'soft', 'coffee', 'food', 'morning']

function SubcatHeader({ title }) {
  return (
    <div style={{
      padding: '12px 16px 6px',
      fontSize: 11,
      color: theme.gold,
      fontWeight: 700,
      letterSpacing: 2,
      textTransform: 'uppercase',
      borderBottom: `1px solid ${theme.brass}33`,
    }}>
      {title}
    </div>
  )
}

export function MenuView({ menu, lang, setLang, onBack }) {
  const [activeTab, setActiveTab] = useState('beer')

  const tabs = TAB_ORDER.map(key => {
    const cat = menu[key]
    if (!cat) return null
    return {
      id: key,
      icon: cat.icon,
      label: lang === 'he' ? cat.label_he : cat.label_en,
    }
  }).filter(Boolean)

  const activeCat = menu[activeTab]

  let itemIndex = 0

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 40 }}>
      {/* Promo Banner */}
      <div style={{
        background: `linear-gradient(135deg, ${theme.copper}, ${theme.gold}, ${theme.brass})`,
        padding: '10px 16px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: theme.ink }}>
          🥃 {lang === 'he' ? 'קונים בירה — מקבלים שוט על הבית!' : 'Buy a beer — get a free shot!'}
        </div>
        <div style={{ fontSize: 11, color: theme.ink, opacity: 0.75, marginTop: 2 }}>
          {lang === 'he' ? 'כל הלילה · בירה בלבד' : 'All night · Beer only'}
        </div>
      </div>

      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        borderBottom: `1px solid ${theme.accent}`,
      }}>
        <button
          onClick={onBack}
          style={{ color: theme.warmGray, fontSize: 13, padding: '4px 0' }}
        >
          {lang === 'he' ? '← חזרה' : '← Back'}
        </button>
        <span style={{ fontSize: 16, fontWeight: 900, color: theme.gold, letterSpacing: 3 }}>
          אצל יוסי
        </span>
        <LangToggle lang={lang} setLang={setLang} />
      </div>

      {/* Sticky Tab Bar */}
      <TabBar
        tabs={tabs}
        active={activeTab}
        onChange={setActiveTab}
        sticky
      />

      {/* Content */}
      <div key={activeTab} style={{ animation: 'fadeSlideIn 220ms cubic-bezier(0.4,0,0.2,1) both' }}>
        {activeTab === 'diy' ? (
          <DIYBuilder lang={lang} />
        ) : activeCat?.subcats ? (
          activeCat.subcats.map((sub, si) => {
            const visibleItems = sub.items.filter(item => item.active !== false)
            if (visibleItems.length === 0) return null
            return (
              <div key={si}>
                <SubcatHeader title={lang === 'he' ? sub.title_he : sub.title_en} />
                {visibleItems.map(item => {
                  const el = (
                    <ItemCard
                      key={item.id}
                      item={item}
                      lang={lang}
                      index={itemIndex}
                    />
                  )
                  itemIndex++
                  return el
                })}
              </div>
            )
          })
        ) : null}
      </div>

      {/* Footer */}
      <div style={{
        padding: '24px 16px',
        textAlign: 'center',
        borderTop: `1px solid ${theme.accent}`,
        marginTop: 20,
      }}>
        <div style={{ fontSize: 18, fontWeight: 900, color: theme.gold, letterSpacing: 4, marginBottom: 6 }}>
          אצל יוסי
        </div>
        <div style={{ fontSize: 12, color: theme.warmGray, lineHeight: 1.8 }}>
          {lang === 'he'
            ? 'ראשון–חמישי 18:00–02:00\nשישי 09:00–03:00 · שבת 20:00–02:00\nנחלאות, ירושלים'
            : 'Sun–Thu 18:00–02:00\nFri 09:00–03:00 · Sat 20:00–02:00\nNachlaot, Jerusalem'}
        </div>
      </div>
    </div>
  )
}
