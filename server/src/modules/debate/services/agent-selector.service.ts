import { Injectable, Logger } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';
import { ConfigService } from '@nestjs/config';
import { AgentService } from './agent.service';
import { AgentPromptService } from './agent-prompt.service';
import { AgentProfile } from '../types/agent-profile.interface';
import { MasterFactSheet } from '../../stock/dto/master-fact-sheet.interface';

@Injectable()
export class AgentSelectorService {
  private readonly logger = new Logger(AgentSelectorService.name);
  private readonly selectorModel: string;

  constructor(
    private readonly agentService: AgentService,
    private readonly agentPromptService: AgentPromptService,
    private readonly configService: ConfigService,
  ) {
    this.selectorModel =
      this.configService.get<string>('OPENAI_SELECTOR_MODEL') || 'gpt-4o-mini';
  }

  /**
   * LLM을 사용해서 MasterFactSheet 기반으로 적합한 5명의 에이전트 선발
   */
  async selectAgents(
    factSheet: MasterFactSheet,
    count: number = 5,
  ): Promise<AgentProfile[]> {
    // 활성화된 모든 에이전트 조회
    const agents = await this.agentService.getActiveAgents();

    if (agents.length === 0) {
      this.logger.warn('활성화된 에이전트가 없습니다.');
      return [];
    }

    if (agents.length <= count) {
      // 에이전트 수가 요청한 수보다 적으면 모두 선택
      const profiles: AgentProfile[] = [];
      for (const agent of agents) {
        const prompt = await this.agentPromptService.getActivePrompt(agent.id);
        if (prompt) {
          profiles.push({ agent, prompt, score: 0 });
        }
      }
      return profiles;
    }

    // LLM으로 에이전트 선택
    try {
      const selectedAgentIds = await this.selectAgentsWithLLM(
        factSheet,
        agents,
        count,
      );

      // 선택된 에이전트들의 프로필 생성
      const profiles: AgentProfile[] = [];
      for (const agentId of selectedAgentIds) {
        const agent = agents.find((a) => a.agentId === agentId);
        if (agent) {
          const prompt = await this.agentPromptService.getActivePrompt(
            agent.id,
          );
          if (prompt) {
            profiles.push({ agent, prompt, score: 0 });
          }
        }
      }

      // 선택된 에이전트가 부족하면 기존 로직으로 보충
      if (profiles.length < count) {
        this.logger.warn(
          `LLM이 ${profiles.length}명만 선택. 기존 로직으로 보충`,
        );
        return this.selectAgentsFallback(factSheet, count);
      }

      this.logger.log(
        `LLM이 선택한 에이전트: ${profiles.map((p) => p.agent.agentId).join(', ')}`,
      );
      return profiles;
    } catch (error) {
      this.logger.error('LLM 에이전트 선택 실패, 기존 로직 사용:', error);
      return this.selectAgentsFallback(factSheet, count);
    }
  }

  /**
   * LLM을 사용해서 에이전트 선택
   */
  private async selectAgentsWithLLM(
    factSheet: MasterFactSheet,
    agents: any[],
    count: number,
  ): Promise<string[]> {
    const llm = new ChatOpenAI({
      model: this.selectorModel,
      temperature: 0.3, // 일관성을 위해 낮은 temperature
    });

    // 에이전트 정보 요약
    const agentSummary = agents
      .map(
        (a, idx) =>
          `${idx + 1}. ${a.agentId} (${a.name}): ${a.specialization}
   전문분야: ${JSON.stringify(a.expertiseCategories)}`,
      )
      .join('\n\n');

    // Fact Sheet 요약
    const factSummary = `
### 재무 데이터 가용성:
- Valuation: ${this.hasData(factSheet.valuation) ? '✅' : '❌'} (PE, PB, intrinsic value)
- Growth: ${this.hasData(factSheet.growth) ? '✅' : '❌'} (revenue growth, earnings growth)
- Safety: ${this.hasData(factSheet.safety) ? '✅' : '❌'} (debt, current ratio, FCF)
- Efficiency: ${this.hasData(factSheet.efficiency) ? '✅' : '❌'} (ROE, operating margins)
- Momentum: ${this.hasData(factSheet.momentum) ? '✅' : '❌'} (RSI, MACD, Bollinger Bands, volume)
- Dividend: ${this.hasData(factSheet.dividend) ? '✅' : '❌'} (yield, payout ratio)
`;

    const systemPrompt = `당신은 투자 토론을 위한 최적의 에이전트 팀을 구성하는 전문가입니다.

주어진 주식의 데이터를 분석하고, 가장 유용한 관점을 제공할 수 있는 ${count}명의 에이전트를 선택하세요.

선택 기준:
1. 가용한 데이터에 맞는 전문성
2. 다양한 관점 (가치/성장/기술적/리스크 등)
3. 서로 보완적인 역할
4. 토론의 역동성 (의견 충돌 가능성)

**중요**: 매번 다른 조합을 시도하세요. 항상 같은 에이전트만 선택하지 마세요.`;

    const humanPrompt = `${factSheet.symbol}의 Master Fact Sheet:
${factSummary}

현재 가격: $${factSheet.currentPrice}

사용 가능한 에이전트:
${agentSummary}

위 에이전트 중 ${count}명을 선택하세요.

**응답 형식 (JSON only):**
\`\`\`json
{
  "selected": ["agent_id_1", "agent_id_2", "agent_id_3", "agent_id_4", "agent_id_5"],
  "reasoning": "선택 이유 간단히"
}
\`\`\``;

    const messages = [
      new SystemMessage(systemPrompt),
      new HumanMessage(humanPrompt),
    ];

    const response = await llm.invoke(messages);
    const content = response.content as string;

    // JSON 파싱
    const jsonMatch =
      content.match(/```json\s*([\s\S]*?)\s*```/) ||
      content.match(/(\{[\s\S]*"selected"[\s\S]*\})/);

    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[1]);
      this.logger.log(`에이전트 선택 이유: ${parsed.reasoning}`);
      return parsed.selected || [];
    }

    throw new Error('LLM 응답 파싱 실패');
  }

  /**
   * 기존 스코어 기반 선택 (폴백)
   */
  private async selectAgentsFallback(
    factSheet: MasterFactSheet,
    count: number,
  ): Promise<AgentProfile[]> {
    const agents = await this.agentService.getActiveAgents();
    const profiles: AgentProfile[] = [];

    for (const agent of agents) {
      const score = this.agentService.scoreAgent(agent, factSheet);
      const prompt = await this.agentPromptService.getActivePrompt(agent.id);

      if (prompt) {
        profiles.push({ agent, prompt, score });
      }
    }

    // 스코어와 우선순위 기반 정렬
    profiles.sort((a, b) => {
      if (a.score === b.score) {
        return a.agent.priority - b.agent.priority;
      }
      return b.score - a.score;
    });

    return profiles.slice(0, count);
  }

  /**
   * 데이터 존재 여부 체크
   */
  private hasData(obj: any): boolean {
    if (!obj) return false;
    return Object.values(obj).some((v) => v !== null && v !== undefined);
  }
}
