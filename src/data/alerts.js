const ALERTS_KEY = 'yosi_alerts'

export function loadAlerts() {
  try {
    const s = localStorage.getItem(ALERTS_KEY)
    return s ? JSON.parse(s) : []
  } catch {
    return []
  }
}

export function saveAlerts(alerts) {
  try {
    localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts))
  } catch {}
}

export function createAlert(data) {
  return {
    id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    productId: data.productId,
    productName_he: data.productName_he,
    productName_en: data.productName_en,
    category_he: data.category_he,
    category_en: data.category_en,
    reason: 'out_of_stock',
    timestamp: new Date().toISOString(),
    reportedBy: data.reportedBy || 'bar',
    resolved: false,
  }
}
