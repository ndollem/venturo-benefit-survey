import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, User, AlertCircle } from 'lucide-react';
import config from '../config/survey.config';

interface NameInputProps {
  onSubmit: (name: string) => void;
}

const NameInput: React.FC<NameInputProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(true);
      return;
    }
    if (name.length > 50) {
      return; // Handled by maxLength on input, but good for validation
    }
    onSubmit(name.trim());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (e.target.value.trim()) {
      setError(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-gradient-to-br from-slate-50 via-white to-orange-50/20 select-none">
      {/* Title section */}
      <div className="pt-8 text-center">
        <motion.span 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-4xl block mb-4"
        >
          👋
        </motion.span>
        <motion.h2 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-black text-slate-800 tracking-tight"
        >
          Halo!
        </motion.h2>
        <motion.p 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-500 font-semibold text-sm mt-1"
        >
          Sebelum kita mulai, siapa nama kamu?
        </motion.p>
      </div>

      {/* Input section */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto px-4">
        <motion.div 
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <User className={`w-5 h-5 transition-colors ${error ? 'text-rose-500' : 'text-slate-400'}`} />
          </div>
          <input
            type="text"
            value={name}
            onChange={handleInputChange}
            maxLength={50}
            placeholder="Masukkan nama lengkap..."
            className={`w-full py-4 pl-12 pr-4 bg-white border rounded-2xl text-slate-800 text-base font-bold placeholder:text-slate-400 placeholder:font-medium shadow-sm transition-all focus:outline-none focus:ring-2 ${
              error 
                ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-100' 
                : 'border-slate-200 focus:border-orange-500 focus:ring-orange-100'
            }`}
          />
        </motion.div>

        {/* Real-time Validation Error Banner */}
        <div className="h-10 mt-2 relative">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center gap-1.5 text-rose-500 text-xs font-bold pl-2"
              >
                <AlertCircle className="w-4 h-4" />
                <span>Nama tidak boleh kosong</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>

      {/* Button section */}
      <div className="pb-12 px-4">
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
          <span>Mulai</span>
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

export default NameInput;
