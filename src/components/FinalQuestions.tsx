import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Smile, Info } from 'lucide-react';
import config from '../config/survey.config';

interface FinalQuestionsProps {
  onSubmit: (stayReason: string, leaveReason: string) => void;
}

const FinalQuestions: React.FC<FinalQuestionsProps> = ({ onSubmit }) => {
  const [stayReason, setStayReason] = useState('');
  const [leaveReason, setLeaveReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(stayReason, leaveReason);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-gradient-to-br from-slate-50 via-white to-orange-50/20 overflow-y-auto max-h-screen">
      {/* Title */}
      <div className="pt-6 text-center">
        <motion.span 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-4xl block mb-2"
        >
          🏁
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-black text-slate-800 tracking-tight"
        >
          Langkah Terakhir!
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-slate-400 font-semibold text-sm mt-1"
        >
          Bantu kami memahami jawabanmu lebih dalam.
        </motion.p>
      </div>

      {/* Inputs Form */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-center gap-6 max-w-sm w-full mx-auto px-2 py-6">
        
        {/* Question 1 */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-2"
        >
          <label className="text-sm font-black text-slate-700 tracking-tight flex items-center gap-1">
            <Smile className="w-4 h-4 text-orange-500" />
            <span>Benefit yang membuat bertahan:</span>
          </label>
          <p className="text-xs text-slate-400 font-bold leading-tight">
            Benefit apa yang menurut anda paling membuat anda bertahan bekerja di Venturo?
          </p>
          <textarea
            value={stayReason}
            onChange={(e) => setStayReason(e.target.value)}
            rows={3}
            placeholder="Tulis pendapatmu disini... (opsional)"
            className="w-full p-4 border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 rounded-2xl bg-white text-slate-800 text-sm font-bold shadow-sm transition-all focus:outline-none placeholder:text-slate-400 placeholder:font-medium resize-none"
          />
        </motion.div>

        {/* Question 2 */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-2"
        >
          <label className="text-sm font-black text-slate-700 tracking-tight flex items-center gap-1">
            <Info className="w-4 h-4 text-orange-500" />
            <span>Benefit pemicu resign:</span>
          </label>
          <p className="text-xs text-slate-400 font-bold leading-tight">
            Benefit apa yang paling membuat Anda mempertimbangkan untuk resign apabila tidak tersedia?
          </p>
          <textarea
            value={leaveReason}
            onChange={(e) => setLeaveReason(e.target.value)}
            rows={3}
            placeholder="Tulis pendapatmu disini... (opsional)"
            className="w-full p-4 border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 rounded-2xl bg-white text-slate-800 text-sm font-bold shadow-sm transition-all focus:outline-none placeholder:text-slate-400 placeholder:font-medium resize-none"
          />
        </motion.div>
      </form>

      {/* Submit Button */}
      <div className="pb-8 px-4">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          style={{ '--accent': config.accent } as React.CSSProperties}
          className="w-full py-4 px-6 bg-[var(--accent)] hover:bg-orange-600 text-white font-extrabold rounded-2xl shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer text-base uppercase tracking-wider"
        >
          <span>Kirim Jawaban</span>
          <Send className="w-4.5 h-4.5" />
        </motion.button>
      </div>
    </div>
  );
};

export default FinalQuestions;
