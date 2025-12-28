import { MigrationInterface, QueryRunner } from 'typeorm';

export class ImproveDebateInteraction1766933498863
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 모든 에이전트의 instruction template을 더욱 대화형으로 개선
    const agents = await queryRunner.query(
      `SELECT id, agentId, name FROM agents`,
    );

    for (const agent of agents) {
      // 토론 상호작용을 강화한 instruction template
      const improvedTemplate = `## 분석 대상: {{symbol}}

### Master Fact Sheet:
{{factSheet}}

### 이전 토론 내용:
{{previousDebates}}

---

**현재 {{currentTurn}}번째 턴입니다.**

### 🎯 당신의 임무:

1. **이전 의견 분석**: 다른 에이전트들이 어떤 근거로 어떤 결론을 내렸는지 파악하세요
2. **반대 의견 찾기**: 동의하지 않는 부분이 있다면 구체적으로 반박하세요
3. **새로운 관점 제시**: 다른 에이전트들이 놓친 지표나 리스크를 지적하세요
4. **의견 변경 가능**: 설득력 있는 논거를 들었다면 당신의 의견을 바꿀 수 있습니다

### ⚠️ 금지사항:

- ❌ 이전 턴과 같은 말 반복
- ❌ 다른 에이전트 무시하고 혼자 분석
- ❌ 막연한 동의 ("저도 그렇게 생각합니다")
- ❌ 같은 지표만 계속 언급

### ✅ 좋은 발언 예시:

"가치투자자님은 낮은 PER을 강조하셨지만, 제가 볼 때 이 기업의 성장률이 둔화되고 있어 PER만으로 저평가라고 보기 어렵습니다. 특히 [구체적 지표]를 보면..."

"기술적분석가님의 RSI 지적에 동의합니다. 하지만 거래량을 보면 [다른 해석], 따라서 저는 [다른 결론]입니다."

"1턴에서는 HOLD였지만, 현금흐름전문가님이 지적한 FCF 감소는 심각한 문제입니다. 의견을 SELL로 변경합니다."

### 📝 응답 형식 (반드시 JSON):

\`\`\`json
{
  "decision": "BUY" | "SELL" | "HOLD",
  "confidence": 숫자 (0-100),
  "summary": "핵심 의견 1-2문장 (반박/동의 포함)",
  "reasoning": "상세 분석 (반드시 다른 에이전트 의견에 대한 반응 포함)"
}
\`\`\``;

      // 활성화된 프롬프트 업데이트
      await queryRunner.query(
        `UPDATE agent_prompts
         SET instructionTemplate = ?
         WHERE agentId = ? AND isActive = 1`,
        [improvedTemplate, agent.id],
      );
    }

    console.log('✅ 토론 상호작용 강화 완료: 반박/의견 변경 강조');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log(
      'Rollback: 이전 instruction template으로 복구하려면 이전 마이그레이션을 참고하세요.',
    );
  }
}
