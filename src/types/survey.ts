// Gameplay method:
// - 'priority': slots are the star; bottom shows 2 quick-verdict buttons (want / skip)
// - 'full':     slots + full 1-5 rating grid (richest per-benefit sentiment)
// - 'skip':     slots + a single "skip" button only (minimal)
export type GameplayMode = 'priority' | 'full' | 'skip';

export interface SurveyConfig {
  title: string;
  subtitle: string;
  estimatedDuration: string;
  randomizeBenefits: boolean;
  submitEndpoint: string;
  ratingTheme: string;
  accent: string;
  cardRadius?: number;
  prioritySlotsCount?: number;
  gameplayMode: GameplayMode;
}

export interface RatingOption {
  score: number;
  emoji?: string;
  label: string;
}

export interface RatingTheme {
  id: string;
  name: string;
  options: RatingOption[];
}

export interface Benefit {
  id: string;
  category: string;
  title: string;
  sheet: string;
  index: number;
  active: boolean;
}

export interface SurveyState {
  step: 'splash' | 'name' | 'tutorial' | 'gameplay' | 'final_questions' | 'submitting' | 'completed' | 'error';
  name: string;
  currentBenefitIndex: number; // Index in the randomized benefits list
  shuffledBenefits: Benefit[]; // The overall flat list of randomized benefits to go through
  ratings: Record<string, number>;
  priorities: (string | null)[]; // Array of benefit IDs assigned to priority slots
  stayReason: string;
  leaveReason: string;
  errorMsg?: string;
}
