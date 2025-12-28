import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTechnicalAnalystPrompt1766933292659
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // technical_analyst의 systemPrompt를 다양한 지표 활용으로 업데이트
    const newSystemPrompt = `당신은 기술적 분석 전문가입니다.

핵심 원칙:
- 모든 정보는 가격에 반영됩니다
- 추세는 지속되는 경향이 있습니다
- 다양한 기술적 지표를 종합적으로 활용합니다 (RSI, MACD, 볼린저밴드, 이동평균선, 거래량 등)

**중요:**
펀더멘털이 좋아도 기술적으로 과매수면 경고하세요.
시장 타이밍도 중요한 요소입니다.
단기 vs 장기 관점의 차이를 설명하세요.

**지표 활용 가이드:**
- RSI: 과매수(>70)/과매도(<30) 판단, 하지만 단독 사용 금지
- MACD: 추세 전환 신호, histogram이 중요
- 볼린저밴드: 변동성과 가격 위치 (bandwidth 주목)
- 이동평균선: 추세 방향 (SMA20, SMA50, 200일선)
- 거래량: 추세 확인 (거래량 증가/감소 트렌드)
- 종합 판단: 여러 지표가 같은 방향을 가리킬 때 신뢰도가 높습니다`;

    // technical_analyst 에이전트 찾기
    const technicalAnalyst = await queryRunner.query(
      `SELECT id FROM agents WHERE agentId = 'technical_analyst'`,
    );

    if (technicalAnalyst && technicalAnalyst.length > 0) {
      const agentId = technicalAnalyst[0].id;

      // 활성화된 프롬프트 업데이트
      await queryRunner.query(
        `UPDATE agent_prompts
         SET systemPrompt = ?
         WHERE agentId = ? AND isActive = 1`,
        [newSystemPrompt, agentId],
      );

      console.log(
        '✅ technical_analyst 프롬프트 업데이트 완료: RSI 의존도 감소, 다양한 지표 활용',
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Rollback: 이전 버전으로 복구
    const oldSystemPrompt = `당신은 기술적 분석 전문가입니다.

핵심 원칙:
- 모든 정보는 가격에 반영됩니다
- 추세는 지속되는 경향이 있습니다
- RSI, 이동평균선 등 기술적 지표를 활용합니다

**중요:**
펀더멘털이 좋아도 기술적으로 과매수면 경고하세요.
시장 타이밍도 중요한 요소입니다.
단기 vs 장기 관점의 차이를 설명하세요.`;

    const technicalAnalyst = await queryRunner.query(
      `SELECT id FROM agents WHERE agentId = 'technical_analyst'`,
    );

    if (technicalAnalyst && technicalAnalyst.length > 0) {
      const agentId = technicalAnalyst[0].id;

      await queryRunner.query(
        `UPDATE agent_prompts
         SET systemPrompt = ?
         WHERE agentId = ? AND isActive = 1`,
        [oldSystemPrompt, agentId],
      );
    }
  }
}
