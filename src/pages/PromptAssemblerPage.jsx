import Crest from '../components/Crest';
import Ornament from '../components/Ornament';
import { cardBase } from './PromptAssembler/constants';
import { usePromptAssembler } from './PromptAssembler/usePromptAssembler';
import PromptBodyInput from './PromptAssembler/PromptBodyInput';
import LocationSelector from './PromptAssembler/LocationSelector';
import CharacterSelector from './PromptAssembler/CharacterSelector';
import WeatherSelector from './PromptAssembler/WeatherSelector';
import ReferenceImageCheckbox from './PromptAssembler/ReferenceImageCheckbox';
import ActiveDescriptions from './PromptAssembler/ActiveDescriptions';
import CustomItemsManager from './PromptAssembler/CustomItemsManager';
import FinalPrompt from './PromptAssembler/FinalPrompt';

export default function PromptAssemblerPage() {
  const {
    promptBody,
    selectedIds,
    generatedPrompt,
    selectedLocation,
    locationDescriptions,
    selectedWeather,
    hasReferenceImage,
    customCharacters,
    customLocations,
    allCharacters,
    allLocations,
    selectedCharacters,
    effectiveDescriptions,
    setPromptBody,
    setSelectedIds,
    setGeneratedPrompt,
    setSelectedLocation,
    setSelectedWeather,
    setHasReferenceImage,
    updateCharacterDescription,
    resetCharacterDescription,
    handleAddCustomCharacter,
    handleDeleteCustomCharacter,
    handleAddCustomLocation,
    handleDeleteCustomLocation,
    updateLocationDescription,
    handleGenerate,
  } = usePromptAssembler();

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
            <h1 className="text-2xl sm:text-3xl font-serif tracking-wide drop-shadow-[0_2px_10px_rgba(212,175,55,0.25)]">Assembleur de prompt</h1>
            <p className="text-amber-100/70 text-sm">Compose une scène avec panache ✨</p>
          </div>
        </div>
        <Ornament className="mt-5" />
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-24 relative">
        <section className="grid gap-4 grid-cols-1 lg:grid-cols-[1.2fr,1fr]">
          <div className={`${cardBase} p-3 sm:p-5`}>
            <h2 className="text-lg font-semibold text-amber-100/90 mb-3">Assembler le prompt</h2>
            <div className="space-y-4">
              <PromptBodyInput value={promptBody} onChange={setPromptBody} />

              <LocationSelector
                allLocations={allLocations}
                selectedLocation={selectedLocation}
                onLocationChange={setSelectedLocation}
                locationDescriptions={locationDescriptions}
                onLocationDescriptionChange={updateLocationDescription}
                customLocations={customLocations}
                onAddLocation={handleAddCustomLocation}
                onDeleteLocation={handleDeleteCustomLocation}
              />

              <CharacterSelector
                allCharacters={allCharacters}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
                customCharacters={customCharacters}
                onAddCharacter={handleAddCustomCharacter}
                onDeleteCharacter={handleDeleteCustomCharacter}
              />

              <WeatherSelector
                selectedWeather={selectedWeather}
                onChange={setSelectedWeather}
              />

              <ReferenceImageCheckbox
                checked={hasReferenceImage}
                onChange={setHasReferenceImage}
              />
            </div>
          </div>

          <div className={`${cardBase} p-3 sm:p-5`}>
            <h2 className="text-lg font-semibold text-amber-100/90 mb-3">Descriptions actives</h2>
            <ActiveDescriptions
              selectedCharacters={selectedCharacters}
              effectiveDescriptions={effectiveDescriptions}
              customCharacters={customCharacters}
              onUpdateDescription={updateCharacterDescription}
              onResetDescription={resetCharacterDescription}
              onDeleteCharacter={handleDeleteCustomCharacter}
            />
          </div>
        </section>

        <CustomItemsManager
          customCharacters={customCharacters}
          customLocations={customLocations}
          onDeleteCharacter={handleDeleteCustomCharacter}
          onDeleteLocation={handleDeleteCustomLocation}
        />

        <FinalPrompt
          generatedPrompt={generatedPrompt}
          onGenerate={handleGenerate}
          onPromptChange={setGeneratedPrompt}
        />
      </main>
    </div>
  );
}

