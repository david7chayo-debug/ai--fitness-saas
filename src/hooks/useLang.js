import { useState, useEffect } from 'react'

export function useLang() {
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem('lang') || 'he'
  })

  useEffect(() => {
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
    localStorage.setItem('lang', lang)
  }, [lang])

  function setLang(l) {
    setLangState(l)
  }

  function t(item, field) {
    if (!item) return ''
    return lang === 'he' ? (item[`${field}_he`] || item[`${field}_en`] || '') : (item[`${field}_en`] || item[`${field}_he`] || '')
  }

  return { lang, setLang, t }
}
