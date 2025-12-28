import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Verdict } from '../../entities/verdict.entity';
import { DebateLog } from '../../entities/debate-log.entity';
import { Agent } from '../../entities/agent.entity';
import { AgentPrompt } from '../../entities/agent-prompt.entity';
import { DebateController } from './debate.controller';
import { DebateEngineService } from './services/debate-engine.service';
import { AgentService } from './services/agent.service';
import { AgentSelectorService } from './services/agent-selector.service';
import { AgentPromptService } from './services/agent-prompt.service';
import { TokenUsageService } from './services/token-usage.service';
import { DebateEventService } from './services/debate-event.service';
import { VerdictRepository } from './repositories/verdict.repository';
import { DebateLogRepository } from './repositories/debate-log.repository';
import { AgentRepository } from './repositories/agent.repository';
import { AgentPromptRepository } from './repositories/agent-prompt.repository';
import { StockModule } from '../stock/stock.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Verdict, DebateLog, Agent, AgentPrompt]),
    ConfigModule,
    StockModule,
  ],
  controllers: [DebateController],
  providers: [
    DebateEngineService,
    AgentService,
    AgentSelectorService,
    AgentPromptService,
    TokenUsageService,
    DebateEventService,
    VerdictRepository,
    DebateLogRepository,
    AgentRepository,
    AgentPromptRepository,
  ],
  exports: [
    DebateEngineService,
    AgentService,
    AgentPromptService,
    VerdictRepository,
    DebateLogRepository,
  ],
})
export class DebateModule {}
