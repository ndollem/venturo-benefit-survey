import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Benefit, RatingOption } from '../types/survey';
import BenefitSprite from './BenefitSprite';
import config from '../config/survey.config';

interface GameplayProps {
  currentBenefit: Benefit;
  allBenefits: Benefit[];
  currentIndex: number;
  totalCount: number;
  ratingOptions: RatingOption[];
  onRate: (benefitId: string, score: number) => void;
}

// 8 beautiful soft pastel gradients to dynamically cycle through
const pastelGradients = [
  "from-pink-50/70 via-white to-rose-100/30",
  "from-blue-50/70 via-white to-sky-100/30",
  "from-emerald-50/70 via-white to-teal-100/30",
  "from-purple-50/70 via-white to-indigo-100/30",
  "from-orange-50/70 via-white to-amber-100/30",
  "from-fuchsia-50/70 via-white to-pink-100/30",
  "from-violet-50/70 via-white to-purple-100/30",
  "from-teal-50/70 via-white to-emerald-100/30"
];

const Gameplay: React.FC<GameplayProps> = ({
  currentBenefit,
  allBenefits,
  currentIndex,
  totalCount,
  ratingOptions,
  onRate,
}) => {
  const [isShuffling, setIsShuffling] = useState(false);
  const [displayBenefit, setDisplayBenefit] = useState<Benefit>(currentBenefit);
  const [cardKey, setCardKey] = useState(0); // Key for triggering entry/exit animations
  const hasShuffledRef = useRef<Record<string, boolean>>({});

  // Decide if we should shuffle this card
  const shouldShuffle = () => {
    if (config.shuffleAnimation.firstOnly) {
      // Only shuffle if it's the very first benefit in the entire survey and we haven't shuffled it yet
      const key = 'first_card';
      if (!hasShuffledRef.current[key]) {
        hasShuffledRef.current[key] = true;
        return true;
      }
      return false;
    }
    // Shuffle every card if firstOnly is false
    return true;
  };

  useEffect(() => {
    let intervalId: any;
    let timeoutId: any;

    if (shouldShuffle()) {
      setIsShuffling(true);
      
      const duration = config.shuffleAnimation.duration;
      let delay = 60; // Initial fast cycle speed
      const startTime = Date.now();

      const runShuffle = () => {
        // Pick a random benefit that is NOT the current target benefit (to avoid premature reveal)
        const candidates = allBenefits.filter(b => b.id !== currentBenefit.id);
        const randomBenefit = candidates[Math.floor(Math.random() * candidates.length)] || currentBenefit;
        
        setDisplayBenefit(randomBenefit);

        const elapsed = Date.now() - startTime;
        if (elapsed < duration) {
          // Slow down the shuffle animation as time passes
          const progress = elapsed / duration;
          delay = 60 + Math.pow(progress, 2) * 240; // 60ms -> 300ms deceleration curve
          
          clearInterval(intervalId);
          intervalId = setInterval(runShuffle, delay);
        }
      };

      intervalId = setInterval(runShuffle, delay);

      // Stop shuffling and set the final target benefit
      timeoutId = setTimeout(() => {
        clearInterval(intervalId);
        setIsShuffling(false);
        setDisplayBenefit(currentBenefit);
        setCardKey(prev => prev + 1); // Trigger fade-in of final target card
      }, duration);

    } else {
      // Skip shuffle, directly display target benefit
      setIsShuffling(false);
      setDisplayBenefit(currentBenefit);
      setCardKey(prev => prev + 1);
    }

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [currentBenefit, allBenefits]);

  const handleRatingClick = (score: number) => {
    if (isShuffling) return; // Prevent double taps during shuffle
    onRate(currentBenefit.id, score);
  };

  // Progress percentage calculation
  const progressPercent = (currentIndex / totalCount) * 100;

  // Pick background pastel gradient dynamically based on current index
  const bgClass = pastelGradients[currentIndex % pastelGradients.length];

  return (
    <div className={`flex-1 flex flex-col justify-between p-6 select-none bg-gradient-to-br ${bgClass} transition-all duration-700 ease-in-out`}>
      {/* Progress Section */}
      <div className="w-full pt-4">
        <div className="flex justify-between items-center text-xs font-black text-slate-400 mb-2">
          <span className="uppercase tracking-wider">Progress</span>
          <span className="font-mono bg-slate-100/80 border border-slate-200/40 px-2 py-0.5 rounded text-slate-600">
            {currentIndex} / {totalCount}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-slate-100/80 rounded-full overflow-hidden border border-slate-200/40">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ backgroundColor: config.accent }}
            className="h-full rounded-full"
          />
        </div>
      </div>

      {/* Benefit Card Container */}
      <div className="flex-1 flex items-center justify-center py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${cardKey}-${displayBenefit.id}`}
            initial={isShuffling ? { scale: 0.98, opacity: 0.9 } : { scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="w-full max-w-[280px] aspect-[4/5] bg-white border border-slate-200/50 rounded-[24px] shadow-xl hover:shadow-2xl transition-shadow flex flex-col overflow-hidden p-4 relative"
            style={{ borderRadius: `${config.cardRadius || 24}px` }}
          >
            {/* Soft decorative background tint */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-transparent pointer-events-none" />

            {/* Illustration Frame */}
            <div className="flex-1 w-full rounded-[18px] overflow-hidden border border-slate-100 bg-white relative z-10">
              <BenefitSprite
                sheet={displayBenefit.sheet}
                index={displayBenefit.index}
                alt={displayBenefit.title}
                className={isShuffling ? "blur-[0.5px] scale-[1.01]" : ""}
              />
            </div>

            {/* Title text */}
            <div className="py-4 text-center z-10 flex-shrink-0">
              <h3 className={`text-base font-black tracking-tight text-slate-800 leading-tight transition-all duration-200 ${
                isShuffling ? "opacity-40 scale-[0.98] blur-[0.5px]" : "opacity-100 scale-100"
              }`}>
                {displayBenefit.title}
              </h3>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Rating Buttons Section (Optimized as a Grid) */}
      <div className="pb-4">
        <p className="text-center text-[10px] font-black text-slate-400 tracking-widest uppercase mb-3">
          Pilih pendapatmu
        </p>

        {/* Grid Tile layout optimized for mobile screens */}
        <div className="grid grid-cols-2 gap-2 w-full max-w-sm mx-auto">
          {ratingOptions.map((opt, idx) => {
            const isLast = idx === ratingOptions.length - 1;
            const isOddCount = ratingOptions.length % 2 !== 0;

            return (
              <button
                key={opt.score}
                disabled={isShuffling}
                onClick={() => handleRatingClick(opt.score)}
                className={`rating-btn py-3 px-2 bg-white border border-slate-200/60 rounded-2xl shadow-sm flex flex-col items-center justify-center gap-1.5 text-center border-b-[3px] border-b-slate-300 hover:border-brand hover:border-b-brand-dark focus:outline-none transition-all cursor-pointer ${
                  isShuffling ? "opacity-50 cursor-not-allowed border-b-slate-200" : ""
                } ${
                  isLast && isOddCount ? "col-span-2 py-3.5" : ""
                }`}
              >
                {opt.emoji && (
                  <span className="text-2xl filter drop-shadow-sm select-none">
                    {opt.emoji}
                  </span>
                )}
                <span className="text-slate-800 tracking-tight font-extrabold text-[11px] leading-tight">
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Gameplay;
