import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateAgentPromptTable1766925348000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'agent_prompts',
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
            type: 'int',
          },
          {
            name: 'systemPrompt',
            type: 'text',
          },
          {
            name: 'instructionTemplate',
            type: 'text',
          },
          {
            name: 'version',
            type: 'int',
            default: 1,
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: false,
          },
          {
            name: 'description',
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

    await queryRunner.createIndex(
      'agent_prompts',
      new TableIndex({
        name: 'IDX_AGENT_PROMPTS_AGENT_ACTIVE',
        columnNames: ['agentId', 'isActive'],
      }),
    );

    await queryRunner.createIndex(
      'agent_prompts',
      new TableIndex({
        name: 'IDX_AGENT_PROMPTS_AGENT_VERSION',
        columnNames: ['agentId', 'version'],
      }),
    );

    await queryRunner.createForeignKey(
      'agent_prompts',
      new TableForeignKey({
        columnNames: ['agentId'],
        referencedTableName: 'agents',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('agent_prompts');
    const foreignKey = table?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('agentId') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('agent_prompts', foreignKey);
    }
    await queryRunner.dropIndex('agent_prompts', 'IDX_AGENT_PROMPTS_AGENT_VERSION');
    await queryRunner.dropIndex('agent_prompts', 'IDX_AGENT_PROMPTS_AGENT_ACTIVE');
    await queryRunner.dropTable('agent_prompts');
  }
}
