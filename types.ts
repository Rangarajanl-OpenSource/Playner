
export interface AnalogyQuestion {
  id: string;
  question: string;
  familiarConcept: string;
  complexConcept: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  fact: string;
  imagePrompt: string;
  imageUrl?: string;
}

export interface DomainOption {
  id: string;
  label: string;
  icon: string;
  description: string;
  suggestedGoals?: string[];
}

export enum GameState {
  HOME = 'HOME',
  SETUP = 'SETUP',
  QUIZ = 'QUIZ',
  REVEAL = 'REVEAL',
  PROGRESS = 'PROGRESS',
  SUMMARY = 'SUMMARY',
  MASCOT_EDIT = 'MASCOT_EDIT'
}

export interface GameSession {
  familiarDomain: DomainOption | null;
  complexDomain: DomainOption | null;
  goal: string;
  questions: AnalogyQuestion[];
  currentIndex: number;
  score: number;
  history: {
    questionId: string;
    answer: string;
    isCorrect: boolean;
  }[];
}
