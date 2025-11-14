import { inputBase } from './constants';

export default function PromptBodyInput({ value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label htmlFor="prompt-free-text" className="text-sm font-medium text-amber-100/90">
          Partie libre du prompt
        </label>
        {value.trim() && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs font-medium text-amber-100/80 hover:text-amber-50"
          >
            Effacer
          </button>
        )}
      </div>
      <textarea
        id="prompt-free-text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={6}
        className={`${inputBase} resize-y`}
        placeholder="Décris ici les objectifs, les contraintes ou les éléments spécifiques de la scène."
      />
    </div>
  );
}

