import React, { useState, useEffect } from 'react';
import { Brain, CheckCircle2, ShieldCheck, Activity, Cpu, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface CompletionScreenProps {
  onComplete: () => void;
  candidateName: string;
  isDarkMode: boolean;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({
  onComplete,
  candidateName,
  isDarkMode
}) => {
  const [progress, setProgress] = useState<number>(10);
  const [currentStage, setCurrentStage] = useState<number>(0);

  const stages = [
    { label: 'Mengumpulkan 24 respons skenario operasional...', icon: Activity },
    { label: 'Menghitung rasio 4 sumbu psikometrik (E/I, S/N, T/F, J/P)...', icon: Brain },
    { label: 'Memetakan kecocokan HSE, tanggap krisis, & kompetensi lapangan...', icon: ShieldCheck },
    { label: 'Menyimpan profil submisi dan memfinalisasi laporan...', icon: Cpu }
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setProgress(40);
      setCurrentStage(1);
    }, 450);

    const timer2 = setTimeout(() => {
      setProgress(75);
      setCurrentStage(2);
    }, 900);

    const timer3 = setTimeout(() => {
      setProgress(98);
      setCurrentStage(3);
    }, 1400);

    const timer4 = setTimeout(() => {
      setProgress(100);
      onComplete();
    }, 1900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div className="w-full max-w-xl mx-auto pt-32 pb-20 px-4 flex flex-col items-center justify-center text-center min-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`w-full p-8 sm:p-10 rounded-2xl border transition-all shadow-2xl relative overflow-hidden ${
          isDarkMode
            ? 'bg-[#111b34] border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50'
        }`}
      >
        {/* Glow Accent */}
        <div
          className={`absolute -top-20 -right-20 w-52 h-52 rounded-full blur-3xl pointer-events-none opacity-40 ${
            isDarkMode ? 'bg-indigo-600' : 'bg-indigo-300'
          }`}
        />

        {/* Brain/CPU Icon Pulse */}
        <div className="relative mx-auto w-16 h-16 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-2xl bg-indigo-500/20 animate-ping opacity-60" />
          <div className="relative w-16 h-16 rounded-2xl bg-indigo-600 border border-indigo-400/40 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Brain className="w-8 h-8 animate-pulse" />
          </div>
        </div>

        <div className="font-data-mono text-xs text-indigo-400 font-semibold tracking-widest uppercase mb-1">
          DIAGNOSTIK PSIKOMETRI SELESAI
        </div>

        <h2 className="text-xl sm:text-2xl font-bold mb-2">
          Memproses Hasil Asesmen
        </h2>
        <p className={`text-xs sm:text-sm mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          Kandidat: <span className="font-semibold text-indigo-400">{candidateName}</span>
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800/80 h-2.5 rounded-full overflow-hidden mb-6 p-0.5 border border-slate-700/60">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut', duration: 0.3 }}
          />
        </div>

        {/* Step Items */}
        <div className="space-y-3 text-left mb-6">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            const isFinished = idx < currentStage;
            const isCurrent = idx === currentStage;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 p-2.5 rounded-lg border text-xs transition-all ${
                  isFinished
                    ? isDarkMode
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : isCurrent
                    ? isDarkMode
                      ? 'bg-indigo-950/40 border-indigo-500/40 text-indigo-300 animate-pulse'
                      : 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    : isDarkMode
                    ? 'border-transparent text-slate-500'
                    : 'border-transparent text-slate-400'
                }`}
              >
                {isFinished ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Icon className={`w-4 h-4 shrink-0 ${isCurrent ? 'text-indigo-400' : 'text-slate-500'}`} />
                )}
                <span className="font-medium truncate">{stage.label}</span>
              </div>
            );
          })}
        </div>

        {/* Instant Skip Button */}
        <button
          onClick={onComplete}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-label-caps font-semibold uppercase tracking-wider flex items-center justify-center gap-2 border transition-all ${
            isDarkMode
              ? 'border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white'
              : 'border-slate-300 hover:bg-slate-100 text-slate-700'
          }`}
        >
          <span>Buka Laporan Lengkap</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    </div>
  );
};
