import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Benefit, RatingOption } from '../types/survey';
import BenefitSprite from './BenefitSprite';
import { Confetti } from './Confetti';
import config from '../config/survey.config';

interface GameplayProps {
  currentBenefit: Benefit;
  allBenefits: Benefit[];
  currentIndex: number;
  totalCount: number;
  ratingOptions: RatingOption[];
  onRate: (benefitId: string, score: number) => void;
  priorities: (string | null)[];
  onSelectPriority: (benefitId: string, slotIndex: number) => void;
}

// 15 beautiful soft pastel gradients to dynamically cycle through
const pastelGradients = [
  "linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)", // Rose
  "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)", // Blue
  "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)", // Emerald
  "linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)", // Indigo
  "linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)", // Orange
  "linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)", // Fuchsia
  "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)", // Violet
  "linear-gradient(135deg, #F0FDFA 0%, #CCFBF1 100%)", // Teal
  "linear-gradient(135deg, #FFFDF5 0%, #FEF3C7 100%)", // Amber
  "linear-gradient(135deg, #ECFEFF 0%, #CFFAFE 100%)", // Cyan
  "linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)", // Sky
  "linear-gradient(135deg, #F7FEE7 0%, #ECFCCB 100%)", // Lime
  "linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)", // Slate
  "linear-gradient(135deg, #FFF5F5 0%, #FED7D7 100%)", // Sakura Pink
  "linear-gradient(135deg, #FEFCE8 0%, #FEF9C3 100%)"  // Yellow
];

