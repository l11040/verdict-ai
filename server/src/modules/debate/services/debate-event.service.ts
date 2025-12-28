import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'events';

export interface DebateLogEvent {
  id?: number;
  verdictId: number;
  agentId: string;
  agentRole: string;
  turn: number;
  message: string;
  metadata?: any;
  tokenUsage: {
    totalTokens: number;
    promptTokens: number;
    completionTokens: number;
  };
}

export interface DebateCompleteEvent {
  verdictId: number;
  decision: 'BUY' | 'SELL' | 'HOLD';
  targetPrice: number | null;
  confidence: number;
  reasoning: string;
}

export interface DebateErrorEvent {
  verdictId: number;
  error: string;
}

@Injectable()
export class DebateEventService {
  private readonly eventEmitter = new EventEmitter();

  constructor() {
    // 최대 리스너 수 증가 (동시 토론 세션 지원)
    this.eventEmitter.setMaxListeners(100);
  }

  /**
   * 에이전트 발언 이벤트 발행
   */
  emitLog(verdictId: number, log: Omit<DebateLogEvent, 'verdictId'>) {
    this.eventEmitter.emit(`debate.log.${verdictId}`, {
      verdictId,
      ...log,
    });
  }

  /**
   * 토론 완료 이벤트 발행
   */
  emitComplete(verdictId: number, result: Omit<DebateCompleteEvent, 'verdictId'>) {
    this.eventEmitter.emit(`debate.complete.${verdictId}`, {
      verdictId,
      ...result,
    });
  }

  /**
   * 토론 에러 이벤트 발행
   */
  emitError(verdictId: number, error: string) {
    this.eventEmitter.emit(`debate.error.${verdictId}`, {
      verdictId,
      error,
    });
  }

  /**
   * 이벤트 구독
   */
  onLog(verdictId: number, callback: (log: DebateLogEvent) => void): () => void {
    const eventName = `debate.log.${verdictId}`;
    this.eventEmitter.on(eventName, callback);
    return () => this.eventEmitter.off(eventName, callback);
  }

  onComplete(verdictId: number, callback: (result: DebateCompleteEvent) => void): () => void {
    const eventName = `debate.complete.${verdictId}`;
    this.eventEmitter.on(eventName, callback);
    return () => this.eventEmitter.off(eventName, callback);
  }

  onError(verdictId: number, callback: (error: DebateErrorEvent) => void): () => void {
    const eventName = `debate.error.${verdictId}`;
    this.eventEmitter.on(eventName, callback);
    return () => this.eventEmitter.off(eventName, callback);
  }
}
