import { useState } from 'react'
import { theme, ease } from '../theme'
import { TabBar } from '../ui/TabBar'
import { LangToggle } from '../ui/LangToggle'
import { ItemCard } from '../ui/ItemCard'
import { DIYBuilder } from './DIYBuilder'
import { usePromoSettings, useSpecialSettings } from '../hooks/usePromoSettings'

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
  const [searchQuery, setSearchQuery] = useState('')
  const [promoSettings] = usePromoSettings()
  const [specialSettings] = useSpecialSettings()

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

  // Search logic
  const searchResults = searchQuery ? (() => {
    const query = searchQuery.toLowerCase()
    const results = {}
    
    Object.entries(menu).forEach(([catKey, cat]) => {
      if (!cat.subcats) return
      
      cat.subcats.forEach(sub => {
        sub.items.forEach(item => {
          if (item.active === false) return
          
          const searchable = [
            item.he?.toLowerCase(),
            item.en?.toLowerCase(),
            item.note_he?.toLowerCase(),
            item.note_en?.toLowerCase(),
          ].filter(Boolean)
          
          if (searchable.some(text => text.includes(query))) {
            if (!results[catKey]) {
              results[catKey] = {
                label_he: cat.label_he,
                label_en: cat.label_en,
                items: []
              }
            }
            results[catKey].items.push(item)
          }
        })
      })
    })
    
    return results
  })() : null

  let itemIndex = 0

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 40 }}>
      {/* Promo Banner */}
      {promoSettings.active && (
        <div style={{
          background: `linear-gradient(135deg, ${theme.copper}, ${theme.gold}, ${theme.brass})`,
          padding: '10px 16px',
          textAlign: 'center',
          borderBottom: `3px solid ${theme.jerusalemBlue}`,
        }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: theme.ink }}>
            🥃 {lang === 'he' ? promoSettings.text_he : promoSettings.text_en}
          </div>
          <div style={{ fontSize: 11, color: theme.ink, opacity: 0.75, marginTop: 2 }}>
            {lang === 'he' ? promoSettings.subtext_he : promoSettings.subtext_en}
          </div>
        </div>
      )}

      {/* Special Banner */}
      {specialSettings.active && (
        <div style={{
          background: theme.cardDeep,
          border: `1px solid ${theme.brass}`,
          borderLeft: `3px solid ${theme.gold}`,
          padding: '8px 16px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 10, color: theme.warmGray, marginBottom: 2 }}>
            ✨ {lang === 'he' ? 'מיוחד הלילה' : 'Tonight\'s Special'}
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: theme.gold }}>
            {lang === 'he' ? specialSettings.text_he : specialSettings.text_en}
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div style={{
        padding: '8px 16px',
        background: theme.card,
        borderBottom: `1px solid ${theme.accent}`,
      }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={lang === 'he' ? 'חפש מוצר...' : 'Search...'}
            style={{
              width: '100%',
              padding: '10px 40px 10px 14px',
              background: theme.card,
              border: `1px solid ${theme.accent}`,
              borderRadius: 6,
              color: theme.stone,
              fontSize: 14,
              outline: 'none',
            }}
          />
          <span style={{
            position: 'absolute',
            right: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            color: theme.warmGray,
            fontSize: 14,
          }}>
            🔍
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: 32,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: theme.warmGray,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          )}
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
        <span style={{ fontSize: 16, fontWeight: 900, color: theme.gold, letterSpacing: 3, fontFamily: "'Rubik', 'Frank Ruhl Libre', serif" }}>
          אצל יוסי
        </span>
        <LangToggle lang={lang} setLang={setLang} />
      </div>

      {/* Sticky Tab Bar - Hide when searching */}
      {!searchQuery && (
        <TabBar
          tabs={tabs}
          active={activeTab}
          onChange={setActiveTab}
          sticky
        />
      )}

      {/* Content */}
      <div key={activeTab} style={{ animation: 'fadeSlideIn 220ms cubic-bezier(0.4,0,0.2,1) both' }}>
        {searchQuery ? (
          // Search Results
          Object.keys(searchResults).length > 0 ? (
            <div>
              <div style={{
                padding: '12px 16px 6px',
                fontSize: 14,
                fontWeight: 700,
                color: theme.gold,
                textAlign: 'center',
              }}>
                {lang === 'he' 
                  ? `נמצאו ${Object.values(searchResults).reduce((sum, cat) => sum + cat.items.length, 0)} תוצאות`
                  : `${Object.values(searchResults).reduce((sum, cat) => sum + cat.items.length, 0)} results found`
                }
              </div>
              {Object.entries(searchResults).map(([catKey, cat]) => (
                <div key={catKey}>
                  <div style={{
                    padding: '12px 16px 6px',
                    fontSize: 13,
                    fontWeight: 700,
                    color: theme.gold,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    borderBottom: `1px solid ${theme.brass}33`,
                  }}>
                    {cat.icon} {lang === 'he' ? cat.label_he : cat.label_en}
                  </div>
                  {cat.items.map(item => {
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
              ))}
            </div>
          ) : (
            <div style={{
              padding: '60px 16px',
              textAlign: 'center',
              color: theme.warmGray,
            }}>
              <div style={{ fontSize: 18, marginBottom: 8 }}>🔍</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
                {lang === 'he' ? 'לא נמצאו תוצאות' : 'No results found'}
              </div>
              <div style={{ fontSize: 14 }}>
                {lang === 'he' ? `ל-'${searchQuery}'` : `for '${searchQuery}'`}
              </div>
            </div>
          )
        ) : activeTab === 'diy' ? (
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
