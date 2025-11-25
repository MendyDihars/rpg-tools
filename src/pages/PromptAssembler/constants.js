export const STORAGE_KEY = "promptAssembler.config.v3";

export const CONTEXT_TEMPLATE =
  "Tout d'abord, cela se passe dans le monde de Dragon Age, 10 ans avant le 5e enclin. Voici la liste des personnages :";

export const CONCLUSION_TEMPLATE =
  `Utilise un style semi réaliste, concept art, avec une lumière cinématographique. 

Tu n'as besoin de prendre tout ce que je te dis en compte au niveau du contexte, soit malin avec la description de la scène donnée.`;

export const CHARACTERS = [
  {
    id: "alriel",
    name: "Alriel",
    defaultDescription:
      `Il y a Alriel, c'est un elfe de 20 ans aux cheveux noirs, pas court, pas long non plus, jusqu'à la nuque, ondulés, un peu décontracté et ébouriffé. Il est beau, a un visage fin, presque androgyne. Il est causasien. Sa classe est voleur. Ses yeux sont argentés clair, presque blanc, c'est important. Il maquille ses yeux avec un trait d'eyeliner (khol) sous ses yeux. Il est, comme tous les elfes de cet univers, imberbe. Il a une armure noire et rouge avec des éléments de type "tissus" rouges un peu partout qui virevoltent au vent et lui donnant une allure très charismatique (ce n'est pas une cape). Alriel porte un bracelet noir à chaque bras. Alriel porte aussi une bague sur son auriculaire gauche`,
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
      `Il y a Essek, un autre elfe de 18 ans, c'est aussi un voleur. Essek a les cheveux longs noirs attaché en queue de cheval haute. Son visage est fin, jeune et androgyne. Essek a également deux bracelets. Essek porte également un bijou au bras droit. Il porte une armure de cuir noir avec des plumes de corbeau en guise d'épaulette. Essek porte une bague sur l'anulaire gauche`,
  },
  {
    id: "kleo",
    name: "Kleo",
    defaultDescription:
      `Il y a une femme humaine du nom de Kleo. Elle a une vingtaine d'années. C'est une mage. Elle a de long cheveux blonds dorés et des yeux verts émeraude. Elle a des lèvres roses pulpeuses et un visage magnifique. Elle est habillée élégamment  avec des couleurs sombres. Le col de sa robe remonte sur sa nuque élégante. Elle porte un collier avec un pendentif en forme de croissant de lune entourant un soleil.`,
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
      `Il y un elfe guerrier aux cheveux blancs nommé Nomaris. Ses cheveux sont mi long, en partie attachés en demi queue de cheval vers l'arrière et le reste tombe sur ses épaules. Nomaris a une armure lourde couleur émeraude usé mais jolie. Nomaris a la peau mat et des tatouages elfiques sur le visage. L'elfe semble avoir une vingtaine d'année, il est beau et n'est pas vieux. Nomaris n'a ni barbe, ni moustache, comme tous les elfes, il est imberbe. Nomaris est musclé.`
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
  {
    id: "mael",
    name: "Mael",
    defaultDescription:
      `Il y a un mage nécromancien humain. Mael est habillé d'une robe noir. Mael a de longs cheveux blancs. Mael a également un bouc et une moustache blanche. Mael a de beaux yeux bleus. Attention, Mael est jeune et beau malgré sa pilosité blanche. Mael n'a que 25 ans.`
  },
  {
    id: "tendaji",
    name: "Tendaji",
    defaultDescription:
      `Il y a un humain voleur. Tendaji est habillé d'une armure de cuir légère dans des tons vert et bleu. Tendaji est afro, avec des dreads partant sur le côté de la tête. Tendaji a une légère moustache et un léger bouc. Tendaji a 23 ans.`,
  },
  {
    id: "camilia",
    name: "Camilia",
    defaultDescription:
      `Il y a une femme humaine. Camilia est rousse, cheveux long et volumineux, une partie de ses cheveux cache un peu une partie de son visage (on voit quand même ses yeux. Camilia est belle, peau assez blanche. Camilia est habillée de façon élégante, en rouge et noir principalement`,
  },
  {
    id: "reno",
    name: "Reno",
    defaultDescription: "Reno est un demi-elfe avec une barbe de trois jours, Reno est assez beau avec des cheveux bruns ondulés jusqu'aux oreilles. Reno porte une tenue de cuir légère. Reno porte une ceinture d'outil de bricolage.",
  },
  {
    id: "milva",
    name: "Milva",
    defaultDescription: "C'est une elfe voleuse. Milva a les cheveux noirs jusqu'au menton. Milva est typé un peu asiatique (plutôt coréenne), Milva est assez jolie et a un côté un peu timide. Elle est habillé d'une tenue légère de cuir de voleuse.",
  },
  {
    id: "felassan",
    name: "Felassan",
    defaultDescription: "Felassan est un homme elfe, grand et élancé. Felassan a de longs cheveux bruns ondulés ornés de petites tresses, de perles de bois et de plumes blanches. Felassan a des oreilles pointues et les yeux verts. Felassan a le teint mat hâlé. Felassan a de délicats tatouages faciaux en forme de branches d'arbre autour des yeux et sur le menton. Felassan est vêtu de plusieurs couche de vêtements dans des tons naturels vert et brun. Felassan a une esthétique druidique élégante, en harmonie avec la nature.",
  },
  {
    id: "solas",
    name: "Solas",
    defaultDescription: "Un autre elfe du nom de Solas. C’est le dieu elfique de la ruse. Solas est souvent représenté par un loup. C’est un elfe assez grand (175cm). Solas est imberbe. Sa peau est claire. Solas a le visage fin et les traits altiers. Ses yeux sont gris clair. Solas a de longues dreadlocks brunes attachées entre elles en arrière dans sa nuque. Les côtés de son crâne sont rasés. Solas a sur la tête (au-dessus du front), maintenu par ses dreadlocks, le haut du squelette d’un crâne de loup. Solas porte des vêtements simples de voyageurs de couleur neutre. Solas a autour de son cou une amulette en forme de mâchoire inférieure de loup. Pour Solas, tu peux t’inspirer des concepts arts de Solas dans Dragon Age Inquisition ou de son apparence dans les flashbacks de Dragon Age Veilguard."
  },
  {
    id: "arras",
    name: "Arras",
    defaultDescription: "Un elfe du nom d’Arras. Arras est jeune avec les traits fins, longs, androgyne et anguleux. Arras a les cheveux longs (qui tombent sur ses épaules) bruns avec des reflets roux. Arras a les yeux bleus. Arras porte des vêtements simples de couleur bruns.";
  },
  {
    id: "hildis",
    name: "Hildis",
    defaultDescription: "Une femme assez grande du nom de Hildis. C'est une guerrière très belle et musclée. Hildis a de longs cheveux roux ondulés et des yeux gris. Hildis a un visage d’irlandaise avec un joli port de tête. Hildis porte une armure en métal et un tabard dans les tons bruns."
  },
  {
    id: "alran",
    name: "Alran",
    defaultDescription: "Un elfe du nom de Alran. C’est un adolescent, il a seize ans. Alran est beau et élancé, c’est un danseur. Alran a les yeux bleus et un visage doux. Alran a les cheveux blonds attachés en chignon. Alran porte des vetements simple de couleur neutre (lin et beige).",
  },
  {
    id: "sareth",
    name: "Sareth",
    defaultDescription: "Un qunari (géant avec la peau grise, des oreilles pointues et des cornes qui partent du front) du nom de Sareth. Sareth a un visage carré et un air dur. Sareth a les cheveux noirs mi long coiffé en arrière et des yeux bruns. Sareth porte une armure. Sareth est un guerrier.",
  },
  {
    id: "sian",
    name: "Sian",
    defaultDescription: "Une jeune femme du nom de Sian. Sian ressemble à Àstrid Bergès-Frisbey, ses cheveux bruns sont attachés en chignon de ballerine. Sian a un physique de danseuse étoile et un magnifique port de tête. Sian porte une robe blanche courte et fluide prêt du corps. Sian a les yeux verts.",
  },
  {
    id: "hawke",
    name: "Hawke",
    defaultDescription: "Un garçon humain du nom de Hawke. Hawke a 18 ans. Hawke a les cheveux noirs, courts et en bataille. Hawke a les yeux bleus foncés. Hawke a une barbe de trois jours. Hawke est grand (1m80) et bien bâti. Hawke porte des vêtements simples dans les tons bruns. Hawke ressemble à Hawke dans le trailer de Dragon Age 2.",
  },
  {
    id: "elandrin",
    name: "Elandrin",
    defaultDescription: "Un elfe du nom de Elandrin. Elandrin est jeune, Elandrin a 20 ans. Elandrin a la peau clair et le visage fin et androgyne. Elandrin a les cheveux blonds et mi-longs (aux épaules). Elandrin a les yeux bleus. Elandrin est mince et porte une armure de Chevalier d’Émeraude (armure elfique lourde avec des accents verts). Elandrin a un air mélancolique et doux. Elandrin a des tatouages style arabesques symétriques sur le visage (vallaslin de Andruil dans Dragon Age).",
  },
  {
    id: "adalene",
    name: "Adalene",
    defaultDescription: "Une humaine du nom de Adalene. Adalene est jeune, Adalene a 20 ans. Adalene a la peau pâle et de longs cheveux noirs. Adalene a un style vestimentaire gothique et porte une longue robe noire et des gants en dentelle noirs. Adalene a un visage qui ressemble à celui de Amy Lee et des lèvres rouges. Adalene a un air doux et une attitude gracieuse.",
  },
  {
    id: "duchesse-amandine",
    name: "Duchesse Amandine",
    defaultDescription: "Un femme humaine du nom de Amandine. Amandine est grande et belle. Amandine a de long cheveux bruns souple et des yeux bleus. Amandine porte toujours un masque vénitien en argent ajouré comme de la dentelle avec des breloques de saphirs qui font comme des gouttes sur le bas du masque. Amandine porte une robe bleue richement décorée avec des broderies argentées en forme de vague. Amandine est une femme hautaine et fausse qui aime la fête et les complots. Amandine est enceinte et son ventre rond est mis en valeur par la ceinture haute de sa robe.",
  },
  {
    id: "dalhia",
    name: "Dalhia",
    defaultDescription: "Un personnage du nom de Dalhia. C'est une créature mystique, un esprit humanoïde avec une peau couleur opale. Dalhia a des cheveux multicolores qui ont l'air de flotter autour d'elle comme si elle était sous l'eau. Dalhia a des reflets d'opale et des lumières prismatiques dans les cheveux. Dalhia semble irréelle et magnifique. Dalhia a des vêtements qui ressemble a ceux des sirènes, un crop top couleur corail et un pantalon de pirate blanc. Dalhia a des accessoires dans les cheveux et sur elle (bracelets, collier, tiare) dans un thème marin de Corail et d'écume.",
  },
  {
    id: "ilaria",
    name: "Ilaria",
    defaultDescription: "Ilaria est une jeune elfe d'une vingtaine d'année. Ilaria a deux longs cheveux blonds attachés en deux tresses qui tombent de chaque coté de ses épaules. Ilaria a la peau pâle et les yeux gris bleu. Ilaria a de délicats tatouage faciaux autour sur les fronts, les tempes et les joues dans un motif végétal. Ilaria a un visage poupin et des traits délicats. Ilaria a l'air timide et mignonne. Ilaria porte une robe elfique légères dans des tons verts avec des broderies de motif végétal."
  }
];

export const DEFAULT_LOCATIONS = [
  {
    id: "thaig",
    name: "Thaig des Oubliés",
    defaultDescription: "Lieu troglodyte taillé par les nains, aux murs sont placés des minerais lumineux bleus et verts qui émettent une lumière douce."
  },
  {
    id: "salle-de-bain-thaig",
    name: "Salle de bain de la thaig",
    defaultDescription: "Thermes taillés par les nains, avec de la lave en hors-champ qui éclaire doucement le lieu."
  },
  {
    id: "foret-du-thaig",
    name: "Foret du Thaig",
    defaultDescription: "Forêt montagneuse légèrement pentu."
  },
  {
    id: "clairière-du-thaig",
    name: "Clairière du Thaig",
    defaultDescription: "Clairière montagneuse entourée d'une forêt. En arrière plan, on peut distinguer une énorme porte double en marbre lisse incrustée dans une montagne."
  },
  {
    id: "minrathie",
    name: "Minrathie",
    defaultDescription: "Grande ville avec de grands batiments au style un peu asiatique (Japon) et des touches latines (Rome antique)."
  },
  {
    id: "chambre-du-thaig",
    name: "Chambre du thaig",
    defaultDescription: "Une chambre troglodyte taillée par les nains, aux murs sont placés des minerais lumineux bleus et verts qui émettent une lumière douce.",
  },
  {
    id: "plateau-montagneux",
    name: "Plateau montagneux",
    defaultDescription: "Un plateau montagneux très en hauteur, en contrebas, si l'on voit le bas, il y a de la forêt."
  },
  {
    id: "minrathie",
    name: "Chambre Minrathie",
    defaultDescription: "Une grande chambre luxueuse qui rappellent un peu l'architecture japonaise."
  }
];

export const WEATHER_OPTIONS = [
  { id: "sunny", emoji: "☀️", label: "Ensoleillé", description: "Le temps est clair et ensoleillé, avec un ciel bleu dégagé." },
  { id: "cloudy", emoji: "☁️", label: "Nuageux", description: "Le ciel est couvert de nuages, créant une atmosphère douce et tamisée." },
  { id: "rainy", emoji: "🌧️", label: "Pluvieux", description: "La pluie tombe, créant une ambiance mélancolique et humide." },
  { id: "stormy", emoji: "⛈️", label: "Orageux", description: "Un orage éclate avec des éclairs et du tonnerre, créant une atmosphère dramatique." },
  { id: "foggy", emoji: "🌫️", label: "Brumeux", description: "Une brume épaisse enveloppe le paysage, créant une atmosphère mystérieuse et éthérée." },
  { id: "snowy", emoji: "❄️", label: "Neigeux", description: "La neige tombe doucement, créant un paysage hivernal paisible." },
  { id: "windy", emoji: "💨", label: "Venteux", description: "Un vent fort souffle, agitant les vêtements et la végétation." },
  { id: "night", emoji: "🌙", label: "Nuit", description: "Il fait nuit, le ciel est nocturne étoilé, avec une lune visible." },
  { id: "dusk", emoji: "🌆", label: "Crépuscule", description: "C'est le crépuscule, la journée prend fin." },
  { id: "dawn", emoji: "🌅", label: "Aube", description: "C'est l'aube, la journée débute." },
];

export const cardBase =
  "rounded-2xl border border-amber-300/20 bg-[radial-gradient(1200px_400px_at_50%_-20%,rgba(212,175,55,0.06),transparent),linear-gradient(to_bottom_right,rgba(255,255,255,0.02),rgba(0,0,0,0.2))] shadow-[0_10px_40px_rgba(0,0,0,0.35)]";

export const inputBase =
  "w-full rounded-xl border border-amber-400/30 bg-zinc-900/60 text-amber-50 px-3 py-2 placeholder:text-amber-100/30 focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-300/70 backdrop-blur-sm";

