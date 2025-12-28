import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AgentRepository } from '../repositories/agent.repository';
import { Agent } from '../../../entities/agent.entity';
import { CreateAgentDto } from '../dto/create-agent.dto';
import { UpdateAgentDto } from '../dto/update-agent.dto';
import { MasterFactSheet } from '../../stock/dto/master-fact-sheet.interface';

@Injectable()
export class AgentService {
  private readonly logger = new Logger(AgentService.name);

  constructor(private readonly agentRepository: AgentRepository) {}

  /**
   * 모든 활성화된 에이전트 조회
   */
  async getActiveAgents(): Promise<Agent[]> {
    return this.agentRepository.findActive();
  }

  /**
   * 모든 에이전트 조회
   */
  async getAllAgents(): Promise<Agent[]> {
    return this.agentRepository.findAll();
  }

  /**
   * ID로 에이전트 조회
   */
  async getAgentById(id: number): Promise<Agent> {
    const agent = await this.agentRepository.findById(id);
    if (!agent) {
      throw new NotFoundException(`에이전트를 찾을 수 없습니다: ${id}`);
    }
    return agent;
  }

  /**
   * agentId로 에이전트 조회
   */
  async getAgentByAgentId(agentId: string): Promise<Agent> {
    const agent = await this.agentRepository.findByAgentId(agentId);
    if (!agent) {
      throw new NotFoundException(`에이전트를 찾을 수 없습니다: ${agentId}`);
    }
    return agent;
  }

  /**
   * 에이전트 생성
   */
  async createAgent(dto: CreateAgentDto): Promise<Agent> {
    const agent = new Agent();
    agent.agentId = dto.agentId;
    agent.name = dto.name;
    agent.description = dto.description || null;
    agent.specialization = dto.specialization;
    agent.expertiseCategories = dto.expertiseCategories || null;
    agent.isActive = dto.isActive !== undefined ? dto.isActive : true;
    agent.priority = dto.priority || 0;
    agent.model = dto.model || null;
    agent.temperature = dto.temperature || 0.7;
    agent.maxTokens = dto.maxTokens || 1000;
    agent.metadata = dto.metadata || null;

    return this.agentRepository.save(agent);
  }

  /**
   * 에이전트 수정
   */
  async updateAgent(id: number, dto: UpdateAgentDto): Promise<Agent> {
    const agent = await this.getAgentById(id);

    if (dto.name !== undefined) agent.name = dto.name;
    if (dto.description !== undefined) agent.description = dto.description;
    if (dto.specialization !== undefined)
      agent.specialization = dto.specialization;
    if (dto.expertiseCategories !== undefined)
      agent.expertiseCategories = dto.expertiseCategories;
    if (dto.isActive !== undefined) agent.isActive = dto.isActive;
    if (dto.priority !== undefined) agent.priority = dto.priority;
    if (dto.model !== undefined) agent.model = dto.model;
    if (dto.temperature !== undefined) agent.temperature = dto.temperature;
    if (dto.maxTokens !== undefined) agent.maxTokens = dto.maxTokens;
    if (dto.metadata !== undefined) agent.metadata = dto.metadata;

    return this.agentRepository.save(agent);
  }

  /**
   * 에이전트 삭제 (비활성화)
   */
  async deleteAgent(id: number): Promise<void> {
    await this.agentRepository.update(id, { isActive: false });
  }

  /**
   * 에이전트 활성화
   */
  async activateAgent(id: number): Promise<void> {
    await this.agentRepository.update(id, { isActive: true });
  }

  /**
   * 에이전트 비활성화
   */
  async deactivateAgent(id: number): Promise<void> {
    await this.agentRepository.update(id, { isActive: false });
  }

  /**
   * MasterFactSheet 기반 에이전트 스코어링
   */
  scoreAgent(agent: Agent, factSheet: MasterFactSheet): number {
    if (!agent.expertiseCategories || agent.expertiseCategories.length === 0) {
      return 0;
    }

    let score = 0;
    const categories = agent.expertiseCategories;

    // 각 카테고리별 데이터 유무 및 품질 평가
    if (categories.includes('valuation')) {
      const valuation = factSheet.valuation;
      if (valuation.trailingPE || valuation.forwardPE || valuation.priceToBook) {
        score += 10;
      }
      if (valuation.intrinsic_value) {
        score += 5;
      }
    }

    if (categories.includes('growth')) {
      const growth = factSheet.growth;
      if (growth.revenueGrowth || growth.earningsQuarterlyGrowth) {
        score += 10;
      }
    }

    if (categories.includes('safety')) {
      const safety = factSheet.safety;
      if (safety.debtToEquity || safety.currentRatio || safety.fcf_status) {
        score += 10;
      }
    }

    if (categories.includes('efficiency')) {
      const efficiency = factSheet.efficiency;
      if (efficiency.returnOnEquity || efficiency.operatingMargins) {
        score += 10;
      }
    }

    if (categories.includes('momentum')) {
      const momentum = factSheet.momentum;
      if (momentum.rsi || momentum.dist_from_200ma) {
        score += 10;
      }
    }

    if (categories.includes('dividend')) {
      const dividend = factSheet.dividend;
      if (dividend.dividendYield || dividend.payoutRatio) {
        score += 10;
      }
    }

    return score;
  }
}
