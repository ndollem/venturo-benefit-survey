import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
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

// Confident deceleration curve (ease-out-expo). No bounce.
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

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

const highlightKeywords = (text: string) => {
  const categories = [
    {
      regex: /(flexible hybrid|work from home|private workspace|workspace|kantor|interior)/gi,
      className: "bg-slate-100 text-slate-700 px-1 rounded font-extrabold shadow-2xs border border-slate-200/50"
    },
    {
      regex: /(macbook|laptop|monitor|claude max)/gi,
      className: "bg-blue-50 text-blue-700 px-1 rounded font-extrabold shadow-2xs border border-blue-200/30"
    },
    {
      regex: /(bonus|insentif|cicilan|subsidi|tunjangan|voucher|budget|gratis|plafon)/gi,
      className: "bg-emerald-50 text-emerald-700 px-1 rounded font-extrabold shadow-2xs border border-emerald-200/30"
    },
    {
      regex: /(coaching|mentoring|training|course|buku|sertifikasi|sharing)/gi,
      className: "bg-violet-50 text-violet-700 px-1 rounded font-extrabold shadow-2xs border border-violet-200/30"
    },
    {
      regex: /(employee|award|reward|inovasi|appreciation|apresiasi|founder)/gi,
      className: "bg-amber-50 text-amber-700 px-1 rounded font-extrabold shadow-2xs border border-amber-200/30"
    },
    {
      regex: /(olahraga|gym|futsal|badminton)/gi,
      className: "bg-rose-50 text-rose-700 px-1 rounded font-extrabold shadow-2xs border border-rose-200/30"
    },
    {
      regex: /(makan siang|snack|minuman)/gi,
      className: "bg-orange-50 text-orange-700 px-1 rounded font-extrabold shadow-2xs border border-orange-200/30"
    },
    {
      regex: /(freelance)/gi,
      className: "bg-cyan-50 text-cyan-700 px-1 rounded font-extrabold shadow-2xs border border-cyan-200/30"
    }
  ];

  const combinedRegex = /(flexible hybrid|work from home|private workspace|workspace|kantor|interior|macbook|laptop|monitor|claude max|bonus|insentif|cicilan|subsidi|tunjangan|voucher|budget|gratis|plafon|coaching|mentoring|training|course|buku|sertifikasi|sharing|employee|award|reward|inovasi|appreciation|apresiasi|founder|olahraga|gym|futsal|badminton|makan siang|snack|minuman|freelance)/gi;

  const parts = text.split(combinedRegex);
  return parts.map((part, index) => {
    const lower = part.toLowerCase();
    const matchedCat = categories.find(cat => lower.match(cat.regex));
    if (matchedCat) {
      return (
        <span key={index} className={`${matchedCat.className} inline-block mx-0.5`}>
          {part}
        </span>
      );
    }
    return part;
  });
};

