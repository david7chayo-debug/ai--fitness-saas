import { useState, useCallback, useMemo } from 'react'
import { loadAlerts, saveAlerts, createAlert } from '../data/alerts'

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
