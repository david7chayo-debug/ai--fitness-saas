import { useState, useEffect } from 'react'
import { DEFAULT_MENU } from './data/menu'
import { LandingPage } from './components/LandingPage'
import { MenuView } from './components/MenuView'
import { StaffPanel } from './components/StaffPanel'
import { useLang } from './hooks/useLang'

const MENU_KEY = 'etzelyosi_menu'

function loadMenu() {
  try {
    const s = localStorage.getItem(MENU_KEY)
    return s ? JSON.parse(s) : DEFAULT_MENU
  } catch {
    return DEFAULT_MENU
  }
}

function saveMenu(m) {
  try { localStorage.setItem(MENU_KEY, JSON.stringify(m)) } catch {}
}

export default function App() {
  const [screen, setScreen] = useState('landing')
  const [user, setUser]     = useState(null)
  const [menu, setMenuState] = useState(loadMenu)
  const { lang, setLang }   = useLang()

  function setMenu(updater) {
    setMenuState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      saveMenu(next)
      return next
    })
  }

  function handleLogin(u) {
    setUser(u)
    setScreen('staff')
  }

  function handleLogout() {
    setUser(null)
    setScreen('landing')
  }

  return (
    <div className="app">
      {screen === 'landing' && (
        <LandingPage
          lang={lang}
          setLang={setLang}
          onEnterMenu={() => setScreen('menu')}
          onLogin={handleLogin}
        />
      )}
      {screen === 'menu' && (
        <MenuView
          menu={menu}
          lang={lang}
          setLang={setLang}
          onBack={() => setScreen('landing')}
        />
      )}
      {screen === 'staff' && user && (
        <StaffPanel
          user={user}
          menu={menu}
          setMenu={setMenu}
          lang={lang}
          setLang={setLang}
          onLogout={handleLogout}
          onViewMenu={() => setScreen('menu')}
        />
      )}
    </div>
  )
}
