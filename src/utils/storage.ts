import { SubmissionRecord, UserProfile, MBTIResult, AdminUserRecord, AdminRole, AdminRolePermissions, AuditLogRecord } from '../types';
import { MBTI_PROFILES } from '../data/mbtiProfiles';
import { calculateMBTIResult } from './scoring';
import {
  isFirebaseConfigured,
  saveSubmissionToFirestore,
  deleteSubmissionFromFirestore,
  getSubmissionsFromFirestore
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
    description: 'Akses seluruh submisi, ekspor PDF/Excel untuk rekrutmen/evaluasi, tanpa hak mengelola akun admin.',
    permissions: {
      canDeleteRecords: false,
      canManageAdmins: false,
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
    fullName: 'Hilmi Assidqi (Lead Project)',
    role: 'super_admin',
    departmentScope: 'ALL',
    status: 'active',
    password: 'admin123',
    createdAt: '2024-01-10',
    lastLogin: '2024-10-24 10:00:00',
    permissions: ROLE_DEFINITIONS.super_admin.permissions
  },
  {
    id: 'ADM-003',
    email: 'hrd.recruitment@apex-ind.com',
    fullName: 'Rina Setyowati, S.Psi',
    role: 'hr_specialist',
    departmentScope: 'ALL',
    status: 'active',
    password: 'hrd12345',
    createdAt: '2024-02-15',
    lastLogin: '2024-10-23 15:30:00',
    permissions: ROLE_DEFINITIONS.hr_specialist.permissions
  },
  {
    id: 'ADM-004',
    email: 'plant.operations@apex-ind.com',
    fullName: 'Ir. Hendra Gunawan',
    role: 'plant_supervisor',
    departmentScope: 'Plant Operations & Processing',
    status: 'active',
    password: 'plant123',
    createdAt: '2024-03-01',
    lastLogin: '2024-10-22 14:00:00',
    permissions: ROLE_DEFINITIONS.plant_supervisor.permissions
  },
  {
    id: 'ADM-005',
    email: 'hse.lead@apex-ind.com',
    fullName: 'Bambang Sudirman, ST',
    role: 'plant_supervisor',
    departmentScope: 'Health, Safety & Environment (HSE)',
    status: 'active',
    password: 'hse12345',
    createdAt: '2024-03-05',
    lastLogin: '2024-10-20 08:30:00',
    permissions: ROLE_DEFINITIONS.plant_supervisor.permissions
  },
  {
    id: 'ADM-006',
    email: 'auditor.internal@apex-ind.com',
    fullName: 'Kusuma Wardana, CIA',
    role: 'auditor',
    departmentScope: 'ALL',
    status: 'active',
    password: 'audit123',
    createdAt: '2024-04-01',
    lastLogin: '2024-10-18 11:20:00',
    permissions: ROLE_DEFINITIONS.auditor.permissions
  }
];

export function getStoredAdminUsers(): AdminUserRecord[] {
  try {
    const raw = localStorage.getItem(ADMIN_USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify(DEFAULT_ADMIN_USERS));
      return DEFAULT_ADMIN_USERS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load admin users from storage:', err);
    return DEFAULT_ADMIN_USERS;
  }
}

export function saveAdminUser(user: Omit<AdminUserRecord, 'id' | 'createdAt' | 'permissions'> & { id?: string }): AdminUserRecord[] {
  const users = getStoredAdminUsers();
  const perms = ROLE_DEFINITIONS[user.role].permissions;

  if (user.id) {
    // Update existing
    const updated = users.map(u => {
      if (u.id === user.id) {
        return {
          ...u,
          fullName: user.fullName,
          email: user.email.toLowerCase().trim(),
          role: user.role,
          departmentScope: user.departmentScope,
          status: user.status,
          password: user.password || u.password,
          permissions: perms
        };
      }
      return u;
    });
    localStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } else {
    // Create new
    const newAdmin: AdminUserRecord = {
      id: `ADM-${Date.now().toString().slice(-4)}`,
      fullName: user.fullName,
      email: user.email.toLowerCase().trim(),
      role: user.role,
      departmentScope: user.departmentScope,
      status: user.status,
      password: user.password || 'admin123',
      createdAt: new Date().toISOString().split('T')[0],
      permissions: perms
    };
    const updated = [newAdmin, ...users];
    localStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }
}

