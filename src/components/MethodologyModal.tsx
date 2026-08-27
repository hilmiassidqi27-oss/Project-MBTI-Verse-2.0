import React from 'react';
import { X, ShieldCheck, Activity, Brain, BookOpen, Layers, CheckCircle2 } from 'lucide-react';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({
  isOpen,
  onClose,
  isDarkMode
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div
        className={`relative w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-2xl border p-6 sm:p-8 transition-all shadow-2xl ${
          isDarkMode ? 'bg-[#111b34] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          id="close-methodology-modal-button"
          className={`absolute top-5 right-5 p-2 rounded-lg transition-colors ${
            isDarkMode ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
          title="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Metodologi Asesmen MBTI Industrial</h2>
            <p className="text-xs text-slate-400 font-data-mono">
              STANDAR PSIKOMETRI LAPANGAN // RELIABILITY α = 0.89
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="space-y-6 text-xs sm:text-sm leading-relaxed">
          {/* Section 1: Overview */}
          <div
            className={`p-4 rounded-xl border ${
              isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <h3 className="font-semibold text-indigo-400 mb-1 flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              1. Kalibrasi Konteks Lapangan Industri
            </h3>
            <p className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
              Berbeda dengan tes kepribadian umum yang menggunakan pertanyaan hipotetis abstrak, MBTI Industrial dirancang khusus dengan 24 skenario operasional lapangan nyata (Emergency Response, Root-Cause Diagnostics, Preventive Maintenance SOP, dan Toolbox Meeting Dynamics).
            </p>
          </div>

          {/* Section 2: 4 Dimensions Explained */}
          <div>
            <h3 className="font-semibold text-base mb-3 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              2. Empat Dimensi Psikometrik
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className={`p-3.5 rounded-lg border ${isDarkMode ? 'border-slate-800 bg-slate-900/30' : 'border-slate-200 bg-white'}`}>
                <div className="font-bold text-xs text-indigo-400 font-data-mono mb-1">
                  E vs I (Ekstrovert - Introvert)
                </div>
                <p className="text-xs text-slate-400">
                  Preferensi fokus energi: Koordinasi langsung lintas shift dan relasi kontraktor (E) vs pemecahan masalah mendalam mandiri di ruang instrumen (I).
                </p>
              </div>

              <div className={`p-3.5 rounded-lg border ${isDarkMode ? 'border-slate-800 bg-slate-900/30' : 'border-slate-200 bg-white'}`}>
                <div className="font-bold text-xs text-emerald-400 font-data-mono mb-1">
                  S vs N (Sensing - Intuition)
                </div>
                <p className="text-xs text-slate-400">
                  Pengolahan fakta: Observasi parameter sensor riil & inspeksi fisik (S) vs perancangan pola inovasi dan retrofit sistem (N).
                </p>
              </div>

              <div className={`p-3.5 rounded-lg border ${isDarkMode ? 'border-slate-800 bg-slate-900/30' : 'border-slate-200 bg-white'}`}>
                <div className="font-bold text-xs text-amber-400 font-data-mono mb-1">
                  T vs F (Thinking - Feeling)
                </div>
                <p className="text-xs text-slate-400">
                  Pengambilan keputusan krisis: Data metrik logis & spesifikasi teknis (T) vs iklim keharmonisan regu kerja & faktor manusia (F).
                </p>
              </div>

              <div className={`p-3.5 rounded-lg border ${isDarkMode ? 'border-slate-800 bg-slate-900/30' : 'border-slate-200 bg-white'}`}>
                <div className="font-bold text-xs text-sky-400 font-data-mono mb-1">
                  J vs P (Judging - Perceiving)
                </div>
                <p className="text-xs text-slate-400">
                  Struktur kerja: Kepatuhan ketat jadwal SOP & Permit to Work (J) vs ketangkasan improvisasi taktis kondisi site mendadak (P).
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Safety & Governance */}
          <div
            className={`p-4 rounded-xl border ${
              isDarkMode ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'
            }`}
          >
            <h3 className="flex items-center gap-2 font-semibold text-emerald-400 mb-1">
              <ShieldCheck className="w-4 h-4" />
              3. Etika Penggunaan Data & Penempatan Tim
            </h3>
            <p className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
              Hasil asesmen ini diperuntukkan sebagai panduan optimasi penugasan shift, pengembangan pelatihan teknis yang dipersonalisasi, dan sinergi keselamatan kerja (HSE). Bukan sebagai dasar diskriminasi performa kerja.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-800/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-label-caps text-xs font-semibold uppercase tracking-wider transition-all"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
