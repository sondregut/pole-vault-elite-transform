// Types for the AI Chat feature

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  navigation?: NavigationIntent;
  sessionResults?: SessionResult[];
  jumpResults?: JumpResult[];
  stats?: StatsResult;
}

export interface NavigationIntent {
  destination: 'session' | 'video' | 'analytics' | 'equipment' | 'sessions_list';
  sessionId?: string;
  jumpId?: string;
  jumpIndex?: number;
}

export interface SessionResult {
  id: string;
  date: string;
  location: string;
  sessionType: string;
  competitionName?: string;
  jumpCount: number;
  hasVideos: boolean;
  bestHeight?: string;
}

export interface JumpResult {
  sessionId: string;
  jumpId: string;
  jumpIndex: number;
  date: string;
  height: string;
  rating: string;
  result?: 'make' | 'no-make';
  hasVideo: boolean;
  videoUrl?: string | null;
  videoUploadStatus?: 'pending' | 'uploading' | 'completed' | 'failed' | null;
  location: string;
  competitionName?: string;
}

export interface StatsResult {
  personalBest?: string;
  totalSessions?: number;
  totalJumps?: number;
  successRate?: number;
  heightSuccessRate?: { height: string; rate: number; attempts: number }[];
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

// Request/Response types for the Cloud Function
export interface ChatRequest {
  message: string;
  conversationHistory: { role: 'user' | 'assistant'; content: string }[];
}

export interface ChatResponse {
  message: string;
  navigation?: NavigationIntent;
  sessionResults?: SessionResult[];
  jumpResults?: JumpResult[];
  stats?: StatsResult;
}
