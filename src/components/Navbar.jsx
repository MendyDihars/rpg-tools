import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types';
import Crest from './Crest';

function Navbar({ routes, defaultRoute, isMobileMenuOpen, onToggleMobileMenu, onNavigate }) {
  return (
    <header className="sticky top-0 z-20 border-b border-amber-300/20 backdrop-blur bg-[#0b0f14]/85 supports-backdrop-filter:bg-[#0b0f14]/70">
      {/* subtle golden beams */}
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute inset-0 bg-[radial-gradient(500px_200px_at_15%_-40%,rgba(212,175,55,0.08),transparent),radial-gradient(400px_180px_at_85%_-30%,rgba(255,215,128,0.06),transparent)]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <NavLink to={defaultRoute.path} className="group flex items-center gap-2">
          <Crest />
          <span className="text-lg sm:text-2xl font-serif tracking-wide text-amber-50 drop-shadow-[0_2px_10px_rgba(212,175,55,0.25)]">
            Outils
          </span>
        </NavLink>

        <nav aria-label="Outils" className="hidden sm:block">
          <ul className="flex items-center gap-2 text-sm">
            {routes.map((route) => (
              <li key={route.id}>
                <NavLink
                  to={route.path}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    [
                      'relative inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-transparent text-amber-100/80 hover:text-amber-50 hover:bg-amber-500/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 transition-colors',
                      isActive ? 'text-amber-50 border-amber-300/30 bg-amber-500/10 shadow-[0_0_0_1px_rgba(212,175,55,0.25)]' : ''
                    ].filter(Boolean).join(' ')
                  }
                >
                  <span aria-hidden className="text-base">{route.icon}</span>
                  {route.label}
                  {/* active underline */}
                  <span
                    className="pointer-events-none absolute -bottom-[6px] left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500 transition-all duration-300 group-[.active]:w-10"
                    aria-hidden
                  />
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sm:hidden">
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-amber-300/30 bg-zinc-900/60 text-amber-50 hover:shadow-[0_0_0_2px_rgba(212,175,55,0.25)] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60"
            aria-label="Menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      <div
        className={`relative sm:hidden border-t border-amber-300/20 bg-zinc-950/80 backdrop-blur ${
          isMobileMenuOpen ? 'block' : 'hidden'
        }`}
      >
        <nav className="max-w-6xl mx-auto px-4 py-2">
          <ul className="flex flex-col gap-1 text-sm">
            {routes.map((route) => (
              <li key={route.id}>
                <NavLink
                  to={route.path}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    [
                      'block px-3 py-2 rounded-xl text-amber-100/85 hover:text-amber-50 hover:bg-amber-500/10 border border-transparent',
                      isActive ? 'text-amber-50 bg-amber-500/10 border-amber-300/20 shadow-[inset_0_0_0_1px_rgba(212,175,55,0.15)]' : ''
                    ].filter(Boolean).join(' ')
                  }
                >
                  <span aria-hidden className="mr-2 text-base align-[-2px]">{route.icon}</span>
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

Navbar.propTypes = {
  routes: PropTypes.array.isRequired,
  defaultRoute: PropTypes.object.isRequired,
  isMobileMenuOpen: PropTypes.bool.isRequired,
  onToggleMobileMenu: PropTypes.func.isRequired,
  onNavigate: PropTypes.func.isRequired,
}

export default Navbar
