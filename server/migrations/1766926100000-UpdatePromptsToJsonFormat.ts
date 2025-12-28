import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatePromptsToJsonFormat1766926100000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 모든 에이전트 프롬프트를 JSON 응답 형식으로 업데이트
    const jsonSystemPromptSuffix = `

## 응답 형식 (필수)
반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트는 포함하지 마세요.

\`\`\`json
{
  "decision": "BUY" | "SELL" | "HOLD",
  "confidence": 0-100,
  "summary": "한 줄 요약 (50자 이내)",
  "reasoning": "상세 분석 내용"
}
\`\`\``;

    // 모든 활성화된 프롬프트의 systemPrompt에 JSON 형식 지시 추가
    await queryRunner.query(`
      UPDATE agent_prompts
      SET systemPrompt = CONCAT(systemPrompt, '${jsonSystemPromptSuffix.replace(/'/g, "''")}')
      WHERE isActive = true
      AND systemPrompt NOT LIKE '%응답 형식 (필수)%'
    `);

    // instructionTemplate 업데이트 - JSON 응답 요청 추가
    await queryRunner.query(`
      UPDATE agent_prompts
      SET instructionTemplate = CONCAT(instructionTemplate, '

위 데이터를 분석하고, 반드시 JSON 형식으로 응답하세요.')
      WHERE isActive = true
      AND instructionTemplate NOT LIKE '%JSON 형식으로 응답%'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 롤백: JSON 형식 지시 제거 (완전한 롤백은 어려움)
    console.log('Manual rollback required for prompt changes');
  }
}
