import React, { useState } from 'react'
import { theme, ease } from '../theme'
import { useAlerts } from '../hooks/useAlerts'

function formatTimeAgo(isoString, lang) {
  const isHe = lang === 'he'
  const now = new Date()
  const then = new Date(isoString)
  const diffMs = now - then
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return isHe ? 'זה עתה' : 'Just now'
  if (diffMins < 60) return isHe ? `לפני ${diffMins} דק'` : `${diffMins}m ago`
  if (diffHours < 24) return isHe ? `לפני ${diffHours} שעות` : `${diffHours}h ago`
  if (diffDays < 7) return isHe ? `לפני ${diffDays} ימים` : `${diffDays}d ago`
  return then.toLocaleDateString(isHe ? 'he-IL' : 'en-US')
}

function roleLabel(role, lang) {
  const isHe = lang === 'he'
  const map = {
    bar: isHe ? 'צוות' : 'Staff',
    yosi: isHe ? 'יוסי' : 'Yosi',
    admin: isHe ? 'מנהל' : 'Admin',
  }
  return map[role] || role
}

export function AlertCenter({ lang }) {
  const isHe = lang === 'he'
  const { alerts, resolveAlert, clearResolved, unresolvedCount } = useAlerts()
  const [showResolved, setShowResolved] = useState(false)

  const unresolved = alerts.filter(a => !a.resolved)
  const resolved = alerts.filter(a => a.resolved)

  // Analytics: count by product
  const productCounts = {}
  alerts.forEach(a => {
    if (!productCounts[a.productId]) {
      productCounts[a.productId] = {
        count: 0,
        name_he: a.productName_he,
        name_en: a.productName_en,
      }
    }
    productCounts[a.productId].count++
  })

  const topProducts = Object.values(productCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)

  const maxCount = topProducts.length > 0 ? topProducts[0].count : 1

  return (
    <div style={{ padding: '0 0 80px' }}>
      {/* Header */}
      <div style={{ padding: '16px 16px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: theme.stone, margin: 0 }}>
            🚨 {isHe ? 'התראות מלאי' : 'Stock Alerts'}
          </h2>
          {unresolvedCount > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: theme.gold,
              color: theme.ink,
              fontSize: 11,
              fontWeight: 900,
            }}>
              {unresolvedCount}
            </div>
          )}
        </div>
        <p style={{ fontSize: 13, color: theme.warmGray }}>
          {isHe
            ? 'ניהול התראות על מוצרים שנגמר המלאי שלהם'
            : 'Manage stock shortage alerts'}
        </p>
      </div>

      {/* Active Alerts */}
      {unresolved.length === 0 ? (
        <div style={{
          padding: '40px 16px',
          textAlign: 'center',
          color: theme.warmGray,
        }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>✅</div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>
            {isHe ? 'אין התראות פעילות' : 'No active alerts'}
          </div>
          <div style={{ fontSize: 12, marginTop: 4, color: theme.brass }}>
            {isHe ? 'הכל בסדר!' : 'All good!'}
          </div>
        </div>
      ) : (
        <div style={{ marginBottom: 16 }}>
          {unresolved.map(alert => (
            <div
              key={alert.id}
              style={{
                margin: '0 8px 8px',
                padding: '12px 12px',
                background: theme.card,
                border: `3px solid #B22222`,
                borderRadius: 4,
                animation: 'fadeSlideIn 200ms cubic-bezier(0.4,0,0.2,1) both',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: theme.stone,
                    marginBottom: 2,
                  }}>
                    {isHe ? alert.productName_he : alert.productName_en}
                  </div>
                  <div style={{
                    fontSize: 11,
                    color: theme.warmGray,
                    marginBottom: 6,
                  }}>
                    {isHe ? alert.category_he : alert.category_en}
                  </div>
                  <div style={{
                    fontSize: 11,
                    color: theme.brass,
                    marginBottom: 2,
                  }}>
                    {formatTimeAgo(alert.timestamp, lang)}
                  </div>
                  <div style={{
                    fontSize: 10,
                    color: theme.warmGray,
                  }}>
                    {isHe ? 'דווח על ידי: ' : 'Reported by: '}
                    <span style={{ color: theme.gold }}>
                      {roleLabel(alert.reportedBy, lang)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => resolveAlert(alert.id)}
                  style={{
                    padding: '6px 10px',
                    background: '#2A7A2A',
                    color: theme.stone,
                    border: 'none',
                    borderRadius: 3,
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: `background 150ms ${ease}`,
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#3A9A3A'}
                  onMouseLeave={(e) => e.target.style.background = '#2A7A2A'}
                >
                  {isHe ? '✓ טופל' : '✓ Done'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resolved Section */}
      {resolved.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <button
            onClick={() => setShowResolved(!showResolved)}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'transparent',
              border: 'none',
              fontSize: 13,
              fontWeight: 700,
              color: theme.gold,
              textAlign: isHe ? 'right' : 'left',
              cursor: 'pointer',
              transition: `color 150ms ${ease}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: isHe ? 'flex-end' : 'flex-start',
              gap: 8,
            }}
            onMouseEnter={(e) => e.target.style.color = theme.brass}
            onMouseLeave={(e) => e.target.style.color = theme.gold}
          >
            <span>{showResolved ? '▼' : '▶'}</span>
            <span>{isHe ? `טופל (${resolved.length})` : `Resolved (${resolved.length})`}</span>
          </button>

          {showResolved && (
            <div style={{ margin: '0 8px 8px' }}>
              {resolved.map(alert => (
                <div
                  key={alert.id}
                  style={{
                    padding: '10px 12px',
                    background: theme.card,
                    border: `3px solid #2A7A2A`,
                    borderRadius: 4,
                    marginBottom: 4,
                    opacity: 0.6,
                  }}
                >
                  <div style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: theme.stone,
                    marginBottom: 2,
                  }}>
                    {isHe ? alert.productName_he : alert.productName_en}
                  </div>
                  <div style={{
                    fontSize: 10,
                    color: theme.warmGray,
                  }}>
                    {formatTimeAgo(alert.timestamp, lang)}
                  </div>
                </div>
              ))}
              {resolved.length > 0 && (
                <button
                  onClick={clearResolved}
                  style={{
                    marginTop: 8,
                    padding: '8px 12px',
                    width: '100%',
                    background: theme.accent,
                    color: theme.warmGray,
                    border: 'none',
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: `background 150ms ${ease}, color 150ms ${ease}`,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = theme.brass
                    e.target.style.color = theme.stone
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = theme.accent
                    e.target.style.color = theme.warmGray
                  }}
                >
                  {isHe ? 'נקה הכל' : 'Clear All'}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Insights Panel */}
      {topProducts.length > 0 && (
        <div style={{
          margin: '16px 8px 8px',
          padding: '16px 12px',
          background: theme.cardDeep,
          border: `1px solid ${theme.accent}`,
          borderRadius: 4,
        }}>
          <h3 style={{
            fontSize: 13,
            fontWeight: 900,
            color: theme.gold,
            marginBottom: 12,
            textAlign: isHe ? 'right' : 'left',
          }}>
            {isHe ? 'נגמר הכי הרבה פעמים:' : 'Most frequently out of stock:'}
          </h3>

          {topProducts.map((prod, idx) => {
            const percent = (prod.count / maxCount) * 100
            return (
              <div key={prod.name_en} style={{ marginBottom: idx === topProducts.length - 1 ? 0 : 12 }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 4,
                }}>
                  <div style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: theme.stone,
                  }}>
                    {isHe ? prod.name_he : prod.name_en}
                  </div>
                  <div style={{
                    fontSize: 11,
                    color: theme.brass,
                    fontWeight: 700,
                  }}>
                    ×{prod.count}
                  </div>
                </div>
                <div style={{
                  width: '100%',
                  height: 6,
                  background: theme.accent,
                  borderRadius: 3,
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${percent}%`,
                    background: `linear-gradient(90deg, ${theme.gold}, ${theme.brass})`,
                    transition: 'width 200ms ease',
                  }} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
