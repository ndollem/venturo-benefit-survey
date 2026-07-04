import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import config from '../config/survey.config';

interface CategoryIntroProps {
  category: string;
  benefitsCount: number;
  onComplete: () => void;
}

const CategoryIntro: React.FC<CategoryIntroProps> = ({ category, benefitsCount, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, config.categoryIntroDuration);
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  // Extract category icon and name (e.g. "💰 Financial & Compensation" -> icon "💰", name "Financial & Compensation")
  const match = category.match(/^([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDC00-\uDFFF])\s*(.*)$/);
  const icon = match ? match[1] : '⭐️';
  const name = match ? match[2] : category;

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none bg-gradient-to-br from-slate-900 to-slate-950 text-white">
      {/* Category Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: [0, 1.2, 1], rotate: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-7xl mb-6 filter drop-shadow-md"
      >
        {icon}
      </motion.div>

      {/* Category Name */}
      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="text-2xl font-black tracking-tight px-4 leading-tight mb-2 uppercase text-orange-400"
      >
        {name}
      </motion.h2>

      {/* Benefit Count Label */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="text-slate-400 font-bold text-sm tracking-wide bg-slate-800/60 border border-slate-700/30 px-4 py-1.5 rounded-full"
      >
        {benefitsCount} Benefit
      </motion.p>
    </div>
  );
};

export default CategoryIntro;
