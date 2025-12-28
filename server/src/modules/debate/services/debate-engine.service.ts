import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AgentSelectorService } from './agent-selector.service';
import { AgentPromptService } from './agent-prompt.service';
import { TokenUsageService } from './token-usage.service';
import { DebateEventService } from './debate-event.service';
import { VerdictRepository } from '../repositories/verdict.repository';
import { DebateLogRepository } from '../repositories/debate-log.repository';
import { DebateGraphBuilder } from '../graphs/debate-graph';
import { DebateState, VerdictResult } from '../types/debate-state.interface';
import { MasterFactSheet } from '../../stock/dto/master-fact-sheet.interface';
import { Verdict, VerdictDecision } from '../../../entities/verdict.entity';
import { DebateLog } from '../../../entities/debate-log.entity';
import { FactSheetBuilderService } from '../../stock/fact-sheet-builder.service';
import YahooFinance from 'yahoo-finance2';

@Injectable()
export class DebateEngineService {
  private readonly logger = new Logger(DebateEngineService.name);
  private readonly yahooFinance = new YahooFinance();

  constructor(
    private readonly agentSelector: AgentSelectorService,
    private readonly agentPromptService: AgentPromptService,
    private readonly tokenUsageService: TokenUsageService,
    private readonly debateEventService: DebateEventService,
    private readonly verdictRepository: VerdictRepository,
    private readonly debateLogRepository: DebateLogRepository,
    private readonly factSheetBuilder: FactSheetBuilderService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 토론 시작 (비동기 - 즉시 verdictId 반환, 백그라운드에서 토론 진행)
   */
  async startDebate(
    symbol: string,
    userId: number,
  ): Promise<{ verdictId: number; selectedAgents: any[] }> {
    this.logger.log(`토론 시작: ${symbol} (사용자: ${userId})`);

    // yahoo-finance2에서 데이터 수집
    const quoteSummary = await (this.yahooFinance as any).quoteSummary(symbol);
    const historical = await this.yahooFinance.historical(symbol, {
      period1: Math.floor((Date.now() - 365 * 24 * 60 * 60 * 1000) / 1000),
      period2: Math.floor(Date.now() / 1000),
      interval: '1d' as const,
    });

    // MasterFactSheet 생성
    const factSheet = this.factSheetBuilder.buildMasterFactSheet(
      symbol,
      quoteSummary,
      historical as any[],
    );

    // 에이전트 선발
    const selectedAgents = await this.agentSelector.selectAgents(factSheet, 5);

    if (selectedAgents.length === 0) {
      throw new NotFoundException('활성화된 에이전트가 없습니다.');
    }

    // 먼저 Verdict 생성 (진행 중 상태)
    const verdict = new Verdict();
    verdict.symbol = symbol;
    verdict.userId = userId;
    verdict.decision = VerdictDecision.HOLD; // 임시
    verdict.confidence = 0;
    verdict.reasoning = '토론 진행 중...';
    verdict.factSheet = factSheet;
    verdict.totalTokens = 0;
    verdict.promptTokens = 0;
    verdict.completionTokens = 0;
    const savedVerdict = await this.verdictRepository.save(verdict);

    // 백그라운드에서 토론 실행 (await 하지 않음)
    this.runDebateAsync(savedVerdict.id, symbol, factSheet, selectedAgents, userId);

    // 선택된 에이전트 정보 반환
    const agentInfo = selectedAgents.map(profile => ({
      id: profile.agent.id,
      agentId: profile.agent.agentId,
      name: profile.agent.name,
      description: profile.agent.description,
      specialization: profile.agent.specialization,
    }));

    return { verdictId: savedVerdict.id, selectedAgents: agentInfo };
  }

  /**
   * 백그라운드에서 토론 실행
   */
  private async runDebateAsync(
    verdictId: number,
    symbol: string,
    factSheet: MasterFactSheet,
    selectedAgents: any[],
    userId: number,
  ): Promise<void> {
    try {
      // 초기 상태 생성
      const initialState: DebateState = {
        symbol,
        factSheet,
        selectedAgents,
        debateLogs: [],
        currentTurn: 1,
        consensus: false,
        verdict: null,
        tokenUsage: {
          totalTokens: 0,
          promptTokens: 0,
          completionTokens: 0,
        },
      };

      // 그래프 빌더 생성 (이벤트 콜백 전달)
      const graphBuilder = new DebateGraphBuilder(
        this.tokenUsageService,
        this.agentPromptService,
        this.configService,
        // 로그 콜백: 각 에이전트 발언 시 호출
        async (log) => {
          // DB에 먼저 저장 (id 생성)
          const savedLog = await this.saveDebateLogAsync(verdictId, log);
          // 저장된 로그를 이벤트로 발행 (id 포함)
          if (savedLog) {
            this.debateEventService.emitLog(verdictId, {
              ...log,
              id: savedLog.id,
            });
          }
        },
      );

      // 그래프 실행
      const graph = graphBuilder.buildGraph();
      const finalState = (await graph.invoke(initialState)) as DebateState;

      // Verdict 업데이트
      await this.updateVerdict(verdictId, finalState);

      // 완료 이벤트 발행
      if (finalState.verdict) {
        this.debateEventService.emitComplete(verdictId, {
          decision: finalState.verdict.decision,
          targetPrice: finalState.verdict.targetPrice,
          confidence: finalState.verdict.confidence,
          reasoning: finalState.verdict.reasoning,
        });
      }

      this.logger.log(`토론 완료: ${symbol} (Verdict ID: ${verdictId})`);
    } catch (error) {
      this.logger.error(`토론 에러: ${symbol}`, error);
      this.debateEventService.emitError(verdictId, error.message);
    }
  }

  /**
   * 단일 DebateLog 즉시 저장
   */
  private async saveDebateLogAsync(verdictId: number, log: any): Promise<DebateLog | null> {
    try {
      const debateLog = new DebateLog();
      debateLog.verdictId = verdictId;
      debateLog.agentId = log.agentId;
      debateLog.agentRole = log.agentRole;
      debateLog.turn = log.turn;
      debateLog.message = log.message;
      debateLog.summary = log.summary || null;
      debateLog.decision = log.decision || null;
      debateLog.confidence = log.confidence || null;
      debateLog.metadata = log.metadata;
      debateLog.tokensUsed = log.tokenUsage?.totalTokens || 0;
      debateLog.promptTokens = log.tokenUsage?.promptTokens || 0;
      debateLog.completionTokens = log.tokenUsage?.completionTokens || 0;
      return await this.debateLogRepository.save(debateLog);
    } catch (error) {
      this.logger.error('DebateLog 저장 실패:', error);
      return null;
    }
  }

  /**
   * Verdict 업데이트
   */
  private async updateVerdict(
    verdictId: number,
    state: DebateState,
  ): Promise<void> {
    if (!state.verdict) {
      return;
    }

    await this.verdictRepository.update(verdictId, {
      decision: state.verdict.decision as VerdictDecision,
      targetPrice: state.verdict.targetPrice,
      confidence: state.verdict.confidence,
      reasoning: state.verdict.reasoning,
      totalTokens: state.tokenUsage.totalTokens,
      promptTokens: state.tokenUsage.promptTokens,
      completionTokens: state.tokenUsage.completionTokens,
    });
  }

  /**
   * 이벤트 서비스 getter (컨트롤러에서 사용)
   */
  getEventService(): DebateEventService {
    return this.debateEventService;
  }

  /**
   * Verdict 조회
   */
  async getVerdict(verdictId: number): Promise<Verdict> {
    const verdict = await this.verdictRepository.findById(verdictId);
    if (!verdict) {
      throw new NotFoundException(`평결을 찾을 수 없습니다: ${verdictId}`);
    }
    return verdict;
  }

  /**
   * DebateLog 조회
   */
  async getDebateLogs(verdictId: number): Promise<DebateLog[]> {
    return this.debateLogRepository.findByVerdictId(verdictId);
  }
}
