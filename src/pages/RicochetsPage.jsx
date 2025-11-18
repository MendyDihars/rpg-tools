import React, { useEffect, useMemo, useState } from "react";
import Ornament from "../components/Ornament";
import Crest from '../components/Crest';

// Math helpers
function ceilDiv(a, b) { return b > 0 ? Math.ceil(a / b) : Infinity; }
function floorDiv(a, b) { return b > 0 ? Math.floor(a / b) : 0; }

// Compute spent distance based on "prouesse"
function computeSpentDistance(dp, p) {
  if (p === "6") return 0;
  if (p === "5") return dp * 0.15;
  if (p === "4") return dp * 0.5;
  if (p === "3") return dp * 0.66; // ≈ 2/3
  if (p === "2") return dp * 0.75; // 3/4
  if (p === "1") return Math.max(0, dp - 1);
  return dp; // none
}

// Fixed reminders list
const REMINDERS = [
  { label: "1 heure", km: 5 },
  { label: "2 heures", km: 10 },
  { label: "1 jour", km: 40 },
  { label: "6 jours", km: 240 },
  { label: "12 jours", km: 480 },
  { label: "Porte du Thaig", km: 0.05 }, // 50 m
];

const STORAGE_KEY = "ricochets.v1";

export default function RicochetsPage() {
  // Form state
  const [dm, setDm] = useState(240); // max distance per jump
  const [dmt, setDmt] = useState(480); // max total distance
  const [dp, setDp] = useState(10); // traveled distance
  const [p, setP] = useState("none"); // prouesse selection

  // Load from storage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (!data) return;
      if (typeof data.dm === "number") setDm(data.dm);
      if (typeof data.dmt === "number") setDmt(data.dmt);
      if (typeof data.dp === "number") setDp(data.dp);
      if (data.p != null) setP(String(data.p));
    } catch {
      // ignore
    }
  }, []);

  // Persist on changes (simple, no debounce needed here)
  useEffect(() => {
    try {
      const payload = { dm, dmt, dp, p, ts: Date.now() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore write errors (quota, privacy, etc.)
    }
  }, [dm, dmt, dp, p]);

  // Derived data
  const maxJumps = useMemo(() => (dm > 0 ? floorDiv(dmt, dm) : 0), [dmt, dm]);
  const spent = useMemo(() => computeSpentDistance(dp, p), [dp, p]);

  // Render helpers (dark+gold theme)
  const btnBase =
    "px-3 h-9 cursor-pointer rounded-xl border border-amber-400/30 bg-zinc-900/60 text-sm text-amber-100/90 shadow-sm hover:shadow-[0_0_0_2px_rgba(212,175,55,0.25)] hover:border-amber-300/60 transition-colors backdrop-blur-sm";
  const btnActive = " !bg-gradient-to-b from-amber-500/30 to-amber-600/20 !border-amber-300 !text-amber-50 ring-1 ring-amber-300/40";

  const inputBase =
    "h-10 sm:h-11 w-44 sm:w-60 rounded-xl border border-amber-400/30 bg-zinc-900/60 text-amber-50 px-3 sm:px-4 placeholder:text-amber-100/30 focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-300/70 backdrop-blur-sm";

  const cardBase =
    "rounded-2xl border border-amber-300/20 bg-[radial-gradient(1200px_400px_at_50%_-20%,rgba(212,175,55,0.06),transparent),linear-gradient(to_bottom_right,rgba(255,255,255,0.02),rgba(0,0,0,0.2))] shadow-[0_10px_40px_rgba(0,0,0,0.35)]";

  const labelTone = "text-amber-100/80";
  const valueTone = "text-amber-50";

  const P_BUTTONS = ["none", "1", "2", "3", "4", "5", "6"];

  return (
    <div className="w-full bg-[#0b0f14] text-amber-50 relative overflow-hidden">
      {/* faint vignette + sparkles */}
      <div className="pointer-events-none absolute inset-0 opacity-70" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(800px_500px_at_20%_-10%,rgba(212,175,55,0.08),transparent),radial-gradient(600px_400px_at_80%_-10%,rgba(255,215,128,0.05),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(0,0,0,0),rgba(0,0,0,0.6))]" />
      </div>

      {/* Header */}
      <header className="max-w-6xl mx-auto px-4 pt-8 pb-6 sm:pb-8 relative">
        <div className="flex items-center gap-3">
          <Crest />
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif tracking-wide drop-shadow-[0_2px_10px_rgba(212,175,55,0.25)]">Ricochets du Thaig</h1>
            <p className="text-amber-100/70 text-sm">Calculs de sauts</p>
          </div>
        </div>
        <Ornament className="mt-5" />
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-24 relative">
        {/* PARAMS + SUMMARY */}
        <section className="grid gap-4 grid-cols-1 lg:grid-cols-[1fr_380px] auto-rows-min">
          {/* Parameters */}
          <div className={`${cardBase} p-4 sm:p-6`}>
            <h2 className="text-lg font-semibold text-amber-100/90">Paramètres</h2>
            <div className="sm:ml-auto sm:max-w-md mt-3">
              <div className="flex items-center justify-between gap-3 mb-3">
                <label htmlFor="rx_dm" className={`text-sm ${labelTone} sm:text-right flex-1`}>
                  Distance maximale par saut (km)
                </label>
                <input
                  id="rx_dm"
                  type="number"
                  min={0}
                  step={0.01}
                  value={dm || ''}
                  inputMode="decimal"
                  onChange={(e) => setDm(Number(e.target.value))}
                  className={inputBase}
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="rx_dmt" className={`text-sm ${labelTone} sm:text-right flex-1`}>
                  Distance maximale totale (km)
                </label>
                <input
                  id="rx_dmt"
                  type="number"
                  min={0}
                  step={0.01}
                  value={dmt || ''}
                  inputMode="decimal"
                  onChange={(e) => setDmt(Number(e.target.value))}
                  className={inputBase}
                />
              </div>
            </div>
          </div>

          {/* Summary (sidebar) */}
          <aside className={`${cardBase} p-4 sm:p-6 lg:sticky lg:top-6 h-fit`}>
            <h2 className="text-lg font-semibold text-amber-100/90">Résumé</h2>
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm mt-3">
              <div className={labelTone}>Sauts maximum possibles</div>
              <div className={`font-semibold ${valueTone}`}>
                {Number.isFinite(maxJumps) ? maxJumps : "—"}
              </div>
              <div className={labelTone}>Distance maximale par saut</div>
              <div className="font-medium text-amber-50">{`${dm.toLocaleString("fr-FR")} km`}</div>
              <div className={labelTone}>Distance maximale totale</div>
              <div className="font-medium text-amber-50">{`${dmt.toLocaleString("fr-FR")} km`}</div>
            </div>
          </aside>
        </section>

        <Ornament className="my-6" />

        {/* PROUESSE / DP */}
        <section className={`${cardBase} p-4 sm:p-6`}>
          <h2 className="text-lg font-semibold text-amber-100/90 mb-2 sm:mb-3">Prouesse & distance dépensée</h2>
          <div className="sm:ml-auto sm:max-w-xl">
            <div id="rx_prouesse_group" className="flex flex-wrap gap-2 mb-4">
              {P_BUTTONS.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setP(String(val))}
                  className={`${btnBase} ${String(p) === String(val) ? btnActive : ""}`}
                >
                  {val === "none" ? "Aucune prouesse" : val}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between gap-3 mb-2">
              <label htmlFor="rx_dp" className={`text-sm ${labelTone} sm:text-right flex-1`}>
                Distance parcourue (km)
              </label>
              <input
                id="rx_dp"
                type="number"
                min={0}
                step={0.01}
                value={dp || ''}
                inputMode="decimal"
                onChange={(e) => setDp(Number(e.target.value))}
                className={inputBase}
              />
            </div>

            <div className="grid grid-cols-[auto,1fr] items-center gap-x-3 gap-y-1 text-sm">
              <div className={labelTone}>Distance dépensée</div>
              <div className="font-semibold text-amber-50">
                {`${(Math.round(spent * 1000) / 1000).toLocaleString("fr-FR")} km`}
              </div>
            </div>
          </div>
        </section>

        <Ornament className="my-6" />

        {/* RAPPELS TABLE */}
        <section className={`${cardBase}`}>
          <div className="p-4 border-b border-amber-400/20 flex items-center justify-between bg-gradient-to-r from-amber-500/5 to-transparent rounded-t-2xl">
            <h3 className="font-semibold text-amber-100/90 tracking-wide">Rappels & ricochets</h3>
            <div className="text-sm text-amber-100/60 hidden sm:block">Aller / Aller-retour</div>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden p-3 space-y-2">
            {REMINDERS.map((r) => {
              const jumpsOneWay = dm > 0 ? ceilDiv(r.km, dm) : "—";
              const tripsOneWay = dm > 0 ? floorDiv(dmt, r.km) : "—";
              const tripsRound = dm > 0 ? floorDiv(dmt, r.km * 2) : "—";
              return (
                <div key={r.label} className="rounded-xl border border-amber-300/20 bg-zinc-950/60 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-amber-50">{r.label}</span>
                    <span className="text-amber-100/75">{`${r.km.toLocaleString("fr-FR")} km`}</span>
                  </div>
                  <div className="flex items-center justify-between text-[13px] mt-1">
                    <span className="text-amber-100/70">Sauts requis (aller)</span>
                    <span className="font-semibold text-amber-50">{String(jumpsOneWay)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[13px] mt-1">
                    <span className="text-amber-100/70">Trajets possibles (aller)</span>
                    <span className="font-medium text-amber-50">{String(tripsOneWay)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[13px] mt-1">
                    <span className="text-amber-100/70">Trajets possibles (aller-retour)</span>
                    <span className="font-medium text-amber-50">{String(tripsRound)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block">
            <div className="overflow-x-auto">
              <table className="min-w-[860px] w-full text-sm">
                <thead className="bg-zinc-950/60">
                  <tr className="border-b border-amber-300/20">
                    <th className="text-left px-4 py-3 font-semibold text-amber-100/80">Rappel</th>
                    <th className="text-left px-4 py-3 font-semibold text-amber-100/80">Distance (km)</th>
                    <th className="text-left px-4 py-3 font-semibold text-amber-100/80">Sauts requis (aller)</th>
                    <th className="text-left px-4 py-3 font-semibold text-amber-100/80">
                      Trajets possibles avec la distance maximale totale (aller)
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-amber-100/80">
                      Trajets possibles avec la distance maximale totale (aller-retour)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-300/10">
                  {REMINDERS.map((r) => {
                    const jumpsOneWay = dm > 0 ? ceilDiv(r.km, dm) : "—";
                    const tripsOneWay = dm > 0 ? floorDiv(dmt, r.km) : "—";
                    const tripsRound = dm > 0 ? floorDiv(dmt, r.km * 2) : "—";
                    return (
                      <tr key={r.label} className="hover:bg-amber-500/5 transition-colors">
                        <td className="px-4 py-3 align-top text-amber-50">{r.label}</td>
                        <td className="px-4 py-3 align-top text-amber-100/80">{`${r.km.toLocaleString("fr-FR")} km`}</td>
                        <td className="px-4 py-3 align-top font-medium text-amber-50">{String(jumpsOneWay)}</td>
                        <td className="px-4 py-3 align-top text-amber-100/80">{String(tripsOneWay)}</td>
                        <td className="px-4 py-3 align-top text-amber-100/80">{String(tripsRound)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
