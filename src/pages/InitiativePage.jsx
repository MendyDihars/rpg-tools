import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { sanitizeItem, roll3d6 } from '../helpers';
import useDebouncedCallback from '../hooks/useDebouncedCallback';
import useSafeStorage from '../hooks/useSafeStorage';
import Ornament from '../components/Ornament';
import Crest from '../components/Crest';

const STORAGE_KEY = 'initiativeState.v1';

export default function InitiativePage() {
  const storage = useSafeStorage();

  const [iState, setIState] = useState(() => ({ items: [], seq: 1, orderSeq: 1, turnId: null }));

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

  // THEME HELPERS (dark + gold)
  const cardBase =
    "rounded-2xl border border-amber-300/20 bg-[radial-gradient(1200px_400px_at_50%_-20%,rgba(212,175,55,0.06),transparent),linear-gradient(to_bottom_right,rgba(255,255,255,0.02),rgba(0,0,0,0.2))] shadow-[0_10px_40px_rgba(0,0,0,0.35)]";
  const inputBase =
    "h-9 sm:h-11 w-44 sm:w-60 rounded-xl border border-amber-400/30 bg-zinc-900/60 text-amber-50 px-3 sm:px-4 placeholder:text-amber-100/30 focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-300/70 backdrop-blur-sm";
  const labelTone = "text-amber-100/80";
  const btnPrimary =
    "h-10 rounded-xl bg-linear-to-b from-amber-500/30 to-amber-600/20 text-amber-50 font-medium border border-amber-300/40 hover:shadow-[0_0_0_2px_rgba(212,175,55,0.25)] focus:outline-none focus:ring-2 focus:ring-amber-400/60";
  const btnGhost =
    "h-10 rounded-xl border border-amber-300/30 bg-zinc-900/60 text-amber-50 font-medium hover:shadow-[0_0_0_2px_rgba(212,175,55,0.2)] focus:outline-none focus:ring-2 focus:ring-amber-400/60";

  // Load from storage (once)
  useEffect(() => {
    try {
      const raw = storage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (!data || !Array.isArray(data.items)) return;
      setIState({
        items: data.items.map((item) => {
          const clean = sanitizeItem(item);
          return clean.type === "manual" ? { ...clean, manualKo: Boolean(item.manualKo) } : clean;
        }),
        seq: Number.isFinite(data.seq) ? data.seq : 1,
        orderSeq: Number.isFinite(data.orderSeq) ? data.orderSeq : 1,
        turnId: Number.isFinite(data.turnId) ? data.turnId : null,
      });
    } catch {
      // ignore
    }
  }, [storage]);

  // Save to storage (debounced)
  const debouncedSave = useDebouncedCallback((payload) => {
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
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
      return { ...prev, items, seq, orderSeq };
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
        manualKo: false,
        order: prev.orderSeq + 0,
      };
      return {
        ...prev,
        items: [...prev.items, item],
        seq: prev.seq + 1,
        orderSeq: prev.orderSeq + 1,
      };
    });
  }, []);

  const resetAll = useCallback((hard = false) => {
    setIState({ items: [], seq: 1, orderSeq: 1, turnId: null });
    if (hard) {
      storage.removeItem(STORAGE_KEY);
    }
  }, [storage]);

  const sortedItems = useMemo(() => {
    return [...iState.items].sort((a, b) => b.total - a.total || a.order - b.order);
  }, [iState.items]);

  const livingItems = useMemo(
    () =>
      sortedItems.filter((it) =>
        it.type === "manual" ? !it.manualKo : it.hpMax == null || Math.max(0, it.hpCur) > 0
      ),
    [sortedItems]
  );

  const lastAdded = iState.items[iState.items.length - 1];

  const advanceTurn = useCallback(() => {
    if (!livingItems.length) return;
    setIState((prev) => {
      const currentIdx = livingItems.findIndex((it) => it.id === prev.turnId);
      const nextIdx = currentIdx === -1 ? 0 : (currentIdx + 1) % livingItems.length;
      const next = livingItems[nextIdx];
      if (!next || next.id === prev.turnId) return prev;
      return { ...prev, turnId: next.id };
    });
  }, [livingItems]);

  useEffect(() => {
    setIState((prev) => {
      if (!livingItems.length) {
        return prev.turnId != null ? { ...prev, turnId: null } : prev;
      }
      if (!livingItems.some((it) => it.id === prev.turnId)) {
        return { ...prev, turnId: livingItems[0].id };
      }
      return prev;
    });
  }, [livingItems]);
  const activeItem = useMemo(
    () => livingItems.find((it) => it.id === iState.turnId) || null,
    [livingItems, iState.turnId]
  );

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

  const toggleManualKo = useCallback((id) => {
    setIState((prev) => {
      const items = prev.items.map((it) => {
        if (it.id !== id || it.type !== "manual") return it;
        return { ...it, manualKo: !it.manualKo };
      });
      return { ...prev, items };
    });
  }, []);

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
  const isManualKo = (it) => it.type === "manual" && Boolean(it.manualKo);
  const isZeroHp = (it) =>
    it.type === "manual" ? isManualKo(it) : it.hpMax != null && Math.max(0, it.hpCur) === 0;
  const isTurnEligible = (it) =>
    it.type === "manual" ? !isManualKo(it) : it.hpMax == null || Math.max(0, it.hpCur) > 0;
  const isActiveTurn = (it) => iState.turnId === it.id && isTurnEligible(it);
  const NextIcon = ({ className }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M7 12h7M12 7l4 5-4 5"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth={1.2} opacity={0.6} />
    </svg>
  );

  DiceText.propTypes = {
    it: PropTypes.shape({
      dice: PropTypes.arrayOf(PropTypes.number),
      bonus: PropTypes.number,
    }).isRequired,
  };
  NextIcon.propTypes = {
    className: PropTypes.string,
  };

  return (
    <div className="min-h-screen w-full bg-[#0b0f14] text-amber-50 relative overflow-hidden">
      {/* golden backdrop */}
      <div className="pointer-events-none absolute inset-0 opacity-70" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(800px_500px_at_20%_-10%,rgba(212,175,55,0.08),transparent),radial-gradient(600px_400px_at_80%_-10%,rgba(255,215,128,0.05),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(0,0,0,0),rgba(0,0,0,0.6))]" />
      </div>

      {/* Header */}
      <header className="max-w-6xl mx-auto px-4 pt-8 pb-6 sm:pb-8 relative">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full border border-amber-400/40 bg-zinc-900/70 grid place-items-center shadow-[0_0_0_2px_rgba(212,175,55,0.15)]">
            <Crest />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif tracking-wide drop-shadow-[0_2px_10px_rgba(212,175,55,0.25)]">Ordres d’initiative</h1>
            <p className="text-amber-100/70 text-sm">Tirages & suivi des PV ✨</p>
          </div>
        </div>
        <Ornament className="mt-5" />
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-28 relative">
        {/* PARAMS + SUMMARY */}
        <section className="grid gap-4 grid-cols-1 md:grid-cols-2 auto-rows-min">
          {/* Params (group add) */}
          <div className={`${cardBase} p-3 sm:p-5`}>
            <h2 className="text-base sm:text-lg font-semibold text-amber-100/90 mb-2 sm:mb-3">Initiative — Ajouter un groupe</h2>

            <div className="sm:ml-auto sm:max-w-md">
              <div className="flex items-center justify-between gap-3 mb-2">
                <label htmlFor="i_name" className={`text-xs sm:text-sm ${labelTone} sm:text-right flex-1`}>Nom</label>
                <input id="i_name" type="text" value={name || ''} onChange={(e) => setName(e.target.value)} onKeyDown={onKeyDown} className={inputBase} />
              </div>

              <div className="flex items-center justify-between gap-3 mb-2">
                <label htmlFor="i_count" className={`text-xs sm:text-sm ${labelTone} sm:text-right flex-1`}>Nombre</label>
                <input id="i_count" type="number" value={count || ''} min={1} inputMode="numeric" onChange={(e) => setCount(Number(e.target.value))} onKeyDown={onKeyDown} className={inputBase} />
              </div>

              <div className="flex items-center justify-between gap-3 mb-2">
                <label htmlFor="i_bonus" className={`text-xs sm:text-sm ${labelTone} sm:text-right flex-1`}>Bonus (+)</label>
                <input id="i_bonus" type="number" value={bonus || ''} step={1} inputMode="numeric" onChange={(e) => setBonus(Number(e.target.value))} onKeyDown={onKeyDown} className={inputBase} />
              </div>

              <div className="flex items-center justify-between gap-3">
                <label htmlFor="i_hp" className={`text-xs sm:text-sm ${labelTone} sm:text-right flex-1`}>PV max</label>
                <input id="i_hp" type="number" value={hp || ''} min={1} inputMode="numeric" onChange={(e) => setHp(Number(e.target.value))} onKeyDown={onKeyDown} className={inputBase} />
              </div>

              <div className="hidden sm:flex gap-3 mt-3">
                <button type="button" onClick={() => addGroup(name || "Groupe", Math.max(1, Number(count || 1)), Number(bonus || 0), Math.max(1, Number(hp || 1)))} className={`flex-1 ${btnPrimary}`}>Ajouter le groupe</button>
                <button type="button" onClick={() => resetAll(true)} className={`flex-1 ${btnGhost}`}>Reset</button>
              </div>
            </div>
          </div>

          {/* Manual add + Summary */}
          <div className={`${cardBase} p-3 sm:p-5`}>
            <h2 className="text-base sm:text-lg font-semibold text-amber-100/90 mb-2 sm:mb-3">Ajout manuel & Résumé</h2>

            {/* Manual add */}
            <div className="sm:ml-auto sm:max-w-md">
              <div className="flex items-center justify-between gap-3 mb-2">
                <label htmlFor="i_manual_name" className={`text-xs sm:text-sm ${labelTone} sm:text-right flex-1`}>Nom (manuel)</label>
                <input id="i_manual_name" type="text" placeholder="Magister…" value={manualName} onChange={(e) => setManualName(e.target.value)} onKeyDown={onKeyDown} className={inputBase} />
              </div>
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="i_manual_total" className={`text-xs sm:text-sm ${labelTone} sm:text-right flex-1`}>Jet total (manuel)</label>
                <input id="i_manual_total" type="number" placeholder="Résultat" inputMode="numeric" value={manualTotal} onChange={(e) => setManualTotal(e.target.value)} onKeyDown={onKeyDown} className={inputBase} />
              </div>
              <div className="hidden sm:flex gap-3 mt-3">
                <button type="button" onClick={() => { if (!manualName || manualTotal === "") { alert("Nom et total manuel requis."); return; } addManual(manualName, Number(manualTotal)); }} className={`flex-1 ${btnPrimary}`}>Ajouter manuel</button>
              </div>
            </div>

            {/* Summary */}
            <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] sm:text-sm">
              <div className="text-amber-100/75">Entrées</div>
              <div id="i_summary_count" className="font-semibold text-amber-50">{sortedItems.length || "—"}</div>
              <div className="text-amber-100/75">Dernier ajout</div>
              <div id="i_summary_last" className="font-semibold text-amber-50">{lastAdded ? lastAdded.displayName : "—"}</div>
            </div>
            <div className="mt-4 rounded-2xl border border-amber-300/20 bg-zinc-900/50 p-3 sm:p-4 shadow-inner">
              <div className="text-xs uppercase tracking-[0.2em] text-amber-100/60 mb-1">Au tour de</div>
              <div className="flex items-center justify-between gap-3">
                <div className="text-base sm:text-lg font-semibold text-amber-50">
                  {activeItem ? activeItem.displayName : "—"}
                </div>
                <button
                  type="button"
                  onClick={advanceTurn}
                  disabled={!livingItems.length}
                  className={`hidden sm:inline-flex h-11 w-11 rounded-full items-center justify-center border transition focus:outline-none focus:ring-2 focus:ring-amber-400/60 ${
                    livingItems.length
                      ? "border-amber-300/40 bg-amber-500/20 text-amber-50 hover:bg-amber-500/30"
                      : "border-zinc-700 text-zinc-500 cursor-not-allowed"
                  }`}
                >
                  <span className="sr-only">Passer au prochain tour</span>
                  <NextIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* MOBILE LIST */}
        <section className="mt-4 sm:mt-6 sm:hidden">
          <h3 className="text-base font-semibold text-amber-100/90 mb-2">Ordre d’initiative</h3>
          <div id="i_mobile" className="space-y-2">
            {sortedItems.map((it, idx) => (
              <div
                key={it.id}
                className={`relative rounded-2xl border border-amber-300/20 bg-zinc-950/60 p-3 transition-all duration-200 overflow-hidden ${
                  isZeroHp(it)
                    ? "border-rose-400/70 bg-linear-to-br from-rose-950/90 via-rose-900/40 to-transparent ring-2 ring-rose-400/40 shadow-[0_0_30px_rgba(244,63,94,0.35)] animate-pulse"
                    : ""
                } ${isActiveTurn(it) ? "ring-4 ring-amber-300/60 border-amber-300/70 bg-linear-to-br from-amber-500/10 via-transparent to-transparent shadow-[0_0_35px_rgba(212,175,55,0.35)]" : ""}`}
              >
                {isZeroHp(it) && (
                  <div className="absolute inset-0 pointer-events-none bg-linear-to-r from-transparent via-rose-600/10 to-transparent" aria-hidden />
                )}
                {isActiveTurn(it) && (
                  <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.18),transparent)]" aria-hidden />
                )}
                <div className="relative flex items-center justify-between gap-3 mb-1">
                  <div
                    className={`text-sm font-semibold ${
                      isZeroHp(it) ? "text-rose-100 line-through" : isActiveTurn(it) ? "text-amber-50 drop-shadow" : "text-amber-50"
                    }`}
                  >
                    #{idx + 1} — {it.displayName}
                  </div>
                  {isZeroHp(it) && (
                    <span className="text-[11px] font-bold uppercase tracking-widest text-rose-100 bg-rose-600/30 border border-rose-500/60 rounded-full px-2 py-0.5 shadow-sm">
                      KO
                    </span>
                  )}
                  {!isZeroHp(it) && isActiveTurn(it) && (
                    <span className="text-[11px] font-bold uppercase tracking-widest text-amber-900 bg-amber-200 border border-amber-400 rounded-full px-2 py-0.5 shadow-sm">
                      À TOI
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-[13px] py-1">
                  <span className="text-amber-100/75">Jet</span>
                  <span
                    className={`font-medium ${
                      isZeroHp(it) ? "text-rose-100/80" : isActiveTurn(it) ? "text-amber-100" : "text-amber-50"
                    }`}
                  >
                    <DiceText it={it} />
                  </span>
                </div>
                <div className="flex items-center justify-between text-[13px] py-1">
                  <span className="text-amber-100/75">Total</span>
                  <span
                    className={`font-medium ${isZeroHp(it) ? "text-rose-100/80" : isActiveTurn(it) ? "text-amber-100" : "text-amber-50"}`}
                  >
                    {it.total}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[13px] py-1">
                  <span className="text-amber-100/75">PV</span>
                  <span className="font-medium">
                    {it.hpMax != null ? (
                      <button
                        type="button"
                        className={`underline underline-offset-2 decoration-amber-300/40 hover:decoration-amber-300 ${
                          isZeroHp(it) ? "text-rose-200" : isActiveTurn(it) ? "text-amber-100" : "text-amber-50"
                        }`}
                        onClick={() => openHpModal(it.id)}
                      >
                        {Math.max(0, it.hpCur)}/{it.hpMax}
                      </button>
                    ) : it.type === "manual" ? (
                      <button
                        type="button"
                        onClick={() => toggleManualKo(it.id)}
                        className={`px-2 py-1 rounded-lg text-[11px] uppercase tracking-wide border ${
                          isManualKo(it)
                            ? "bg-rose-600/30 border-rose-400 text-rose-100"
                            : "bg-zinc-900/60 border-amber-300/30 text-amber-50"
                        }`}
                      >
                        {isManualKo(it) ? "KO" : "ACTIF"}
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
          <div className={`${cardBase}`}>
            <div className="p-4 border-b border-amber-300/20 flex items-center justify-between bg-linear-to-r from-amber-500/5 to-transparent rounded-t-2xl">
              <h3 className="font-semibold text-amber-100/90">Ordre d’initiative</h3>
              <div className="text-sm text-amber-100/70">Tri décroissant</div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-[800px] w-full text-sm">
                <thead className="bg-zinc-950/60">
                  <tr className="border-b border-amber-300/20">
                    <th className="text-left px-4 py-3 font-semibold text-amber-100/80 w-12">#</th>
                    <th className="text-left px-4 py-3 font-semibold text-amber-100/80">Nom</th>
                    <th className="text-left px-4 py-3 font-semibold text-amber-100/80">Jet</th>
                    <th className="text-left px-4 py-3 font-semibold text-amber-100/80">Total</th>
                    <th className="text-left px-4 py-3 font-semibold text-amber-100/80">PV</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-300/10">
                  {sortedItems.map((it, idx) => (
                    <tr
                      key={it.id}
                      className={`transition-colors ${
                        isZeroHp(it)
                          ? "bg-rose-900/20 text-rose-100/90"
                          : isActiveTurn(it)
                          ? "bg-amber-500/10 text-amber-50 shadow-[0_0_25px_rgba(212,175,55,0.25)]"
                          : "hover:bg-amber-500/5"
                      }`}
                    >
                      <td
                        className={`px-4 py-3 align-top ${
                          isZeroHp(it) ? "text-rose-200/80" : isActiveTurn(it) ? "text-amber-100" : "text-amber-100/70"
                        }`}
                      >
                        {idx + 1}
                      </td>
                      <td
                        className={`px-4 py-3 align-top font-medium ${
                          isZeroHp(it) ? "text-rose-200 line-through" : isActiveTurn(it) ? "text-amber-50 drop-shadow" : "text-amber-50"
                        }`}
                      >
                        {it.displayName}
                      </td>
                      <td
                        className={`px-4 py-3 align-top ${
                          isZeroHp(it) ? "text-rose-100/80" : isActiveTurn(it) ? "text-amber-50" : "text-amber-100/80"
                        }`}
                      >
                        <DiceText it={it} />
                      </td>
                      <td
                        className={`px-4 py-3 align-top font-semibold ${
                          isZeroHp(it) ? "text-rose-100/90" : isActiveTurn(it) ? "text-amber-50" : "text-amber-50"
                        }`}
                      >
                        {it.total}
                      </td>
                      <td className="px-4 py-3 align-top">
                        {it.hpMax != null ? (
                          <button
                            type="button"
                            className={`underline underline-offset-2 decoration-amber-300/40 hover:decoration-amber-300 ${
                              isZeroHp(it) ? "text-rose-200" : isActiveTurn(it) ? "text-amber-100" : "text-amber-50"
                            }`}
                            onClick={() => openHpModal(it.id)}
                          >
                            {Math.max(0, it.hpCur)}/{it.hpMax}
                          </button>
                        ) : it.type === "manual" ? (
                          <button
                            type="button"
                            onClick={() => toggleManualKo(it.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs uppercase tracking-wide border transition ${
                              isManualKo(it)
                                ? "bg-rose-600/20 border-rose-400 text-rose-100"
                                : "bg-zinc-900/60 border-amber-300/30 text-amber-50 hover:border-amber-200/70"
                            }`}
                          >
                            {isManualKo(it) ? "KO" : "Actif"}
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

        <footer className="mt-8 text-center text-[12px] text-amber-100/50">
          <Ornament className="mb-3" />
          <p>Initiative — l&apos;or et l&apos;ombre pour guider les combats.</p>
        </footer>
      </main>

      {/* Sticky mobile bar */}
      <div className="sm:hidden fixed inset-x-0 bottom-0 z-30 border-t border-amber-300/20 bg-zinc-950/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3 grid grid-cols-3 gap-3">
          <button type="button" onClick={() => addGroup(name || "Groupe", Math.max(1, Number(count || 1)), Number(bonus || 0), Math.max(1, Number(hp || 1)))} className="h-12 rounded-xl bg-amber-500/20 text-amber-50 border border-amber-300/30 font-medium">Ajouter</button>
          <button type="button" onClick={() => { if (!manualName || manualTotal === "") { alert("Nom et total manuel requis."); return; } addManual(manualName, Number(manualTotal)); }} className="h-12 rounded-xl border border-amber-300/30 bg-zinc-900/60 text-amber-50 font-medium">Manuel</button>
          <button type="button" onClick={() => resetAll(true)} className="h-12 rounded-xl border border-amber-300/30 bg-zinc-900/60 text-amber-50 font-medium">Reset</button>
        </div>
      </div>

      {/* Floating turn button (mobile) */}
      <div className="sm:hidden fixed bottom-20 right-4 z-40 pointer-events-none">
        <button
          type="button"
          onClick={advanceTurn}
          disabled={!livingItems.length}
          className={`pointer-events-auto h-14 w-14 rounded-full flex items-center justify-center shadow-[0_15px_35px_rgba(0,0,0,0.45)] border transition-all focus:outline-none focus:ring-4 focus:ring-amber-400/40 ${
            livingItems.length
              ? "bg-zinc-950/70 border-amber-200/80 text-amber-100 hover:bg-zinc-900/80"
              : "bg-zinc-800/80 border-zinc-600 text-zinc-500 cursor-not-allowed"
          }`}
          aria-label="Passer au prochain tour"
        >
          <NextIcon className="h-7 w-7" />
        </button>
      </div>

      {/* HP modal */}
      {hpModalOpen && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" onClick={(e) => { if (e.target === e.currentTarget) closeHpModal(); }}>
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative mx-auto mt-24 w-[90%] max-w-md ${cardBase} p-5">
            <h4 className="text-lg font-semibold text-amber-50 mb-1">Modifier les PV</h4>
            <p className="text-sm text-amber-100/75 mb-3">
              {(() => {
                const t = iState.items.find((x) => x.id === hpTargetId);
                return t ? `${t.displayName} — ${Math.max(0, t.hpCur)}/${t.hpMax}` : "";
              })()}
            </p>
            <div className="flex items-center gap-3">
              <input ref={hpInputRef} type="number" inputMode="numeric" value={hpDelta} onChange={(e) => setHpDelta(e.target.value)} className="h-10 w-32 rounded-xl border border-amber-300/30 bg-zinc-900/60 text-amber-50 px-3 focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-300/70" placeholder="Valeur" />
              <div className="flex-1" />
            </div>
            <div className="flex gap-3 mt-4">
              <button type="button" onClick={() => applyHpDelta("dmg")} className="flex-1 h-10 rounded-xl bg-rose-600 text-white font-medium hover:bg-rose-700">Dégâts</button>
              <button type="button" onClick={() => applyHpDelta("heal")} className="flex-1 h-10 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700">Soin</button>
            </div>
            <button type="button" onClick={closeHpModal} className="mt-3 w-full h-10 rounded-xl border border-amber-300/30 bg-zinc-900/60 text-amber-50 font-medium hover:shadow-[0_0_0_2px_rgba(212,175,55,0.2)]">Annuler</button>
          </div>
        </div>
      )}
    </div>
  );
}
