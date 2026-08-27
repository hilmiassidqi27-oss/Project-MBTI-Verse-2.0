export interface UserProfile {
  fullName: string;
  nik: string;
  position: string;
  department: string;
  workArea?: string;
  email: string;
}

export type LikertUIStyle = 'nodes' | 'numbers' | 'emoji';

export type DimensionAxis = 'EI' | 'SN' | 'TF' | 'JP';

export interface Question {
  id: number;
  text: string;
  dimension: DimensionAxis;
  /** 1 means "Agree" tilts toward right pole (I, N, F, P), -1 means Agree tilts toward left pole (E, S, T, J) */
  direction: 1 | -1;
  scenarioContext: string;
  leftTrait: string;
  rightTrait: string;
}

export interface DimensionScore {
  leftCode: string;
  rightCode: string;
  leftLabel: string;
  rightLabel: string;
  leftPct: number;
  rightPct: number;
  dominantCode: string;
  dominantLabel: string;
  clarityScore: 'Slight' | 'Moderate' | 'Clear' | 'Very Clear';
}

export interface CareerRecommendation {
  title: string;
  matchScore: number;
  description: string;
  keySkills: string[];
}

export interface MBTIProfileData {
  code: string;
  nickname: string;
  shortDescription: string;
  industrialAnalysis: string;
  operationalStrengths: string[];
  growthAreas: string[];
  crisisResponse: string;
  safetyOrientation: string;
  teamCollaboration: string;
  preferredWorkEnvironment: string;
  careerRecommendations: CareerRecommendation[];
}

export interface MBTIResult {
  code: string;
  nickname: string;
  profile: MBTIProfileData;
  dimensions: {
    EI: DimensionScore;
    SN: DimensionScore;
    TF: DimensionScore;
    JP: DimensionScore;
  };
  completionTime: string;
}

export interface SubmissionRecord {
  id: string;
  user: UserProfile;
  result: MBTIResult;
  answers: Record<number, number>;
  createdAt: string;
  timestamp: number;
}

export type AdminRole = 'super_admin' | 'hr_specialist' | 'plant_supervisor' | 'auditor';

export interface AdminRolePermissions {
  canDeleteRecords: boolean;
  canManageAdmins: boolean;
  canExportData: boolean;
  canViewAllDepartments: boolean;
  canSimulateData: boolean;
}

export interface AdminUserRecord {
  id: string;
  email: string;
  fullName: string;
  role: AdminRole;
  departmentScope: string; // 'ALL' or specific department
  status: 'active' | 'inactive';
  passwordHint?: string;
  password?: string;
  createdAt: string;
  lastLogin?: string;
  permissions: AdminRolePermissions;
}

export interface AuditLogRecord {
  id: string;
  timestamp: string;
  actorEmail: string;
  action: 'LOGIN' | 'LOGOUT' | 'EXPORT_DATA' | 'DELETE_SUBMISSION' | 'CREATE_ADMIN' | 'UPDATE_ADMIN' | 'DELETE_ADMIN' | 'SIMULATE_DATA';
  details: string;
  severity: 'info' | 'warning' | 'critical';
}

