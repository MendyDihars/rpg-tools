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
      `Il y a Essek, un autre elfe de 18 ans, c'est aussi un voleur. Il a les cheveux longs noirs attaché en queue de cheval haute. Son visage est fin, jeune et androgyne. Il a également deux bracelets, comme Alriel. Il porte également un bijou au bras droit. Il porte une armure de cuir noir avec des plumes de corbeau en guise d'épaulette. Alriel porte aussi une bague sur son auriculaire gauche`,
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
];

export const cardBase =
  "rounded-2xl border border-amber-300/20 bg-[radial-gradient(1200px_400px_at_50%_-20%,rgba(212,175,55,0.06),transparent),linear-gradient(to_bottom_right,rgba(255,255,255,0.02),rgba(0,0,0,0.2))] shadow-[0_10px_40px_rgba(0,0,0,0.35)]";

export const inputBase =
  "w-full rounded-xl border border-amber-400/30 bg-zinc-900/60 text-amber-50 px-3 py-2 placeholder:text-amber-100/30 focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-300/70 backdrop-blur-sm";

