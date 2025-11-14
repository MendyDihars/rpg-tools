export default function ReferenceImageCheckbox({ checked, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id="reference-image"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded border-amber-300/40 bg-zinc-900 text-amber-400 focus:ring-amber-400/60"
      />
      <label htmlFor="reference-image" className="text-sm font-medium text-amber-100/90 cursor-pointer">
        Y a-t-il une image de référence sur laquelle s&apos;appuyer ?
      </label>
    </div>
  );
}

