import type { RatingTheme } from '../types/survey';

const ratingThemes: Record<string, RatingTheme> = {
  casual: {
    id: "casual",
    name: "Casual",
    options: [
      { score: 5, emoji: "🤩", label: "Wajib Ada!" },
      { score: 4, emoji: "😍", label: "Mau Banget" },
      { score: 3, emoji: "🙂", label: "Boleh Juga" },
      { score: 2, emoji: "😐", label: "Kurang Ngaruh" },
      { score: 1, emoji: "🙅", label: "Nggak Perlu" }
    ]
  },
  professional: {
    id: "professional",
    name: "Professional",
    options: [
      { score: 5, label: "Sangat Diinginkan" },
      { score: 4, label: "Diinginkan" },
      { score: 3, label: "Netral" },
      { score: 2, label: "Kurang Diinginkan" },
      { score: 1, label: "Tidak Dibutuhkan" }
    ]
  },
  happy: {
    id: "happy",
    name: "Happy",
    options: [
      { score: 5, emoji: "🥳", label: "Seneng Banget!" },
      { score: 4, emoji: "😊", label: "Lumayan Seneng" },
      { score: 3, emoji: "🙂", label: "Biasa Aja" },
      { score: 2, emoji: "😌", label: "Ya Gapapa" },
      { score: 1, emoji: "🙅", label: "Nggak Ngaruh" }
    ]
  },
  genz: {
    id: "genz",
    name: "Gen Z",
    options: [
      { score: 5, emoji: "🔥", label: "Auto Ambil" },
      { score: 4, emoji: "👌", label: "Cakep Nih" },
      { score: 3, emoji: "🙂", label: "Lumayan" },
      { score: 2, emoji: "🤏", label: "Kurang Sih" },
      { score: 1, emoji: "🙅", label: "Skip Aja" }
    ]
  }
};

export default ratingThemes;