export function deleteAdminUser(id: string): AdminUserRecord[] {
  const users = getStoredAdminUsers().filter(u => u.id !== id);
  localStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify(users));
  return users;
}

export function updateAdminStatus(id: string, status: 'active' | 'inactive'): AdminUserRecord[] {
  const users = getStoredAdminUsers().map(u => (u.id === id ? { ...u, status } : u));
  localStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify(users));
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
  return updated;
}


const INITIAL_DEMO_SUBMISSIONS: SubmissionRecord[] = [
  {
    id: 'SUB-SAMPLE-1',
    user: {
      fullName: 'Dian Pandu Pratama',
      nik: 'DPP-2024-001',
      position: 'General Manager',
      department: 'Corporate Management',
      workArea: 'Central Office Hub',
      email: 'dian.pandu@dianpandupratama.co.id'
    },
    result: {
      code: 'ENTJ',
      nickname: 'Komandan / Pemimpin Strategis',
      profile: MBTI_PROFILES['ENTJ'],
      dimensions: {
        EI: { leftCode: 'E', rightCode: 'I', leftLabel: 'Ekstrovert (E)', rightLabel: 'Introvert (I)', leftPct: 88, rightPct: 12, dominantCode: 'E', dominantLabel: 'Ekstrovert (E)', clarityScore: 'Very Clear' },
        SN: { leftCode: 'S', rightCode: 'N', leftLabel: 'Sensing (S)', rightLabel: 'Intuition (N)', leftPct: 25, rightPct: 75, dominantCode: 'N', dominantLabel: 'Intuition (N)', clarityScore: 'Very Clear' },
        TF: { leftCode: 'T', rightCode: 'F', leftLabel: 'Thinking (T)', rightLabel: 'Feeling (F)', leftPct: 81, rightPct: 19, dominantCode: 'T', dominantLabel: 'Thinking (T)', clarityScore: 'Very Clear' },
        JP: { leftCode: 'J', rightCode: 'P', leftLabel: 'Judging (J)', rightLabel: 'Perceiving (P)', leftPct: 94, rightPct: 6, dominantCode: 'J', dominantLabel: 'Judging (J)', clarityScore: 'Very Clear' }
      },
      completionTime: '2026-08-12T10:30:00Z'
    },
    answers: {},
    createdAt: '2026-08-12',
    timestamp: 1786530600000
  },
  {
    id: 'SUB-SAMPLE-2',
    user: {
      fullName: 'Budi Santoso',
      nik: 'DPP-2024-042',
      position: 'Supervisor Maintenance',
      department: 'Operasional Lapangan',
      workArea: 'Workshop & Maintenance Yard',
      email: 'budi.santoso@dianpandupratama.co.id'
    },
    result: {
      code: 'ISTJ',
      nickname: 'Logistik / Inspektur',
      profile: MBTI_PROFILES['ISTJ'],
      dimensions: {
        EI: { leftCode: 'E', rightCode: 'I', leftLabel: 'Ekstrovert (E)', rightLabel: 'Introvert (I)', leftPct: 19, rightPct: 81, dominantCode: 'I', dominantLabel: 'Introvert (I)', clarityScore: 'Very Clear' },
        SN: { leftCode: 'S', rightCode: 'N', leftLabel: 'Sensing (S)', rightLabel: 'Intuition (N)', leftPct: 88, rightPct: 12, dominantCode: 'S', dominantLabel: 'Sensing (S)', clarityScore: 'Very Clear' },
        TF: { leftCode: 'T', rightCode: 'F', leftLabel: 'Thinking (T)', rightLabel: 'Feeling (F)', leftPct: 75, rightPct: 25, dominantCode: 'T', dominantLabel: 'Thinking (T)', clarityScore: 'Very Clear' },
        JP: { leftCode: 'J', rightCode: 'P', leftLabel: 'Judging (J)', rightLabel: 'Perceiving (P)', leftPct: 88, rightPct: 12, dominantCode: 'J', dominantLabel: 'Judging (J)', clarityScore: 'Very Clear' }
      },
      completionTime: '2026-08-11T14:15:00Z'
    },
    answers: {},
    createdAt: '2026-08-11',
    timestamp: 1786457700000
  },
  {
    id: 'SUB-SAMPLE-3',
    user: {
      fullName: 'Siti Rahmawati',
      nik: 'DPP-2024-088',
      position: 'HRD & Talent Specialist',
      department: 'Human Capital',
      workArea: 'Office / Administrasi Plant',
      email: 'siti.rahma@dianpandupratama.co.id'
    },
    result: {
      code: 'ENFJ',
      nickname: 'Protagonis / Pemimpin Karismatik',
      profile: MBTI_PROFILES['ENFJ'],
      dimensions: {
        EI: { leftCode: 'E', rightCode: 'I', leftLabel: 'Ekstrovert (E)', rightLabel: 'Introvert (I)', leftPct: 81, rightPct: 19, dominantCode: 'E', dominantLabel: 'Ekstrovert (E)', clarityScore: 'Very Clear' },
        SN: { leftCode: 'S', rightCode: 'N', leftLabel: 'Sensing (S)', rightLabel: 'Intuition (N)', leftPct: 31, rightPct: 69, dominantCode: 'N', dominantLabel: 'Intuition (N)', clarityScore: 'Clear' },
        TF: { leftCode: 'T', rightCode: 'F', leftLabel: 'Thinking (T)', rightLabel: 'Feeling (F)', leftPct: 12, rightPct: 88, dominantCode: 'F', dominantLabel: 'Feeling (F)', clarityScore: 'Very Clear' },
        JP: { leftCode: 'J', rightCode: 'P', leftLabel: 'Judging (J)', rightLabel: 'Perceiving (P)', leftPct: 75, rightPct: 25, dominantCode: 'J', dominantLabel: 'Judging (J)', clarityScore: 'Very Clear' }
      },
      completionTime: '2026-08-10T09:00:00Z'
    },
    answers: {},
    createdAt: '2026-08-10',
    timestamp: 1786352400000
  },
  {
    id: 'SUB-MT1AS0LW',
    user: {
      fullName: 'Hilmi Assidqi Aenudin Maksum',
      nik: 'DPP-2024-105',
      position: 'Operator Lapangan',
      department: 'Operations & Production',
      workArea: 'Plant Area / Processing Unit',
      email: 'hilmiassidqi27@gmail.com'
    },
    result: {
      code: 'ESFP',
      nickname: 'Penghibur / Sosialis',
      profile: MBTI_PROFILES['ESFP'],
      dimensions: {
        EI: { leftCode: 'E', rightCode: 'I', leftLabel: 'Ekstrovert (E)', rightLabel: 'Introvert (I)', leftPct: 59, rightPct: 41, dominantCode: 'E', dominantLabel: 'Ekstrovert (E)', clarityScore: 'Moderate' },
        SN: { leftCode: 'S', rightCode: 'N', leftLabel: 'Sensing (S)', rightLabel: 'Intuition (N)', leftPct: 53, rightPct: 47, dominantCode: 'S', dominantLabel: 'Sensing (S)', clarityScore: 'Slight' },
        TF: { leftCode: 'T', rightCode: 'F', leftLabel: 'Thinking (T)', rightLabel: 'Feeling (F)', leftPct: 28, rightPct: 72, dominantCode: 'F', dominantLabel: 'Feeling (F)', clarityScore: 'Very Clear' },
        JP: { leftCode: 'J', rightCode: 'P', leftLabel: 'Judging (J)', rightLabel: 'Perceiving (P)', leftPct: 47, rightPct: 53, dominantCode: 'P', dominantLabel: 'Perceiving (P)', clarityScore: 'Slight' }
      },
      completionTime: '2026-08-20T16:07:00Z'
    },
    answers: {},
    createdAt: '2026-08-20',
    timestamp: 1787242020000
  }
];

export function getStoredSubmissions(): SubmissionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_SUBMISSIONS));
      return INITIAL_DEMO_SUBMISSIONS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load submissions from localStorage:', err);
    return INITIAL_DEMO_SUBMISSIONS;
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
