import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Star, ShieldCheck, Lock, Sparkles } from 'lucide-react';
import config from '../config/survey.config';

interface TutorialProps {
  onComplete: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ onComplete }) => {
  const steps = [
    {
      icon: <Star className="w-6 h-6 text-orange-500" />,
      text: "Benefit akan muncul secara acak satu per satu disertai ilustrasi.",
      color: "from-orange-500/10 to-transparent"
    },
    {
      icon: <Sparkles className="w-6 h-6 text-amber-500" />,
      text: `Pilih ${config.prioritySlotsCount || 5} benefit paling penting bagi Anda untuk dimasukkan ke slot Prioritas Khusus di kanan.`,
      color: "from-amber-500/10 to-transparent"
    },
    {
      icon: <Lock className="w-6 h-6 text-rose-500" />,
      text: "Slot Prioritas Khusus ini terbatas dan TIDAK BISA diganti setelah terisi. Tentukan pilihan Anda secara cermat!",
      color: "from-rose-500/10 to-transparent"
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
      text: "Gunakan tombol rating di bawah (rating 1 s.d. 4) untuk menilai benefit lainnya.",
      color: "from-emerald-500/10 to-transparent"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-gradient-to-br from-slate-50 via-white to-orange-50/20 select-none">
      {/* Title */}
      <div className="pt-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-black text-slate-800 tracking-tight"
        >
          Cara Bermain 🎮
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-slate-400 font-semibold text-sm mt-1"
        >
          Baca petunjuk singkat berikut sebelum mulai.
        </motion.p>
      </div>

      {/* Rules Steps List */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex-1 flex flex-col justify-center gap-4 max-w-sm w-full mx-auto px-4"
      >
        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all relative overflow-hidden"
          >
            {/* Soft decorative background glow */}
            <div className={`absolute inset-0 bg-gradient-to-r ${step.color} opacity-40`} />
            
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center relative z-10 shadow-sm">
              {step.icon}
            </div>
            <p className="text-slate-600 font-bold text-sm leading-relaxed relative z-10">
              {step.text}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Action Button */}
      <div className="pb-12 px-4">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onComplete}
          style={{ '--accent': config.accent } as React.CSSProperties}
          className="w-full py-4 px-6 bg-[var(--accent)] hover:bg-orange-600 text-white font-extrabold rounded-2xl shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer text-base uppercase tracking-wider"
        >
          <span>Siap! Mulai Survey</span>
          <CheckCircle2 className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

export default Tutorial;
