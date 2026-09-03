import { SubmissionRecord, UserProfile, MBTIResult, AdminUserRecord, AdminRole, AdminRolePermissions, AuditLogRecord } from '../types';
import { MBTI_PROFILES } from '../data/mbtiProfiles';
import { calculateMBTIResult } from './scoring';
import {
  isFirebaseConfigured,
  saveSubmissionToFirestore,
  deleteSubmissionFromFirestore,
  getSubmissionsFromFirestore,
  saveAdminUserToFirestore,
  deleteAdminUserFromFirestore,
  saveAuditLogToFirestore
} from '../services/firebase';

const STORAGE_KEY = 'mbti_industrial_submissions_v2';
const ADMIN_USERS_STORAGE_KEY = 'mbti_industrial_admin_users_v1';
const AUDIT_LOGS_STORAGE_KEY = 'mbti_industrial_audit_logs_v1';

export const ROLE_DEFINITIONS: Record<AdminRole, { label: string; description: string; permissions: AdminRolePermissions }> = {
  super_admin: {
    label: 'Super Administrator',
    description: 'Akses penuh ke seluruh data plant, manajemen hak akses admin, hapus data, dan konfigurasi sistem.',
    permissions: {
      canDeleteRecords: true,
      canManageAdmins: true,
      canExportData: true,
      canViewAllDepartments: true,
      canSimulateData: true
    }
  },
  hr_specialist: {
    label: 'HRD & Psikolog Lapangan',
    description: 'Akses seluruh submisi, ekspor PDF/Excel untuk rekrutmen/evaluasi, serta penambahan & pengelolaan otorisasi petugas.',
    permissions: {
      canDeleteRecords: false,
      canManageAdmins: true,
      canExportData: true,
      canViewAllDepartments: true,
      canSimulateData: false
    }
  },
  plant_supervisor: {
    label: 'Supervisor Unit & HSE',
    description: 'Akses terbatas untuk monitoring data tenaga kerja pada departemen yang ditugaskan & ekspor laporan.',
    permissions: {
      canDeleteRecords: false,
      canManageAdmins: false,
      canExportData: true,
      canViewAllDepartments: false,
      canSimulateData: false
    }
  },
  auditor: {
    label: 'Auditor & Read-Only',
    description: 'Hanya memiliki izin melihat data dan log audit tanpa hak ekspor atau modifikasi.',
    permissions: {
      canDeleteRecords: false,
      canManageAdmins: false,
      canExportData: false,
      canViewAllDepartments: true,
      canSimulateData: false
    }
  }
};

const DEFAULT_ADMIN_USERS: AdminUserRecord[] = [
  {
    id: 'ADM-001',
    email: 'admin@mbti-industrial.com',
    fullName: 'Master Administrator Industrial',
    role: 'super_admin',
    departmentScope: 'ALL',
    status: 'active',
    password: 'admin123',
    createdAt: '2024-01-10',
    lastLogin: '2024-10-24 09:12:00',
    permissions: ROLE_DEFINITIONS.super_admin.permissions
  },
  {
    id: 'ADM-002',
    email: 'hilmiassidqi27@gmail.com',
    fullName: 'Hilmi Assidqi (Lead Project & Super Admin)',
    role: 'super_admin',
    departmentScope: 'ALL',
    status: 'active',
    password: 'admin123',
    createdAt: '2024-01-10',
    lastLogin: '2024-10-24 10:00:00',
    permissions: ROLE_DEFINITIONS.super_admin.permissions
  }
];

export function getStoredAdminUsers(): AdminUserRecord[] {
  try {
    const raw = localStorage.getItem(ADMIN_USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify(DEFAULT_ADMIN_USERS));
      return DEFAULT_ADMIN_USERS;
    }
    const parsed: AdminUserRecord[] = JSON.parse(raw);
    // Filter out obsolete dummy demo accounts from earlier development versions
    const sanitized = parsed.filter(
      u => !u.email.toLowerCase().endsWith('@apex-ind.com') && !u.email.toLowerCase().endsWith('@example.com')
    );
    // Ensure default master admins are never lost across devices
    const emailsInParsed = new Set(sanitized.map(u => u.email.toLowerCase()));
    const missingDefaults: AdminUserRecord[] = [];
    DEFAULT_ADMIN_USERS.forEach(def => {
      if (!emailsInParsed.has(def.email.toLowerCase())) {
        missingDefaults.push(def);
      }
    });
    if (missingDefaults.length > 0 || sanitized.length !== parsed.length) {
      const merged = [...sanitized, ...missingDefaults];
      try {
        localStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify(merged));
      } catch {}
      return merged;
    }
    return sanitized;
  } catch (err) {
    console.error('Failed to load admin users from storage:', err);
    return DEFAULT_ADMIN_USERS;
  }
}

