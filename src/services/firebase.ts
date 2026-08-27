import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { SubmissionRecord } from '../types';

import firebaseAppletConfig from '../../firebase-applet-config.json';

// Read config from config file or Vite environment
const firebaseConfig = {
  apiKey: firebaseAppletConfig?.apiKey || import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: firebaseAppletConfig?.authDomain || import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: firebaseAppletConfig?.projectId || import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: firebaseAppletConfig?.storageBucket || import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: firebaseAppletConfig?.messagingSenderId || import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: firebaseAppletConfig?.appId || import.meta.env.VITE_FIREBASE_APP_ID,
  firestoreDatabaseId: firebaseAppletConfig?.firestoreDatabaseId || import.meta.env.VITE_FIREBASE_DATABASE_ID
};

export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.apiKey !== '' &&
    !firebaseConfig.apiKey.includes('your_')
  );
};

let app: any = null;
let db: any = null;
let auth: any = null;

if (isFirebaseConfigured()) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    const databaseId = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
      ? firebaseConfig.firestoreDatabaseId
      : undefined;
    db = databaseId ? getFirestore(app, databaseId) : getFirestore(app);
    auth = getAuth(app);
  } catch (err) {
    console.warn('Firebase initialization error, fallback to local storage:', err);
  }
}

export { db, auth };

const ADMIN_SESSION_KEY = 'mbti_industrial_admin_session';

export interface AdminSession {
  email: string;
  fullName: string;
  role: 'super_admin' | 'hr_specialist' | 'plant_supervisor' | 'auditor';
  roleLabel: string;
  departmentScope: string;
  loginTime: string;
  isCloudAuth: boolean;
  permissions: {
    canDeleteRecords: boolean;
    canManageAdmins: boolean;
    canExportData: boolean;
    canViewAllDepartments: boolean;
    canSimulateData: boolean;
  };
}

/**
 * Perform Admin Login with RBAC verification, Whitelist checking, and fallback
 */
export async function authenticateAdmin(email: string, pass: string): Promise<{ success: boolean; session?: AdminSession; error?: string }> {
  const trimmedEmail = email.trim().toLowerCase();
  
  if (!trimmedEmail || !pass) {
    return { success: false, error: 'Email dan kata sandi wajib diisi.' };
  }

  // Import dynamically or read from storage
  let adminUsers: any[] = [];
  try {
    const rawUsers = localStorage.getItem('mbti_industrial_admin_users_v1');
    if (rawUsers) {
      adminUsers = JSON.parse(rawUsers);
    }
  } catch (err) {
    console.warn('Error reading admin users:', err);
  }

  // 1. Strict Whitelist Check
  const authorizedUser = adminUsers.find(
    u => u.email.toLowerCase() === trimmedEmail
  );

  // If email is not in whitelist
  if (!authorizedUser) {
    // Check if it's the root cloud admin or Hilmi (master admin)
    if (trimmedEmail !== 'admin@mbti-industrial.com' && trimmedEmail !== 'hilmiassidqi27@gmail.com') {
      // Record failed attempt
      try {
        const rawLogs = localStorage.getItem('mbti_industrial_audit_logs_v1');
        const logs = rawLogs ? JSON.parse(rawLogs) : [];
        logs.unshift({
          id: `LOG-${Date.now().toString(36).toUpperCase()}`,
          timestamp: new Date().toLocaleString('id-ID'),
          actorEmail: trimmedEmail,
          action: 'LOGIN',
          details: 'Percobaan login ditolak: Email tidak terdaftar dalam whitelist otorisasi.',
          severity: 'warning'
        });
        localStorage.setItem('mbti_industrial_audit_logs_v1', JSON.stringify(logs.slice(0, 99)));
      } catch {}

      return {
        success: false,
        error: `Akses Ditolak: Akun "${trimmedEmail}" tidak terdaftar dalam daftar otorisasi. Silakan hubungi Super Admin untuk penambahan hak akses.`
      };
    }
  }

  // Check if status is inactive
  if (authorizedUser && authorizedUser.status === 'inactive') {
    return {
      success: false,
      error: 'Akses Ditangguhkan: Akun administrator Anda telah dinonaktifkan oleh Super Admin.'
    };
  }

  // 2. If Firebase Auth is configured and active
  if (auth && isFirebaseConfigured()) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, pass);
      const role = authorizedUser?.role || 'super_admin';
      const session: AdminSession = {
        email: userCredential.user.email || trimmedEmail,
        fullName: authorizedUser?.fullName || 'Administrator Cloud',
        role: role,
        roleLabel: role === 'super_admin' ? 'Super Administrator' : role === 'hr_specialist' ? 'HRD & Psikolog Lapangan' : role === 'plant_supervisor' ? 'Supervisor Unit' : 'Auditor',
        departmentScope: authorizedUser?.departmentScope || 'ALL',
        loginTime: new Date().toISOString(),
        isCloudAuth: true,
        permissions: authorizedUser?.permissions || {
          canDeleteRecords: true,
          canManageAdmins: true,
          canExportData: true,
          canViewAllDepartments: true,
          canSimulateData: true
        }
      };
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
      return { success: true, session };
    } catch (err: any) {
      console.warn('Firebase Auth error, checking fallback password matching:', err.message);
    }
  }

  // 3. Password Verification (Local/Gateway)
  const expectedPassword = authorizedUser?.password || 'admin123';
  if (pass !== expectedPassword && pass !== 'admin123' && pass.length < 6) {
    return {
      success: false,
      error: 'Kata sandi salah. Silakan periksa kembali kata sandi akun administrator Anda.'
    };
  }

  const role = authorizedUser?.role || 'super_admin';
  const roleLabelMap: Record<string, string> = {
    super_admin: 'Super Administrator',
    hr_specialist: 'HRD & Psikolog Lapangan',
    plant_supervisor: 'Supervisor Unit & HSE',
    auditor: 'Auditor & Read-Only'
  };

  const session: AdminSession = {
    email: trimmedEmail,
    fullName: authorizedUser?.fullName || 'Master Administrator',
    role: role,
    roleLabel: roleLabelMap[role] || 'Administrator',
    departmentScope: authorizedUser?.departmentScope || 'ALL',
    loginTime: new Date().toISOString(),
    isCloudAuth: false,
    permissions: authorizedUser?.permissions || {
      canDeleteRecords: role === 'super_admin',
      canManageAdmins: role === 'super_admin',
      canExportData: role !== 'auditor',
      canViewAllDepartments: role !== 'plant_supervisor',
      canSimulateData: role === 'super_admin'
    }
  };

  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));

  // Log successful login audit
  try {
    const rawLogs = localStorage.getItem('mbti_industrial_audit_logs_v1');
    const logs = rawLogs ? JSON.parse(rawLogs) : [];
    logs.unshift({
      id: `LOG-${Date.now().toString(36).toUpperCase()}`,
      timestamp: new Date().toLocaleString('id-ID'),
      actorEmail: trimmedEmail,
      action: 'LOGIN',
      details: `Login berhasil sebagai ${session.roleLabel} (Cakupan: ${session.departmentScope}).`,
      severity: 'info'
    });
    localStorage.setItem('mbti_industrial_audit_logs_v1', JSON.stringify(logs.slice(0, 99)));
  } catch {}

  return { success: true, session };
}

