import React, { useCallback, useState } from "react";
import { roll3d6, rollD6 } from "../helpers";
import Ornament from "../components/Ornament";
import Crest from "../components/Crest";

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

  // THEME HELPERS (dark + gold)
  const cardBase =
    "rounded-2xl border border-amber-300/20 bg-[radial-gradient(1200px_400px_at_50%_-20%,rgba(212,175,55,0.06),transparent),linear-gradient(to_bottom_right,rgba(255,255,255,0.02),rgba(0,0,0,0.2))] shadow-[0_10px_40px_rgba(0,0,0,0.35)]";
  const inputBase =
    "h-9 sm:h-11 w-40 sm:w-60 rounded-xl border border-amber-400/30 bg-zinc-900/60 text-amber-50 px-3 sm:px-4 placeholder:text-amber-100/30 focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-300/70 backdrop-blur-sm";
  const labelTone = "text-amber-100/80";
  const btnPrimary =
    "h-10 rounded-xl bg-gradient-to-b from-amber-500/30 to-amber-600/20 text-amber-50 font-medium border border-amber-300/40 hover:shadow-[0_0_0_2px_rgba(212,175,55,0.25)] focus:outline-none focus:ring-2 focus:ring-amber-400/60";
  const btnGhost =
    "h-10 rounded-xl border border-amber-300/30 bg-zinc-900/60 text-amber-50 font-medium hover:shadow-[0_0_0_2px_rgba(212,175,55,0.2)] focus:outline-none focus:ring-2 focus:ring-amber-400/60";

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
    <div className="min-h-screen w-full bg-[#0b0f14] text-amber-50 relative overflow-hidden">
      {/* golden vignette */}
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
            <h1 className="text-2xl sm:text-3xl font-serif tracking-wide drop-shadow-[0_2px_10px_rgba(212,175,55,0.25)]">Guérison magique</h1>
            <p className="text-amber-100/70 text-sm">Simulation de soins ✨</p>
          </div>
        </div>
        <Ornament className="mt-5" />
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-28 relative">
        {/* PARAMÈTRES + RÉSUMÉ */}
        <section className="grid gap-4 grid-cols-1 md:grid-cols-2 auto-rows-min">
          {/* Paramètres */}
          <div className={`${cardBase} p-3 sm:p-5`}>
            <h2 className="text-base sm:text-lg font-semibold text-amber-100/90 mb-2 sm:mb-3">Paramètres</h2>

            <div>
              <div className="flex items-center justify-between gap-3 mb-2">
                <label htmlFor="current" className={`text-xs sm:text-sm ${labelTone} sm:text-right flex-1`}>
                  PV actuels
                </label>
                <input
                  id="current"
                  type="number"
                  value={current || ''}
                  min={0}
                  inputMode="numeric"
                  onChange={(e) => setCurrent(Number(e.target.value))}
                  onKeyDown={onKeyDown}
                  className={inputBase}
                />
              </div>

              <div className="flex items-center justify-between gap-3 mb-2">
                <label htmlFor="max" className={`text-xs sm:text-sm ${labelTone} sm:text-right flex-1`}>
                  PV max
                </label>
                <input
                  id="max"
                  type="number"
                  value={max || ''}
                  min={1}
                  inputMode="numeric"
                  onChange={(e) => setMax(Number(e.target.value))}
                  onKeyDown={onKeyDown}
                  className={inputBase}
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <label htmlFor="bonus" className={`text-xs sm:text-sm ${labelTone} sm:text-right flex-1`}>
                  Bonus (sort)
                </label>
                <input
                  id="bonus"
                  type="number"
                  value={bonus || ''}
                  max={20}
                  step={1}
                  inputMode="numeric"
                  onChange={(e) => setBonus(Number(e.target.value))}
                  onKeyDown={onKeyDown}
                  className={inputBase}
                />
              </div>

              <p className="hidden sm:block mt-2 text-xs text-amber-100/60 italic">
                Règle : le jet de sort (3d6 + bonus) doit atteindre <span className="font-semibold">10</span>.
                Sinon, le mana est gagné mais aucun PV n'est rendu.
              </p>

              {/* Boutons desktop */}
              <div className="hidden sm:flex gap-3 mt-3">
                <button type="button" onClick={onRun} className={`flex-1 ${btnPrimary}`}>
                  Lancer
                </button>
                <button type="button" onClick={onReset} className={`flex-1 ${btnGhost}`}>
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>

          {/* Résumé */}
          <div className={`${cardBase} p-3 sm:p-5`}>
            <h2 className="text-base sm:text-lg font-semibold text-amber-100/90 mb-2 sm:mb-3">Résumé</h2>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] sm:text-sm">
              <div className="text-amber-100/75">Itérations</div>
              <div className="font-semibold text-amber-50">{results?.steps ?? '—'}</div>
              <div className="text-amber-100/75">Total Mana</div>
              <div className="font-semibold text-amber-50">{results ? results.mana.reduce((a, b) => a + b, 0) : '—'}</div>
              <div className="text-amber-100/75">Total PV rendus</div>
              <div className="font-semibold text-amber-50">{results ? results.heals.reduce((a, b) => a + b, 0) : '—'}</div>
              <div className="text-amber-100/75">PV finaux</div>
              <div className="font-semibold text-amber-50">{results?.final ?? '—'}</div>
            </div>

            {results && (
              <div className="hidden sm:flex mt-3 flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 text-amber-100/90 px-3 py-1 text-xs border border-amber-300/20">
                  {results.prowesses.filter(Boolean).length} Prouesse(s)
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 text-amber-100/90 px-3 py-1 text-xs border border-amber-300/20">
                  Bonus: {results.bonus}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 text-rose-200 px-3 py-1 text-xs border border-rose-300/20">
                  {results.spellSuccess.filter(s => !s).length} Sort(s) raté(s)
                </span>
              </div>
            )}
          </div>
        </section>

        <Ornament className="my-6" />

        {/* Barre d’actions mobile */}
        <div className="sm:hidden fixed inset-x-0 bottom-0 z-30 border-t border-amber-300/20 bg-zinc-950/80 backdrop-blur">
          <div className="max-w-6xl mx-auto px-4 py-3 grid grid-cols-2 gap-3">
            <button type="button" onClick={onRun} className="h-12 rounded-xl bg-amber-500/20 text-amber-50 border border-amber-300/30 font-medium">
              Lancer
            </button>
            <button type="button" onClick={onReset} className="h-12 rounded-xl border border-amber-300/30 bg-zinc-900/60 text-amber-50 font-medium">
              Réinitialiser
            </button>
          </div>
        </div>

        {/* Légende */}
        <section className="mt-3 sm:mt-4 text-[11px] text-amber-100/70 text-center">
          <button
            type="button"
            onClick={() => setShowLegend(v => !v)}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-amber-300/30 bg-zinc-900/60 hover:shadow-[0_0_0_2px_rgba(212,175,55,0.2)]"
          >
            {showLegend ? 'Masquer la légende' : 'Afficher la légende'}
          </button>
          {showLegend && (
            <div className="mt-2">
              <ul className="inline-flex gap-4">
                <li className="flex items-center gap-1">
                  <span className="inline-block w-3 h-3 rounded bg-amber-400/60 ring-1 ring-amber-300/60"></span>
                  Prouesse
                </li>
                <li className="flex items-center gap-1">
                  <span className="inline-block w-3 h-3 rounded bg-rose-500/30 ring-1 ring-rose-400/60"></span>
                  Sort raté ({'<'} 10)
                </li>
                <li className="flex items-center gap-1">
                  <span className="inline-block w-3 h-3 rounded bg-amber-200/30 ring-1 ring-amber-200/60"></span>
                  Totaux
                </li>
              </ul>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}