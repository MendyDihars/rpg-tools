import { useMemo, useState } from 'react'
import { rollD6 } from '../helpers'
import Ornament from '../components/Ornament'
import Crest from '../components/Crest'

const POTIONS = [
  { id: 'minor', label: 'Mineur (2d6)', dice: 2, avg: 2 * 3.5 },
  { id: 'normal', label: 'Normal (4d6)', dice: 4, avg: 4 * 3.5 },
  { id: 'greater', label: 'Supérieur (6d6)', dice: 6, avg: 6 * 3.5 },
  { id: 'superior', label: 'Puissante (8d6)', dice: 8, avg: 8 * 3.5 },
]

const DEFAULT_VALUES = {
  current: '12',
  max: '30',
  constitution: '0',
}

const DEFAULT_BLOCKED = {
  minor: false,
  normal: false,
  greater: false,
  superior: false,
}

function rollNd6(count) {
  const rolls = []
  for (let index = 0; index < count; index += 1) {
    rolls.push(rollD6())
  }
  return rolls
}

function choosePotion(gap, constitution, blocked) {
  const sorted = [...POTIONS].sort((a, b) => a.avg - b.avg)
  const available = sorted.filter((potion) => !blocked.has(potion.id))

  if (available.length === 0) {
    return null
  }

  const candidates = available.filter((potion) => potion.avg + constitution >= gap)
  if (candidates.length > 0) {
    return candidates[0]
  }

  const maxAvg = available[available.length - 1]?.avg ?? 0
  const largestGroup = available.filter((potion) => potion.avg === maxAvg)
  return largestGroup[0]
}

function simulatePotions(currentHP, maxHP, constitution, blocked) {
  const steps = []
  const counts = {
    minor: 0,
    normal: 0,
    greater: 0,
    superior: 0,
  }

  let safety = 0
  let current = currentHP

  while (current < maxHP && safety < 1000) {
    safety += 1
    const gap = maxHP - current
    const potion = choosePotion(gap, constitution, blocked)

    if (!potion) {
      break
    }

    const diceRolls = rollNd6(potion.dice)
    const totalRaw = diceRolls.reduce((total, value) => total + value, 0) + constitution
    const applied = Math.min(totalRaw, gap)

    current += applied
    counts[potion.id] += 1

    steps.push({
      type: potion.label,
      id: potion.id,
      dice: potion.dice,
      diceRolls,
      constitution,
      totalRaw,
      applied,
      remaining: maxHP - current,
    })
  }

  const totalHealed = steps.reduce((total, step) => total + step.applied, 0)
  return { steps, counts, totalHealed, final: current }
}

