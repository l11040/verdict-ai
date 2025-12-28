import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  Res,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { DebateEngineService } from './services/debate-engine.service';
import { AgentService } from './services/agent.service';
import { AgentPromptService } from './services/agent-prompt.service';
import { StartDebateDto } from './dto/start-debate.dto';
import { VerdictResponseDto } from './dto/verdict-response.dto';
import { TokenUsageResponseDto } from './dto/token-usage-response.dto';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { AgentResponseDto } from './dto/agent-response.dto';
import { CreateAgentPromptDto } from './dto/create-agent-prompt.dto';
import { UpdateAgentPromptDto } from './dto/update-agent-prompt.dto';
import { AgentPromptResponseDto } from './dto/agent-prompt-response.dto';

@ApiTags('debate')
@Controller('debate')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DebateController {
  constructor(
    private readonly debateEngine: DebateEngineService,
    private readonly agentService: AgentService,
    private readonly agentPromptService: AgentPromptService,
  ) {}

  // ============================================
  // 에이전트 관리 엔드포인트 (먼저 정의해야 :verdictId와 충돌 방지)
  // ============================================

  @Get('agents')
  @ApiOperation({ summary: '모든 에이전트 조회' })
  @ApiResponse({ status: 200, type: [AgentResponseDto] })
  async getAgents(): Promise<AgentResponseDto[]> {
    const agents = await this.agentService.getAllAgents();
    return agents.map((agent) => this.mapAgentToDto(agent));
  }

  @Post('agents')
  @ApiOperation({ summary: '새 에이전트 생성' })
  @ApiResponse({ status: 201, type: AgentResponseDto })
  async createAgent(@Body() dto: CreateAgentDto): Promise<AgentResponseDto> {
    const agent = await this.agentService.createAgent(dto);
    return this.mapAgentToDto(agent);
  }

  @Get('agents/:agentId')
  @ApiOperation({ summary: '특정 에이전트 조회' })
  @ApiParam({ name: 'agentId', type: String })
  @ApiResponse({ status: 200, type: AgentResponseDto })
  async getAgent(@Param('agentId') agentId: string): Promise<AgentResponseDto> {
    const agent = await this.agentService.getAgentByAgentId(agentId);
    return this.mapAgentToDto(agent);
  }

  @Put('agents/:id')
  @ApiOperation({ summary: '에이전트 정보 수정' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: AgentResponseDto })
  async updateAgent(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAgentDto,
  ): Promise<AgentResponseDto> {
    const agent = await this.agentService.updateAgent(id, dto);
    return this.mapAgentToDto(agent);
  }

  @Delete('agents/:id')
  @ApiOperation({ summary: '에이전트 삭제 (비활성화)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200 })
  async deleteAgent(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.agentService.deleteAgent(id);
  }

  @Post('agents/:id/activate')
  @ApiOperation({ summary: '에이전트 활성화' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200 })
  async activateAgent(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.agentService.activateAgent(id);
  }

  @Post('agents/:id/deactivate')
  @ApiOperation({ summary: '에이전트 비활성화' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200 })
  async deactivateAgent(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    await this.agentService.deactivateAgent(id);
  }

  // ============================================
  // 프롬프트 관리 엔드포인트
  // ============================================

  @Get('agents/:agentId/prompts')
  @ApiOperation({ summary: '에이전트의 모든 프롬프트 조회' })
  @ApiParam({ name: 'agentId', type: Number })
  @ApiResponse({ status: 200, type: [AgentPromptResponseDto] })
  async getAgentPrompts(
    @Param('agentId', ParseIntPipe) agentId: number,
  ): Promise<AgentPromptResponseDto[]> {
    const prompts = await this.agentPromptService.getPromptsByAgentId(agentId);
    return prompts.map((prompt) => this.mapPromptToDto(prompt));
  }

  @Get('agents/:agentId/prompt')
  @ApiOperation({ summary: '에이전트의 활성화된 프롬프트 조회' })
  @ApiParam({ name: 'agentId', type: Number })
  @ApiResponse({ status: 200, type: AgentPromptResponseDto })
  async getActivePrompt(
    @Param('agentId', ParseIntPipe) agentId: number,
  ): Promise<AgentPromptResponseDto> {
    const prompt = await this.agentPromptService.getActivePrompt(agentId);
    if (!prompt) {
      throw new Error('활성화된 프롬프트가 없습니다.');
    }
    return this.mapPromptToDto(prompt);
  }

  @Post('agents/:agentId/prompts')
  @ApiOperation({ summary: '새 프롬프트 버전 생성' })
  @ApiParam({ name: 'agentId', type: Number })
  @ApiResponse({ status: 201, type: AgentPromptResponseDto })
  async createPrompt(
    @Param('agentId', ParseIntPipe) agentId: number,
    @Body() dto: CreateAgentPromptDto,
  ): Promise<AgentPromptResponseDto> {
    const prompt = await this.agentPromptService.createPrompt(
      agentId,
      dto.systemPrompt,
      dto.instructionTemplate,
      dto.version,
      dto.description,
    );
    return this.mapPromptToDto(prompt);
  }

  @Put('agents/:agentId/prompts/:promptId')
  @ApiOperation({ summary: '프롬프트 수정' })
  @ApiParam({ name: 'agentId', type: Number })
  @ApiParam({ name: 'promptId', type: Number })
  @ApiResponse({ status: 200, type: AgentPromptResponseDto })
  async updatePrompt(
    @Param('promptId', ParseIntPipe) promptId: number,
    @Body() dto: UpdateAgentPromptDto,
  ): Promise<AgentPromptResponseDto> {
    // TODO: UpdateAgentPromptService 메서드 추가 필요
    throw new Error('Not implemented');
  }

  @Post('agents/:agentId/prompts/:promptId/activate')
  @ApiOperation({ summary: '프롬프트 버전 활성화' })
  @ApiParam({ name: 'agentId', type: Number })
  @ApiParam({ name: 'promptId', type: Number })
  @ApiResponse({ status: 200 })
  async activatePrompt(
    @Param('promptId', ParseIntPipe) promptId: number,
  ): Promise<void> {
    await this.agentPromptService.activatePrompt(promptId);
  }

  // ============================================
  // 토론 시작 엔드포인트
  // ============================================

  @Post('start')
  @ApiOperation({ summary: '토론 시작 (비동기 - 즉시 verdictId 반환)' })
  @ApiResponse({ status: 201, description: '토론이 시작되었습니다. SSE로 실시간 진행 상황을 확인하세요.' })
  async startDebate(
    @Body() dto: StartDebateDto,
    @Req() req: any,
  ): Promise<{ verdictId: number; selectedAgents: any[]; message: string }> {
    const userId = req.user.id;
    const { verdictId, selectedAgents } = await this.debateEngine.startDebate(
      dto.symbol,
      userId,
    );
    return {
      verdictId,
      selectedAgents,
      message: '토론이 시작되었습니다. /debate/{verdictId}/stream으로 실시간 진행 상황을 확인하세요.',
    };
  }

  // ============================================
  // 토론 결과 조회 엔드포인트 (파라미터 라우트는 마지막에)
  // ============================================

  @Get(':verdictId')
  @ApiOperation({ summary: '토론 결과 조회' })
  @ApiParam({ name: 'verdictId', type: Number })
  @ApiResponse({ status: 200, type: VerdictResponseDto })
  async getVerdict(
    @Param('verdictId', ParseIntPipe) verdictId: number,
  ): Promise<VerdictResponseDto> {
    const verdict = await this.debateEngine.getVerdict(verdictId);
    return this.mapVerdictToDto(verdict);
  }

  @Get(':verdictId/logs')
  @ApiOperation({ summary: '토론 로그 조회' })
  @ApiParam({ name: 'verdictId', type: Number })
  @ApiResponse({ status: 200 })
  async getDebateLogs(@Param('verdictId', ParseIntPipe) verdictId: number) {
    return this.debateEngine.getDebateLogs(verdictId);
  }

  @Get(':verdictId/tokens')
  @ApiOperation({ summary: '토큰 사용량 조회' })
  @ApiParam({ name: 'verdictId', type: Number })
  @ApiResponse({ status: 200, type: TokenUsageResponseDto })
  async getTokenUsage(
    @Param('verdictId', ParseIntPipe) verdictId: number,
  ): Promise<TokenUsageResponseDto> {
    const verdict = await this.debateEngine.getVerdict(verdictId);
    return {
      totalTokens: verdict.totalTokens,
      promptTokens: verdict.promptTokens,
      completionTokens: verdict.completionTokens,
    };
  }

  @Public()
  @Get(':verdictId/stream')
  @ApiOperation({ summary: '토론 실시간 스트리밍 (SSE)' })
  @ApiParam({ name: 'verdictId', type: Number })
  async streamDebate(
    @Param('verdictId', ParseIntPipe) verdictId: number,
    @Query('token') token: string,
    @Res() res: Response,
  ): Promise<void> {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('X-Accel-Buffering', 'no'); // nginx 버퍼링 비활성화

    const eventService = this.debateEngine.getEventService();

    // 이미 저장된 로그 먼저 전송
    const existingLogs = await this.debateEngine.getDebateLogs(verdictId);
    for (const log of existingLogs) {
      res.write(`event: log\ndata: ${JSON.stringify(log)}\n\n`);
    }

    // 실시간 로그 구독
    const unsubLog = eventService.onLog(verdictId, (log) => {
      res.write(`event: log\ndata: ${JSON.stringify(log)}\n\n`);
    });

    // 완료 이벤트 구독
    const unsubComplete = eventService.onComplete(verdictId, (result) => {
      res.write(`event: complete\ndata: ${JSON.stringify(result)}\n\n`);
      cleanup();
    });

    // 에러 이벤트 구독
    const unsubError = eventService.onError(verdictId, (error) => {
      res.write(`event: error\ndata: ${JSON.stringify(error)}\n\n`);
      cleanup();
    });

    // 클린업 함수
    const cleanup = () => {
      unsubLog();
      unsubComplete();
      unsubError();
      res.end();
    };

    // 클라이언트 연결 종료 시 클린업
    res.on('close', () => {
      cleanup();
    });

    // 타임아웃 설정 (5분)
    setTimeout(() => {
      res.write(`event: timeout\ndata: {"message": "Connection timeout"}\n\n`);
      cleanup();
    }, 5 * 60 * 1000);
  }

  // ============================================
  // Helper methods
  // ============================================

  private mapVerdictToDto(verdict: any): VerdictResponseDto {
    return {
      id: verdict.id,
      symbol: verdict.symbol,
      userId: verdict.userId,
      decision: verdict.decision,
      targetPrice: verdict.targetPrice,
      confidence: verdict.confidence,
      reasoning: verdict.reasoning,
      factSheet: verdict.factSheet,
      totalTokens: verdict.totalTokens,
      promptTokens: verdict.promptTokens,
      completionTokens: verdict.completionTokens,
      createdAt: verdict.createdAt,
      updatedAt: verdict.updatedAt,
    };
  }

  private mapAgentToDto(agent: any): AgentResponseDto {
    return {
      id: agent.id,
      agentId: agent.agentId,
      name: agent.name,
      description: agent.description,
      specialization: agent.specialization,
      expertiseCategories: agent.expertiseCategories,
      isActive: agent.isActive,
      priority: agent.priority,
      model: agent.model,
      temperature: agent.temperature,
      maxTokens: agent.maxTokens,
      metadata: agent.metadata,
      createdAt: agent.createdAt,
      updatedAt: agent.updatedAt,
    };
  }

  private mapPromptToDto(prompt: any): AgentPromptResponseDto {
    return {
      id: prompt.id,
      agentId: prompt.agentId,
      systemPrompt: prompt.systemPrompt,
      instructionTemplate: prompt.instructionTemplate,
      version: prompt.version,
      isActive: prompt.isActive,
      description: prompt.description,
      createdAt: prompt.createdAt,
      updatedAt: prompt.updatedAt,
    };
  }
}
