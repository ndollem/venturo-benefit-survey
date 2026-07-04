import React from 'react';
import { motion } from 'framer-motion';
import { Play, Timer, Sparkles } from 'lucide-react';
import config from '../config/survey.config';

interface SplashScreenProps {
  onStart: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onStart }) => {
  return (
    <div className="flex-1 flex flex-col justify-between p-6 text-center select-none bg-[url(/images/splash.webp)] bg-cover bg-center relative">
      {/* Top 40% Area (Header, Titles & Description) */}
      <div className="flex flex-col items-center justify-start pt-4 max-w-sm mx-auto">
        {/* Decorative top badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-xs font-semibold text-orange-600 tracking-wide uppercase mb-[8vh]"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Internal Survey
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xs uppercase font-extrabold tracking-widest text-slate-400 mb-2"
        >
          {config.title}
        </motion.h2>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-4xl font-black text-slate-800 leading-tight tracking-tight mb-4"
        >
          {config.subtitle}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-sm text-slate-500 font-medium px-4 mb-5 leading-relaxed"
        >
          Cari tahu benefit apa yang paling berharga menurut seluruh tim Venturo. Suaramu menentukan prioritas perusahaan!
        </motion.p>

        {/* Time duration indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 border border-slate-200/50 rounded-xl text-slate-600 text-xs font-bold shadow-sm"
        >
          <Timer className="w-4 h-4 text-slate-500" />
          <span>Durasi: {config.estimatedDuration}</span>
        </motion.div>
      </div>

      {/* Action Button Section */}
      <div className="pb-12 px-4">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStart}
          style={{ '--accent': config.accent } as React.CSSProperties}
          className="w-full py-4 px-6 bg-[var(--accent)] hover:bg-orange-600 text-white font-extrabold rounded-2xl shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer text-base uppercase tracking-wider"
        >
          <span>Mulai Survey</span>
          <Play className="w-4 h-4 fill-white" />
        </motion.button>
      </div>
    </div>
  );
};

export default SplashScreen;
