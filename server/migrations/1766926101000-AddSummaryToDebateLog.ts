import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddSummaryToDebateLog1766926101000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'debate_logs',
      new TableColumn({
        name: 'summary',
        type: 'varchar',
        length: '200',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'debate_logs',
      new TableColumn({
        name: 'decision',
        type: 'varchar',
        length: '10',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'debate_logs',
      new TableColumn({
        name: 'confidence',
        type: 'int',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('debate_logs', 'confidence');
    await queryRunner.dropColumn('debate_logs', 'decision');
    await queryRunner.dropColumn('debate_logs', 'summary');
  }
}
