import { useEffect, useMemo, useRef, useState } from 'react'
import { BrowserRouter, useLocation } from 'react-router-dom'
import Home from './components/Home.jsx'
import Navbar from './components/Navbar.jsx'
import Router from './router/Router.jsx'
import { DEFAULT_ROUTE, ROUTES } from './router/routes.jsx'

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

  const currentRoute = useMemo(() => {
    if (location.pathname === '/') {
      return DEFAULT_ROUTE
    }

    return ROUTES.find((route) => route.path === location.pathname)
  }, [location.pathname])

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
    <div className="bg-slate-50 text-slate-900 min-h-screen">
      <Navbar
        routes={ROUTES}
        defaultRoute={DEFAULT_ROUTE}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen((value) => !value)}
        onNavigate={() => setIsMobileMenuOpen(false)}
      />
      <Home ref={mainRef}>
        <Router />
      </Home>
    </div>
  )
}

export default App
