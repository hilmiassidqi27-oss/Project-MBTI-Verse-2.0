import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Database,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { authenticateAdmin, isFirebaseConfigured, AdminSession } from '../services/firebase';
import { BrandLogo } from './BrandLogo';

interface AdminLoginProps {
  onLoginSuccess: (session: AdminSession) => void;
  onBackToCandidate: () => void;
  isDarkMode: boolean;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onBackToCandidate,
  isDarkMode
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isCloudAuth = isFirebaseConfigured();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Silakan masukkan email administrator.');
      return;
    }

    if (!password) {
      setErrorMessage('Silakan masukkan kata sandi akun admin.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await authenticateAdmin(email, password);
      if (res.success && res.session) {
        onLoginSuccess(res.session);
      } else {
        setErrorMessage(res.error || 'Autentikasi gagal. Periksa kembali data login Anda.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi gangguan jaringan saat autentikasi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto pt-24 pb-16 px-4 min-h-[85vh] flex flex-col justify-center">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`w-full rounded-2xl border p-6 sm:p-8 transition-all shadow-2xl relative overflow-hidden ${
          isDarkMode
            ? 'bg-[#111b34] border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50'
        }`}
      >
        {/* Glow Accent */}
        <div
          className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-30 ${
            isDarkMode ? 'bg-indigo-600' : 'bg-indigo-300'
          }`}
        />

        {/* Back Button */}
        <button
          onClick={onBackToCandidate}
          id="back-to-candidate-from-login-button"
          className={`flex items-center gap-1.5 text-xs mb-6 transition-colors ${
            isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Layar Asesmen</span>
        </button>

        {/* Header Badge & Icon */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center shadow-md">
              <BrandLogo size="sm" />
            </div>
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Lock className="w-4 h-4" />
            </div>
          </div>

          <div
            className={`font-data-mono text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1.5 border font-semibold ${
              isCloudAuth
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                : 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30'
            }`}
          >
            <Database className="w-3 h-3" />
            <span>{isCloudAuth ? 'FIREBASE AUTH CLOUD' : 'LOCAL ENTERPRISE GATE'}</span>
          </div>
        </div>

        <div className="font-data-mono text-[11px] text-indigo-400 font-semibold tracking-wider uppercase mb-1">
          PORTAL ADMINISTRATOR & HRD
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
          Masuk ke Dashboard Admin
        </h1>
        <p className={`text-xs leading-relaxed mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          Akses terbatas untuk monitoring hasil asesmen psikometri seluruh unit kerja dan ekspor data rekapitulasi.
        </p>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 mb-5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <div className="leading-snug">{errorMessage}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className={`block text-xs font-label-caps font-semibold uppercase mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Email Administrator
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                id="admin-login-email-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="nama.admin@dianpandupratama.co.id"
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs sm:text-sm border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isDarkMode
                    ? 'bg-slate-900/90 border-slate-700 text-white placeholder-slate-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={`text-xs font-label-caps font-semibold uppercase ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Kata Sandi
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="admin-login-password-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-xs sm:text-sm border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isDarkMode
                    ? 'bg-slate-900/90 border-slate-700 text-white placeholder-slate-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
                title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Session */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 rounded border-slate-700 bg-slate-900"
              />
              <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Ingat sesi login saya</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            id="admin-login-submit-button"
            disabled={isLoading}
            className={`w-full mt-2 py-3 px-4 rounded-xl text-xs font-label-caps font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg active:scale-98 ${
              isLoading
                ? 'bg-indigo-800 text-indigo-300 cursor-wait'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Memvalidasi Akses...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Masuk ke Panel Admin</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security Footnote */}
        <div className="mt-6 pt-4 border-t border-slate-800/60 text-center">
          <p className="text-[11px] text-slate-500 font-data-mono flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            SESI TERENKRIPSI // LOG AUDIT OPERASIONAL AKTIF
          </p>
        </div>
      </motion.div>
    </div>
  );
};
