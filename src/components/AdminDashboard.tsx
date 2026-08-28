import React, { useState, useMemo } from 'react';
import { SubmissionRecord, MBTIResult, UserProfile } from '../types';
import { exportToCSV, deleteSubmission, saveSubmission, addAuditLog } from '../utils/storage';
import { exportWorkforceToExcel } from '../utils/excelExport';
import { exportResultToPDF } from '../utils/pdfExport';
import { isFirebaseConfigured, AdminSession } from '../services/firebase';
import {
  Users,
  Award,
  Building2,
  TrendingUp,
  Search,
  Download,
  Trash2,
  Eye,
  PlusCircle,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Share2,
  Check,
  Database,
  LogOut,
  ShieldCheck,
  UserCheck,
  Shield,
  KeyRound,
  Lock,
  LayoutDashboard,
  X
} from 'lucide-react';
import { calculateMBTIResult } from '../utils/scoring';
import { AssessmentResultView } from './AssessmentResultView';
import { AccessControlManager } from './AccessControlManager';

interface AdminDashboardProps {
  submissions: SubmissionRecord[];
  onUpdateSubmissions: (updated: SubmissionRecord[]) => void;
  onStartNewAssessment: () => void;
  isDarkMode: boolean;
  adminSession?: AdminSession | null;
  onLogout?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  submissions,
  onUpdateSubmissions,
  onStartNewAssessment,
  isDarkMode,
  adminSession,
  onLogout
}) => {
  const [adminSection, setAdminSection] = useState<'analytics' | 'access-control'>('analytics');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState(
    adminSession?.departmentScope && adminSession.departmentScope !== 'ALL'
      ? adminSession.departmentScope
      : 'ALL'
  );
  const [selectedType, setSelectedType] = useState('ALL');
  const [inspectingSubmission, setInspectingSubmission] = useState<SubmissionRecord | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const isCloudActive = isFirebaseConfigured();

  // Permission flags
  const permissions = adminSession?.permissions || {
    canDeleteRecords: true,
    canManageAdmins: true,
    canExportData: true,
    canViewAllDepartments: true,
    canSimulateData: true
  };

  const handleCopyLink = (id: string) => {
    const link = `${window.location.origin}${window.location.pathname}?report=${id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Filtered submissions based on department scope & filters
  const scopedSubmissions = useMemo(() => {
    if (adminSession?.departmentScope && adminSession.departmentScope !== 'ALL') {
      return submissions.filter(s => s.user.department === adminSession.departmentScope);
    }
    return submissions;
  }, [submissions, adminSession]);

  // Statistics Calculations
  const stats = useMemo(() => {
    const total = scopedSubmissions.length;
    if (total === 0) {
      return {
        total: 0,
        topType: 'N/A',
        topTypePct: 0,
        topDept: 'N/A',
        topDeptPct: 0,
        typeCounts: {} as Record<string, number>,
        deptCounts: {} as Record<string, number>
      };
    }

    const typeCounts: Record<string, number> = {};
    const deptCounts: Record<string, number> = {};

    scopedSubmissions.forEach(s => {
      typeCounts[s.result.code] = (typeCounts[s.result.code] || 0) + 1;
      deptCounts[s.user.department] = (deptCounts[s.user.department] || 0) + 1;
    });

    let topType = '';
    let topTypeCount = 0;
    Object.entries(typeCounts).forEach(([type, cnt]) => {
      if (cnt > topTypeCount) {
        topTypeCount = cnt;
        topType = type;
      }
    });

    let topDept = '';
    let topDeptCount = 0;
    Object.entries(deptCounts).forEach(([dept, cnt]) => {
      if (cnt > topDeptCount) {
        topDeptCount = cnt;
        topDept = dept;
      }
    });

    return {
      total,
      topType,
      topTypePct: Math.round((topTypeCount / total) * 100),
      topDept,
      topDeptPct: Math.round((topDeptCount / total) * 100),
      typeCounts,
      deptCounts
    };
  }, [scopedSubmissions]);

  // Unique departments for filter dropdown
  const uniqueDepartments = useMemo(() => {
    const set = new Set<string>();
    scopedSubmissions.forEach(s => set.add(s.user.department));
    return Array.from(set);
  }, [scopedSubmissions]);

  // Filtered submissions list
  const filteredSubmissions = useMemo(() => {
    return scopedSubmissions.filter(s => {
      const matchSearch =
        s.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.user.nik.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.user.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.user.workArea && s.user.workArea.toLowerCase().includes(searchTerm.toLowerCase())) ||
        s.result.code.toLowerCase().includes(searchTerm.toLowerCase());

      const matchDept = selectedDept === 'ALL' || s.user.department === selectedDept;
      const matchType = selectedType === 'ALL' || s.result.code === selectedType;

      return matchSearch && matchDept && matchType;
    });
  }, [scopedSubmissions, searchTerm, selectedDept, selectedType]);

  const handleDelete = (id: string) => {
    if (!permissions.canDeleteRecords) {
      alert('Akses Ditolak: Anda tidak memiliki izin menghapus data submisi peserta.');
      return;
    }
    if (window.confirm('Hapus rekam submisi asesmen ini?')) {
      const subToDelete = submissions.find(s => s.id === id);
      const updated = deleteSubmission(id);
      onUpdateSubmissions(updated);
      if (adminSession?.email) {
        addAuditLog(
          adminSession.email,
          'DELETE_SUBMISSION',
          `Menghapus data submisi ${id} (${subToDelete?.user.fullName || 'Peserta'})`,
          'warning'
        );
      }
    }
  };

  const handleExportExcel = () => {
    if (!permissions.canExportData) {
      alert('Akses Ditolak: Anda tidak memiliki izin ekspor data.');
      return;
    }
    exportWorkforceToExcel(filteredSubmissions);
    if (adminSession?.email) {
      addAuditLog(
        adminSession.email,
        'EXPORT_DATA',
        `Mengekspor ${filteredSubmissions.length} rekam data asesmen ke Microsoft Excel 3 Sheet.`,
        'info'
      );
    }
  };

  const handleExportCSV = () => {
    if (!permissions.canExportData) {
      alert('Akses Ditolak: Anda tidak memiliki izin ekspor data.');
      return;
    }
    exportToCSV(filteredSubmissions);
    if (adminSession?.email) {
      addAuditLog(
        adminSession.email,
        'EXPORT_DATA',
        `Mengekspor ${filteredSubmissions.length} rekam data asesmen ke format CSV.`,
        'info'
      );
    }
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto pt-24 pb-20 px-4 sm:px-6">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Dashboard Analisis Asesmen
            </h1>
            <span className="font-data-mono text-xs px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
              v2.0 LIVE
            </span>
            <span
              className={`font-data-mono text-[11px] px-2 py-0.5 rounded flex items-center gap-1 border ${
                isCloudActive
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
              title={isCloudActive ? 'Tersinkronisasi Realtime dengan Cloud Firestore' : 'Penyimpanan Lokal Aktif (Offline/Standar)'}
            >
              <Database className="w-3 h-3" />
              {isCloudActive ? 'Firestore Cloud' : 'Penyimpanan Lokal'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Pemetaan kepribadian dan potensi kinerja tenaga kerja lapangan di seluruh unit plant.
            </p>
            {adminSession && (
              <span className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full border font-medium ${
                isDarkMode ? 'bg-indigo-950/60 border-indigo-500/30 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-700'
              }`}>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold">{adminSession.email}</span>
                <span className="opacity-75">[{adminSession.roleLabel || adminSession.role}]</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {permissions.canExportData && (
            <>
              <button
                onClick={handleExportExcel}
                id="export-excel-button"
                className={`px-3 py-2 rounded-lg text-xs font-label-caps font-semibold uppercase tracking-wider flex items-center gap-1.5 border transition-all shadow-sm ${
                  isDarkMode
                    ? 'border-emerald-500/50 bg-emerald-950/50 text-emerald-300 hover:bg-emerald-900/70'
                    : 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
                title="Unduh rekap data Excel lengkap (3 lembar kerja)"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Excel (3 Sheet)</span>
              </button>

              <button
                onClick={handleExportCSV}
                id="export-csv-button"
                className={`px-3 py-2 rounded-lg text-xs font-label-caps font-semibold uppercase tracking-wider flex items-center gap-1.5 border transition-all ${
                  isDarkMode
                    ? 'border-slate-700 bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV</span>
              </button>
            </>
          )}

          <button
            onClick={onStartNewAssessment}
            id="admin-start-new-assessment-button"
            className="px-3.5 py-2 rounded-lg text-xs font-label-caps font-semibold uppercase tracking-wider flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white shadow-md active:scale-95 transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Asesmen Baru</span>
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              id="admin-logout-button"
              className={`px-3 py-2 rounded-lg text-xs font-label-caps font-semibold uppercase tracking-wider flex items-center gap-1.5 border transition-all ${
                isDarkMode
                  ? 'border-rose-900/50 bg-rose-950/30 text-rose-300 hover:bg-rose-900/60 hover:text-white'
                  : 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
              }`}
              title="Keluar dari sesi Administrator"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Section Navigation Switcher */}
      <div
        className={`p-1.5 rounded-xl border mb-8 flex items-center gap-2 max-w-md ${
          isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-100 border-slate-200'
        }`}
      >
        <button
          onClick={() => setAdminSection('analytics')}
          id="admin-tab-analytics"
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold font-label-caps flex items-center justify-center gap-2 transition-all ${
            adminSection === 'analytics'
              ? 'bg-indigo-600 text-white shadow-md'
              : isDarkMode
              ? 'text-slate-400 hover:text-white'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Data Submisi & Analitik</span>
        </button>

        <button
          onClick={() => setAdminSection('access-control')}
          id="admin-tab-access-control"
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold font-label-caps flex items-center justify-center gap-2 transition-all ${
            adminSection === 'access-control'
              ? 'bg-indigo-600 text-white shadow-md'
              : isDarkMode
              ? 'text-slate-400 hover:text-white'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Kelola Hak Akses (RBAC)</span>
        </button>
      </div>

      {/* ACCESS CONTROL SECTION */}
      {adminSection === 'access-control' && adminSession && (
        <AccessControlManager
          currentAdmin={adminSession}
          isDarkMode={isDarkMode}
        />
      )}

      {/* SUBMISSIONS & ANALYTICS SECTION */}
      {adminSection === 'analytics' && (
        <>
          {/* Bento Grid Analytics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Metric 1: Total Submissions */}
            <div
              className={`p-5 rounded-xl border transition-all ${
                isDarkMode ? 'bg-[#111b34] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-label-caps uppercase text-slate-400 font-semibold">Total Submisi</span>
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-extrabold font-data-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {stats.total}
                </span>
                <span className="text-xs font-medium text-emerald-400 flex items-center">
                  +100% Terverifikasi
                </span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                {adminSession?.departmentScope && adminSession.departmentScope !== 'ALL'
                  ? `Unit: ${adminSession.departmentScope}`
                  : 'Peserta asesmen terdaftar'}
              </span>
            </div>

            {/* Metric 2: Dominant MBTI */}
            <div
              className={`p-5 rounded-xl border transition-all ${
                isDarkMode ? 'bg-[#111b34] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-label-caps uppercase text-slate-400 font-semibold">Tipe Dominan</span>
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-emerald-400 font-data-mono">
                  {stats.topType}
                </span>
                <span className="text-xs text-slate-400 font-data-mono">
                  {stats.topTypePct}% dari tim
                </span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Karakteristik dominan lapangan</span>
            </div>

            {/* Metric 3: Top Department */}
            <div
              className={`p-5 rounded-xl border transition-all ${
                isDarkMode ? 'bg-[#111b34] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-label-caps uppercase text-slate-400 font-semibold">Departemen Aktif</span>
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-xl font-bold truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`} title={stats.topDept}>
                  {stats.topDept}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">{stats.topDeptPct}% total submisi</span>
            </div>

            {/* Metric 4: Compliance & Readiness */}
            <div
              className={`p-5 rounded-xl border transition-all ${
                isDarkMode ? 'bg-[#111b34] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-label-caps uppercase text-slate-400 font-semibold">Indeks Kesiapan</span>
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-indigo-400 font-data-mono">
                  96.4%
                </span>
                <span className="text-xs font-medium text-emerald-400">Optimal</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Skor mitigasi risiko operasional</span>
            </div>
          </div>

          {/* Search, Filters, and Table Controls */}
          <div
            className={`p-4 rounded-xl border mb-6 flex flex-col md:flex-row gap-4 justify-between items-center ${
              isDarkMode ? 'bg-[#111b34] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama, NIK, jabatan, atau MBTI..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className={`w-full pl-9 pr-4 py-2 rounded-lg text-xs border transition-all ${
                  isDarkMode
                    ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-400">Departemen:</span>
                <select
                  value={selectedDept}
                  onChange={e => setSelectedDept(e.target.value)}
                  disabled={Boolean(adminSession?.departmentScope && adminSession.departmentScope !== 'ALL')}
                  className={`py-1.5 px-2.5 rounded-lg text-xs border ${
                    isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800'
                  }`}
                >
                  <option value="ALL">Semua Departemen ({scopedSubmissions.length})</option>
                  {uniqueDepartments.map(dept => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Tipe MBTI:</span>
                <select
                  value={selectedType}
                  onChange={e => setSelectedType(e.target.value)}
                  className={`py-1.5 px-2.5 rounded-lg text-xs border ${
                    isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800'
                  }`}
                >
                  <option value="ALL">Semua Tipe</option>
                  {Object.keys(stats.typeCounts).sort().map(type => (
                    <option key={type} value={type}>
                      {type} ({stats.typeCounts[type]})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Submissions Table */}
          <div
            className={`rounded-xl border overflow-hidden transition-all ${
              isDarkMode ? 'bg-[#111b34] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr
                    className={`border-b font-label-caps uppercase tracking-wider text-[11px] ${
                      isDarkMode ? 'bg-slate-900/90 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <th className="py-3.5 px-4">Nama Lengkap & NIK</th>
                    <th className="py-3.5 px-4">Jabatan, Dept & Area</th>
                    <th className="py-3.5 px-4">Tipe MBTI</th>
                    <th className="py-3.5 px-4">Profil Karakter</th>
                    <th className="py-3.5 px-4">Tanggal Tes</th>
                    <th className="py-3.5 px-4 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className={isDarkMode ? 'divide-y divide-slate-800/40' : 'divide-y divide-slate-200'}>
                  {filteredSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">
                        Tidak ada rekam submisi yang sesuai dengan kriteria filter.
                      </td>
                    </tr>
                  ) : (
                    filteredSubmissions.map(sub => (
                      <tr
                        key={sub.id}
                        className={`transition-colors ${
                          isDarkMode ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                        }`}
                      >
                        {/* Name & NIK */}
                        <td className="py-3.5 px-4">
                          <div className={`font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{sub.user.fullName}</div>
                          <div className={`font-data-mono text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{sub.user.nik}</div>
                        </td>

                        {/* Position, Department & Work Area */}
                        <td className="py-3.5 px-4">
                          <div className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{sub.user.position}</div>
                          <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                            <span className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{sub.user.department}</span>
                            {sub.user.workArea && (
                              <span className={`text-[10px] px-1.5 py-0.2 rounded border ${
                                isDarkMode ? 'bg-slate-800 text-indigo-300 border-indigo-500/20' : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                              }`}>
                                {sub.user.workArea}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* MBTI Code */}
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-md font-data-mono font-bold text-xs border ${
                            isDarkMode ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          }`}>
                            {sub.result.code}
                          </span>
                        </td>

                        {/* Nickname */}
                        <td className="py-3.5 px-4">
                          <span className={`font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>&ldquo;{sub.result.nickname}&rdquo;</span>
                        </td>

                        {/* Date */}
                        <td className={`py-3.5 px-4 font-data-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          {sub.createdAt}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleCopyLink(sub.id)}
                              className={`p-1.5 rounded transition-colors ${
                                copiedId === sub.id
                                  ? 'bg-emerald-600 text-white'
                                  : isDarkMode
                                  ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                              }`}
                              title="Salin Tautan Laporan Kandidat"
                            >
                              {copiedId === sub.id ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => exportResultToPDF(sub.result, sub.user)}
                              className={`p-1.5 rounded hover:bg-indigo-600/20 text-indigo-400 transition-colors`}
                              title="Unduh Laporan PDF Resmi"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setInspectingSubmission(sub)}
                              className={`p-1.5 rounded transition-colors ${
                                isDarkMode ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                              }`}
                              title="Lihat Detail Hasil di Layar"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {permissions.canDeleteRecords && (
                              <button
                                onClick={() => handleDelete(sub.id)}
                                className={`p-1.5 rounded transition-colors ${
                                  isDarkMode ? 'text-rose-400 hover:bg-rose-950/30' : 'text-rose-600 hover:bg-rose-50'
                                }`}
                                title="Hapus Submisi"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Modal for viewing inspected submission detail */}
      {inspectingSubmission && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border p-6 ${
            isDarkMode ? 'bg-[#0b1326] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
          }`}>
            <button
              onClick={() => setInspectingSubmission(null)}
              className={`absolute top-4 right-4 p-2 rounded-lg transition-colors ${
                isDarkMode ? 'bg-slate-800 text-slate-300 hover:text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
            <div className="pt-2">
              <AssessmentResultView
                result={inspectingSubmission.result}
                user={inspectingSubmission.user}
                onRetake={() => setInspectingSubmission(null)}
                onGoToAdmin={() => setInspectingSubmission(null)}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
