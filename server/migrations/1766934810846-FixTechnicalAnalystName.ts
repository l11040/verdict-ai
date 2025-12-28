import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * technical_analyst의 name을 한글로 수정
 * "Technical Analyst" → "기술적 분석가"
 */
export class FixTechnicalAnalystName1766934810846
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE agents
       SET name = '기술적 분석가'
       WHERE agentId = 'technical_analyst' AND name = 'Technical Analyst'`,
    );

    console.log('✅ technical_analyst의 이름이 "기술적 분석가"로 변경되었습니다.');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE agents
       SET name = 'Technical Analyst'
       WHERE agentId = 'technical_analyst' AND name = '기술적 분석가'`,
    );

    console.log('↩️  technical_analyst의 이름이 "Technical Analyst"로 복구되었습니다.');
  }
}
