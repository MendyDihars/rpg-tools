import React, { useEffect, useMemo, useState } from "react";

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

  // Render helpers
  const btnBase =
    "px-3 h-9 rounded-lg border border-slate-300 bg-white text-sm transition-colors cursor-pointer";
  const btnActive = " bg-indigo-600 border-indigo-600";

  const P_BUTTONS = ["none", "1", "2", "3", "4", "5", "6"];

  return (
    <div className="max-w-6xl mx-auto px-4 pb-20 pt-4 sm:pt-6">
      {/* PARAMS + SUMMARY */}
      <section className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 auto-rows-min">
        {/* Parameters */}
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-3 sm:p-5">
          <h2 className="text-lg font-semibold mb-2 sm:mb-3">Paramètres</h2>
          <div className="sm:ml-auto sm:max-w-md">
            <div className="flex items-center justify-between gap-3 mb-2">
              <label
                htmlFor="rx_dm"
                className="text-sm text-slate-600 sm:text-right flex-1"
              >
                Distance maximale par saut (km)
              </label>
              <input
                id="rx_dm"
                type="number"
                min={0}
                step={0.01}
                value={dm}
                inputMode="decimal"
                onChange={(e) => setDm(Number(e.target.value))}
                className="h-9 sm:h-11 w-44 sm:w-60 rounded-xl border border-slate-300 px-3 sm:px-4
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex items-center justify-between gap-3">
              <label
                htmlFor="rx_dmt"
                className="text-sm text-slate-600 sm:text-right flex-1"
              >
                Distance maximale totale (km)
              </label>
              <input
                id="rx_dmt"
                type="number"
                min={0}
                step={0.01}
                value={dmt}
                inputMode="decimal"
                onChange={(e) => setDmt(Number(e.target.value))}
                className="h-9 sm:h-11 w-44 sm:w-60 rounded-xl border border-slate-300 px-3 sm:px-4
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-3 sm:p-5">
          <h2 className="text-lg font-semibold mb-2 sm:mb-3">Résumé</h2>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
            <div className="text-slate-600">Sauts maximum possibles</div>
            <div className="font-semibold">{Number.isFinite(maxJumps) ? maxJumps : "—"}</div>
            <div className="text-slate-600">Distance maximale par saut</div>
            <div className="font-medium">{`${dm.toLocaleString("fr-FR")} km`}</div>
            <div className="text-slate-600">Distance maximale totale</div>
            <div className="font-medium">{`${dmt.toLocaleString("fr-FR")} km`}</div>
          </div>
        </div>
      </section>

      {/* PROUESSE / DP */}
      <section className="mt-4 sm:mt-6 grid grid-cols-1">
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-3 sm:p-5">
          <h2 className="text-lg font-semibold mb-2 sm:mb-3">Prouesse & distance dépensée</h2>
          <div className="sm:ml-auto sm:max-w-xl">
            <div id="rx_prouesse_group" className="flex flex-wrap gap-2 mb-3">
              {P_BUTTONS.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setP(String(val))}
                  className={btnBase + (String(p) === String(val) ? btnActive : "")}
                >
                  {val === "none" ? "Aucune prouesse" : val}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between gap-3 mb-2">
              <label
                htmlFor="rx_dp"
                className="text-sm text-slate-600 sm:text-right flex-1"
              >
                Distance parcourue (km)
              </label>
              <input
                id="rx_dp"
                type="number"
                min={0}
                step={0.01}
                value={dp}
                inputMode="decimal"
                onChange={(e) => setDp(Number(e.target.value))}
                className="h-9 sm:h-11 w-44 sm:w-60 rounded-xl border border-slate-300 px-3 sm:px-4
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-[auto,1fr] items-center gap-x-3 gap-y-1 text-sm">
              <div className="text-slate-600">Distance dépensée</div>
              <div className="font-semibold">
                {`${(Math.round(spent * 1000) / 1000).toLocaleString("fr-FR")} km`}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RAPPELS TABLE */}
      <section className="mt-4 sm:mt-6">
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-semibold">Rappels & ricochets</h3>
            <div className="text-sm text-slate-500 hidden sm:block">Aller / Aller-retour</div>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden p-3 space-y-2">
            {REMINDERS.map((r) => {
              const jumpsOneWay = dm > 0 ? ceilDiv(r.km, dm) : "—";
              const tripsOneWay = dm > 0 ? floorDiv(dmt, r.km) : "—";
              const tripsRound = dm > 0 ? floorDiv(dmt, r.km * 2) : "—";
              return (
                <div key={r.label} className="rounded-xl ring-1 ring-slate-200 bg-white p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{r.label}</span>
                    <span className="text-slate-600">{`${r.km.toLocaleString("fr-FR")} km`}</span>
                  </div>
                  <div className="flex items-center justify-between text-[13px] mt-1">
                    <span className="text-slate-600">Sauts requis (aller)</span>
                    <span className="font-semibold">{String(jumpsOneWay)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[13px] mt-1">
                    <span className="text-slate-600">Trajets possibles (aller)</span>
                    <span className="font-medium">{String(tripsOneWay)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[13px] mt-1">
                    <span className="text-slate-600">Trajets possibles (aller-retour)</span>
                    <span className="font-medium">{String(tripsRound)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block">
            <div className="overflow-x-auto">
              <table className="min-w-[860px] w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Rappel</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Distance (km)</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Sauts requis (aller)</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">
                      Trajets possibles avec la distance maximale totale (aller)
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">
                      Trajets possibles avec la distance maximale totale (aller-retour)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {REMINDERS.map((r) => {
                    const jumpsOneWay = dm > 0 ? ceilDiv(r.km, dm) : "—";
                    const tripsOneWay = dm > 0 ? floorDiv(dmt, r.km) : "—";
                    const tripsRound = dm > 0 ? floorDiv(dmt, r.km * 2) : "—";
                    return (
                      <tr key={r.label}>
                        <td className="px-4 py-3 align-top">{r.label}</td>
                        <td className="px-4 py-3 align-top">
                          {`${r.km.toLocaleString("fr-FR")} km`}
                        </td>
                        <td className="px-4 py-3 align-top font-medium">{String(jumpsOneWay)}</td>
                        <td className="px-4 py-3 align-top">{String(tripsOneWay)}</td>
                        <td className="px-4 py-3 align-top">{String(tripsRound)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