// Short, mode-specific prompt above the verdict buttons.
const buttonPrompts: Record<string, string> = {
  full: "Pilih pendapatmu",
  priority: "Bukan prioritas? Nilai cepat",
  skip: "Bukan prioritas? Lewati"
};

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
  const prefersReduced = useReducedMotion();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [confettiCoords, setConfettiCoords] = useState({ x: 0, y: 0 });

  // Lock inputs while the reveal is animating in, to prevent double taps.
  const lockMs = prefersReduced ? 120 : 320;
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), lockMs);
    return () => clearTimeout(timer);
  }, [currentBenefit.id, lockMs]);

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
      setConfettiCoords({ x: clientX - rect.left, y: clientY - rect.top });
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

  const progressPercent = (currentIndex / totalCount) * 100;
  const bgGradient = pastelGradients[currentIndex % pastelGradients.length];

  // --- Gameplay method resolution ---
  const mode = config.gameplayMode;
  const isFull = mode === 'full';
  const singleColumn = mode === 'skip';
  const bigCard = !isFull; // priority & skip afford a roomier, illustration-led card

  // full:     all 5 rating options
  // skip:     only the "skip" (score 1)
  // priority: a positive verdict (score 4) + skip (score 1) — slots carry the top picks
  const displayOptions: RatingOption[] = isFull
    ? ratingOptions
    : mode === 'skip'
      ? ratingOptions.filter(opt => opt.score === 1)
      : ratingOptions.filter(opt => opt.score === 4 || opt.score === 1);

  const isLargeSlots = priorities.length > 5;

  // --- Reveal choreography (reduced-motion aware) ---
  const cardVariants = prefersReduced
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { when: 'beforeChildren', duration: 0.2 } },
        exit: { opacity: 0, transition: { duration: 0.12 } }
      }
    : {
        initial: { opacity: 0, scale: 0.92, y: 28 },
        animate: {
          opacity: 1,
          scale: 1,
          y: 0,
          transition: {
            type: 'spring' as const,
            stiffness: 420,
            damping: 32,
            mass: 0.7,
            when: 'beforeChildren' as const,
            delayChildren: 0.05,
            staggerChildren: 0.06
          }
        },
        exit: {
          opacity: 0,
          scale: 0.96,
          y: -22,
          transition: { duration: 0.16, ease: EASE_OUT_EXPO } // exit faster than entrance
        }
      };

  const childVariants = prefersReduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE_OUT_EXPO } }
      };

  // The illustration is the hero moment: it settles from soft+scaled to sharp.
  const illustrationVariants = prefersReduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
    : {
        initial: { opacity: 0, scale: 1.06, filter: 'blur(8px)' },
        animate: {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          transition: { duration: 0.45, ease: EASE_OUT_EXPO }
        }
      };

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

          {/* Priority helper note */}
          <p className="text-[9px] sm:text-[10px] text-slate-500 font-extrabold tracking-tight text-center mt-2.5 bg-slate-900/5 px-2.5 py-1 rounded-full border border-slate-200/20 max-w-[290px] mx-auto leading-normal">
            💡 Tap slot di kanan untuk pilih Top {priorities.length} benefit terpentingmu. Bisa diganti kapan saja.
          </p>
        </div>

        {/* Benefit Card Container */}
        <div className="flex-1 flex items-center justify-center py-2 sm:py-4 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBenefit.id}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={`w-full bg-white border border-slate-200/50 rounded-[24px] shadow-xl transition-shadow flex flex-col overflow-hidden p-4 relative ${
                bigCard
                  ? "max-w-[260px] xs:max-w-[285px] sm:max-w-[310px] min-h-[410px] xs:min-h-[445px] sm:min-h-[480px]"
                  : "max-w-[240px] xs:max-w-[260px] sm:max-w-[280px] min-h-[340px] xs:min-h-[360px] sm:min-h-[380px]"
              }`}
              style={{ borderRadius: `${config.cardRadius || 24}px` }}
            >
              {/* Soft decorative background tint */}
              <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-transparent pointer-events-none" />

              {/* Category Tag */}
              <motion.div variants={childVariants} className={`flex justify-center z-10 ${bigCard ? "mt-2 mb-4" : "mt-1 mb-2.5"}`}>
                <span className="text-[9px] sm:text-[10px] uppercase font-black tracking-widest text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200/30">
                  {currentBenefit.category}
                </span>
              </motion.div>

              {/* Illustration Frame (Strict 1x1 aspect ratio to prevent asset distortion).
                  In compact (full) mode the square is capped so the taller button grid still fits the phone frame. */}
              <motion.div
                variants={illustrationVariants}
                className={`aspect-square rounded-[18px] overflow-hidden border border-slate-100 bg-white relative z-10 flex-shrink-0 mx-auto ${
                  bigCard ? "w-full" : "h-[180px] sm:h-[200px]"
                }`}
              >
                <BenefitSprite
                  sheet={currentBenefit.sheet}
                  index={currentBenefit.index}
                  alt={currentBenefit.title}
                />
              </motion.div>

              {/* Title text */}
              <motion.div
                variants={childVariants}
                className={`text-center z-10 flex-shrink-0 flex flex-col items-center gap-1.5 ${bigCard ? "py-5 mt-2" : "py-3"}`}
              >
                <h3 className={`font-black tracking-tight text-slate-800 leading-normal ${
                  bigCard ? "text-base sm:text-lg md:text-xl px-1.5" : "text-xs sm:text-sm px-1"
                }`}>
                  {highlightKeywords(currentBenefit.title)}
                </h3>
              </motion.div>

              {/* Card Footer info (compact mode hides it to reclaim vertical space for the full button grid) */}
              {bigCard && (
                <motion.div
                  variants={childVariants}
                  className="mt-auto pt-2 flex justify-between items-center border-t border-slate-100 text-[8px] sm:text-[9px] font-black text-slate-400/80 tracking-wider relative z-10"
                >
                  <span className="uppercase">Survey {currentIndex + 1}/{totalCount}</span>
                  <span className="font-mono">VENTURO #{(currentBenefit.index + 1).toString().padStart(3, '0')}</span>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Verdict Buttons Section */}
        <div className="pb-2 sm:pb-4 relative z-10">
          <p className="text-center text-[10px] font-black text-slate-400 tracking-widest uppercase mb-2 sm:mb-3">
            {buttonPrompts[mode] || buttonPrompts.full}
          </p>

          {/* Grid Tile layout optimized for mobile screens */}
          <div className={`grid gap-2 w-full max-w-sm mx-auto ${singleColumn ? "grid-cols-1" : "grid-cols-2"}`}>
            {displayOptions.map((opt, idx) => {
              const isLast = idx === displayOptions.length - 1;
              const isOddCount = displayOptions.length % 2 !== 0;

              return (
                <button
                  key={opt.score}
                  disabled={isTransitioning}
                  onClick={() => handleRatingClick(opt.score)}
                  className={`rating-btn py-2.5 px-2 bg-white border border-slate-200/60 rounded-2xl shadow-sm flex flex-col items-center justify-center gap-1 text-center border-b-[3px] border-b-slate-300 hover:border-brand hover:border-b-brand-dark focus:outline-none transition-all cursor-pointer ${
                    isTransitioning ? "opacity-50 cursor-not-allowed border-b-slate-200" : ""
                  } ${
                    isLast && isOddCount && isFull ? "col-span-2 py-3" : ""
                  } ${
                    bigCard ? "py-3.5" : ""
                  }`}
                >
                  {opt.emoji && (
                    <span className="text-xl sm:text-2xl filter drop-shadow-sm select-none">
                      {opt.emoji}
                    </span>
                  )}
                  <span className={`text-slate-800 tracking-tight font-extrabold leading-tight ${
                    bigCard ? "text-xs sm:text-sm" : "text-[10px] sm:text-[11px]"
                  }`}>
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Priority Slots Sidebar (Right side) */}
      <div className="w-[72px] sm:w-[84px] bg-slate-900/5 border-l border-slate-200/50 backdrop-blur-xs flex flex-col items-center py-4 px-1 gap-1.5 overflow-y-auto overscroll-contain z-20">
        <span className="text-[8px] sm:text-[9px] font-black text-slate-400 tracking-wider uppercase text-center mt-2 leading-none flex-shrink-0">
          PRIORITASMU
        </span>

        <div className="flex-1 flex flex-col justify-start py-2 gap-1.5 w-full px-1">
          {priorities.map((benefitId, idx) => {
            const assignedBenefit = benefitId ? allBenefits.find(b => b.id === benefitId) : null;

            return (
              <button
                key={idx}
                disabled={isTransitioning}
                onClick={(e) => handlePriorityClick(idx, e)}
                className={`rounded-xl flex items-center justify-center relative transition-all border cursor-pointer flex-shrink-0 ${
                  isLargeSlots
                    ? "w-11 h-11 sm:w-13 sm:h-13"
                    : "w-12 h-12 sm:w-14 sm:h-14"
                } ${
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
