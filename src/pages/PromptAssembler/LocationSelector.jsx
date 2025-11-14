import { useState } from 'react';
import { inputBase } from './constants';

export default function LocationSelector({
  allLocations,
  selectedLocation,
  onLocationChange,
  locationDescriptions,
  onLocationDescriptionChange,
  customLocations,
  onAddLocation,
  onDeleteLocation,
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLocationName, setNewLocationName] = useState("");
  const [newLocationDescription, setNewLocationDescription] = useState("");

  const selectedLocationObj = allLocations.find((l) => l.id === selectedLocation);
  const isCustom = customLocations.some((l) => l.id === selectedLocation);

  const handleAdd = () => {
    if (!newLocationName.trim() || !newLocationDescription.trim()) return;
    onAddLocation({
      id: `custom_location_${Date.now()}`,
      name: newLocationName.trim(),
      defaultDescription: newLocationDescription.trim(),
    });
    setNewLocationName("");
    setNewLocationDescription("");
    setShowAddForm(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="location-select" className="text-sm font-medium text-amber-100/90">
        Lieu de la scène
      </label>
      <select
        id="location-select"
        value={selectedLocation}
        onChange={(e) => onLocationChange(e.target.value)}
        className={inputBase}
      >
        <option value="">Aucun lieu sélectionné</option>
        {allLocations.map((location) => (
          <option key={location.id} value={location.id}>
            {location.name}
          </option>
        ))}
      </select>
      {selectedLocation && selectedLocationObj && (
        <div className="mt-2 p-3 rounded-xl border border-amber-300/20 bg-zinc-950/60">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <label htmlFor="location-description" className="text-sm font-medium text-amber-100/90">
                Description du lieu
              </label>
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
                  onClick={() => onDeleteLocation(selectedLocation)}
                  className="text-xs font-medium text-rose-400/80 hover:text-rose-300"
                  title="Supprimer ce lieu"
                >
                  Supprimer
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  onLocationDescriptionChange(selectedLocation, undefined);
                }}
                className="text-xs font-medium text-amber-100/80 hover:text-amber-50"
              >
                Réinitialiser
              </button>
            </div>
          </div>
          <textarea
            id="location-description"
            value={locationDescriptions[selectedLocation] ?? selectedLocationObj.defaultDescription ?? ""}
            onChange={(e) => onLocationDescriptionChange(selectedLocation, e.target.value)}
            rows={3}
            className={`${inputBase} resize-y text-sm`}
            placeholder="Décris le lieu de la scène"
          />
        </div>
      )}
      {!showAddForm ? (
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="mt-2 px-3 py-1.5 text-sm rounded-lg border border-amber-300/40 bg-zinc-900/60 text-amber-50 hover:shadow-[0_0_0_2px_rgba(212,175,55,0.2)]"
        >
          + Ajouter un lieu personnalisé
        </button>
      ) : (
        <div className="mt-2 p-3 rounded-xl border border-amber-300/20 bg-zinc-950/60 space-y-2">
          <input
            type="text"
            value={newLocationName}
            onChange={(e) => setNewLocationName(e.target.value)}
            placeholder="Nom du lieu"
            className={`${inputBase} text-sm`}
          />
          <textarea
            value={newLocationDescription}
            onChange={(e) => setNewLocationDescription(e.target.value)}
            placeholder="Description du lieu"
            rows={3}
            className={`${inputBase} resize-y text-sm`}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAdd}
              className="px-3 py-1.5 text-sm rounded-lg border border-amber-300/40 bg-amber-500/20 text-amber-50 hover:shadow-[0_0_0_2px_rgba(212,175,55,0.2)]"
            >
              Ajouter
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setNewLocationName("");
                setNewLocationDescription("");
              }}
              className="px-3 py-1.5 text-sm rounded-lg border border-amber-300/40 bg-zinc-900/60 text-amber-50 hover:shadow-[0_0_0_2px_rgba(212,175,55,0.2)]"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

