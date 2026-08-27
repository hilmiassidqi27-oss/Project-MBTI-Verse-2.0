import React from 'react';
import { CheckCircle2, ShieldCheck, FileCheck, ArrowRight, UserCheck, Lock } from 'lucide-react';
import { motion } from 'motion/react';

interface CompletionScreenProps {
  onStartNew: () => void;
  candidateName: string;
  isDarkMode: boolean;
  submissionId?: string;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({
  onStartNew,
  candidateName,
  isDarkMode,
  submissionId
}) => {
  return (
    <div className="w-full max-w-xl mx-auto pt-28 pb-20 px-4 flex flex-col items-center justify-center text-center min-h-[75vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className={`w-full p-8 sm:p-10 rounded-2xl border transition-all shadow-2xl relative overflow-hidden ${
          isDarkMode
            ? 'bg-[#111b34] border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50'
        }`}
      >
        {/* Glow Accent */}
        <div
          className={`absolute -top-20 -right-20 w-52 h-52 rounded-full blur-3xl pointer-events-none opacity-30 ${
            isDarkMode ? 'bg-emerald-600' : 'bg-emerald-300'
          }`}
        />

        {/* Success Icon Badge */}
        <div className="relative mx-auto w-18 h-18 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping opacity-50" />
          <div className="relative w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-9 h-9 text-emerald-400" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase mb-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Asesmen Berhasil Dikirim</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold mb-2">
          Terima Kasih, {candidateName}!
        </h2>

        <p className={`text-xs sm:text-sm leading-relaxed mb-6 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
          Jawaban asesmen psikometrik Anda telah tersimpan secara aman ke dalam sistem database seleksi & rekrutmen perusahaan.
        </p>

        {/* Confidential Notice Card */}
        <div className={`p-4 rounded-xl border text-left mb-6 space-y-2.5 text-xs ${
          isDarkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-2 font-semibold text-slate-200">
            <Lock className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className={isDarkMode ? 'text-slate-200' : 'text-slate-800'}>Kerahasiaan Hasil Asesmen</span>
          </div>
          <p className={isDarkMode ? 'text-slate-400 leading-relaxed' : 'text-slate-600 leading-relaxed'}>
            Sesuai kebijakan evaluasi psikometrik kerja internal, skor dan analisis detail profil kepribadian akan dievaluasi langsung oleh tim <strong>HRD & Tim Penguji Kompetensi</strong>.
          </p>
          {submissionId && (
            <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Kode Registrasi Submisi:</span>
              <span className="font-mono font-bold text-indigo-400">{submissionId}</span>
            </div>
          )}
        </div>

        {/* Next Steps Guide */}
        <div className={`p-3.5 rounded-xl border text-left mb-6 text-xs flex items-start gap-3 ${
          isDarkMode ? 'bg-indigo-950/20 border-indigo-500/30 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-800'
        }`}>
          <UserCheck className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="leading-snug">
            <span className="font-semibold block mb-0.5">Langkah Selanjutnya:</span>
            Silakan konfirmasi ke tim HR atau pengawas bahwa Anda telah menyelesaikan tes ini.
          </div>
        </div>

        {/* Button to Finish / Reset for Next Candidate */}
        <button
          onClick={onStartNew}
          className="w-full py-3 px-5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 transition-all"
        >
          <FileCheck className="w-4 h-4" />
          <span>Selesai / Mulai Asesmen Baru</span>
        </button>
      </motion.div>
    </div>
  );
};
