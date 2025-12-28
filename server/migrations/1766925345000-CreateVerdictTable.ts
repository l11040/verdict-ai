import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateVerdictTable1766925345000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'verdicts',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'symbol',
            type: 'varchar',
            length: '20',
          },
          {
            name: 'userId',
            type: 'int',
          },
          {
            name: 'decision',
            type: 'enum',
            enum: ['BUY', 'SELL', 'HOLD'],
          },
          {
            name: 'targetPrice',
            type: 'decimal',
            precision: 15,
            scale: 4,
            isNullable: true,
          },
          {
            name: 'confidence',
            type: 'int',
            default: 0,
          },
          {
            name: 'reasoning',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'factSheet',
            type: 'longtext',
            isNullable: true,
          },
          {
            name: 'totalTokens',
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
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'verdicts',
      new TableIndex({
        name: 'IDX_VERDICTS_SYMBOL_USER',
        columnNames: ['symbol', 'userId'],
      }),
    );

    await queryRunner.createIndex(
      'verdicts',
      new TableIndex({
        name: 'IDX_VERDICTS_USER_CREATED',
        columnNames: ['userId', 'createdAt'],
      }),
    );

    await queryRunner.createForeignKey(
      'verdicts',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('verdicts');
    const foreignKey = table?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('userId') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('verdicts', foreignKey);
    }
    await queryRunner.dropIndex('verdicts', 'IDX_VERDICTS_USER_CREATED');
    await queryRunner.dropIndex('verdicts', 'IDX_VERDICTS_SYMBOL_USER');
    await queryRunner.dropTable('verdicts');
  }
}
