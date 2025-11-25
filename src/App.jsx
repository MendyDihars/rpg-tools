import { cloneElement, useEffect, useMemo, useRef, useState } from 'react'
import { BrowserRouter, useLocation } from 'react-router-dom'
import Home from './components/Home.jsx'
import Navbar from './components/Navbar.jsx'
import Router from './router/Router.jsx'
import { DEFAULT_ROUTE, ROUTES } from './router/routes.jsx'
import HiddenFeatureGate from './components/HiddenFeatureGate.jsx'
import useRicochetsLock from './hooks/useRicochetsLock.js'

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}

function AppLayout() {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const mainRef = useRef(null)
  const { isUnlocked, unlock, lock } = useRicochetsLock()

  const routes = useMemo(() => {
    return ROUTES.map((route) => {
      if (route.id !== 'ricochets') {
        return route
      }

      if (isUnlocked) {
        return {
          ...route,
          element: cloneElement(route.element, { onLock: lock }),
        }
      }

      return {
        ...route,
        label: 'Fonctionnalité cachée',
        icon: '❔',
        element: <HiddenFeatureGate onUnlock={unlock} />,
      }
    })
  }, [isUnlocked, lock, unlock])

  const currentRoute = useMemo(() => {
    if (location.pathname === '/') {
      return DEFAULT_ROUTE
    }

    return routes.find((route) => route.path === location.pathname)
  }, [location.pathname, routes])

  useEffect(() => {
    const label = currentRoute?.label ?? 'Outils'
    document.title = `Outils — ${label}`
  }, [currentRoute])

  useEffect(() => {
    mainRef.current?.focus?.()
  }, [location])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location])

  return (
    <div className="bg-[#0b0f14] text-amber-50">
      <Navbar
        routes={routes}
        defaultRoute={DEFAULT_ROUTE}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen((value) => !value)}
        onNavigate={() => setIsMobileMenuOpen(false)}
      />
      <Home ref={mainRef}>
        <Router routes={routes} defaultRoute={DEFAULT_ROUTE} />
      </Home>
    </div>
  )
}

export default App
