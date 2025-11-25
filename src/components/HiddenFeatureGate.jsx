import { useState } from 'react'
import PropTypes from 'prop-types'
import Ornament from './Ornament.jsx'

function HiddenFeatureGate({ onUnlock }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    if (!onUnlock) {
      return
    }

    const success = onUnlock(password.trim())
    if (success) {
      setPassword('')
      setError('')
      return
    }

    setError('Mot de passe incorrect, réessayez.')
  }

  return (
    <div className="min-h-screen bg-[#0b0f14] text-amber-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-amber-300/20 bg-zinc-950/70 backdrop-blur-lg p-6 sm:p-8 shadow-[0_10px_50px_rgba(0,0,0,0.55)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-60 pointer-events-none" aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(600px_300px_at_50%_-20%,rgba(212,175,55,0.08),transparent)]" />
        </div>

        <div className="relative">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-100/60 mb-2">Accès restreint</p>
          <h1 className="text-2xl font-serif text-amber-50">Fonctionnalité cachée</h1>
          <p className="text-amber-100/70 text-sm mt-2">
            Cette section est protégée. Entrez le mot de passe pour la déverrouiller.
          </p>

          <Ornament className="my-6" />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="hidden-feature-password" className="text-sm text-amber-100/80">
                Mot de passe
              </label>
              <input
                id="hidden-feature-password"
                type="password"
                autoComplete="off"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-1 w-full h-11 rounded-xl border border-amber-400/30 bg-zinc-900/70 px-4 text-amber-50 placeholder:text-amber-100/30 focus:outline-none focus:ring-2 focus:ring-amber-400/60"
                placeholder="••••"
              />
              {error && <p className="text-sm text-rose-300 mt-2">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-amber-950 font-semibold shadow-[0_10px_25px_rgba(212,175,55,0.35)] hover:from-amber-400 hover:to-amber-500 transition-colors"
            >
              Déverrouiller
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

HiddenFeatureGate.propTypes = {
  onUnlock: PropTypes.func.isRequired,
}

export default HiddenFeatureGate

