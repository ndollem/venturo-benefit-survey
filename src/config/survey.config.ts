import type { SurveyConfig, GameplayMode } from '../types/survey';

// Resolve gameplay mode from env, falling back to the priority-focused default.
const rawMode = (import.meta.env.VITE_GAMEPLAY_MODE || 'priority').toLowerCase();
const gameplayMode: GameplayMode =
  rawMode === 'full' || rawMode === 'skip' ? rawMode : 'priority';

const config: SurveyConfig = {
  title: "WHAT MAKES ME HAPPY ON",
  subtitle: "Benefit Challenge",
  estimatedDuration: "3–5 menit",
  randomizeBenefits: true,
  // Fallback points at the demo spreadsheet, not the live survey — an unset or
  // blank VITE_SUBMIT_ENDPOINT should never silently write real response data.
  submitEndpoint: import.meta.env.VITE_SUBMIT_ENDPOINT || "https://script.google.com/macros/s/AKfycbwcvCbuFuidRkPAJ7cS3b_T3oXwGr6DChiuVW7w3CEO7N3AyHnBJcIqvRImNN6gZcXh4g/exec",
  ratingTheme: "genz",
  accent: "#F97316", // Orange accent
  cardRadius: 24,
  prioritySlotsCount: import.meta.env.VITE_PRIORITY_SLOTS_COUNT ? parseInt(import.meta.env.VITE_PRIORITY_SLOTS_COUNT, 10) : 10,
  gameplayMode
};

export default config;