export async function saveAdminUserAsync(
  user: Omit<AdminUserRecord, 'id' | 'createdAt' | 'permissions'> & { id?: string; permissions?: AdminRolePermissions }
): Promise<{ success: boolean; users: AdminUserRecord[]; record: AdminUserRecord; error?: string }> {
  const users = getStoredAdminUsers();
  const perms = user.permissions || ROLE_DEFINITIONS[user.role].permissions;

  let savedRecord: AdminUserRecord;

  if (user.id) {
    const existing = users.find(u => u.id === user.id);
    savedRecord = {
      id: user.id,
      fullName: user.fullName.trim(),
      email: user.email.toLowerCase().trim(),
      role: user.role,
      departmentScope: user.departmentScope,
      status: user.status,
      password: user.password || (existing?.password || 'admin123'),
      createdAt: existing?.createdAt || new Date().toISOString().split('T')[0],
      permissions: perms,
      lastLogin: existing?.lastLogin || '-'
    };
    const updated = users.map(u => (u.id === user.id ? savedRecord : u));
    localStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify(updated));

    if (isFirebaseConfigured()) {
      try {
        const cloudSaved = await saveAdminUserToFirestore(savedRecord);
        if (!cloudSaved) {
          return { success: true, users: updated, record: savedRecord, error: 'Peringatan: Gagal menyinkronkan ke Cloud Firestore, data tersimpan di browser.' };
        }
      } catch (err: any) {
        console.warn('Firestore admin save error:', err);
        return { success: true, users: updated, record: savedRecord, error: err.message };
      }
    }
    return { success: true, users: updated, record: savedRecord };
  } else {
    // Unique ID generation with 6 random characters
    const uniqueSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    savedRecord = {
      id: `ADM-${Date.now().toString().slice(-4)}${uniqueSuffix}`,
      fullName: user.fullName.trim(),
      email: user.email.toLowerCase().trim(),
      role: user.role,
      departmentScope: user.departmentScope,
      status: user.status,
      password: user.password || 'admin123',
      createdAt: new Date().toISOString().split('T')[0],
      permissions: perms,
      lastLogin: '-'
    };
    const updated = [savedRecord, ...users];
    localStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify(updated));

    if (isFirebaseConfigured()) {
      try {
        const cloudSaved = await saveAdminUserToFirestore(savedRecord);
        if (!cloudSaved) {
          return { success: true, users: updated, record: savedRecord, error: 'Peringatan: Gagal menyinkronkan ke Cloud Firestore, data tersimpan di browser.' };
        }
      } catch (err: any) {
        console.warn('Firestore admin save error:', err);
        return { success: true, users: updated, record: savedRecord, error: err.message };
      }
    }
    return { success: true, users: updated, record: savedRecord };
  }
}

export function saveAdminUser(user: Omit<AdminUserRecord, 'id' | 'createdAt' | 'permissions'> & { id?: string }): AdminUserRecord[] {
  const users = getStoredAdminUsers();
  const perms = ROLE_DEFINITIONS[user.role].permissions;

  let savedRecord: AdminUserRecord;

  if (user.id) {
    // Update existing
    const existing = users.find(u => u.id === user.id);
    savedRecord = {
      id: user.id,
      fullName: user.fullName.trim(),
      email: user.email.toLowerCase().trim(),
      role: user.role,
      departmentScope: user.departmentScope,
      status: user.status,
      password: user.password || (existing?.password || 'admin123'),
      createdAt: existing?.createdAt || new Date().toISOString().split('T')[0],
      permissions: perms,
      lastLogin: existing?.lastLogin || '-'
    };
    const updated = users.map(u => (u.id === user.id ? savedRecord : u));
    localStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify(updated));

    if (isFirebaseConfigured()) {
      saveAdminUserToFirestore(savedRecord).catch(err => {
        console.warn('Firestore admin save warning:', err);
      });
    }

    return updated;
  } else {
    // Create new
    const uniqueSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    savedRecord = {
      id: `ADM-${Date.now().toString().slice(-4)}${uniqueSuffix}`,
      fullName: user.fullName.trim(),
      email: user.email.toLowerCase().trim(),
      role: user.role,
      departmentScope: user.departmentScope,
      status: user.status,
      password: user.password || 'admin123',
      createdAt: new Date().toISOString().split('T')[0],
      permissions: perms,
      lastLogin: '-'
    };
    const updated = [savedRecord, ...users];
    localStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify(updated));

    if (isFirebaseConfigured()) {
      saveAdminUserToFirestore(savedRecord).catch(err => {
        console.warn('Firestore admin save warning:', err);
      });
    }

    return updated;
  }
}

