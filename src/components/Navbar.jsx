import { NavLink } from 'react-router-dom'

function Navbar({ routes, defaultRoute, isMobileMenuOpen, onToggleMobileMenu, onNavigate }) {
  return (
    <header className="sticky top-0 z-20 backdrop-blur supports-backdrop-filter:bg-white/70 bg-white/90 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <NavLink to={defaultRoute.path} className="flex items-center gap-2">
          <span className="text-lg sm:text-2xl font-extrabold tracking-tight m-0">🛠️ Outils</span>
        </NavLink>

        <nav aria-label="Outils" className="hidden sm:block">
          <ul className="flex items-center gap-4 text-sm text-slate-600">
            {routes.map((route) => (
              <li key={route.id}>
                <NavLink
                  to={route.path}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    [
                      'inline-flex items-center gap-2 px-2 py-1 rounded hover:bg-slate-100',
                      isActive ? 'text-slate-800 border-b-2 border-indigo-600' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')
                  }
                >
                  <span aria-hidden>{route.icon}</span>
                  {route.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sm:hidden">
          <button
            type="button"
            onClick={onToggleMobileMenu}
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
            {routes.map((route) => (
              <li key={route.id}>
                <NavLink
                  to={route.path}
                  onClick={onNavigate}
                  className="block px-2 py-2 rounded hover:bg-slate-100"
                >
                  <span aria-hidden className="mr-2">
                    {route.icon}
                  </span>
                  {route.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Navbar


