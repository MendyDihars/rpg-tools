import { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from 'prop-types';

function Chip({ children, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-amber-500/10 text-amber-100/90 ring-1 ring-amber-300/20">
      {children}
      {onRemove && (
        <button onClick={onRemove} className="ml-1 hover:opacity-80" aria-label="Retirer">
          ×
        </button>
      )}
    </span>
  );
}

export default function MultiSelect({ options, value, onChange, placeholder = "Choisir…" }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);

  const toggle = () => setOpen((v) => !v);
  const close = () => setOpen(false);

  useEffect(() => {
    function onDocClick(e) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) close();
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.name.toLowerCase().includes(q));
  }, [options, query]);

  const selectedSet = useMemo(() => new Set(value), [value]);

  const onToggle = (id) => {
    const set = new Set(value);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    onChange(Array.from(set));
  };

  const selectAll = () => onChange(options.map((o) => o.id));
  const clearAll = () => onChange([]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        className="w-full text-left rounded-xl border border-amber-400/30 bg-zinc-900/60 text-amber-50 px-3 py-2 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60"
        onClick={toggle}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <div className="flex flex-wrap items-center gap-2 min-h-[1.75rem]">
          {value.length === 0 && (
            <span className="text-amber-100/50">{placeholder}</span>
          )}
          {value.length > 0 && (
            <>
              {value.slice(0, 3).map((id) => {
                const opt = options.find((o) => o.id === id);
                if (!opt) return null;
                return (
                  <Chip key={id} onRemove={(e) => { e.stopPropagation(); onToggle(id); }}>
                    {opt.name}
                  </Chip>
                );
              })}
              {value.length > 3 && (
                <Chip>{`+${value.length - 3}`}</Chip>
              )}
            </>
          )}
        </div>
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full max-h-[320px] overflow-hidden rounded-xl border border-amber-300/30 bg-zinc-950/90 backdrop-blur shadow-2xl">
          <div className="p-2 border-b border-amber-300/20">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher…"
              className="w-full h-9 rounded-lg border border-amber-400/30 bg-zinc-900/60 text-amber-50 px-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400/60"
            />
            <div className="mt-2 flex items-center gap-2 text-[12px] text-amber-100/70">
              <button type="button" className="px-2 py-1 rounded-lg border border-amber-300/30 hover:shadow-[0_0_0_2px_rgba(212,175,55,0.2)]" onClick={selectAll}>Tout sélectionner</button>
              <button type="button" className="px-2 py-1 rounded-lg border border-amber-300/30 hover:shadow-[0_0_0_2px_rgba(212,175,55,0.2)]" onClick={clearAll}>Effacer</button>
            </div>
          </div>

          <ul role="listbox" className="max-h-[220px] overflow-auto p-2 space-y-1">
            {filtered.length === 0 && (
              <li className="text-amber-100/70 text-sm px-2 py-1">Aucun résultat</li>
            )}
            {filtered.map((opt) => {
              const checked = selectedSet.has(opt.id);
              return (
                <li key={opt.id} role="option" aria-selected={checked}>
                  <label className="group flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-amber-500/10">
                    <input
                      type="checkbox"
                      className="rounded border-amber-300/40 bg-zinc-900 text-amber-400 focus:ring-amber-400/60"
                      checked={checked}
                      onChange={() => onToggle(opt.id)}
                    />
                    <span className="text-amber-50 text-sm">{opt.name}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

Chip.propTypes = {
  children: PropTypes.node.isRequired,
  onRemove: PropTypes.func,
};

MultiSelect.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};