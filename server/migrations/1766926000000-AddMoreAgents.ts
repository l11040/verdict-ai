import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMoreAgents1766926000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 기존에 없는 에이전트만 추가
    const newAgents = [
      {
        agentId: 'quality_analyst',
        name: '퀄리티 분석가',
        description:
          '기업의 질적 우수성을 평가하는 전문가. ROE, 영업이익률 등 자본 효율성 지표를 통해 기업의 경쟁 우위(Economic Moat)와 수익성의 지속 가능성을 검증합니다.',
        specialization: 'Quality Analysis',
        expertiseCategories: JSON.stringify(['efficiency']),
        isActive: true,
        priority: 3,
        model: null,
        temperature: 0.7,
        maxTokens: 1000,
        metadata: null,
      },
      {
        agentId: 'cashflow_expert',
        name: '현금흐름 전문가',
        description:
          '현금이 왕이라는 철학을 가진 전문가. 영업활동 현금흐름과 잉여현금흐름(FCF)의 질을 따지며, 유동비율과 FCF 상태를 통해 기업의 재무 건전성을 평가합니다.',
        specialization: 'Cash Flow Analysis',
        expertiseCategories: JSON.stringify(['safety']),
        isActive: true,
        priority: 4,
        model: null,
        temperature: 0.7,
        maxTokens: 1000,
        metadata: null,
      },
      {
        agentId: 'trend_follower',
        name: '트렌드 팔로워',
        description:
          '추세 추종 전략의 신봉자. 200일 이동평균선 대비 현재가 위치를 분석하여 상승 추세와 하락 추세를 판단하고, 추세의 지속성을 예측합니다.',
        specialization: 'Trend Following',
        expertiseCategories: JSON.stringify(['momentum']),
        isActive: true,
        priority: 6,
        model: null,
        temperature: 0.7,
        maxTokens: 1000,
        metadata: null,
      },
      {
        agentId: 'contrarian_investor',
        name: '역발상 투자자',
        description:
          '남들이 공포에 떨 때 탐욕을 부리는 역발상 투자 전문가. RSI 과매도/과매수 구간을 분석하여 시장의 과잉 반응을 포착하고 반대 포지션을 제안합니다.',
        specialization: 'Contrarian Investing',
        expertiseCategories: JSON.stringify(['momentum']),
        isActive: true,
        priority: 7,
        model: null,
        temperature: 0.8,
        maxTokens: 1000,
        metadata: null,
      },
      {
        agentId: 'momentum_trader',
        name: '모멘텀 트레이더',
        description:
          '가격과 거래량의 모멘텀을 분석하는 전문가. RSI와 이동평균선 이격도를 종합적으로 분석하여 단기 매매 타이밍을 제시합니다.',
        specialization: 'Momentum Trading',
        expertiseCategories: JSON.stringify(['momentum']),
        isActive: true,
        priority: 8,
        model: null,
        temperature: 0.7,
        maxTokens: 1000,
        metadata: null,
      },
      {
        agentId: 'hedge_strategist',
        name: '헤지 전략가',
        description:
          '시장 하락에 대비하는 방어적 투자 전문가. 베타(Beta) 값을 분석하여 시장 민감도를 평가하고, 포트폴리오 분산 투자와 헤지 전략을 권고합니다.',
        specialization: 'Hedge Strategy',
        expertiseCategories: JSON.stringify(['context']),
        isActive: true,
        priority: 10,
        model: null,
        temperature: 0.6,
        maxTokens: 1000,
        metadata: null,
      },
      {
        agentId: 'valuation_critic',
        name: '밸류에이션 비평가',
        description:
          '고평가 종목을 찾아내는 비판적 분석가. 높은 PER, PBR, PEG를 경고하고, 그레이엄 숫자 대비 현재가가 과도하게 높은 종목의 버블 가능성을 지적합니다.',
        specialization: 'Valuation Critic',
        expertiseCategories: JSON.stringify(['valuation']),
        isActive: true,
        priority: 11,
        model: null,
        temperature: 0.8,
        maxTokens: 1000,
        metadata: null,
      },
      {
        agentId: 'balanced_analyst',
        name: '균형 잡힌 분석가',
        description:
          '모든 지표를 종합적으로 고려하는 균형 잡힌 분석가. 밸류에이션, 성장성, 안전성, 효율성을 함께 분석하여 편향 없는 종합 의견을 제시합니다.',
        specialization: 'Balanced Analysis',
        expertiseCategories: JSON.stringify([
          'valuation',
          'growth',
          'safety',
          'efficiency',
        ]),
        isActive: true,
        priority: 12,
        model: null,
        temperature: 0.7,
        maxTokens: 1000,
        metadata: null,
      },
      {
        agentId: 'final_verdict',
        name: '최종 심판관',
        description:
          '토론을 마무리하는 최종 심판관. 모든 에이전트의 의견을 종합하여 BUY/SELL/HOLD 최종 결정을 내리고, 목표가와 신뢰도를 제시합니다.',
        specialization: 'Final Verdict',
        expertiseCategories: JSON.stringify([
          'valuation',
          'growth',
          'safety',
          'efficiency',
          'momentum',
          'dividend',
          'context',
        ]),
        isActive: true,
        priority: 99,
        model: null,
        temperature: 0.5,
        maxTokens: 1500,
        metadata: JSON.stringify({ role: 'moderator' }),
      },
    ];

    for (const agent of newAgents) {
      // 중복 체크 후 삽입
      const existing = await queryRunner.query(
        `SELECT id FROM agents WHERE agentId = ?`,
        [agent.agentId],
      );

      if (existing.length === 0) {
        await queryRunner.query(
          `INSERT INTO agents (agentId, name, description, specialization, expertiseCategories, isActive, priority, model, temperature, maxTokens, metadata, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            agent.agentId,
            agent.name,
            agent.description,
            agent.specialization,
            agent.expertiseCategories,
            agent.isActive,
            agent.priority,
            agent.model,
            agent.temperature,
            agent.maxTokens,
            agent.metadata,
          ],
        );
      }
    }

    // 기존 에이전트 이름 및 설명 업데이트 (한국어로)
    await queryRunner.query(
      `UPDATE agents SET name = ?, description = ? WHERE agentId = ?`,
      [
        '가치 투자자',
        '벤저민 그레이엄과 워렌 버핏의 투자 철학을 따르는 가치 투자 전문가. PER, PBR 등 절대적 저평가 지표와 안전 마진을 중시하며, 그레이엄 숫자를 활용해 내재 가치를 산정합니다.',
        'value_investor',
      ],
    );

    await queryRunner.query(
      `UPDATE agents SET name = ?, description = ? WHERE agentId = ?`,
      [
        '성장주 분석가',
        '피터 린치 스타일의 성장주 분석 전문가. 매출 성장률과 분기별 이익 성장률을 기반으로 기업의 확장성을 평가하고, PEG 비율로 성장 대비 밸류에이션을 판단합니다.',
        'growth_analyst',
      ],
    );

    await queryRunner.query(
      `UPDATE agents SET name = ?, description = ? WHERE agentId = ?`,
      [
        '리스크 매니저',
        '최악의 상황을 가정하는 보수적 분석가. 부채비율, 유동비율, FCF 상태 등 재무적 파산 위험 지표를 경고하고, 투자 원금 보존을 최우선으로 합니다.',
        'risk_manager',
      ],
    );

    await queryRunner.query(
      `UPDATE agents SET name = ?, description = ? WHERE agentId = ?`,
      [
        '배당 귀족',
        '안정적인 배당 수익을 추구하는 배당 투자 전문가. 배당 수익률과 배당 성향을 분석하여 지속 가능한 배당 정책을 가진 기업을 선별합니다.',
        'dividend_specialist',
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const agentIds = [
      'quality_analyst',
      'cashflow_expert',
      'trend_follower',
      'contrarian_investor',
      'momentum_trader',
      'hedge_strategist',
      'valuation_critic',
      'balanced_analyst',
      'final_verdict',
    ];

    for (const agentId of agentIds) {
      await queryRunner.query(`DELETE FROM agents WHERE agentId = ?`, [
        agentId,
      ]);
    }
  }
}
