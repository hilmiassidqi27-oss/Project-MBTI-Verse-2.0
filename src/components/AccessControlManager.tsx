import React, { useState, useEffect } from 'react';
import {
  AdminUserRecord,
  AdminRole,
  AuditLogRecord
} from '../types';
import {
  getStoredAdminUsers,
  saveAdminUser,
  deleteAdminUser,
  updateAdminStatus,
  getAuditLogs,
  addAuditLog,
  ROLE_DEFINITIONS
} from '../utils/storage';
import {
  AdminSession,
  isFirebaseConfigured,
  subscribeToFirestoreAdminUsers,
  subscribeToFirestoreAuditLogs,
  getAdminUsersFromFirestore,
  getAuditLogsFromFirestore
} from '../services/firebase';
import { INDUSTRIAL_DEPARTMENTS } from '../data/questions';
import {
  ShieldCheck,
  ShieldAlert,
  UserPlus,
  Users,
  KeyRound,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  History,
  Lock,
  Eye,
  EyeOff,
  Building2,
  FileCheck,
  Check,
  X,
  Search,
  Filter,
  Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AccessControlManagerProps {
  currentAdmin: AdminSession;
  isDarkMode: boolean;
}

export const AccessControlManager: React.FC<AccessControlManagerProps> = ({
  currentAdmin,
  isDarkMode
}) => {
  const [adminUsers, setAdminUsers] = useState<AdminUserRecord[]>(getStoredAdminUsers());
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>(getAuditLogs());
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'audit'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Real-time synchronization with Firestore across all PCs
  useEffect(() => {
    if (isFirebaseConfigured()) {
      // 1. Subscribe to Admin Users
      const unsubAdmins = subscribeToFirestoreAdminUsers(cloudAdmins => {
        if (cloudAdmins && cloudAdmins.length > 0) {
          setAdminUsers(cloudAdmins);
          try {
            localStorage.setItem('mbti_industrial_admin_users_v1', JSON.stringify(cloudAdmins));
          } catch {}
        }
      });

      // 2. Subscribe to Audit Logs
      const unsubLogs = subscribeToFirestoreAuditLogs(cloudLogs => {
        if (cloudLogs && cloudLogs.length > 0) {
          setAuditLogs(cloudLogs);
          try {
            localStorage.setItem('mbti_industrial_audit_logs_v1', JSON.stringify(cloudLogs));
          } catch {}
        }
      });

      return () => {
        unsubAdmins();
        unsubLogs();
      };
    }
  }, []);

  // Modal State for Add/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUserRecord | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<AdminRole>('hr_specialist');
  const [formDeptOption, setFormDeptOption] = useState('ALL');
  const [formCustomDept, setFormCustomDept] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formStatus, setFormStatus] = useState<'active' | 'inactive'>('active');
  const [formError, setFormError] = useState<string | null>(null);

  const canManage = currentAdmin.permissions.canManageAdmins;

  // Filtered admin users
  const filteredUsers = adminUsers.filter(u => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormName('');
    setFormEmail('');
    setFormRole('hr_specialist');
    setFormDeptOption('ALL');
    setFormCustomDept('');
    setFormPassword('admin123');
    setFormStatus('active');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: AdminUserRecord) => {
    setEditingUser(user);
    setFormName(user.fullName);
    setFormEmail(user.email);
    setFormRole(user.role);
    const isStandard = user.departmentScope === 'ALL' || INDUSTRIAL_DEPARTMENTS.includes(user.departmentScope);
    setFormDeptOption(isStandard ? user.departmentScope : 'OTHER');
    setFormCustomDept(isStandard ? '' : user.departmentScope);
    setFormPassword(user.password || '');
    setFormStatus(user.status);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const emailTrimmed = formEmail.trim().toLowerCase();
    if (!formName.trim() || !emailTrimmed) {
      setFormError('Nama lengkap dan email akun wajib diisi.');
      return;
    }

    const resolvedDeptScope = formDeptOption === 'OTHER' ? formCustomDept.trim() : formDeptOption;
    if (formDeptOption === 'OTHER' && !resolvedDeptScope) {
      setFormError('Sebutkan nama departemen / unit kerja untuk cakupan admin.');
      return;
    }

    if (!editingUser && adminUsers.some(u => u.email.toLowerCase() === emailTrimmed)) {
      setFormError(`Email "${emailTrimmed}" sudah terdaftar dalam daftar administrator.`);
      return;
    }

    if (editingUser) {
      const updatedList = saveAdminUser({
        id: editingUser.id,
        fullName: formName.trim(),
        email: emailTrimmed,
        role: formRole,
        departmentScope: resolvedDeptScope,
        status: formStatus,
        password: formPassword || undefined
      });
      setAdminUsers(updatedList);
      addAuditLog(
        currentAdmin.email,
        'UPDATE_ADMIN',
        `Memperbarui hak akses admin ${emailTrimmed} (${formRole}, Status: ${formStatus})`,
        'info'
      );
    } else {
      const updatedList = saveAdminUser({
        fullName: formName.trim(),
        email: emailTrimmed,
        role: formRole,
        departmentScope: resolvedDeptScope,
        status: formStatus,
        password: formPassword || 'admin123'
      });
      setAdminUsers(updatedList);
      addAuditLog(
        currentAdmin.email,
        'CREATE_ADMIN',
        `Menambahkan akun admin baru ${emailTrimmed} sebagai ${ROLE_DEFINITIONS[formRole].label}`,
        'info'
      );
    }

    setAuditLogs(getAuditLogs());
    setIsModalOpen(false);
  };

  const handleDeleteUser = (user: AdminUserRecord) => {
    if (user.email.toLowerCase() === currentAdmin.email.toLowerCase()) {
      alert('Anda tidak dapat menghapus akun admin yang sedang Anda gunakan.');
      return;
    }

    if (confirm(`Apakah Anda yakin ingin menghapus akses untuk ${user.fullName} (${user.email})?`)) {
      const updated = deleteAdminUser(user.id);
      setAdminUsers(updated);
      addAuditLog(
        currentAdmin.email,
        'DELETE_ADMIN',
        `Menghapus akses akun administrator ${user.email} (${user.fullName})`,
        'warning'
      );
      setAuditLogs(getAuditLogs());
    }
  };

  const handleToggleStatus = (user: AdminUserRecord) => {
    if (user.email.toLowerCase() === currentAdmin.email.toLowerCase()) {
      alert('Anda tidak dapat menonaktifkan akun sendiri.');
      return;
    }

    const nextStatus = user.status === 'active' ? 'inactive' : 'active';
    const updated = updateAdminStatus(user.id, nextStatus);
    setAdminUsers(updated);
    addAuditLog(
      currentAdmin.email,
      'UPDATE_ADMIN',
      `Mengubah status akun ${user.email} menjadi ${nextStatus.toUpperCase()}`,
      nextStatus === 'inactive' ? 'warning' : 'info'
    );
    setAuditLogs(getAuditLogs());
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div
        className={`p-4 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
          isDarkMode
            ? 'bg-slate-900/80 border-slate-800 text-slate-200'
            : 'bg-white border-slate-200 text-slate-800 shadow-sm'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-tight">Otorisasi & Kontrol Akses Administrator (RBAC)</h3>
              <span className="font-data-mono text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
                WHITELIST KETAT AKTIF
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Hanya email yang terdaftar pada tabel otorisasi di bawah yang diizinkan mengakses Dashboard Admin & Data Psikometri.
            </p>
          </div>
        </div>

        {canManage && (
          <button
            onClick={handleOpenAdd}
            id="add-admin-user-button"
            className="px-4 py-2 rounded-lg text-xs font-label-caps font-semibold uppercase tracking-wider flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white shadow-md active:scale-95 transition-all shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Akses Petugas</span>
          </button>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-800/80 gap-6 text-xs font-label-caps font-semibold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'users'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Daftar Akun Petugas ({adminUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('roles')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'roles'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Matriks Hak Akses Peran (RBAC)</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'audit'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Log Audit Keamanan ({auditLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: USERS LIST */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama atau email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className={`w-full pl-9 pr-3 py-1.5 rounded-lg text-xs border transition-all ${
                  isDarkMode
                    ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500'
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-400 shrink-0">Filter Peran:</span>
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                className={`py-1.5 px-3 rounded-lg text-xs border ${
                  isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-300 text-slate-800'
                }`}
              >
                <option value="ALL">Semua Peran ({adminUsers.length})</option>
                <option value="super_admin">Super Administrator</option>
                <option value="hr_specialist">HRD & Psikolog Lapangan</option>
                <option value="plant_supervisor">Supervisor Unit & HSE</option>
                <option value="auditor">Auditor & Read-Only</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div
            className={`rounded-xl border overflow-hidden transition-all ${
              isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr
                    className={`border-b font-label-caps uppercase tracking-wider text-[11px] ${
                      isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <th className="py-3 px-4">Nama Petugas & ID</th>
                    <th className="py-3 px-4">Email Login</th>
                    <th className="py-3 px-4">Peran / Role</th>
                    <th className="py-3 px-4">Cakupan Unit</th>
                    <th className="py-3 px-4">Status Akun</th>
                    <th className="py-3 px-4">Terakhir Login</th>
                    <th className="py-3 px-4 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className={isDarkMode ? 'divide-y divide-slate-800/40' : 'divide-y divide-slate-200'}>
                  {filteredUsers.map(user => {
                    const isSelf = user.email.toLowerCase() === currentAdmin.email.toLowerCase();
                    return (
                      <tr
                        key={user.id}
                        className={`transition-colors ${
                          isDarkMode ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                        } ${isSelf ? (isDarkMode ? 'bg-indigo-950/20' : 'bg-indigo-50/50') : ''}`}
                      >
                        {/* Name & ID */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className={`font-semibold flex items-center gap-1.5 ${
                              isDarkMode ? 'text-slate-100' : 'text-slate-900'
                            }`}>
                              <span>{user.fullName}</span>
                              {isSelf && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                  Anda
                                </span>
                              )}
                            </div>
                          </div>
                          <div className={`font-data-mono text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{user.id}</div>
                        </td>

                        {/* Email */}
                        <td className={`py-3 px-4 font-data-mono ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          {user.email}
                        </td>

                        {/* Role Badge */}
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                              user.role === 'super_admin'
                                ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                                : user.role === 'hr_specialist'
                                ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                                : user.role === 'plant_supervisor'
                                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                : 'bg-slate-500/15 text-slate-300 border-slate-500/30'
                            }`}
                          >
                            {ROLE_DEFINITIONS[user.role]?.label || user.role}
                          </span>
                        </td>

                        {/* Department Scope */}
                        <td className={`py-3 px-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          {user.departmentScope === 'ALL' ? (
                            <span className={isDarkMode ? 'text-emerald-400 font-medium' : 'text-emerald-600 font-semibold'}>Semua Departemen Plant</span>
                          ) : (
                            <span>{user.departmentScope}</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4">
                          <button
                            onClick={() => canManage && handleToggleStatus(user)}
                            disabled={!canManage || isSelf}
                            className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded transition-all ${
                              user.status === 'active'
                                ? isDarkMode ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-emerald-600 hover:bg-emerald-50'
                                : isDarkMode ? 'text-rose-400 hover:bg-rose-500/10' : 'text-rose-600 hover:bg-rose-50'
                            } ${!canManage || isSelf ? 'cursor-default' : 'cursor-pointer'}`}
                            title={canManage && !isSelf ? 'Klik untuk mengubah status' : undefined}
                          >
                            {user.status === 'active' ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Aktif</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Ditangguhkan</span>
                              </>
                            )}
                          </button>
                        </td>

                        {/* Last Login */}
                        <td className={`py-3 px-4 font-data-mono text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          {user.lastLogin || 'Belum pernah'}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {canManage ? (
                              <>
                                <button
                                  onClick={() => handleOpenEdit(user)}
                                  className="p-1.5 rounded hover:bg-indigo-600/20 text-indigo-400 transition-colors"
                                  title="Ubah Hak Akses & Akun"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                {!isSelf && (
                                  <button
                                    onClick={() => handleDeleteUser(user)}
                                    className={`p-1.5 rounded transition-colors ${
                                      isDarkMode ? 'text-rose-400 hover:bg-rose-600/20' : 'text-rose-600 hover:bg-rose-50'
                                    }`}
                                    title="Hapus Akses Petugas"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </>
                            ) : (
                              <span className="text-[11px] text-slate-500 italic">Hanya Lihat</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ROLES & PERMISSIONS MATRIX */}
      {activeTab === 'roles' && (
        <div className="space-y-6">
          <div
            className={`p-5 rounded-xl border ${
              isDarkMode ? 'bg-slate-900/60 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
            }`}
          >
            <h3 className="text-sm font-bold mb-1">Matriks Hak Akses Berbasis Peran (RBAC Table)</h3>
            <p className={`text-xs mb-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Daftar izin operasional yang diterapkan secara ketat pada setiap tingkatan peran administrator.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr
                    className={`border-b font-label-caps uppercase text-[11px] ${
                      isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <th className="py-2.5 px-3">Fungsi / Izin Operasional</th>
                    <th className="py-2.5 px-3 text-center">Super Admin</th>
                    <th className="py-2.5 px-3 text-center">HRD & Psikolog</th>
                    <th className="py-2.5 px-3 text-center">Supervisor Unit</th>
                    <th className="py-2.5 px-3 text-center">Auditor</th>
                  </tr>
                </thead>
                <tbody className={isDarkMode ? 'divide-y divide-slate-800/40' : 'divide-y divide-slate-200'}>
                  <tr>
                    <td className={`py-3 px-3 font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Melihat Data Semua Departemen Plant</td>
                    <td className="py-3 px-3 text-center text-emerald-500 font-bold">✓ Penuh</td>
                    <td className="py-3 px-3 text-center text-emerald-500 font-bold">✓ Penuh</td>
                    <td className="py-3 px-3 text-center text-amber-500 font-medium">Unit Tertentu</td>
                    <td className="py-3 px-3 text-center text-emerald-500 font-bold">✓ Penuh</td>
                  </tr>
                  <tr>
                    <td className={`py-3 px-3 font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Ekspor Laporan PDF & Rekap Excel 3 Sheet</td>
                    <td className="py-3 px-3 text-center text-emerald-500 font-bold">✓ Ya</td>
                    <td className="py-3 px-3 text-center text-emerald-500 font-bold">✓ Ya</td>
                    <td className="py-3 px-3 text-center text-emerald-500 font-bold">✓ Ya</td>
                    <td className="py-3 px-3 text-center text-rose-500">✗ Tidak</td>
                  </tr>
                  <tr>
                    <td className={`py-3 px-3 font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Kelola Akun, Tambah Admin & Whitelist</td>
                    <td className="py-3 px-3 text-center text-emerald-500 font-bold">✓ Ya</td>
                    <td className="py-3 px-3 text-center text-rose-500">✗ Tidak</td>
                    <td className="py-3 px-3 text-center text-rose-500">✗ Tidak</td>
                    <td className="py-3 px-3 text-center text-rose-500">✗ Tidak</td>
                  </tr>
                  <tr>
                    <td className={`py-3 px-3 font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Hapus Data Rekam Submisi Peserta</td>
                    <td className="py-3 px-3 text-center text-emerald-500 font-bold">✓ Ya</td>
                    <td className="py-3 px-3 text-center text-rose-500">✗ Tidak</td>
                    <td className="py-3 px-3 text-center text-rose-500">✗ Tidak</td>
                    <td className="py-3 px-3 text-center text-rose-500">✗ Tidak</td>
                  </tr>
                  <tr>
                    <td className={`py-3 px-3 font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Simulasi Submisi Uji Coba Lapangan</td>
                    <td className="py-3 px-3 text-center text-emerald-500 font-bold">✓ Ya</td>
                    <td className="py-3 px-3 text-center text-rose-500">✗ Tidak</td>
                    <td className="py-3 px-3 text-center text-rose-500">✗ Tidak</td>
                    <td className="py-3 px-3 text-center text-rose-500">✗ Tidak</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT TRAILS */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div
            className={`rounded-xl border overflow-hidden ${
              isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className={`p-4 border-b flex items-center justify-between ${
              isDarkMode ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <div>
                <h3 className={`text-xs font-bold uppercase tracking-wider ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-800'
                }`}>
                  Catatan Jejak Audit Keamanan (Security Audit Logs)
                </h3>
                <p className={`text-[11px] mt-0.5 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Setiap aktivitas login, modifikasi admin, penghapusan, dan ekspor data tercatat permanen.
                </p>
              </div>
              <span className={`font-data-mono text-[11px] font-semibold ${
                isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
              }`}>
                {auditLogs.length} Catatan
              </span>
            </div>

            <div className={`divide-y max-h-[400px] overflow-y-auto ${
              isDarkMode ? 'divide-slate-800/40' : 'divide-slate-200'
            }`}>
              {auditLogs.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  Belum ada log aktivitas keamanan yang tercatat.
                </div>
              ) : (
                auditLogs.map(log => (
                  <div
                    key={log.id}
                    className={`p-3.5 transition-colors flex items-start justify-between gap-4 text-xs ${
                      isDarkMode ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-data-mono font-semibold border shrink-0 mt-0.5 ${
                          log.severity === 'critical'
                            ? isDarkMode ? 'bg-rose-500/15 text-rose-300 border-rose-500/30' : 'bg-rose-50 text-rose-700 border-rose-200'
                            : log.severity === 'warning'
                            ? isDarkMode ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' : 'bg-amber-50 text-amber-700 border-amber-200'
                            : isDarkMode ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        }`}
                      >
                        {log.action}
                      </span>
                      <div>
                        <div className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>{log.details}</div>
                        <div className={`text-[11px] font-data-mono mt-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                          Pelaku: <span className={isDarkMode ? 'text-slate-400' : 'text-slate-700'}>{log.actorEmail}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`text-[11px] font-data-mono whitespace-nowrap ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                      {log.timestamp}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT ADMIN USER */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl relative ${
                isDarkMode ? 'bg-[#111b34] border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              <div className={`flex items-center justify-between mb-4 pb-3 border-b ${
                isDarkMode ? 'border-slate-800' : 'border-slate-200'
              }`}>
                <div className="flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-indigo-500" />
                  <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {editingUser ? 'Ubah Hak Akses Petugas' : 'Tambah Otorisasi Petugas Baru'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className={`p-1 rounded-lg transition-colors ${
                    isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formError && (
                <div className="mb-4 p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSaveUser} className="space-y-4 text-xs">
                <div>
                  <label className={`block font-semibold uppercase font-label-caps mb-1 ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Nama Lengkap Petugas
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    placeholder="Contoh: Rina Setyowati, S.Psi"
                    className={`w-full p-2.5 rounded-lg border text-xs ${
                      isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block font-semibold uppercase font-label-caps mb-1 ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Email Akun Administrator (Whitelist)
                  </label>
                  <input
                    type="email"
                    required
                    disabled={Boolean(editingUser)}
                    value={formEmail}
                    onChange={e => setFormEmail(e.target.value)}
                    placeholder="petugas@perusahaan.com"
                    className={`w-full p-2.5 rounded-lg border text-xs ${
                      editingUser
                        ? isDarkMode
                          ? 'opacity-60 cursor-not-allowed bg-slate-950 border-slate-800 text-slate-400'
                          : 'opacity-60 cursor-not-allowed bg-slate-100 border-slate-300 text-slate-500'
                        : isDarkMode
                        ? 'bg-slate-900 border-slate-700 text-white'
                        : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                  {editingUser && (
                    <span className="text-[10px] text-slate-500 mt-0.5 block">Email tidak dapat diubah untuk menjaga integritas log.</span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={`block font-semibold uppercase font-label-caps mb-1 ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Peran & Hak Akses
                    </label>
                    <select
                      value={formRole}
                      onChange={e => setFormRole(e.target.value as AdminRole)}
                      className={`w-full p-2.5 rounded-lg border text-xs ${
                        isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    >
                      <option value="super_admin">Super Administrator (Akses Penuh)</option>
                      <option value="hr_specialist">HRD & Psikolog Lapangan</option>
                      <option value="plant_supervisor">Supervisor Unit & HSE</option>
                      <option value="auditor">Auditor & Read-Only</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block font-semibold uppercase font-label-caps mb-1 ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Cakupan Departemen
                    </label>
                    <select
                      value={formDeptOption}
                      onChange={e => setFormDeptOption(e.target.value)}
                      className={`w-full p-2.5 rounded-lg border text-xs ${
                        isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    >
                      <option value="ALL">Semua Departemen Plant</option>
                      {INDUSTRIAL_DEPARTMENTS.map(d => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                      <option value="OTHER">+ Lainnya (Tulis Manual...)</option>
                    </select>

                    {formDeptOption === 'OTHER' && (
                      <input
                        type="text"
                        value={formCustomDept}
                        onChange={e => setFormCustomDept(e.target.value)}
                        placeholder="Nama unit kerja / departemen..."
                        autoFocus
                        className={`w-full mt-2 p-2 rounded-lg border text-xs ${
                          isDarkMode ? 'bg-slate-900 border-indigo-500/50 text-white' : 'bg-indigo-50 border-indigo-300 text-slate-900'
                        }`}
                      />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold uppercase font-label-caps text-slate-300 mb-1">
                      Kata Sandi Login
                    </label>
                    <input
                      type="text"
                      value={formPassword}
                      onChange={e => setFormPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      className={`w-full p-2.5 rounded-lg border text-xs font-data-mono ${
                        isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold uppercase font-label-caps text-slate-300 mb-1">
                      Status Akun
                    </label>
                    <select
                      value={formStatus}
                      onChange={e => setFormStatus(e.target.value as 'active' | 'inactive')}
                      className={`w-full p-2.5 rounded-lg border text-xs ${
                        isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    >
                      <option value="active">Aktif (Diizinkan Masuk)</option>
                      <option value="inactive">Ditangguhkan (Blokir Akses)</option>
                    </select>
                  </div>
                </div>

                {/* Role description preview */}
                <div className={`p-3 rounded-lg border text-[11px] ${
                  isDarkMode ? 'bg-slate-900/80 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  <span className="font-semibold text-indigo-400">Deskripsi Izin:</span>{' '}
                  {ROLE_DEFINITIONS[formRole].description}
                </div>

                {/* Modal Actions */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-3.5 py-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingUser ? 'Simpan Perubahan' : 'Daftarkan Petugas'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
