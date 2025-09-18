// Types based on the Vault mobile app data structure

export interface Jump {
  id: string;
  height: string;
  pole: string;
  rating: string;
  steps?: number;
  gripHeight?: string;
  runUpLength?: string;
  takeOff?: string;
  midMark?: string;
  notes?: string;
  barUnits?: 'm' | 'ft';
  poleDetails?: {
    brand: string;
    length: string;
    pounds: string;
    flex: string;
  };
  standards?: number;
  result?: 'make' | 'no-make';
  barClearance?: 'deep' | 'on' | 'shallow';
  isWarmup?: boolean;
  videoUrl?: string;
  thumbnailUrl?: string;
  isFavorite: boolean;
  videoLocalUri?: string;
  thumbnailLocalUri?: string;
  videoUploadStatus?: 'pending' | 'uploading' | 'completed' | 'failed';
  videoUploadId?: string;
}

export interface Session {
  id?: string;
  date: string | Date;
  sessionType: string;
  location: string;
  isIndoor?: boolean;
  weather?: string;
  temperature?: string;
  temperatureScale?: string;
  windDirection?: string;
  windSpeed?: string;
  sessionGoal?: string;
  energyLevel?: number;
  mentalNotes?: string;
  jumps: Jump[];
  postSession: any;
  ended?: boolean;
  createdAt?: string;
  competitionPhase?: 'warmup' | 'competition';
  competitionName?: string;
  sharedToFeed?: boolean;
  sharedAt?: string;
}

export interface Pole {
  id: string;
  name: string;
  brand: string;
  length: string;
  pounds: string;
  flex?: string;
  serial?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PoleUsageStats {
  poleId: string;
  poleName: string;
  timesUsed: number;
  successRate: number;
  averageHeight: number;
  personalBest: number;
  lastUsed?: string;
}

// Available pole brands for validation
export const POLE_BRANDS = [
  'UCS Spirit',
  'ESSX',
  'Pacer Composite',
  'FiberSport',
  'Pacer FXV',
  'Pacer Carbon',
  'Pacer One',
  'Nordic',
  'Skypole',
  'Gill',
  'Cantabrian',
  'UCS',
  'Other'
];

// Parse pole data for import
export interface ParsedPole {
  rowNumber: number;
  brand: string;
  length: string;
  pounds: string;
  flex?: string;
  serial?: string;
  notes?: string;
  isValid: boolean;
  errors: string[];
}

export interface UserStats {
  totalSessions: number;
  totalJumps: number;
  personalBest: string;
  personalBestUnits: 'm' | 'ft';
  activePoles: number;
  totalVideos: number;
  recentSessionsCount: number;
  thisWeekSessions: number;
  thisMonthPBImprovement: string;
}

export const ratingLabels: Record<string, string> = {
  runthru: 'Run Thru',
  glider: 'Glider',
  ok: 'OK',
  good: 'Good',
  great: 'Great',
};

export const ratingColors: Record<string, string> = {
  runthru: '#FF3B30',
  glider: '#FF9500',
  ok: '#FFCC00',
  good: '#34C759',
  great: '#007AFF',
};

export function isFirestoreTimestamp(date: any): date is { toDate: () => Date } {
  return date && typeof date.toDate === 'function';
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString();
}

export function formatHeight(height: string, units: 'm' | 'ft' = 'm'): string {
  return `${height}${units}`;
}