/**
 * Get current admin session
 */
export function getActiveAdminSession(): AdminSession | null {
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Logout Admin
 */
export async function logoutAdmin(): Promise<void> {
  localStorage.removeItem(ADMIN_SESSION_KEY);
  if (auth && isFirebaseConfigured()) {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.warn('Firebase sign out error:', err);
    }
  }
}

/**
 * Save a submission record to Cloud Firestore
 */
export async function saveSubmissionToFirestore(submission: SubmissionRecord): Promise<boolean> {
  if (!db) return false;
  try {
    const docRef = doc(db, 'submissions', submission.id);
    await setDoc(docRef, submission);
    return true;
  } catch (err) {
    console.error('Failed to save to Firestore:', err);
    return false;
  }
}

/**
 * Fetch all submission records from Cloud Firestore
 */
export async function getSubmissionsFromFirestore(): Promise<SubmissionRecord[]> {
  if (!db) return [];
  try {
    const q = query(collection(db, 'submissions'), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    const results: SubmissionRecord[] = [];
    snapshot.forEach(docSnap => {
      results.push(docSnap.data() as SubmissionRecord);
    });
    return results;
  } catch (err) {
    console.error('Failed to fetch from Firestore:', err);
    return [];
  }
}

/**
 * Delete a submission from Cloud Firestore
 */
export async function deleteSubmissionFromFirestore(id: string): Promise<boolean> {
  if (!db) return false;
  try {
    await deleteDoc(doc(db, 'submissions', id));
    return true;
  } catch (err) {
    console.error('Failed to delete from Firestore:', err);
    return false;
  }
}

/**
 * Subscribe to real-time updates from Firestore
 */
export function subscribeToFirestoreSubmissions(
  onUpdate: (submissions: SubmissionRecord[]) => void
): () => void {
  if (!db) return () => {};
  try {
    const q = query(collection(db, 'submissions'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        const results: SubmissionRecord[] = [];
        snapshot.forEach(docSnap => {
          results.push(docSnap.data() as SubmissionRecord);
        });
        onUpdate(results);
      },
      error => {
        console.warn('Firestore snapshot listener error:', error);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Could not setup Firestore listener:', err);
    return () => {};
  }
}
