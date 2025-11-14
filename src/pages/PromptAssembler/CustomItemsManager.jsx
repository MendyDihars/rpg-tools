import { cardBase } from './constants';

export default function CustomItemsManager({
  customCharacters,
  customLocations,
  onDeleteCharacter,
  onDeleteLocation,
}) {
  if (customCharacters.length === 0 && customLocations.length === 0) {
    return null;
  }

  return (
    <section className="mt-4 sm:mt-6">
      <div className={`${cardBase} p-3 sm:p-5`}>
        <h2 className="text-lg font-semibold text-amber-100/90 mb-3">Éléments personnalisés</h2>
        <div className="space-y-4">
          {customCharacters.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-amber-100/80 mb-2">Personnages personnalisés</h3>
              <div className="space-y-2">
                {customCharacters.map((character) => (
                  <div
                    key={character.id}
                    className="flex items-center justify-between gap-2 p-2 rounded-lg border border-amber-300/20 bg-zinc-950/60"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-amber-50">{character.name}</p>
                      <p className="text-xs text-amber-100/60 line-clamp-1">
                        {character.defaultDescription}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onDeleteCharacter(character.id)}
                      className="px-2 py-1 text-xs font-medium text-rose-400/80 hover:text-rose-300 hover:bg-rose-500/10 rounded border border-rose-400/30 transition-colors"
                      title="Supprimer ce personnage"
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {customLocations.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-amber-100/80 mb-2">Lieux personnalisés</h3>
              <div className="space-y-2">
                {customLocations.map((location) => (
                  <div
                    key={location.id}
                    className="flex items-center justify-between gap-2 p-2 rounded-lg border border-amber-300/20 bg-zinc-950/60"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-amber-50">{location.name}</p>
                      <p className="text-xs text-amber-100/60 line-clamp-1">
                        {location.defaultDescription}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onDeleteLocation(location.id)}
                      className="px-2 py-1 text-xs font-medium text-rose-400/80 hover:text-rose-300 hover:bg-rose-500/10 rounded border border-rose-400/30 transition-colors"
                      title="Supprimer ce lieu"
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

