import { Annotation, StateGraph, END, START } from '@langchain/langgraph';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { DebateLogEntry, VerdictResult } from '../types/debate-state.interface';
import { AgentProfile } from '../types/agent-profile.interface';
import { TokenUsageService } from '../services/token-usage.service';
import { AgentPromptService } from '../services/agent-prompt.service';
import { ConfigService } from '@nestjs/config';
import { MasterFactSheet } from '../../stock/dto/master-fact-sheet.interface';
import { TokenUsage } from '../types/token-usage.interface';

// Annotation을 사용한 상태 정의 (LangGraph v0.2+ API)
const DebateStateAnnotation = Annotation.Root({
  symbol: Annotation<string>,
  factSheet: Annotation<MasterFactSheet>,
  selectedAgents: Annotation<AgentProfile[]>,
  debateLogs: Annotation<DebateLogEntry[]>({
    reducer: (x, y) => (y ? [...x, ...y] : x),
    default: () => [],
  }),
  currentTurn: Annotation<number>({
    reducer: (x, y) => (y !== undefined ? y : x),
    default: () => 0,
  }),
  consensus: Annotation<boolean>({
    reducer: (x, y) => (y !== undefined ? y : x),
    default: () => false,
  }),
  verdict: Annotation<VerdictResult | null>({
    reducer: (x, y) => (y !== undefined ? y : x),
    default: () => null,
  }),
  tokenUsage: Annotation<TokenUsage>({
    reducer: (x, y) => {
      if (!y) return x;
      // 누적 계산
      return {
        totalTokens: x.totalTokens + y.totalTokens,
        promptTokens: x.promptTokens + y.promptTokens,
        completionTokens: x.completionTokens + y.completionTokens,
      };
    },
    default: () => ({ totalTokens: 0, promptTokens: 0, completionTokens: 0 }),
  }),
});

// 상태 타입 추출
type DebateGraphState = typeof DebateStateAnnotation.State;

// 로그 콜백 타입 (async 지원)
export type LogCallback = (log: DebateLogEntry) => void | Promise<void>;

// JSON 응답 파싱 인터페이스
interface AgentJsonResponse {
  decision: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  summary: string;
  reasoning: string;
}

// LLM 응답에서 JSON 파싱
function parseAgentResponse(content: string): AgentJsonResponse | null {
  try {
    // JSON 블록 추출 (```json ... ``` 또는 { ... })
    const jsonMatch =
      content.match(/```json\s*([\s\S]*?)\s*```/) ||
      content.match(/(\{[\s\S]*"decision"[\s\S]*\})/);

    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[1]);
      return {
        decision: parsed.decision || 'HOLD',
        confidence: parsed.confidence || 50,
        summary: parsed.summary || '',
        reasoning: parsed.reasoning || content,
      };
    }

    // JSON이 아닌 경우 텍스트에서 추출 시도
    const decisionMatch = content.toUpperCase().match(/\b(BUY|SELL|HOLD)\b/);
    return {
      decision: (decisionMatch?.[1] as 'BUY' | 'SELL' | 'HOLD') || 'HOLD',
      confidence: 50,
      summary: content.split('\n')[0]?.slice(0, 50) || '',
      reasoning: content,
    };
  } catch {
    return null;
  }
}

export class DebateGraphBuilder {
  private readonly defaultModel: string;
  private readonly onLogCallback?: LogCallback;

  constructor(
    private readonly tokenUsageService: TokenUsageService,
    private readonly agentPromptService: AgentPromptService,
    private readonly configService: ConfigService,
    onLogCallback?: LogCallback,
  ) {
    this.defaultModel =
      this.configService.get<string>('OPENAI_DEFAULT_MODEL') || 'gpt-4o-mini';
    this.onLogCallback = onLogCallback;
  }

  /**
   * LangGraph 그래프 생성
   */
  buildGraph() {
    // StateGraph 생성 (Annotation 기반)
    const workflow = new StateGraph(DebateStateAnnotation)
      .addNode('debateRound', this.debateRoundNode.bind(this))
      .addNode('checkConsensus', this.checkConsensusNode.bind(this))
      .addNode('finalVerdict', this.finalVerdictNode.bind(this))
      .addEdge(START, 'debateRound')
      .addConditionalEdges('debateRound', this.shouldContinue.bind(this), [
        'checkConsensus',
        'finalVerdict',
      ])
      .addConditionalEdges('checkConsensus', this.hasConsensus.bind(this), [
        'debateRound',
        'finalVerdict',
      ])
      .addEdge('finalVerdict', END);

    return workflow.compile();
  }