export function deleteAdminUser(id: string): AdminUserRecord[] {
  const users = getStoredAdminUsers().filter(u => u.id !== id);
  localStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify(users));

  if (isFirebaseConfigured()) {
    deleteAdminUserFromFirestore(id).catch(err => {
      console.warn('Firestore admin delete warning:', err);
    });
  }

  return users;
}

export function updateAdminStatus(id: string, status: 'active' | 'inactive'): AdminUserRecord[] {
  const users = getStoredAdminUsers();
  const target = users.find(u => u.id === id);
  if (target) {
    const updatedUser = { ...target, status };
    const updated = users.map(u => (u.id === id ? updatedUser : u));
    localStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify(updated));

    if (isFirebaseConfigured()) {
      saveAdminUserToFirestore(updatedUser).catch(err => {
        console.warn('Firestore admin status update warning:', err);
      });
    }

    return updated;
  }
  return users;
}

export function getAuditLogs(): AuditLogRecord[] {
  try {
    const raw = localStorage.getItem(AUDIT_LOGS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function addAuditLog(
  actorEmail: string,
  action: AuditLogRecord['action'],
  details: string,
  severity: 'info' | 'warning' | 'critical' = 'info'
): AuditLogRecord[] {
  const logs = getAuditLogs();
  const newLog: AuditLogRecord = {
    id: `LOG-${Date.now().toString(36).toUpperCase()}`,
    timestamp: new Date().toLocaleString('id-ID'),
    actorEmail,
    action,
    details,
    severity
  };
  const updated = [newLog, ...logs.slice(0, 99)]; // retain latest 100 logs
  localStorage.setItem(AUDIT_LOGS_STORAGE_KEY, JSON.stringify(updated));

  if (isFirebaseConfigured()) {
    saveAuditLogToFirestore(newLog).catch(err => {
      console.warn('Firestore audit log save warning:', err);
    });
  }

  return updated;
}


const INITIAL_DEMO_SUBMISSIONS: SubmissionRecord[] = [];

export function getStoredSubmissions(): SubmissionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      return [];
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load submissions from localStorage:', err);
    return [];
  }
}

export function saveSubmission(
  user: UserProfile,
  result: MBTIResult,
  answers: Record<number, number>
): SubmissionRecord {
  const submissions = getStoredSubmissions();
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  const newRecord: SubmissionRecord = {
    id: `SUB-${Date.now().toString(36).toUpperCase()}-${randomSuffix}`,
    user,
    result,
    answers,
    createdAt: new Date().toISOString().split('T')[0],
    timestamp: Date.now()
  };

  const updated = [newRecord, ...submissions];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  // Sync with Firestore if configured
  if (isFirebaseConfigured()) {
    saveSubmissionToFirestore(newRecord).catch(err => {
      console.warn('Background Firestore sync warning:', err);
    });
  }

  return newRecord;
}

export function deleteSubmission(id: string): SubmissionRecord[] {
  const submissions = getStoredSubmissions().filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));

  if (isFirebaseConfigured()) {
    deleteSubmissionFromFirestore(id).catch(err => {
      console.warn('Background Firestore delete warning:', err);
    });
  }

  return submissions;
}

export function exportToCSV(submissions: SubmissionRecord[]): void {
  const headers = [
    'ID Submisi',
    'Tautan Laporan',
    'Nama Lengkap',
    'NIK',
    'Jabatan',
    'Departemen',
    'Area Kerja',
    'Email',
    'Tipe MBTI',
    'Nama Profil',
    'E/I Ratio',
    'S/N Ratio',
    'T/F Ratio',
    'J/P Ratio',
    'Tanggal Tes'
  ];

  const origin = window.location.origin + window.location.pathname;

  const rows = submissions.map(s => [
    `"${s.id}"`,
    `"${origin}?report=${s.id}"`,
    `"${s.user.fullName}"`,
    `"${s.user.nik}"`,
    `"${s.user.position}"`,
    `"${s.user.department}"`,
    `"${s.user.workArea || '-'}"`,
    `"${s.user.email}"`,
    `"${s.result.code}"`,
    `"${s.result.nickname}"`,
    `"E ${s.result.dimensions.EI.leftPct}% / I ${s.result.dimensions.EI.rightPct}%"`,
    `"S ${s.result.dimensions.SN.leftPct}% / N ${s.result.dimensions.SN.rightPct}%"`,
    `"T ${s.result.dimensions.TF.leftPct}% / F ${s.result.dimensions.TF.rightPct}%"`,
    `"J ${s.result.dimensions.JP.leftPct}% / P ${s.result.dimensions.JP.rightPct}%"`,
    `"${s.createdAt}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `MBTI_Industrial_Submissions_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
