import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateStockTable1737900000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'stocks',
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
            name: 'date',
            type: 'date',
          },
          {
            name: 'open',
            type: 'decimal',
            precision: 15,
            scale: 4,
          },
          {
            name: 'high',
            type: 'decimal',
            precision: 15,
            scale: 4,
          },
          {
            name: 'low',
            type: 'decimal',
            precision: 15,
            scale: 4,
          },
          {
            name: 'close',
            type: 'decimal',
            precision: 15,
            scale: 4,
          },
          {
            name: 'volume',
            type: 'bigint',
          },
          {
            name: 'adjustedClose',
            type: 'decimal',
            precision: 15,
            scale: 4,
          },
          {
            name: 'dividendAmount',
            type: 'decimal',
            precision: 15,
            scale: 4,
            isNullable: true,
          },
          {
            name: 'splitCoefficient',
            type: 'decimal',
            precision: 15,
            scale: 4,
            isNullable: true,
            default: 1.0,
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

    // 인덱스 생성
    await queryRunner.createIndex(
      'stocks',
      new TableIndex({
        name: 'IDX_STOCKS_SYMBOL',
        columnNames: ['symbol'],
      }),
    );

    await queryRunner.createIndex(
      'stocks',
      new TableIndex({
        name: 'IDX_STOCKS_DATE',
        columnNames: ['date'],
      }),
    );

    // 복합 유니크 인덱스 (MySQL/MariaDB는 unique constraint 대신 unique index 사용)
    await queryRunner.createIndex(
      'stocks',
      new TableIndex({
        name: 'UQ_STOCKS_SYMBOL_DATE',
        columnNames: ['symbol', 'date'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('stocks', 'UQ_STOCKS_SYMBOL_DATE');
    await queryRunner.dropIndex('stocks', 'IDX_STOCKS_DATE');
    await queryRunner.dropIndex('stocks', 'IDX_STOCKS_SYMBOL');
    await queryRunner.dropTable('stocks');
  }
}