  /**
   * 토론 라운드 노드
   */
  private async debateRoundNode(
    state: DebateGraphState,
  ): Promise<Partial<DebateGraphState>> {
    const newLogs: DebateLogEntry[] = [];
    let totalTokenUsage = {
      totalTokens: 0,
      promptTokens: 0,
      completionTokens: 0,
    };

    // 각 에이전트가 순차적으로 발언
    for (const profile of state.selectedAgents) {
      const agent = profile.agent;
      const prompt = profile.prompt;

      // 모델 결정 (우선순위: Agent 엔티티 > 환경 변수 > 기본값)
      const model = agent.model || this.defaultModel;

      // LLM 인스턴스 생성 (DB에서 decimal은 string으로 반환될 수 있음)
      const llm = new ChatOpenAI({
        modelName: model,
        temperature: Number(agent.temperature),
        maxTokens: Number(agent.maxTokens),
      });

      // 프롬프트 렌더링
      const renderedPrompt = this.agentPromptService.renderPrompt(
        prompt,
        agent.name,
        state.factSheet,
        state.debateLogs,
        state.currentTurn,
        state.symbol,
      );

      // 메시지 구성
      const messages = [
        new SystemMessage(prompt.systemPrompt),
        new HumanMessage(renderedPrompt),
      ];

      // LLM 호출
      const response = await llm.invoke(messages);
      const rawContent = response.content as string;

      // 토큰 사용량 추출
      const tokenUsage = this.tokenUsageService.extractTokenUsage(response);

      // 디버깅: 토큰 사용량 로깅
      console.log(`[${agent.agentId}] 토큰 사용량:`, tokenUsage);
      console.log(`[${agent.agentId}] response 구조:`, {
        hasUsageMetadata: !!response.usage_metadata,
        hasResponseMetadata: !!response.response_metadata,
        usageMetadata: response.usage_metadata,
        responseMetadata: response.response_metadata,
      });

      // JSON 응답 파싱
      const parsed = parseAgentResponse(rawContent);

      // 발언 로그 생성
      const logEntry: DebateLogEntry = {
        agentId: agent.agentId,
        agentRole: agent.name,
        turn: state.currentTurn,
        message: parsed?.reasoning || rawContent,
        summary: parsed?.summary || rawContent.slice(0, 50),
        decision: parsed?.decision,
        confidence: parsed?.confidence,
        tokenUsage,
        metadata: {
          model,
          temperature: agent.temperature,
          rawResponse: rawContent,
        },
      };

      // 콜백 호출 (실시간 스트리밍용) - await로 순차 실행
      if (this.onLogCallback) {
        await this.onLogCallback(logEntry);
      }

      newLogs.push(logEntry);
      totalTokenUsage = this.tokenUsageService.sumTokenUsage([
        totalTokenUsage,
        tokenUsage,
      ]);
    }

    // 상태 업데이트 - tokenUsage reducer가 자동으로 누적함
    return {
      debateLogs: newLogs,
      currentTurn: state.currentTurn + 1,
      tokenUsage: totalTokenUsage, // reducer가 자동으로 이전 값과 합산
    };
  }

  /**
   * 합의 확인 노드
   */
  private async checkConsensusNode(
    state: DebateGraphState,
  ): Promise<Partial<DebateGraphState>> {
    // 간단한 합의 로직: 마지막 3개 발언에서 BUY/SELL/HOLD 키워드 확인
    const recentLogs = state.debateLogs.slice(-3);
    const decisions = recentLogs.map((log) => {
      const message = log.message.toUpperCase();
      if (message.includes('BUY')) return 'BUY';
      if (message.includes('SELL')) return 'SELL';
      if (message.includes('HOLD')) return 'HOLD';
      return null;
    });

    const uniqueDecisions = [...new Set(decisions.filter((d) => d !== null))];
    const consensus =
      uniqueDecisions.length === 1 && uniqueDecisions[0] !== null;

    return { consensus };
  }

