import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AgentPromptRepository } from '../repositories/agent-prompt.repository';
import { AgentRepository } from '../repositories/agent.repository';
import { AgentPrompt } from '../../../entities/agent-prompt.entity';
import { MasterFactSheet } from '../../stock/dto/master-fact-sheet.interface';
import { DebateLogEntry } from '../types/debate-state.interface';

@Injectable()
export class AgentPromptService {
  private readonly logger = new Logger(AgentPromptService.name);

  constructor(
    private readonly agentPromptRepository: AgentPromptRepository,
    private readonly agentRepository: AgentRepository,
  ) {}

  /**
   * 에이전트의 활성화된 프롬프트 조회
   */
  async getActivePrompt(agentId: number): Promise<AgentPrompt | null> {
    return this.agentPromptRepository.findActiveByAgentId(agentId);
  }

  /**
   * 프롬프트 템플릿 변수 치환
   */
  renderPrompt(
    prompt: AgentPrompt,
    agentName: string,
    factSheet: MasterFactSheet,
    previousDebates: DebateLogEntry[],
    currentTurn: number,
    symbol: string,
  ): string {
    let rendered = prompt.instructionTemplate;

    // previousDebates를 읽기 쉽게 포맷팅
    const formattedDebates = this.formatPreviousDebates(previousDebates);

    // 템플릿 변수 치환
    rendered = rendered.replace(
      /\{\{factSheet\}\}/g,
      JSON.stringify(factSheet, null, 2),
    );
    rendered = rendered.replace(/\{\{previousDebates\}\}/g, formattedDebates);
    rendered = rendered.replace(/\{\{currentTurn\}\}/g, currentTurn.toString());
    rendered = rendered.replace(/\{\{agentName\}\}/g, agentName);
    rendered = rendered.replace(/\{\{agentRole\}\}/g, agentName);
    rendered = rendered.replace(/\{\{symbol\}\}/g, symbol);

    return rendered;
  }

  /**
   * 이전 토론 내용을 읽기 쉽게 포맷팅
   */
  private formatPreviousDebates(debates: DebateLogEntry[]): string {
    if (!debates || debates.length === 0) {
      return '아직 토론이 시작되지 않았습니다. 당신이 첫 번째 발언자입니다.';
    }

    const formatted = debates
      .map((log) => {
        const decision = log.decision
          ? `[${log.decision}${log.confidence ? ` ${log.confidence}%` : ''}]`
          : '';
        return `
[턴 ${log.turn}] ${log.agentRole} ${decision}
${log.summary || log.message}
`.trim();
      })
      .join('\n\n');

    return `
이전 토론 요약:
${formatted}

주의: 위 의견들을 참고하되, 다른 관점이나 지표를 활용하여 새로운 통찰을 제공하세요.
같은 내용을 반복하지 마세요.
`.trim();
  }

  /**
   * 시스템 프롬프트와 발언 프롬프트 결합
   */
  combinePrompts(
    systemPrompt: string,
    instructionPrompt: string,
  ): { system: string; user: string } {
    return {
      system: systemPrompt,
      user: instructionPrompt,
    };
  }

  /**
   * 에이전트의 모든 프롬프트 조회
   */
  async getPromptsByAgentId(agentId: number): Promise<AgentPrompt[]> {
    return this.agentPromptRepository.findByAgentId(agentId);
  }

  /**
   * 프롬프트 생성
   */
  async createPrompt(
    agentId: number,
    systemPrompt: string,
    instructionTemplate: string,
    version?: number,
    description?: string,
  ): Promise<AgentPrompt> {
    const agent = await this.agentRepository.findById(agentId);
    if (!agent) {
      throw new NotFoundException(`에이전트를 찾을 수 없습니다: ${agentId}`);
    }

    const prompt = new AgentPrompt();
    prompt.agentId = agentId;
    prompt.systemPrompt = systemPrompt;
    prompt.instructionTemplate = instructionTemplate;
    prompt.version = version || 1;
    prompt.isActive = false;
    prompt.description = description || null;

    return this.agentPromptRepository.save(prompt);
  }

  /**
   * 프롬프트 활성화 (다른 버전 비활성화)
   */
  async activatePrompt(promptId: number): Promise<void> {
    const prompt = await this.agentPromptRepository.findById(promptId);
    if (!prompt) {
      throw new NotFoundException(`프롬프트를 찾을 수 없습니다: ${promptId}`);
    }

    // 같은 에이전트의 다른 프롬프트 비활성화
    await this.agentPromptRepository.deactivateAllByAgentId(prompt.agentId);

    // 현재 프롬프트 활성화
    await this.agentPromptRepository.update(promptId, { isActive: true });
  }
}
