import { useEffect, useMemo, useRef, useState } from 'react'
import { HashRouter, NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import InitiativePage from './pages/InitiativePage.jsx'
import MagicHealPage from './pages/MagicHealPage.jsx'
import PotionsPage from './pages/PotionsPage.jsx'
import RicochetsPage from './pages/RicochetsPage.jsx'

const PAGES = [
  {
    id: 'magic_heal',
    label: 'Simulateur de soin',
    icon: '💖',
    path: '/magic_heal',
    element: <MagicHealPage />,
  },
  {
    id: 'potions',
    label: 'Potions',
    icon: '🧪',
    path: '/potions',
    element: <PotionsPage />,
  },
  {
    id: 'initiative',
    label: 'Initiative',
    icon: '⚔️',
    path: '/initiative',
    element: <InitiativePage />,
  },
  {
    id: 'ricochets',
    label: 'Ricochets',
    icon: '🔁',
    path: '/ricochets',
    element: <RicochetsPage />,
  },
]

const DEFAULT_PAGE = PAGES[0]

function App() {
  return (
    <HashRouter>
      <AppLayout />
    </HashRouter>
  )
}

function AppLayout() {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const mainRef = useRef(null)

  const currentPage = useMemo(() => {
    return (
      PAGES.find((page) => page.path === location.pathname) ??
      (location.pathname === '/' ? DEFAULT_PAGE : undefined)
    )
  }, [location.pathname])

  useEffect(() => {
    if (currentPage) {
      document.title = `Outils — ${currentPage.label}`
    } else {
      document.title = 'Outils'
    }
  }, [currentPage])

  useEffect(() => {
    mainRef.current?.focus?.()
  }, [location])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location])

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen">
      <header className="sticky top-0 z-20 backdrop-blur supports-backdrop-filter:bg-white/70 bg-white/90 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <NavLink to={DEFAULT_PAGE.path} className="flex items-center gap-2">
            <span className="text-lg sm:text-2xl font-extrabold tracking-tight m-0">
              🛠️ Outils
            </span>
          </NavLink>

          <nav aria-label="Outils" className="hidden sm:block">
            <ul className="flex items-center gap-4 text-sm text-slate-600">
              {PAGES.map((page) => (
                <li key={page.id}>
                  <NavLink
                    to={page.path}
                    className={({ isActive }) =>
                      [
                        'inline-flex items-center gap-2 px-2 py-1 rounded hover:bg-slate-100',
                        isActive ? 'text-slate-800 border-b-2 border-indigo-600' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')
                    }
                  >
                    <span aria-hidden>{page.icon}</span>
                    {page.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="sm:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((value) => !value)}
              className="inline-flex items-center justify-center w-9 h-9 rounded hover:bg-slate-100"
              aria-label="Menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 6h18M3 12h18M3 18h18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <div
          className={`sm:hidden border-t border-slate-200 bg-white/95 ${
            isMobileMenuOpen ? 'block' : 'hidden'
          }`}
        >
          <nav className="max-w-6xl mx-auto px-4 py-2">
            <ul className="flex flex-col gap-1 text-sm text-slate-700">
              {PAGES.map((page) => (
                <li key={page.id}>
                  <NavLink
                    to={page.path}
                    className="block px-2 py-2 rounded hover:bg-slate-100"
                  >
                    <span aria-hidden className="mr-2">
                      {page.icon}
                    </span>
                    {page.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main
        ref={mainRef}
        className="max-w-6xl mx-auto px-4 py-4 sm:py-6 focus:outline-none"
        tabIndex={-1}
      >
        <Routes>
          <Route path="/" element={<Navigate to={DEFAULT_PAGE.path} replace />} />
          {PAGES.map((page) => (
            <Route key={page.id} path={page.path} element={page.element} />
          ))}
          <Route path="*" element={<Navigate to={DEFAULT_PAGE.path} replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
