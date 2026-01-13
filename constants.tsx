
import { DomainOption, MissionData } from "./types";
import questionBank from "./questionBank";

export const ENABLE_API_CACHE = true;
export const ENABLE_CLOUD_STORAGE = false; // Set to true only after updating FIREBASE_CONFIG
export const ENABLE_ANALYTICS = true;

export const FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

export interface DomainCategory {
  title: string;
  items: DomainOption[];
}

export const FAMILIAR_CATEGORIES: DomainCategory[] = [
  {
    title: "Engineering",
    items: [
      { id: 'llm', label: 'LLM Internals', icon: '🧠', description: 'RAG, Embeddings, and Transformers', keywords: ['Vector', 'Chunk', 'Context Window', 'Token', 'Prompt', 'Attention', 'Embedding'] },
      { id: 'cook', label: 'Cooking', icon: '🍳', description: 'Recipes, seasoning, and heat', keywords: ['Spatula', 'Simmer', 'Ingredient', 'Whisk', 'Chef', 'Menu', 'Plate'] },
      { id: 'drive', label: 'Driving', icon: '🚗', description: 'Traffic, rules, and navigation', keywords: ['Lane', 'Accelerator', 'GPS', 'Merging', 'Steering', 'Traffic Light', 'Gear'] }
    ]
  },
  {
    title: "Digital & Play",
    items: [
      { id: 'rpg', label: 'RPG Games', icon: '⚔️', description: 'Levels, skill trees, and mana', keywords: ['Mana', 'EXP', 'Loot', 'Dungeon', 'Quest', 'Buff', 'Nerf', 'Inventory'] },
      { id: 'social', label: 'Social Media', icon: '📱', description: 'Feeds, engagement, and virality', keywords: ['Hashtag', 'Feed', 'Share', 'Algorithm', 'DM', 'Follower', 'Viral'] },
      { id: 'lego', label: 'Lego', icon: '🧱', description: 'Bricks, stability, and modules', keywords: ['Stud', 'Plate', 'Clutch', 'Manual', 'Bin', 'Build', 'Modular'] }
    ]
  }
];

export const COMPLEX_CATEGORIES: DomainCategory[] = [
  {
    title: "Enterprise Architecture",
    items: [
      { 
        id: 'glean', label: 'Glean Internals', icon: '🔍', description: 'Enterprise Search & Knowledge Graph',
        keywords: ['Index', 'ACL', 'Recrawl', 'Signals', 'Boosting', 'Entity', 'Graph'],
        suggestedGoals: ['Master Enterprise Search Architecture', 'Permissions as a Constraint', 'Source Freshness & Drift']
      },
      { 
        id: 'blockchain', label: 'Blockchain', icon: '⛓️', description: 'Ledgers and consensus',
        keywords: ['Hash', 'Node', 'Ledger', 'Mining', 'Smart Contract', 'Decentralized', 'Gas'],
        suggestedGoals: ['What is a Ledger?', 'Proof of Work explained', 'Smart Contracts']
      }
    ]
  },
  {
    title: "Systems & Frontiers",
    items: [
      { 
        id: 'crm', label: 'CRM Tools', icon: '💼', description: 'Leads, pipelines, and funnels',
        keywords: ['Pipeline', 'Lead', 'MQL', 'Conversion', 'Prospect', 'SaaS', 'Funnel'],
        suggestedGoals: ['Understand the Sales Funnel', 'Leads vs Contacts', 'Automating follow-ups']
      },
      { 
        id: 'stocks', label: 'Stock Market', icon: '📈', description: 'Volatility and value',
        keywords: ['Yield', 'Volatility', 'Portfolio', 'Ticker', 'Bear Market', 'Dividend', 'Equity'],
        suggestedGoals: ['Explain "Buying the Dip"', 'How dividends work', 'Market Volatility']
      },
      { 
        id: 'quantum', label: 'Quantum Physics', icon: '⚛️', description: 'Reality and probability',
        keywords: ['Superposition', 'Entanglement', 'Qubit', 'Waveform', 'Observer', 'Photon', 'Spin'],
        suggestedGoals: ['Explain Superposition', 'Entanglement', 'Schrodinger\'s Cat']
      }
    ]
  }
];

export const PRECOMPUTED_STORE: Record<string, MissionData> = questionBank;
