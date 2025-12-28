import { MasterFactSheet } from '../../stock/dto/master-fact-sheet.interface';
import { AgentProfile } from './agent-profile.interface';

export interface TokenUsage {
  totalTokens: number;
  promptTokens: number;
  completionTokens: number;
}

export interface DebateLogEntry {
  agentId: string;
  agentRole: string;
  turn: number;
  message: string;
  summary?: string;
  decision?: 'BUY' | 'SELL' | 'HOLD';
  confidence?: number;
  tokenUsage: TokenUsage;
  metadata?: any;
}

export interface VerdictResult {
  decision: 'BUY' | 'SELL' | 'HOLD';
  targetPrice: number | null;
  confidence: number;
  reasoning: string;
}

export interface DebateState {
  symbol: string;
  factSheet: MasterFactSheet;
  selectedAgents: AgentProfile[];
  debateLogs: DebateLogEntry[];
  currentTurn: number;
  consensus: boolean;
  verdict: VerdictResult | null;
  tokenUsage: TokenUsage;
}
