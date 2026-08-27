import React, { useEffect, useState, useRef } from 'react';
import { Question, LikertUIStyle } from '../types';
import { ChevronLeft, ChevronRight, CheckCircle2, ListFilter, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AssessmentQuestionCardProps {
  questions: Question[];
  currentIndex: number;
  answers: Record<number, number>;
  onAnswer: (questionId: number, value: number) => void;
  onNext: () => void;
  onPrev: () => void;
  onJumpTo: (index: number) => void;
  onFinish: () => void;
  likertStyle: LikertUIStyle;
  isDarkMode: boolean;
}

const EMOJI_OPTIONS = [
  { val: 1, emoji: '😠', label: 'Sangat Tidak Setuju' },
  { val: 2, emoji: '🙁', label: 'Tidak Setuju' },
  { val: 3, emoji: '😐', label: 'Netral' },
  { val: 4, emoji: '🙂', label: 'Setuju' },
  { val: 5, emoji: '😄', label: 'Sangat Setuju' }
];

export const AssessmentQuestionCard: React.FC<AssessmentQuestionCardProps> = ({
  questions,
  currentIndex,
  answers,
  onAnswer,
  onNext,
  onPrev,
  onJumpTo,
  onFinish,
  likertStyle,
  isDarkMode
}) => {
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const currentAnswer = answers[currentQuestion.id];
  const [showQuestionGrid, setShowQuestionGrid] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);
  const formattedPercent = `${progressPercent < 10 ? '0' : ''}${progressPercent}%`;

  const isLastQuestion = currentIndex === totalQuestions - 1;
  const isAllAnswered = questions.every(q => answers[q.id] !== undefined);
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timeout on unmount or question change
  useEffect(() => {
    return () => {
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
      }
    };
  }, [currentIndex]);

  const handleSelectOption = (value: number) => {
    onAnswer(currentQuestion.id, value);

    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
    }

    // Smooth auto-advance to the next question with brief visual feedback
    autoAdvanceTimerRef.current = setTimeout(() => {
      if (isLastQuestion) {
        onFinish();
      } else {
        onNext();
      }
    }, 260);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Numbers 1-5
      if (['1', '2', '3', '4', '5'].includes(e.key)) {
        const val = parseInt(e.key, 10);
        handleSelectOption(val);
      }
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (currentAnswer !== undefined) {
          if (isLastQuestion) {
            onFinish();
          } else {
            onNext();
          }
        }
      }
      if (e.key === 'ArrowLeft') {
        if (currentIndex > 0) onPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion.id, currentAnswer, currentIndex, isLastQuestion, onAnswer, onNext, onPrev, onFinish]);

  return (
    <div className="w-full max-w-[840px] mx-auto pt-24 pb-16 px-4 sm:px-6">
      {/* Top Progress Header */}
      <div className="w-full mb-8 sm:mb-10">
        <div className="flex justify-between items-end mb-2.5">
          <div className="flex items-center gap-3">
            <span className="font-data-mono text-xs sm:text-sm font-semibold text-emerald-500 tracking-widest uppercase">
              SOAL {currentIndex + 1 < 10 ? `0${currentIndex + 1}` : currentIndex + 1} DARI {totalQuestions}
            </span>
            <span
              className={`text-[11px] font-label-caps px-2 py-0.5 rounded border hidden sm:inline-block ${
                isDarkMode ? 'bg-slate-900/80 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}
            >
              {currentQuestion.scenarioContext}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowQuestionGrid(!showQuestionGrid)}
              className={`text-xs font-data-mono flex items-center gap-1 px-2.5 py-1 rounded transition-colors border ${
                showQuestionGrid
                  ? isDarkMode
                    ? 'bg-indigo-950 border-indigo-500 text-indigo-300'
                    : 'bg-indigo-50 border-indigo-300 text-indigo-700 font-medium'
                  : isDarkMode
                  ? 'border-slate-800 text-slate-400 hover:text-slate-200'
                  : 'border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
              title="Lihat Daftar Soal"
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>
                {answeredCount}/{totalQuestions} Terisi
              </span>
            </button>
            <span className="font-data-mono text-xs sm:text-sm text-slate-400 opacity-90">{formattedPercent}</span>
          </div>
        </div>

        {/* Progress Bar with Emerald Glow */}
        <div
          className={`w-full h-[5px] rounded-full overflow-hidden relative ${
            isDarkMode ? 'bg-slate-800/80' : 'bg-slate-200'
          }`}
        >
          <div
            className="h-full bg-emerald-500 transition-all duration-300 ease-out rounded-full shadow-[0_0_12px_rgba(16,185,129,0.45)]"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>

        {/* Dropdown Quick Jumper Grid */}
        <AnimatePresence>
          {showQuestionGrid && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`mt-4 p-4 rounded-xl border overflow-hidden transition-all ${
                isDarkMode ? 'bg-[#111b34] border-slate-800' : 'bg-white border-slate-200 shadow-md'
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <span className="font-label-caps text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Daftar Navigasi Cepat Soal
                </span>
                <span className="text-xs text-slate-500 font-data-mono">
                  {isAllAnswered ? 'Semua soal telah dijawab' : `${totalQuestions - answeredCount} soal belum dijawab`}
                </span>
              </div>
              <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
                {questions.map((q, idx) => {
                  const isCurrent = idx === currentIndex;
                  const isDone = answers[q.id] !== undefined;
                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        onJumpTo(idx);
                        setShowQuestionGrid(false);
                      }}
                      className={`h-9 rounded flex items-center justify-center font-data-mono text-xs font-semibold transition-all border ${
                        isCurrent
                          ? 'border-indigo-500 bg-indigo-600 text-white shadow-sm'
                          : isDone
                          ? isDarkMode
                            ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-400'
                            : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                          : isDarkMode
                          ? 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                          : 'bg-slate-100 border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          id={`question-card-${currentQuestion.id}`}
          className={`w-full rounded-2xl p-6 sm:p-10 md:p-14 border relative transition-all duration-300 shadow-xl ${
            isDarkMode
              ? 'bg-[#111b34]/95 border-slate-800 text-white shadow-slate-950/40'
              : 'bg-white border-slate-200 text-slate-900 shadow-slate-200/60'
          }`}
        >
          {/* Subtle Inner Corner Accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-indigo-500/40 rounded-tl-2xl pointer-events-none" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-indigo-500/40 rounded-tr-2xl pointer-events-none" />

          {/* Dimension Tag */}
          <div className="mb-6 flex items-center justify-between">
            <span
              className={`text-[11px] font-label-caps uppercase tracking-wider px-2.5 py-1 rounded font-semibold ${
                isDarkMode ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
              }`}
            >
              Dimensi: {currentQuestion.leftTrait} vs {currentQuestion.rightTrait}
            </span>
            <span className="text-xs font-data-mono text-slate-400 hidden sm:inline-block">
              Tekan [1-5] pada keyboard
            </span>
          </div>

          {/* Question Text */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold leading-relaxed sm:leading-snug md:leading-relaxed mb-10 sm:mb-14">
            &ldquo;{currentQuestion.text}&rdquo;
          </h2>

          {/* Likert Scale Interactive Elements */}
          <div className="w-full mt-6 mb-4">
            {/* Style 1: Boxes / Numbers (1 to 5) */}
            {likertStyle === 'numbers' && (
              <div className="flex justify-between items-center gap-2 sm:gap-4 relative py-4 sm:py-6">
                {/* Background Line */}
                <div
                  className={`absolute top-1/2 left-4 right-4 h-1 -translate-y-1/2 rounded-full z-0 ${
                    isDarkMode ? 'bg-slate-800' : 'bg-slate-200'
                  }`}
                />

                {[1, 2, 3, 4, 5].map(val => {
                  const isSelected = currentAnswer === val;
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleSelectOption(val)}
                      id={`likert-btn-${val}`}
                      className={`relative z-10 w-11 h-11 sm:w-14 sm:h-14 rounded-xl border-2 flex items-center justify-center font-label-caps text-sm sm:text-base font-bold transition-all duration-200 group active:scale-95 ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] scale-110'
                          : isDarkMode
                          ? 'bg-[#0b1326] border-slate-700 text-slate-400 hover:border-indigo-400 hover:text-white'
                          : 'bg-white border-slate-300 text-slate-600 hover:border-indigo-500 hover:text-indigo-600 shadow-sm'
                      }`}
                    >
                      <span>{val}</span>
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] text-white">
                          ✓
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Style 2: Slider Nodes */}
            {likertStyle === 'nodes' && (
              <div className="relative w-full py-6 sm:py-8">
                {/* Track Line */}
                <div
                  className={`absolute top-1/2 left-0 w-full h-[3px] -translate-y-1/2 rounded-full pointer-events-none ${
                    isDarkMode ? 'bg-slate-800' : 'bg-slate-200'
                  }`}
                />
                {/* Tick Marks */}
                <div className="absolute top-1/2 left-0 w-full flex justify-between px-[10%] -translate-y-1/2 pointer-events-none">
                  {[1, 2, 3, 4, 5].map(t => (
                    <div key={t} className={`w-1 h-3 rounded-full opacity-40 ${isDarkMode ? 'bg-slate-600' : 'bg-slate-400'}`} />
                  ))}
                </div>

                {/* Nodes */}
                <div className="relative z-10 flex justify-between items-center w-full">
                  {[1, 2, 3, 4, 5].map(val => {
                    const isSelected = currentAnswer === val;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleSelectOption(val)}
                        id={`likert-node-${val}`}
                        className={`w-10 h-10 flex items-center justify-center group focus:outline-none transition-transform ${
                          isSelected ? 'scale-125' : 'hover:scale-110'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-md border-2 transition-all duration-200 ${
                            isSelected
                              ? 'bg-indigo-600 border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.5)] rotate-45'
                              : isDarkMode
                              ? 'bg-[#0b1326] border-slate-600 group-hover:border-slate-400'
                              : 'bg-white border-slate-400 group-hover:border-slate-600'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Style 3: Expressive Emoji */}
            {likertStyle === 'emoji' && (
              <div className="flex justify-between items-center gap-2 sm:gap-6 relative py-4 sm:py-6 px-2 sm:px-6">
                {/* Track Line */}
                <div
                  className={`absolute top-1/2 left-6 right-6 h-1 -translate-y-1/2 rounded-full z-0 ${
                    isDarkMode ? 'bg-slate-800' : 'bg-slate-200'
                  }`}
                />

                {EMOJI_OPTIONS.map(opt => {
                  const isSelected = currentAnswer === opt.val;
                  return (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => handleSelectOption(opt.val)}
                      id={`likert-emoji-${opt.val}`}
                      title={opt.label}
                      className={`relative z-10 flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 ${
                        isSelected
                          ? 'scale-125'
                          : 'opacity-60 hover:opacity-100 hover:scale-110'
                      }`}
                    >
                      <span className="text-3xl sm:text-4xl drop-shadow-md select-none">{opt.emoji}</span>
                      {isSelected && (
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Scale End Labels */}
            <div
              className={`flex justify-between w-full mt-3 font-label-caps text-xs font-semibold uppercase tracking-wider select-none ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              <span className="text-left flex items-center gap-1">
                <span className="text-rose-400">●</span> Sangat Tidak Setuju
              </span>
              <span className="text-right flex items-center gap-1">
                Sangat Setuju <span className="text-emerald-400">●</span>
              </span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Actions Footer */}
      <div className="w-full flex justify-between items-center mt-8 gap-4">
        {/* Previous Button */}
        <button
          type="button"
          onClick={onPrev}
          disabled={currentIndex === 0}
          id="assessment-prev-button"
          className={`h-12 px-6 flex items-center justify-center gap-2 border rounded-lg font-label-caps text-xs font-semibold uppercase tracking-widest transition-all ${
            currentIndex === 0
              ? 'opacity-30 cursor-not-allowed border-slate-700 text-slate-600'
              : isDarkMode
              ? 'border-emerald-500/60 text-emerald-400 hover:bg-emerald-950/30 hover:border-emerald-400 active:scale-95'
              : 'border-emerald-600 text-emerald-700 hover:bg-emerald-50 active:scale-95'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Sebelumnya</span>
        </button>

        {/* Next or Finish Button */}
        {isLastQuestion ? (
          <button
            type="button"
            onClick={onFinish}
            disabled={!currentAnswer}
            id="assessment-finish-button"
            className={`h-12 px-8 flex items-center justify-center gap-2 rounded-lg font-label-caps text-xs font-semibold uppercase tracking-widest transition-all shadow-lg active:scale-95 ${
              !currentAnswer
                ? 'opacity-40 cursor-not-allowed bg-slate-700 text-slate-400'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/30 hover:shadow-emerald-500/50'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Lihat Hasil Asesmen</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            disabled={!currentAnswer}
            id="assessment-next-button"
            className={`h-12 px-8 flex items-center justify-center gap-2 rounded-lg font-label-caps text-xs font-semibold uppercase tracking-widest transition-all shadow-lg active:scale-95 ${
              !currentAnswer
                ? 'opacity-40 cursor-not-allowed bg-slate-700 text-slate-400'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25 hover:shadow-indigo-500/40'
            }`}
          >
            <span>Selanjutnya</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
