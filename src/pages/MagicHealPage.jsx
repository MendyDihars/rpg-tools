import React, { useCallback, useState } from "react";
import { roll3d6, rollD6 } from "../helpers";

function simulateHeal(current, max, bonus = 0) {
  const mana = [], heals = [], spells = [], healDices = [], prowesses = [], spellTotals = [],
    spellSuccess = [];
  let steps = 0;

  while (current < max) {
    let currentMana = 0;
    let dragonDice = null;
    let dices = 3;
    let isProwess = false;

    const spellRoll = roll3d6();
    if (spellRoll[0] === spellRoll[1] || spellRoll[0] === spellRoll[2] || spellRoll[1] === spellRoll[2]) {
      dragonDice = spellRoll[1];
    }
    spells.push(spellRoll);

    if (dragonDice && [2, 3].includes(dragonDice)) {
      currentMana -= 1;
      isProwess = true;
    } else if (dragonDice && dragonDice >= 4) {
      dices += 1;
      isProwess = true;
    }

    const gap = max - current;
    if (gap >= 10) currentMana += 3;
    else if (gap >= 5) {
      currentMana += 2;
      dices -= 1;
    } else {
      currentMana += 1;
      dices -= 2;
    }
    mana.push(currentMana);

    const total = spellRoll.reduce((a, b) => a + b, 0) + Number(bonus || 0);
    spellTotals.push(total);
    const success = total >= 10;
    spellSuccess.push(success);

    let heal = 0;
    const currentDices = [];
    if (success) {
      for (let i = 0; i < Math.max(0, dices); i++) {
        const dice = rollD6();
        current += dice;
        heal += dice;
        currentDices.push(dice);
      }
    }
    heals.push(heal);
    healDices.push(currentDices);
    prowesses.push(isProwess);
    steps++;

    if (steps > 5000) break;
  }

  return {
    mana,
    heals,
    spells,
    healDices,
    prowesses,
    steps,
    final: current,
    spellTotals,
    spellSuccess,
    bonus: Number(bonus || 0)
  };
}

