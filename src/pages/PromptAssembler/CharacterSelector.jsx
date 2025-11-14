import { useState } from 'react';
import MultiSelect from '../../components/MultiSelect';
import { inputBase } from './constants';

export default function CharacterSelector({
  allCharacters,
  selectedIds,
  onSelectionChange,
  customCharacters,
  onAddCharacter,
  onDeleteCharacter,
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCharacterName, setNewCharacterName] = useState("");
  const [newCharacterDescription, setNewCharacterDescription] = useState("");

  const handleAdd = () => {
    if (!newCharacterName.trim() || !newCharacterDescription.trim()) return;
    onAddCharacter({
      id: `custom_${Date.now()}`,
      name: newCharacterName.trim(),
      defaultDescription: newCharacterDescription.trim(),
    });
    setNewCharacterName("");
    setNewCharacterDescription("");
    setShowAddForm(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-amber-100/90">
        Personnages inclus dans la scène
      </label>
      <MultiSelect
        options={allCharacters.sort((a, b) => a.name.localeCompare(b.name))}
        value={selectedIds}
        onChange={onSelectionChange}
        placeholder="Sélectionne un ou plusieurs personnages"
      />
      <p className="text-xs text-amber-100/60">Astuce : tape pour filtrer, « Tout sélectionner » pour gagner du temps.</p>
      
      {!showAddForm ? (
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="mt-2 px-3 py-1.5 text-sm rounded-lg border border-amber-300/40 bg-zinc-900/60 text-amber-50 hover:shadow-[0_0_0_2px_rgba(212,175,55,0.2)]"
        >
          + Ajouter un personnage personnalisé
        </button>
      ) : (
        <div className="mt-2 p-3 rounded-xl border border-amber-300/20 bg-zinc-950/60 space-y-2">
          <input
            type="text"
            value={newCharacterName}
            onChange={(e) => setNewCharacterName(e.target.value)}
            placeholder="Nom du personnage"
            className={`${inputBase} text-sm`}
          />
          <textarea
            value={newCharacterDescription}
            onChange={(e) => setNewCharacterDescription(e.target.value)}
            placeholder="Description du personnage"
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
                setNewCharacterName("");
                setNewCharacterDescription("");
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

