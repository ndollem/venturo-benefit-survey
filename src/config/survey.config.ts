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
  submitEndpoint: import.meta.env.VITE_SUBMIT_ENDPOINT || "https://script.google.com/macros/s/AKfycbxk7sk1P9PHRg1byAKeVh36Rp71WDAXOZFOHM-3SbrapaFiGCIITsdZcTOrMpVyPAwMyQ/exec",
  ratingTheme: "genz",
  accent: "#F97316", // Orange accent
  cardRadius: 24,
  prioritySlotsCount: import.meta.env.VITE_PRIORITY_SLOTS_COUNT ? parseInt(import.meta.env.VITE_PRIORITY_SLOTS_COUNT, 10) : 10,
  gameplayMode
};

export default config;
