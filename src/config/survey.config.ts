import type { SurveyConfig } from '../types/survey';

const config: SurveyConfig = {
  title: "WHAT MAKES ME HAPPY ON",
  subtitle: "Benefit Challenge",
  estimatedDuration: "3–5 menit",
  randomizeBenefits: true,
  showCategoryIntro: true,
  categoryIntroDuration: 1200, // Adjusted slightly for visual ease, originally 900
  shuffleAnimation: {
    firstOnly: true,
    duration: 2000
  },
  submitEndpoint: import.meta.env.VITE_SUBMIT_ENDPOINT || "https://script.google.com/macros/s/AKfycbxk7sk1P9PHRg1byAKeVh36Rp71WDAXOZFOHM-3SbrapaFiGCIITsdZcTOrMpVyPAwMyQ/exec",
  ratingTheme: "casual",
  accent: "#F97316" // Orange accent
};

export default config;
