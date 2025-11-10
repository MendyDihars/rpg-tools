import { useMemo, useState } from 'react'
import { rollD6 } from '../helpers'

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

const DEFAULT_PREFERENCES = {
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

function choosePotion(gap, constitution, preferences) {
  const sorted = [...POTIONS].sort((a, b) => a.avg - b.avg)
  const candidates = sorted.filter((potion) => potion.avg + constitution >= gap)
  if (candidates.length > 0) {
    const preferredCandidates = candidates.filter((potion) =>
      preferences.has(potion.id),
    )
    if (preferredCandidates.length > 0) {
      return preferredCandidates[0]
    }
    return candidates[0]
  }

  const maxAvg = sorted[sorted.length - 1]?.avg ?? 0
  const largestGroup = sorted.filter((potion) => potion.avg === maxAvg)
  const preferredLargest = largestGroup.find((potion) =>
    preferences.has(potion.id),
  )
  return preferredLargest ?? largestGroup[0]
}

function simulatePotions(currentHP, maxHP, constitution, preferences) {
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
    const potion = choosePotion(gap, constitution, preferences)

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
  const [preferences, setPreferences] = useState(() => ({ ...DEFAULT_PREFERENCES }))
  const [result, setResult] = useState(null)

  const preferenceSet = useMemo(() => {
    return new Set(
      Object.entries(preferences)
        .filter(([, isSelected]) => isSelected)
        .map(([id]) => id),
    )
  }, [preferences])

  const handlePreferenceChange = (id) => {
    setPreferences((previous) => ({
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

    const simulation = simulatePotions(current, maximum, con, preferenceSet)
    setResult(simulation)
  }

  const handleReset = () => {
    setCurrentHP(DEFAULT_VALUES.current)
    setMaxHP(DEFAULT_VALUES.max)
    setConstitution(DEFAULT_VALUES.constitution)
    setPreferences({ ...DEFAULT_PREFERENCES })
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
            className: 'bg-teal-100 text-teal-800 ring-teal-200',
          }
        : null,
      result.counts.normal
        ? {
            label: `${result.counts.normal} × Normal`,
            className: 'bg-indigo-100 text-indigo-800 ring-indigo-200',
          }
        : null,
      result.counts.greater
        ? {
            label: `${result.counts.greater} × Supérieur`,
            className: 'bg-amber-100 text-amber-800 ring-amber-200',
          }
        : null,
      result.counts.superior
        ? {
            label: `${result.counts.superior} × Puissante`,
            className: 'bg-rose-100 text-rose-800 ring-rose-200',
          }
        : null,
    ].filter(Boolean)
  }, [result])

  return (
    <>
      <main className="max-w-6xl mx-auto px-4 pb-24 pt-4 sm:pt-6">
        <section className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 auto-rows-min">
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-3 sm:p-5">
            <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
              Potions — Paramètres
            </h2>
            <div className="sm:ml-auto sm:max-w-md">
              <div className="flex items-center justify-between gap-3 mb-2">
                <label
                  htmlFor="p_current"
                  className="text-xs sm:text-sm text-slate-600 sm:text-right flex-1"
                >
                  PV actuels
                </label>
                <input
                  id="p_current"
                  type="number"
                  min="0"
                  inputMode="numeric"
                  value={currentHP}
                  onChange={(event) => setCurrentHP(event.target.value)}
                  className="h-9 sm:h-11 w-40 sm:w-60 rounded-xl border border-slate-300 px-3 sm:px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="flex items-center justify-between gap-3 mb-2">
                <label
                  htmlFor="p_max"
                  className="text-xs sm:text-sm text-slate-600 sm:text-right flex-1"
                >
                  PV max
                </label>
                <input
                  id="p_max"
                  type="number"
                  min="1"
                  inputMode="numeric"
                  value={maxHP}
                  onChange={(event) => setMaxHP(event.target.value)}
                  className="h-9 sm:h-11 w-40 sm:w-60 rounded-xl border border-slate-300 px-3 sm:px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="p_con"
                  className="text-xs sm:text-sm text-slate-600 sm:text-right flex-1"
                >
                  Constitution (bonus par potion)
                </label>
                <input
                  id="p_con"
                  type="number"
                  step="1"
                  inputMode="numeric"
                  value={constitution}
                  onChange={(event) => setConstitution(event.target.value)}
                  className="h-9 sm:h-11 w-40 sm:w-60 rounded-xl border border-slate-300 px-3 sm:px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="mt-3">
                <div className="text-xs sm:text-sm text-slate-600 mb-1">
                  Potions à privilégier (en cas d’égalité raisonnable)
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {POTIONS.map((potion) => (
                    <label key={potion.id} className="inline-flex items-center gap-2">
                      <input
                        id={`pref_${potion.id}`}
                        type="checkbox"
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        checked={preferences[potion.id]}
                        onChange={() => handlePreferenceChange(potion.id)}
                      />
                      <span>{potion.label}</span>
                    </label>
                  ))}
                </div>
                <p className="hidden sm:block mt-2 text-xs text-slate-400 italic">
                  La sélection n’interdit pas les autres potions : elle départage quand plusieurs
                  choix sont adaptés selon la moyenne attendue.
                </p>
              </div>
              <div className="hidden sm:flex gap-3 mt-3">
                <button
                  type="button"
                  className="flex-1 h-10 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
                  onClick={handleRun}
                >
                  Lancer
                </button>
                <button
                  type="button"
                  className="flex-1 h-10 rounded-xl border border-slate-300 bg-white font-medium hover:bg-slate-50 transition-colors"
                  onClick={handleReset}
                >
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-3 sm:p-5">
            <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Résumé</h2>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] sm:text-sm">
              <div className="text-slate-600">Potions utilisées</div>
              <div className="font-semibold">{summary.count}</div>
              <div className="text-slate-600">Total PV rendus</div>
              <div className="font-semibold">{summary.totalHealed}</div>
              <div className="text-slate-600">PV finaux</div>
              <div className="font-semibold">{summary.final}</div>
            </div>
            <div
              className={`${
                badges.length > 0 ? 'sm:flex' : 'sm:hidden'
              } hidden mt-3 flex-wrap gap-2`}
            >
              {badges.map((badge) => (
                <span
                  key={badge.label}
                  className={`inline-flex items-center gap-1 rounded-full ${badge.className} px-3 py-1 text-xs ring-1`}
                >
                  {badge.label}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-4 sm:mt-6 sm:hidden">
          <h3 className="text-base font-semibold mb-2">Détails des potions</h3>
          <div className="space-y-2">
            {result?.steps.map((step, index) => {
              const diceBreakdown = step.diceRolls.join(' + ')
              return (
                <div
                  key={`${step.id}-${index}`}
                  className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-3"
                >
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <div className="text-sm font-semibold text-slate-700">{step.type}</div>
                  </div>
                  <div className="flex items-center justify-between text-[13px] py-1">
                    <span className="text-slate-600">Jet</span>
                    <span className="font-medium">
                      {diceBreakdown}
                      {step.constitution ? ` (+${step.constitution})` : ''} = {step.totalRaw}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[13px] py-1">
                    <span className="text-slate-600">PV rendus</span>
                    <span className="font-medium">{step.applied}</span>
                  </div>
                  <div className="flex items-center justify-between text-[13px] py-1">
                    <span className="text-slate-600">PV restants</span>
                    <span className="font-medium">{step.remaining}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section className="mt-6 hidden sm:block">
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-semibold">Détails des potions</h3>
              <div className="text-sm text-slate-500">Défilement horizontal si besoin</div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-[800px] w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600 w-48">Type</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Jet &amp; total</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">PV rendus</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">PV restants</th>
                  </tr>
                </thead>
                <tbody>
                  {result?.steps.map((step, index) => {
                    const diceBreakdown = step.diceRolls.join(' + ')
                    return (
                      <tr key={`${step.id}-${index}`}>
                        <td className="px-4 py-3 align-top">{step.type}</td>
                        <td className="px-4 py-3 align-top">
                          {diceBreakdown}
                          {step.constitution ? ` (+${step.constitution})` : ''} = {step.totalRaw}
                        </td>
                        <td className="px-4 py-3 align-top font-medium">{step.applied}</td>
                        <td className="px-4 py-3 align-top text-slate-600">{step.remaining}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      <div className="sm:hidden fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3 grid grid-cols-2 gap-3">
          <button
            type="button"
            className="h-12 rounded-xl bg-indigo-600 text-white font-medium"
            onClick={handleRun}
          >
            Lancer
          </button>
          <button
            type="button"
            className="h-12 rounded-xl border border-slate-300 bg-white font-medium"
            onClick={handleReset}
          >
            Réinitialiser
          </button>
        </div>
      </div>
    </>
  )
}

export default PotionsPage
