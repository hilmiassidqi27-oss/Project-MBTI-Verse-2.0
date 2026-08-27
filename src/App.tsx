import React, { useState, useEffect } from 'react';
import { UserProfile, MBTIResult, SubmissionRecord, LikertUIStyle } from './types';
import { INDUSTRIAL_QUESTIONS } from './data/questions';
import { calculateMBTIResult } from './utils/scoring';
import { getStoredSubmissions, saveSubmission } from './utils/storage';
import {
  isFirebaseConfigured,
  subscribeToFirestoreSubmissions,
  saveSubmissionToFirestore,
  getActiveAdminSession,
  logoutAdmin,
  AdminSession
} from './services/firebase';
import { TopNavBar } from './components/TopNavBar';
import { RegistrationForm } from './components/RegistrationForm';
import { AssessmentQuestionCard } from './components/AssessmentQuestionCard';
import { AssessmentResultView } from './components/AssessmentResultView';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLogin } from './components/AdminLogin';
import { MethodologyModal } from './components/MethodologyModal';
import { CompletionScreen } from './components/CompletionScreen';

export function App() {
  const [currentView, setCurrentView] = useState<'register' | 'assessment' | 'completion' | 'result' | 'admin-login' | 'admin'>('register');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [likertStyle, setLikertStyle] = useState<LikertUIStyle>('numbers');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [currentResult, setCurrentResult] = useState<MBTIResult | null>(null);
  const [currentSubmissionId, setCurrentSubmissionId] = useState<string | undefined>(undefined);
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);

  // Load submissions & admin session on mount
  useEffect(() => {
    const loaded = getStoredSubmissions();
    setSubmissions(loaded);

    const activeSession = getActiveAdminSession();
    if (activeSession) {
      setAdminSession(activeSession);
    }

    // Subscribe to Firestore if configured
    if (isFirebaseConfigured()) {
      const unsub = subscribeToFirestoreSubmissions(cloudRecords => {
        if (cloudRecords && cloudRecords.length > 0) {
          setSubmissions(cloudRecords);
          try {
            localStorage.setItem('mbti_industrial_submissions_v1', JSON.stringify(cloudRecords));
          } catch {}
        } else {
          // If Firestore is empty on fresh database setup, sync existing local records to Firestore
          const localRecords = getStoredSubmissions();
          if (localRecords.length > 0) {
            localRecords.forEach(rec => {
              saveSubmissionToFirestore(rec);
            });
          }
        }
      });
      return () => unsub();
    }
  }, []);

  // Deep linking logic for ?report=SUB-XXXX and ?view=admin
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reportId = params.get('report');
    const viewParam = params.get('view');

    if (reportId) {
      const all = getStoredSubmissions();
      const found = all.find(s => s.id.toLowerCase() === reportId.toLowerCase());
      if (found) {
        setCurrentUser(found.user);
        setCurrentResult(found.result);
        setCurrentSubmissionId(found.id);
        setCurrentView('result');
      }
    } else if (viewParam === 'admin' || window.location.pathname === '/admin') {
      const activeSession = getActiveAdminSession();
      if (activeSession) {
        setAdminSession(activeSession);
        setCurrentView('admin');
      } else {
        setCurrentView('admin-login');
      }
    }
  }, []);

  // Update theme class on HTML / body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#0b1326';
      document.body.style.color = '#f8fafc';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#f8fafc';
      document.body.style.color = '#0f172a';
    }
  }, [isDarkMode]);

  // Handler: Start assessment from registration
  const handleStartAssessment = (profile: UserProfile) => {
    setCurrentUser(profile);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setCurrentResult(null);
    setCurrentSubmissionId(undefined);
    setCurrentView('assessment');
  };

  // Handler: Record answer
  const handleAnswer = (questionId: number, value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Handler: Next question
  const handleNext = () => {
    if (currentQuestionIndex < INDUSTRIAL_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  // Handler: Previous question
  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Handler: Jump to specific question
  const handleJumpTo = (index: number) => {
    if (index >= 0 && index < INDUSTRIAL_QUESTIONS.length) {
      setCurrentQuestionIndex(index);
    }
  };

  // Handler: Finish assessment -> show diagnostic Completion transition
  const handleFinishAssessment = () => {
    if (!currentUser) return;
    const computedResult = calculateMBTIResult(answers);
    setCurrentResult(computedResult);

    // Save to storage (and Firestore)
    const newRecord = saveSubmission(currentUser, computedResult, answers);
    setCurrentSubmissionId(newRecord.id);
    setSubmissions(prev => [newRecord, ...prev.filter(s => s.id !== newRecord.id)]);

    // Trigger Completion Screen first
    setCurrentView('completion');
  };

  // Handler: Transition from Completion Screen to Result View
  const handleCompletionDone = () => {
    setCurrentView('result');
  };

  // Handler: Retake assessment
  const handleRetake = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setCurrentResult(null);
    setCurrentSubmissionId(undefined);
    setCurrentView('assessment');
  };

  // Handler: Start fresh assessment (clear current user)
  const handleStartFresh = () => {
    setCurrentUser(null);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setCurrentResult(null);
    setCurrentSubmissionId(undefined);
    setCurrentView('register');
  };

  // Handler: Navigation request from Navbar or buttons
  const handleNavigate = (view: 'register' | 'assessment' | 'result' | 'admin') => {
    if (view === 'register') {
      handleStartFresh();
    } else if (view === 'admin') {
      if (adminSession) {
        setCurrentView('admin');
      } else {
        setCurrentView('admin-login');
      }
    } else {
      setCurrentView(view);
    }
  };

  // Handler: Successful admin login
  const handleAdminLoginSuccess = (session: AdminSession) => {
    setAdminSession(session);
    setCurrentView('admin');
  };

  // Handler: Admin logout
  const handleAdminLogout = async () => {
    await logoutAdmin();
    setAdminSession(null);
    setCurrentView('admin-login');
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? 'bg-[#0b1326] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
      }`}
    >
      {/* Top Fixed Navigation Bar */}
      <TopNavBar
        currentView={currentView === 'completion' ? 'assessment' : currentView}
        onNavigate={handleNavigate}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        likertStyle={likertStyle}
        onChangeLikertStyle={setLikertStyle}
        onOpenHelp={() => setShowHelpModal(true)}
        activeUserFullName={currentUser?.fullName}
        hasActiveAssessment={currentUser !== null}
        isAdminLoggedIn={Boolean(adminSession)}
        adminEmail={adminSession?.email}
        onAdminLogout={handleAdminLogout}
      />

      {/* Main Views */}
      <main className="w-full">
        {currentView === 'register' && (
          <RegistrationForm
            initialData={currentUser || undefined}
            onSubmit={handleStartAssessment}
            isDarkMode={isDarkMode}
          />
        )}

        {currentView === 'assessment' && (
          <AssessmentQuestionCard
            questions={INDUSTRIAL_QUESTIONS}
            currentIndex={currentQuestionIndex}
            answers={answers}
            onAnswer={handleAnswer}
            onNext={handleNext}
            onPrev={handlePrev}
            onJumpTo={handleJumpTo}
            onFinish={handleFinishAssessment}
            likertStyle={likertStyle}
            isDarkMode={isDarkMode}
          />
        )}

        {currentView === 'completion' && (
          <CompletionScreen
            onStartNew={handleStartFresh}
            candidateName={currentUser?.fullName || 'Kandidat'}
            isDarkMode={isDarkMode}
            submissionId={currentSubmissionId}
          />
        )}

        {currentView === 'result' && currentResult && currentUser && (
          <AssessmentResultView
            result={currentResult}
            user={currentUser}
            onRetake={handleRetake}
            onGoToAdmin={() => handleNavigate('admin')}
            isDarkMode={isDarkMode}
            submissionId={currentSubmissionId}
          />
        )}

        {currentView === 'admin-login' && (
          <AdminLogin
            onLoginSuccess={handleAdminLoginSuccess}
            onBackToCandidate={() => setCurrentView(currentUser ? (currentResult ? 'result' : 'assessment') : 'register')}
            isDarkMode={isDarkMode}
          />
        )}

        {currentView === 'admin' && adminSession && (
          <AdminDashboard
            submissions={submissions}
            onUpdateSubmissions={setSubmissions}
            onStartNewAssessment={handleStartFresh}
            isDarkMode={isDarkMode}
            adminSession={adminSession}
            onLogout={handleAdminLogout}
          />
        )}
      </main>

      {/* Methodology & Help Modal */}
      <MethodologyModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}

export default App;