  /**
   * 최종 평결 노드
   */
  private async finalVerdictNode(
    state: DebateGraphState,
  ): Promise<Partial<DebateGraphState>> {
    // 마지막 발언들을 분석하여 평결 생성
    const recentLogs = state.debateLogs.slice(-state.selectedAgents.length);
    const decisions: { [key: string]: number } = { BUY: 0, SELL: 0, HOLD: 0 };

    recentLogs.forEach((log) => {
      // decision 필드 우선 사용
      if (log.decision) {
        decisions[log.decision]++;
      } else {
        // 백업: 메시지에서 추출
        const message = log.message.toUpperCase();
        if (message.includes('BUY')) decisions.BUY++;
        if (message.includes('SELL')) decisions.SELL++;
        if (message.includes('HOLD')) decisions.HOLD++;
      }
    });

    // 가장 많은 의견 선택
    const decision = Object.entries(decisions).reduce((a, b) =>
      a[1] > b[1] ? a : b,
    )[0] as 'BUY' | 'SELL' | 'HOLD';

    // 목표가 추출 개선: 현재가 대비 상대 비율로 계산
    const currentPrice = state.factSheet.currentPrice || null;
    let targetPrice: number | null = null;

    if (currentPrice) {
      // 에이전트들의 메시지에서 구체적인 목표가가 언급되었는지 먼저 확인
      // "target price", "price target" 등의 키워드와 함께 언급된 가격만 채택
      const explicitTargets: number[] = [];

      recentLogs.forEach((log) => {
        const message = log.message;

        // 패턴 1: "target price of $XXX" 또는 "price target: $XXX"
        const targetMatch = message.match(
          /(?:target\s+price|price\s+target)(?:\s+of)?[\s:]+\$?\s*(\d+(?:\.\d+)?)/i,
        );
        if (targetMatch) {
          const price = parseFloat(targetMatch[1]);
          // 현재가의 0.3배~3배 범위 내만 유효
          if (
            price > 0 &&
            price >= currentPrice * 0.3 &&
            price <= currentPrice * 3
          ) {
            explicitTargets.push(price);
          }
        }
      });

      if (explicitTargets.length > 0) {
        // 명시적인 목표가가 있으면 평균 사용
        targetPrice =
          explicitTargets.reduce((a, b) => a + b, 0) / explicitTargets.length;
      } else {
        // 명시적인 목표가가 없으면 decision에 따른 기본값 설정
        if (decision === 'BUY') {
          targetPrice = currentPrice * 1.15; // +15% 상승 목표
        } else if (decision === 'SELL') {
          targetPrice = currentPrice * 0.85; // -15% 하락 예상
        } else {
          targetPrice = currentPrice; // HOLD는 현재가 유지
        }
      }
    }

    // 신뢰도 계산 (합의도 기반)
    const totalVotes = decisions.BUY + decisions.SELL + decisions.HOLD;
    const confidence =
      totalVotes > 0
        ? Math.round((decisions[decision] / totalVotes) * 100)
        : 50;

    // 근거 생성
    const reasoning = recentLogs
      .map((log) => `${log.agentRole}: ${log.message}`)
      .join('\n\n');

    const verdict: VerdictResult = {
      decision,
      targetPrice,
      confidence,
      reasoning,
    };

    return { verdict };
  }

  /**
   * 계속 진행 여부 확인
   */
  private shouldContinue(state: DebateGraphState): string {
    // 최대 5턴까지 진행
    if (state.currentTurn >= 5) {
      return 'finalVerdict';
    }
    return 'checkConsensus';
  }

  /**
   * 합의 도출 여부 확인
   */
  private hasConsensus(state: DebateGraphState): string {
    // 2턴 이하에서는 합의 체크 안 함 (최소 토론 보장)
    if (state.currentTurn < 2) {
      return 'debateRound';
    }

    // 합의 조건: 최근 턴에서 모든 에이전트가 같은 의견 + 신뢰도 높음
    if (state.consensus) {
      const recentLogs = state.debateLogs.slice(-state.selectedAgents.length);
      const avgConfidence =
        recentLogs.reduce((sum, log) => sum + (log.confidence || 50), 0) /
        recentLogs.length;

      // 평균 신뢰도가 70% 이상이면 조기 종료
      if (avgConfidence >= 70) {
        return 'finalVerdict';
      }
    }
    return 'debateRound';
  }
}

// 상태 타입 export
export type { DebateGraphState };