const Gameplay: React.FC<GameplayProps> = ({
  currentBenefit,
  allBenefits,
  currentIndex,
  totalCount,
  ratingOptions,
  onRate,
  priorities,
  onSelectPriority,
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [confettiCoords, setConfettiCoords] = useState({ x: 0, y: 0 });

  // Transition lock to prevent double taps/fast clicks while card is animating
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 450); // locks inputs for the duration of spring animation
    return () => clearTimeout(timer);
  }, [currentBenefit.id]);

  // Preload the next benefit's image to ensure instantaneous rendering
  useEffect(() => {
    if (currentIndex + 1 < allBenefits.length) {
      const nextBenefit = allBenefits[currentIndex + 1];
      const img = new Image();
      img.src = `/images/${nextBenefit.sheet}`;
    }
  }, [currentIndex, allBenefits]);

  const triggerConfetti = (clientX: number, clientY: number) => {
    const container = document.querySelector('.app-container');
    if (container) {
      const rect = container.getBoundingClientRect();
      const relativeX = clientX - rect.left;
      const relativeY = clientY - rect.top;
      setConfettiCoords({ x: relativeX, y: relativeY });
    } else {
      setConfettiCoords({ x: clientX, y: clientY });
    }
    setConfettiTrigger(prev => prev + 1);
  };

  const handleRatingClick = (score: number) => {
    if (isTransitioning) return; // Prevent double taps during card transition
    onRate(currentBenefit.id, score);
  };

  const handlePriorityClick = (slotIndex: number, e: React.MouseEvent<HTMLButtonElement>) => {
    if (isTransitioning) return;

    // Assign current benefit to the slot (replaces old benefit if occupied)
    triggerConfetti(e.clientX, e.clientY);
    onSelectPriority(currentBenefit.id, slotIndex);
  };

  // Progress percentage calculation
  const progressPercent = (currentIndex / totalCount) * 100;

  // Pick background pastel gradient dynamically based on current index
  const bgGradient = pastelGradients[currentIndex % pastelGradients.length];

  return (
    <div className="flex-1 flex flex-row select-none relative overflow-hidden isolate w-full h-full">
      {/* Dynamic Background Gradient Cross-fade */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={bgGradient}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
            style={{ background: bgGradient }}
          />
        </AnimatePresence>
      </div>

      {/* Confetti Explosion Canvas */}
      <Confetti trigger={confettiTrigger} x={confettiCoords.x} y={confettiCoords.y} />

      {/* Main Survey Gameplay Section (Left side) */}
      <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 overflow-hidden">
        {/* Progress Section */}
        <div className="w-full pt-2 sm:pt-4 relative z-10">
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

          {/* Small priority helper note */}
          <p className="text-[9px] sm:text-[10px] text-slate-500 font-extrabold tracking-tight text-center mt-2.5 bg-slate-900/5 px-2.5 py-1 rounded-full border border-slate-200/20 max-w-[290px] mx-auto leading-normal">
            💡 Tap angka di kanan untuk {priorities.length} Prioritas Khusus terpentingmu (slot terbatas & permanen).
          </p>
        </div>

        {/* Benefit Card Container */}
        <div className="flex-1 flex items-center justify-center py-2 sm:py-4 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBenefit.id}
              initial={{ scale: 0.4, opacity: 0, y: 50, rotate: -3 }}
              animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -50, rotate: 3 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 22,
                mass: 1
              }}
              className="w-full max-w-[240px] xs:max-w-[260px] sm:max-w-[280px] aspect-[4/5] bg-white border border-slate-200/50 rounded-[24px] shadow-xl hover:shadow-2xl transition-shadow flex flex-col overflow-hidden p-4 relative"
              style={{ borderRadius: `${config.cardRadius || 24}px` }}
            >
              {/* Soft decorative background tint */}
              <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-transparent pointer-events-none" />

              {/* Illustration Frame */}
              <div className="flex-1 w-full rounded-[18px] overflow-hidden border border-slate-100 bg-white relative z-10">
                <BenefitSprite
                  sheet={currentBenefit.sheet}
                  index={currentBenefit.index}
                  alt={currentBenefit.title}
                />
              </div>

              {/* Title text */}
              <div className="py-3 text-center z-10 flex-shrink-0">
                <h3 className="text-sm sm:text-base font-black tracking-tight text-slate-800 leading-tight">
                  {currentBenefit.title}
                </h3>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Rating Buttons Section (Optimized as a Grid) */}
        <div className="pb-2 sm:pb-4 relative z-10">
          <p className="text-center text-[10px] font-black text-slate-400 tracking-widest uppercase mb-2 sm:mb-3">
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
                  disabled={isTransitioning}
                  onClick={() => handleRatingClick(opt.score)}
                  className={`rating-btn py-2.5 px-2 bg-white border border-slate-200/60 rounded-2xl shadow-sm flex flex-col items-center justify-center gap-1 text-center border-b-[3px] border-b-slate-300 hover:border-brand hover:border-b-brand-dark focus:outline-none transition-all cursor-pointer ${
                    isTransitioning ? "opacity-50 cursor-not-allowed border-b-slate-200" : ""
                  } ${
                    isLast && isOddCount ? "col-span-2 py-3" : ""
                  }`}
                >
                  {opt.emoji && (
                    <span className="text-xl sm:text-2xl filter drop-shadow-sm select-none">
                      {opt.emoji}
                    </span>
                  )}
                  <span className="text-slate-800 tracking-tight font-extrabold text-[10px] sm:text-[11px] leading-tight">
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Priority Slots Sidebar (Right side) */}
      <div className="w-[72px] sm:w-[84px] bg-slate-900/5 border-l border-slate-200/50 backdrop-blur-xs flex flex-col items-center py-4 px-1 gap-2 overflow-y-auto z-20">
        <span className="text-[8px] sm:text-[9px] font-black text-slate-400 tracking-wider uppercase text-center mt-2 leading-none">
          PRIORITASMU
        </span>
        
        <div className="flex-1 flex flex-col justify-center gap-2 w-full px-1">
          {priorities.map((benefitId, idx) => {
            const assignedBenefit = benefitId ? allBenefits.find(b => b.id === benefitId) : null;
            
            return (
              <button
                key={idx}
                disabled={isTransitioning}
                onClick={(e) => handlePriorityClick(idx, e)}
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center relative transition-all border cursor-pointer ${
                  assignedBenefit 
                    ? "border-emerald-300 bg-white hover:border-brand shadow-sm overflow-hidden scale-100 hover:scale-105 active:scale-95" 
                    : "border-dashed border-slate-300 bg-white/40 hover:bg-white/80 hover:border-brand hover:scale-105 active:scale-95 shadow-xs"
                }`}
                title={assignedBenefit ? assignedBenefit.title : `Pilih Prioritas #${idx + 1}`}
              >
                {assignedBenefit ? (
                  <div className="w-full h-full relative">
                    <BenefitSprite
                      sheet={assignedBenefit.sheet}
                      index={assignedBenefit.index}
                      alt={assignedBenefit.title}
                    />
                    <div className="absolute bottom-0 right-0 bg-slate-800/80 backdrop-blur-xs text-white font-mono text-[8px] px-1 rounded-tl-md font-bold z-20 leading-none">
                      #{idx + 1}
                    </div>
                  </div>
                ) : (
                  <span className="font-mono text-xs sm:text-sm font-black text-slate-400">
                    {idx + 1}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Gameplay;
