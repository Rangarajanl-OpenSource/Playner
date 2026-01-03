
import { DomainOption } from "./types";

export const FAMILIAR_DOMAINS: DomainOption[] = [
  { id: 'ttt', label: 'Tic-Tac-Toe', icon: '⭕️', description: 'Simple 3x3 grid strategy' },
  { id: 'nfl', label: 'NFL / Football', icon: '🏈', description: 'Plays, yardage, and strategy' },
  { id: 'cook', label: 'Cooking', icon: '🍳', description: 'Recipes and chemical reactions' },
  { id: 'cricket', label: 'Cricket', icon: '🏏', description: 'Innings, wickets, and runs' },
  { id: 'hide', label: 'Hide and Seek', icon: '🙈', description: 'Spatial awareness and stealth' }
];

export const COMPLEX_DOMAINS: DomainOption[] = [
  { id: 'bridge', label: 'Bridge (Card Game)', icon: '🃏', description: 'Complex bidding and play' },
  { id: 'stocks', label: 'Stock Market', icon: '📈', description: 'Trading and risk management' },
  { id: 'prob', label: 'Probability', icon: '🎲', description: 'Odds and statistical chance' },
  { id: 'pm', label: 'Project Mgmt', icon: '📂', description: 'Deadlines and resource flow' },
  { id: 'quantum', label: 'Quantum Physics', icon: '⚛️', description: 'The weird world of atoms' }
];
