
import { DomainOption } from "./types";

/**
 * DEVELOPMENT FLAGS
 */
export const ENABLE_API_CACHE = true;
export const ENABLE_CLOUD_STORAGE = true;

export const KOALA_GUIDE_PROMPT = "A cute 3D rendered koala mascot wearing a sleek futuristic visor and holding a glowing neon laser tag gun, pointing forward with a friendly expression, vibrant colors, minimalist style, isolated on white background.";

export const FAMILIAR_DOMAINS: DomainOption[] = [
  { id: 'ttt', label: 'Tic-Tac-Toe', icon: '⭕️', description: 'Simple 3x3 grid strategy' },
  { id: 'nfl', label: 'NFL / Football', icon: '🏈', description: 'Plays, yardage, and strategy' },
  { id: 'cook', label: 'Cooking', icon: '🍳', description: 'Recipes and chemical reactions' },
  { id: 'cricket', label: 'Cricket', icon: '🏏', description: 'Innings, wickets, and runs' },
  { id: 'hide', label: 'Hide and Seek', icon: '🙈', description: 'Spatial awareness and stealth' }
];

export const COMPLEX_DOMAINS: DomainOption[] = [
  { 
    id: 'bridge', 
    label: 'Bridge (Card Game)', 
    icon: '🃏', 
    description: 'Complex bidding and play',
    suggestedGoals: ['Understand a bidding sequence', 'Know when to play a high card', 'Explain "Tricks" to a friend']
  },
  { 
    id: 'stocks', 
    label: 'Stock Market', 
    icon: '📈', 
    description: 'Trading and risk management',
    suggestedGoals: ['Read a price chart', 'Understand "Buying the Dip"', 'Explain what a Dividend is']
  },
  { 
    id: 'prob', 
    label: 'Probability', 
    icon: '🎲', 
    description: 'Odds and statistical chance',
    suggestedGoals: ['Calculate winning odds', 'Understand "Expected Value"', 'Identify the Gamblers Fallacy']
  },
  { 
    id: 'pm', 
    label: 'Project Mgmt', 
    icon: '📂', 
    description: 'Deadlines and resource flow',
    suggestedGoals: ['Read a Gantt Chart', 'Identify a "Bottleneck"', 'Explain a "Sprint"']
  },
  { 
    id: 'quantum', 
    label: 'Quantum Physics', 
    icon: '⚛️', 
    description: 'The weird world of atoms',
    suggestedGoals: ['Explain Superposition', 'Understand "Entanglement"', 'Visualize a Wave Function']
  }
];

export const PRECOMPUTED_STORE: Record<string, any> = {
  "nfl_stock_market_read_a_price_chart": [
    {
      "id": "q1",
      "question": "In NFL, if a team has '1st and 10', they have potential but haven't gained ground yet. On a stock price chart, what is the starting point of the day called?",
      "familiarConcept": "1st and 10",
      "complexConcept": "Opening Price",
      "options": ["Closing Price", "Market Cap", "Opening Price", "Day High"],
      "correctAnswer": "Opening Price",
      "explanation": "Just as the 1st down starts a drive, the Opening Price starts the day's trading 'drive' for a stock.",
      "fact": "Markets usually open at 9:30 AM EST in New York.",
      "imagePrompt": "A minimalist line chart showing a dot at the start of a vertical line, highlighted with a green 'Start' flag."
    }
  ]
};
