/**
 * 토론 관련 타입 정의
 */

export interface DebateLog {
  id: number;
  verdictId: number;
  agentId: string;
  agentRole: string;
  turn: number;
  message: string;
  summary?: string;
  decision?: 'BUY' | 'SELL' | 'HOLD';
  confidence?: number;
  metadata?: any;
  tokensUsed: number;
  promptTokens: number;
  completionTokens: number;
  createdAt: string;
}

export interface VerdictResult {
  id: number;
  symbol: string;
  userId: number;
  decision: 'BUY' | 'SELL' | 'HOLD';
  targetPrice: number | null;
  confidence: number;
  reasoning: string;
  factSheet: any;
  totalTokens: number;
  promptTokens: number;
  completionTokens: number;
  createdAt: string;
  updatedAt: string;
}

export interface StartDebateResponse {
  id: number;
  symbol: string;
  userId: number;
  decision: 'BUY' | 'SELL' | 'HOLD';
  targetPrice: number | null;
  confidence: number;
  reasoning: string;
  factSheet: any;
  totalTokens: number;
  promptTokens: number;
  completionTokens: number;
  createdAt: string;
  updatedAt: string;
}

export interface Agent {
  id: number;
  agentId: string;
  name: string;
  description: string | null;
  specialization: string;
  expertiseCategories: string[];
  isActive: boolean;
  priority: number;
  model: string | null;
  temperature: number;
  maxTokens: number;
  metadata: any;
  createdAt: string;
  updatedAt: string;
}

export type DebateStatus = 'idle' | 'starting' | 'streaming' | 'completed' | 'error';
