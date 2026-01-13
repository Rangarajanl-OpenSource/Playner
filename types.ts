
export interface ModuleStep {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  known_concept?: string;
  glean_concept?: string;
  learning_intent?: string;
  tip?: string;
}

export interface NeuralModule {
  id: string;
  conceptName: string;
  bridgeKeywords: { familiar: string[]; complex: string[] };
  prime: ModuleStep;
  bridge: ModuleStep;
  infer: ModuleStep;
  reinforce: ModuleStep;
  capstone: ModuleStep;
  synthesis: string;
}

export interface MissionBriefing {
  title: string;
  scenario: string;
  objective: string;
}

export interface MissionData {
  briefing: MissionBriefing;
  modules: NeuralModule[];
  finalChallenge: ModuleStep;
}

export interface DomainOption {
  id: string;
  label: string;
  icon: string;
  description: string;
  keywords: string[];
  suggestedGoals?: string[];
}

export enum GameState {
  HOME = 'HOME',
  SETUP = 'SETUP',
  MAP = 'MAP',
  BRIEFING = 'BRIEFING',
  // Steps within a module
  STEP_PRIME = 'STEP_PRIME',
  STEP_BRIDGE = 'STEP_BRIDGE',
  STEP_INFER = 'STEP_INFER',
  STEP_REINFORCE = 'STEP_REINFORCE',
  STEP_CAPSTONE = 'STEP_CAPSTONE',
  // Transit
  WORD_SYNC = 'WORD_SYNC',
  SYNTHESIS = 'SYNTHESIS',
  FINAL_CHALLENGE = 'FINAL_CHALLENGE',
  SUMMARY = 'SUMMARY'
}

export interface GameSession {
  familiarDomain: DomainOption | null;
  complexDomain: DomainOption | null;
  goal: string;
  mission: MissionData | null;
  currentIndex: number;
  score: number;
}
