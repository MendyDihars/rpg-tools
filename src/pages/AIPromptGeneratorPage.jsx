import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "promptAssembler.characters.v1";

const CONTEXT_TEMPLATE =
  "Tu écris une scène narrative pour un jeu de rôle papier. Adopte un ton immersif, clair et dynamique, " +
  "en veillant à toujours laisser de la place aux décisions des joueurs.";

const CONCLUSION_TEMPLATE =
  "Termine par une ouverture qui invite les joueurs à agir et souligne les enjeux immédiats.";

const CHARACTERS = [
  {
    id: "soren",
    name: "Soren l'alchimiste",
    defaultDescription:
      "Un érudit taciturne, spécialiste des essences rares. Il cherche à prouver que la science peut rivaliser avec la magie.",
  },
  {
    id: "maeva",
    name: "Maëva la pisteuse",
    defaultDescription:
      "Rôdeuse agile au passé militaire. Son instinct protecteur la pousse à sécuriser le groupe avant toute chose.",
  },
  {
    id: "ildor",
    name: "Ildor des flammes",
    defaultDescription:
      "Demi-elfe incandescent dont le pouvoir pyromantique est instable. Il lutte pour garder son sang-froid.",
  },
  {
    id: "nell",
    name: "Nell l'ombre",
    defaultDescription:
      "Espionne repentie, experte en déguisements. Elle se méfie de l'autorité et agit par pragmatisme.",
  },
  {
    id: "brom",
    name: "Brom Forge-Verdure",
    defaultDescription:
      "Forgeron nain passé maître en créations vivantes de métal et de bois. Son humour bourru cache une grande empathie.",
  },
];

function readStoredDescriptions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && parsed.descriptions) {
      return parsed.descriptions;
    }
  } catch {
    // ignore malformed storage
  }
  return {};
}

function writeStoredDescriptions(descriptions) {
  try {
    const payload = { descriptions, ts: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore quota / privacy errors
  }
}

export default function AIPromptGeneratorPage() {
  const [promptBody, setPromptBody] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [customDescriptions, setCustomDescriptions] = useState({});
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [copyStatus, setCopyStatus] = useState("idle");

  useEffect(() => {
    const stored = readStoredDescriptions();
    if (stored && typeof stored === "object") {
      setCustomDescriptions(stored);
    }
  }, []);

  useEffect(() => {
    writeStoredDescriptions(customDescriptions);
  }, [customDescriptions]);

  const selectedCharacters = useMemo(
    () => CHARACTERS.filter((c) => selectedIds.includes(c.id)),
    [selectedIds]
  );

  const effectiveDescriptions = useMemo(() => {
    const map = {};
    CHARACTERS.forEach((character) => {
      map[character.id] = customDescriptions[character.id] ?? character.defaultDescription;
    });
    return map;
  }, [customDescriptions]);

  const handleSelectionChange = (event) => {
    const values = Array.from(event.target.selectedOptions).map((opt) => opt.value);
    setSelectedIds(values);
  };

  const updateCharacterDescription = (id, value) => {
    setCustomDescriptions((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleGenerate = () => {
    const sections = [];

    if (CONTEXT_TEMPLATE.trim()) {
      sections.push(`Contexte:\n${CONTEXT_TEMPLATE.trim()}`);
    }

    if (selectedCharacters.length > 0) {
      const characterLines = selectedCharacters
        .map((character) => `- ${character.name}: ${effectiveDescriptions[character.id].trim()}`)
        .join("\n");
      sections.push(`Personnages:\n${characterLines}`);
    }

    if (promptBody.trim()) {
      sections.push(`Consignes:\n${promptBody.trim()}`);
    }

    if (CONCLUSION_TEMPLATE.trim()) {
      sections.push(`Conclusion:\n${CONCLUSION_TEMPLATE.trim()}`);
    }

    setGeneratedPrompt(sections.join("\n\n"));
    setCopyStatus("idle");
  };

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
    <div className="max-w-6xl mx-auto px-4 pb-20 pt-4 sm:pt-6">
      <section className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-[1.2fr,1fr]">
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-3 sm:p-5">
          <h2 className="text-lg font-semibold mb-3">Assembler le prompt</h2>
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="prompt-free-text" className="text-sm font-medium text-slate-700">
                Partie libre du prompt
              </label>
              <textarea
                id="prompt-free-text"
                value={promptBody}
                onChange={(event) => setPromptBody(event.target.value)}
                rows={6}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm resize-y
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Décris ici les objectifs, les contraintes ou les éléments spécifiques de la scène."
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="prompt-characters" className="text-sm font-medium text-slate-700">
                Personnages inclus dans la scène
              </label>
              <select
                id="prompt-characters"
                multiple
                value={selectedIds}
                onChange={handleSelectionChange}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm h-40
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                {CHARACTERS.map((character) => (
                  <option key={character.id} value={character.id}>
                    {character.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500">
                Maintiens Ctrl (Windows/Linux) ou ⌘ (macOS) pour sélectionner plusieurs personnages.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-3 sm:p-5">
          <h2 className="text-lg font-semibold mb-3">Descriptions actives</h2>
          {selectedCharacters.length === 0 ? (
            <p className="text-sm text-slate-500">
              Sélectionne un ou plusieurs personnages pour personnaliser leur description.
            </p>
          ) : (
            <div className="space-y-4">
              {selectedCharacters.map((character) => (
                <div key={character.id} className="rounded-xl border border-slate-200 p-3">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="font-medium text-slate-800">{character.name}</h3>
                    <button
                      type="button"
                      onClick={() =>
                        updateCharacterDescription(character.id, character.defaultDescription)
                      }
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                    >
                      Réinitialiser
                    </button>
                  </div>
                  <textarea
                    value={effectiveDescriptions[character.id]}
                    onChange={(event) =>
                      updateCharacterDescription(character.id, event.target.value)
                    }
                    rows={4}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm resize-y
                               focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mt-4 sm:mt-6">
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-3 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
            <h2 className="text-lg font-semibold">Prompt final</h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleGenerate}
                className="px-4 h-10 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                Générer
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="px-4 h-10 rounded-lg border border-slate-300 text-sm font-medium bg-white hover:bg-slate-50 transition-colors"
                disabled={!generatedPrompt.trim()}
              >
                Copier
              </button>
            </div>
          </div>
          <textarea
            value={generatedPrompt}
            onChange={() => {}}
            readOnly
            rows={12}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-slate-50 text-slate-800
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Le prompt final apparaîtra ici après génération."
          />
          {copyStatus === "success" && (
            <p className="mt-2 text-xs text-emerald-600">Prompt copié dans le presse-papiers.</p>
          )}
          {copyStatus === "error" && (
            <p className="mt-2 text-xs text-rose-600">
              Impossible de copier automatiquement. Copie manuelle requise.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

