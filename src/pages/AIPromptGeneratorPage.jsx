import { useEffect, useMemo, useState } from "react";
import PropTypes from 'prop-types';
import Crest from '../components/Crest';
import Ornament from '../components/Ornament';
import MultiSelect from '../components/MultiSelect';

const STORAGE_KEY = "promptAssembler.characters.v1";

const CONTEXT_TEMPLATE =
  "Tout d'abord, cela se passe dans le monde de Dragon Age, 10 ans avant le 5e enclin. Voici la liste des personnages :";

const CONCLUSION_TEMPLATE =
  `Utilise un style semi réaliste, concept art, avec une lumière cinématographique. 

Tu n'as besoin de prendre tout ce que je te dis en compte au niveau du contexte, soit malin avec la description de la scène donnée.`;

const CHARACTERS = [
  {
    id: "alriel",
    name: "Alriel",
    defaultDescription:
      `Il y a Alriel, c'est un elfe de 20 ans aux cheveux noirs, pas court, pas long non plus, jusqu'à la nuque, ondulés, un peu décontracté et ébouriffé. Il est beau, a un visage fin, presque androgyne. Il est causasien. Sa classe est voleur. Ses yeux sont argentés clair, presque blanc, c'est important. Il maquille ses yeux avec un trait d'eyeliner (khol) sous ses yeux. Il est, comme tous les elfes de cet univers, imberbe. Il a une armure noire et rouge avec des éléments de type "tissus" rouges un peu partout qui virevoltent au vent et lui donnant une allure très charismatique (ce n'est pas une cape). Il porte aussi un bracelet noir à chaque bras`,
  },
  {
    id: "anaris",
    name: "Anaris",
    defaultDescription:
      `Il y a la déesse Anaris, une déesse elfique représentant le chaos. Elle a de longs cheveux noirs volumineux et ondulés, elle est très belle, sulfureuse et est habillée principalement de noire et de chaines noires. Elle a les iris rouges.`,
  },
  {
    id: "essek",
    name: "Essek",
    defaultDescription:
      `Il y a Essek, un autre elfe qui ressemble un peu à Alriel et a 18 ans, c'est aussi un voleur. Il a les cheveux longs noirs attaché en queue de cheval haute. Son visage est fin, jeune et androgyne. Il a également deux bracelets, comme Alriel. Il porte également un bijou au bras droit. Il porte une armure de cuir noir avec des plumes de corbeau en guise d'épaulette. Alriel porte aussi une bague sur son auriculaire gauche`,
  },
  {
    id: "kleo",
    name: "Kleo",
    defaultDescription:
      `Il y a une femme humaine du nom de Kleo. Elle a une vingtaine d’années. C’est une mage. Elle a de long cheveux blonds dorés et des yeux verts émeraude. Elle a des lèvres roses pulpeuses et un visage magnifique. Elle est habillée élégamment  avec des couleurs sombres. Le col de sa robe remonte sur sa nuque élégante. Elle porte un collier avec un pendentif en forme de croissant de lune entourant un soleil.`,
  },
  {
    id: "elisen",
    name: "Elisen",
    defaultDescription:
      `Il y a Elisen, une femme elfe mage habillée en armure de cuir légère complètement noir. Elisen est blonde, les cheveux joliment désordonné en carré jusqu'au menton. Elle est très jolie et a une vingtaine d'année. Elle est caucasienne. Elle a une allure presque maternelle.`
  },
  {
    id: "eris",
    name: "Eris",
    defaultDescription:
      `Il y a Eris, une voleuse demi-elfe (petites oreilles pointus), elle a de longs cheveux noirs. Elle a des yeux en amande. Elle est très belle. Elle a une tenue de cuir noir. Elle est caucasienne. Elle a une vingtaine d'année.`
  },
  {
    id: "nomaris",
    name: "Nomaris",
    defaultDescription:
      `Il y un elfe guerrier aux cheveux blancs nommé Nomaris. Ses cheveux sont en partie attachés vers l'arrière et le reste tombe dans son dos et ses épaules. Nomaris a une armure lourde couleur émeraude usé mais jolie. Nomaris a la peau mat et des tatouages elfiques sur le visage. L'elfe semble avoir une vingtaine d'année, il est beau et n'est pas vieux. Il n'a ni barbe, ni moustache, comme tous les elfes, il est imberbe.`
  },
  {
    id: "evalia",
    name: "Evalia",
    defaultDescription:
      `Une autre elfe également, elle s'appelle Evalia, elle a de longs cheveux bruns ondulés. Elle est magnifique. Elle a 18 ans aussi donc elle est jeune. Des lèvres pulpeuses, un petit nez et des yeux en amande. Elle est métisse, plus foncée que caucasienne. Elle est habillée d'une armure légère de cuir.`,
  },
  {
    id: "firis",
    name: "Firis",
    defaultDescription:
      `Une autre elfe encore, Firis a les cheveux auburn avec des reflets rouge coupés en carré court qui arrive au menton. Une fine tresse de cheveux plus longs tombe sur son épaule droite. Firis est belle et espiègle. Ses yeux sont malicieux. Firis est sulfureuse et magnifique`,
  },
  {
    id: "vel",
    name: "Vel",
    defaultDescription:
      `Il y a un humain mage d'une vingtaine d'année nommé Vel. Vel est légèrement mat de peau. Vel a les cheveux bruns bien coiffés vers l'arrière. Il a une barbe proprement taillés. Vel est habillé d'une robe élégante violette et rouge. Vel a une visage doux, il est beau. `
  },
  {
    id: "lenaya",
    name: "Lenaya",
    defaultDescription:
      `Il y a une elfe adolescente (15 ans) qui se nomme Lenaya. Lenaya est un peu plus petite qu'Alriel. Lenaya a des cheveux blonds en carrés jusqu'au menton, elle a un air espiègle mais elle est très jolie. Lenaya porte une armure de cuir légère.`,
  },
  {
    id: "nesira",
    name: "Nesira",
    defaultDescription:
      `Il y a une femme elfe nommée Nesira. Nesira est mat de peau. Elle a les cheveux bruns foncés jusqu'au nez désordonné et légèrement ondulé. Nesira est très jolie, elle a un visage fin, un petit nez et un sourire espiègle. Nesira est habillé de vêtements amples, un peu comme une voyante, aux teints bleus et verts`,
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

// --- THEME HELPERS (dark + gold) ---
const cardBase =
  "rounded-2xl border border-amber-300/20 bg-[radial-gradient(1200px_400px_at_50%_-20%,rgba(212,175,55,0.06),transparent),linear-gradient(to_bottom_right,rgba(255,255,255,0.02),rgba(0,0,0,0.2))] shadow-[0_10px_40px_rgba(0,0,0,0.35)]";
const inputBase =
  "w-full rounded-xl border border-amber-400/30 bg-zinc-900/60 text-amber-50 px-3 py-2 placeholder:text-amber-100/30 focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-300/70 backdrop-blur-sm";

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

  const updateCharacterDescription = (id, value) => {
    setCustomDescriptions((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleGenerate = () => {
    const sections = [];

    if (CONTEXT_TEMPLATE.trim()) {
      sections.push(`${CONTEXT_TEMPLATE.trim()}`);
    }

    if (selectedCharacters.length > 0) {
      const characterLines = selectedCharacters
        .map((character) => `- ${character.name} : ${effectiveDescriptions[character.id].trim()}`)
        .join("\n\n");
      sections.push(`${characterLines}`);
    }

    if (promptBody.trim()) {
      sections.push(`Voici l'image à générer : ${promptBody.trim()}`);
    }

    if (CONCLUSION_TEMPLATE.trim()) {
      sections.push(`${CONCLUSION_TEMPLATE.trim()}`);
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
              <div className="flex flex-col gap-2">
                <label htmlFor="prompt-free-text" className="text-sm font-medium text-amber-100/90">
                  Partie libre du prompt
                </label>
                <textarea
                  id="prompt-free-text"
                  value={promptBody}
                  onChange={(event) => setPromptBody(event.target.value)}
                  rows={6}
                  className={`${inputBase} resize-y`}
                  placeholder="Décris ici les objectifs, les contraintes ou les éléments spécifiques de la scène."
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-amber-100/90">
                  Personnages inclus dans la scène
                </label>
                {/* New MultiSelect */}
                <MultiSelect
                  options={CHARACTERS.sort((a, b) => a.name.localeCompare(b.name))}
                  value={selectedIds}
                  onChange={setSelectedIds}
                  placeholder="Sélectionne un ou plusieurs personnages"
                />
                <p className="text-xs text-amber-100/60">Astuce : tape pour filtrer, « Tout sélectionner » pour gagner du temps.</p>
              </div>
            </div>
          </div>

          <div className={`${cardBase} p-3 sm:p-5`}>
            <h2 className="text-lg font-semibold text-amber-100/90 mb-3">Descriptions actives</h2>
            {selectedCharacters.length === 0 ? (
              <p className="text-sm text-amber-100/70">
                Sélectionne un ou plusieurs personnages pour personnaliser leur description.
              </p>
            ) : (
              <div className="space-y-4">
                {selectedCharacters.map((character) => (
                  <div key={character.id} className="rounded-xl border border-amber-300/20 bg-zinc-950/60 p-3">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="font-medium text-amber-50">{character.name}</h3>
                      <button
                        type="button"
                        onClick={() => updateCharacterDescription(character.id, character.defaultDescription)}
                        className="text-xs font-medium text-amber-100/80 hover:text-amber-50"
                      >
                        Réinitialiser
                      </button>
                    </div>
                    <textarea
                      value={effectiveDescriptions[character.id]}
                      onChange={(event) => updateCharacterDescription(character.id, event.target.value)}
                      rows={4}
                      className={`${inputBase} resize-y`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="mt-4 sm:mt-6">
          <div className={`${cardBase} p-3 sm:p-5`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
              <h2 className="text-lg font-semibold text-amber-100/90">Prompt final</h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleGenerate}
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
              onChange={() => {}}
              readOnly
              rows={12}
              className="w-full rounded-xl border border-amber-300/30 bg-zinc-950/60 text-amber-50 px-3 py-2 text-sm"
              placeholder="Le prompt final apparaîtra ici après génération."
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
      </main>
    </div>
  );
}


AIPromptGeneratorPage.propTypes = {
  children: PropTypes.node.isRequired,
};