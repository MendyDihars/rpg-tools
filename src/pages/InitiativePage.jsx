import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { sanitizeItem, roll3d6 } from '../helpers';
import useDebouncedCallback from '../hooks/useDebouncedCallback';
import useSafeStorage from '../hooks/useSafeStorage';

const STORAGE_KEY = 'initiativeState.v1';

export default function InitiativePage() {
  const storage = useSafeStorage();

  const [iState, setIState] = useState(() => ({ items: [], seq: 1, orderSeq: 1 }));

  const [name, setName] = useState("Bandit");
  const [count, setCount] = useState(3);
  const [bonus, setBonus] = useState(2);
  const [hp, setHp] = useState(20);

  const [manualName, setManualName] = useState("");
  const [manualTotal, setManualTotal] = useState("");

  const [hpModalOpen, setHpModalOpen] = useState(false);
  const [hpTargetId, setHpTargetId] = useState(null);
  const [hpDelta, setHpDelta] = useState("");
  const hpInputRef = useRef(null);
  const lastFocusRef = useRef(null);

  // Load from storage (once)
  useEffect(() => {
    try {
      const raw = storage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (!data || !Array.isArray(data.items)) return;
      setIState({
        items: data.items.map(sanitizeItem),
        seq: Number.isFinite(data.seq) ? data.seq : 1,
        orderSeq: Number.isFinite(data.orderSeq) ? data.orderSeq : 1,
      });
    } catch {
      // ignore
    }
  }, [storage]);

  // Save to storage (debounced)
  const debouncedSave = useDebouncedCallback((payload) => {
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      storage.removeItem(STORAGE_KEY);
      storage.setItem(STORAGE_KEY, JSON.stringify(payload));
    }
  }, 150);

  useEffect(() => {
    debouncedSave({ ...iState, ts: Date.now() });
  }, [iState, debouncedSave]);

  // Extra: ensure save on unload
  useEffect(() => {
    const onBeforeUnload = () => {
      storage.setItem(STORAGE_KEY, JSON.stringify({ ...iState, ts: Date.now() }));
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [iState, storage]);

  const addGroup = useCallback((baseName, c, b, hpMax) => {
    setIState((prev) => {
      let seq = prev.seq;
      let orderSeq = prev.orderSeq;
      const created = [];
      const items = [...prev.items];
      for (let k = 0; k < c; k++) {
        const dice = roll3d6();
        const total = dice.reduce((a, d) => a + d, 0) + Number(b || 0);
        const idx = items.filter((it) => it.baseName === baseName).length + 1;
        const display = `${baseName} ${idx}`;
        const item = {
          id: seq++,
          baseName,
          index: idx,
          displayName: display,
          hpMax: Number(hpMax),
          hpCur: Number(hpMax),
          bonus: Number(b),
          dice,
          total,
          type: "group",
          order: orderSeq++,
        };
        items.push(item);
        created.push(item);
      }
      return { items, seq, orderSeq };
    });
  }, []);

  const addManual = useCallback((n, total) => {
    const baseName = String(n || "").trim() || "Entrée";
    setIState((prev) => {
      const idx = prev.items.filter((it) => it.baseName === baseName).length + 1;
      const item = {
        id: prev.seq + 0,
        baseName,
        index: idx,
        displayName: baseName,
        hpMax: null,
        hpCur: null,
        bonus: null,
        dice: null,
        total: Number(total),
        type: "manual",
        order: prev.orderSeq + 0,
      };
      return {
        items: [...prev.items, item],
        seq: prev.seq + 1,
        orderSeq: prev.orderSeq + 1,
      };
    });
  }, []);

  const resetAll = useCallback((hard = false) => {
    setIState({ items: [], seq: 1, orderSeq: 1 });
    if (hard) {
      storage.removeItem(STORAGE_KEY);
    }
  }, [storage]);

  const sortedItems = useMemo(() => {
    return [...iState.items].sort((a, b) => b.total - a.total || a.order - b.order);
  }, [iState.items]);

  const lastAdded = iState.items[iState.items.length - 1];

  // HP modal
  const openHpModal = useCallback((id) => {
    setHpTargetId(id);
    setHpDelta("");
    setHpModalOpen(true);
    lastFocusRef.current = document.activeElement;
  }, []);

  const closeHpModal = useCallback(() => {
    setHpModalOpen(false);
    setHpTargetId(null);
    setHpDelta("");
    lastFocusRef.current?.focus?.();
  }, []);

  const applyHpDelta = useCallback((mode) => {
    const val = Number(hpDelta);
    if (Number.isNaN(val) || val < 0) return;
    setIState((prev) => {
      const items = prev.items.map((it) => {
        if (it.id !== hpTargetId) return it;
        if (it.hpMax == null) return it;
        const next = { ...it };
        if (mode === "dmg") next.hpCur = Math.max(0, next.hpCur - val);
        else next.hpCur = Math.min(next.hpMax, next.hpCur + val);
        return next;
      });
      return { ...prev, items };
    });
    closeHpModal();
  }, [hpDelta, hpTargetId, closeHpModal]);

  useEffect(() => {
    if (hpModalOpen && hpInputRef.current) {
      hpInputRef.current.focus();
    }
  }, [hpModalOpen]);

  // Keyboard shortcuts: Enter submits appropriate action
  const onKeyDown = useCallback((ev) => {
    if (ev.key !== "Enter") return;
    const id = ev.currentTarget.id;
    if (id.startsWith("i_manual")) {
      if (!manualName || manualTotal === "") return;
      addManual(manualName, Number(manualTotal));
    } else {
      addGroup(name || "Groupe", Math.max(1, Number(count || 1)), Number(bonus || 0), Math.max(1, Number(hp || 1)));
    }
  }, [addGroup, addManual, bonus, count, hp, manualName, manualTotal, name]);

  // Render helpers
  const DiceText = ({ it }) => (
    <>{it.dice ? `${it.dice.join(" + ")}${(it.bonus ?? 0) ? " +" + it.bonus : ""}` : "—"}</>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 pb-24 pt-4 sm:pt-6">
      {/* PARAMS + SUMMARY */}
      <section className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 auto-rows-min">
        {/* Params (group add) */}
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-3 sm:p-5">
          <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Initiative — Ajouter un groupe</h2>

          <div className="sm:ml-auto sm:max-w-md">
            <div className="flex items-center justify-between gap-3 mb-2">
              <label htmlFor="i_name" className="text-xs sm:text-sm text-slate-600 sm:text-right flex-1">Nom</label>
              <input id="i_name" type="text" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={onKeyDown}
                className="h-9 sm:h-11 w-44 sm:w-60 rounded-xl border border-slate-300 px-3 sm:px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>

            <div className="flex items-center justify-between gap-3 mb-2">
              <label htmlFor="i_count" className="text-xs sm:text-sm text-slate-600 sm:text-right flex-1">Nombre</label>
              <input id="i_count" type="number" value={count} min={1} inputMode="numeric" onChange={(e) => setCount(Number(e.target.value))} onKeyDown={onKeyDown}
                className="h-9 sm:h-11 w-44 sm:w-60 rounded-xl border border-slate-300 px-3 sm:px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>

            <div className="flex items-center justify-between gap-3 mb-2">
              <label htmlFor="i_bonus" className="text-xs sm:text-sm text-slate-600 sm:text-right flex-1">Bonus (+)</label>
              <input id="i_bonus" type="number" value={bonus} step={1} inputMode="numeric" onChange={(e) => setBonus(Number(e.target.value))} onKeyDown={onKeyDown}
                className="h-9 sm:h-11 w-44 sm:w-60 rounded-xl border border-slate-300 px-3 sm:px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>

            <div className="flex items-center justify-between gap-3">
              <label htmlFor="i_hp" className="text-xs sm:text-sm text-slate-600 sm:text-right flex-1">PV max</label>
              <input id="i_hp" type="number" value={hp} min={1} inputMode="numeric" onChange={(e) => setHp(Number(e.target.value))} onKeyDown={onKeyDown}
                className="h-9 sm:h-11 w-44 sm:w-60 rounded-xl border border-slate-300 px-3 sm:px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>

            <div className="hidden sm:flex gap-3 mt-3">
              <button type="button" onClick={() => addGroup(name || "Groupe", Math.max(1, Number(count || 1)), Number(bonus || 0), Math.max(1, Number(hp || 1)))} className="flex-1 h-10 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors">Ajouter le groupe</button>
              <button type="button" onClick={() => resetAll(true)} className="flex-1 h-10 rounded-xl border border-slate-300 bg-white font-medium hover:bg-slate-50 transition-colors">Reset</button>
            </div>
          </div>
        </div>

        {/* Manual add + Summary */}
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-3 sm:p-5">
          <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Ajout manuel & Résumé</h2>

          {/* Manual add */}
          <div className="sm:ml-auto sm:max-w-md">
            <div className="flex items-center justify-between gap-3 mb-2">
              <label htmlFor="i_manual_name" className="text-xs sm:text-sm text-slate-600 sm:text-right flex-1">Nom (manuel)</label>
              <input id="i_manual_name" type="text" placeholder="Magister…" value={manualName} onChange={(e) => setManualName(e.target.value)} onKeyDown={onKeyDown}
                className="h-9 sm:h-11 w-44 sm:w-60 rounded-xl border border-slate-300 px-3 sm:px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="i_manual_total" className="text-xs sm:text-sm text-slate-600 sm:text-right flex-1">Jet total (manuel)</label>
              <input id="i_manual_total" type="number" placeholder="Résultat" inputMode="numeric" value={manualTotal} onChange={(e) => setManualTotal(e.target.value)} onKeyDown={onKeyDown}
                className="h-9 sm:h-11 w-44 sm:w-60 rounded-xl border border-slate-300 px-3 sm:px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div className="hidden sm:flex gap-3 mt-3">
              <button type="button" onClick={() => { if (!manualName || manualTotal === "") { alert("Nom et total manuel requis."); return; } addManual(manualName, Number(manualTotal)); }} className="flex-1 h-10 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors">Ajouter manuel</button>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] sm:text-sm">
            <div className="text-slate-600">Entrées</div>
            <div id="i_summary_count" className="font-semibold">{sortedItems.length || "—"}</div>
            <div className="text-slate-600">Dernier ajout</div>
            <div id="i_summary_last" className="font-semibold">{lastAdded ? lastAdded.displayName : "—"}</div>
          </div>
        </div>
      </section>

      {/* MOBILE LIST */}
      <section className="mt-4 sm:mt-6 sm:hidden">
        <h3 className="text-base font-semibold mb-2">Ordre d’initiative</h3>
        <div id="i_mobile" className="space-y-2">
          {sortedItems.map((it, idx) => (
            <div key={it.id} className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-3">
              <div className="flex items-center justify-between gap-3 mb-1">
                <div className="text-sm font-semibold text-slate-700">#{idx + 1} — {it.displayName}</div>
              </div>
              <div className="flex items-center justify-between text-[13px] py-1">
                <span className="text-slate-600">Jet</span>
                <span className="font-medium"><DiceText it={it} /></span>
              </div>
              <div className="flex items-center justify-between text-[13px] py-1">
                <span className="text-slate-600">Total</span>
                <span className="font-medium">{it.total}</span>
              </div>
              <div className="flex items-center justify-between text-[13px] py-1">
                <span className="text-slate-600">PV</span>
                <span className="font-medium">
                  {it.hpMax != null ? (
                    <button type="button" className="underline underline-offset-2 decoration-slate-300 hover:decoration-indigo-400 text-slate-800" onClick={() => openHpModal(it.id)}>
                      {Math.max(0, it.hpCur)}/{it.hpMax}
                    </button>
                  ) : (
                    "—"
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DESKTOP TABLE */}
      <section className="mt-6 hidden sm:block">
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-semibold">Ordre d’initiative</h3>
            <div className="text-sm text-slate-500">Tri décroissant</div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[800px] w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 w-12">#</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Nom</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Jet</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Total</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">PV</th>
                </tr>
              </thead>
              <tbody>
                {sortedItems.map((it, idx) => (
                  <tr key={it.id}>
                    <td className="px-4 py-3 align-top text-slate-600">{idx + 1}</td>
                    <td className="px-4 py-3 align-top font-medium">{it.displayName}</td>
                    <td className="px-4 py-3 align-top"><DiceText it={it} /></td>
                    <td className="px-4 py-3 align-top font-semibold">{it.total}</td>
                    <td className="px-4 py-3 align-top">
                      {it.hpMax != null ? (
                        <button type="button" className="underline underline-offset-2 decoration-slate-300 hover:decoration-indigo-400 text-slate-800" onClick={() => openHpModal(it.id)}>
                          {Math.max(0, it.hpCur)}/{it.hpMax}
                        </button>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Sticky mobile bar */}
      <div className="sm:hidden fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3 grid grid-cols-3 gap-3">
          <button type="button" onClick={() => addGroup(name || "Groupe", Math.max(1, Number(count || 1)), Number(bonus || 0), Math.max(1, Number(hp || 1)))} className="h-12 rounded-xl bg-indigo-600 text-white font-medium">Ajouter</button>
          <button type="button" onClick={() => { if (!manualName || manualTotal === "") { alert("Nom et total manuel requis."); return; } addManual(manualName, Number(manualTotal)); }} className="h-12 rounded-xl border border-slate-300 bg-white font-medium">Manuel</button>
          <button type="button" onClick={() => resetAll(true)} className="h-12 rounded-xl border border-slate-300 bg-white font-medium">Reset</button>
        </div>
      </div>

      {/* HP modal */}
      {hpModalOpen && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" onClick={(e) => { if (e.target === e.currentTarget) closeHpModal(); }}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative mx-auto mt-24 w-[90%] max-w-md rounded-2xl bg-white shadow-lg ring-1 ring-slate-200 p-5">
            <h4 className="text-lg font-semibold mb-1">Modifier les PV</h4>
            <p className="text-sm text-slate-600 mb-3">
              {(() => {
                const t = iState.items.find((x) => x.id === hpTargetId);
                return t ? `${t.displayName} — ${Math.max(0, t.hpCur)}/${t.hpMax}` : "";
              })()}
            </p>
            <div className="flex items-center gap-3">
              <input ref={hpInputRef} type="number" inputMode="numeric" value={hpDelta} onChange={(e) => setHpDelta(e.target.value)} className="h-10 w-32 rounded-xl border border-slate-300 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Valeur" />
              <div className="flex-1" />
            </div>
            <div className="flex gap-3 mt-4">
              <button type="button" onClick={() => applyHpDelta("dmg")} className="flex-1 h-10 rounded-xl bg-rose-600 text-white font-medium hover:bg-rose-700">Dégâts</button>
              <button type="button" onClick={() => applyHpDelta("heal")} className="flex-1 h-10 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700">Soin</button>
            </div>
            <button type="button" onClick={closeHpModal} className="mt-3 w-full h-10 rounded-xl border border-slate-300 bg-white font-medium hover:bg-slate-50">Annuler</button>
          </div>
        </div>
      )}
    </div>
  );
}
