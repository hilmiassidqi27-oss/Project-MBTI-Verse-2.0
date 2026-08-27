import React, { useState } from 'react';
import { MBTIResult, UserProfile } from '../types';
import {
  Download,
  RotateCcw,
  LayoutDashboard,
  ShieldCheck,
  Zap,
  Target,
  Users,
  CheckCircle2,
  Share2,
  Check,
  FileText,
  Building,
  Printer
} from 'lucide-react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { exportResultToPDF } from '../utils/pdfExport';

interface AssessmentResultViewProps {
  result: MBTIResult;
  user: UserProfile;
  onRetake: () => void;
  onGoToAdmin: () => void;
  isDarkMode: boolean;
  submissionId?: string;
}

export const AssessmentResultView: React.FC<AssessmentResultViewProps> = ({
  result,
  user,
  onRetake,
  onGoToAdmin,
  isDarkMode,
  submissionId
}) => {
  const [copied, setCopied] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // Trigger celebration confetti on view load
  React.useEffect(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // ignore in iframe environments if blocked
    }
  }, []);

  const handleDownloadPDF = () => {
    setIsExportingPdf(true);
    try {
      exportResultToPDF(result, user);
    } catch (err) {
      console.error('PDF export error:', err);
      // Fallback to window.print()
      window.print();
    } finally {
      setTimeout(() => setIsExportingPdf(false), 800);
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleShare = () => {
    const reportLink = submissionId
      ? `${window.location.origin}${window.location.pathname}?report=${submissionId}`
      : window.location.href;
    const text = `Hasil Asesmen MBTI Lapangan saya: ${result.code} - "${result.nickname}" (${user.position} - ${user.department}). Tautan: ${reportLink}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const { EI, SN, TF, JP } = result.dimensions;

  const dimensionList = [
    {
      axis: 'Pemusatan Energi',
      leftCode: EI.leftCode,
      rightCode: EI.rightCode,
      leftLabel: 'Ekstrovert (E)',
      rightLabel: 'Introvert (I)',
      leftPct: EI.leftPct,
      rightPct: EI.rightPct,
      dominant: EI.dominantCode === 'I' ? 'Introvert (I)' : 'Ekstrovert (E)',
      clarity: EI.clarityScore
    },
    {
      axis: 'Pengolahan Informasi',
      leftCode: SN.leftCode,
      rightCode: SN.rightCode,
      leftLabel: 'Sensing (S)',
      rightLabel: 'Intuition (N)',
      leftPct: SN.leftPct,
      rightPct: SN.rightPct,
      dominant: SN.dominantCode === 'S' ? 'Sensing (S)' : 'Intuition (N)',
      clarity: SN.clarityScore
    },
    {
      axis: 'Pengambilan Keputusan',
      leftCode: TF.leftCode,
      rightCode: TF.rightCode,
      leftLabel: 'Thinking (T)',
      rightLabel: 'Feeling (F)',
      leftPct: TF.leftPct,
      rightPct: TF.rightPct,
      dominant: TF.dominantCode === 'T' ? 'Thinking (T)' : 'Feeling (F)',
      clarity: TF.clarityScore
    },
    {
      axis: 'Pola Kerja Lapangan',
      leftCode: JP.leftCode,
      rightCode: JP.rightCode,
      leftLabel: 'Judging (J)',
      rightLabel: 'Perceiving (P)',
      leftPct: JP.leftPct,
      rightPct: JP.rightPct,
      dominant: JP.dominantCode === 'J' ? 'Judging (J)' : 'Perceiving (P)',
      clarity: JP.clarityScore
    }
  ];

  return (
    <div className="w-full max-w-[1020px] mx-auto pt-24 pb-20 px-4 sm:px-6">
      {/* Top Banner with User Details */}
      <div
        className={`w-full rounded-2xl p-6 sm:p-8 border mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all shadow-xl ${
          isDarkMode ? 'bg-[#111b34] border-slate-800' : 'bg-white border-slate-200 shadow-slate-200/50'
        }`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center font-data-mono font-bold text-xl border ${
              isDarkMode
                ? 'bg-indigo-950/80 border-indigo-500/50 text-indigo-300'
                : 'bg-indigo-50 border-indigo-300 text-indigo-700'
            }`}
          >
            {result.code}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-xl sm:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {user.fullName}
              </h1>
              <span className="font-data-mono text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                {user.nik}
              </span>
            </div>
            <div className={`text-xs sm:text-sm mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {user.position} • {user.department} {user.workArea ? `• ${user.workArea}` : ''}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto no-print">
          <button
            onClick={handleShare}
            id="share-result-button"
            className={`px-3.5 py-2 rounded-lg text-xs font-label-caps font-semibold uppercase tracking-wider flex items-center gap-1.5 border transition-all ${
              copied
                ? 'bg-emerald-600 text-white border-emerald-600'
                : isDarkMode
                ? 'border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
                : 'border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
            title="Salin tautan laporan ke clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tautan Tersalin!' : 'Bagikan Laporan'}</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            id="download-report-pdf-button"
            disabled={isExportingPdf}
            className={`px-4 py-2 rounded-lg text-xs font-label-caps font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
              isDarkMode
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/25'
            } ${isExportingPdf ? 'opacity-70 cursor-wait' : ''}`}
            title="Unduh file dokumen PDF resmi"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExportingPdf ? 'Membuat PDF...' : 'Unduh PDF'}</span>
          </button>

          <button
            onClick={handlePrintReport}
            id="print-report-button"
            className={`px-3 py-2 rounded-lg text-xs font-label-caps font-semibold uppercase tracking-wider flex items-center gap-1.5 border transition-all ${
              isDarkMode
                ? 'border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
                : 'border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
            title="Cetak via printer / dialog print browser"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak</span>
          </button>

          <button
            onClick={onRetake}
            id="retake-assessment-button"
            className={`px-3.5 py-2 rounded-lg text-xs font-label-caps font-semibold uppercase tracking-wider flex items-center gap-1.5 border transition-all ${
              isDarkMode
                ? 'border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
                : 'border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Ulangi Tes</span>
          </button>

          <button
            onClick={onGoToAdmin}
            id="view-admin-dashboard-button"
            className={`px-3.5 py-2 rounded-lg text-xs font-label-caps font-semibold uppercase tracking-wider flex items-center gap-1.5 border transition-all ${
              isDarkMode
                ? 'border-indigo-500/40 bg-indigo-950/40 text-indigo-300 hover:bg-indigo-900/60'
                : 'border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>
      </div>

      {/* Main Hero Result Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`w-full rounded-2xl p-6 sm:p-10 border mb-8 relative overflow-hidden transition-all shadow-2xl ${
          isDarkMode
            ? 'bg-[#111b34]/95 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50'
        }`}
      >
        {/* Glow Accent */}
        <div
          className={`absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-40 ${
            isDarkMode ? 'bg-indigo-600' : 'bg-indigo-300'
          }`}
        />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <div className="font-data-mono text-xs text-emerald-500 font-semibold tracking-widest uppercase mb-1">
              ● PROFIL PSIKOMETRIK TERVERIFIKASI
            </div>
            <div className="flex items-baseline gap-3">
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-indigo-400">
                {result.code}
              </h2>
              <span className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                &ldquo;{result.nickname}&rdquo;
              </span>
            </div>
          </div>
        </div>

        <p className={`text-sm sm:text-base leading-relaxed max-w-4xl ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
          {result.profile.industrialAnalysis}
        </p>
      </motion.div>

      {/* Dimensions Dual Bar Visualizers */}
      <div className="mb-10">
        <h3
          className={`font-label-caps text-xs sm:text-sm font-semibold uppercase tracking-widest mb-4 ${
            isDarkMode ? 'text-slate-400' : 'text-slate-600'
          }`}
        >
          Distribusi 4 Dimensi Kepribadian MBTI
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dimensionList.map((dim, idx) => {
            const isLeftDominant = dim.leftPct >= dim.rightPct;
            return (
              <div
                key={idx}
                className={`p-5 rounded-xl border transition-all ${
                  isDarkMode ? 'bg-[#111b34] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider font-label-caps">
                    {dim.axis}
                  </span>
                  <span className="font-data-mono text-xs px-2 py-0.5 rounded bg-slate-800/60 text-slate-300 border border-slate-700">
                    {dim.dominant} ({dim.clarity})
                  </span>
                </div>

                {/* Dimension Labels & Percentages */}
                <div className="flex justify-between items-center text-xs font-semibold mb-2">
                  <span className={isLeftDominant ? 'text-emerald-400 font-bold' : isDarkMode ? 'text-slate-400' : 'text-slate-500'}>
                    {dim.leftLabel} : <span className="font-data-mono">{dim.leftPct}%</span>
                  </span>
                  <span className={!isLeftDominant ? 'text-indigo-400 font-bold' : isDarkMode ? 'text-slate-400' : 'text-slate-500'}>
                    <span className="font-data-mono">{dim.rightPct}%</span> : {dim.rightLabel}
                  </span>
                </div>

                {/* Visual Dual-Bar Track */}
                <div className="w-full h-3 rounded-full bg-slate-800/80 overflow-hidden flex p-0.5 border border-slate-700/60">
                  <div
                    className={`h-full rounded-l-full transition-all duration-700 ${
                      isLeftDominant
                        ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                        : 'bg-slate-700/60'
                    }`}
                    style={{ width: `${dim.leftPct}%` }}
                  />
                  <div
                    className={`h-full rounded-r-full transition-all duration-700 ${
                      !isLeftDominant
                        ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]'
                        : 'bg-slate-700/60'
                    }`}
                    style={{ width: `${dim.rightPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Industrial Operational Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Card: Operational Strengths */}
        <div
          className={`p-6 sm:p-7 rounded-2xl border transition-all ${
            isDarkMode ? 'bg-[#111b34] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-2.5 mb-4">
            <Zap className="w-5 h-5 text-amber-400" />
            <h4 className={`font-semibold text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Kekuatan Operasional di Lapangan
            </h4>
          </div>
          <ul className="space-y-3">
            {result.profile.operationalStrengths.map((str, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Card: Crisis & Safety Orientation */}
        <div
          className={`p-6 sm:p-7 rounded-2xl border transition-all ${
            isDarkMode ? 'bg-[#111b34] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-2.5 mb-4">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h4 className={`font-semibold text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Respon Krisis & Kepatuhan HSE
            </h4>
          </div>
          <div className="space-y-4 text-xs sm:text-sm">
            <div>
              <span className="font-semibold text-indigo-400 block mb-1">Perilaku Tanggap Darurat:</span>
              <p className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{result.profile.crisisResponse}</p>
            </div>
            <div>
              <span className="font-semibold text-emerald-400 block mb-1">Orientasi Keselamatan Kerja:</span>
              <p className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{result.profile.safetyOrientation}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Career Recommendations */}
      <div className="mb-8">
        <div className="flex items-center gap-2.5 mb-4">
          <Target className="w-5 h-5 text-indigo-400" />
          <h3
            className={`font-label-caps text-xs sm:text-sm font-semibold uppercase tracking-widest ${
              isDarkMode ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Rekomendasi Jabatan & Penugasan Lapangan Optimal
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {result.profile.careerRecommendations.map((career, i) => (
            <div
              key={i}
              className={`p-5 rounded-xl border flex flex-col justify-between transition-all ${
                isDarkMode ? 'bg-[#111b34] border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h5 className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {career.title}
                  </h5>
                  <span className="font-data-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {career.matchScore}% FIT
                  </span>
                </div>
                <p className={`text-xs leading-relaxed mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {career.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-auto pt-2 border-t border-slate-800/40">
                {career.keySkills.map((skill, si) => (
                  <span
                    key={si}
                    className="text-[10px] font-data-mono px-2 py-0.5 rounded bg-slate-800/60 text-slate-300 border border-slate-700/50"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
