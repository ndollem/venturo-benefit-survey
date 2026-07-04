import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import config from '../config/survey.config';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = "Mengirim jawaban..." }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none bg-white">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        className="mb-6"
      >
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
      </motion.div>
      <h2 className="text-xl font-black text-slate-800 tracking-tight mb-2">
        {message}
      </h2>
      <p className="text-sm font-semibold text-slate-400">
        Mohon tunggu sebentar.
      </p>
    </div>
  );
};

export const SuccessScreen: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none bg-gradient-to-br from-slate-50 via-white to-emerald-50/20">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-6 w-20 h-20 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center shadow-sm"
      >
        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
      </motion.div>
      <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-3">
        Terima Kasih! 🎉
      </h2>
      <p className="text-sm text-slate-500 font-semibold leading-relaxed max-w-xs mx-auto px-2">
        Jawaban kamu berhasil disimpan. Semoga benefit impianmu masuk daftar prioritas perusahaan! 😄
      </p>
    </div>
  );
};

interface ErrorScreenProps {
  errorMsg?: string;
  onRetry: () => void;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({ 
  errorMsg = "Gagal mengirim jawaban. Periksa koneksi internet Anda.", 
  onRetry 
}) => {
  return (
    <div className="flex-1 flex flex-col justify-between p-6 text-center select-none bg-gradient-to-br from-slate-50 via-white to-rose-50/20">
      {/* Decorative spacing */}
      <div />

      <div className="max-w-xs mx-auto">
        <motion.div
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          className="mb-6 w-16 h-16 bg-rose-50 border border-rose-100 rounded-full flex items-center justify-center mx-auto shadow-sm"
        >
          <AlertTriangle className="w-8 h-8 text-rose-500" />
        </motion.div>
        <h2 className="text-xl font-black text-slate-800 tracking-tight mb-2">
          Gagal Mengirim Jawaban ⚠️
        </h2>
        <p className="text-xs text-rose-500/80 font-bold px-4 leading-relaxed mb-4">
          {errorMsg}
        </p>
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">
          Jawabanmu aman & tidak perlu mengulang survey
        </p>
      </div>

      <div className="pb-8 px-4 w-full max-w-sm mx-auto">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRetry}
          style={{ '--accent': config.accent } as React.CSSProperties}
          className="w-full py-4 px-6 bg-[var(--accent)] hover:bg-orange-600 text-white font-extrabold rounded-2xl shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer text-sm uppercase tracking-wider"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Coba Lagi</span>
        </motion.button>
      </div>
    </div>
  );
};
