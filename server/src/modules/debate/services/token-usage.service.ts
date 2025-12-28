import { Injectable, Logger } from '@nestjs/common';
import { TokenUsage, TokenUsageMetadata } from '../types/token-usage.interface';

@Injectable()
export class TokenUsageService {
  private readonly logger = new Logger(TokenUsageService.name);

  /**
   * LangChain/LangGraph 응답에서 토큰 사용량 추출
   */
  extractTokenUsage(response: any): TokenUsage {
    try {
      // 1. response.usage_metadata 직접 확인 (LangChain 표준)
      if (response.usage_metadata) {
        return {
          totalTokens: response.usage_metadata.total_tokens || 0,
          promptTokens: response.usage_metadata.input_tokens || 0,
          completionTokens: response.usage_metadata.output_tokens || 0,
        };
      }

      // 2. response.response_metadata.tokenUsage 확인 (OpenAI wrapper)
      if (response.response_metadata?.tokenUsage) {
        return {
          totalTokens: response.response_metadata.tokenUsage.totalTokens || 0,
          promptTokens: response.response_metadata.tokenUsage.promptTokens || 0,
          completionTokens: response.response_metadata.tokenUsage.completionTokens || 0,
        };
      }

      // 3. response.response_metadata.usage 확인 (OpenAI 직접)
      if (response.response_metadata?.usage) {
        return {
          totalTokens: response.response_metadata.usage.total_tokens || 0,
          promptTokens: response.response_metadata.usage.prompt_tokens || 0,
          completionTokens: response.response_metadata.usage.completion_tokens || 0,
        };
      }

      // 기본값 반환
      this.logger.warn('토큰 사용량 필드를 찾을 수 없습니다');
      return {
        totalTokens: 0,
        promptTokens: 0,
        completionTokens: 0,
      };
    } catch (error) {
      this.logger.warn(`토큰 사용량 추출 실패: ${error.message}`);
      return {
        totalTokens: 0,
        promptTokens: 0,
        completionTokens: 0,
      };
    }
  }

  /**
   * 토큰 사용량 합계 계산
   */
  sumTokenUsage(usages: TokenUsage[]): TokenUsage {
    return usages.reduce(
      (acc, usage) => ({
        totalTokens: acc.totalTokens + usage.totalTokens,
        promptTokens: acc.promptTokens + usage.promptTokens,
        completionTokens: acc.completionTokens + usage.completionTokens,
      }),
      { totalTokens: 0, promptTokens: 0, completionTokens: 0 },
    );
  }
}