function PotionsPage() {
  const [currentHP, setCurrentHP] = useState(DEFAULT_VALUES.current)
  const [maxHP, setMaxHP] = useState(DEFAULT_VALUES.max)
  const [constitution, setConstitution] = useState(DEFAULT_VALUES.constitution)
  const [blockedPotions, setBlockedPotions] = useState(() => ({ ...DEFAULT_BLOCKED }))
  const [result, setResult] = useState(null)

  const blockedSet = useMemo(() => {
    return new Set(
      Object.entries(blockedPotions)
        .filter(([, isBlocked]) => isBlocked)
        .map(([id]) => id),
    )
  }, [blockedPotions])

  const handleBlockedChange = (id) => {
    setBlockedPotions((previous) => ({
      ...previous,
      [id]: !previous[id],
    }))
  }

  const handleRun = () => {
    const current = Number(currentHP) || 0
    const maximum = Number(maxHP) || 0
    const con = Number(constitution) || 0

    if (maximum <= 0) {
      window.alert('Veuillez saisir un PV max > 0.')
      return
    }
    if (current < 0) {
      window.alert('Les PV actuels ne peuvent pas être négatifs.')
      return
    }
    if (current > maximum) {
      window.alert('PV actuels > PV max. Ajustez les valeurs.')
      return
    }

    if (blockedSet.size === POTIONS.length) {
      window.alert('Veuillez laisser au moins une potion disponible.')
      return
    }

    const simulation = simulatePotions(current, maximum, con, blockedSet)
    setResult(simulation)
  }

  const handleReset = () => {
    setCurrentHP(DEFAULT_VALUES.current)
    setMaxHP(DEFAULT_VALUES.max)
    setConstitution(DEFAULT_VALUES.constitution)
    setBlockedPotions({ ...DEFAULT_BLOCKED })
    setResult(null)
  }

  const summary = {
    count: result?.steps.length ?? '—',
    totalHealed: result?.totalHealed ?? '—',
    final: result?.final ?? '—',
  }

  const badges = useMemo(() => {
    if (!result) {
      return []
    }

    return [
      result.counts.minor
        ? {
            label: `${result.counts.minor} × Mineur`,
            className: 'bg-amber-500/15 text-amber-100/90 ring-amber-300/20',
          }
        : null,
      result.counts.normal
        ? {
            label: `${result.counts.normal} × Normal`,
            className: 'bg-amber-500/10 text-amber-100/90 ring-amber-300/20',
          }
        : null,
      result.counts.greater
        ? {
            label: `${result.counts.greater} × Supérieur`,
            className: 'bg-amber-500/10 text-amber-100/90 ring-amber-300/20',
          }
        : null,
      result.counts.superior
        ? {
            label: `${result.counts.superior} × Puissante`,
            className: 'bg-rose-500/10 text-rose-200 ring-rose-300/20',
          }
        : null,
    ].filter(Boolean)
  }, [result])

  // THEME HELPERS
  const cardBase =
    "rounded-2xl border border-amber-300/20 bg-[radial-gradient(1200px_400px_at_50%_-20%,rgba(212,175,55,0.06),transparent),linear-gradient(to_bottom_right,rgba(255,255,255,0.02),rgba(0,0,0,0.2))] shadow-[0_10px_40px_rgba(0,0,0,0.35)]";
  const inputBase =
    "h-9 sm:h-11 w-40 sm:w-60 rounded-xl border border-amber-400/30 bg-zinc-900/60 text-amber-50 px-3 sm:px-4 placeholder:text-amber-100/30 focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-300/70 backdrop-blur-sm";
  const labelTone = "text-amber-100/80";
  const btnPrimary =
    "h-10 rounded-xl bg-gradient-to-b from-amber-500/30 to-amber-600/20 text-amber-50 font-medium border border-amber-300/40 hover:shadow-[0_0_0_2px_rgba(212,175,55,0.25)] focus:outline-none focus:ring-2 focus:ring-amber-400/60";
  const btnGhost =
    "h-10 rounded-xl border border-amber-300/30 bg-zinc-900/60 text-amber-50 font-medium hover:shadow-[0_0_0_2px_rgba(212,175,55,0.2)] focus:outline-none focus:ring-2 focus:ring-amber-400/60";

  return (
    <div className="min-h-screen w-full bg-[#0b0f14] text-amber-50 relative overflow-hidden">
      {/* golden backdrop */}
      <div className="pointer-events-none absolute inset-0 opacity-70" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(800px_500px_at_20%_-10%,rgba(212,175,55,0.08),transparent),radial-gradient(600px_400px_at_80%_-10%,rgba(255,215,128,0.05),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(0,0,0,0),rgba(0,0,0,0.6))]" />
      </div>

      {/* header */}
      <header className="max-w-6xl mx-auto px-4 pt-8 pb-6 sm:pb-8 relative">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full border border-amber-400/40 bg-zinc-900/70 grid place-items-center shadow-[0_0_0_2px_rgba(212,175,55,0.15)]">
            <Crest />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif tracking-wide drop-shadow-[0_2px_10px_rgba(212,175,55,0.25)]">Potions de soin</h1>
            <p className="text-amber-100/70 text-sm">Simulation d&apos;alchimie — choisir la fiole idéale ✨</p>
          </div>
        </div>
        <Ornament className="mt-5" />
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-28 relative">
        <section className="grid gap-4 grid-cols-1 md:grid-cols-2 auto-rows-min">
          <div className={`${cardBase} p-3 sm:p-5`}>
            <h2 className="text-base sm:text-lg font-semibold text-amber-100/90 mb-2 sm:mb-3">Potions — Paramètres</h2>
            <div className="sm:ml-auto sm:max-w-md">
              <div className="flex items-center justify-between gap-3 mb-2">
                <label htmlFor="p_current" className={`text-xs sm:text-sm ${labelTone} sm:text-right flex-1`}>
                  PV actuels
                </label>
                <input
                  id="p_current"
                  type="number"
                  min="0"
                  inputMode="numeric"
                  value={currentHP}
                  onChange={(event) => setCurrentHP(event.target.value)}
                  className={inputBase}
                />
              </div>
              <div className="flex items-center justify-between gap-3 mb-2">
                <label htmlFor="p_max" className={`text-xs sm:text-sm ${labelTone} sm:text-right flex-1`}>
                  PV max
                </label>
                <input
                  id="p_max"
                  type="number"
                  min="1"
                  inputMode="numeric"
                  value={maxHP}
                  onChange={(event) => setMaxHP(event.target.value)}
                  className={inputBase}
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="p_con" className={`text-xs sm:text-sm ${labelTone} sm:text-right flex-1`}>
                  Constitution (bonus par potion)
                </label>
                <input
                  id="p_con"
                  type="number"
                  step="1"
                  inputMode="numeric"
                  value={constitution}
                  onChange={(event) => setConstitution(event.target.value)}
                  className={inputBase}
                />
              </div>
              <div className="mt-3">
                <div className="text-xs sm:text-sm text-amber-100/80 mb-1">
                  Potions à éviter absolument
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {POTIONS.map((potion) => (
                    <label key={potion.id} className="inline-flex items-center gap-2">
                      <input
                        id={`pref_${potion.id}`}
                        type="checkbox"
                        className="rounded border-amber-300/40 bg-zinc-900 text-amber-400 focus:ring-amber-400/60"
                        checked={blockedPotions[potion.id]}
                        onChange={() => handleBlockedChange(potion.id)}
                      />
                      <span className="text-amber-50">{potion.label}</span>
                    </label>
                  ))}
                </div>
                <p className="hidden sm:block mt-2 text-xs text-amber-100/60 italic">
                  Les potions cochées seront ignorées pendant la simulation.
                </p>
              </div>
              <div className="hidden sm:flex gap-3 mt-3">
                <button type="button" className={`flex-1 ${btnPrimary}`} onClick={handleRun}>
                  Lancer
                </button>
                <button type="button" className={`flex-1 ${btnGhost}`} onClick={handleReset}>
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>

          <div className={`${cardBase} p-3 sm:p-5`}>
            <h2 className="text-base sm:text-lg font-semibold text-amber-100/90 mb-2 sm:mb-3">Résumé</h2>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] sm:text-sm">
              <div className="text-amber-100/75">Potions utilisées</div>
              <div className="font-semibold text-amber-50">{summary.count}</div>
              <div className="text-amber-100/75">Total PV rendus</div>
              <div className="font-semibold text-amber-50">{summary.totalHealed}</div>
              <div className="text-amber-100/75">PV finaux</div>
              <div className="font-semibold text-amber-50">{summary.final}</div>
            </div>
            <div className={`${badges.length > 0 ? 'sm:flex' : 'sm:hidden'} hidden mt-3 flex-wrap gap-2`}>
              {badges.map((badge) => (
                <span key={badge.label} className={`inline-flex items-center gap-1 rounded-full ${badge.className} px-3 py-1 text-xs ring-1`}>
                  {badge.label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Détails mobile */}
        <section className="mt-4 sm:mt-6 sm:hidden">
          <h3 className="text-base font-semibold text-amber-100/90 mb-2">Détails des potions</h3>
          <div className="space-y-2">
            {result?.steps.map((step, index) => {
              const diceBreakdown = step.diceRolls.join(' + ')
              return (
                <div key={`${step.id}-${index}`} className="rounded-2xl border border-amber-300/20 bg-zinc-950/60 p-3">
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <div className="text-sm font-semibold text-amber-50">{step.type}</div>
                  </div>
                  <div className="flex items-center justify-between text-[13px] py-1">
                    <span className="text-amber-100/75">Jet</span>
                    <span className="font-medium text-amber-50">
                      {diceBreakdown}
                      {step.constitution ? ` (+${step.constitution})` : ''} = {step.totalRaw}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[13px] py-1">
                    <span className="text-amber-100/75">PV rendus</span>
                    <span className="font-medium text-amber-50">{step.applied}</span>
                  </div>
                  <div className="flex items-center justify-between text-[13px] py-1">
                    <span className="text-amber-100/75">PV restants</span>
                    <span className="font-medium text-amber-50">{step.remaining}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Détails desktop */}
        <section className="mt-6 hidden sm:block">
          <div className={`${cardBase}`}>
            <div className="p-4 border-b border-amber-300/20 flex items-center justify-between bg-linear-to-r from-amber-500/5 to-transparent rounded-t-2xl">
              <h3 className="font-semibold text-amber-100/90">Détails des potions</h3>
              <div className="text-sm text-amber-100/70">Défilement horizontal si besoin</div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-[800px] w-full text-sm">
                <thead className="bg-zinc-950/60">
                  <tr className="border-b border-amber-300/20">
                    <th className="text-left px-4 py-3 font-semibold text-amber-100/80 w-48">Type</th>
                    <th className="text-left px-4 py-3 font-semibold text-amber-100/80">Jet &amp; total</th>
                    <th className="text-left px-4 py-3 font-semibold text-amber-100/80">PV rendus</th>
                    <th className="text-left px-4 py-3 font-semibold text-amber-100/80">PV restants</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-300/10">
                  {result?.steps.map((step, index) => {
                    const diceBreakdown = step.diceRolls.join(' + ')
                    return (
                      <tr key={`${step.id}-${index}`} className="hover:bg-amber-500/5 transition-colors">
                        <td className="px-4 py-3 align-top text-amber-50">{step.type}</td>
                        <td className="px-4 py-3 align-top text-amber-100/80">
                          {diceBreakdown}
                          {step.constitution ? ` (+${step.constitution})` : ''} = {step.totalRaw}
                        </td>
                        <td className="px-4 py-3 align-top font-medium text-amber-50">{step.applied}</td>
                        <td className="px-4 py-3 align-top text-amber-100/75">{step.remaining}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      {/* Action bar mobile */}
      <div className="sm:hidden fixed inset-x-0 bottom-0 z-30 border-t border-amber-300/20 bg-zinc-950/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3 grid grid-cols-2 gap-3">
          <button type="button" className="h-12 rounded-xl bg-amber-500/20 text-amber-50 border border-amber-300/30 font-medium" onClick={handleRun}>
            Lancer
          </button>
          <button type="button" className="h-12 rounded-xl border border-amber-300/30 bg-zinc-900/60 text-amber-50 font-medium" onClick={handleReset}>
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  )
}

export default PotionsPage