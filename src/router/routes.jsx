import InitiativePage from '../pages/InitiativePage.jsx'
import MagicHealPage from '../pages/MagicHealPage.jsx'
import PotionsPage from '../pages/PotionsPage.jsx'
import RicochetsPage from '../pages/RicochetsPage.jsx'
import PromptAssemblerPage from '../pages/PromptAssemblerPage.jsx'

export const ROUTES = [
  {
    id: 'magic_heal',
    label: 'Simulateur de soin',
    icon: '💖',
    path: '/magic-heal',
    element: <MagicHealPage />,
  },
  {
    id: 'potions',
    label: 'Potions',
    icon: '🧪',
    path: '/potions',
    element: <PotionsPage />,
  },
  {
    id: 'initiative',
    label: 'Initiative',
    icon: '⚔️',
    path: '/initiative',
    element: <InitiativePage />,
  },
  {
    id: 'ricochets',
    label: 'Ricochets',
    icon: '🔁',
    path: '/ricochets',
    element: <RicochetsPage />,
  },
  {
    id: 'ai_prompt_generator',
    label: 'Générateur de prompt',
    icon: '🤖',
    path: '/ai-prompt-generator',
    element: <PromptAssemblerPage />,
  },
]

export const DEFAULT_ROUTE = ROUTES[0]


