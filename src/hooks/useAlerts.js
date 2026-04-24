import { useState, useCallback, useMemo } from 'react'
import { loadAlerts, saveAlerts, createAlert } from '../data/alerts'

const YOSI_WHATSAPP = '972500000000' // placeholder number

function openWhatsAppAlert(productName, time) {
  const message = `🚨 נגמר המלאי\n📦 ${productName}\n🕐 ${time}\n\nדווח על ידי הצוות מאפליקציית אצל יוסי`
  const whatsappNumber = localStorage.getItem('yosi_whatsapp_number') || YOSI_WHATSAPP
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
  window.open(url, '_blank')
}

export function useAlerts() {
  const [alerts, setAlertsState] = useState(loadAlerts)

  function setAlerts(updater) {
    setAlertsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      saveAlerts(next)
      return next
    })
  }

  const addAlert = useCallback((data) => {
    const newAlert = createAlert(data)
    setAlerts(prev => [newAlert, ...prev])
    
    // Send WhatsApp alert if out of stock
    if (data.reason === 'out_of_stock') {
      const time = new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
      const productName = data.productName_he
      openWhatsAppAlert(productName, time)
    }
    
    return newAlert
  }, [])

  const resolveAlert = useCallback((id) => {
    setAlerts(prev =>
      prev.map(a => a.id === id ? { ...a, resolved: true } : a)
    )
  }, [])

  const clearResolved = useCallback(() => {
    setAlerts(prev => prev.filter(a => !a.resolved))
  }, [])

  const unresolvedCount = useMemo(
    () => alerts.filter(a => !a.resolved).length,
    [alerts]
  )

  return {
    alerts,
    addAlert,
    resolveAlert,
    clearResolved,
    unresolvedCount,
  }
}
