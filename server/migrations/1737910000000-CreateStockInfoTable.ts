import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateStockInfoTable1737910000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'stock_infos',
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
            isUnique: true,
          },
          {
            name: 'longName',
            type: 'varchar',
            length: '200',
            isNullable: true,
          },
          {
            name: 'shortName',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'marketCap',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'sector',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'industry',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'currency',
            type: 'varchar',
            length: '10',
            isNullable: true,
          },
          {
            name: 'exchange',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'currentPrice',
            type: 'decimal',
            precision: 15,
            scale: 4,
            isNullable: true,
          },
          {
            name: 'previousClose',
            type: 'decimal',
            precision: 15,
            scale: 4,
            isNullable: true,
          },
          {
            name: 'dayLow',
            type: 'decimal',
            precision: 15,
            scale: 4,
            isNullable: true,
          },
          {
            name: 'dayHigh',
            type: 'decimal',
            precision: 15,
            scale: 4,
            isNullable: true,
          },
          {
            name: 'volume',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'fiftyTwoWeekLow',
            type: 'decimal',
            precision: 15,
            scale: 4,
            isNullable: true,
          },
          {
            name: 'fiftyTwoWeekHigh',
            type: 'decimal',
            precision: 15,
            scale: 4,
            isNullable: true,
          },
          {
            name: 'longBusinessSummary',
            type: 'text',
            isNullable: true,
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
      'stock_infos',
      new TableIndex({
        name: 'IDX_STOCK_INFOS_SYMBOL',
        columnNames: ['symbol'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('stock_infos', 'IDX_STOCK_INFOS_SYMBOL');
    await queryRunner.dropTable('stock_infos');
  }
}
