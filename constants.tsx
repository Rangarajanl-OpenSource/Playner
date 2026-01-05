
import { DomainOption } from "./types";

/**
 * DEVELOPMENT FLAGS
 */
export const ENABLE_API_CACHE = true;
export const ENABLE_CLOUD_STORAGE = true;
export const ENABLE_ANALYTICS = true;

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
  "nfl_stocks_read_a_price_chart": [
    {
      "id": "q1",
      "question": "In the NFL, the 'Line of Scrimmage' is where every play begins. On a stock price chart, what represents the point where today's 'game' started?",
      "familiarConcept": "Line of Scrimmage",
      "complexConcept": "Opening Price",
      "options": ["Closing Price", "Market Cap", "Opening Price", "Ticker Symbol"],
      "correctAnswer": "Opening Price",
      "explanation": "Just as the line of scrimmage is the static starting point for a drive, the Opening Price is the anchor for the day's price movement.",
      "fact": "Stocks can open higher or lower than they closed the previous day—this is called a 'Gap'.",
      "imagePrompt": "A minimalist chart with a green line starting at a clear 'Start' flag."
    },
    {
        "id": "q2",
        "question": "When an NFL team is 'marching down the field', they have momentum. If a stock chart shows a series of higher peaks and higher valleys, what is this 'drive' called?",
        "familiarConcept": "Marching downfield",
        "complexConcept": "Uptrend",
        "options": ["Bear Market", "Uptrend", "Sideways Trading", "Market Crash"],
        "correctAnswer": "Uptrend",
        "explanation": "An uptrend is like a successful offensive drive—it's consistent forward progress despite small setbacks.",
        "fact": "Trends can last for years (secular) or just minutes (intraday).",
        "imagePrompt": "A football player running up a staircase of bar charts."
    },
    {
        "id": "q3",
        "question": "A 'Red Zone' in football is where scoring becomes harder because the defense tightens up. In stocks, what do we call a price level that a stock struggles to break above?",
        "familiarConcept": "Red Zone",
        "complexConcept": "Resistance",
        "options": ["Support", "Resistance", "Dividend", "Volatility"],
        "correctAnswer": "Resistance",
        "explanation": "Resistance levels act like a goal-line defense, preventing the price (the ball) from going higher.",
        "fact": "Once resistance is broken, it often becomes 'Support' for the next leg up.",
        "imagePrompt": "A price line hitting a brick wall at the top of a chart."
    },
    {
        "id": "q4",
        "question": "A 'Fumble' can cause a sudden loss of yardage. If a stock's price suddenly drops 10% in a few minutes due to bad news, what is this movement called?",
        "familiarConcept": "Fumble",
        "complexConcept": "Volatility Spike",
        "options": ["Bull Run", "Volatility Spike", "Divided Growth", "Blue Chip"],
        "correctAnswer": "Volatility Spike",
        "explanation": "A fumble is a chaotic, unplanned event that changes the game instantly—just like a volatility spike in trading.",
        "fact": "High volatility can be risky, but it also provides opportunity for active traders.",
        "imagePrompt": "A stock chart dropping sharply like a dropped football."
    },
    {
        "id": "q5",
        "question": "The 'Final Score' tells you who won the game. On a price chart, what is the single most important data point at the end of the day?",
        "familiarConcept": "Final Score",
        "complexConcept": "Closing Price",
        "options": ["Opening Price", "Closing Price", "Volume", "P/E Ratio"],
        "correctAnswer": "Closing Price",
        "explanation": "The closing price is the 'Final Score' that investors use to judge the success of the day's trading session.",
        "fact": "The 'Closing Cross' is a massive auction that happens in the final minutes of the day.",
        "imagePrompt": "A scoreboard showing a stock ticker and a final price."
    },
    {
        "id": "q6",
        "question": "Final Mastery: You see a chart where the price is hitting a 'ceiling' multiple times but can't get through. What should you label this line?",
        "familiarConcept": "Direct Application",
        "complexConcept": "Resistance Level",
        "options": ["The Support Floor", "The Resistance Ceiling", "The Dividend Line", "The Market Cap"],
        "correctAnswer": "The Resistance Ceiling",
        "explanation": "Resistance is the price ceiling where selling pressure outweighs buying pressure.",
        "fact": "Technical analysts use these levels to time their entries and exits.",
        "imagePrompt": "A hand drawing a red line across several peaks on a chart."
    }
  ],
  "cook_quantum_explain_superposition": [
    {
        "id": "c1",
        "question": "In a kitchen, a closed spice cabinet contains many flavors, but you don't know which one you'll pick until you open it. In Quantum Physics, what is the state of a particle that exists in multiple possibilities at once?",
        "familiarConcept": "Closed Spice Cabinet",
        "complexConcept": "Superposition",
        "options": ["Entanglement", "Superposition", "Decoherence", "Gravity"],
        "correctAnswer": "Superposition",
        "explanation": "Just as the 'flavor' of your dish is undecided until you choose a spice, a quantum particle is in 'Superposition' (all flavors at once) until measured.",
        "fact": "This is famously illustrated by the 'Schrödinger's Cat' thought experiment.",
        "imagePrompt": "A glowing kitchen cabinet with question marks inside."
    },
    {
        "id": "c2",
        "question": "When you crack an egg, it goes from being 'potential breakfast' to a 'liquid in a pan'. In Quantum terms, what is the act of looking at a particle and forcing it into one single state called?",
        "familiarConcept": "Cracking the Egg",
        "complexConcept": "Observation / Collapse",
        "options": ["Blending", "Collapsing the Wave Function", "Marinating", "Quantum Tunneling"],
        "correctAnswer": "Collapsing the Wave Function",
        "explanation": "Cracking the egg 'collapses' its potential states into one reality—just like observation collapses a quantum wave function.",
        "fact": "The very act of measuring a quantum system changes its state.",
        "imagePrompt": "An egg cracking over a pan, turning from a hazy cloud into a solid yolk."
    },
    {
        "id": "c3",
        "question": "Mixing salt into water makes it disappear, but it's still there influencing the taste. In Quantum Physics, if two particles become linked so that one always knows what the other is doing, what is this called?",
        "familiarConcept": "Salt in Water",
        "complexConcept": "Entanglement",
        "options": ["Boiling", "Entanglement", "Evaporation", "Sifting"],
        "correctAnswer": "Entanglement",
        "explanation": "Like salt and water becoming one inseparable system, entangled particles share a single existence across any distance.",
        "fact": "Einstein called this 'Spooky action at a distance'.",
        "imagePrompt": "Two salt crystals connected by a glowing blue thread."
    },
    {
        "id": "c4",
        "question": "A 'Recipe' tells you the probability of a cake turning out well. In Quantum Physics, what mathematical tool predicts the likelihood of finding a particle in a certain spot?",
        "familiarConcept": "The Recipe",
        "complexConcept": "Wave Function",
        "options": ["The Oven Timer", "Wave Function", "The Measuring Cup", "Atomic Weight"],
        "correctAnswer": "Wave Function",
        "explanation": "A recipe isn't the cake itself, but a set of instructions for it. A wave function is a set of probabilities for a particle's existence.",
        "fact": "The symbol for wave function is the Greek letter Psi (ψ).",
        "imagePrompt": "A cookbook where the words are floating like waves."
    },
    {
        "id": "c5",
        "question": "Sometimes a piece of flour can sift through a tiny hole in a strainer that seems too small. In the quantum world, when a particle passes through a barrier it shouldn't be able to, what is it called?",
        "familiarConcept": "Sifting Flour",
        "complexConcept": "Quantum Tunneling",
        "options": ["Quantum Tunneling", "Boiling Over", "Deep Frying", "Caramelizing"],
        "correctAnswer": "Quantum Tunneling",
        "explanation": "Just as fine flour seems to 'ghost' through a mesh, particles can 'tunnel' through energy barriers in the quantum world.",
        "fact": "Quantum tunneling is why the Sun is able to shine (nuclear fusion).",
        "imagePrompt": "A particle passing through a solid kitchen wall like a ghost."
    },
    {
        "id": "c6",
        "question": "Final Mastery: You have a quantum bit (qubit) that is currently both a 0 and a 1 at the same time. Which state is it in?",
        "familiarConcept": "Direct Application",
        "complexConcept": "Superposition",
        "options": ["Binary State", "Superposition", "The Off Position", "Thermal Equilibrium"],
        "correctAnswer": "Superposition",
        "explanation": "Superposition is the core principle that allows qubits to process massive amounts of data by being both states simultaneously.",
        "fact": "Quantum computers use this to solve problems that would take normal computers billions of years.",
        "imagePrompt": "A digital 0 and 1 overlapping and glowing."
    }
  ]
};
