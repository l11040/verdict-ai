import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * 에이전트의 specialization 필드를 한글로 통일
 * (name은 이미 한글이므로 specialization만 업데이트)
 */
export class UnifyAgentNamesToKorean1766934412627
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const specializationMap: Record<string, string> = {
      'Value Investing': '가치 투자',
      'Growth Analysis': '성장 분석',
      'Quality Analysis': '퀄리티 분석',
      'Cash Flow Analysis': '현금 흐름 분석',
      'Dividend Investing': '배당 투자',
      'Trend Following': '추세 추종',
      'Contrarian Investing': '역발상 투자',
      'Momentum Trading': '모멘텀 트레이딩',
      'Risk Management': '리스크 관리',
      'Hedge Strategy': '헤지 전략',
      'Valuation Critic': '밸류에이션 비평',
      'Balanced Analysis': '균형 분석',
      'Final Verdict': '최종 평결',
      'Technical Analysis': '기술적 분석',
    };

    for (const [englishSpec, koreanSpec] of Object.entries(
      specializationMap,
    )) {
      await queryRunner.query(
        `UPDATE agents SET specialization = ? WHERE specialization = ?`,
        [koreanSpec, englishSpec],
      );
    }

    this.logMigrationComplete();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 롤백: 한글 → 영어
    const specializationMap: Record<string, string> = {
      '가치 투자': 'Value Investing',
      '성장 분석': 'Growth Analysis',
      '퀄리티 분석': 'Quality Analysis',
      '현금 흐름 분석': 'Cash Flow Analysis',
      '배당 투자': 'Dividend Investing',
      '추세 추종': 'Trend Following',
      '역발상 투자': 'Contrarian Investing',
      '모멘텀 트레이딩': 'Momentum Trading',
      '리스크 관리': 'Risk Management',
      '헤지 전략': 'Hedge Strategy',
      '밸류에이션 비평': 'Valuation Critic',
      '균형 분석': 'Balanced Analysis',
      '최종 평결': 'Final Verdict',
      '기술적 분석': 'Technical Analysis',
    };

    for (const [koreanSpec, englishSpec] of Object.entries(
      specializationMap,
    )) {
      await queryRunner.query(
        `UPDATE agents SET specialization = ? WHERE specialization = ?`,
        [englishSpec, koreanSpec],
      );
    }
  }

  private logMigrationComplete() {
    console.log('✅ 에이전트 전문 분야가 한글로 통일되었습니다.');
  }
}
