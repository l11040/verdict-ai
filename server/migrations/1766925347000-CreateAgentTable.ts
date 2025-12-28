import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateAgentTable1766925347000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'agents',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'agentId',
            type: 'varchar',
            length: '100',
            isUnique: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'specialization',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'expertiseCategories',
            type: 'longtext',
            isNullable: true,
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
          },
          {
            name: 'priority',
            type: 'int',
            default: 0,
          },
          {
            name: 'model',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'temperature',
            type: 'decimal',
            precision: 3,
            scale: 2,
            default: 0.7,
          },
          {
            name: 'maxTokens',
            type: 'int',
            default: 1000,
          },
          {
            name: 'metadata',
            type: 'longtext',
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

    await queryRunner.createIndex(
      'agents',
      new TableIndex({
        name: 'IDX_AGENTS_ACTIVE_PRIORITY',
        columnNames: ['isActive', 'priority'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('agents', 'IDX_AGENTS_ACTIVE_PRIORITY');
    await queryRunner.dropTable('agents');
  }
}
