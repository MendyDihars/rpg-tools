import { inputBase } from './constants';

export default function ActiveDescriptions({
  selectedCharacters,
  effectiveDescriptions,
  customCharacters,
  onUpdateDescription,
  onResetDescription,
  onDeleteCharacter,
}) {
  if (selectedCharacters.length === 0) {
    return (
      <p className="text-sm text-amber-100/70">
        Sélectionne un ou plusieurs personnages pour personnaliser leur description.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {selectedCharacters.map((character) => {
        const isCustom = customCharacters.some((c) => c.id === character.id);
        return (
          <div key={character.id} className="rounded-xl border border-amber-300/20 bg-zinc-950/60 p-3">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-amber-50">{character.name}</h3>
                {isCustom && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-300/30">
                    Personnalisé
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {isCustom && (
                  <button
                    type="button"
                    onClick={() => onDeleteCharacter(character.id)}
                    className="text-xs font-medium text-rose-400/80 hover:text-rose-300"
                    title="Supprimer ce personnage"
                  >
                    Supprimer
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onResetDescription(character.id, character.defaultDescription)}
                  className="text-xs font-medium text-amber-100/80 hover:text-amber-50"
                >
                  Réinitialiser
                </button>
              </div>
            </div>
            <textarea
              value={effectiveDescriptions[character.id]}
              onChange={(event) => onUpdateDescription(character.id, event.target.value)}
              rows={4}
              className={`${inputBase} resize-y`}
            />
          </div>
        );
      })}
    </div>
  );
}

