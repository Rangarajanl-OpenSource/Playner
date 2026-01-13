
import { DomainOption, MissionData } from "./types";
import questionBank from "./questionBank";

export const ENABLE_API_CACHE = true;
export const ENABLE_CLOUD_STORAGE = false;
export const ENABLE_ANALYTICS = true;
export const FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  projectId: "YOUR_PROJECT_ID",
};

export interface DomainCategory {
  title: string;
  items: DomainOption[];
}

export const FAMILIAR_CATEGORIES: DomainCategory[] = [
  {
    title: "Classic Games",
    items: [
      { id: 'tictactoe', label: 'Tic-Tac-Toe', icon: '❌', description: 'Patterns and strategy', keywords: ['Grid', 'Strategy', 'Draw'] },
      { id: 'rps', label: 'Rock Paper Scissors', icon: '✊', description: 'Cycles and probability', keywords: ['Cycle', 'Outcome', 'Random'] },
    ]
  },
  {
    title: "Hobbies",
    items: [
      { id: 'gaming', label: 'Video Games', icon: '🎮', description: 'XP and loot mechanics', keywords: ['Buff', 'Patch', 'Raid'] },
      { id: 'lego', label: 'Lego Building', icon: '🧱', description: 'Modular instructions', keywords: ['Clutch', 'Plate', 'Modular'] },
      { id: 'cook', label: 'Cooking', icon: '🍳', description: 'Recipes and reactions', keywords: ['Spatula', 'Simmer', 'Ingredient'] },
    ]
  },
  {
    title: "School Life",
    items: [
      { id: 'english', label: 'English Grammar', icon: '📝', description: 'Nouns and syntax', keywords: ['Subject', 'Verb', 'Adjective'] },
      { id: 'math', label: 'Basic Math', icon: '🔢', description: 'Arithmetic and logic', keywords: ['Sum', 'Fraction', 'Variable'] },
    ]
  }
];

export const COMPLEX_CATEGORIES: DomainCategory[] = [
  {
    title: "New Frontiers",
    items: [
      { 
        id: 'finance', label: 'Economics', icon: '📈', description: 'Markets and value',
        keywords: ['Inflation', 'Supply', 'Demand', 'Volatility'],
        suggestedGoals: ['Market Volatility Explained', 'Understand the Sales Funnel']
      },
      { 
        id: 'spanish', label: 'Spanish Basics', icon: '🌮', description: 'The logic of a new language',
        keywords: ['Conjugation', 'Gender', 'Tú vs Usted'],
        suggestedGoals: ['Master Basic Sentence Structure']
      }
    ]
  },
  {
    title: "Future Tech",
    items: [
      { 
        id: 'quantum', label: 'Quantum Physics', icon: '⚛️', description: 'Probability and reality',
        keywords: ['Superposition', 'Entanglement', 'Qubit'],
        suggestedGoals: ['Explain Superposition', 'Schrodinger\'s Cat']
      },
      { 
        id: 'glean', label: 'Glean Internals', icon: '🔍', description: 'AI Enterprise Search',
        keywords: ['ACL', 'RAG', 'Vector Index'],
        suggestedGoals: ['Master Enterprise Search Architecture']
      }
    ]
  }
];

export const TRENDING_MISSIONS = [
  { familiar: 'tictactoe', complex: 'finance', goal: 'Market Volatility Explained', label: 'The Winning Move', color: 'indigo' },
  { familiar: 'rps', complex: 'quantum', goal: 'Explain Superposition', label: 'Probability Rumble', color: 'emerald' },
  { familiar: 'gaming', complex: 'finance', goal: 'Market Volatility Explained', label: 'Level Up Your Finance', color: 'indigo' },
];

export const PRECOMPUTED_STORE: Record<string, MissionData> = questionBank;
