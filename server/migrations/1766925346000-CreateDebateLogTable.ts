import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateDebateLogTable1766925346000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'debate_logs',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'verdictId',
            type: 'int',
          },
          {
            name: 'agentId',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'agentRole',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'turn',
            type: 'int',
          },
          {
            name: 'message',
            type: 'text',
          },
          {
            name: 'metadata',
            type: 'longtext',
            isNullable: true,
          },
          {
            name: 'tokensUsed',
            type: 'bigint',
            default: 0,
          },
          {
            name: 'promptTokens',
            type: 'bigint',
            default: 0,
          },
          {
            name: 'completionTokens',
            type: 'bigint',
            default: 0,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'debate_logs',
      new TableIndex({
        name: 'IDX_DEBATE_LOGS_VERDICT_TURN',
        columnNames: ['verdictId', 'turn'],
      }),
    );

    await queryRunner.createIndex(
      'debate_logs',
      new TableIndex({
        name: 'IDX_DEBATE_LOGS_VERDICT_CREATED',
        columnNames: ['verdictId', 'createdAt'],
      }),
    );

    await queryRunner.createForeignKey(
      'debate_logs',
      new TableForeignKey({
        columnNames: ['verdictId'],
        referencedTableName: 'verdicts',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('debate_logs');
    const foreignKey = table?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('verdictId') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('debate_logs', foreignKey);
    }
    await queryRunner.dropIndex('debate_logs', 'IDX_DEBATE_LOGS_VERDICT_CREATED');
    await queryRunner.dropIndex('debate_logs', 'IDX_DEBATE_LOGS_VERDICT_TURN');
    await queryRunner.dropTable('debate_logs');
  }
}
