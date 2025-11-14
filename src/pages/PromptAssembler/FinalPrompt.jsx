import { useState } from 'react';
import { cardBase } from './constants';

export default function FinalPrompt({ generatedPrompt, onGenerate, onPromptChange }) {
  const [copyStatus, setCopyStatus] = useState("idle");

  const handleCopy = async () => {
    if (!generatedPrompt.trim()) return;
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopyStatus("success");
      setTimeout(() => setCopyStatus("idle"), 2000);
    } catch {
      setCopyStatus("error");
      setTimeout(() => setCopyStatus("idle"), 2000);
    }
  };

  return (
    <section className="mt-4 sm:mt-6">
      <div className={`${cardBase} p-3 sm:p-5`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
          <h2 className="text-lg font-semibold text-amber-100/90">Prompt final</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onGenerate}
              className="px-4 h-10 rounded-xl bg-gradient-to-b from-amber-500/30 to-amber-600/20 text-amber-50 text-sm font-medium border border-amber-300/40 hover:shadow-[0_0_0_2px_rgba(212,175,55,0.25)]"
            >
              Générer
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="px-4 h-10 rounded-xl border border-amber-300/30 text-sm font-medium bg-zinc-900/60 text-amber-50 hover:shadow-[0_0_0_2px_rgba(212,175,55,0.2)]"
              disabled={!generatedPrompt.trim()}
            >
              Copier
            </button>
          </div>
        </div>
        <textarea
          value={generatedPrompt}
          onChange={(e) => onPromptChange(e.target.value)}
          rows={12}
          className="w-full rounded-xl border border-amber-300/30 bg-zinc-950/60 text-amber-50 px-3 py-2 text-sm"
          placeholder="Le prompt final apparaîtra ici après génération. Vous pouvez le modifier manuellement."
        />
        {copyStatus === "success" && (
          <p className="mt-2 text-xs text-emerald-400">Prompt copié dans le presse-papiers.</p>
        )}
        {copyStatus === "error" && (
          <p className="mt-2 text-xs text-rose-400">
            Impossible de copier automatiquement. Copie manuelle requise.
          </p>
        )}
      </div>
    </section>
  );
}