export default function MagicHealPage() {
  const [current, setCurrent] = useState(12);
  const [max, setMax] = useState(30);
  const [bonus, setBonus] = useState(0);
  const [results, setResults] = useState(null);
  const [showLegend, setShowLegend] = useState(false);

  // Run the healing simulation
  const onRun = useCallback(() => {
    if (max <= 0) {
      alert('Veuillez saisir un PV max > 0.');
      return;
    }
    if (current < 0) {
      alert('Les PV actuels ne peuvent pas être négatifs.');
      return;
    }
    if (current > max) {
      alert('PV actuels > PV max. Ajustez les valeurs.');
      return;
    }
    const res = simulateHeal(Number(current || 0), Number(max || 0), Number(bonus || 0));
    setResults(res);
  }, [current, max, bonus]);

  // Reset all values to defaults
  const onReset = useCallback(() => {
    setCurrent(12);
    setMax(30);
    setBonus(0);
    setResults(null);
  }, []);

  // Allow Enter key to trigger simulation
  const onKeyDown = useCallback((ev) => {
    if (ev.key === 'Enter') onRun();
  }, [onRun]);

  return (
    <div className="max-w-6xl mx-auto px-4 pb-24 pt-4 sm:pt-6">
      {/* PARAMÈTRES + RÉSUMÉ */}
      <section className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 auto-rows-min">
        {/* Paramètres */}
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-3 sm:p-5">
          <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Paramètres</h2>

          <div>
            <div className="flex items-center justify-between gap-3 mb-2">
              <label htmlFor="current" className="text-xs sm:text-sm text-slate-600 sm:text-right flex-1">
                PV actuels
              </label>
              <input
                id="current"
                type="number"
                value={current}
                min={0}
                inputMode="numeric"
                onChange={(e) => setCurrent(Number(e.target.value))}
                onKeyDown={onKeyDown}
                className="h-9 sm:h-11 w-40 sm:w-60 rounded-xl border border-slate-300 px-3 sm:px-4
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between gap-3 mb-2">
              <label htmlFor="max" className="text-xs sm:text-sm text-slate-600 sm:text-right flex-1">
                PV max
              </label>
              <input
                id="max"
                type="number"
                value={max}
                min={1}
                inputMode="numeric"
                onChange={(e) => setMax(Number(e.target.value))}
                onKeyDown={onKeyDown}
                className="h-9 sm:h-11 w-40 sm:w-60 rounded-xl border border-slate-300 px-3 sm:px-4
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <label htmlFor="bonus" className="text-xs sm:text-sm text-slate-600 sm:text-right flex-1">
                Bonus (sort)
              </label>
              <input
                id="bonus"
                type="number"
                value={bonus}
                step={1}
                inputMode="numeric"
                onChange={(e) => setBonus(Number(e.target.value))}
                onKeyDown={onKeyDown}
                className="h-9 sm:h-11 w-40 sm:w-60 rounded-xl border border-slate-300 px-3 sm:px-4
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <p className="hidden sm:block mt-2 text-xs text-slate-400 italic">
              Règle : le jet de sort (3d6 + bonus) doit atteindre <span className="font-semibold">10</span>.
              Sinon, le mana est gagné mais aucun PV n'est rendu.
            </p>

            {/* Boutons desktop */}
            <div className="hidden sm:flex gap-3 mt-3">
              <button
                type="button"
                onClick={onRun}
                className="flex-1 h-10 rounded-xl bg-indigo-600 text-white font-medium
                           hover:bg-indigo-700 transition-colors"
              >
                Lancer
              </button>
              <button
                type="button"
                onClick={onReset}
                className="flex-1 h-10 rounded-xl border border-slate-300 bg-white font-medium
                           hover:bg-slate-50 transition-colors"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>

        {/* Résumé */}
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-3 sm:p-5">
          <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Résumé</h2>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] sm:text-sm">
            <div className="text-slate-600">Itérations</div>
            <div className="font-semibold">{results?.steps ?? '—'}</div>
            <div className="text-slate-600">Total Mana</div>
            <div className="font-semibold">
              {results ? results.mana.reduce((a, b) => a + b, 0) : '—'}
            </div>
            <div className="text-slate-600">Total PV rendus</div>
            <div className="font-semibold">
              {results ? results.heals.reduce((a, b) => a + b, 0) : '—'}
            </div>
            <div className="text-slate-600">PV finaux</div>
            <div className="font-semibold">{results?.final ?? '—'}</div>
          </div>

          {results && (
            <div className="hidden sm:flex mt-3 flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 text-teal-800
                             px-3 py-1 text-xs ring-1 ring-teal-200">
                {results.prowesses.filter(Boolean).length} Prouesse(s)
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 text-indigo-800
                             px-3 py-1 text-xs ring-1 ring-indigo-200">
                Bonus: {results.bonus}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 text-rose-800
                             px-3 py-1 text-xs ring-1 ring-rose-200">
                {results.spellSuccess.filter(s => !s).length} Sort(s) raté(s)
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Barre d’actions mobile */}
      <div
        className="sm:hidden fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur"
      >
        <div className="max-w-6xl mx-auto px-4 py-3 grid grid-cols-2 gap-3">
          <button type="button" onClick={onRun}
                  className="h-12 rounded-xl bg-indigo-600 text-white font-medium">Lancer</button>
          <button type="button" onClick={onReset}
                  className="h-12 rounded-xl border border-slate-300 bg-white font-medium">Réinitialiser</button>
        </div>
      </div>

      {/* Légende */}
      <section className="mt-3 sm:mt-4 text-[11px] text-slate-400 text-center">
        <button
          type="button"
          onClick={() => setShowLegend(v => !v)}
          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-50"
        >
          {showLegend ? 'Masquer la légende' : 'Afficher la légende'}
        </button>
        {showLegend && (
          <div className="mt-2">
            <ul className="inline-flex gap-4">
              <li className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded bg-teal-300/60 ring-1 ring-teal-400"></span>
                Prouesse
              </li>
              <li className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded bg-rose-200 ring-1 ring-rose-300"></span>
                Sort raté (&lt; 10)
              </li>
              <li className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded bg-indigo-100 ring-1 ring-indigo-200"></span>
                Totaux
              </li>
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}