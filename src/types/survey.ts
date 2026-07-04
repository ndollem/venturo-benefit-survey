export interface SurveyConfig {
  title: string;
  subtitle: string;
  estimatedDuration: string;
  randomizeBenefits: boolean;
  showCategoryIntro: boolean;
  categoryIntroDuration: number;
  shuffleAnimation: {
    firstOnly: boolean;
    duration: number;
  };
  submitEndpoint: string;
  ratingTheme: string;
  accent: string;
  cardRadius?: number;
  shadow?: string;
  showTutorial?: boolean;
  enableEmoji?: boolean;
  enableQuestion?: boolean;
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
  step: 'splash' | 'name' | 'tutorial' | 'category_intro' | 'gameplay' | 'final_questions' | 'submitting' | 'completed' | 'error';
  name: string;
  currentCategoryIndex: number;
  currentBenefitIndex: number; // Index in the randomized benefits list
  shuffledBenefits: Benefit[]; // The overall flat list of randomized benefits to go through
  ratings: Record<string, number>;
  stayReason: string;
  leaveReason: string;
  errorMsg?: string;
}
